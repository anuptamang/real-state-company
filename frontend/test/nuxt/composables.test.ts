/**
 * TDD: Test-Driven Development for Composables
 *
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getMockPage,
  getMockBlocks,
  createGlobalOptionsProps,
} from "../utils/test-helpers";

// Use vi.hoisted to ensure mocks are set up before imports
const { mock$fetch } = vi.hoisted(() => {
  const mockFetch = vi.fn();
  return { mock$fetch: mockFetch };
});

// Mock $fetch for Strapi API calls
// Note: We need to mock it before importing the composable
// $fetch is auto-imported by Nuxt, so we need to mock it at the global level
vi.stubGlobal("$fetch", mock$fetch);

// Also mock it in #imports for good measure
vi.mock("#imports", async () => {
  const actual = await vi.importActual<typeof import("#imports")>("#imports");
  return {
    ...actual,
    $fetch: mock$fetch,
  };
});

// Import composable AFTER mocks are set up
// Note: Runtime config is handled via environment variables in test/setup.ts
import { useStrapi } from "~/composables/useStrapi";

describe("useStrapi Composable (TDD)", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mock$fetch.mockClear();
  });

  describe("fetchPage", () => {
    it("should fetch a page by slug from Strapi", async () => {
      // RED: Write test first
      const mockPage = getMockPage("home");

      // Mock Strapi response format (collection response)
      mock$fetch.mockResolvedValueOnce({
        data: [
          {
            id: 1,
            attributes: mockPage,
          },
        ],
      });

      const { fetchPage } = useStrapi();
      const result = await fetchPage("home");

      // Assert: Should return page data
      expect(result).toBeTruthy();
      expect(result?.slug).toBe("home");
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should return null when page not found", async () => {
      // RED: Test for not found
      mock$fetch.mockResolvedValueOnce({
        data: null,
      });

      const { fetchPage } = useStrapi();
      const result = await fetchPage("non-existent");

      // Assert: Should return null
      expect(result).toBeNull();
    });

    it("should fallback to mock data on error", async () => {
      // RED: Test error handling
      mock$fetch.mockRejectedValueOnce(new Error("Network error"));

      const { fetchPage } = useStrapi();
      const result = await fetchPage("home");

      // Assert: Should return mock data as fallback
      expect(result).toBeTruthy();
      expect(result?.slug).toBe("home");
    });

    it("should use correct Strapi API endpoint", async () => {
      // RED: Test API endpoint
      const mockPage = getMockPage("home");
      mock$fetch.mockResolvedValueOnce({
        data: [
          {
            id: 1,
            attributes: mockPage,
          },
        ],
      });

      const { fetchPage } = useStrapi();
      await fetchPage("home");

      // Assert: Should call correct endpoint
      expect(mock$fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/pages"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        })
      );
    });
  });

  describe("fetchPages", () => {
    it("should fetch all pages from Strapi", async () => {
      // RED: Write test first
      const mockHome = getMockPage("home");
      const mockAbout = getMockPage("about");
      mock$fetch.mockResolvedValueOnce({
        data: [
          {
            id: 1,
            attributes: mockHome,
          },
          {
            id: 2,
            attributes: mockAbout,
          },
        ],
      });

      const { fetchPages } = useStrapi();
      const result = await fetchPages();

      // Assert: Should return array of pages
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should return empty array when no pages found", async () => {
      // RED: Test for empty result
      mock$fetch.mockResolvedValueOnce({
        data: [],
      });

      const { fetchPages } = useStrapi();
      const result = await fetchPages();

      // Assert: Should return empty array (not fallback to mock data)
      expect(result).toEqual([]);
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should fallback to mock data on error", async () => {
      // RED: Test error handling
      mock$fetch.mockRejectedValueOnce(new Error("Network error"));

      const { fetchPages } = useStrapi();
      const result = await fetchPages();

      // Assert: Should return mock data as fallback
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("fetchBlocks", () => {
    it("should fetch blocks for a page from Strapi", async () => {
      // RED: Write test first
      const mockBlocks = getMockBlocks("home");

      mock$fetch.mockResolvedValueOnce({
        data: {
          id: 1,
          attributes: {
            blocks: mockBlocks,
          },
        },
      });

      const { fetchBlocks } = useStrapi();
      const result = await fetchBlocks("page-id");

      // Assert: Should return blocks
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should return empty array when no blocks found", async () => {
      // RED: Test for empty blocks
      mock$fetch.mockResolvedValueOnce({
        data: { blocks: [] },
      });

      const { fetchBlocks } = useStrapi();
      const result = await fetchBlocks("page-id");

      // Assert: Should return empty array
      expect(result).toEqual([]);
    });

    it("should fallback to mock data when slug provided", async () => {
      // RED: Test fallback with slug
      mock$fetch.mockRejectedValueOnce(new Error("Network error"));

      const { fetchBlocks } = useStrapi();
      const result = await fetchBlocks("page-id", "home");

      // Assert: Should return mock blocks as fallback
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array on error when no slug provided", async () => {
      // RED: Test error handling without slug
      mock$fetch.mockRejectedValueOnce(new Error("Network error"));

      const { fetchBlocks } = useStrapi();
      const result = await fetchBlocks("page-id");

      // Assert: Should return empty array
      expect(result).toEqual([]);
    });
  });

  describe("fetchGlobalOptions", () => {
    it("should fetch global options from Strapi", async () => {
      // RED: Write test first - use mock data
      const mockGlobalOptions = createGlobalOptionsProps();

      mock$fetch.mockResolvedValueOnce({
        data: mockGlobalOptions,
      });

      const { fetchGlobalOptions } = useStrapi();
      const result = await fetchGlobalOptions();

      // Assert: Should return global options
      expect(result).toBeTruthy();
      expect(result?.header).toBeTruthy();
      expect(result?.footer).toBeTruthy();
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should return null when global options not found", async () => {
      // RED: Test for not found
      // Mock successful response with null data
      mock$fetch.mockResolvedValueOnce({
        data: null,
      });

      const { fetchGlobalOptions } = useStrapi();
      const result = await fetchGlobalOptions();

      // Assert: Should return null (not fallback to mock data)
      expect(result).toBeNull();
      expect(mock$fetch).toHaveBeenCalled();
    });

    it("should fallback to mock data on error", async () => {
      // RED: Test error handling
      mock$fetch.mockRejectedValueOnce(new Error("Network error"));

      const { fetchGlobalOptions } = useStrapi();
      const result = await fetchGlobalOptions();

      // Assert: Should return mock data as fallback
      expect(result).toBeTruthy();
      expect(result?.header).toBeTruthy();
      expect(result?.footer).toBeTruthy();
    });
  });
});
