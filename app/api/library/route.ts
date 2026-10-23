import { NextResponse } from 'next/server';
import { AppleDocument, FilterCount, LibraryResponse, RawTopicGroup } from '@/lib/types';

const SOURCE_URL = 'https://developer.apple.com/library/archive/navigation/library.json';
const ARCHIVE_BASE_URL = 'https://developer.apple.com/library/archive/';

// In-memory cache
let cachedResponse: LibraryResponse | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache, overridable with ?refresh=true

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function cleanMalformedJson(raw: string): string {
  // Fix Apple's syntax bug: "platform": 12, followed directly by closing brace }
  return raw.replace(/"platform"\s*:\s*12\s*,\s*}/g, '"platform": 12 }');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';
  const now = Date.now();

  if (!forceRefresh && cachedResponse && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      ...cachedResponse,
      meta: {
        ...cachedResponse.meta,
        cached: true,
      },
    });
  }

  const startTime = Date.now();

  try {
    const upstreamRes = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json, text/plain, */*',
      },
      cache: 'no-store',
    });

    if (!upstreamRes.ok) {
      throw new Error(`Apple library responded with status ${upstreamRes.status}`);
    }

    const rawText = await upstreamRes.text();
    const sanitizedText = cleanMalformedJson(rawText);
    const parsed = JSON.parse(sanitizedText);

    // Build lookup maps from topics
    const resourceTypeMap: Record<number, string> = {};
    const topicMap: Record<number, string> = {};
    const rawGroups: RawTopicGroup[] = parsed.topics || [];

    for (const group of rawGroups) {
      if (group.name === 'Resource Types') {
        for (const item of group.contents) {
          if (item.key !== undefined) {
            resourceTypeMap[Number(item.key)] = decodeHtmlEntities(item.name);
          }
        }
      } else if (group.name === 'Topics' || group.name === 'Technologies') {
        for (const item of group.contents) {
          if (item.key !== undefined && item.key !== '') {
            const keyNum = Number(item.key);
            if (!Number.isNaN(keyNum)) {
              topicMap[keyNum] = decodeHtmlEntities(item.name);
            }
          }
        }
      }
    }

    const updateSizes: string[] = parsed.updateSize || [];
    const rawDocuments: (string | number)[][] = parsed.documents || [];

    const platformCounts: Record<string, number> = {};
    const resourceTypeCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};

    const documents: AppleDocument[] = rawDocuments.map((doc, idx) => {
      const name = decodeHtmlEntities(String(doc[0] ?? ''));
      const id = String(doc[1] ?? '');
      const typeId = Number(doc[2] ?? 0);
      const typeName = resourceTypeMap[typeId] || `Type ${typeId}`;
      const date = String(doc[3] ?? '');
      const updateSizeIdx = Number(doc[4] ?? 0);
      const updateSize = updateSizes[updateSizeIdx] || '';
      const topicId = Number(doc[5] ?? 0);
      const topicName = topicMap[topicId] || (topicId ? `Topic ${topicId}` : '');
      const framework = Number(doc[6] ?? 0);
      const release = Number(doc[7] ?? 0);
      const subtopicId = Number(doc[8] ?? 0);
      const subtopicName = topicMap[subtopicId] || (subtopicId ? `Subtopic ${subtopicId}` : '');
      const relUrl = String(doc[9] ?? '');
      const cleanRelUrl = relUrl.replace(/^\.\.\//, '').replace(/^\.\//, '');
      const absUrl = relUrl ? `${ARCHIVE_BASE_URL}${cleanRelUrl}` : '';
      const sortOrder = Number(doc[10] ?? 0);
      const displayDate = String(doc[11] ?? date);
      const rawPlatform = String(doc[12] ?? '').trim();
      const platformList = rawPlatform ? rawPlatform.split('|').map((p) => p.trim()) : ['Unspecified'];

      // Aggregations
      for (const p of platformList) {
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      }
      resourceTypeCounts[typeName] = (resourceTypeCounts[typeName] || 0) + 1;
      if (topicName) {
        topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
      }

      return {
        index: idx,
        name,
        id,
        typeId,
        typeName,
        date,
        updateSize,
        topicId,
        topicName,
        framework,
        release,
        subtopicId,
        subtopicName,
        url: relUrl,
        absUrl,
        sortOrder,
        displayDate,
        platform: rawPlatform || 'Unspecified',
        platformList,
        raw: doc,
      };
    });

    const platforms: FilterCount[] = Object.entries(platformCounts)
      .map(([name, count]) => ({ name, count, key: name }))
      .sort((a, b) => b.count - a.count);

    const resourceTypes: FilterCount[] = Object.entries(resourceTypeCounts)
      .map(([name, count]) => ({ name, count, key: name }))
      .sort((a, b) => b.count - a.count);

    const topics: FilterCount[] = Object.entries(topicCounts)
      .map(([name, count]) => ({ name, count, key: name }))
      .sort((a, b) => b.count - a.count);

    const durationMs = Date.now() - startTime;

    const responsePayload: LibraryResponse = {
      meta: {
        totalDocuments: documents.length,
        fetchedAt: new Date().toISOString(),
        durationMs,
        sourceUrl: SOURCE_URL,
        cached: false,
        updateSizes,
        platforms,
        resourceTypes,
        topics,
      },
      documents,
    };

    cachedResponse = responsePayload;
    lastFetchTimestamp = now;

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred while fetching Apple library data';
    return NextResponse.json(
      {
        error: errorMsg,
        sourceUrl: SOURCE_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
