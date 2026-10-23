'use client';

import React, { useState, useMemo } from 'react';
import { FilterCount } from '@/lib/types';
import {
  RefreshCw,
  X,
  FolderCheck,
  Search,
  Compass,
  Laptop,
  Smartphone,
  Watch,
  Tv,
  Tag,
  Layers,
  ShieldCheck,
} from '@/components/icons/KeylineIcons';

interface SidebarProps {
  platforms: FilterCount[];
  resourceTypes: FilterCount[];
  selectedPlatform: string;
  selectedType: string;
  selectedTopic: string;
  topics: FilterCount[];
  totalDocuments: number;
  filteredCount: number;
  isLoading: boolean;
  onSelectPlatform: (platform: string) => void;
  onSelectType: (type: string) => void;
  onSelectTopic: (topic: string) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onDisclaimerClick?: () => void;
  lastFetchedAt?: string;
}

export function Sidebar({
  platforms,
  resourceTypes,
  selectedPlatform,
  selectedType,
  selectedTopic,
  topics,
  totalDocuments,
  filteredCount,
  isLoading,
  onSelectPlatform,
  onSelectType,
  onSelectTopic,
  onResetFilters,
  onRefresh,
  onDisclaimerClick,
  lastFetchedAt,
}: SidebarProps) {
  const [topicSearch, setTopicSearch] = useState('');
  const hasActiveFilters = Boolean(selectedPlatform || selectedType || selectedTopic);

  const mainPlatforms = [
    { name: 'iOS', icon: Smartphone },
    { name: 'macOS', icon: Laptop },
    { name: 'watchOS', icon: Watch },
    { name: 'tvOS', icon: Tv },
  ];

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return topics.slice(0, 15);
    const q = topicSearch.toLowerCase().trim();
    return topics.filter((t) => t.name.toLowerCase().includes(q));
  }, [topics, topicSearch]);

  return (
    <aside className="w-64 min-w-[256px] liquid-glass-sidebar flex flex-col h-full select-none z-10">
      {/* Brand & Sync Status */}
      <div className="p-4 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg liquid-glass-button bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs tracking-tighter">
              <Compass className="w-4 h-4 text-[#007AFF]" />
            </div>
            <div>
              <div className="font-semibold text-xs text-[#0F172A] tracking-tight leading-none">Apple Archive</div>
              <div className="text-[10px] text-[#64748B] font-mono mt-0.5">Keyline Edition</div>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Fetch real-time data from Apple"
            className="p-1.5 rounded-lg liquid-glass-button text-[#64748B] hover:text-[#0F172A] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#007AFF]' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="inline-flex items-center space-x-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shadow-xs"></span>
            <span>REAL-TIME STREAM</span>
          </span>
          <span className="font-mono text-[#0F172A] font-semibold">{totalDocuments.toLocaleString()}</span>
        </div>

        {lastFetchedAt && (
          <div className="text-[10px] text-[#8E8E93] mt-1 font-mono">
            Synced: {new Date(lastFetchedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Filter Controls & Actions */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs text-[#0F172A]">
        {hasActiveFilters && (
          <div className="liquid-glass-card rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-[#64748B]">Active Filter</span>
              <button
                onClick={onResetFilters}
                className="text-[11px] text-[#007AFF] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-[#0F172A]">
              Showing {filteredCount.toLocaleString()} of {totalDocuments.toLocaleString()}
            </div>
          </div>
        )}

        {/* Platforms */}
        <div>
          <div className="px-2 mb-1.5 font-bold text-[10px] uppercase tracking-wider text-[#8E8E93] flex items-center space-x-1">
            <Layers className="w-3 h-3 text-[#007AFF]" />
            <span>Target Platform</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectPlatform('')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                !selectedPlatform
                  ? 'liquid-glass-primary font-medium'
                  : 'hover:bg-white/80 text-[#0F172A]'
              }`}
            >
              <span className="truncate">All Platforms</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  !selectedPlatform ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                }`}
              >
                {totalDocuments.toLocaleString()}
              </span>
            </button>

            {mainPlatforms.map(({ name: plat, icon: IconComponent }) => {
              const countItem = platforms.find((p) => p.name === plat);
              const count = countItem ? countItem.count : 0;
              const isSelected = selectedPlatform === plat;

              return (
                <button
                  key={plat}
                  onClick={() => onSelectPlatform(isSelected ? '' : plat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                    isSelected
                      ? 'liquid-glass-primary font-medium'
                      : 'hover:bg-white/80 text-[#0F172A]'
                  }`}
                >
                  <span className="truncate flex items-center space-x-1.5">
                    <IconComponent className="w-3 h-3 opacity-80" />
                    <span>{plat}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                    }`}
                  >
                    {count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resource Types */}
        <div>
          <div className="px-2 mb-1.5 font-bold text-[10px] uppercase tracking-wider text-[#8E8E93] flex items-center space-x-1">
            <Tag className="w-3 h-3 text-[#10B981]" />
            <span>Resource Types</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectType('')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                !selectedType
                  ? 'liquid-glass-primary font-medium'
                  : 'hover:bg-white/80 text-[#0F172A]'
              }`}
            >
              <span className="truncate">All Types</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  !selectedType ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                }`}
              >
                {totalDocuments.toLocaleString()}
              </span>
            </button>

            {resourceTypes.map((rt) => {
              const isSelected = selectedType === rt.name;
              return (
                <button
                  key={rt.key}
                  onClick={() => onSelectType(isSelected ? '' : rt.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                    isSelected
                      ? 'liquid-glass-primary font-medium'
                      : 'hover:bg-white/80 text-[#0F172A]'
                  }`}
                >
                  <span className="truncate pr-1">{rt.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                    }`}
                  >
                    {rt.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Searchable Topics */}
        {topics.length > 0 && (
          <div>
            <div className="px-2 mb-1.5 font-bold text-[10px] uppercase tracking-wider text-[#8E8E93] flex items-center justify-between">
              <span>Topics ({topics.length})</span>
            </div>

            {/* Quick in-sidebar topic search */}
            <div className="mb-1.5 px-1 relative">
              <Search className="w-3 h-3 text-[#94A3B8] absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Find topic..."
                className="w-full h-7 pl-7 pr-6 text-[11px] liquid-glass-input rounded-md outline-none text-[#0F172A]"
              />
              {topicSearch && (
                <button
                  onClick={() => setTopicSearch('')}
                  className="absolute right-2.5 top-2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-0.5">
              <button
                onClick={() => onSelectTopic('')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  !selectedTopic
                    ? 'liquid-glass-primary font-medium'
                    : 'hover:bg-white/80 text-[#0F172A]'
                }`}
              >
                <span className="truncate">All Topics</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    !selectedTopic ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                  }`}
                >
                  {totalDocuments.toLocaleString()}
                </span>
              </button>

              {filteredTopics.map((tp) => {
                const isSelected = selectedTopic === tp.name;
                return (
                  <button
                    key={tp.key}
                    onClick={() => onSelectTopic(isSelected ? '' : tp.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      isSelected
                        ? 'liquid-glass-primary font-medium'
                        : 'hover:bg-white/80 text-[#0F172A]'
                    }`}
                  >
                    <span className="truncate pr-1 text-[11px]">{tp.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected ? 'bg-[#0052B3] text-white' : 'bg-slate-200/70 text-[#64748B]'
                      }`}
                    >
                      {tp.count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Legal Notice */}
      <div className="p-3 border-t border-slate-200/60 text-[11px] text-[#8E8E93] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <FolderCheck className="w-3.5 h-3.5 text-[#34C759]" />
            <span className="font-medium text-[#475569]">Archive Pipeline</span>
          </div>
          <button
            onClick={onDisclaimerClick}
            className="text-[10px] text-[#007AFF] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
            title="Read Legal Disclaimer & Credits"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Disclaimer</span>
          </button>
        </div>
        <div className="text-[10px] text-[#94A3B8] leading-tight">
          Independent educational index. Not affiliated with Apple Inc.
        </div>
      </div>
    </aside>
  );
}
