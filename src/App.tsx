/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileCategory, 
  FileItem, 
  HistoryAction, 
  DSExplanation 
} from './dataStructures/types';
import { FileCategoryTree } from './dataStructures/FileCategoryTree';
import { FileQueue } from './dataStructures/FileQueue';
import { ActionStack } from './dataStructures/ActionStack';
import { ExtensionHashMap, extensionHashMap } from './dataStructures/ExtensionHashMap';
import { FileAlgorithms, SearchResult } from './dataStructures/FileAlgorithms';
import { createSampleFiles } from './dataStructures/sampleData';

import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { DsOperationBanner } from './components/DsOperationBanner';
import { FileList } from './components/FileList';
import { DataStructureVisualizer } from './components/DataStructureVisualizer';
import { VivaTheoryModal } from './components/VivaTheoryModal';
import { AddFileModal } from './components/AddFileModal';
import { Dropzone } from './components/Dropzone';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, FolderTree } from 'lucide-react';

export default function App() {
  // --- Core Data Structure Instances ---
  const treeRef = useRef<FileCategoryTree>(new FileCategoryTree());
  const queueRef = useRef<FileQueue<FileItem>>(new FileQueue<FileItem>());
  const stackRef = useRef<ActionStack>(new ActionStack(25));

  // --- React UI State ---
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAlgorithm, setSearchAlgorithm] = useState<'Linear Search' | 'Binary Search'>('Linear Search');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'category' | 'createdAt'>('name');
  const [sortAscending, setSortAscending] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [lastExplanation, setLastExplanation] = useState<DSExplanation | null>(null);
  const [undoCounter, setUndoCounter] = useState(0); // for triggering re-render on stack changes
  const [queueCounter, setQueueCounter] = useState(0); // for triggering re-render on queue changes

  // Initialize with sample college files on first render
  useEffect(() => {
    const initialSamples = createSampleFiles();
    processAndAddFiles(
      initialSamples.map(s => ({ name: s.name, size: s.size })),
      'Initialized with 8 sample college files for viva demonstration'
    );
  }, []);

  /**
   * Pipeline for adding incoming files:
   * 1. Extension Detection via Hash Map O(1)
   * 2. Enqueue into Queue (FIFO) O(1)
   * 3. Dequeue and Insert into Category Tree O(1)
   * 4. Record to ActionStack (LIFO) O(1)
   */
  const processAndAddFiles = (
    incoming: { name: string; size: number }[],
    customDescription?: string
  ) => {
    if (incoming.length === 0) return;

    const newFileItems: FileItem[] = [];
    const now = Date.now();

    // Step 1 & 2: Hash Map Lookup + Queue Enqueue
    for (let i = 0; i < incoming.length; i++) {
      const item = incoming[i];
      const ext = ExtensionHashMap.extractExtension(item.name);
      const category = extensionHashMap.classify(ext);

      const fileRecord: FileItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: item.name,
        extension: ext,
        size: item.size,
        category,
        createdAt: now + i
      };

      // Enqueue in FIFO Queue
      queueRef.current.enqueue(fileRecord);
      newFileItems.push(fileRecord);
    }

    // Step 3: Dequeue and Insert into Tree & Array
    const addedFromQueue: FileItem[] = [];
    while (!queueRef.current.isEmpty()) {
      const dequeued = queueRef.current.dequeue();
      if (dequeued) {
        treeRef.current.insertFile(dequeued);
        addedFromQueue.push(dequeued);
      }
    }

    // Step 4: Push to LIFO ActionStack for Undo capability
    const historyAction: HistoryAction = {
      id: `act-${Date.now()}`,
      type: incoming.length > 1 ? 'BATCH_ADD' : 'ADD_FILE',
      files: addedFromQueue,
      description: customDescription || (
        incoming.length === 1 
          ? `Added "${addedFromQueue[0].name}" to ${addedFromQueue[0].category}` 
          : `Added ${addedFromQueue.length} files in batch`
      ),
      timestamp: Date.now()
    };
    stackRef.current.push(historyAction);

    // Update state
    setFiles(prev => [...prev, ...addedFromQueue]);
    setUndoCounter(c => c + 1);
    setQueueCounter(c => c + 1);

    // Provide detailed college-level DS explanation
    const sample = addedFromQueue[0];
    setLastExplanation({
      operation: incoming.length === 1 ? 'Enqueue & Insert File' : 'Batch Ingestion',
      dataStructure: 'Queue (FIFO) ➔ Hash Map ➔ Tree ➔ Stack (LIFO)',
      description: (
        <span>
          Extracted extension <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">.{sample.extension}</code> ➔ 
          Hash Map looked up category <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">{sample.category}</code> in <strong>O(1)</strong> ➔ 
          Buffered in FIFO Queue ➔ Inserted as leaf into <strong>FileCategoryTree</strong> ➔ 
          Pushed record to <strong>ActionStack (LIFO)</strong> for Undo.
        </span>
      ) as any,
      complexity: 'O(1) per file',
      timestamp: Date.now()
    });
  };

  /**
   * Undo Action using LIFO Stack
   */
  const handleUndo = () => {
    if (stackRef.current.isEmpty()) return;

    const action = stackRef.current.pop();
    if (!action) return;

    if (action.type === 'ADD_FILE' || action.type === 'BATCH_ADD') {
      // Revert addition by removing files from Tree and Array
      const removedIds = new Set(action.files.map(f => f.id));
      for (const f of action.files) {
        treeRef.current.removeFile(f.id);
      }
      setFiles(prev => prev.filter(f => !removedIds.has(f.id)));

      setLastExplanation({
        operation: 'Undo (Stack Pop)',
        dataStructure: 'Stack (LIFO)',
        description: `Popped topmost action "${action.description}" from ActionStack in O(1). Removed ${action.files.length} file(s) from Category Tree and Dynamic Array.`,
        complexity: 'O(1) pop',
        timestamp: Date.now()
      });
    } else if (action.type === 'DELETE_FILE') {
      // Revert deletion by re-inserting the deleted file
      const fileToRestore = action.files[0];
      if (fileToRestore) {
        treeRef.current.insertFile(fileToRestore);
        setFiles(prev => [...prev, fileToRestore]);

        setLastExplanation({
          operation: 'Undo Delete (Stack Pop)',
          dataStructure: 'Stack (LIFO)',
          description: `Popped DELETE action from ActionStack. Restored file "${fileToRestore.name}" back into Category Tree under /${fileToRestore.category}.`,
          complexity: 'O(1) pop + O(1) tree insert',
          timestamp: Date.now()
        });
      }
    } else if (action.type === 'CLEAR_ALL') {
      // Revert clear all by restoring all cleared files
      for (const f of action.files) {
        treeRef.current.insertFile(f);
      }
      setFiles(action.files);

      setLastExplanation({
        operation: 'Undo Clear All (Stack Pop)',
        dataStructure: 'Stack (LIFO)',
        description: `Popped CLEAR_ALL action from ActionStack. Restored all ${action.files.length} file records back into the Category Tree hierarchy.`,
        complexity: 'O(1) pop',
        timestamp: Date.now()
      });
    }

    setUndoCounter(c => c + 1);
  };

  /**
   * Delete individual file: removes from tree and pushes to undo stack
   */
  const handleDeleteFile = (file: FileItem) => {
    treeRef.current.removeFile(file.id);
    setFiles(prev => prev.filter(f => f.id !== file.id));

    // Push delete action to Stack so it can be undone
    stackRef.current.push({
      id: `del-${Date.now()}`,
      type: 'DELETE_FILE',
      files: [file],
      description: `Deleted "${file.name}"`,
      timestamp: Date.now()
    });

    setUndoCounter(c => c + 1);

    setLastExplanation({
      operation: 'Delete File',
      dataStructure: 'Tree Leaf Removal ➔ Stack Push',
      description: `Removed "${file.name}" leaf node from /${file.category} in FileCategoryTree. Pushed DELETE_FILE action to ActionStack (LIFO) to allow instant Undo.`,
      complexity: 'O(1) push',
      timestamp: Date.now()
    });
  };

  /**
   * Clear all files (can be undone with Stack!)
   */
  const handleClearAll = () => {
    if (files.length === 0) return;

    const previousFiles = [...files];
    treeRef.current.clearAllFiles();
    setFiles([]);

    stackRef.current.push({
      id: `clear-${Date.now()}`,
      type: 'CLEAR_ALL',
      files: previousFiles,
      description: `Cleared all ${previousFiles.length} files`,
      timestamp: Date.now()
    });

    setUndoCounter(c => c + 1);

    setLastExplanation({
      operation: 'Clear All Files',
      dataStructure: 'Tree Reset ➔ Stack Push (LIFO)',
      description: `Cleared all leaf nodes in FileCategoryTree. Preserved ${previousFiles.length} file records on the ActionStack so you can click Undo to restore them!`,
      complexity: 'O(1) push',
      timestamp: Date.now()
    });
  };

  /**
   * Load sample files helper
   */
  const handleLoadSamples = () => {
    const samples = createSampleFiles();
    processAndAddFiles(
      samples.map(s => ({ name: s.name, size: s.size })),
      'Loaded 8 college sample files'
    );
  };

  /**
   * Step Dequeue test helper for viva demonstration
   */
  const handleStepDequeue = () => {
    if (queueRef.current.isEmpty()) return;
    const dequeued = queueRef.current.dequeue();
    if (dequeued) {
      treeRef.current.insertFile(dequeued);
      setFiles(prev => [...prev, dequeued]);
      setQueueCounter(c => c + 1);
    }
  };

  // --- Filtering, Searching & Sorting Execution ---

  // 1. Filter by Category
  const categoryFilteredFiles = useMemo(() => {
    if (selectedCategory === 'all') {
      return files;
    }
    return files.filter(f => f.category === selectedCategory);
  }, [files, selectedCategory]);

  // 2. Search Execution (Linear Search vs Binary Search)
  const { searchedFiles, searchMetrics } = useMemo<{
    searchedFiles: FileItem[];
    searchMetrics?: { comparisons: number; timeMs: number; complexity: string };
  }>(() => {
    if (!searchQuery.trim()) {
      return { searchedFiles: categoryFilteredFiles };
    }

    if (searchAlgorithm === 'Linear Search') {
      const res = FileAlgorithms.linearSearch(categoryFilteredFiles, searchQuery);
      return {
        searchedFiles: res.results,
        searchMetrics: {
          comparisons: res.comparisonsCount,
          timeMs: res.executionTimeMs,
          complexity: res.timeComplexity
        }
      };
    } else {
      // Binary Search requires array sorted by name first
      const sortedByName = [...categoryFilteredFiles].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      const res = FileAlgorithms.binarySearchByName(sortedByName, searchQuery);
      return {
        searchedFiles: res.results,
        searchMetrics: {
          comparisons: res.comparisonsCount,
          timeMs: res.executionTimeMs,
          complexity: res.timeComplexity
        }
      };
    }
  }, [categoryFilteredFiles, searchQuery, searchAlgorithm]);

  // 3. Sorting Execution
  const sortedFiles = useMemo(() => {
    const { sorted } = FileAlgorithms.sortFiles(searchedFiles, sortBy, sortAscending);
    return sorted;
  }, [searchedFiles, sortBy, sortAscending]);

  const handleSortChange = (field: 'name' | 'size' | 'category' | 'createdAt') => {
    if (sortBy === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(field);
      setSortAscending(true);
    }

    setLastExplanation({
      operation: `Sort by ${field.toUpperCase()}`,
      dataStructure: 'Dynamic Array Sorting',
      description: `Sorted ${searchedFiles.length} file elements by ${field} in ${sortAscending ? 'descending' : 'ascending'} order using comparator sorting with O(n log n) time complexity.`,
      complexity: 'O(n log n)',
      timestamp: Date.now()
    });
  };

  return (
    <Dropzone onFilesDropped={processAndAddFiles}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        
        {/* Navigation Bar */}
        <Navbar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onLoadSamples={handleLoadSamples}
          onUndo={handleUndo}
          onClearAll={handleClearAll}
          onOpenVivaModal={() => setIsVivaModalOpen(true)}
          canUndo={!stackRef.current.isEmpty()}
          undoCount={stackRef.current.size()}
          totalFiles={files.length}
        />

        {/* Main Content Dashboard */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Live Data Structure Operation Notification Banner */}
          <DsOperationBanner lastExplanation={lastExplanation} />

          {/* Statistics & Category Cards (Documents, Images, Videos, Audio, Other) */}
          <StatsCards
            files={files}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Core Visualizer: Tree, Queue, Stack, Hash Map */}
          <DataStructureVisualizer
            treeRoot={treeRef.current.getRoot()}
            queue={queueRef.current}
            stack={stackRef.current}
            onDequeueStep={handleStepDequeue}
            onUndo={handleUndo}
          />

          {/* File Organizer Table / Cards View with Search & Sort */}
          <section id="file-management-section">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span>
                  {selectedCategory === 'all' ? 'All Files' : `${selectedCategory.toUpperCase()} Files`}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({sortedFiles.length} visible)
                </span>
              </h2>

              <span className="text-xs text-slate-500 font-medium">
                Click any category above to filter • Drag & drop files anywhere
              </span>
            </div>

            <FileList
              files={sortedFiles}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchAlgorithm={searchAlgorithm}
              onToggleSearchAlgorithm={setSearchAlgorithm}
              searchMetrics={searchMetrics}
              sortBy={sortBy}
              sortAscending={sortAscending}
              onSortChange={handleSortChange}
              onDeleteFile={handleDeleteFile}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </section>

          {/* Quick Viva & College Presentation Callout */}
          <section className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>2nd-Year B.Tech CSE Viva Reference</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Data Structures Project Viva Defense Guide
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review time & space complexity tables for Array, Stack, Queue, Tree, and Hash Map, plus answers to top examiner viva questions.
                </p>
              </div>

              <button
                id="btn-open-viva-footer"
                onClick={() => setIsVivaModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <span>Open Viva Guide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">File Organizer Using Data Structure</span> • College Mini-Project
            </div>
            <div className="flex items-center gap-3">
              <span>Pure Client-side • No Backend • Local In-Memory Data Structures</span>
            </div>
          </div>
        </footer>

        {/* Add Files Modal */}
        <AddFileModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddFiles={processAndAddFiles}
        />

        {/* Viva Theory & Complexity Modal */}
        <VivaTheoryModal
          isOpen={isVivaModalOpen}
          onClose={() => setIsVivaModalOpen(false)}
        />

      </div>
    </Dropzone>
  );
}
