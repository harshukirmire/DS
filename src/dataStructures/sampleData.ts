import { FileItem } from './types';
import { extensionHashMap, ExtensionHashMap } from './ExtensionHashMap';

export const SAMPLE_FILES: Omit<FileItem, 'id' | 'category' | 'extension' | 'createdAt'>[] = [
  {
    name: 'Data_Structures_Lecture_Notes.pdf',
    size: 2457600 // ~2.4 MB
  },
  {
    name: 'Binary_Search_Tree_Code.cpp',
    size: 14336 // ~14 KB
  },
  {
    name: 'Campus_Hackathon_Banner.png',
    size: 1887436 // ~1.8 MB
  },
  {
    name: 'Viva_Project_Demonstration.mp4',
    size: 47185920 // ~45 MB
  },
  {
    name: 'Professor_Audio_Explanation.mp3',
    size: 4194304 // ~4 MB
  },
  {
    name: 'Operating_Systems_Lab_Manual.docx',
    size: 614400 // ~600 KB
  },
  {
    name: 'System_Architecture_Diagram.jpg',
    size: 2097152 // ~2 MB
  },
  {
    name: 'Database_Queries_Sample.sql',
    size: 28672 // ~28 KB
  }
];

export function createSampleFiles(): FileItem[] {
  const now = Date.now();
  return SAMPLE_FILES.map((sample, idx) => {
    const ext = ExtensionHashMap.extractExtension(sample.name);
    const category = extensionHashMap.classify(ext);
    return {
      id: `sample-${idx + 1}-${Date.now()}`,
      name: sample.name,
      extension: ext,
      size: sample.size,
      category,
      createdAt: now - (idx * 3600000) // staggered times
    };
  });
}
