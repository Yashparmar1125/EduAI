import { defineConfig } from 'vite'
import path from 'path';

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: ['5824-103-71-19-206.ngrok-free.app']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'utils': path.resolve(__dirname, 'src/lib/utils'),
      'ui': path.resolve(__dirname, 'src/components/ui'),
      'lib': path.resolve(__dirname, 'src/lib'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
})
