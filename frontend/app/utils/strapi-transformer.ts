/**
 * Transforms Strapi API responses to match our application's expected data structure.
 * Handles both nested (attributes) and flat formats from Strapi v4/v5.
 */

import type { Page, Block, GlobalOptions } from "#shared/types";

/**
 * Strapi's raw response structure for a single entity
 */
interface StrapiEntity<T> {
  id: number | string;
  attributes: T;
}

/**
 * Strapi's raw response structure for a collection
 */
interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi's raw response structure for a single entity response
 */
interface StrapiSingleResponse<T> {
  data: StrapiEntity<T> | null;
  meta?: Record<string, unknown>;
}

/**
 * Strapi's media field structure
 */
interface StrapiMedia {
  data: {
    id: number | string;
    attributes: {
      url: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: Record<string, unknown>;
    };
  } | null;
}

/**
 * Transform Strapi media field to our format
 * Handles both formats:
 * 1. Nested: { data: { id, attributes: { url, alternativeText } } }
 * 2. Flat: { id, url, alternativeText, ... }
 * @param strapiUrl - Optional Strapi base URL for converting relative URLs to absolute
 */
function transformMedia(
  media: StrapiMedia | any | null | undefined,
  strapiUrl?: string
): { url: string; alt?: string } | undefined {
  if (!media) return undefined;

  let url: string | undefined;
  let alternativeText: string | undefined;

  // Handle nested format: { data: { id, attributes: { url, alternativeText } } }
  if (media.data) {
    if (media.data.attributes) {
      url = media.data.attributes.url;
      alternativeText = media.data.attributes.alternativeText;
    } else if (media.data.url) {
      // Handle flat data format: { data: { url, alternativeText } }
      url = media.data.url;
      alternativeText = media.data.alternativeText;
    }
  }
  // Handle flat format: { id, url, alternativeText, ... } or { documentId, url, ... }
  else if (media.url) {
    url = media.url;
    alternativeText = media.alternativeText || media.alternativeText;
  }
  // Handle attributes format: { attributes: { url, alternativeText } }
  else if (media.attributes && media.attributes.url) {
    url = media.attributes.url;
    alternativeText = media.attributes.alternativeText;
  }
  // Handle direct string URL (from populate=deep might return just the URL string)
  else if (typeof media === "string" && media.startsWith("/")) {
    url = media;
    alternativeText = undefined;
  }
  // Handle array format (single media): [{ data: {...} }]
  else if (Array.isArray(media) && media.length > 0) {
    return transformMedia(media[0], strapiUrl);
  }

  if (!url) {
    return undefined;
  }

  // Make URL absolute if it's relative
  if (!url.startsWith("http") && !url.startsWith("//")) {
    const baseStrapiUrl = strapiUrl || "http://localhost:1337";
    let baseUrl: string;
    if (
      baseStrapiUrl.startsWith("http://") ||
      baseStrapiUrl.startsWith("https://")
    ) {
      baseUrl = baseStrapiUrl;
    } else if (baseStrapiUrl) {
      baseUrl = `http://${baseStrapiUrl}`;
    } else {
      baseUrl = "http://localhost:1337";
    }
    baseUrl = baseUrl.replace(/\/$/, "");
    const relativePath = url.startsWith("/") ? url : `/${url}`;
    url = `${baseUrl}${relativePath}`;
  }

  return {
    url,
    alt: alternativeText || undefined,
  };
}

/**
 * Transform Strapi component/block structure
 * Strapi returns components with __component field directly in attributes
 * Handles both nested (attributes) and flat formats
 * @param strapiUrl - Optional Strapi base URL for converting relative URLs to absolute
 */
