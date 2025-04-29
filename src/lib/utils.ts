import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function sanitizePositionContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/\n+/g, ' ') // Replace multiple newlines with a single space
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
}

export function logContentDebug(content: string, context: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}] Content:`, content);
  }
} 