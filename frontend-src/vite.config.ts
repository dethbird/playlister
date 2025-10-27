import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    // write built assets to frontend-src/build (keeps parity with the old CRA output)
    outDir: 'build',
    // produce a manifest.json (used by deploy script / server to map entry names to hashed files)
    manifest: true,
    // don't remove other existing public assets in the server public folder (deploy step will copy)
    emptyOutDir: false,
    rollupOptions: {
      input: {
        // ensure manifest contains a stable key for our main entry
        main: './src/main.jsx'
      }
    },
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
