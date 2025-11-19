/**
 * Test helper utilities for TDD workflow
 * Uses centralized mock data from server/mock/data.json
 */

import mockData from "../../server/mock/data.json";
import type { Page, Block } from "#shared/types";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { ComponentMountingOptions } from "@vue/test-utils";
import type { Component } from "vue";
import {
  getQueriesForElement,
  type Queries,
  type BoundFunctions,
} from "@testing-library/vue";

/**
 * Get mock data directly (for testing)
 */
export function getMockData() {
  return mockData;
}

/**
 * Get a mock page by slug
 */
export function getMockPage(slug: string): Page | null {
  const page = mockData.pages.find((p) => p.slug === slug);
  return page ? (page as Page) : null;
}

/**
 * Get mock blocks for a page
 */
export function getMockBlocks(slug: string): Block[] {
  const page = getMockPage(slug);
  return page?.blocks || [];
}

/**
 * Create test props for Hero Block from mock data
 * Uses actual mock data from mock-data.json
 */
export function createHeroBlockProps(overrides = {}) {
  // Use mock data from centralized source
  const mockHero = mockData.pages[0]?.blocks.find(
    (b) => b.__component === "blocks.hero"
  ) as Block;

  if (!mockHero) {
    throw new Error("Hero block not found in mock data");
  }

  return {
    title: (mockHero as any)?.title,
    subtitle: (mockHero as any)?.subtitle,
    image: (mockHero as any)?.image,
    cta: (mockHero as any)?.cta,
    ...overrides,
  };
}

/**
 * Create test props for Content Block from mock data
 * Uses actual mock data from mock-data.json
 */
export function createContentBlockProps(overrides = {}) {
  // Use mock data from centralized source
  const mockContent = mockData.pages[1]?.blocks.find(
    (b) => b.__component === "blocks.content"
  ) as Block;

  if (!mockContent) {
    throw new Error("Content block not found in mock data");
  }

  return {
    content: (mockContent as any)?.content,
    ...overrides,
  };
}

/**
 * Create test props for Features Block from mock data
 * Uses actual mock data from mock-data.json
 */
export function createFeaturesBlockProps(overrides = {}) {
  // Use mock data from centralized source
  const mockFeatures = mockData.pages[0]?.blocks.find(
    (b) => b.__component === "blocks.features"
  ) as Block;

  if (!mockFeatures) {
    throw new Error("Features block not found in mock data");
  }

  return {
    title: (mockFeatures as any)?.title,
    features: (mockFeatures as any)?.features,
    ...overrides,
  };
}

/**
 * Create test props for CTA Block from mock data
 * Uses actual mock data from mock-data.json
 */
export function createCtaBlockProps(overrides = {}) {
  // Use mock data from centralized source
  const mockCta = mockData.pages[0]?.blocks.find(
    (b) => b.__component === "blocks.cta"
  ) as Block;

  if (!mockCta) {
    throw new Error("CTA block not found in mock data");
  }

  return {
    heading: (mockCta as any)?.heading,
    text: (mockCta as any)?.text,
    button: (mockCta as any)?.button,
    ...overrides,
  };
}

/**
 * Get mock properties for testing
 */
export function getMockProperties() {
  return mockData.properties;
}

/**
 * Create test props for Header component from mock data
 * Uses actual mock data from mock-data.json
 */
export function createHeaderProps(overrides = {}) {
  const mockHeader = mockData.globalOptions?.header;

  if (!mockHeader) {
    throw new Error("Header not found in mock data");
  }

  return {
    logo: mockHeader.logo,
    logoText: mockHeader.logoText,
    links: mockHeader.links || [],
    ...overrides,
  };
}

/**
 * Create test props for Footer component from mock data
 * Uses actual mock data from mock-data.json
 */
