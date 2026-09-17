import React from 'react';
import { 
  FolderTree, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  GraduationCap, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onLoadSamples: () => void;
  onUndo: () => void;
  onClearAll: () => void;
  onOpenVivaModal: () => void;
  canUndo: boolean;
  undoCount: number;
  totalFiles: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onLoadSamples,
  onUndo,
  onClearAll,
  onOpenVivaModal,
  canUndo,
  undoCount,
  totalFiles
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                File Organizer Using Data Structure
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Implementation of Array, Stack (LIFO), Queue (FIFO), Hash Map & Hierarchical Tree
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
            
            {/* Viva & DS Theory Guide */}
            <button
              id="btn-viva-guide"
              onClick={onOpenVivaModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
              title="View Time Complexity and Viva Questions"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Viva & DS Theory</span>
            </button>

            {/* Quick Sample Files */}
            <button
              id="btn-load-samples"
              onClick={onLoadSamples}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Load 8 sample college files to test categories and data structures immediately"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Load Samples</span>
            </button>

            {/* Undo Button (Stack LIFO) */}
            <button
              id="btn-undo-action"
              onClick={onUndo}
              disabled={!canUndo}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                canUndo
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
              title="Undo last action using LIFO Stack"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
              {undoCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {undoCount}
                </span>
              )}
            </button>

            {/* Clear All */}
            {totalFiles > 0 && (
              <button
                id="btn-clear-all"
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                title="Clear all files (can be undone with Stack)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            {/* Primary Add Files Button */}
            <button
              id="btn-add-files"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Files</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
