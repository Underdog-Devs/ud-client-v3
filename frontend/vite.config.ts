/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Critical fix: Mock MUI icons to prevent file descriptor exhaustion
    alias: {
      '@mui/icons-material': path.resolve(__dirname, './src/test/__mocks__/@mui/icons-material.ts'),
    },
  },
  server: {
    port: 3001,
  },
})
