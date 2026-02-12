import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const basePath = (env.VITE_PUBLIC_BASE || '/portal/').replace(/\/?$/, '/');

    return {
        base: basePath,
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {
                '/web-api': {
                    target: env.VITE_PROXY_API_TARGET || 'http://118.178.56.162:48080/web-api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/web-api/, ''),
                },
            },
        },
    };
});
