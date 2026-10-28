import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      Sitemap({
        hostname: 'https://decodeias.com',
        dynamicRoutes: [
          '/prelims-conquer-2027',
          '/pcm-batch-2028',
          '/#courses',
          '/#faculty',
          '/#results',
          '/#contact',
          '/site-metadata.json'
        ]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Backend server offline, switching to Firebase Firestore fallback.' }));
              }
            });
          }
        }
      }
    },
  };
});
