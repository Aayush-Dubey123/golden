import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        // Dev proxy: forward /v1 requests to the Render backend.
        // In production, VITE_API_BASE_URL is set to the full Render URL.
        target: 'https://golden-kulcha.onrender.com',
        changeOrigin: true,
      },
    },
  },
})

