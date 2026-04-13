import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Three.js r158+ uses 'three/addons/' — map it to the actual jsm path
      'three/addons/': path.join(process.cwd(), 'node_modules/three/examples/jsm/'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
