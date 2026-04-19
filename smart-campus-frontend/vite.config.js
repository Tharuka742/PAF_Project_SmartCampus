import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/react-router/.test(id)) return 'react-vendor'
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor'
          if (/recharts|d3-/.test(id)) return 'charts'
          if (/react-big-calendar|moment/.test(id)) return 'calendar'
          if (/lucide-react|react-icons/.test(id)) return 'icons'
        },
      },
    },
  },
})
