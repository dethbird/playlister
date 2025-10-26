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
  // Note: don't set a global esbuild loader for the whole `src/` tree
  // because that can cause non-JS assets (for example `src/*.css`) to be
  // fed to esbuild with a JS loader which breaks (see index.css parse error).
  // The `optimizeDeps.esbuildOptions.loader` above is sufficient to ensure
  // dependencies are parsed as JSX when needed.
});
