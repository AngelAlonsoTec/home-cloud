import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, API requests are forwarded to the backend so both share the
// same origin, just like in production (where nginx does the same)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:5000',
    },
  },
});
