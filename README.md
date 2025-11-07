# Headless Company Website Builder

## Project Overview

A modern, headless CMS-driven website builder for a real estate business, built with Nuxt.js and Strapi.io. This project implements a WordPress ACF-style modular block system, allowing flexible page composition through dynamic zones and reusable components.

### Business Context

- **Industry**: Real Estate
- **Purpose**: Company website with dynamic content management
- **Architecture**: Headless CMS (Strapi) + Frontend (Nuxt.js)

---

## Tech Stack

### Frontend

- **Framework**: Nuxt.js 4.x
- **UI Components**: shadcn-vue
- **Styling**: Tailwind CSS (via shadcn-vue)
- **TypeScript**: Full type safety

### Backend/CMS

- **CMS**: Strapi.io 4.x (Node.js)
- **Database**: PostgreSQL (recommended) or SQLite (development)
- **API**: RESTful

## Core Features

### Pages

- **Home Page**: Dynamic hero, features, testimonials, and CTA blocks
- **About Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Services Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Team Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Properties Listings Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Property Details Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Testimonials Page**: Dynamic hero, features, testimonials, and CTA blocks
- **FAQ Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Contact Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Privacy Policy Page**: Dynamic hero, features, testimonials, and CTA blocks
- **Terms of Service Page**: Dynamic hero, features, testimonials, and CTA blocks

### Modular Block System

Dynamic content blocks that can be composed into pages:

- **Hero Block**: Full-width hero sections with images, CTAs, and text overlays
- **Properties/Properties Listings Block**: Real estate property listings with filters and search
- **Testimonials Block**: Client testimonials with avatars and ratings
- **CTA Block**: Call-to-action sections with buttons and forms
- **Content Block**: Rich text content with formatting
- **Image Gallery Block**: Image galleries with lightbox functionality
- **Video Block**: Embedded video players
- **Contact Form Block**: Lead generation forms
- **Team Block**: Team member profiles
- **FAQ Block**: Accordion-style FAQ sections
