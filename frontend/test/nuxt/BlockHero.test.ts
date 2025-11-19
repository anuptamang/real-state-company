/**
 * TDD: Test-Driven Development for BlockHero Component
 *
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import BlockHero from "~/components/blocks/BlockHero.vue";
import {
  createHeroBlockProps,
  renderWithTestingLibrary,
} from "../utils/test-helpers";

describe("BlockHero Component (TDD)", () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render hero block with title", async () => {
      // RED: Write test first (component doesn't exist yet)
      const props = createHeroBlockProps({
        title: "Welcome to Our Company",
      });

      const { getByRole } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use role-based query (more resilient to DOM changes)
      // getByRole throws if not found, so we don't need toBeInTheDocument()
      const heading = getByRole("heading", { name: /welcome to our company/i });
      expect(heading).toBeTruthy();
    });

    it("should render subtitle when provided", async () => {
      // RED: Test for subtitle
      const props = createHeroBlockProps({
        title: "Welcome",
        subtitle: "Building amazing solutions",
      });

      const { getByRole, getByText } = await renderWithTestingLibrary(
        BlockHero,
        { props }
      );

      // Assert: Use role-based and text-based queries
      // getByRole/getByText throw if not found, so we don't need toBeInTheDocument()
      expect(getByRole("heading", { name: /welcome/i })).toBeTruthy();
      expect(getByText("Building amazing solutions")).toBeTruthy();
    });

    it("should render hero image when provided", async () => {
      // RED: Test for image rendering
      const props = createHeroBlockProps({
        image: {
          url: "/test-hero.jpg",
          alt: "Hero image",
        },
      });

      const { getByAltText } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use alt text query (more resilient to DOM structure changes)
      // getByAltText throws if not found, so we don't need toBeInTheDocument()
      const image = getByAltText("Hero image");
      expect(image).toBeTruthy();
      expect(image).toHaveAttribute(
        "src",
        expect.stringContaining("/test-hero.jpg")
      );
    });

    it("should render CTA button when provided", async () => {
      // RED: Test for CTA button
      const props = createHeroBlockProps({
        cta: {
          text: "Learn More",
          url: "/about",
        },
      });

      const { getByRole } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use role-based query (works for both button and link)
      // getByRole throws if not found, so we don't need toBeInTheDocument()
      const ctaButton = getByRole("link", { name: /learn more/i });
      expect(ctaButton).toBeTruthy();
      expect(ctaButton).toHaveAttribute("href", "/about");
    });

    it("should not render subtitle when not provided", async () => {
      // RED: Test for optional subtitle
      const props = createHeroBlockProps({
        title: "Welcome",
        subtitle: undefined,
      });

      const { queryByText } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use queryByText (returns null if not found, doesn't throw)
      expect(queryByText("Building amazing solutions")).not.toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have Tailwind utility classes", async () => {
      // RED: Test for Tailwind classes
      const props = createHeroBlockProps();
      const { container, wrapper } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Check for Tailwind classes on the section element
      // The section should be the root element or first child
      let section: HTMLElement | null = null;

      // First, try to find section in container
      section = container.querySelector("section");

      // If not found, check if container itself is the section
      if (!section && container.tagName === "SECTION") {
        section = container;
      }

      // If not found, check wrapper element
      if (!section && wrapper.element instanceof HTMLElement) {
        if (wrapper.element.tagName === "SECTION") {
          section = wrapper.element;
        } else {
          section = wrapper.element.querySelector("section");
        }
      }

      // If still not found, check first child (might be section)
      if (!section && container.firstElementChild) {
        const firstChild = container.firstElementChild;
        if (firstChild.tagName === "SECTION") {
          section = firstChild as HTMLElement;
        }
      }

      expect(section).toBeTruthy();
      if (section) {
        // Check for key Tailwind classes (section has: relative w-full min-h-[400px] flex items-center justify-center)
        expect(section).toHaveClass("relative", "w-full", "flex");
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", async () => {
      // RED: Test for accessibility
      const props = createHeroBlockProps({
        title: "Welcome",
      });

      const { getByRole } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use role-based query for heading (more accessible)
      // getByRole throws if not found, so we don't need toBeInTheDocument()
      const heading = getByRole("heading", { name: /welcome/i });
      expect(heading).toBeTruthy();
      expect(heading.tagName).toBe("H1");
    });

    it("should have alt text for images", async () => {
      // RED: Test for image accessibility
      const props = createHeroBlockProps({
        image: {
          url: "/test.jpg",
          alt: "Hero image",
        },
      });

      const { getByAltText } = await renderWithTestingLibrary(BlockHero, {
        props,
      });

      // Assert: Use alt text query (tests actual accessibility)
      // getByAltText throws if not found, so we don't need toBeInTheDocument()
      const image = getByAltText("Hero image");
      expect(image).toBeTruthy();
      expect(image).toHaveAttribute("alt", "Hero image");
    });
  });
});
