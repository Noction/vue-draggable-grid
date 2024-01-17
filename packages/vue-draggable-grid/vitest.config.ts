import { resolve }  from 'node:path'
import vue from '@vitejs/plugin-vue'
import { configDefaults, defineConfig } from 'vitest/config'

const reportsDirectory = process.env.REPORTS_DIR ? process.env.REPORTS_DIR : './coverage'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    coverage: {
      all: true,
      exclude: [
        ...configDefaults.exclude,
        'src/assets/*',
        'src/index.ts',
        'src/types/*',
        'src/*.d.ts',
        'tests',
        '*rc.ts',
        '*rc.js'
      ],
      include: ['src/**'],
      provider: 'v8',
      reporter: ['text', 'lcov', 'cobertura'],
      reportsDirectory
    },
    environment: 'jsdom',
    globals: true,
    include: ['tests/*.spec.ts']
  }
})
