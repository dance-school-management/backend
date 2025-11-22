/**
 * Calculate reading time in minutes based on content
 * Assumes average reading speed of 200 words per minute
 * @param content - The content to calculate reading time for
 * @returns Reading time in minutes (minimum 1 minute)
 */
export function calculateReadingTime(content: string): number {
  // Remove markdown syntax and HTML tags for more accurate word count
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, "$1") // Convert markdown links to text
    .replace(/[#*_~`]/g, "") // Remove markdown formatting
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Return at least 1 minute
  return Math.max(1, readingTime);
}