function transformBlock(block: any, strapiUrl?: string): Block {
  // If it's already in our format (from mock data), return as-is
  if (block.__component && !block.attributes && !block.data) {
    return block as Block;
  }

  // Handle both nested (attributes) and flat formats
  const isNestedFormat = block.attributes !== undefined;
  const data = isNestedFormat ? block.attributes : block;
  const id = block.id || block.data?.id;

  // Transform from Strapi format
  const transformed: any = {
    id: String(id || ""),
    __component: block.__component || data.__component || "",
  };

  // Transform all fields recursively using transformObject
  // This handles media, relations, nested objects, arrays, etc.
  for (const [key, value] of Object.entries(data)) {
    if (key === "__component") continue;

    if (key === "image") {
      let transformedImage: any = null;

      if (typeof value === "string" && value.startsWith("/")) {
        transformedImage = transformMedia({ url: value }, strapiUrl);
      } else if (typeof value === "object" && value !== null) {
        if ("url" in value && typeof value.url === "string") {
          transformedImage = transformMedia(value, strapiUrl);
        } else if ("data" in value || "attributes" in value) {
          transformedImage = transformMedia(value, strapiUrl);
        } else {
          const result = transformObject({ image: value }, strapiUrl);
          transformedImage = result.image;
        }
      }

      if (transformedImage) {
        transformed[key] = transformedImage;
        continue;
      }
    }

    // Use transformObject to handle all field types (media, relations, nested objects, arrays)
    transformed[key] = transformObject({ [key]: value }, strapiUrl)[key];
  }

  return transformed as Block;
}

function transformRelation(relation: any, strapiUrl?: string): any {
  if (!relation || typeof relation !== "object") return relation;

  // Handle single relation: { data: { id, attributes: {...} } }
  if (relation.data && !Array.isArray(relation.data)) {
    const entity = relation.data;
    const isNestedFormat = entity.attributes !== undefined;
    const data = isNestedFormat ? entity.attributes : entity;
    const id = entity.id;

    // Transform recursively (pass strapiUrl to handle media URLs)
    const transformed = transformObject(data, strapiUrl);

    return {
      id: String(id),
      ...transformed,
    };
  }

  // Handle array relation: { data: [{ id, attributes: {...} }] }
  if (relation.data && Array.isArray(relation.data)) {
    return relation.data.map((entity: any) => {
      const isNestedFormat = entity.attributes !== undefined;
      const data = isNestedFormat ? entity.attributes : entity;
      const id = entity.id;

      // Transform recursively (pass strapiUrl to handle media URLs)
      const transformed = transformObject(data, strapiUrl);

      return {
        id: String(id),
        ...transformed,
      };
    });
  }

  // If it's already transformed or doesn't match relation format, return as-is
  return relation;
}

