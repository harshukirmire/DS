import React from 'react';
import { DSExplanation } from '../dataStructures/types';
import { ArrowRight, Cpu, Layers, GitBranch, Database, Clock } from 'lucide-react';

interface DsOperationBannerProps {
  lastExplanation: DSExplanation | null;
}

export const DsOperationBanner: React.FC<DsOperationBannerProps> = ({ lastExplanation }) => {
  if (!lastExplanation) {
    return (
      <div id="ds-live-banner" className="bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-slate-50 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-600 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">Data Structure Engine Ready: </span>
            <span>Add or select a file to watch real-time Queue (FIFO), Hash Map lookup, Tree insertion, and Stack push operations.</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono font-medium text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md border border-blue-200">
          <span>O(1) Hash Map</span>
          <span>•</span>
          <span>FIFO Queue</span>
          <span>•</span>
          <span>LIFO Stack</span>
          <span>•</span>
          <span>N-ary Tree</span>
        </div>
      </div>
    );
  }

  return (
    <div id="ds-live-banner" className="bg-white border-2 border-indigo-100 rounded-xl p-3.5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Live DS Operation Executed
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
            {lastExplanation.operation}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            <Layers className="w-3 h-3" />
            <span>DS: {lastExplanation.dataStructure}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <Clock className="w-3 h-3" />
            <span>Time: {lastExplanation.complexity}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-700 font-medium leading-relaxed">
        {lastExplanation.description}
      </div>
    </div>
  );
};
