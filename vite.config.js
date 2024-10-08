import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})