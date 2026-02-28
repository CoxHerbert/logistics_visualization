import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/PortalHome.vue'),
        },
        {
            path: '/get-plan',
            name: 'get-plan',
            component: () => import('@/views/GetPlan.vue'),
        },
        {
            path: '/tool-center',
            name: 'tool-center',
            component: () => import('@/views/ToolCenter.vue'),
        },
        {
            path: '/tool-center/fba-first-leg-calculator',
            name: 'fba-first-leg-calculator',
            component: () => import('@/views/FbaEstimator/index.vue'),
        },
        {
            path: '/tool-center/container-sim',
            name: 'container-sim',
            component: () => import('@/views/tools/container-sim/index.vue'),
        },
        {
            path: '/me',
            name: 'me',
            component: () => import('@/views/Me.vue'),
        },
    ],
});

export default router;
