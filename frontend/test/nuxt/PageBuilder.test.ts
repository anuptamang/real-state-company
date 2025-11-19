/**
 * TDD: Test-Driven Development for PageBuilder Component
 * 
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PageBuilder from "~/components/PageBuilder.vue";
import {
  getMockBlocks,
  createMockBlock,
  createMockBlocks,
} from "../utils/test-helpers";

describe("PageBuilder Component (TDD)", () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render hero block when provided", async () => {
      // RED: Write test first - use mock data
      const heroBlock = createMockBlock("blocks.hero", {
        subtitle: "Test subtitle",
      });

      const props = {
        blocks: heroBlock ? [heroBlock] : [],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render hero block
      if (heroBlock) {
        expect(component.text()).toContain((heroBlock as any).title);
        expect(component.text()).toContain("Test subtitle");
      }
    });

    it("should render multiple blocks", async () => {
      // RED: Test for multiple blocks - use mock data
      const blocks = createMockBlocks(["blocks.hero", "blocks.features"]);

      const props = {
        blocks,
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render both blocks
      const heroBlock = blocks.find((b) => b.__component === "blocks.hero");
      const featuresBlock = blocks.find(
        (b) => b.__component === "blocks.features"
      );

      if (heroBlock) {
        expect(component.text()).toContain((heroBlock as any).title);
      }
      if (featuresBlock) {
        expect(component.text()).toContain((featuresBlock as any).title);
      }
    });

    it("should render blocks from mock data", async () => {
      // RED: Test with mock data
      const mockBlocks = getMockBlocks("home");
      const props = {
        blocks: mockBlocks,
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render blocks
      expect(component.html()).toBeTruthy();
    });

    it("should handle empty blocks array", async () => {
      // RED: Test for empty blocks
      const props = {
        blocks: [],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render without errors
      expect(component.exists()).toBe(true);
    });

    it("should handle unknown block types gracefully", async () => {
      // RED: Test for unknown block types - create minimal block structure
      const props = {
        blocks: [
          {
            id: "1",
            __component: "blocks.unknown",
            title: "Unknown Block",
          } as any,
        ],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render without errors (unknown blocks are ignored)
      expect(component.exists()).toBe(true);
    });
  });

  describe("Block Mapping", () => {
    it("should map hero block to BlockHero component", async () => {
      // RED: Test block mapping - use mock data
      const heroBlock = createMockBlock("blocks.hero");
      const props = {
        blocks: heroBlock ? [heroBlock] : [],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render hero component
      if (heroBlock) {
        expect(component.text()).toContain((heroBlock as any).title);
      }
    });

    it("should map features block to BlockFeatures component", async () => {
      // RED: Test features block mapping - use mock data
      const featuresBlock = createMockBlock("blocks.features");
      const props = {
        blocks: featuresBlock ? [featuresBlock] : [],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render features component
      if (featuresBlock) {
        expect(component.text()).toContain((featuresBlock as any).title);
      }
    });

    it("should map CTA block to BlockCta component", async () => {
      // RED: Test CTA block mapping - use mock data
      const ctaBlock = createMockBlock("blocks.cta");
      const props = {
        blocks: ctaBlock ? [ctaBlock] : [],
      };

      const component = await mountSuspended(PageBuilder, { props });

      // Assert: Should render CTA component
      if (ctaBlock) {
        expect(component.text()).toContain((ctaBlock as any).heading);
        if ((ctaBlock as any).button) {
          expect(component.text()).toContain((ctaBlock as any).button.text);
        }
      }
    });
  });
});
