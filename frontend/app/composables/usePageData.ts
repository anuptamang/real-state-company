import type { Page } from "#shared/types";
import { useStrapi } from "./useStrapi";

export const usePageData = () => {
  const route = useRoute();
  const { fetchPages, fetchPage } = useStrapi();

  const getPageIdentifier = () => {
    const routeName = String(route.name || "");
    const routePath = route.path;

    if (routeName === "index" || routePath === "/") {
      return { type: "title" as const, value: "Home" };
    }

    const slug = routeName || routePath.replace(/^\//, "").replace(/\/$/, "");
    return { type: "slug" as const, value: slug };
  };

  const fetchPageByRoute = async (): Promise<Page | null> => {
    const identifier = getPageIdentifier();

    const normalize = (v: string | undefined | null): string =>
      (v ?? "").toLowerCase().trim();

    const findByTitleOrSlug = (
      pages: Page[],
      key: "title" | "slug",
      value: string
    ): Page | null => {
      const normalizedValue = normalize(value);
      const exact = pages.find((p) => normalize(p[key]) === normalizedValue);
      if (exact) return exact;
      return (
        pages.find(
          (p) =>
            normalize(p[key]).startsWith(normalizedValue) &&
            normalize(p[key]) !== normalizedValue
        ) || null
      );
    };

    if (identifier.type === "title") {
      const homePageSlugs = ["home", "home-2", "landing", "index", "homepage"];

      for (const slug of homePageSlugs) {
        try {
          const page = await fetchPage(slug);
          if (page) return page;
        } catch (e) {
          // Continue to next slug
        }
      }

      const pages = await fetchPages();
      if (!pages?.length) return null;

      const result = findByTitleOrSlug(pages, "title", identifier.value);
      if (result) return result;

      const homeLikePage = pages.find(
        (p) =>
          p.slug &&
          (p.slug.toLowerCase().startsWith("home") ||
            p.slug.toLowerCase() === "landing")
      );
      return homeLikePage || null;
    } else {
      const slug = identifier.value;
      try {
        const page = await fetchPage(slug);
        if (page) return page;
      } catch (e) {
        // Fall through to fallback
      }

      const pages = await fetchPages();
      if (!pages?.length) return null;

      return findByTitleOrSlug(pages, "slug", slug);
    }
  };

  return {
    fetchPageByRoute,
    getPageIdentifier,
  };
};
