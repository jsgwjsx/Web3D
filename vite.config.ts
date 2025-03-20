import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import glsl from 'vite-plugin-glsl'
import cesium from 'vite-plugin-cesium'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),glsl(),cesium()],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }
  }
})
