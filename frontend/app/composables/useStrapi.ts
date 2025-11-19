import type { Page, Block, GlobalOptions } from "#shared/types";
import { useMockData } from "./useMockData";
import {
  transformStrapiPage,
  transformStrapiPages,
  transformStrapiGlobalOptions,
  transformStrapiBlocks,
} from "~/utils/strapi-transformer";

export const useStrapi = () => {
  const config = useRuntimeConfig();
  const dataSource = config.public.dataSource || "auto";
  const strapiUrl = config.public.strapiUrl;
  const apiToken = config.public.strapiApiToken;
  const { getPageBySlug, getAllPages, getBlocksForPage, getGlobalOptions } =
    useMockData();

  const shouldUseCMS = () => {
    if (dataSource === "mock") return false;
    if (dataSource === "cms") return true;
    return !!(strapiUrl && apiToken);
  };

  const fetchPage = async (slug: string): Promise<Page | null> => {
    if (!shouldUseCMS()) {
      return getPageBySlug(slug);
    }

    try {
      const query = new URLSearchParams();
      query.append("filters[slug][$eq]", slug);
      query.append("populate", "deep");

      const absoluteUrl = strapiUrl.startsWith("http")
        ? `${strapiUrl}/api/pages?${query.toString()}`
        : `http://${strapiUrl}/api/pages?${query.toString()}`;

      const response = await $fetch<any>(absoluteUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (
        !response.data ||
        (Array.isArray(response.data) && response.data.length === 0)
      ) {
        return null;
      }

      return transformStrapiPage(response, strapiUrl);
    } catch (error: any) {
      const isConnectionError =
        error?.message?.includes("fetch failed") ||
        error?.cause?.code === "ECONNREFUSED" ||
        error?.cause?.code === "ENOTFOUND" ||
        error?.message?.includes("ECONNREFUSED");

      if (process.dev && !isConnectionError) {
        console.error("[fetchPage] Error fetching page:", error);
      }
      return getPageBySlug(slug);
    }
  };

  const fetchPages = async (): Promise<Page[]> => {
    if (!shouldUseCMS()) {
      return getAllPages();
    }

    try {
      const query = new URLSearchParams();
      query.append("populate", "deep");

      const absoluteUrl = strapiUrl.startsWith("http")
        ? `${strapiUrl}/api/pages?${query.toString()}`
        : `http://${strapiUrl}/api/pages?${query.toString()}`;

      const response = await $fetch<any>(absoluteUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      // If API returns empty array, return empty array (don't fallback to mock)
      const transformed = transformStrapiPages(response, strapiUrl);
      return transformed;
    } catch (error: any) {
      const isConnectionError =
        error?.message?.includes("fetch failed") ||
        error?.cause?.code === "ECONNREFUSED" ||
        error?.cause?.code === "ENOTFOUND" ||
        error?.message?.includes("ECONNREFUSED");

      if (process.dev && !isConnectionError) {
        console.error("[fetchPages] Error fetching pages:", error);
      }
      return getAllPages();
    }
  };

  const fetchBlocks = async (
    pageId: string,
    slug?: string
  ): Promise<Block[]> => {
    // Use mock data if configured to do so
    if (!shouldUseCMS()) {
      if (slug) {
        return getBlocksForPage(slug);
      }
      return [];
    }

    try {
      // Use absolute URL to prevent Vue Router from intercepting
      const absoluteUrl = strapiUrl.startsWith("http")
        ? `${strapiUrl}/api/pages/${pageId}?populate=blocks`
        : `http://${strapiUrl}/api/pages/${pageId}?populate=blocks`;

      const response = await $fetch<any>(absoluteUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      // Extract blocks from Strapi response
      // Handle different response structures:
      // 1. { data: { attributes: { blocks: [...] } } } - nested format
      // 2. { data: { blocks: [...] } } - flat format
      // 3. { data: { id, attributes: {...} } } - single entity with blocks in attributes
      let blocks: any[] = [];
      if (response.data) {
        if (response.data.attributes?.blocks) {
          blocks = response.data.attributes.blocks;
        } else if (response.data.blocks) {
          blocks = response.data.blocks;
        } else if (Array.isArray(response.data)) {
          // If data is an array, it might be blocks directly
          blocks = response.data;
        }
      }

      // Transform Strapi blocks to our format
      return transformStrapiBlocks(blocks, strapiUrl);
    } catch (error) {
      // Silently fall back to mock data
      if (slug) {
        return getBlocksForPage(slug);
      }
      return [];
    }
  };

  const fetchGlobalOptions = async (): Promise<GlobalOptions | null> => {
    // Use mock data if configured to do so
    if (!shouldUseCMS()) {
      return getGlobalOptions();
    }

    try {
      // Build populate query for nested components including menu items (component-based)
      // Note: No parent field - using parentOrder instead
      // const populateQuery =
      //   "populate[header][populate][logo]=*&populate[header][populate][menu][populate][items][populate][page]=*&populate[header][populate][menu][populate][items][populate][property]=*&populate[header][populate][links]=*&populate[footer][populate][links]=*&populate[footer][populate][socialMedia]=*&populate[footer][populate][menu][populate][items][populate][page]=*&populate[footer][populate][menu][populate][items][populate][property]=*";

      // const absoluteUrl = strapiUrl.startsWith("http")
      //   ? `${strapiUrl}/api/global-option?${populateQuery}`
      //   : `http://${strapiUrl}/api/global-option?${populateQuery}`;

      const absoluteUrl = strapiUrl.startsWith("http")
        ? `${strapiUrl}/api/global-option`
        : `http://${strapiUrl}/api/global-option`;

      const response = await $fetch<any>(absoluteUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      // If API returns null data, return null (don't fallback to mock)
      if (!response || !response.data) {
        return null;
      }

      // Transform Strapi response to our format
      // The transformer expects the full response object with { data: {...} } structure
      return transformStrapiGlobalOptions(response, strapiUrl);
    } catch (error) {
      if (process.dev) {
        console.error("Failed to fetch global options:", error);
      }
      return getGlobalOptions();
    }
  };

  const fetchProperty = async (slug: string): Promise<any | null> => {
    if (!shouldUseCMS()) {
      const { getPropertyBySlug } = useMockData();
      return getPropertyBySlug(slug);
    }

    try {
      const query = new URLSearchParams();
      query.append("filters[slug][$eq]", slug);
      query.append("populate", "deep");

      const absoluteUrl = strapiUrl.startsWith("http")
        ? `${strapiUrl}/api/properties?${query.toString()}`
        : `http://${strapiUrl}/api/properties?${query.toString()}`;

      const response = await $fetch<any>(absoluteUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (
        !response.data ||
        (Array.isArray(response.data) && response.data.length === 0)
      ) {
        return null;
      }

      const entity = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (!entity) return null;

      const isNestedFormat = entity.attributes !== undefined;
      const data = isNestedFormat ? entity.attributes : entity;

      // Transform images array - handle different Strapi response formats
      let images: Array<{ url: string; alt?: string }> = [];

      if (data.images) {
        // Handle array format (populate=deep might return array directly)
        if (Array.isArray(data.images)) {
          images = data.images
            .map((img: any) => {
              const imgData =
                img.attributes || img.data?.attributes || img.data || img;
              const url =
                imgData.url ||
                imgData.formats?.large?.url ||
                imgData.formats?.medium?.url ||
                imgData.formats?.small?.url;
              if (!url) return null;

              let absoluteUrl = url;
              if (url && !url.startsWith("http") && !url.startsWith("//")) {
                const baseUrl = strapiUrl.startsWith("http")
                  ? strapiUrl
                  : `http://${strapiUrl}`;
                absoluteUrl = `${baseUrl.replace(/\/$/, "")}${
                  url.startsWith("/") ? url : `/${url}`
                }`;
              }

              return {
                url: absoluteUrl,
                alt: imgData.alternativeText || imgData.caption || data.title,
              };
            })
            .filter(
              (img: any): img is { url: string; alt?: string } => img !== null
            );
        }
        // Handle nested data format (standard Strapi format)
        else if (data.images.data && Array.isArray(data.images.data)) {
          images = data.images.data
            .map((img: any) => {
              const imgData = img.attributes || img;
              const url =
                imgData.url ||
                imgData.formats?.large?.url ||
                imgData.formats?.medium?.url ||
                imgData.formats?.small?.url;
              if (!url) return null;

              let absoluteUrl = url;
              if (url && !url.startsWith("http") && !url.startsWith("//")) {
                const baseUrl = strapiUrl.startsWith("http")
                  ? strapiUrl
                  : `http://${strapiUrl}`;
                absoluteUrl = `${baseUrl.replace(/\/$/, "")}${
                  url.startsWith("/") ? url : `/${url}`
                }`;
              }

              return {
                url: absoluteUrl,
                alt: imgData.alternativeText || imgData.caption || data.title,
              };
            })
            .filter(
              (img: any): img is { url: string; alt?: string } => img !== null
            );
        }
      }

      return {
        id: String(entity.id),
        slug: data.slug || "",
        title: data.title || "",
        price: parseFloat(data.price) || 0,
        location: data.location || "",
        description: data.description || "",
        bedrooms: data.bedrooms || undefined,
        bathrooms: data.bathrooms || undefined,
        sqft: data.sqft || undefined,
        images: images.length > 0 ? images : undefined,
      };
    } catch (error: any) {
      const isConnectionError =
        error?.message?.includes("fetch failed") ||
        error?.cause?.code === "ECONNREFUSED" ||
        error?.cause?.code === "ENOTFOUND" ||
        error?.message?.includes("ECONNREFUSED");

      if (process.dev && !isConnectionError) {
        console.error("[fetchProperty] Error fetching property:", error);
      }
      const { getPropertyBySlug } = useMockData();
      return getPropertyBySlug(slug);
    }
  };

  return {
    fetchPage,
    fetchPages,
    fetchBlocks,
    fetchGlobalOptions,
    fetchProperty,
  };
};
