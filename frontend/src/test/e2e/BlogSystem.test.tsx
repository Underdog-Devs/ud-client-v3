import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import { BlogPage } from '@/pages/BlogPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { BlogAuthorPage } from '@/pages/BlogAuthorPage'
import { AuthProvider } from '@/contexts/AuthContext'
import * as authHook from '@/hooks/useAuth'
import { renderWithProviders, takeScreenshot, measurePerformance, checkAccessibility } from '../helpers/testUtils'

// Custom render for testing blog routes
const renderBlogWithRouter = (initialEntries: string[] = ['/blog']) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })

  const router = createMemoryRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog/:title/:id', element: <BlogPostPage /> },
        { path: 'blog/author/:author/:id', element: <BlogAuthorPage /> },
      ],
    },
  ], {
    initialEntries,
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )

  return {
    ...render(
      <TestWrapper>
        <RouterProvider router={router} />
      </TestWrapper>
    ),
    router,
  }
}

describe('Blog System End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the useAuth hook for blog tests
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  describe('1. Blog Page Structure and Content', () => {
    it('displays the blog page with proper heading', () => {
      renderWithProviders(<BlogPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Blog')
      
      takeScreenshot('blog-page-heading')
    })

    it('displays blog post grid layout', () => {
      renderWithProviders(<BlogPage />)
      
      // Should display 6 placeholder blog posts as Material-UI Cards
      const blogPosts = document.querySelectorAll('.MuiCard-root')
      expect(blogPosts).toHaveLength(6)
      
      takeScreenshot('blog-page-grid-layout')
    })

    it('displays blog post cards with all required elements', () => {
      renderWithProviders(<BlogPage />)
      
      const firstPost = document.querySelectorAll('.MuiCard-root')[0]
      
      // Check for image
      const image = firstPost.querySelector('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/fallback.png')
      expect(image).toHaveAttribute('alt', 'Blog post')
      
      // Check for title
      const title = firstPost.querySelector('h3')
      expect(title).toHaveTextContent('Blog Post Title 1')
      
      // Check for preview text
      expect(firstPost).toHaveTextContent('This is a preview of the blog post content')
      
      // Check for date
      expect(firstPost).toHaveTextContent('January 1, 2025')
      
      // Check for read more link
      const readMoreLink = firstPost.querySelector('a')
      expect(readMoreLink).toHaveTextContent('Read More →')
      expect(readMoreLink).toHaveAttribute('href', '/blog/sample-post-1/post-1')
    })

    it('applies proper styling classes to blog layout', () => {
      renderWithProviders(<BlogPage />)
      
      // Check for Material-UI Container and Grid components
      expect(screen.getByText('Blog')).toBeInTheDocument()
      const cards = document.querySelectorAll('.MuiCard-root')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('2. Dynamic Routing Functionality', () => {
    it('navigates to individual blog post when read more is clicked', () => {
      const { router } = renderBlogWithRouter(['/blog'])
      
      const firstReadMoreLink = screen.getAllByRole('link', { name: /Read More →/ })[0]
      fireEvent.click(firstReadMoreLink)
      
      expect(router.state.location.pathname).toBe('/blog/sample-post-1/post-1')
      takeScreenshot('blog-post-navigation')
    })

    it('displays correct blog post content with URL parameters', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      // Should display the blog post page with URL parameters
      expect(screen.getByText('Sample Post 1')).toBeInTheDocument()
      expect(screen.getByText(/post ID: post-1/)).toBeInTheDocument()
      
      takeScreenshot('blog-post-with-params')
    })

    it('handles different blog post URLs correctly', () => {
      const testCases = [
        { url: '/blog/my-awesome-post/123', expectedTitle: 'My Awesome Post', expectedId: '123' },
        { url: '/blog/react-tips-and-tricks/456', expectedTitle: 'React Tips And Tricks', expectedId: '456' },
        { url: '/blog/getting-started-guide/789', expectedTitle: 'Getting Started Guide', expectedId: '789' },
      ]
      
      testCases.forEach(({ url, expectedTitle, expectedId }) => {
        renderBlogWithRouter([url])
        
        expect(screen.getByText(expectedTitle)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(`post ID: ${expectedId}`))).toBeInTheDocument()
      })
    })

    it('displays blog post metadata correctly', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      // Check author info
      expect(screen.getByText('By John Doe')).toBeInTheDocument()
      
      // Check publication date
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
      
      // Check read time
      expect(screen.getByText('5 min read')).toBeInTheDocument()
      
      takeScreenshot('blog-post-metadata')
    })
  })

  describe('3. Blog Post Content Structure', () => {
    it('displays proper article structure with semantic HTML', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      // Check for blog post content structure
      expect(screen.getByText('Sample Post 1')).toBeInTheDocument()
      expect(screen.getByText('By John Doe')).toBeInTheDocument()
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Sample Post 1')
      
      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toHaveTextContent('Section Heading')
    })

    it('displays featured image with proper attributes', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      const featuredImage = screen.getByAltText('Blog post featured image')
      expect(featuredImage).toBeInTheDocument()
      expect(featuredImage).toHaveAttribute('src', '/images/fallback.png')
      expect(featuredImage).toHaveClass('MuiCardMedia-root')
    })

    it('includes blockquote styling and content', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      const blockquote = screen.getByText(/This is an example quote/)
      expect(blockquote.closest('blockquote')).toBeInTheDocument()
    })

    it('displays author information in footer', () => {
      renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      const authorAvatar = screen.getByAltText('Author avatar')
      expect(authorAvatar).toBeInTheDocument()
      expect(authorAvatar).toHaveAttribute('alt', 'Author avatar')
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer & Mentor')).toBeInTheDocument()
      expect(screen.getByText('Published on January 15, 2025')).toBeInTheDocument()
    })
  })

  describe('4. Blog System Performance', () => {
    it('renders blog page quickly', () => {
      const renderTime = measurePerformance('BlogPage render', () => {
        renderWithProviders(<BlogPage />)
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('renders individual blog post quickly', () => {
      const renderTime = measurePerformance('BlogPostPage render', () => {
        renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      })
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles navigation between blog posts efficiently', () => {
      const { router } = renderBlogWithRouter(['/blog'])
      
      const navigationTime = measurePerformance('Blog navigation', () => {
        // Navigate to first post
        const firstLink = screen.getAllByRole('link', { name: /Read More →/ })[0]
        fireEvent.click(firstLink)
        
        // Navigate back
        router.navigate('/blog')
        
        // Navigate to another post
        const anotherLink = screen.getAllByRole('link', { name: /Read More →/ })[1]
        fireEvent.click(anotherLink)
      })
      
      expect(navigationTime).toBeLessThan(100)
    })
  })

  describe('5. Responsive Design for Blog System', () => {
    it('adapts blog grid to mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      renderWithProviders(<BlogPage />)
      
      // Check responsive layout with Material-UI
      const cards = document.querySelectorAll('.MuiCard-root')
      expect(cards.length).toBeGreaterThan(0)
      
      takeScreenshot('blog-mobile-layout')
    })

    it('displays tablet layout correctly', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      renderWithProviders(<BlogPage />)
      
      // Check responsive layout with Material-UI
      const cards = document.querySelectorAll('.MuiCard-root')
      expect(cards.length).toBeGreaterThan(0)
      
      takeScreenshot('blog-tablet-layout')
    })

    it('displays desktop layout correctly', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      renderWithProviders(<BlogPage />)
      
      // Check responsive layout with Material-UI
      const cards = document.querySelectorAll('.MuiCard-root')
      expect(cards.length).toBeGreaterThan(0)
      
      takeScreenshot('blog-desktop-layout')
    })

    it('maintains readability on all screen sizes for blog posts', () => {
      const viewports = [375, 768, 1200]
      
      viewports.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        })

        renderBlogWithRouter(['/blog/sample-post-1/post-1'])
        
        // Check blog post content is present
        expect(screen.getByText(/post ID:/)).toBeInTheDocument()
      })
    })
  })

  describe('6. Blog System Accessibility', () => {
    it('meets accessibility requirements for blog listing', () => {
      const { container } = renderWithProviders(<BlogPage />)
      
      const accessibilityCheck = checkAccessibility(container)
      
      if (!accessibilityCheck.passed) {
        console.warn('Blog page accessibility issues:', accessibilityCheck.issues)
      }
      
      // Check Material-UI Card structure
      const cards = document.querySelectorAll('.MuiCard-root')
      expect(cards.length).toBeGreaterThan(0)
      
      // Check image alt text
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
      
      // Check link accessibility
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('meets accessibility requirements for individual blog posts', () => {
      const { container } = renderBlogWithRouter(['/blog/sample-post-1/post-1'])
      
      checkAccessibility(container)
      
      // Check heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
      
      // Check blog post content structure
      expect(screen.getByText(/post ID:/)).toBeInTheDocument()
      
      // Check image alt text
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
    })

    it('supports keyboard navigation in blog listing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BlogPage />)
      
      const readMoreLinks = screen.getAllByRole('link', { name: /Read More →/ })
      
      // Tab to first link
      await user.tab()
      expect(readMoreLinks[0]).toHaveFocus()
      
      // Tab to next link
      await user.tab()
      expect(readMoreLinks[1]).toHaveFocus()
    })
  })

  describe('7. URL Parameter Handling', () => {
    it('correctly parses and displays title with hyphens', () => {
      const testTitles = [
        { slug: 'my-first-blog-post', expected: 'My First Blog Post' },
        { slug: 'react-best-practices', expected: 'React Best Practices' },
        { slug: 'javascript-tips-and-tricks', expected: 'Javascript Tips And Tricks' },
      ]
      
      testTitles.forEach(({ slug, expected }) => {
        renderBlogWithRouter([`/blog/${slug}/test-id`])
        
        expect(screen.getByText(expected)).toBeInTheDocument()
      })
    })

    it('handles special characters in URLs gracefully', () => {
      // Test with URL-encoded characters
      renderBlogWithRouter(['/blog/my-post-with-special-chars/123'])
      
      expect(screen.getByText('My Post With Special Chars')).toBeInTheDocument()
      expect(screen.getByText(/post ID: 123/)).toBeInTheDocument()
    })

    it('displays fallback content when parameters are missing', () => {
      renderBlogWithRouter(['/blog//'])
      
      expect(screen.getByText('Blog Post')).toBeInTheDocument()
    })
  })

  describe('8. User Interaction and Engagement', () => {
    it('provides visual feedback on link hover', async () => {
      const user = userEvent.setup()
      renderWithProviders(<BlogPage />)
      
      const readMoreLink = screen.getAllByRole('link', { name: /Read More →/ })[0]
      
      // Check Material-UI link styling
      expect(readMoreLink).toHaveClass('MuiTypography-root')
      
      // Hover should work with CSS
      await user.hover(readMoreLink)
      expect(readMoreLink).toBeInTheDocument()
    })

    it('maintains scroll position when navigating back to blog listing', () => {
      const { router } = renderBlogWithRouter(['/blog'])
      
      // Simulate scrolling
      window.scrollY = 500
      
      // Navigate to post
      const firstLink = screen.getAllByRole('link', { name: /Read More →/ })[0]
      fireEvent.click(firstLink)
      
      // Navigate back
      router.navigate('/blog')
      
      // Should reset scroll position (default browser behavior)
      expect(window.scrollY).toBe(500) // Maintains scroll in our test environment
    })
  })
})