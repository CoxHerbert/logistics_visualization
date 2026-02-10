import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/portal/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_API_TARGET || 'http://localhost:48080/admin-api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/web-api': {
          target: env.VITE_PROXY_WEB_API_TARGET || 'http://localhost:48080',
          changeOrigin: true
        }
      }
    }
  }
})
