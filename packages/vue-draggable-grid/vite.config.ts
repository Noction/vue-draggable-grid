import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, './src/components/index.ts'),
      fileName: 'vue3-drr-grid-layout',
      name: 'Vue3DRRGridLayout'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()],
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    }
  }
})
