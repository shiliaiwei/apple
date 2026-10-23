'use client';

import React from 'react';
import { X, ShieldCheck, Info, ExternalLink } from '@/components/icons/KeylineIcons';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="liquid-glass-dialog rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/60 flex items-center justify-between liquid-glass-surface shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl liquid-glass-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0F172A] leading-tight">Credits & Legal Disclaimer</h3>
              <p className="text-[11px] text-[#64748B]">Independent Research & Archival Navigation Index</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg liquid-glass-button text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#334155] leading-relaxed">
          {/* Section 1: Non-Affiliation */}
          <div className="liquid-glass-card rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-1.5 text-[#007AFF] font-semibold text-xs uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              <span>Independent Project - Zero Official Affiliation</span>
            </div>
            <p className="text-[12px] text-[#334155]">
              This service and web application is an independent community, educational, and historical research
              directory. It is <strong>not affiliated with, associated with, authorized by, endorsed by, sponsored by, or in any way officially connected with Apple Inc.</strong>, or any of its subsidiaries, parent entities, or affiliates.
            </p>
          </div>

          {/* Section 2: Trademark Attribution */}
          <div className="liquid-glass-card rounded-2xl p-4">
            <div className="text-[#0F172A] font-semibold text-xs uppercase tracking-wider mb-1.5">
              Trademark Notices
            </div>
            <p className="text-[12px] text-[#334155]">
              <strong>Apple</strong>, the Apple logo, <strong>iOS</strong>, <strong>iPadOS</strong>, <strong>macOS</strong>, <strong>OS X</strong>, <strong>watchOS</strong>, <strong>tvOS</strong>, <strong>Xcode</strong>, <strong>Swift</strong>, <strong>Objective-C</strong>, and <strong>Cocoa</strong> are trademarks or registered trademarks of <strong>Apple Inc.</strong>, registered in the United States and other countries and regions.
            </p>
            <p className="text-[11px] text-[#64748B] mt-2">
              All other product names, trademarks, company designations, and registered trade names cited in this archive catalog are the property of their respective owners. Their mention herein is strictly for historical identification, indexing, and scholarly reference purposes only, and does not imply endorsement, affiliation, or sponsorship.
            </p>
          </div>

          {/* Section 3: Content Ownership & Source Credits */}
          <div className="liquid-glass-card rounded-2xl p-4">
            <div className="text-[#0F172A] font-semibold text-xs uppercase tracking-wider mb-1.5">
              Content Ownership & Source Credits
            </div>
            <p className="text-[12px] text-[#334155]">
              All document titles, metadata summaries, technical identifiers (such as DTS, Tech Notes, Q&amp;As, Guides), and topic classifications indexed by this tool originate from public historical navigation catalogs originally provided by Apple Developer.
            </p>
            <p className="text-[12px] text-[#334155] mt-2">
              <strong>All intellectual property rights, copyrights, and documentation ownership remain exclusively with Apple Inc. and original authors.</strong> This application does not claim ownership over any indexed documentation. Links provided throughout the explorer navigate directly to authentic, official Apple Developer Archive destinations.
            </p>
          </div>

          {/* Section 4: Purpose & Non-Commercial Research */}
          <div className="liquid-glass-card rounded-2xl p-4">
            <div className="text-[#0F172A] font-semibold text-xs uppercase tracking-wider mb-1.5">
              Educational Purpose & Fair Use
            </div>
            <p className="text-[12px] text-[#334155]">
              This project is built and maintained solely for non-commercial educational, academic research, and historical preservation purposes. No proprietary source code, copyrighted binary distributions, or protected non-public documents are hosted, duplicated, or served by this project.
            </p>
          </div>

          {/* Section 5: Limitation of Liability */}
          <div className="liquid-glass-card rounded-2xl p-4">
            <div className="text-[#0F172A] font-semibold text-xs uppercase tracking-wider mb-1.5">
              Disclaimer of Warranties & Limitation of Liability
            </div>
            <p className="text-[11px] text-[#64748B]">
              This catalog is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties or conditions of any kind, whether express, implied, statutory, or otherwise, including without limitation warranties of merchantability, fitness for a particular purpose, title, or non-infringement.
            </p>
            <p className="text-[11px] text-[#64748B] mt-1.5">
              In no event shall the maintainers, contributors, or developers of this index be held liable for any claim, damages, losses, or other liability arising from or in connection with the software, the use of this index, or external documentation accessed through it.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200/60 liquid-glass-surface flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#64748B]">
            Official Apple Developer site:{' '}
            <a
              href="https://developer.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] hover:underline inline-flex items-center space-x-0.5"
            >
              <span>developer.apple.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg liquid-glass-primary font-medium text-xs cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
