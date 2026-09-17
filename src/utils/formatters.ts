export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
    date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hover: string;
} {
  switch (category) {
    case 'document':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        hover: 'hover:bg-blue-50'
      };
    case 'image':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        hover: 'hover:bg-emerald-50'
      };
    case 'video':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        hover: 'hover:bg-purple-50'
      };
    case 'audio':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        hover: 'hover:bg-amber-50'
      };
    case 'other':
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        hover: 'hover:bg-slate-50'
      };
  }
}
