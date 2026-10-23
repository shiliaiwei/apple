export interface RawTopicItem {
  name: string;
  id: string | number;
  key?: string;
  sortOrder?: string;
  parent?: number;
}

export interface RawTopicGroup {
  name: string;
  id: string;
  contents: RawTopicItem[];
}

export interface AppleDocument {
  index: number;
  name: string;
  id: string;
  typeId: number;
  typeName: string;
  date: string;
  updateSize: string;
  topicId: number;
  topicName: string;
  framework: number;
  release: number;
  subtopicId: number;
  subtopicName: string;
  url: string;
  absUrl: string;
  sortOrder: number;
  displayDate: string;
  platform: string;
  platformList: string[];
  raw: (string | number)[];
}

export interface FilterCount {
  name: string;
  count: number;
  key: string;
}

export interface LibraryResponse {
  meta: {
    totalDocuments: number;
    fetchedAt: string;
    durationMs: number;
    sourceUrl: string;
    cached: boolean;
    updateSizes: string[];
    platforms: FilterCount[];
    resourceTypes: FilterCount[];
    topics: FilterCount[];
  };
  documents: AppleDocument[];
}

export type ViewMode = 'table' | 'cards';

export type SortField = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc' | 'id_asc';
