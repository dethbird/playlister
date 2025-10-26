import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    // write built assets directly to the server public folder
    outDir: '../public',
    // don't remove other existing public assets (images, manifest, etc.)
    emptyOutDir: false,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8001',
      '/auth': 'http://127.0.0.1:8001',
    },
  },
  // ensure esbuild parses JSX in .js files (CRA codebase uses .js with JSX)
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.mjs': 'jsx'
      }
    }
  },
  esbuild: {
    // also configure esbuild for dev/build parsing
    loader: 'jsx',
    include: /src\/.*/
  }
});
