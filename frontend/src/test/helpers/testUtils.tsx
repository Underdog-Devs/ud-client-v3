import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { TestWrapper } from './TestWrapper'

// Test cleanup is handled in TestWrapper

// Custom render function with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestWrapper, ...options })
}

// Mock window.matchMedia for responsive testing
export const mockMatchMedia = (width: number) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes(`${width}px`),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Performance measurement helper
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
  return end - start
}

// Screenshot placeholder (since we don't have Puppeteer)
export const takeScreenshot = (testName: string) => {
  console.log(`📸 Screenshot would be taken for: ${testName}`)
  // In a real Puppeteer setup, this would capture the screen
}

// Viewport size constants for responsive testing
export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
} as const

// Custom assertions for accessibility
export const checkAccessibility = (container: HTMLElement) => {
  // Basic accessibility checks
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const images = container.querySelectorAll('img')
  const links = container.querySelectorAll('a')
  
  const issues: string[] = []
  
  // Check for alt text on images
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.outerHTML}`)
    }
  })
  
  // Check for proper heading hierarchy
  if (headings.length > 0) {
    const firstHeading = headings[0]
    if (firstHeading.tagName !== 'H1') {
      issues.push('First heading should be H1')
    }
  }
  
  // Check for link text
  links.forEach((link) => {
    if (!link.textContent?.trim()) {
      issues.push(`Link missing text content: ${link.outerHTML}`)
    }
  })
  
  return {
    passed: issues.length === 0,
    issues,
  }
}