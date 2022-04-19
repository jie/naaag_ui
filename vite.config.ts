import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');
import { svgBuilder } from "./src/utils/svgbuilder.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgBuilder("./src/assets/svg_icons/")],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    proxy: {
      '/api/image_editor': {
        "target": 'http://localhost:9000',
        "rewrite": path => path.replace(/^\/api/, ''),
        "changeOrigin": true
      },

      '/realBoxApi': {
        'target': 'https://home.knitup.io',
        'changeOrigin': true,
      },
      '/stripe': {
        'target': 'https://home.knitup.io',
        'changeOrigin': true,
      },
      '/color_separation': {
        'target': 'https://liyang-api-beta.explorium.cn',
        'changeOrigin': true
      },
      '/colorsep': {
        'target': 'https://liyang-api-beta.explorium.cn',
        'changeOrigin': true
      }
    }
  }
})
