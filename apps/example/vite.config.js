import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevtools from 'vite-plugin-vue-devtools'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
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
})