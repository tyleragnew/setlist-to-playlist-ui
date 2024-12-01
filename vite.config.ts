import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // or the appropriate base path if your app is in a subfolder
  build: {
    rollupOptions: {
      input: 'index.html', // make sure Vite builds from index.html
    },
  },
  plugins: [react()],
})