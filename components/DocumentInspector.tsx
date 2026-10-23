'use client';

import React, { useState } from 'react';
import { AppleDocument } from '@/lib/types';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Compass,
} from '@/components/icons/KeylineIcons';

interface DocumentInspectorProps {
  document: AppleDocument | null;
  onClose: () => void;
}

export function DocumentInspector({ document, onClose }: DocumentInspectorProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'raw' | 'json'>('details');

  if (!document) {
    return (
      <aside className="w-84 min-w-[336px] liquid-glass-inspector flex flex-col items-center justify-center p-6 text-center text-[#8E8E93] text-xs select-none z-20">
        <FileText className="w-8 h-8 text-[#CBD5E1] mb-2" />
        <p className="font-medium text-[#475569]">No Document Selected</p>
        <p className="text-[11px] text-[#94A3B8] mt-1">
          Click any document row or card to inspect complete metadata, raw Apple tuple fields, and archive links.
        </p>
      </aside>
    );
  }

  const handleCopyLink = () => {
    if (document.absUrl) {
      navigator.clipboard.writeText(document.absUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(document, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const columnNames = [
    'name',
    'id',
    'type',
    'date',
    'updateSize',
    'topic',
    'framework',
    'release',
    'subtopic',
    'url',
    'sortOrder',
    'displayDate',
    'platform',
  ];

  return (
    <aside className="w-84 min-w-[336px] max-w-[360px] liquid-glass-inspector flex flex-col h-full z-20">
      {/* Header */}
      <div className="p-3 border-b border-slate-200/60 liquid-glass-surface flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Compass className="w-4 h-4 text-[#007AFF]" />
          <span className="font-semibold text-xs text-[#0F172A] uppercase tracking-wider">Inspector</span>
          <span className="font-mono text-[10px] liquid-glass-badge bg-white/80 text-[#475569] px-2 py-0.5 rounded-md">
            {document.id}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md liquid-glass-button text-[#64748B] hover:text-[#0F172A] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="px-3 pt-2 pb-1.5 border-b border-slate-200/60 liquid-glass-surface">
        <div className="flex rounded-lg liquid-glass-button p-0.5 text-[11px] font-medium text-[#64748B]">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1 rounded-md text-center transition cursor-pointer ${
              activeTab === 'details' ? 'liquid-glass-primary shadow-xs font-semibold' : 'hover:text-[#0F172A]'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`flex-1 py-1 rounded-md text-center transition cursor-pointer ${
              activeTab === 'raw' ? 'liquid-glass-primary shadow-xs font-semibold' : 'hover:text-[#0F172A]'
            }`}
          >
            Raw Fields
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-1 rounded-md text-center transition cursor-pointer ${
              activeTab === 'json' ? 'liquid-glass-primary shadow-xs font-semibold' : 'hover:text-[#0F172A]'
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Title</div>
              <h2 className="text-sm font-semibold text-[#0F172A] leading-snug">{document.name}</h2>
            </div>

            {/* Direct Link Action */}
            {document.absUrl ? (
              <div className="liquid-glass-card rounded-xl p-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Official Archive Destination
                </div>
                <div className="text-[11px] font-mono text-[#007AFF] break-all line-clamp-2">
                  {document.absUrl}
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <a
                    href={document.absUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-7 liquid-glass-primary rounded-lg font-medium text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Open in Archive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="h-7 px-2.5 liquid-glass-button rounded-lg text-xs font-medium text-[#475569] flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Key Properties Grid */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Specifications</div>

              <div className="liquid-glass-card rounded-xl overflow-hidden divide-y divide-slate-200/50">
                <div className="flex justify-between px-3 py-2 bg-white/40">
                  <span className="text-[#64748B]">Resource Type</span>
                  <span className="font-medium text-[#0F172A]">{document.typeName}</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-white/40">
                  <span className="text-[#64748B]">Platform</span>
                  <span className="font-medium text-[#0F172A]">{document.platform}</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-white/40">
                  <span className="text-[#64748B]">Document ID</span>
                  <span className="font-mono text-[#0F172A]">{document.id}</span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-white/40">
                  <span className="text-[#64748B]">Publication Date</span>
                  <span className="font-mono text-[#0F172A]">{document.date}</span>
                </div>
                {document.updateSize && (
                  <div className="flex justify-between px-3 py-2 bg-white/40">
                    <span className="text-[#64748B]">Update Version</span>
                    <span className="font-medium text-[#0F172A]">{document.updateSize}</span>
                  </div>
                )}
                {document.topicName && (
                  <div className="flex justify-between px-3 py-2 bg-white/40">
                    <span className="text-[#64748B]">Topic</span>
                    <span className="font-medium text-[#0F172A] text-right truncate max-w-[180px]">
                      {document.topicName}
                    </span>
                  </div>
                )}
                {document.subtopicName && (
                  <div className="flex justify-between px-3 py-2 bg-white/40">
                    <span className="text-[#64748B]">Subtopic</span>
                    <span className="font-medium text-[#0F172A] text-right truncate max-w-[180px]">
                      {document.subtopicName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between px-3 py-2 bg-white/40">
                  <span className="text-[#64748B]">Relative Path</span>
                  <span className="font-mono text-[10px] text-[#475569] text-right truncate max-w-[180px]">
                    {document.url}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
              Apple Data Tuple Mapping
            </div>
            <p className="text-[11px] text-[#64748B]">
              Each document in Apple&apos;s navigation database is represented as an array of 13 column indices:
            </p>

            <div className="liquid-glass-card rounded-xl overflow-hidden divide-y divide-slate-200/50 text-[11px]">
              {document.raw.map((val, idx) => (
                <div key={idx} className="p-2 flex flex-col bg-white/40">
                  <div className="flex justify-between text-[10px] font-mono text-[#8E8E93] mb-0.5">
                    <span>
                      Index [{idx}]: {columnNames[idx] || `col_${idx}`}
                    </span>
                    <span>{typeof val}</span>
                  </div>
                  <div className="font-mono text-xs text-[#0F172A] break-all liquid-glass-badge bg-white/80 p-1.5 rounded-lg">
                    {String(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
                Full JSON Object
              </span>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 liquid-glass-button rounded-lg font-medium text-[11px] text-[#475569] flex items-center space-x-1 cursor-pointer"
              >
                {copiedJson ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#0F172A] text-[#F8FAFC] rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-[460px] border border-slate-700/60 shadow-inner">
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
}
