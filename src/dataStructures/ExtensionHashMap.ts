import { FileCategory } from './types';

/**
 * ExtensionHashMap
 * 
 * College DS Concept: Hash Table / Key-Value Map
 * Purpose: Provides O(1) average time complexity to identify a file's category
 * based on its extension (.pdf, .png, .mp4, etc.)
 */
export class ExtensionHashMap {
  private map: Map<string, FileCategory>;

  constructor() {
    this.map = new Map<string, FileCategory>();
    this.initializeMappings();
  }

  private initializeMappings(): void {
    // Documents
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'md'];
    documentExtensions.forEach(ext => this.map.set(ext.toLowerCase(), 'document'));

    // Images
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff'];
    imageExtensions.forEach(ext => this.map.set(ext.toLowerCase(), 'image'));

    // Videos
    const videoExtensions = ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm', 'm4v'];
    videoExtensions.forEach(ext => this.map.set(ext.toLowerCase(), 'video'));

    // Audio
    const audioExtensions = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma'];
    audioExtensions.forEach(ext => this.map.set(ext.toLowerCase(), 'audio'));

    // Other/Code
    const otherExtensions = ['zip', 'rar', 'tar', 'gz', '7z', 'iso', 'exe', 'bin', 'cpp', 'py', 'java', 'js', 'ts', 'html', 'css', 'json', 'sql'];
    otherExtensions.forEach(ext => this.map.set(ext.toLowerCase(), 'other'));
  }

  /**
   * Identifies file category in O(1) lookup time.
   */
  public classify(extension: string): FileCategory {
    const cleanExt = extension.replace(/^\./, '').trim().toLowerCase();
    if (this.map.has(cleanExt)) {
      return this.map.get(cleanExt)!;
    }
    return 'other';
  }

  /**
   * Helper to extract extension from a full file name
   */
  public static extractExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return parts.pop()!.toLowerCase();
    }
    return 'unknown';
  }

  /**
   * Get all registered keys for data structure visualization
   */
  public getEntries(): [string, FileCategory][] {
    return Array.from(this.map.entries());
  }

  public getCategoryCount(): number {
    return this.map.size;
  }
}

export const extensionHashMap = new ExtensionHashMap();
