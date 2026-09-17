import React, { useState } from 'react';
import { 
  FolderTree, 
  Layers, 
  ArrowDown, 
  ArrowRight, 
  ListOrdered, 
  Table, 
  Hash, 
  ChevronRight, 
  ChevronDown, 
  Info,
  CheckCircle2,
  FileText,
  Clock,
  Play,
  File
} from 'lucide-react';
import { FileCategory, FileItem, HistoryAction, TreeNode } from '../dataStructures/types';
import { formatFileSize, getCategoryColor } from '../utils/formatters';
import { FileQueue } from '../dataStructures/FileQueue';
import { ActionStack } from '../dataStructures/ActionStack';
import { ExtensionHashMap, extensionHashMap } from '../dataStructures/ExtensionHashMap';

interface DataStructureVisualizerProps {
  treeRoot: TreeNode;
  queue: FileQueue<FileItem>;
  stack: ActionStack;
  onDequeueStep?: () => void;
  onUndo?: () => void;
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({
  treeRoot,
  queue,
  stack,
  onDequeueStep,
  onUndo
}) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'queue' | 'stack' | 'hashmap'>('tree');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-document': true,
    'cat-image': true,
    'cat-video': true,
    'cat-audio': true,
    'cat-other': true
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const queueItems = queue.toArray();
  const stackItems = stack.toArray();
  const hashMapEntries = extensionHashMap.getEntries().slice(0, 24); // Show top common extensions

  return (
    <div id="ds-visualizer-container" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Visualizer Tab Navigation */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Data Structures Live Visualizer
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden sm:inline">Interactive representations for Viva</span>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
          <button
            id="tab-tree-visualizer"
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tree' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>N-ary Tree</span>
          </button>

          <button
            id="tab-queue-visualizer"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'queue' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Queue (FIFO)</span>
            {queueItems.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-bold">
                {queueItems.length}
              </span>
            )}
          </button>

