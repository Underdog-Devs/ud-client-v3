# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**MIGRATION IN PROGRESS**: This repository contains both the legacy Next.js application and the new React + FastAPI architecture.

- **Legacy**: Next.js 14 application (root directory) - DEPRECATED
- **New Backend**: FastAPI backend (`/backend/`) - ✅ PRODUCTION READY
- **New Frontend**: Vite + React frontend (`/frontend/`) - ✅ PRODUCTION READY

## Commands

### Legacy Next.js (DEPRECATED)
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run Jest tests

### New FastAPI Backend (PRODUCTION READY)
```bash
cd backend
source venv/bin/activate

# Development
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Testing
python -m pytest
python -m pytest --cov=app --cov-report=term-missing

# Linting
ruff check .
ruff check --fix .

# Database migrations
python scripts/migrate.py status
python scripts/migrate.py apply
```

### New React Frontend (PRODUCTION READY)
```bash
cd frontend

# Development
npm run dev          # Start dev server on port 3001

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run coverage     # Run tests with coverage

# E2E Testing with Puppeteer MCP
# Browser automation and visual testing capabilities:
# - Real browser testing for user journeys
# - Screenshot capture for visual regression
# - Performance monitoring and profiling
# - Accessibility testing automation

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

**CURRENT STATE**: Full-stack migration from Next.js to React + FastAPI

### Legacy Architecture (DEPRECATED)
This was a Next.js 14 application for UnderdogDevs, an organization helping formerly incarcerated and economically disadvantaged individuals get into tech. The app used the App Router with TypeScript.

### New Architecture (PRODUCTION READY BACKEND)

**Backend**: FastAPI + MySQL + SQLAlchemy 2.0
- **Framework**: FastAPI 0.104+ with async/await support
- **Database**: SQLAlchemy 2.0 ORM with MySQL (SQLite for dev/test)
- **Migrations**: Atlas for modern schema management
- **Testing**: pytest with factory-boy for comprehensive test coverage (67/67 tests passing)
- **Authentication**: JWT-based authentication system (replacing Supabase)
- **Code Quality**: Ruff linting with zero errors, modern Python standards

**Frontend**: Vite + React + TypeScript (UPCOMING - Phase 2)
- **Build Tool**: Vite for fast development and optimized builds
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6 for client-side navigation
- **State Management**: React Query for server state, React Context for app state
- **Styling**: Tailwind CSS + SCSS (unchanged from legacy)
- **Testing**: Vitest + Testing Library + Puppeteer MCP for comprehensive frontend testing

### Legacy Technologies (DEPRECATED)
- **Next.js 14** with App Router (being replaced)
- **Supabase** for authentication and database (being replaced with FastAPI + MySQL)
- **SCSS/Tailwind** for styling (keeping)
- **Material-UI** for components (keeping)
- **TypeScript** throughout (keeping)
- **Jest** for testing (replaced with pytest for backend, Vitest for frontend)

### Authentication & Database
- Supabase client in `lib/api/supabase.ts` 
- Cookie-based auth via middleware (`middleware.ts`)
- User roles stored in `user_metadata.role`
- Auth components in `components/auth/`

### Layout System
- Main layout in `components/Layout.tsx` conditionally renders:
  - Dashboard layout for `/member-dashboard/*` routes
  - Standard layout with navigation + footer for all other routes
- `DashboardLayout.tsx` provides sidebar navigation for member area

### Routing Structure
- `/` - Landing page
- `/member-dashboard/*` - Protected member area with docs, onboarding, quizzes
- `/blog/*` - Blog with author pages
- `/auth/*` - Authentication pages (signin, signup, password reset)
- API routes in `app/api/` for posts, quiz, auth callbacks, Slack integration

### Styling
- Global styles in `app/styles/` (SCSS)
- Component-specific modules (`.module.scss`)
- Tailwind for utilities
- Custom CSS variables for theming

### Key Components
- Quiz system (`components/quiz/`) with progress tracking
- Blog system (`components/blog/`, `components/blogEntry/`)
- Dashboard articles (`components/dashboard/`)
- Landing page sections (`components/landing/`)

### Configuration
- Webpack alias `@` points to project root
- Custom API rewrites to `NEXT_PUBLIC_HOSTNAME`
- Images from S3 bucket allowed
- Console removal disabled in production

## External Services & Dependencies

### Supabase (Primary Backend)
- **Purpose**: Authentication, database, real-time features
- **Files**: `lib/api/supabase.ts`, `middleware.ts`, various API routes
- **Tables**: posts, quizzes, user_progress, articles, user_article_progress, slack_join_requests
- **Required env vars**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Strapi CMS
- **Purpose**: Content management for articles/documentation
- **Files**: `lib/api/strapi.ts`, `lib/api/articles.ts`
- **Required env vars**:
  - `NEXT_PUBLIC_STRAPI_API_URL` (defaults to http://localhost:1337)
  - `NEXT_PUBLIC_STRAPI_API_TOKEN`

### Slack Integration
- **Purpose**: Workspace invitation requests and notifications
- **Files**: `app/api/slack/invite/route.ts`
- **Required env vars**:
  - `NEXT_PUBLIC_SLACK_BOT_TOKEN`
  - `NEXT_PUBLIC_SLACK_CHANNEL_ID`

### AWS S3
- **Purpose**: Media storage and image hosting
- **Configuration**: `next.config.js` (ud-media.s3.us-east-2.amazonaws.com)
- **No explicit credentials** (handled via environment/IAM)

### Development Environment Setup
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRAPI_API_URL=your_strapi_api_url
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token
NEXT_PUBLIC_SLACK_BOT_TOKEN=your_slack_bot_token
NEXT_PUBLIC_SLACK_CHANNEL_ID=your_slack_channel_id
NEXT_PUBLIC_HOSTNAME=your_app_hostname
```