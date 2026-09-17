import { HistoryAction } from './types';

/**
 * ActionStack
 * 
 * College DS Concept: Stack (LIFO - Last In, First Out)
 * Purpose: Manages user operation history to enable "Undo" functionality.
 * The most recently executed action is at the top of the stack and is
 * popped first when the user triggers Undo.
 * 
 * Operations:
 * - push(action): O(1) - Places action on top of stack
 * - pop(): O(1) - Removes and returns topmost action
 * - peek(): O(1) - Inspects topmost action without removal
 * - isEmpty(): O(1)
 * - size(): O(1)
 */
export class ActionStack {
  private stack: HistoryAction[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 20) {
    this.maxSize = maxSize;
  }

  /**
   * Push: Inserts an action onto the top of the stack.
   * Time Complexity: O(1)
   */
  public push(action: HistoryAction): void {
    if (this.stack.length >= this.maxSize) {
      // Remove oldest action from bottom if stack exceeds capacity
      this.stack.shift();
    }
    this.stack.push(action);
  }

  /**
   * Pop: Removes and returns the top action from the stack.
   * Time Complexity: O(1)
   */
  public pop(): HistoryAction | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.stack.pop();
  }

  /**
   * Peek: Returns the top action without removing it.
   * Time Complexity: O(1)
   */
  public peek(): HistoryAction | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.stack[this.stack.length - 1];
  }

  /**
   * Checks if the stack has no actions.
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  /**
   * Returns total actions currently in the stack.
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.stack.length;
  }

  /**
   * Returns array of actions (Top of Stack is the first item or last item).
   * Here we return from Top to Bottom for intuitive visualization.
   */
  public toArray(): HistoryAction[] {
    return [...this.stack].reverse();
  }

  /**
   * Clears the stack.
   */
  public clear(): void {
    this.stack = [];
  }
}
