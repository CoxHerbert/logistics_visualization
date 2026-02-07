import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/PortalHome.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/views/ToolCenter.vue')
    }
  ]
})

export default router