          <button
            id="tab-stack-visualizer"
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stack' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Stack (LIFO)</span>
            {stackItems.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-bold">
                {stackItems.length}
              </span>
            )}
          </button>

          <button
            id="tab-hashmap-visualizer"
            onClick={() => setActiveTab('hashmap')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hashmap' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Hash Map O(1)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Tree Visualizer */}
      {activeTab === 'tree' && (
        <div id="tree-visualization-view" className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">Root Node:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border text-blue-600 font-bold">/ (Root)</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-700">Hierarchy Depth:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border text-slate-700">Height: 2 (Root → Categories → Files)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Traversal: Pre-order (Parent ➔ Children)
            </div>
          </div>

          {/* Graphical Tree Rendering */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
            {/* Root Node */}
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>📂 / (Root Directory Node)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                Total Categories: {treeRoot.children.length}
              </span>
            </div>

            {/* Category Nodes */}
            <div className="ml-4 pl-4 border-l-2 border-slate-700 mt-2 space-y-3">
              {treeRoot.children.map((catNode, idx) => {
                const isLastCat = idx === treeRoot.children.length - 1;
                const isExpanded = expandedCategories[catNode.id] ?? true;
                const fileCount = catNode.children.length;

                return (
                  <div key={catNode.id} className="relative">
                    {/* Node Header */}
                    <div 
                      onClick={() => toggleCategory(catNode.id)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/80 p-1.5 rounded-md transition-colors inline-flex group"
                    >
                      <span className="text-slate-500">├──</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        📁 /{catNode.name}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {fileCount} {fileCount === 1 ? 'file' : 'files'}
                      </span>
                    </div>

                    {/* Leaf Nodes (Files) */}
                    {isExpanded && (
                      <div className="ml-6 pl-4 border-l-2 border-slate-800 mt-1 space-y-1">
                        {catNode.children.length === 0 ? (
                          <div className="text-slate-500 text-[11px] py-0.5 italic flex items-center gap-1">
                            <span>└─</span>
                            <span>(Empty category branch - no leaf nodes)</span>
                          </div>
                        ) : (
                          catNode.children.map((fileLeaf, leafIdx) => {
                            const isLastLeaf = leafIdx === catNode.children.length - 1;
                            return (
                              <div key={fileLeaf.id} className="flex items-center gap-2 text-slate-300 py-0.5 hover:text-white transition-colors">
                                <span className="text-slate-600">{isLastLeaf ? '└──' : '├──'}</span>
                                <span className="text-blue-300">📄 {fileLeaf.name}</span>
                                {fileLeaf.fileData && (
                                  <span className="text-[10px] text-slate-500 font-sans">
                                    ({formatFileSize(fileLeaf.fileData.size)})
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            💡 <strong>Viva Point:</strong> Operating systems (Linux VFS, Windows NTFS) structure directories as N-ary Trees where inner nodes are directories and leaf nodes are files.
          </p>
        </div>
      )}

      {/* Tab 2: Queue (FIFO) Visualizer */}
      {activeTab === 'queue' && (
        <div id="queue-visualization-view" className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
            <div>
              <span className="font-semibold text-blue-900">Principle: </span>
              <span className="text-blue-800">FIFO (First-In, First-Out) — Files enter at REAR, processed from FRONT.</span>
            </div>
            <div className="font-mono text-xs font-bold text-blue-700">
              Queue Size: {queueItems.length}
            </div>
          </div>

          {/* Visual Queue Pipeline */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className="flex items-center gap-1 text-emerald-600">
                <span>◀ FRONT (Exit / Dequeue)</span>
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span>REAR (Entry / Enqueue) ◀</span>
              </span>
            </div>

            {queueItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium">Queue is currently empty</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When you select or drop new files, they get enqueued here for batch processing.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {queueItems.map((item, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queueItems.length - 1;
                  return (
                    <div
                      key={item.id}
                      className={`relative min-w-44 p-3 rounded-xl border bg-white shadow-xs shrink-0 transition-all ${
                        isFront ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
                      }`}
                    >
                      {/* Pointer Badges */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          Pos [{idx}]
                        </span>
                        {isFront && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            FRONT
                          </span>
                        )}
                        {isRear && !isFront && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                            REAR
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-xs text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                        <span>.{item.extension}</span>
                        <span>{formatFileSize(item.size)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>Enqueue: <code>O(1)</code> | Dequeue: <code>O(1)</code></span>
            <span>Used for: Background I/O spooling and sequential file validation</span>
          </div>
        </div>
      )}

      {/* Tab 3: Stack (LIFO) Visualizer */}
      {activeTab === 'stack' && (
        <div id="stack-visualization-view" className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
            <div>
              <span className="font-semibold text-amber-900">Principle: </span>
              <span className="text-amber-800">LIFO (Last-In, First-Out) — Most recent user action resides at TOP.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-900">
                Stack Depth: {stackItems.length}
              </span>
              {stackItems.length > 0 && onUndo && (
                <button
                  onClick={onUndo}
                  className="px-2 py-0.5 rounded text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  Pop Top (Undo)
                </button>
              )}
            </div>
          </div>

          {/* Visual Vertical Stack */}
          <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
            {stackItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium">Stack is empty</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Perform an action like adding a file or deleting one to see it pushed onto the stack.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-center text-xs font-bold text-amber-700 flex items-center justify-center gap-1.5 pb-1">
                  <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>TOP OF STACK (TOS)</span>
                </div>

                {stackItems.map((action, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={action.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isTop
                          ? 'bg-amber-50 border-amber-300 shadow-sm ring-2 ring-amber-100'
                          : 'bg-white border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold font-mono text-slate-800">
                          {action.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Index: {stackItems.length - 1 - idx}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {action.description}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}

                <div className="text-center text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200">
                  ── BOTTOM OF STACK ──
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>Push: <code>O(1)</code> | Pop: <code>O(1)</code> | Peek: <code>O(1)</code></span>
            <span>Used for: Single-step and multi-step Undo system</span>
          </div>
        </div>
      )}

      {/* Tab 4: Hash Map Visualizer */}
      {activeTab === 'hashmap' && (
        <div id="hashmap-visualization-view" className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
            <div>
              <span className="font-semibold text-emerald-900">Concept: </span>
              <span className="text-emerald-800">Hash Table / Key-Value Map — Constant time O(1) file category resolution.</span>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-800">
              Registered Extensions: {extensionHashMap.getCategoryCount()}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {hashMapEntries.map(([ext, cat]) => {
              const color = getCategoryColor(cat);
              return (
                <div
                  key={ext}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between text-xs"
                >
                  <span className="font-mono font-bold text-slate-800">.{ext}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${color.badge}`}>
                    {cat}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            💡 <strong>Viva Point:</strong> When a file like <code>project.docx</code> is added, the string <code>"docx"</code> is hashed directly to retrieve <code>"document"</code> in O(1) average time complexity, eliminating slow linear if/else scans.
          </p>
        </div>
      )}

    </div>
  );
};
