/**
 * Mock utilities for testing
 */

import { vi } from "vitest";

/**
 * Mock Strapi API client
 */
export const mockStrapiClient = {
  find: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

/**
 * Mock Nuxt useFetch
 */
export const mockUseFetch = vi.fn();

/**
 * Mock Nuxt useAsyncData
 */
export const mockUseAsyncData = vi.fn();

/**
 * Reset all mocks
 */
export function resetMocks() {
  vi.clearAllMocks();
  mockStrapiClient.find.mockReset();
  mockStrapiClient.findOne.mockReset();
  mockStrapiClient.create.mockReset();
  mockStrapiClient.update.mockReset();
  mockStrapiClient.delete.mockReset();
  mockUseFetch.mockReset();
  mockUseAsyncData.mockReset();
}