function transformObject(
  obj: Record<string, unknown>,
  strapiUrl?: string
): any {
  if (!obj || typeof obj !== "object") return obj;

  const transformed: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      transformed[key] = value;
      continue;
    }

    // Handle string URLs that look like media paths (starts with /uploads or /)
    // This handles cases where media fields come as plain strings instead of objects
    if (
      typeof value === "string" &&
      value.startsWith("/") &&
      (key === "image" ||
        key === "avatar" ||
        key === "url" ||
        key.toLowerCase().includes("image"))
    ) {
      const media = transformMedia({ url: value }, strapiUrl);
      if (media) {
        transformed[key] = media;
        continue;
      }
    }

    if (
      (key === "image" || key === "avatar") &&
      typeof value === "object" &&
      value !== null
    ) {
      const transformedImage = transformMedia(value, strapiUrl);
      if (transformedImage) {
        if (
          transformedImage.url &&
          transformedImage.url.startsWith("/") &&
          !transformedImage.url.startsWith("http") &&
          !transformedImage.url.startsWith("//")
        ) {
          const baseStrapiUrl = strapiUrl || "http://localhost:1337";
          let baseUrl: string;
          if (
            baseStrapiUrl.startsWith("http://") ||
            baseStrapiUrl.startsWith("https://")
          ) {
            baseUrl = baseStrapiUrl;
          } else if (baseStrapiUrl) {
            baseUrl = `http://${baseStrapiUrl}`;
          } else {
            baseUrl = "http://localhost:1337";
          }
          baseUrl = baseUrl.replace(/\/$/, "");
          transformedImage.url = `${baseUrl}${transformedImage.url}`;
        }
        transformed[key] = transformedImage;
        continue;
      }

      if ("url" in value && typeof value.url === "string") {
        if (
          value.url.startsWith("/") &&
          !value.url.startsWith("http") &&
          !value.url.startsWith("//")
        ) {
          const baseStrapiUrl = strapiUrl || "http://localhost:1337";
          let baseUrl: string;
          if (
            baseStrapiUrl.startsWith("http://") ||
            baseStrapiUrl.startsWith("https://")
          ) {
            baseUrl = baseStrapiUrl;
          } else if (baseStrapiUrl) {
            baseUrl = `http://${baseStrapiUrl}`;
          } else {
            baseUrl = "http://localhost:1337";
          }
          baseUrl = baseUrl.replace(/\/$/, "");

          const imageValue = value as any;
          transformed[key] = {
            url: `${baseUrl}${imageValue.url}`,
            alt: imageValue.alt || imageValue.alternativeText,
          };
          continue;
        }
      }
    }

    // Handle relations (wrapped in data.attributes or data)
    // Check if it's a relation: { data: { id, attributes: {...} } } or { data: [{...}] }
    if (
      typeof value === "object" &&
      "data" in value &&
      (value.data === null ||
        (typeof value.data === "object" &&
          ("id" in value.data || Array.isArray(value.data))))
    ) {
      const relation = transformRelation(value, strapiUrl);
      if (relation) {
        transformed[key] = relation;
        continue;
      }
    }

    // Handle media fields (both nested and flat formats)
    // Check after relations to avoid false positives
    // Also check for objects with attributes.url (nested Strapi format)
    if (typeof value === "object" && value !== null) {
      const hasData = "data" in value && value.data;
      const hasUrl = "url" in value;
      const hasAttributesUrl =
        "attributes" in value &&
        value.attributes &&
        typeof value.attributes === "object" &&
        "url" in value.attributes;

      // Also check if it's a media object with id and url (flat format from populate=deep)
      const looksLikeMedia =
        hasData ||
        hasUrl ||
        hasAttributesUrl ||
        (("id" in value || "documentId" in value) && "url" in value);

      if (looksLikeMedia) {
        const media = transformMedia(value, strapiUrl);
        if (media) {
          transformed[key] = media;
          continue;
        }
      }
    }

    // Handle rich text editor content (content.data array)
    // Preserve rich text structure as-is for rendering
    if (key === "content" && typeof value === "object" && "data" in value) {
      // Rich text content structure - preserve as-is
      transformed[key] = value;
      continue;
    }

    if (
      key === "icon" &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const iconObj = value as any;
      if (
        iconObj.name ||
        iconObj.__component === "shared.icon" ||
        (iconObj.attributes && iconObj.attributes.name)
      ) {
        const iconName =
          iconObj.name ||
          iconObj.attributes?.name ||
          (iconObj.data &&
            (iconObj.data.name || iconObj.data.attributes?.name));
        if (iconName && typeof iconName === "string") {
          transformed[key] = iconName;
          continue;
        }
      }
    }

    // Handle nested objects (like seo, cta, button)
    if (typeof value === "object" && !Array.isArray(value)) {
      transformed[key] = transformObject(
        value as Record<string, unknown>,
        strapiUrl
      );
      continue;
    }

    // Handle arrays (like tags, features, team members, etc.)
    if (Array.isArray(value)) {
      transformed[key] = value.map((item: any) => {
        // Check if array item is a relation
        if (
          item &&
          typeof item === "object" &&
          "data" in item &&
          (item.data === null ||
            (typeof item.data === "object" &&
              ("id" in item.data || Array.isArray(item.data))))
        ) {
          return transformRelation(item, strapiUrl);
        }
        // Check if array item is a media object
        if (
          item &&
          typeof item === "object" &&
          ("data" in item || "url" in item)
        ) {
          const media = transformMedia(item, strapiUrl);
          if (media) return media;
        }
        // Recursively transform nested objects (this handles team members, testimonials, etc.)
        if (item && typeof item === "object") {
          return transformObject(item, strapiUrl);
        }
        return item;
      });
      continue;
    }

    // Copy primitive values
    transformed[key] = value;
  }

  return transformed;
}

/**
 * Transform Strapi page response to our Page format
 * Handles both formats:
 * 1. Nested: { data: { id, attributes: {...} } }
 * 2. Flat: { data: { id, title, slug, ... } }
 * @param strapiUrl - Optional Strapi base URL for converting relative URLs to absolute
 */
