import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, '..', '..', 'docs')
  },
  plugins: [vue()],
  resolve:{
    alias:{
      '@' : resolve(__dirname, './src')
    }
  }
})
