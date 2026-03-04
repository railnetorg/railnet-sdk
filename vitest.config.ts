import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      'railnet-sdk/react': path.resolve(import.meta.dirname, 'src/react/index.ts'),
      'railnet-sdk': path.resolve(import.meta.dirname, 'src'),
    },
    globals: true,
  },
})