export function transformStrapiPage(
  strapiResponse:
    | StrapiSingleResponse<any>
    | StrapiCollectionResponse<any>
    | any,
  strapiUrl?: string
): Page | null {
  let entity: any = null;

  // Handle single entity response
  if ("data" in strapiResponse && strapiResponse.data) {
    if (Array.isArray(strapiResponse.data)) {
      // Collection response - take first item
      entity = strapiResponse.data[0] || null;
    } else {
      // Single entity response
      entity = strapiResponse.data;
    }
  }

  if (!entity) return null;

  // Handle both nested (attributes) and flat formats
  const isNestedFormat = entity.attributes !== undefined;
  const data = isNestedFormat ? entity.attributes : entity;
  const id = entity.id;

  // Helper function to make URL absolute
  const makeUrlAbsolute = (url: string, baseUrl?: string): string => {
    if (!url || url.startsWith("http") || url.startsWith("//")) {
      return url;
    }
    const baseStrapiUrl = baseUrl || strapiUrl || "http://localhost:1337";
    let base: string;
    if (
      baseStrapiUrl.startsWith("http://") ||
      baseStrapiUrl.startsWith("https://")
    ) {
      base = baseStrapiUrl;
    } else if (baseStrapiUrl) {
      base = `http://${baseStrapiUrl}`;
    } else {
      base = "http://localhost:1337";
    }
    base = base.replace(/\/$/, "");
    return `${base}${url.startsWith("/") ? url : `/${url}`}`;
  };

  // Recursive function to fix all image URLs in nested objects/arrays
  const fixImageUrls = (obj: any, baseUrl?: string): any => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => fixImageUrls(item, baseUrl));
    }

    const fixed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Handle image/avatar fields (media fields that might have relative URLs)
      if (
        (key === "image" || key === "avatar") &&
        value &&
        typeof value === "object" &&
        "url" in value
      ) {
        const imageValue = value as any;
        if (imageValue.url && typeof imageValue.url === "string") {
          const url = imageValue.url;
          if (
            url.startsWith("/") &&
            !url.startsWith("http") &&
            !url.startsWith("//")
          ) {
            fixed[key] = {
              ...imageValue,
              url: makeUrlAbsolute(url, baseUrl),
            };
            continue;
          }
        }
      }

      // Handle images array field (for properties)
      if (key === "images" && Array.isArray(value)) {
        fixed[key] = value.map((img: any) => {
          if (img && typeof img === "object" && "url" in img) {
            const imgValue = img as any;
            if (imgValue.url && typeof imgValue.url === "string") {
              const url = imgValue.url;
              if (
                url.startsWith("/") &&
                !url.startsWith("http") &&
                !url.startsWith("//")
              ) {
                return {
                  ...imgValue,
                  url: makeUrlAbsolute(url, baseUrl),
                };
              }
            }
          }
          return img;
        });
        continue;
      }

      // Recursively fix nested objects and arrays
      if (value && typeof value === "object") {
        fixed[key] = fixImageUrls(value, baseUrl);
      } else {
        fixed[key] = value;
      }
    }

    return fixed;
  };

  // Transform blocks (dynamic zone)
  const blocks =
    data.blocks?.map((block: any) => {
      const transformed = transformBlock(block, strapiUrl);

      // Post-process: Recursively fix all image URLs in the block
      // This ensures team member images, hero images, and any other nested images are absolute
      const fixed = fixImageUrls(transformed, strapiUrl);

      // Special handling for properties-list block: convert images array to image (first image)
      if (
        fixed.__component === "blocks.properties-list" &&
        fixed.properties &&
        Array.isArray(fixed.properties)
      ) {
        fixed.properties = fixed.properties.map((property: any) => {
          // If property has images array but no image, use first image
          if (
            property.images &&
            Array.isArray(property.images) &&
            property.images.length > 0 &&
            !property.image
          ) {
            const firstImage = property.images[0];
            // If firstImage is already transformed to { url, alt }, use it directly
            if (
              firstImage &&
              typeof firstImage === "object" &&
              "url" in firstImage
            ) {
              property.image = firstImage;
            } else {
              property.image = transformMedia(firstImage, strapiUrl);
            }
          }
          return property;
        });
      }

      return fixed;
    }) || [];

  return {
    id: String(id),
    slug: data.slug || "",
    title: data.title || "",
    metaTitle: data.metaTitle || undefined,
    metaDescription: data.metaDescription || undefined,
    blocks,
  };
}

