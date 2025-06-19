import { vi } from 'vitest'

// Mock all MUI icons to prevent file descriptor exhaustion
const createMockIcon = (displayName: string) => {
  const MockIcon = vi.fn(() => `<mock-${displayName.toLowerCase()}-icon />`)
  Object.defineProperty(MockIcon, 'displayName', { value: displayName })
  return MockIcon
}

// Export commonly used icons
export const Menu = createMockIcon('Menu')
export const Dashboard = createMockIcon('Dashboard')
export const MenuBook = createMockIcon('MenuBook')
export const School = createMockIcon('School')
export const Person = createMockIcon('Person')

// Default export for any other icons
export default createMockIcon('DefaultIcon')