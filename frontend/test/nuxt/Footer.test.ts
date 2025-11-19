/**
 * TDD: Test-Driven Development for Footer Component
 * 
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Footer from "~/components/Footer.vue";
import { createFooterProps } from "../utils/test-helpers";

describe("Footer Component (TDD)", () => {

  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render footer with copyright text", async () => {
      // RED: Write test first - use mock data
      const props = createFooterProps();

      const component = await mountSuspended(Footer, { props });

      // Assert: Should contain copyright text from mock data
      if (props.copyright) {
        expect(component.text()).toContain(props.copyright);
      }
    });

    it("should render footer links", async () => {
      // RED: Test for footer links - use mock data
      const props = createFooterProps();

      const component = await mountSuspended(Footer, { props });

      // Assert: Should contain footer links from mock data
      props.links.forEach((link) => {
        expect(component.text()).toContain(link.text);
      });
    });

    it("should render social media links when provided", async () => {
      // RED: Test for social media - use mock data
      const props = createFooterProps();

      const component = await mountSuspended(Footer, { props });

      // Assert: Should contain social media section if socialMedia exists
      if (props.socialMedia && props.socialMedia.length > 0) {
        expect(component.text()).toContain("Follow Us");
      }
    });

    it("should not render social media section when not provided", async () => {
      // RED: Test for optional social media - override mock data
      const props = createFooterProps({
        socialMedia: undefined,
      });

      const component = await mountSuspended(Footer, { props });

      // Assert: Should not contain social media section
      expect(component.text()).not.toContain("Follow Us");
    });
  });

  describe("Accessibility", () => {
    it("should have proper footer semantic element", async () => {
      // RED: Test for semantic HTML - use mock data
      const props = createFooterProps();

      const component = await mountSuspended(Footer, { props });
      const footer = component.find("footer");

      // Assert: Should have footer element
      expect(footer.exists()).toBe(true);
    });

    it("should have proper aria-labels for social media links", async () => {
      // RED: Test for accessibility - use mock data with social media
      const props = createFooterProps();

      if (props.socialMedia && props.socialMedia.length > 0) {
        const component = await mountSuspended(Footer, { props });
        const firstSocial = props.socialMedia[0];
        const socialLink = component.find(`a[aria-label="${firstSocial.name}"]`);

        // Assert: Should have aria-label
        expect(socialLink.exists()).toBe(true);
      }
    });
  });

  describe("Styling", () => {
    it("should have proper footer classes", async () => {
      // RED: Test for styling - use mock data
      const props = createFooterProps();

      const component = await mountSuspended(Footer, { props });
      const footer = component.find("footer");

      // Assert: Should have footer classes
      expect(footer.classes()).toContain("w-full");
      expect(footer.classes()).toContain("border-t");
    });
  });
});
