import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' http://localhost:5000 http://localhost:5173 http://localhost:3000;",
        "img-src 'self' data: blob: https://* http://*;",
        "connect-src 'self' http://localhost:5000 http://localhost:5173 ws://localhost:5173;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "style-src 'self' 'unsafe-inline';"
      ].join(' ')
    }
  }
})
