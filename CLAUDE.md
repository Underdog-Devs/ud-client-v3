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