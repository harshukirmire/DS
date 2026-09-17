import { FileItem } from './types';

/**
 * FileQueue
 * 
 * College DS Concept: Queue (FIFO - First In, First Out)
 * Purpose: Simulates an OS I/O or background processing queue where files
 * are queued up upon selection and processed sequentially.
 * 
 * Operations:
 * - enqueue(item): O(1) - Inserts at the rear
 * - dequeue(): O(1) amortized - Removes from front
 * - peek() / front(): O(1) - Views the item at the front without removal
 * - isEmpty(): O(1)
 * - size(): O(1)
 */
export class FileQueue<T = FileItem> {
  private items: T[] = [];
  private headIndex: number = 0;

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
    this.headIndex = 0;
  }

  /**
   * Enqueue: Adds an item to the rear of the queue.
   * Time Complexity: O(1)
   */
  public enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Batch Enqueue: Adds multiple items to the rear of the queue.
   */
  public enqueueBatch(items: T[]): void {
    for (const item of items) {
      this.enqueue(item);
    }
  }

  /**
   * Dequeue: Removes and returns the item at the front of the queue.
   * Time Complexity: O(1) using index pointer (with occasional compaction)
   */
  public dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.headIndex];
    this.headIndex++;

    // Periodic memory cleanup when head moves past 50 items
    if (this.headIndex > 50 && this.headIndex * 2 >= this.items.length) {
      this.items = this.items.slice(this.headIndex);
      this.headIndex = 0;
    }

    return item;
  }

  /**
   * Peek: Returns the front item without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.headIndex];
  }

  /**
   * Checks if queue has no elements.
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Returns current count of queued items.
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.items.length - this.headIndex;
  }

  /**
   * Returns array representation for visualization.
   */
  public toArray(): T[] {
    return this.items.slice(this.headIndex);
  }

  /**
   * Clears the queue.
   */
  public clear(): void {
    this.items = [];
    this.headIndex = 0;
  }
}