export function transformStrapiPages(
  strapiResponse: StrapiCollectionResponse<any>,
  strapiUrl?: string
): Page[] {
  if (!strapiResponse.data || !Array.isArray(strapiResponse.data)) {
    return [];
  }

  return strapiResponse.data
    .map((entity) => {
      const page = transformStrapiPage({ data: entity }, strapiUrl);
      return page;
    })
    .filter((page): page is Page => page !== null);
}

export function transformStrapiGlobalOptions(
  strapiResponse: StrapiSingleResponse<any> | any,
  strapiUrl?: string
): GlobalOptions | null {
  if (!strapiResponse.data) return null;

  const entity = strapiResponse.data;

  // Handle both nested (attributes) and flat formats
  const isNestedFormat = entity.attributes !== undefined;
  const data = isNestedFormat ? entity.attributes : entity;
  const id = entity.id;

  // Transform menu items (WordPress-style: component-based with direct page/property references)
  // Hierarchy is built based on order and parentOrder fields
  const transformMenuItems = (items: any[]): any[] => {
    if (!items || !Array.isArray(items)) return [];

    // Transform each menu item (now a component, not a separate content type)
    const transformed = items.map((item: any, index: number) => {
      // Handle component format: item is already the component data
      const itemData = item.attributes || item;

      // Get title: use override title, or get from page/property, or use index
      let title = itemData.title || "";

      // Get URL: prefer page slug, then property slug, then custom URL
      let url = "";
      if (itemData.page) {
        const page = itemData.page.attributes || itemData.page;
        // Home page should have empty slug (just "/")
        // Check if it's the home page by title or slug
        const isHomePage =
          page.title?.toLowerCase() === "home" ||
          page.slug === "home" ||
          page.slug === "homepage" ||
          !page.slug ||
          page.slug === "";

        if (isHomePage) {
          url = "/";
        } else {
          url = `/${page.slug}`;
        }
        if (!title && page.title) {
          title = page.title;
        }
      } else if (itemData.property) {
        const property = itemData.property.attributes || itemData.property;
        url = property.slug ? `/properties/${property.slug}` : "#";
        if (!title && property.title) {
          title = property.title;
        }
      } else if (itemData.customUrl) {
        url =
          itemData.customUrl.startsWith("/") ||
          itemData.customUrl.startsWith("http")
            ? itemData.customUrl
            : `/${itemData.customUrl}`;
      } else {
        url = "#";
      }

      return {
        id: String(itemData.id || `menu-item-${index}`),
        title: title || "Untitled",
        url: url,
        order: itemData.order !== undefined ? itemData.order : index,
        parentOrder:
          itemData.parentOrder !== undefined ? itemData.parentOrder : null,
      };
    });

    // Sort by order, then by id for items with same order
    transformed.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.id.localeCompare(b.id);
    });

    // Build hierarchy based on parentOrder
    // Use id as the key since order might not be unique
    const itemMap = new Map(
      transformed.map((item) => [item.id, { ...item, children: [] as any[] }])
    );
    const rootItems: any[] = [];

    transformed.forEach((item) => {
      const itemWithChildren = itemMap.get(item.id);
      if (!itemWithChildren) return; // Skip if item not found in map

      if (item.parentOrder !== null && item.parentOrder !== undefined) {
        // Find parent by matching parentOrder to an item's order
        const parent = Array.from(itemMap.values()).find(
          (p) => p.order === item.parentOrder
        );
        if (parent) {
          parent.children.push(itemWithChildren);
        } else {
          // Parent not found, treat as root item
          rootItems.push(itemWithChildren);
        }
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    // Remove parentOrder from final output
    return rootItems.map((item) => {
      const { parentOrder, ...rest } = item;
      return {
        ...rest,
        children:
          rest.children?.map((child: any) => {
            const { parentOrder: _, ...childRest } = child;
            return childRest;
          }) || [],
      };
    });
  };

  // Transform site
  const site = data.site
    ? {
        siteName: data.site.siteName || "",
        siteUrl: data.site.siteUrl || "",
        siteDescription: data.site.siteDescription || undefined,
        favicon: transformMedia(data.site.favicon, strapiUrl),
      }
    : undefined;

  // Transform header
  const header = data.header
    ? {
        logo: transformMedia(data.header.logo, strapiUrl),
        logoText: data.header.logoText || undefined,
        menu: data.header.menu
          ? transformMenuItems(
              data.header.menu.items ||
                data.header.menu.attributes?.items ||
                (data.header.menu.data &&
                  (data.header.menu.data.items ||
                    data.header.menu.data.attributes?.items)) ||
                []
            )
          : undefined,
        links:
          data.header.links && Array.isArray(data.header.links)
            ? data.header.links.map((link: any) => {
                // Handle both component format and flat format
                const linkData =
                  link.text !== undefined ? link : link.data || link;
                return {
                  text: linkData?.text || linkData?.label || "",
                  url: linkData?.url || linkData?.href || "",
                };
              })
            : [],
      }
    : null;

  // Transform footer
  const footer = data.footer
    ? {
        copyright: data.footer.copyright || undefined,
        links:
          data.footer.links &&
          Array.isArray(data.footer.links) &&
          data.footer.links.length > 0
            ? data.footer.links.map((link: any) => {
                // Handle both component format and flat format
                const linkData =
                  link.text !== undefined ? link : link.data || link;
                return {
                  text: linkData?.text || linkData?.label || "",
                  url: linkData?.url || linkData?.href || "",
                };
              })
            : [],
        socialMedia:
          data.footer.socialMedia &&
          Array.isArray(data.footer.socialMedia) &&
          data.footer.socialMedia.length > 0
            ? data.footer.socialMedia.map((social: any) => {
                // Handle both component format and flat format
                const socialData =
                  social.name !== undefined ? social : social.data || social;
                return {
                  name: socialData?.name || socialData?.platform || "",
                  url: socialData?.url || socialData?.href || "",
                  icon: socialData?.icon || undefined,
                };
              })
            : undefined,
        menu: data.footer.menu
          ? transformMenuItems(
              data.footer.menu.items ||
                data.footer.menu.attributes?.items ||
                (data.footer.menu.data &&
                  (data.footer.menu.data.items ||
                    data.footer.menu.data.attributes?.items)) ||
                []
            )
          : undefined,
      }
    : null;

  // Return null only if both header and footer are missing
  // Allow header or footer to be null individually
  if (!header && !footer) return null;

  return {
    id: String(id),
    site: site || undefined,
    header: header || null,
    footer: footer || null,
  };
}

export function transformStrapiBlocks(
  blocks: any[],
  strapiUrl?: string
): Block[] {
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block) => transformBlock(block, strapiUrl));
}

