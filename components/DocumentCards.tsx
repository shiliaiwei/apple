'use client';

import React from 'react';
import { AppleDocument } from '@/lib/types';
import { ExternalLink, Calendar, Tag } from '@/components/icons/KeylineIcons';

interface DocumentCardsProps {
  documents: AppleDocument[];
  selectedDoc: AppleDocument | null;
  onSelectDoc: (doc: AppleDocument) => void;
  currentPage: number;
  pageSize: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DocumentCards({
  documents,
  selectedDoc,
  onSelectDoc,
  currentPage,
  pageSize,
  totalFiltered,
  onPageChange,
  onPageSizeChange,
}: DocumentCardsProps) {
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDocs = documents.slice(startIndex, startIndex + pageSize);

  const getTypeBadgeClass = (typeName: string) => {
    switch (typeName) {
      case 'Sample Code':
        return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
      case 'Technical Q&As':
        return 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]';
      case 'Guides':
        return 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
      case 'Technical Notes':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'Articles':
        return 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]';
      default:
        return 'bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto p-4">
        {currentDocs.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-[#8E8E93] text-xs">
            No Apple library documents match your active search or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentDocs.map((doc) => {
              const isSelected = selectedDoc?.index === doc.index;

              return (
                <div
                  key={doc.index}
                  onClick={() => onSelectDoc(doc)}
                  className={`p-4 rounded-xl border bg-white cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#007AFF] ring-2 ring-[#007AFF]/20 shadow-xs'
                      : 'border-[#E5E5EA] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTypeBadgeClass(
                          doc.typeName
                        )}`}
                      >
                        {doc.typeName}
                      </span>

                      <span className="font-mono text-[10px] text-[#64748B] px-1.5 py-0.5 bg-[#F1F5F9] rounded border border-[#E2E8F0]">
                        {doc.id}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm text-[#0F172A] line-clamp-2 mb-2 leading-snug">
                      {doc.name}
                    </h3>

                    {/* Topic */}
                    {doc.topicName && (
                      <div className="text-xs text-[#64748B] flex items-center space-x-1 mb-2">
                        <Tag className="w-3 h-3 text-[#94A3B8]" />
                        <span className="truncate">{doc.topicName}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 mt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#8E8E93]">
                    <div className="flex items-center space-x-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-[#94A3B8]" />
                      <span>{doc.date}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase bg-[#F1F5F9] text-[#475569] px-1.5 py-0.5 rounded">
                        {doc.platformList[0] || 'ALL'}
                      </span>

                      {doc.absUrl && (
                        <a
                          href={doc.absUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open Apple Archive Documentation"
                          className="text-[#007AFF] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="h-12 border-t border-[#E5E5EA] bg-white px-4 flex items-center justify-between text-xs text-[#64748B] select-none">
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
              className="bg-white border border-[#E5E5EA] rounded px-1.5 py-0.5 font-mono text-xs text-[#0F172A]"
            >
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2.5 py-1 rounded bg-white border border-[#E5E5EA] disabled:opacity-40 hover:bg-[#F1F5F9] transition"
          >
            Previous
          </button>

          <span className="font-mono text-xs text-[#0F172A]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-2.5 py-1 rounded bg-white border border-[#E5E5EA] disabled:opacity-40 hover:bg-[#F1F5F9] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
