import { v4 as uuidv4 } from 'uuid';

// Extracts h2/h3 headings from markdown for TOC
export function getHeadingsFromMarkdown(markdown: string) {
  const lines = markdown.split('\n');
  const headings = [];
  for (const line of lines) {
    const match = /^(##+)\s+(.*)/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // Generate a slug/id for anchor links
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + uuidv4().slice(0, 8);
      headings.push({ id, text, level });
    }
  }
  return headings;
}

// Returns estimated reading time in minutes
export function getReadingTime(markdown: string) {
  const words = markdown.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.round(words / wordsPerMinute));
} 