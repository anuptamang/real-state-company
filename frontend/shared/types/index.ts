/**
 * Shared TypeScript types for the company website project
 * These types are shared between frontend and backend
 */

// Base block interface
export interface Block {
  id: string;
  __component: string;
  [key: string]: unknown;
}

// Hero Block
export interface HeroBlock extends Block {
  __component: "blocks.hero";
  title: string;
  subtitle?: string;
  image?: {
    url: string;
    alt?: string;
  };
  cta?: {
    text: string;
    url: string;
  };
}

// Content Block
export interface ContentBlock extends Block {
  __component: "blocks.content";
  content: string;
}

// Features Block
export interface FeaturesBlock extends Block {
  __component: "blocks.features";
  title?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

// CTA Block
export interface CtaBlock extends Block {
  __component: "blocks.cta";
  heading: string;
  text?: string;
  button: {
    text: string;
    url: string;
  };
}

// Properties List Block
export interface PropertiesListBlock extends Block {
  __component: "blocks.properties-list";
  title?: string;
  properties: Array<{
    id: string;
    title: string;
    price: number;
    location: string;
    image?: {
      url: string;
      alt?: string;
    };
  }>;
}

// Contact Form Block
export interface ContactFormBlock extends Block {
  __component: "blocks.contact-form";
  title?: string;
  submitUrl?: string;
}

// Page interface
export interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks: Block[];
}

// Site Info
export interface Site {
  siteName: string;
  siteUrl: string;
  siteDescription?: string;
  favicon?: {
    url: string;
    alt?: string;
  };
}

// Global Options
export interface GlobalOptions {
  id: string;
  site?: Site;
  header: Header | null;
  footer: Footer | null;
}

// Menu Item
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  children?: MenuItem[];
}

// Header
export interface Header {
  logo?: {
    url: string;
    alt?: string;
  };
  logoText?: string;
  menu?: MenuItem[]; // WordPress-style menu items
  links: Array<{
    text: string;
    url: string;
  }>; // Legacy links (deprecated)
}

// Footer
export interface Footer {
  copyright?: string;
  links: Array<{
    text: string;
    url: string;
  }>;
  socialMedia?: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
  menu?: MenuItem[]; // WordPress-style menu items
}

// User (needed for PropertyComment)
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
}

// Property Comment
export interface PropertyComment {
  id: number;
  property?: number | { id: number };
  user?: number | User;
  comment: string;
  parent?: number | PropertyComment | null;
  replies?: PropertyComment[];
  approved: boolean;
  createdAt?: string;
  updatedAt?: string;
}
