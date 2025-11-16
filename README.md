# Company Website

A modern company website built with Nuxt 4 frontend and Strapi backend.

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, Tailwind CSS v4, shadcn-vue
- **Backend**: Strapi 5 (headless CMS)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all
```

Or install individually:

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Start Development Servers

**Option A: Start both servers together (recommended)**

```bash
npm run dev
```

This will start:

- Strapi backend on `http://localhost:1337`
- Nuxt frontend on `http://localhost:3000`

**Option B: Start servers separately**

Terminal 1 - Backend:

```bash
cd backend
npm run develop
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

### 3. Set Up Strapi

1. **Access Strapi Admin Panel**

   - Go to `http://localhost:1337/admin`
   - Create your admin account (first time only)

2. **Create Content Types**

   - Create the following content types:
     - Page
     - Property
     - Testimonial
     - Team Member
     - Contact Submission
     - Global Option
     - Menu

3. **Configure Permissions**

   - Go to **Settings** > **Users & Permissions Plugin** > **Roles** > **Public**
   - Enable `create` for the `Contact Submission` content type

4. **Configure Frontend**

5. **Create `.env` file in frontend directory**

   ```bash
   cd frontend
   cp .env.example .env
   ```

6. **Update `.env` with Strapi credentials**

   ```env
   NUXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NUXT_PUBLIC_STRAPI_API_TOKEN=your-token-here
   ```

7. **Restart frontend dev server** (if running)

### 5. Create Content

1. Go to **Content Manager** in Strapi admin
2. Create pages, properties, testimonials, team members
3. Create GlobalOptions (single type)
4. **Publish all content** (important!)

## Project Structure

```
company-website/
├── backend/              # Strapi backend
│   ├── src/
│   │   ├── api/         # API routes
│   │   └── components/  # Strapi components
│   ├── config/          # Strapi configuration
│   └── README.md        # Backend documentation
├── frontend/            # Nuxt frontend
│   ├── app/
│   │   ├── components/  # Vue components
│   │   ├── pages/       # Nuxt pages
│   │   ├── composables/ # Vue composables
│   │   └── utils/       # Utilities
│   └── docs/            # Frontend documentation
└── README.md            # This file
```

## Available Scripts

### Root Level

- `npm run dev` - Start both backend and frontend servers
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production
- `npm run typecheck` - Type check frontend code

### Backend

- `cd backend && npm run develop` - Start Strapi dev server
- `cd backend && npm run build` - Build Strapi admin panel
- `cd backend && npm run start` - Start Strapi production server

### Frontend

- `cd frontend && npm run dev` - Start Nuxt dev server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run start` - Start production server
- `cd frontend && npm run typecheck` - Type check

## Features

- ✅ **Modular Block System** - Build pages from reusable blocks
- ✅ **Dynamic Content** - Content managed in Strapi CMS
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Component Library** - shadcn-vue components
- ✅ **SEO Optimized** - Meta tags and structured data
- ✅ **Fallback System** - Works with or without Strapi

## Development Workflow

1. **Start both servers**: `npm run dev`
2. **Edit content in Strapi**: Changes reflect immediately
3. **Edit frontend code**: Hot reload updates automatically
4. **Test changes**: Visit `http://localhost:3000`
