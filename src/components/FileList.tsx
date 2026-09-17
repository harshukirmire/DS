import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileCode,
  File,
  ListFilter,
  CheckCircle2,
  Calendar,
  HardDrive
} from 'lucide-react';
import { FileCategory, FileItem } from '../dataStructures/types';
import { formatDate, formatFileSize, getCategoryColor } from '../utils/formatters';

interface FileListProps {
  files: FileItem[];
  selectedCategory: FileCategory | 'all';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchAlgorithm: 'Linear Search' | 'Binary Search';
  onToggleSearchAlgorithm: (algo: 'Linear Search' | 'Binary Search') => void;
  searchMetrics?: { comparisons: number; timeMs: number; complexity: string };
  sortBy: 'name' | 'size' | 'category' | 'createdAt';
  sortAscending: boolean;
  onSortChange: (field: 'name' | 'size' | 'category' | 'createdAt') => void;
  onDeleteFile: (file: FileItem) => void;
  onOpenAddModal: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedCategory,
  searchQuery,
  onSearchChange,
  searchAlgorithm,
  onToggleSearchAlgorithm,
  searchMetrics,
  sortBy,
  sortAscending,
  onSortChange,
  onDeleteFile,
  onOpenAddModal
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const getFileIcon = (category: FileCategory) => {
    switch (category) {
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'audio':
        return <Music className="w-4 h-4 text-amber-600" />;
      case 'other':
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header & Controls Toolbar */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-files-input"
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={`Search files (e.g. "notes", ".pdf", "document")...`}
              className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            />
            {/* Search Algorithm Toggle */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
              <button
                type="button"
                id="toggle-search-algorithm"
                onClick={() =>
                  onToggleSearchAlgorithm(
                    searchAlgorithm === 'Linear Search' ? 'Binary Search' : 'Linear Search'
                  )
                }
                className="px-2 py-1 text-[10px] font-mono font-bold rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                title={`Click to switch search algorithm (Current: ${searchAlgorithm})`}
              >
                {searchAlgorithm === 'Linear Search' ? 'Linear O(n)' : 'Binary O(log n)'}
              </button>
            </div>
          </div>

          {/* Sorting & Filter Options */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={e => onSortChange(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="category">Category</option>
                <option value="createdAt">Date Added</option>
              </select>
              <button
                id="sort-direction-toggle"
                onClick={() => onSortChange(sortBy)}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                title={sortAscending ? 'Ascending Order' : 'Descending Order'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                id="view-mode-table"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
              <button
                id="view-mode-cards"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
            </div>

          </div>

        </div>

        {/* Algorithm execution feedback */}
        {searchQuery.trim() && searchMetrics && (
          <div className="flex items-center justify-between text-[11px] font-mono bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400">Search: </span>
              <span className="font-bold text-slate-800">{searchAlgorithm}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-400">Complexity: </span>
              <span className="font-bold text-indigo-700">{searchMetrics.complexity}</span>
            </div>
            <div>
              <span className="text-slate-400">Comparisons: </span>
              <span className="font-bold text-slate-800">{searchMetrics.comparisons}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-400">Time: </span>
              <span className="font-bold text-slate-800">{searchMetrics.timeMs} ms</span>
            </div>
          </div>
        )}

      </div>

      {/* Files Display Area */}
      {files.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <File className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">No files match the criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No files found matching "${searchQuery}". Try changing search terms or switching category filter.`
              : `The file organizer is empty. Add your files or load sample files to see the data structures in action.`}
          </p>
          <button
            id="empty-state-add-btn"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
          >
            Add Files Now
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table id="files-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">File Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Extension</th>
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">Added</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {files.map((file, idx) => {
                const color = getCategoryColor(file.category);
                return (
                  <tr 
                    key={file.id} 
                    id={`file-row-${file.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                          {getFileIcon(file.category)}
                        </div>
                        <span className="truncate max-w-xs font-semibold text-slate-800" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color.badge}`}>
                        {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      .{file.extension}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {formatFileSize(file.size)}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(file.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        id={`btn-delete-file-${file.id}`}
                        onClick={() => onDeleteFile(file)}
                        className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete file (Action pushed to Undo Stack)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map(file => {
            const color = getCategoryColor(file.category);
            return (
              <div
                key={file.id}
                id={`file-card-${file.id}`}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                      {getFileIcon(file.category)}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color.badge}`}>
                      {file.category}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-xs truncate mb-1" title={file.name}>
                    {file.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="font-mono">.{file.extension}</span>
                  </div>

                  <button
                    id={`btn-card-delete-${file.id}`}
                    onClick={() => onDeleteFile(file)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete file (Action pushed to Undo Stack)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-700">{files.length}</span> file records in Array storage
        </div>
        <div className="font-mono text-slate-400">
          Storage: Contiguous Dynamic Array (Indexed List)
        </div>
      </div>

    </div>
  );
};
