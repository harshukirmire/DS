import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileCode, 
  HardDrive,
  Files
} from 'lucide-react';
import { FileCategory, FileItem } from '../dataStructures/types';
import { formatFileSize } from '../utils/formatters';

interface StatsCardsProps {
  files: FileItem[];
  selectedCategory: FileCategory | 'all';
  onSelectCategory: (category: FileCategory | 'all') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  files,
  selectedCategory,
  onSelectCategory
}) => {
  const totalFiles = files.length;
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  // Group counts by category
  const counts: Record<FileCategory, { count: number; bytes: number }> = {
    document: { count: 0, bytes: 0 },
    image: { count: 0, bytes: 0 },
    video: { count: 0, bytes: 0 },
    audio: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 }
  };

  files.forEach(f => {
    if (counts[f.category]) {
      counts[f.category].count++;
      counts[f.category].bytes += f.size;
    }
  });

  const categoriesConfig: {
    id: FileCategory;
    name: string;
    icon: React.ElementType;
    examples: string;
    color: string;
    bgColor: string;
    borderActive: string;
  }[] = [
    {
      id: 'document',
      name: 'Documents',
      icon: FileText,
      examples: '.pdf, .docx, .txt, .csv',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/70',
      borderActive: 'border-blue-500 ring-2 ring-blue-100'
    },
    {
      id: 'image',
      name: 'Images',
      icon: ImageIcon,
      examples: '.png, .jpg, .svg, .gif',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-100'
    },
    {
      id: 'video',
      name: 'Videos',
      icon: Video,
      examples: '.mp4, .mkv, .mov, .avi',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50/70',
      borderActive: 'border-purple-500 ring-2 ring-purple-100'
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: Music,
      examples: '.mp3, .wav, .aac, .ogg',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/70',
      borderActive: 'border-amber-500 ring-2 ring-amber-100'
    },
    {
      id: 'other',
      name: 'Other',
      icon: FileCode,
      examples: '.cpp, .py, .zip, .sql',
      color: 'text-slate-600',
      bgColor: 'bg-slate-100/70',
      borderActive: 'border-slate-500 ring-2 ring-slate-200'
    }
  ];

  return (
    <section id="stats-section" className="space-y-3">
      {/* Top Overview Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Files className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Files Stored</div>
              <div className="text-base font-bold text-slate-900 leading-none">
                {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
              </div>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Allocated Size</div>
              <div className="text-base font-bold text-slate-900 leading-none">
                {formatFileSize(totalBytes)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter: All Files */}
        <button
          id="filter-category-all"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Show All Categories ({totalFiles})
        </button>
      </div>

      {/* 5 Category Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoriesConfig.map(cat => {
          const Icon = cat.icon;
          const stat = counts[cat.id];
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`filter-category-${cat.id}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer bg-white ${
                isSelected
                  ? `${cat.borderActive} bg-white shadow-sm`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${cat.bgColor} ${cat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                  {stat.count}
                </span>
              </div>

              <div className="font-semibold text-slate-900 text-sm">{cat.name}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {formatFileSize(stat.bytes)}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-1">
                {cat.examples}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
