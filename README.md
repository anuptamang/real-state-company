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

### Modular Block System (ACF-Style)

Dynamic content blocks that can be composed into pages:

- **Hero Block**: Full-width hero sections with images, CTAs, and text overlays
- **Features Block**: Grid/list of feature cards with icons and descriptions
- **Projects/Listings Block**: Real estate property listings with filters and search
- **Testimonials Block**: Client testimonials with avatars and ratings
- **CTA Block**: Call-to-action sections with buttons and forms
- **Content Block**: Rich text content with formatting
- **Image Gallery Block**: Image galleries with lightbox functionality
- **Video Block**: Embedded video players
- **Contact Form Block**: Lead generation forms
- **Map Block**: Interactive maps for property locations
- **Team Block**: Team member profiles
- **Stats Block**: Key metrics and statistics
- **FAQ Block**: Accordion-style FAQ sections
