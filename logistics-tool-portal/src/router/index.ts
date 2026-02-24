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
    },
    {
      path: '/line-query',
      name: 'line-query',
      component: () => import('@/views/LineQuery.vue')
    },
    {
      path: '/volume-pricing',
      name: 'volume-pricing',
      component: () => import('@/views/VolumePricing.vue')
    },
    {
      path: '/get-plan',
      name: 'get-plan',
      component: () => import('@/views/GetPlan.vue')
    },

    {
      path: '/me',
      name: 'me',
      component: () => import('@/views/Me.vue')
    },
  ]
})

export default router
