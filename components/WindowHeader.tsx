'use client';

import React from 'react';
import {
  Search,
  Grid2x2,
  Table,
  Download,
  X,
  SlidersHorizontal,
  ChevronDown,
  Compass,
  ShieldCheck,
} from '@/components/icons/KeylineIcons';
import { SortField, ViewMode } from '@/lib/types';

interface WindowHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  onExportClick: () => void;
  inspectorOpen: boolean;
  onToggleInspector: () => void;
  onDisclaimerClick?: () => void;
  totalResults: number;
}

export function WindowHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  onSortFieldChange,
  onExportClick,
  inspectorOpen,
  onToggleInspector,
  onDisclaimerClick,
  totalResults,
}: WindowHeaderProps) {
  return (
    <header className="h-14 liquid-glass-header px-4 flex items-center justify-between gap-4 select-none z-20">
      {/* Left: Traffic Lights & Title */}
      <div className="flex items-center space-x-3.5 min-w-[240px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs"></span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg liquid-glass-badge">
            <Compass className="w-3.5 h-3.5 text-[#007AFF]" />
            <span className="font-bold text-[11px] text-[#0F172A] tracking-wider uppercase">APPLE</span>
          </div>
          <span className="font-semibold text-xs text-[#0F172A] tracking-tight">Navigation Library</span>
          <span className="font-mono text-[11px] text-[#64748B]">({totalResults.toLocaleString()} docs)</span>
        </div>
      </div>

      {/* Center: Search Field with Keyline Search & Liquid Glass Input */}
      <div className="flex-1 max-w-lg relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 5,219 docs by title, ID (DTS/TP), topic, or URL path..."
            className="w-full h-9 pl-9 pr-8 text-xs liquid-glass-input rounded-xl outline-none text-[#0F172A] placeholder-[#8E8E93]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 p-1 rounded-full hover:bg-black/5 text-[#8E8E93]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Controls & Toggles with Liquid Glass Borders */}
      <div className="flex items-center space-x-2">
        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="h-8 pl-3 pr-7 text-xs liquid-glass-button rounded-lg font-medium text-[#0F172A] outline-none appearance-none cursor-pointer"
          >
            <option value="date_desc">Date (Newest First)</option>
            <option value="date_asc">Date (Oldest First)</option>
            <option value="title_asc">Title (A to Z)</option>
            <option value="title_desc">Title (Z to A)</option>
            <option value="id_asc">Apple ID (Ascending)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#64748B] absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* View Switcher with Keyline Icons */}
        <div className="flex items-center liquid-glass-button p-0.5 rounded-lg">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'table' ? 'liquid-glass-primary shadow-xs' : 'text-[#8E8E93] hover:text-[#0F172A]'
            }`}
            title="Table View"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'cards' ? 'liquid-glass-primary shadow-xs' : 'text-[#8E8E93] hover:text-[#0F172A]'
            }`}
            title="Cards Grid View"
          >
            <Grid2x2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Data */}
        <button
          onClick={onExportClick}
          className="h-8 px-3 liquid-glass-button rounded-lg text-xs font-medium text-[#0F172A] flex items-center space-x-1.5 cursor-pointer"
          title="Export Filtered Data"
        >
          <Download className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Export</span>
        </button>

        {/* Credits & Legal Disclaimer */}
        <button
          onClick={onDisclaimerClick}
          className="h-8 px-2.5 liquid-glass-button rounded-lg text-xs font-medium text-[#475569] hover:text-[#0F172A] flex items-center space-x-1.5 cursor-pointer"
          title="Credits & Legal Disclaimer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
          <span className="hidden md:inline">Disclaimer</span>
        </button>

        {/* Toggle Inspector Pane */}
        <button
          onClick={onToggleInspector}
          className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
            inspectorOpen
              ? 'liquid-glass-primary'
              : 'liquid-glass-button text-[#0F172A]'
          }`}
          title="Toggle Contextual Inspector"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspector</span>
        </button>
      </div>
    </header>
  );
}
