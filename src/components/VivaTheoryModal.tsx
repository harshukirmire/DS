import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Layers, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { DS_VIVA_REFERENCE, VIVA_QUESTIONS } from '../dataStructures/FileAlgorithms';

interface VivaTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaTheoryModal: React.FC<VivaTheoryModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'questions'>('matrix');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="viva-modal-dialog"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Data Structures & Viva Exam Reference
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                2nd Year B.Tech CSE Mini-Project Analysis & Complexity Guide
              </p>
            </div>
          </div>

          <button
            id="close-viva-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-navigation */}
        <div className="px-5 pt-3 border-b border-slate-200 flex gap-4 bg-white">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'matrix'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Data Structures & Time Complexity</span>
          </button>

          <button
            onClick={() => setActiveSubTab('questions')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'questions'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Top Viva Questions & Answers</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {activeSubTab === 'matrix' ? (
            <div className="space-y-6">
              
              {/* Summary Statement */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 leading-relaxed">
                <strong>Project Architectural Overview:</strong> This application demonstrates the synthesis of 5 core data structures working in tandem: files are buffered through a <strong>Queue (FIFO)</strong>, classified instantly via a <strong>Hash Map (Key-Value)</strong>, organized into a hierarchical <strong>Tree (N-ary)</strong>, displayed and searched in a <strong>Dynamic Array</strong>, and tracked for reversibility via a <strong>Stack (LIFO)</strong>.
              </div>

              {/* Data Structures Cards */}
              <div className="space-y-4">
                {DS_VIVA_REFERENCE.map((ds, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wide">
                          {ds.dataStructure}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {ds.name}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Role: {ds.role}
                      </div>
                    </div>

                    {/* Operations Table */}
                    <div className="p-3.5">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                            <th className="pb-2">Operation</th>
                            <th className="pb-2">Time Complexity</th>
                            <th className="pb-2">Space Complexity</th>
                            <th className="pb-2">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {ds.operations.map((op, opIdx) => (
                            <tr key={opIdx} className="hover:bg-slate-50/50">
                              <td className="py-2 font-medium text-slate-800">{op.operation}</td>
                              <td className="py-2 font-mono font-bold text-emerald-700">{op.timeComplexity}</td>
                              <td className="py-2 font-mono text-slate-600">{op.spaceComplexity}</td>
                              <td className="py-2 text-slate-600">{op.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* OS Real-world analogy */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Real OS Analogy:</strong> {ds.realWorldAnalogy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Viva Questions & Answers */
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Click on any question to view the technical answer formulated for examiners:
              </div>

              {VIVA_QUESTIONS.map((item, qIdx) => {
                const isExpanded = expandedQuestion === qIdx;
                return (
                  <div
                    key={qIdx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-all"
                  >
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : qIdx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] flex items-center justify-center font-mono shrink-0">
                          {qIdx + 1}
                        </span>
                        {item.q}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-700 leading-relaxed font-medium">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>B.Tech Computer Science and Engineering</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
