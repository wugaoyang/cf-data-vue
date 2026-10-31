import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 自动按需导入 Vue / VueRouter 的 API,免去手动 import { ref } from 'vue'
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
    }),
    // 自动按需注册 Element Plus 组件及其样式;vxe-table 保留全量(体积小且无官方 resolver)
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // 把第三方大库拆成独立 chunk,避免单个主包过大(>500kB 警告)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-element': ['element-plus'],
          'vendor-vxe': ['vxe-pc-ui', 'vxe-table'],
          'vendor-vue': ['vue', 'vue-router', 'pinia', 'axios']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cf-data-api.tech-site.workers.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
