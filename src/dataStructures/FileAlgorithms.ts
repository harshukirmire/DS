import { ComplexityInfo, FileCategory, FileItem } from './types';

/**
 * FileAlgorithms & Complexity Analysis
 * 
 * Provides search, sorting, and complexity metrics for college viva demonstration.
 */

export interface SearchResult {
  results: FileItem[];
  algorithmUsed: 'Linear Search' | 'Binary Search';
  comparisonsCount: number;
  timeComplexity: string;
  executionTimeMs: number;
}

export class FileAlgorithms {
  /**
   * Linear Search: Sequentially scans through each file item.
   * Time Complexity: O(n)
   */
  public static linearSearch(files: FileItem[], query: string): SearchResult {
    const startTime = performance.now();
    const cleanQuery = query.toLowerCase().trim();
    let comparisons = 0;
    const matches: FileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      comparisons++;
      const file = files[i];
      if (
        file.name.toLowerCase().includes(cleanQuery) ||
        file.extension.toLowerCase().includes(cleanQuery) ||
        file.category.toLowerCase().includes(cleanQuery)
      ) {
        matches.push(file);
      }
    }

    const endTime = performance.now();
    return {
      results: matches,
      algorithmUsed: 'Linear Search',
      comparisonsCount: comparisons,
      timeComplexity: 'O(n)',
      executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3)))
    };
  }

  /**
   * Binary Search: Divides search interval in half on a sorted array of files.
   * Applicable when searching for exact or prefix name matches on sorted names.
   * Time Complexity: O(log n)
   */
  public static binarySearchByName(sortedFiles: FileItem[], targetName: string): SearchResult {
    const startTime = performance.now();
    const cleanTarget = targetName.toLowerCase().trim();
    let low = 0;
    let high = sortedFiles.length - 1;
    let comparisons = 0;
    const matches: FileItem[] = [];

    while (low <= high) {
      comparisons++;
      const mid = Math.floor((low + high) / 2);
      const midVal = sortedFiles[mid].name.toLowerCase();

      if (midVal === cleanTarget || midVal.startsWith(cleanTarget)) {
        // Found match, expand around mid to catch duplicate prefix matches
        matches.push(sortedFiles[mid]);

        // check left
        let l = mid - 1;
        while (l >= 0 && sortedFiles[l].name.toLowerCase().startsWith(cleanTarget)) {
          comparisons++;
          matches.unshift(sortedFiles[l]);
          l--;
        }

        // check right
        let r = mid + 1;
        while (r < sortedFiles.length && sortedFiles[r].name.toLowerCase().startsWith(cleanTarget)) {
          comparisons++;
          matches.push(sortedFiles[r]);
          r++;
        }
        break;
      } else if (midVal < cleanTarget) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const endTime = performance.now();
    return {
      results: matches,
      algorithmUsed: 'Binary Search',
      comparisonsCount: comparisons,
      timeComplexity: 'O(log n)',
      executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3)))
    };
  }

  /**
   * Sorting files by various criteria
   * Uses Merge/TimSort variant with O(n log n) average & worst case.
   */
  public static sortFiles(
    files: FileItem[],
    criteria: 'name' | 'size' | 'category' | 'createdAt',
    ascending: boolean = true
  ): { sorted: FileItem[]; comparisons: number; timeComplexity: string } {
    let comparisons = 0;
    const cloned = [...files];

    cloned.sort((a, b) => {
      comparisons++;
      let comparison = 0;
      if (criteria === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (criteria === 'size') {
        comparison = a.size - b.size;
      } else if (criteria === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (criteria === 'createdAt') {
        comparison = a.createdAt - b.createdAt;
      }
      return ascending ? comparison : -comparison;
    });

    return {
      sorted: cloned,
      comparisons,
      timeComplexity: 'O(n log n)'
    };
  }
}

/**
 * College Viva / Data Structures Reference Matrix
 */
export const DS_VIVA_REFERENCE: ComplexityInfo[] = [
  {
    name: 'Dynamic Array / List',
    dataStructure: 'Array (Contiguous Memory)',
    role: 'Primary storage for active file records and indexed table rendering',
    operations: [
      { operation: 'Access by Index', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Direct random access via base address + offset' },
      { operation: 'Linear Search', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', description: 'Sequential traversal comparing each file item' },
      { operation: 'Binary Search', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', description: 'Divide-and-conquer on sorted file records' },
      { operation: 'Quick / Tim Sort', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', description: 'Sorting by file name, size, type, or date' }
    ],
    realWorldAnalogy: 'Like the File Allocation Table (FAT) array or directory record table in an operating system.'
  },
  {
    name: 'Stack (LIFO)',
    dataStructure: 'Stack (Last In, First Out)',
    role: 'Undo operation history tracking recent file additions, deletions, or clearing',
    operations: [
      { operation: 'Push (Record Action)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Appends executed action to top of stack' },
      { operation: 'Pop (Undo Action)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Pops latest action to revert system state' },
      { operation: 'Peek (Top of Stack)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Views the most recent action without removing it' }
    ],
    realWorldAnalogy: 'Identical to the Undo buffer (Ctrl+Z) in text editors, OS command history, and call stacks.'
  },
  {
    name: 'Queue (FIFO)',
    dataStructure: 'Queue (First In, First Out)',
    role: 'File processing pipeline for batch additions, ingestion, and validation',
    operations: [
      { operation: 'Enqueue (Add to Tail)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Adds new incoming file to the rear pointer' },
      { operation: 'Dequeue (Process Front)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Extracts head file to process, classify, and place' },
      { operation: 'Front / Peek', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Inspects upcoming file awaiting organization' }
    ],
    realWorldAnalogy: 'Like OS Print Spoolers, Disk I/O Request Queues, and Message Queues in operating systems.'
  },
  {
    name: 'Hierarchical Tree',
    dataStructure: 'N-ary Tree (General Tree)',
    role: 'Folder & Category hierarchy (Root -> Category Folders -> File Leaves)',
    operations: [
      { operation: 'Insert Leaf (File)', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Adds file node directly under matching category node' },
      { operation: 'Delete Leaf', timeComplexity: 'O(k)', spaceComplexity: 'O(1)', description: 'Traverses category children to remove file node' },
      { operation: 'Pre-order Traversal', timeComplexity: 'O(N)', spaceComplexity: 'O(h)', description: 'Visits Root, Category subtrees, then file leaves' }
    ],
    realWorldAnalogy: 'Like Linux Virtual File System (VFS) directory tree (/, /bin, /home) and Windows NTFS B-Tree directory hierarchy.'
  },
  {
    name: 'Hash Table / Map',
    dataStructure: 'Hash Map (Key-Value)',
    role: 'Instant file extension to category classification (.pdf -> Document)',
    operations: [
      { operation: 'Lookup (.ext -> Category)', timeComplexity: 'O(1) avg', spaceComplexity: 'O(1)', description: 'Calculates hash of extension string to find category' },
      { operation: 'Insert New Extension', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Registers a new file extension in the hash table' }
    ],
    realWorldAnalogy: 'Like OS File Association registries (e.g. Windows Registry file handler maps, MIME type databases).'
  }
];

export const VIVA_QUESTIONS = [
  {
    q: 'Why is a Tree data structure ideal for file organization?',
    a: 'File systems naturally form a hierarchical parent-child relationship. The Root node (/) branches into folders/categories, which in turn hold files (leaf nodes). Trees provide clean path resolution, namespace partitioning, and recursive directory traversal.'
  },
  {
    q: 'How does the Queue (FIFO) help in file processing?',
    a: 'When a user selects multiple files at once, the Queue buffers them so they can be parsed, scanned, and categorized sequentially without freezing the UI or dropping files. The first file selected is the first file categorized and stored.'
  },
  {
    q: 'Why is a Stack used for the Undo feature?',
    a: 'Stack follows Last-In, First-Out (LIFO). The most recent action performed by the user is placed on the top of the stack. When Undo is triggered, pop() immediately retrieves and reverts that most recent action, which is the exact behavior expected.'
  },
  {
    q: 'What is the time complexity of categorizing a file using extension?',
    a: 'With a Hash Table / Map, average time complexity is O(1) constant time because the extension string is converted into a hash code that points directly to the bucket containing its assigned category.'
  },
  {
    q: 'What is the difference between Linear Search and Binary Search in this project?',
    a: 'Linear Search checks elements one by one from start to end with O(n) time complexity and works on unsorted lists. Binary Search repeatedly divides a sorted list in half with O(log n) time complexity, requiring significantly fewer comparisons as file count grows.'
  }
];
