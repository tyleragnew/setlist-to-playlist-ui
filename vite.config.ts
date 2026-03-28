import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  envDir: './env',
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [react()],
  server: {
    host: '127.0.0.1',
  },
})