# UnderdogDevs Frontend - React + Vite

## Overview

Modern React frontend for the UnderdogDevs learning platform, built with Vite for fast development and optimized builds. This frontend communicates with the FastAPI backend.

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** for build tooling and development server
- **React Query v5** for server state management
- **Axios** for API communication
- **Tailwind CSS** for styling
- **React Router v6** for client-side routing (planned)
- **Vitest** + Testing Library for testing

## Development Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- FastAPI backend running on port 8000

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3001
```

### Environment Configuration
Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3001
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run coverage     # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries (API client, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── test/           # Test setup and utilities
```

## API Integration

The frontend communicates with the FastAPI backend through:

- **API Client**: Axios-based client with authentication interceptors
- **React Query**: Server state management with caching and error handling
- **Type Safety**: Full TypeScript types for all API responses

### Example API Usage

```typescript
import { useHealthCheck } from '@/hooks/api'

function Component() {
  const { data, isLoading, error } = useHealthCheck()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>Backend status: {data.status}</div>
}
```

## Features

### Current (Phase 2)
- ✅ Vite + React + TypeScript setup
- ✅ Tailwind CSS integration
- ✅ React Query configuration
- ✅ API client with authentication
- ✅ Testing framework (Vitest + Testing Library)
- ✅ Backend connectivity demo

### Planned (Phase 3+)
- [ ] React Router setup
- [ ] Component migration from Next.js
- [ ] Authentication integration
- [ ] User dashboard
- [ ] Blog system
- [ ] Quiz system

## Backend Communication

The frontend expects the FastAPI backend to be running on `http://localhost:8000` with the following endpoints:

- `GET /health` - Health check
- `GET /api/info` - API information
- `POST /auth/login` - User authentication (planned)
- `GET /posts` - Blog posts (planned)
- `GET /quizzes` - Quiz data (planned)

## Testing

Tests are written using Vitest and Testing Library:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run coverage
```

Current test coverage:
- ✅ Component rendering
- ✅ API hook integration
- ✅ React Query setup

## Deployment

The frontend builds to static files that can be deployed to:

- **Vercel** (recommended - free tier)
- **Netlify** (free tier)
- **GitHub Pages**
- Any static hosting service

Build command: `npm run build`
Output directory: `dist/`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | FastAPI backend URL |

## Migration Notes

This frontend is part of a migration from Next.js to React + FastAPI:

- **Legacy**: Next.js 14 application (deprecated)
- **New**: Vite + React frontend (current)
- **Backend**: FastAPI + MySQL (production ready)

The new architecture provides:
- Faster development with Vite
- Better separation of concerns
- Independent frontend/backend deployment
- Modern React patterns with hooks and suspense

## Next Steps

1. **Component Migration**: Port existing components from Next.js
2. **Routing Setup**: Implement React Router for navigation
3. **Authentication**: Integrate with FastAPI JWT auth
4. **State Management**: Set up global state for user data
5. **Production Deployment**: Deploy to Vercel/Netlify