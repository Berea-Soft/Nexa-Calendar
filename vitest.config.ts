import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@nexa-calendar/core': path.resolve(__dirname, 'packages/core/src'),
      '@nexa-calendar/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@nexa-calendar/vue': path.resolve(__dirname, 'packages/vue/src'),
      '@nexa-calendar/angular': path.resolve(__dirname, 'packages/angular/src'),
      '@nexa-calendar/svelte': path.resolve(__dirname, 'packages/svelte/src'),
      '@nexa-calendar/react': path.resolve(__dirname, 'packages/react/src'),
    },
  },
});
