/**
 * Composable for accessing mock/fallback data
 *
 * This data serves two purposes:
 * 1. Fallback data when CMS (Strapi) is unavailable
 */

import mockData from "../../server/mock/data.json";
import type { Page, Block, GlobalOptions } from "#shared/types";

export const useMockData = () => {
  /**
   * Get a page by slug (fallback data)
   */
  const getPageBySlug = (slug: string): Page | null => {
    const page = mockData.pages.find((p) => p.slug === slug);
    return page ? (page as Page) : null;
  };

  /**
   * Get all pages (fallback data)
   */
  const getAllPages = (): Page[] => {
    return mockData.pages as Page[];
  };

  /**
   * Get a property by slug (fallback data)
   */
  const getPropertyBySlug = (slug: string) => {
    return mockData.properties.find((p) => p.slug === slug) || null;
  };

  /**
   * Get all properties (fallback data)
   */
  const getAllProperties = () => {
    return mockData.properties;
  };

  /**
   * Get all testimonials (fallback data)
   */
  const getAllTestimonials = () => {
    return mockData.testimonials;
  };

  /**
   * Get all team members (fallback data)
   */
  const getAllTeam = () => {
    return mockData.team;
  };

  /**
   * Get blocks for a page (fallback data)
   */
  const getBlocksForPage = (slug: string): Block[] => {
    const page = getPageBySlug(slug);
    return page?.blocks || [];
  };

  /**
   * Get global options (fallback data)
   * Returns a serializable plain object to avoid serialization issues
   */
  const getGlobalOptions = (): GlobalOptions | null => {
    if (!mockData.globalOptions) return null;
    // Return a plain object copy to ensure serializability
    return JSON.parse(JSON.stringify(mockData.globalOptions)) as GlobalOptions;
  };

  return {
    getPageBySlug,
    getAllPages,
    getPropertyBySlug,
    getAllProperties,
    getAllTestimonials,
    getAllTeam,
    getBlocksForPage,
    getGlobalOptions,
    mockData,
  };
};
