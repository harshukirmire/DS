import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFilesDropped: (files: { name: string; size: number }[]) => void;
  children: React.ReactNode;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesDropped, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dropped = e.dataTransfer.files;
    if (dropped && dropped.length > 0) {
      const files: { name: string; size: number }[] = [];
      for (let i = 0; i < dropped.length; i++) {
        files.push({
          name: dropped[i].name,
          size: dropped[i].size
        });
      }
      onFilesDropped(files);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative min-h-screen"
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-blue-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white border-4 border-dashed border-white m-4 rounded-3xl pointer-events-none">
          <UploadCloud className="w-16 h-16 animate-bounce mb-3" />
          <h2 className="text-2xl font-bold">Drop files here to organize</h2>
          <p className="text-sm text-blue-100 mt-1">
            Files will enter the processing Queue (FIFO) and be categorized into the Hierarchical Tree.
          </p>
        </div>
      )}
      {children}
    </div>
  );
};
