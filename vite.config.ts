import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const singleFile = process.env.BUILD_TARGET === 'artifact'

export default defineConfig({
  base: './',
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  build: {
    outDir: singleFile ? 'dist-artifact' : 'dist',
    chunkSizeWarningLimit: 2400,
    assetsInlineLimit: singleFile ? 100_000_000 : 4096,
  },
  worker: { format: 'es' },
})
