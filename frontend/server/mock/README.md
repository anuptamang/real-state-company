# Mock Data / Fallback Data

This directory contains centralized mock data for the website.

## Purpose

1. **Fallback Data**: Used when Strapi CMS is unavailable or during development
2. **Testing Data**: Used for TDD workflow and test cases
3. **Static Site Data**: Can be used for static site generation

## Structure

- `data.json` - Centralized mock data for all pages, properties, testimonials, and team members

## Why in `server/mock/`?

According to [Nuxt's official directory structure](https://nuxt.com/docs/4.x/guide/directory-structure/server), the `server/` directory is for server-side code. While `server/mock/` is not explicitly mentioned in the docs, placing mock data here makes sense because:

- ✅ `server/` is an official Nuxt directory
- ✅ Mock data is used by server-side composables (fallback logic)
- ✅ Keeps data separate from application code
- ✅ Can be accessed from both app and server contexts

## Usage

### In Composables

```typescript
import mockData from "../../server/mock/data.json";
// or
import { useMockData } from "~/composables/useMockData";
```

### In Tests

```typescript
import mockData from "../../server/mock/data.json";
// or
import { getMockPage, createHeroBlockProps } from "../utils/test-helpers";
```

### As Fallback

The `useStrapi` composable automatically falls back to mock data when Strapi is unavailable:

```typescript
const { fetchPage } = useStrapi();
// Automatically uses mock data if Strapi fails
const page = await fetchPage("home");
```

## Data Structure

The mock data follows the same structure as Strapi CMS responses:

- `pages` - Array of page objects with blocks
- `properties` - Array of property listings
- `testimonials` - Array of testimonials
- `team` - Array of team members
- `globalOptions` - Header and footer configuration

## Updating Mock Data

When updating mock data:

1. Update `server/mock/data.json`
2. Ensure structure matches Strapi content types
3. Update tests if needed
4. Mock data will automatically be used as fallback
