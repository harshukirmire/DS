import { FileCategory, FileItem, TreeNode } from './types';

/**
 * FileCategoryTree
 * 
 * College DS Concept: Hierarchical Tree (N-ary Tree)
 * Purpose: Mimics file system directory hierarchies (like in Linux VFS or Windows NTFS)
 * where the root directory contains category subfolders, and each category
 * contains file leaf nodes.
 * 
 * Structure:
 *           [ Root: / ]
 *          /    |    \    \      \
 *     [Docs] [Images] [Videos] [Audio] [Other]
 *      /   \    |        |        |       |
 *   [f1]  [f2] [f3]     [f4]     [f5]    [f6]
 */
export class FileCategoryTree {
  private root: TreeNode;

  constructor() {
    this.root = {
      id: 'root-node',
      name: 'Root (/)' ,
      type: 'root',
      children: []
    };
    this.initializeCategoryNodes();
  }

  private initializeCategoryNodes(): void {
    const categories: { id: FileCategory; name: string }[] = [
      { id: 'document', name: 'Documents' },
      { id: 'image', name: 'Images' },
      { id: 'video', name: 'Videos' },
      { id: 'audio', name: 'Audio' },
      { id: 'other', name: 'Other' }
    ];

    this.root.children = categories.map(cat => ({
      id: `cat-${cat.id}`,
      name: cat.name,
      type: 'category',
      category: cat.id,
      children: []
    }));
  }

  /**
   * Inserts a file into its corresponding category branch.
   * Time Complexity: O(C + k) where C is number of categories (constant 5)
   * and k is leaf insertion. Total time: O(1).
   */
  public insertFile(file: FileItem): boolean {
    const categoryNode = this.root.children.find(
      child => child.type === 'category' && child.category === file.category
    );

    if (!categoryNode) {
      return false;
    }

    // Check if file already exists in this category
    const existingIndex = categoryNode.children.findIndex(
      leaf => leaf.fileData?.id === file.id
    );

    const leafNode: TreeNode = {
      id: `file-${file.id}`,
      name: file.name,
      type: 'file',
      category: file.category,
      fileData: file,
      children: []
    };

    if (existingIndex >= 0) {
      categoryNode.children[existingIndex] = leafNode;
    } else {
      categoryNode.children.push(leafNode);
    }

    return true;
  }

  /**
   * Removes a file by ID from the tree.
   * Traverses category nodes to find and remove the matching leaf node.
   */
  public removeFile(fileId: string): FileItem | undefined {
    for (const categoryNode of this.root.children) {
      const index = categoryNode.children.findIndex(
        leaf => leaf.fileData?.id === fileId
      );
      if (index !== -1) {
        const removed = categoryNode.children.splice(index, 1)[0];
        return removed.fileData;
      }
    }
    return undefined;
  }

  /**
   * Pre-order traversal to gather all files in the tree.
   * Time Complexity: O(N) where N is total number of nodes.
   */
  public getAllFiles(): FileItem[] {
    const files: FileItem[] = [];

    const traverse = (node: TreeNode) => {
      if (node.type === 'file' && node.fileData) {
        files.push(node.fileData);
      }
      for (const child of node.children) {
        traverse(child);
      }
    };

    traverse(this.root);
    return files;
  }

  /**
   * Get files for a specific category node.
   */
  public getFilesByCategory(category: FileCategory): FileItem[] {
    const categoryNode = this.root.children.find(
      child => child.type === 'category' && child.category === category
    );

    if (!categoryNode) return [];
    return categoryNode.children
      .map(child => child.fileData)
      .filter((item): item is FileItem => Boolean(item));
  }

  /**
   * Calculates total nodes in the tree (Root + Categories + Files).
   */
  public getTotalNodeCount(): number {
    let count = 0;
    const countNodes = (node: TreeNode) => {
      count++;
      for (const child of node.children) {
        countNodes(child);
      }
    };
    countNodes(this.root);
    return count;
  }

  /**
   * Returns maximum depth of the tree (Root is 0, Categories is 1, Files is 2).
   */
  public getTreeHeight(): number {
    return 2; // Fixed 3-level hierarchy for this college project
  }

  /**
   * Returns root node for UI tree rendering.
   */
  public getRoot(): TreeNode {
    return this.root;
  }

  /**
   * Clear all file leaf nodes while preserving category nodes.
   */
  public clearAllFiles(): void {
    for (const catNode of this.root.children) {
      catNode.children = [];
    }
  }
}
