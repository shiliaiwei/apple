'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppleDocument, LibraryResponse, SortField, ViewMode } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { WindowHeader } from '@/components/WindowHeader';
import { QuickFilterBar } from '@/components/QuickFilterBar';
import { DocumentList } from '@/components/DocumentList';
import { DocumentCards } from '@/components/DocumentCards';
import { DocumentInspector } from '@/components/DocumentInspector';
import { ExportModal } from '@/components/ExportModal';
import { RefreshCw } from '@/components/icons/KeylineIcons';

export default function Home() {
  const [data, setData] = useState<LibraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sortField, setSortField] = useState<SortField>('date_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Inspector & selection
  const [selectedDoc, setSelectedDoc] = useState<AppleDocument | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Fetch real-time library data
  const fetchData = useCallback(async (refresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = refresh ? '/api/library?refresh=true' : '/api/library';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load data (${res.status})`);
      }
      const json: LibraryResponse = await res.json();
      setData(json);
      if (json.documents && json.documents.length > 0 && !selectedDoc) {
        setSelectedDoc(json.documents[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch Apple archive data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDoc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPlatform, selectedType, selectedEra, selectedTopic, sortField]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('');
    setSelectedType('');
    setSelectedEra('');
    setSelectedTopic('');
  };

  // Memoized filtered & sorted documents
  const filteredDocuments = useMemo(() => {
    if (!data?.documents) return [];

    let list = data.documents;

    // Platform filter
    if (selectedPlatform) {
      list = list.filter((doc) => doc.platformList.includes(selectedPlatform));
    }

    // Resource Type filter
    if (selectedType) {
      list = list.filter((doc) => doc.typeName === selectedType);
    }

    // Era / Date Range filter
    if (selectedEra) {
      if (selectedEra === '2015') {
        list = list.filter((doc) => doc.date >= '2015-01-01');
      } else if (selectedEra === '2010') {
        list = list.filter((doc) => doc.date >= '2010-01-01' && doc.date < '2015-01-01');
      } else if (selectedEra === '2005') {
        list = list.filter((doc) => doc.date >= '2005-01-01' && doc.date < '2010-01-01');
      } else if (selectedEra === 'legacy') {
        list = list.filter((doc) => doc.date < '2005-01-01');
      }
    }

    // Topic filter
    if (selectedTopic) {
      const q = selectedTopic.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.topicName.toLowerCase().includes(q) ||
          doc.subtopicName.toLowerCase().includes(q) ||
          doc.name.toLowerCase().includes(q)
      );
    }

    // Search Query (matches Title, ID, Topic, or Path)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q) ||
          doc.topicName.toLowerCase().includes(q) ||
          doc.subtopicName.toLowerCase().includes(q) ||
          doc.url.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sorted = [...list];
    switch (sortField) {
      case 'date_desc':
        sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        break;
      case 'date_asc':
        sorted.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        break;
      case 'title_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'title_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'id_asc':
        sorted.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    return sorted;
  }, [data?.documents, selectedPlatform, selectedType, selectedEra, selectedTopic, searchQuery, sortField]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#0F172A] antialiased select-text">
      {/* 3-Column macOS Architecture */}

      {/* Column 1: Vibrant Sidebar */}
      <Sidebar
        platforms={data?.meta?.platforms || []}
        resourceTypes={data?.meta?.resourceTypes || []}
        topics={data?.meta?.topics || []}
        selectedPlatform={selectedPlatform}
        selectedType={selectedType}
        selectedTopic={selectedTopic}
        totalDocuments={data?.meta?.totalDocuments || 0}
        filteredCount={filteredDocuments.length}
        isLoading={isLoading}
        onSelectPlatform={setSelectedPlatform}
        onSelectType={setSelectedType}
        onSelectTopic={setSelectedTopic}
        onResetFilters={handleResetFilters}
        onRefresh={() => fetchData(true)}
        lastFetchedAt={data?.meta?.fetchedAt}
      />

      {/* Column 2: Center Detail Canvas */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Window Chrome Header */}
        <WindowHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          onSortFieldChange={setSortField}
          onExportClick={() => setExportModalOpen(true)}
          inspectorOpen={inspectorOpen}
          onToggleInspector={() => setInspectorOpen((prev) => !prev)}
          totalResults={filteredDocuments.length}
        />

        {/* Quick Filter & Presets Ribbon */}
        <QuickFilterBar
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedEra={selectedEra}
          onSelectEra={setSelectedEra}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onResetAll={handleResetFilters}
          totalFiltered={filteredDocuments.length}
        />

        {/* Content Area */}
        <div className="flex-1 flex min-h-0 relative">
          {isLoading && !data ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#007AFF] animate-spin" />
              <p className="font-semibold text-sm text-[#0F172A]">Fetching Apple Archive Library...</p>
              <p className="text-xs text-[#8E8E93] max-w-sm">
                Streaming and parsing 5,219 developer navigation records directly from Apple Developer.
              </p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center font-bold text-xs">
                !
              </div>
              <p className="font-semibold text-sm text-[#0F172A]">Connection Error</p>
              <p className="text-xs text-[#8E8E93] max-w-sm">{error}</p>
              <button
                onClick={() => fetchData(true)}
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white text-xs font-medium hover:bg-[#0062CC] transition"
              >
                Retry Real-Time Fetch
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <DocumentList
              documents={filteredDocuments}
              selectedDoc={selectedDoc}
              onSelectDoc={(doc) => {
                setSelectedDoc(doc);
                if (!inspectorOpen) setInspectorOpen(true);
              }}
              currentPage={currentPage}
              pageSize={pageSize}
              totalFiltered={filteredDocuments.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              sortField={sortField}
              onSortFieldChange={setSortField}
            />
          ) : (
            <DocumentCards
              documents={filteredDocuments}
              selectedDoc={selectedDoc}
              onSelectDoc={(doc) => {
                setSelectedDoc(doc);
                if (!inspectorOpen) setInspectorOpen(true);
              }}
              currentPage={currentPage}
              pageSize={pageSize}
              totalFiltered={filteredDocuments.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}

          {/* Column 3: Contextual Inspector Pane */}
          {inspectorOpen && (
            <DocumentInspector document={selectedDoc} onClose={() => setInspectorOpen(false)} />
          )}
        </div>
      </main>

      {/* Export Dialog Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        filteredDocuments={filteredDocuments}
      />
    </div>
  );
}
