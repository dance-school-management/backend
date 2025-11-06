import { generateSlug, generateUniqueSlug } from "../../utils/slug";

describe("slug utilities", () => {
  describe("generateSlug", () => {
    it("should convert title to URL-friendly slug", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("My Awesome Post")).toBe("my-awesome-post");
    });

    it("should handle special characters", () => {
      expect(generateSlug("Hello, World!")).toBe("hello-world");
      expect(generateSlug("Post (with) [brackets]")).toBe("post-with-brackets");
      expect(generateSlug("Post with @special #characters")).toBe("post-with-special-characters");
    });

    it("should handle multiple spaces and hyphens", () => {
      expect(generateSlug("Hello    World")).toBe("hello-world");
      expect(generateSlug("Hello---World")).toBe("hello-world");
      expect(generateSlug("Hello - World")).toBe("hello-world");
    });

    it("should trim leading and trailing hyphens", () => {
      expect(generateSlug("-Hello World-")).toBe("hello-world");
      expect(generateSlug("---Hello World---")).toBe("hello-world");
    });

    it("should handle empty string", () => {
      expect(generateSlug("")).toBe("");
    });

    it("should handle special Unicode characters", () => {
      expect(generateSlug("Café & Restaurant")).toBe("caf-restaurant");
      expect(generateSlug("日本語のタイトル")).toBe("");
    });

    it("should handle numbers", () => {
      expect(generateSlug("Post 123")).toBe("post-123");
      expect(generateSlug("123 Post")).toBe("123-post");
    });
  });

  describe("generateUniqueSlug", () => {
    it("should return base slug if not in existing slugs", () => {
      const existingSlugs: string[] = [];
      expect(generateUniqueSlug("hello-world", existingSlugs)).toBe("hello-world");
    });

    it("should append number if slug exists", () => {
      const existingSlugs = ["hello-world"];
      expect(generateUniqueSlug("hello-world", existingSlugs)).toBe("hello-world-1");
    });

    it("should increment number until unique", () => {
      const existingSlugs = ["hello-world", "hello-world-1", "hello-world-2"];
      expect(generateUniqueSlug("hello-world", existingSlugs)).toBe("hello-world-3");
    });

    it("should handle multiple collisions", () => {
      const existingSlugs = [
        "test",
        "test-1",
        "test-2",
        "test-3",
        "test-4",
        "test-5",
      ];
      expect(generateUniqueSlug("test", existingSlugs)).toBe("test-6");
    });

    it("should handle empty existing slugs array", () => {
      expect(generateUniqueSlug("hello-world", [])).toBe("hello-world");
    });

    it("should handle very long slug lists", () => {
      const existingSlugs = ["test", ...Array.from({ length: 100 }, (_, i) => `test-${i}`)];
      expect(generateUniqueSlug("test", existingSlugs)).toBe("test-100");
    });
  });
});

