// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // Need this for resolving paths

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the alias '@' to your 'src' folder
      '@': path.resolve(__dirname, './src'), 
    },
  },
})