export function transformStrapiEntity<T = any>(
  strapiResponse:
    | StrapiSingleResponse<any>
    | StrapiCollectionResponse<any>
    | any
): T | null {
  let entity: any = null;

  // Handle single entity response
  if ("data" in strapiResponse && strapiResponse.data) {
    if (Array.isArray(strapiResponse.data)) {
      // Collection response - take first item
      entity = strapiResponse.data[0] || null;
    } else {
      // Single entity response
      entity = strapiResponse.data;
    }
  }

  if (!entity) return null;

  // Handle both nested (attributes) and flat formats
  const isNestedFormat = entity.attributes !== undefined;
  const data = isNestedFormat ? entity.attributes : entity;
  const id = entity.id;

  // Transform all fields recursively
  const transformed = transformObject(data);

  return {
    id: String(id),
    ...transformed,
  } as T;
}

export function transformStrapiCollection<T = any>(
  strapiResponse: StrapiCollectionResponse<any> | any
): T[] {
  if (!strapiResponse.data || !Array.isArray(strapiResponse.data)) {
    return [];
  }

  return strapiResponse.data
    .map((entity: any) => {
      // Handle both nested (attributes) and flat formats
      const isNestedFormat = entity.attributes !== undefined;
      const data = isNestedFormat ? entity.attributes : entity;
      const id = entity.id;

      // Transform all fields recursively
      const transformed = transformObject(data);

      return {
        id: String(id),
        ...transformed,
      } as T;
    })
    .filter((item: T | null): item is T => item !== null);
}
