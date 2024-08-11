import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: false,
  outDir: 'dist',
  format: ['esm', 'cjs'],
})
