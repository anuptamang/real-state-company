/**
 * TDD: Test-Driven Development for BlockCta Component
 *
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import BlockCta from "~/components/blocks/BlockCta.vue";
import {
  createCtaBlockProps,
  renderWithTestingLibrary,
} from "../utils/test-helpers";

describe("BlockCta Component (TDD)", () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render CTA block with heading from mock data", async () => {
      // RED: Write test first - use mock data directly
      const props = createCtaBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use role-based query for heading (from mock data: "Ready to Find Your Home?")
      expect(
        getByRole("heading", { name: /ready to find your home\?/i })
      ).toBeTruthy();
    });

    it("should render CTA text when provided from mock data", async () => {
      // RED: Test for CTA text - use mock data directly
      const props = createCtaBlockProps();

      const { getByText } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use text-based query with mock data value
      // Mock data: "Contact us today to get started on your property search"
      expect(
        getByText("Contact us today to get started on your property search")
      ).toBeTruthy();
    });

    it("should render CTA button when provided from mock data", async () => {
      // RED: Test for CTA button - use mock data directly
      const props = createCtaBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use role-based query with mock data value (button text: "Contact Us")
      const ctaButton = getByRole("link", { name: /contact us/i });
      expect(ctaButton).toBeTruthy();
    });

    it("should render CTA from mock data", async () => {
      // RED: Test with mock data
      const props = createCtaBlockProps();

      const { findSection } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Should render CTA (check for section element)
      const section = findSection();
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });

    it("should not render heading when not provided", async () => {
      // RED: Test for optional heading - override only what's needed
      const props = createCtaBlockProps({
        heading: undefined,
        // Keep mock data button
      });

      const { queryByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use queryByRole (returns null if not found)
      expect(
        queryByRole("heading", { name: /ready to find your home\?/i })
      ).not.toBeInTheDocument();
    });

    it("should not render text when not provided", async () => {
      // RED: Test for optional text - override only what's needed
      const props = createCtaBlockProps({
        text: undefined,
        // Keep mock data heading and button
      });

      const { queryByText } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use queryByText (returns null if not found)
      expect(
        queryByText("Contact us today to get started on your property search")
      ).not.toBeInTheDocument();
    });

    it("should not render button when not provided", async () => {
      // RED: Test for optional button - override only what's needed
      const props = createCtaBlockProps({
        button: undefined,
        // Keep mock data heading and text
      });

      const { queryByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use queryByRole (returns null if not found)
      expect(
        queryByRole("link", { name: /contact us/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Button Navigation", () => {
    it("should have proper NuxtLink for button from mock data", async () => {
      // RED: Test for navigation - use mock data directly
      const props = createCtaBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use role-based query with mock data value
      const link = getByRole("link", { name: /contact us/i });
      expect(link).toBeTruthy();
    });

    it("should have correct button URL from mock data", async () => {
      // RED: Test for URL - use mock data directly
      const props = createCtaBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Use role-based query and check href attribute (mock data: "/contact")
      const link = getByRole("link", { name: /contact us/i });
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  describe("Card Structure", () => {
    it("should render CTA in Card component", async () => {
      // RED: Test for Card structure
      const props = createCtaBlockProps();
      const { container } = await renderWithTestingLibrary(BlockCta, {
        props,
      });

      // Assert: Check for Card component (via text content)
      expect(container.textContent).toBeTruthy();
    });

    it("should have centered text alignment", async () => {
      // RED: Test for text alignment
      const props = createCtaBlockProps();
      const { container } = await renderWithTestingLibrary(BlockCta, {
        props,
      });
      const card = container.querySelector('[class*="text-center"]');

      // Assert: Should have text-center class
      expect(card).toBeTruthy();
      expect(card).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should have section wrapper with proper classes", async () => {
      // RED: Test for section styling
      const props = createCtaBlockProps();
      const { findSection } = await renderWithTestingLibrary(BlockCta, {
        props,
      });
      const section = findSection();

      // Assert: Should have section with classes
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass("w-full", "bg-muted");
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper section semantic element", async () => {
      // RED: Test for semantic HTML
      const props = createCtaBlockProps();
      const { findSection } = await renderWithTestingLibrary(BlockCta, {
        props,
      });
      const section = findSection();

      // Assert: Should have section element
      expect(section).toBeTruthy();
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });

    it("should have proper heading structure when heading provided", async () => {
      // RED: Test for heading structure - use mock data directly
      const props = createCtaBlockProps();

      const { getByRole } = await renderWithTestingLibrary(BlockCta, {
        props,
      });
      const heading = getByRole("heading", {
        name: /ready to find your home\?/i,
      });

      // Assert: Use role-based query (more accessible)
      expect(heading).toBeTruthy();
      expect(["H2", "H3"]).toContain(heading.tagName);
    });
  });
});
