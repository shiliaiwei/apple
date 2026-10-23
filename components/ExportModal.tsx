'use client';

import React, { useState } from 'react';
import { AppleDocument } from '@/lib/types';
import { X, Download, FileText, CircleCheck } from '@/components/icons/KeylineIcons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredDocuments: AppleDocument[];
}

export function ExportModal({ isOpen, onClose, filteredDocuments }: ExportModalProps) {
  const [downloaded, setDownloaded] = useState<'json' | 'csv' | null>(null);

  if (!isOpen) return null;

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredDocuments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `apple_library_filtered_${filteredDocuments.length}_records.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloaded('json');
    setTimeout(() => setDownloaded(null), 2000);
  };

  const exportAsCsv = () => {
    const headers = ['Index', 'ID', 'Name', 'Type', 'Platform', 'Topic', 'Subtopic', 'Date', 'URL'];
    const rows = filteredDocuments.map((doc) => [
      doc.index + 1,
      `"${doc.id.replace(/"/g, '""')}"`,
      `"${doc.name.replace(/"/g, '""')}"`,
      `"${doc.typeName.replace(/"/g, '""')}"`,
      `"${doc.platform.replace(/"/g, '""')}"`,
      `"${(doc.topicName || '').replace(/"/g, '""')}"`,
      `"${(doc.subtopicName || '').replace(/"/g, '""')}"`,
      `"${doc.date}"`,
      `"${doc.absUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `apple_library_filtered_${filteredDocuments.length}_records.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloaded('csv');
    setTimeout(() => setDownloaded(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E5EA] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E5EA] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-[#007AFF]" />
            <h3 className="font-semibold text-sm text-[#0F172A]">Export Dataset</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#E5E5EA] text-[#64748B]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-[#475569]">
          <p>
            You are exporting{' '}
            <strong className="text-[#0F172A] font-semibold">{filteredDocuments.length.toLocaleString()}</strong> filtered
            Apple Developer Archive records. Select your preferred output format:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* JSON Option */}
            <button
              onClick={exportAsJson}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#007AFF] bg-[#F8FAFC] hover:bg-white text-left transition group flex flex-col justify-between"
            >
              <div>
                <FileText className="w-6 h-6 text-[#007AFF] mb-2" />
                <div className="font-semibold text-sm text-[#0F172A]">JSON Format</div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Full structured objects with raw data arrays and unescaped HTML strings.
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-medium text-[11px] text-[#007AFF] flex items-center space-x-1">
                {downloaded === 'json' ? (
                  <>
                    <CircleCheck className="w-3.5 h-3.5 text-[#34C759]" />
                    <span className="text-[#34C759]">Downloaded</span>
                  </>
                ) : (
                  <span>Download .json</span>
                )}
              </div>
            </button>

            {/* CSV Option */}
            <button
              onClick={exportAsCsv}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#007AFF] bg-[#F8FAFC] hover:bg-white text-left transition group flex flex-col justify-between"
            >
              <div>
                <FileText className="w-6 h-6 text-[#10B981] mb-2" />
                <div className="font-semibold text-sm text-[#0F172A]">CSV Format</div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Tabular spreadsheet format compatible with Excel, Numbers, and Google Sheets.
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-medium text-[11px] text-[#10B981] flex items-center space-x-1">
                {downloaded === 'csv' ? (
                  <>
                    <CircleCheck className="w-3.5 h-3.5 text-[#34C759]" />
                    <span className="text-[#34C759]">Downloaded</span>
                  </>
                ) : (
                  <span>Download .csv</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E5EA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-xs font-medium text-[#475569] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
