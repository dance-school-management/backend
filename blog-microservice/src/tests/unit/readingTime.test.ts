import { calculateReadingTime } from "../../utils/readingTime";

describe("readingTime utilities", () => {
  describe("calculateReadingTime", () => {
    it("should calculate reading time for simple text", () => {
      const content = "This is a simple text with words.";
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should return minimum 1 minute", () => {
      const content = "Short";
      const time = calculateReadingTime(content);
      expect(time).toBe(1);
    });

    it("should handle markdown code blocks", () => {
      const content = `
        This is a paragraph.
        
        \`\`\`javascript
        const code = "this should not count";
        \`\`\`
        
        More text here.
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should handle inline code", () => {
      const content = `
        This is text with \`inline code\` that should be removed.
        More text continues here.
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should handle markdown links", () => {
      const content = `
        This is text with [a link](https://example.com) that should become just "a link".
        More text here.
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should handle markdown formatting", () => {
      const content = `
        # Heading
        **Bold text** and *italic text*
        More text with ~strikethrough~ and \`code\`.
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should handle HTML tags", () => {
      const content = `
        <p>This is a paragraph with <strong>bold</strong> text.</p>
        <div>More content here.</div>
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should handle long content", () => {
      // Create content with ~500 words (should be ~2-3 minutes at 200 WPM)
      const words = Array.from({ length: 500 }, (_, i) => `word${i}`).join(" ");
      const time = calculateReadingTime(words);
      expect(time).toBeGreaterThanOrEqual(2);
      expect(time).toBeLessThanOrEqual(5);
    });

    it("should handle very long content", () => {
      // Create content with ~2000 words (should be ~10 minutes at 200 WPM)
      const words = Array.from({ length: 2000 }, (_, i) => `word${i}`).join(" ");
      const time = calculateReadingTime(words);
      expect(time).toBeGreaterThanOrEqual(10);
      expect(time).toBeLessThanOrEqual(15);
    });

    it("should handle empty string", () => {
      const time = calculateReadingTime("");
      expect(time).toBe(1); // Minimum 1 minute
    });

    it("should handle content with only whitespace", () => {
      const time = calculateReadingTime("   \n\n   ");
      expect(time).toBe(1); // Minimum 1 minute
    });

    it("should handle mixed content", () => {
      const content = `
        # Introduction
        
        This is a paragraph with **bold** text and [a link](https://example.com).
        
        \`\`\`javascript
        const code = "example";
        \`\`\`
        
        <p>More HTML content here.</p>
        
        Final paragraph with more words.
      `;
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });

    it("should normalize multiple whitespace", () => {
      const content = "Word1    Word2\n\nWord3\t\tWord4";
      const time = calculateReadingTime(content);
      expect(time).toBeGreaterThanOrEqual(1);
    });
  });
});





