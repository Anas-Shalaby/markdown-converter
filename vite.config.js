import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'pdfjs-dist/legacy/build/pdf.js',
      'pdfjs-dist/legacy/build/pdf.worker.js'
    ],
    exclude: []
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