export function createFooterProps(overrides = {}) {
  const mockFooter = mockData.globalOptions?.footer;

  if (!mockFooter) {
    throw new Error("Footer not found in mock data");
  }

  return {
    copyright: mockFooter.copyright,
    links: mockFooter.links || [],
    socialMedia: mockFooter.socialMedia,
    ...overrides,
  };
}

/**
 * Create a single block from mock data by component type
 * Useful for PageBuilder tests
 */
export function createMockBlock(
  componentType: string,
  overrides = {}
): Block | null {
  const page = mockData.pages[0];
  if (!page) return null;

  const block = page.blocks.find((b) => b.__component === componentType);
  if (!block) return null;

  return {
    ...block,
    ...overrides,
  } as Block;
}

/**
 * Create multiple blocks from mock data
 * Useful for PageBuilder tests
 */
export function createMockBlocks(componentTypes: string[]): Block[] {
  return componentTypes
    .map((type) => createMockBlock(type))
    .filter((block): block is Block => block !== null);
}

/**
 * Create test props for GlobalOptions from mock data
 * Uses actual mock data from mock-data.json
 */
export function createGlobalOptionsProps(overrides = {}) {
  const mockGlobalOptions = mockData.globalOptions;

  if (!mockGlobalOptions) {
    throw new Error("GlobalOptions not found in mock data");
  }

  return {
    id: mockGlobalOptions.id,
    header: mockGlobalOptions.header,
    footer: mockGlobalOptions.footer,
    ...overrides,
  };
}

/**
 * Get mock testimonials for testing
 */
export function getMockTestimonials() {
  return mockData.testimonials;
}

/**
 * Get mock team members for testing
 */
export function getMockTeam() {
  return mockData.team;
}

/**
 * Wait for next tick
 */
export async function waitForNextTick() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Mock Strapi API response
 */
export function mockStrapiResponse(data: unknown) {
  return {
    data,
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 1,
      },
    },
  };
}

/**
 * Render component with Testing Library queries
 * Combines mountSuspended (for Nuxt compatibility) with Testing Library queries
 * This makes selectors more resilient to DOM structure changes
 */
export async function renderWithTestingLibrary<T extends Component>(
  component: T,
  options?: ComponentMountingOptions<T>
) {
  const wrapper = await mountSuspended(component, options);
  // Get the root element - ensure it's an HTMLElement
  let container: HTMLElement;

  // Check if wrapper.element is an HTMLElement
  if (wrapper.element instanceof HTMLElement) {
    container = wrapper.element;
  } else {
    // If wrapper.element is a comment node or fragment, create a container
    // and use the wrapper's HTML
    container = document.createElement("div");
    const html = wrapper.html();
    // Only set innerHTML if we have content
    if (html && html.trim()) {
      container.innerHTML = html;
    } else {
      // If no HTML, try to get the first child element from wrapper
      // Vue Test Utils might wrap in a fragment
      const vm = wrapper.vm;
      if (vm?.$el instanceof HTMLElement) {
        container = vm.$el;
      } else {
        // Try to find the first element child
        const firstElement = wrapper.element?.firstElementChild;
        if (firstElement instanceof HTMLElement) {
          container = firstElement;
        } else {
          // Last resort: create a wrapper and append the element
          container = document.createElement("div");
          if (wrapper.element) {
            // Clone the element tree
            const clone = wrapper.element.cloneNode(true);
            container.appendChild(clone);
          }
        }
      }
    }
  }

  // Ensure container is in the document for Testing Library queries
  if (!container.isConnected) {
    document.body.appendChild(container);
  }

  const queries = getQueriesForElement(container);

  // Helper to find section element reliably
  const findSection = (): HTMLElement | null => {
    // Try multiple ways to find the section element
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
      } else {
        section = firstChild.querySelector("section");
      }
    }

    return section;
  };

  return {
    ...queries,
    container,
    wrapper,
    findSection,
    // Convenience methods
    unmount: () => {
      if (container.isConnected && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      wrapper.unmount();
    },
  };
}
