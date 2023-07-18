import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://sequence-api-37tv5vdgia-ue.a.run.app",
        changeOrigin: true
      },
      "/socket.io": {
        target: "https://sequence-api-37tv5vdgia-ue.a.run.app",
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