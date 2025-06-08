import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Page components (will be created/migrated)
import { HomePage } from '@/pages/HomePage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { BlogAuthorPage } from '@/pages/BlogAuthorPage'
import { DonatePage } from '@/pages/DonatePage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { SpotlightPage } from '@/pages/SpotlightPage'
import { TestimonialsPage } from '@/pages/TestimonialsPage'
import { ProjectUnderdogPage } from '@/pages/ProjectUnderdogPage'
import { RequestPasswordRestPage } from '@/pages/RequestPasswordRestPage'
import { ResetPage } from '@/pages/ResetPage'

// Dashboard pages
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage'
import { DocsPage } from '@/pages/dashboard/DocsPage'
import { ProfilePage } from '@/pages/dashboard/ProfilePage'
import { OnboardingPage } from '@/pages/dashboard/OnboardingPage'
import { OnboardingSlugPage } from '@/pages/dashboard/OnboardingSlugPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'blog/:title/:id',
        element: <BlogPostPage />,
      },
      {
        path: 'blog/author/:author/:id',
        element: <BlogAuthorPage />,
      },
      {
        path: 'donate',
        element: <DonatePage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'spotlight',
        element: <SpotlightPage />,
      },
      {
        path: 'testimonials',
        element: <TestimonialsPage />,
      },
      {
        path: 'project-underdog',
        element: <ProjectUnderdogPage />,
      },
      {
        path: 'auth/request-password-rest',
        element: <RequestPasswordRestPage />,
      },
      {
        path: 'auth/reset',
        element: <ResetPage />,
      },
    ],
  },
  {
    path: 'member-dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'docs',
        element: <DocsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
      },
      {
        path: 'onboarding/:slug',
        element: <OnboardingSlugPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}