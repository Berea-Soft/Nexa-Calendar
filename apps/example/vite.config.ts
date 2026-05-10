import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import vueDevtools from 'vite-plugin-vue-devtools';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('sandpack-vue3') || id.includes('@codesandbox/sandpack-react')) {
            return 'sandpack';
          }
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/@vue') ||
            id.includes('vue-router') ||
            id.includes('vue-i18n')
          ) {
            return 'vue';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/@types/react')) {
            return 'react';
          }
          if (id.includes('node_modules/svelte')) {
            return 'svelte';
          }
          if (id.includes('@nexa-calendar')) {
            return 'calendar';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    tailwindcss(),
    svelte(),
    vueDevtools(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('nx-'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@nexa-calendar/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@nexa-calendar/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@nexa-calendar/vue': path.resolve(__dirname, '../../packages/vue/src/index.ts'),
      '@nexa-calendar/angular': path.resolve(__dirname, '../../packages/angular/src/index.ts'),
      '@nexa-calendar/svelte': path.resolve(__dirname, '../../packages/svelte/src'),
      '@nexa-calendar/react': path.resolve(__dirname, '../../packages/react/src/index.ts'),
    },
  },
});
