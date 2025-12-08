import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // ป้องกันการใช้ eval ใน production build
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // ใช้ strict mode เพื่อหลีกเลี่ยง eval
        strict: true,
      }
    }
  },
  // ปิด sourcemap ใน production เพื่อลดปัญหา CSP
  esbuild: {
    legalComments: 'none',
  },
  server: {
    fs: {
      // Allow serving files from node_modules directory (for MDI fonts)
      // This allows access to parent directories where node_modules might be located
      allow: ['.', '..']
    }
  }
})
