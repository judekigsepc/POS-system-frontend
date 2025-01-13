import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['electron'], // Exclude Electron from the bundle
      output: {
        globals: {
          electron: 'require("electron")',
        },
      },
    },
  },
});
