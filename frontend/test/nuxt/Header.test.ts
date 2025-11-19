/**
 * TDD: Test-Driven Development for Header Component
 *
 * RED-GREEN-REFACTOR cycle:
 * 1. RED: Write failing test first
 * 2. GREEN: Write minimal code to make test pass
 * 3. REFACTOR: Improve code while keeping tests green
 */

import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Header from "~/components/Header.vue";
import { createHeaderProps } from "../utils/test-helpers";

describe("Header Component (TDD)", () => {

  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe("Rendering", () => {
    it("should render header with logo text", async () => {
      // RED: Write test first - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });

      // Assert: Should contain logo text from mock data
      expect(component.text()).toContain(props.logoText || "");
    });

    it("should render header with logo image", async () => {
      // RED: Test for logo image - use mock data with override
      const props = createHeaderProps({
        logo: {
          url: "/test-logo.png",
          alt: "Company Logo",
        },
      });

      const component = await mountSuspended(Header, { props });
      const logo = component.find("img");

      // Assert: Should have logo image
      expect(logo.exists()).toBe(true);
      expect(logo.attributes("src")).toContain("/test-logo.png");
      expect(logo.attributes("alt")).toBe("Company Logo");
    });

    it("should render navigation links", async () => {
      // RED: Test for navigation links - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });

      // Assert: Should contain all navigation links from mock data
      props.links.forEach((link) => {
        expect(component.text()).toContain(link.text);
      });
    });

    it("should render mobile menu button", async () => {
      // RED: Test for mobile menu button - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });
      const mobileButton = component.find("button");

      // Assert: Should have mobile menu button
      expect(mobileButton.exists()).toBe(true);
    });
  });

  describe("Navigation", () => {
    it("should have proper NuxtLink components for navigation", async () => {
      // RED: Test for navigation structure - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });
      const links = component.findAll("a");

      // Assert: Should have navigation links
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper header semantic element", async () => {
      // RED: Test for semantic HTML - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });
      const header = component.find("header");

      // Assert: Should have header element
      expect(header.exists()).toBe(true);
    });

    it("should have proper nav semantic element", async () => {
      // RED: Test for nav element - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });
      const nav = component.find("nav");

      // Assert: Should have nav element
      expect(nav.exists()).toBe(true);
    });
  });

  describe("Styling", () => {
    it("should have sticky header classes", async () => {
      // RED: Test for sticky positioning - use mock data
      const props = createHeaderProps();

      const component = await mountSuspended(Header, { props });
      const header = component.find("header");

      // Assert: Should have sticky classes
      expect(header.classes()).toContain("sticky");
      expect(header.classes()).toContain("top-0");
    });
  });
});
