'use client';

import React from 'react';
import { Filter, X, Sparkles } from '@/components/icons/KeylineIcons';

interface QuickFilterBarProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedEra: string;
  onSelectEra: (era: string) => void;
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onResetAll: () => void;
  totalFiltered: number;
}

export function QuickFilterBar({
  selectedPlatform,
  onSelectPlatform,
  selectedType,
  onSelectType,
  selectedEra,
  onSelectEra,
  selectedTopic,
  onSelectTopic,
  searchQuery,
  onClearSearch,
  onResetAll,
  totalFiltered,
}: QuickFilterBarProps) {
  const platforms = [
    { label: 'All Platforms', value: '' },
    { label: 'iOS', value: 'iOS' },
    { label: 'macOS', value: 'macOS' },
    { label: 'watchOS', value: 'watchOS' },
    { label: 'tvOS', value: 'tvOS' },
  ];

  const types = [
    { label: 'All Types', value: '' },
    { label: 'Sample Code', value: 'Sample Code' },
    { label: 'Technical Q&As', value: 'Technical Q&As' },
    { label: 'Guides', value: 'Guides' },
    { label: 'Technical Notes', value: 'Technical Notes' },
    { label: 'Release Notes', value: 'Release Notes' },
  ];

  const eras = [
    { label: 'All Time', value: '' },
    { label: '2015 - Now', value: '2015' },
    { label: '2010 - 2014', value: '2010' },
    { label: '2005 - 2009', value: '2005' },
    { label: 'Pre-2005', value: 'legacy' },
  ];

  const quickTechs = ['Swift', 'Xcode', 'Objective-C', 'Security', 'Audio', 'Graphics', 'Networking'];

  const hasAnyFilter = Boolean(selectedPlatform || selectedType || selectedEra || selectedTopic || searchQuery);

  return (
    <div className="liquid-glass-surface px-4 py-2 text-xs select-none space-y-2 z-10">
      {/* Row 1: Primary Filter Presets (Platforms & Types) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-[#007AFF]" />
            <span>Platform:</span>
          </span>
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p.value;
            return (
              <button
                key={p.label}
                onClick={() => onSelectPlatform(isSelected && p.value ? '' : p.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  isSelected
                    ? 'liquid-glass-pill-active'
                    : 'liquid-glass-pill text-[#0F172A]'
                }`}
              >
                {p.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-300/60 mx-1"></div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mr-1">Type:</span>
          {types.map((t) => {
            const isSelected = selectedType === t.value;
            return (
              <button
                key={t.label}
                onClick={() => onSelectType(isSelected && t.value ? '' : t.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  isSelected
                    ? 'liquid-glass-pill-active'
                    : 'liquid-glass-pill text-[#0F172A]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Era Selector with Liquid Glass Frame */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">Era:</span>
          <div className="flex items-center liquid-glass-button p-0.5 rounded-lg">
            {eras.map((e) => {
              const isSelected = selectedEra === e.value;
              return (
                <button
                  key={e.label}
                  onClick={() => onSelectEra(isSelected && e.value ? '' : e.value)}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition cursor-pointer ${
                    isSelected ? 'liquid-glass-primary shadow-xs font-medium' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Popular Tech Quick Tags & Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mr-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#FF9500]" />
            <span>Tech:</span>
          </span>
          {quickTechs.map((tech) => {
            const isSelected = selectedTopic === tech || searchQuery === tech;
            return (
              <button
                key={tech}
                onClick={() => onSelectTopic(isSelected ? '' : tech)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer ${
                  isSelected
                    ? 'liquid-glass-primary'
                    : 'liquid-glass-badge bg-white/70 hover:bg-white text-[#334155]'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips Ribbon */}
        {hasAnyFilter && (
          <div className="flex items-center gap-1.5">
            {selectedPlatform && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full liquid-glass-badge bg-[#007AFF]/10 text-[#007AFF] text-[10px] font-medium border-t-white/80">
                <span>Platform: {selectedPlatform}</span>
                <button onClick={() => onSelectPlatform('')} className="hover:text-[#0055B3] cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {selectedType && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full liquid-glass-badge bg-[#10B981]/10 text-[#047857] text-[10px] font-medium border-t-white/80">
                <span>Type: {selectedType}</span>
                <button onClick={() => onSelectType('')} className="hover:text-[#065F46] cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {selectedEra && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full liquid-glass-badge bg-[#6366F1]/10 text-[#4338CA] text-[10px] font-medium border-t-white/80">
                <span>Era: {eras.find((e) => e.value === selectedEra)?.label}</span>
                <button onClick={() => onSelectEra('')} className="hover:text-[#3730A3] cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {selectedTopic && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full liquid-glass-badge bg-[#8B5CF6]/10 text-[#6D28D9] text-[10px] font-medium border-t-white/80">
                <span>Topic: {selectedTopic}</span>
                <button onClick={() => onSelectTopic('')} className="hover:text-[#5B21B6] cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full liquid-glass-badge bg-white/80 text-[#334155] text-[10px] font-medium">
                <span>Query: &quot;{searchQuery}&quot;</span>
                <button onClick={onClearSearch} className="hover:text-black cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            <button
              onClick={onResetAll}
              className="text-[10px] font-semibold text-[#FF3B30] hover:underline px-1 cursor-pointer"
            >
              Clear All ({totalFiltered.toLocaleString()})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
