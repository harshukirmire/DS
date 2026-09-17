export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'other';

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  size: number; // in bytes
  category: FileCategory;
  createdAt: number;
  mimeType?: string;
}

export type ActionType = 'ADD_FILE' | 'DELETE_FILE' | 'CLEAR_ALL' | 'BATCH_ADD';

export interface HistoryAction {
  id: string;
  type: ActionType;
  files: FileItem[];
  description: string;
  timestamp: number;
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'root' | 'category' | 'file';
  category?: FileCategory;
  fileData?: FileItem;
  children: TreeNode[];
}

export interface DSExplanation {
  operation: string;
  dataStructure: string;
  description: string;
  complexity: string;
  timestamp: number;
}

export interface ComplexityInfo {
  name: string;
  dataStructure: string;
  role: string;
  operations: {
    operation: string;
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
  }[];
  realWorldAnalogy: string;
}
