// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // IMPORT THIS LINE

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),      // react() plugin FIRST
    tailwindcss(), // tailwindcss() plugin SECOND - THIS IS THE KEY FOR V4
  ],
});