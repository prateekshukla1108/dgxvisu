import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // Use relative base path so it works on any GitHub Pages subdirectory
    base: './',
    define: {
      // Polyfill process.env.API_KEY for the build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
