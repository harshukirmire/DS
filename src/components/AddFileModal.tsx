import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FilePlus, 
  FolderPlus, 
  FileText, 
  Check,
  AlertCircle
} from 'lucide-react';
import { ExtensionHashMap, extensionHashMap } from '../dataStructures/ExtensionHashMap';
import { FileCategory, FileItem } from '../dataStructures/types';

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFiles: (files: { name: string; size: number }[]) => void;
}

export const AddFileModal: React.FC<AddFileModalProps> = ({
  isOpen,
  onClose,
  onAddFiles
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  
  // Manual creation state
  const [manualName, setManualName] = useState('');
  const [manualSizeKb, setManualSizeKb] = useState('512');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real files handler
  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesToAdd: { name: string; size: number }[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      filesToAdd.push({
        name: f.name,
        size: f.size
      });
    }

    onAddFiles(filesToAdd);
    onClose();
  };

  // Manual file submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) {
      setErrorMessage('Please enter a valid file name (e.g. notes.pdf)');
      return;
    }

    if (!manualName.includes('.')) {
      setErrorMessage('Please include a file extension like .pdf, .png, .mp4, .cpp');
      return;
    }

    const sizeInBytes = Math.max(100, (parseFloat(manualSizeKb) || 100) * 1024);

    onAddFiles([{
      name: manualName.trim(),
      size: sizeInBytes
    }]);

    setManualName('');
    setErrorMessage('');
    onClose();
  };

  // Presets for quick adding
  const quickPresets = [
    { name: 'Semester_Exam_Schedule.pdf', size: 1024 * 350 },
    { name: 'Data_Structures_Project.zip', size: 1024 * 1200 },
    { name: 'Campus_Drone_Footage.mp4', size: 1024 * 1024 * 38 },
    { name: 'Lab_Record_Graph.png', size: 1024 * 650 },
    { name: 'Seminar_Audio_Recording.mp3', size: 1024 * 1024 * 5 },
    { name: 'Graph_Algorithms.cpp', size: 1024 * 18 }
  ];

  const handleQuickAdd = (preset: { name: string; size: number }) => {
    onAddFiles([preset]);
    onClose();
  };

  const detectedExt = manualName.includes('.') ? ExtensionHashMap.extractExtension(manualName) : '';
  const detectedCat = detectedExt ? extensionHashMap.classify(detectedExt) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="add-files-dialog"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Files to Organizer</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Simulates Queue Ingestion and Tree classification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-2 bg-slate-100/70 border-b border-slate-200 flex gap-2 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Local Files</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Create Custom File</span>
          </button>
        </div>

        {/* Tab 1: Upload from disk */}
        {activeTab === 'upload' && (
          <div className="p-5 space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleNativeFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                Choose files from your computer
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select documents (.pdf, .docx), images (.png, .jpg), videos (.mp4), audio (.mp3), or code (.cpp, .zip).
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs group-hover:border-blue-300">
                Browse Files
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                Or Quick-Add Sample College Files:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickPresets.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(p)}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400">Click to enqueue</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Creation */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                File Name with Extension *
              </label>
              <input
                type="text"
                value={manualName}
                onChange={e => {
                  setManualName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="e.g. notes.pdf, demo.mp4, logo.png"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Extension determines classification into Documents, Images, Videos, Audio, or Other.
              </p>
            </div>

            {detectedCat && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span>Detected Category via Hash Map:</span>
                <span className="font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px]">
                  {detectedCat}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated File Size (in KB)
              </label>
              <input
                type="number"
                value={manualSizeKb}
                onChange={e => setManualSizeKb(e.target.value)}
                min="1"
                max="100000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              />
            </div>

            {errorMessage && (
              <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Enqueue & Organize File
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
