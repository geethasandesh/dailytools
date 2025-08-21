import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [react(), topLevelAwait()],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    proxy: {
      // 👇 Proxy only in dev — keeps API calls working locally
      '/api': {
        target: 'http://localhost:8000', // your Railway backend when running locally
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['worker.js'],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://dailytools-backend-production.up.railway.app/' // Railway backend
        : 'http://localhost:8000'
    ),
  },
})
