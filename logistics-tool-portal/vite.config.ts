import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: '/',
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {
                '/portal-api': {
                    target: env.VITE_PROXY_API_TARGET || 'http://127.0.0.1:48080/portal-api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/portal-api/, ''),
                },
            },
        },
    };
});
