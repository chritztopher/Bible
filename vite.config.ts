import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    minify: 'esbuild',
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'ui-components': ['@radix-ui/react-accordion', '@radix-ui/react-popover', '@radix-ui/react-progress'],
          'gestures': ['@use-gesture/react'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    modulePreload: { polyfill: false }
  }
}) 