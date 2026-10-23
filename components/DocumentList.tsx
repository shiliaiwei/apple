'use client';

import React from 'react';
import { AppleDocument, SortField } from '@/lib/types';
import { ExternalLink, Eye, ChevronDown } from '@/components/icons/KeylineIcons';

interface DocumentListProps {
  documents: AppleDocument[];
  selectedDoc: AppleDocument | null;
  onSelectDoc: (doc: AppleDocument) => void;
  currentPage: number;
  pageSize: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortField?: SortField;
  onSortFieldChange?: (field: SortField) => void;
}

export function DocumentList({
  documents,
  selectedDoc,
  onSelectDoc,
  currentPage,
  pageSize,
  totalFiltered,
  onPageChange,
  onPageSizeChange,
  sortField,
  onSortFieldChange,
}: DocumentListProps) {
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDocs = documents.slice(startIndex, startIndex + pageSize);

  const getTypeBadgeClass = (typeName: string) => {
    switch (typeName) {
      case 'Sample Code':
        return 'bg-[#EFF6FF]/80 text-[#1D4ED8] border-[#BFDBFE]';
      case 'Technical Q&As':
        return 'bg-[#FFF1F2]/80 text-[#BE123C] border-[#FECDD3]';
      case 'Guides':
        return 'bg-[#ECFDF5]/80 text-[#047857] border-[#A7F3D0]';
      case 'Technical Notes':
        return 'bg-[#FFFBEB]/80 text-[#B45309] border-[#FDE68A]';
      case 'Articles':
        return 'bg-[#F5F3FF]/80 text-[#6D28D9] border-[#DDD6FE]';
      default:
        return 'bg-[#F1F5F9]/80 text-[#334155] border-[#E2E8F0]';
    }
  };

  const getPlatformBadgeClass = (platform: string) => {
    if (platform.includes('iOS')) return 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/25';
    if (platform.includes('macOS')) return 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/25';
    if (platform.includes('watchOS')) return 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/25';
    if (platform.includes('tvOS')) return 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/25';
    return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/25';
  };

  const toggleSort = (field: 'date' | 'title' | 'id') => {
    if (!onSortFieldChange) return;
    if (field === 'date') {
      onSortFieldChange(sortField === 'date_desc' ? 'date_asc' : 'date_desc');
    } else if (field === 'title') {
      onSortFieldChange(sortField === 'title_asc' ? 'title_desc' : 'title_asc');
    } else if (field === 'id') {
      onSortFieldChange('id_asc');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 liquid-glass-surface border-b border-slate-200/60 text-[#64748B] font-semibold select-none z-10">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center font-mono">#</th>
              <th
                onClick={() => toggleSort('title')}
                className="py-2.5 px-3 min-w-[280px] cursor-pointer hover:text-[#0F172A]"
              >
                <div className="flex items-center space-x-1">
                  <span>Title & Description</span>
                  {sortField?.startsWith('title') && <ChevronDown className="w-3 h-3 text-[#007AFF]" />}
                </div>
              </th>
              <th
                onClick={() => toggleSort('id')}
                className="py-2.5 px-3 w-32 cursor-pointer hover:text-[#0F172A]"
              >
                <div className="flex items-center space-x-1">
                  <span>Document ID</span>
                  {sortField === 'id_asc' && <ChevronDown className="w-3 h-3 text-[#007AFF]" />}
                </div>
              </th>
              <th className="py-2.5 px-3 w-36">Resource Type</th>
              <th className="py-2.5 px-3 w-32">Platform</th>
              <th className="py-2.5 px-3 w-36">Topic</th>
              <th
                onClick={() => toggleSort('date')}
                className="py-2.5 px-3 w-28 cursor-pointer hover:text-[#0F172A]"
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField?.startsWith('date') && <ChevronDown className="w-3 h-3 text-[#007AFF]" />}
                </div>
              </th>
              <th className="py-2.5 px-3 w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 bg-white/60 backdrop-blur-sm">
            {currentDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-[#8E8E93]">
                  No Apple library documents match your active search or filters.
                </td>
              </tr>
            ) : (
              currentDocs.map((doc) => {
                const isSelected = selectedDoc?.index === doc.index;

                return (
                  <tr
                    key={doc.index}
                    onClick={() => onSelectDoc(doc)}
                    className={`cursor-pointer transition group ${
                      isSelected
                        ? 'bg-[#007AFF]/12 font-medium shadow-[inset_2px_0_0_#007AFF]'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-[#8E8E93] text-[11px]">
                      {doc.index + 1}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#0F172A] line-clamp-2 leading-relaxed text-[13px]">
                        {doc.name}
                      </div>
                      {doc.subtopicName && (
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          {doc.topicName ? `${doc.topicName} > ` : ''}
                          {doc.subtopicName}
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#475569]">
                      <span className="px-2 py-0.5 rounded-md liquid-glass-badge bg-white/80">
                        {doc.id}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border liquid-glass-badge ${getTypeBadgeClass(
                          doc.typeName
                        )}`}
                      >
                        {doc.typeName}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {doc.platformList.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border liquid-glass-badge ${getPlatformBadgeClass(
                              p
                            )}`}
                          >
                            {p}
                          </span>
                        ))}
                        {doc.platformList.length > 2 && (
                          <span className="text-[10px] text-[#8E8E93]">+{doc.platformList.length - 2}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-[#475569] text-[11px] truncate max-w-[140px]">
                      {doc.topicName || '-'}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                      {doc.date}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDoc(doc);
                          }}
                          title="Inspect document"
                          className="p-1 rounded-md liquid-glass-button text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {doc.absUrl && (
                          <a
                            href={doc.absUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Open in Apple Archive"
                            className="p-1 rounded-md liquid-glass-button text-[#007AFF] cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer with Liquid Glass */}
      <div className="h-12 border-t border-slate-200/60 liquid-glass-surface px-4 flex items-center justify-between text-xs text-[#64748B] select-none z-10">
        <div className="flex items-center space-x-3">
          <span>
            Showing <strong className="text-[#0F172A]">{startIndex + 1}</strong> to{' '}
            <strong className="text-[#0F172A]">{Math.min(startIndex + pageSize, totalFiltered)}</strong> of{' '}
            <strong className="text-[#0F172A]">{totalFiltered.toLocaleString()}</strong> results
          </span>

          <div className="flex items-center space-x-1.5 ml-4">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="liquid-glass-button rounded-md px-2 py-0.5 font-mono text-xs text-[#0F172A] cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded-lg liquid-glass-button disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>

          <span className="font-mono text-xs text-[#0F172A]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 rounded-lg liquid-glass-button disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
