/**
 * Test setup file for Vitest
 * This file runs before all tests
 */

import { vi, expect } from "vitest";
import { config } from "@vue/test-utils";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Set environment variables for tests to enable CMS mode
// This ensures useRuntimeConfig() returns the correct values in tests
process.env.NUXT_PUBLIC_DATA_SOURCE = process.env.NUXT_PUBLIC_DATA_SOURCE || "cms";
process.env.NUXT_PUBLIC_STRAPI_URL = process.env.NUXT_PUBLIC_STRAPI_URL || "https://test.strapi.com";
process.env.NUXT_PUBLIC_STRAPI_API_TOKEN = process.env.NUXT_PUBLIC_STRAPI_API_TOKEN || "test-token";

// Global test configuration
config.global.mocks = {
  $nuxt: {
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  },
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
