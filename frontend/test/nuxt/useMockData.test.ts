/**
 * TDD: Test-Driven Development for useMockData Composable
 * 
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useMockData } from "~/composables/useMockData";
import { getMockData } from "../utils/test-helpers";

describe("useMockData Composable (TDD)", () => {
  let mockDataComposable: ReturnType<typeof useMockData>;

  beforeEach(() => {
    // Get fresh composable instance
    mockDataComposable = useMockData();
  });

  describe("getPageBySlug", () => {
    it("should return page by slug", () => {
      // RED: Write test first
      const page = mockDataComposable.getPageBySlug("home");

      // Assert: Should return page
      expect(page).toBeTruthy();
      expect(page?.slug).toBe("home");
    });

    it("should return null for non-existent page", () => {
      // RED: Test for not found
      const page = mockDataComposable.getPageBySlug("non-existent");

      // Assert: Should return null
      expect(page).toBeNull();
    });

    it("should return page with all required fields", () => {
      // RED: Test page structure
      const page = mockDataComposable.getPageBySlug("home");

      // Assert: Should have required fields
      expect(page).toHaveProperty("id");
      expect(page).toHaveProperty("slug");
      expect(page).toHaveProperty("title");
      expect(page).toHaveProperty("blocks");
    });
  });

  describe("getAllPages", () => {
    it("should return all pages", () => {
      // RED: Write test first
      const pages = mockDataComposable.getAllPages();

      // Assert: Should return array of pages
      expect(Array.isArray(pages)).toBe(true);
      expect(pages.length).toBeGreaterThan(0);
    });

    it("should return pages with correct structure", () => {
      // RED: Test page structure
      const pages = mockDataComposable.getAllPages();

      // Assert: All pages should have required fields
      pages.forEach((page) => {
        expect(page).toHaveProperty("id");
        expect(page).toHaveProperty("slug");
        expect(page).toHaveProperty("title");
        expect(page).toHaveProperty("blocks");
      });
    });
  });

  describe("getPropertyBySlug", () => {
    it("should return property by slug", () => {
      // RED: Write test first
      const property = mockDataComposable.getPropertyBySlug("modern-family-home");

      // Assert: Should return property
      expect(property).toBeTruthy();
      expect(property?.slug).toBe("modern-family-home");
    });

    it("should return null for non-existent property", () => {
      // RED: Test for not found
      const property = mockDataComposable.getPropertyBySlug("non-existent");

      // Assert: Should return null
      expect(property).toBeNull();
    });

    it("should return property with all required fields", () => {
      // RED: Test property structure
      const property = mockDataComposable.getPropertyBySlug("modern-family-home");

      // Assert: Should have required fields
      expect(property).toHaveProperty("id");
      expect(property).toHaveProperty("slug");
      expect(property).toHaveProperty("title");
      expect(property).toHaveProperty("price");
      expect(property).toHaveProperty("location");
    });
  });

  describe("getAllProperties", () => {
    it("should return all properties", () => {
      // RED: Write test first
      const properties = mockDataComposable.getAllProperties();

      // Assert: Should return array of properties
      expect(Array.isArray(properties)).toBe(true);
      expect(properties.length).toBeGreaterThan(0);
    });

    it("should return properties with correct structure", () => {
      // RED: Test property structure
      const properties = mockDataComposable.getAllProperties();

      // Assert: All properties should have required fields
      properties.forEach((property) => {
        expect(property).toHaveProperty("id");
        expect(property).toHaveProperty("slug");
        expect(property).toHaveProperty("title");
        expect(property).toHaveProperty("price");
      });
    });
  });

  describe("getAllTestimonials", () => {
    it("should return all testimonials", () => {
      // RED: Write test first
      const testimonials = mockDataComposable.getAllTestimonials();

      // Assert: Should return array of testimonials
      expect(Array.isArray(testimonials)).toBe(true);
      expect(testimonials.length).toBeGreaterThan(0);
    });

    it("should return testimonials with correct structure", () => {
      // RED: Test testimonial structure
      const testimonials = mockDataComposable.getAllTestimonials();

      // Assert: All testimonials should have required fields
      testimonials.forEach((testimonial) => {
        expect(testimonial).toHaveProperty("id");
        expect(testimonial).toHaveProperty("name");
        expect(testimonial).toHaveProperty("content");
        expect(testimonial).toHaveProperty("rating");
      });
    });
  });

  describe("getAllTeam", () => {
    it("should return all team members", () => {
      // RED: Write test first
      const team = mockDataComposable.getAllTeam();

      // Assert: Should return array of team members
      expect(Array.isArray(team)).toBe(true);
      expect(team.length).toBeGreaterThan(0);
    });

    it("should return team members with correct structure", () => {
      // RED: Test team structure
      const team = mockDataComposable.getAllTeam();

      // Assert: All team members should have required fields
      team.forEach((member) => {
        expect(member).toHaveProperty("id");
        expect(member).toHaveProperty("name");
        expect(member).toHaveProperty("role");
      });
    });
  });

  describe("getBlocksForPage", () => {
    it("should return blocks for a page by slug", () => {
      // RED: Write test first
      const blocks = mockDataComposable.getBlocksForPage("home");

      // Assert: Should return array of blocks
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent page", () => {
      // RED: Test for not found
      const blocks = mockDataComposable.getBlocksForPage("non-existent");

      // Assert: Should return empty array
      expect(blocks).toEqual([]);
    });

    it("should return blocks with correct structure", () => {
      // RED: Test block structure
      const blocks = mockDataComposable.getBlocksForPage("home");

      // Assert: All blocks should have required fields
      blocks.forEach((block) => {
        expect(block).toHaveProperty("id");
        expect(block).toHaveProperty("__component");
      });
    });
  });

  describe("getGlobalOptions", () => {
    it("should return global options", () => {
      // RED: Write test first
      const globalOptions = mockDataComposable.getGlobalOptions();

      // Assert: Should return global options
      expect(globalOptions).toBeTruthy();
      expect(globalOptions?.header).toBeTruthy();
      expect(globalOptions?.footer).toBeTruthy();
    });

    it("should return global options with correct structure", () => {
      // RED: Test global options structure
      const globalOptions = mockDataComposable.getGlobalOptions();

      // Assert: Should have required fields
      expect(globalOptions).toHaveProperty("id");
      expect(globalOptions).toHaveProperty("header");
      expect(globalOptions).toHaveProperty("footer");
      expect(globalOptions?.header).toHaveProperty("links");
      expect(globalOptions?.footer).toHaveProperty("links");
    });

    it("should return serializable plain object", () => {
      // RED: Test serializability
      const globalOptions = mockDataComposable.getGlobalOptions();

      // Assert: Should be serializable (no functions, no circular refs)
      expect(() => JSON.stringify(globalOptions)).not.toThrow();
    });
  });

  describe("mockData direct access", () => {
    it("should provide direct access to mock data", () => {
      // RED: Test direct access
      const mockData = mockDataComposable.mockData;

      // Assert: Should have mock data
      expect(mockData).toBeTruthy();
      expect(mockData).toHaveProperty("pages");
      expect(mockData).toHaveProperty("properties");
      expect(mockData).toHaveProperty("testimonials");
      expect(mockData).toHaveProperty("team");
      expect(mockData).toHaveProperty("globalOptions");
    });

    it("should match getMockData helper", () => {
      // RED: Test consistency
      const helperMockData = getMockData();
      const composableMockData = mockDataComposable.mockData;

      // Assert: Should be the same data
      expect(composableMockData).toEqual(helperMockData);
    });
  });
});
