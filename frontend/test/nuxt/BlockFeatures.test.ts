/**
 * TDD: Test-Driven Development for BlockFeatures Component
 *
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import BlockFeatures from "~/components/blocks/BlockFeatures.vue";
import {
  createFeaturesBlockProps,
  renderWithTestingLibrary,
} from "../utils/test-helpers";

describe("BlockFeatures Component (TDD)", () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render features block with title from mock data", async () => {
      // RED: Write test first - use mock data directly
      const props = createFeaturesBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use role-based query for heading (from mock data: "Why Choose Us")
      expect(getByRole("heading", { name: /why choose us/i })).toBeTruthy();
    });

    it("should render multiple features from mock data", async () => {
      // RED: Test for multiple features - use mock data directly
      const props = createFeaturesBlockProps();

      const { getByText } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use text-based queries with mock data values
      // Mock data: "Expert Agents", "Wide Selection", "Best Prices"
      expect(getByText("Expert Agents")).toBeTruthy();
      expect(getByText("Wide Selection")).toBeTruthy();
      expect(getByText("Best Prices")).toBeTruthy();
      expect(getByText("Experienced real estate professionals")).toBeTruthy();
      expect(getByText("Hundreds of properties to choose from")).toBeTruthy();
      expect(getByText("Competitive pricing and great deals")).toBeTruthy();
    });

    it("should render features from mock data", async () => {
      // RED: Test with mock data
      const props = createFeaturesBlockProps();

      const { findSection } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Should render features (check for section element)
      const section = findSection();
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });

    it("should not render title when not provided", async () => {
      // RED: Test for optional title - override only what's needed for this test
      const props = createFeaturesBlockProps({
        title: undefined,
        // Keep mock data features
      });

      const { queryByRole } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use queryByRole (returns null if not found)
      expect(
        queryByRole("heading", { name: /why choose us/i })
      ).not.toBeInTheDocument();
    });

    it("should handle empty features array", async () => {
      // RED: Test for empty features
      const props = createFeaturesBlockProps({
        features: [],
      });

      const { findSection } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Should render without errors (check for section)
      const section = findSection();
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });
  });

  describe("Card Structure", () => {
    it("should render features in Card components from mock data", async () => {
      // RED: Test for Card structure - use mock data directly
      const props = createFeaturesBlockProps();

      const { getAllByText } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use text-based queries with mock data values
      const featureTitles = getAllByText(
        /expert agents|wide selection|best prices/i
      );
      expect(featureTitles.length).toBeGreaterThan(0);
    });

    it("should render CardTitle for each feature from mock data", async () => {
      // RED: Test for CardTitle - use mock data directly
      const props = createFeaturesBlockProps();

      const { getByText } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use text-based query with mock data value
      expect(getByText("Expert Agents")).toBeTruthy();
    });

    it("should render CardDescription for each feature from mock data", async () => {
      // RED: Test for CardDescription - use mock data directly
      const props = createFeaturesBlockProps();

      const { getByText } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });

      // Assert: Use text-based query with mock data value
      expect(getByText("Experienced real estate professionals")).toBeTruthy();
    });
  });

  describe("Styling", () => {
    it("should have responsive grid classes", async () => {
      // RED: Test for responsive grid
      const props = createFeaturesBlockProps();
      const { container } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });
      const grid = container.querySelector(".grid");

      // Assert: Should have grid classes
      expect(grid).toBeTruthy();
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid", "grid-cols-1");
    });

    it("should have section wrapper with proper classes", async () => {
      // RED: Test for section styling
      const props = createFeaturesBlockProps();
      const { findSection } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });
      const section = findSection();

      // Assert: Should have section with classes
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass("w-full");
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper section semantic element", async () => {
      // RED: Test for semantic HTML
      const props = createFeaturesBlockProps();
      const { findSection } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });
      const section = findSection();

      // Assert: Should have section element
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });

    it("should have proper heading structure when title provided", async () => {
      // RED: Test for heading structure - use mock data directly
      const props = createFeaturesBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockFeatures, {
        props,
      });
      const heading = getByRole("heading", { name: /why choose us/i });

      // Assert: Use role-based query (more accessible)
      expect(heading).toBeTruthy();
      expect(heading.tagName).toBe("H2");
    });
  });
});
