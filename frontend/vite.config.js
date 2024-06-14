import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev',
        secure: false, // Disable SSL certificate validation
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
})

