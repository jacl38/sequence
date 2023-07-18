import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://sequence-xj9r.onrender.com",
        changeOrigin: true
      },
      "/socket.io": {
        target: "https://sequence-xj9r.onrender.com",
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    rollupOptions: {
      external: ["api"]
    }
  }
});