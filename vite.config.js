import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change the port if needed
    proxy: {
      // Proxy API requests to your backend server
      // Adjust the target based on your backend's address
      '/api': {
        target: 'http://localhost:8080', // Assuming your Spring Boot backend runs on 8080
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix when forwarding
      }
    }
  }
})