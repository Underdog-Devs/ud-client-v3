# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run Jest tests

### Testing
- Run single test: `npm test -- fetchCompletedQuizzes.test.ts`

## Architecture

This is a Next.js 14 application for UnderdogDevs, an organization helping formerly incarcerated and economically disadvantaged individuals get into tech. The app uses the App Router with TypeScript.

### Key Technologies
- **Next.js 14** with App Router
- **Supabase** for authentication and database
- **SCSS/Tailwind** for styling (hybrid approach)
- **Material-UI** for components
- **TypeScript** throughout
- **Jest** for testing

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