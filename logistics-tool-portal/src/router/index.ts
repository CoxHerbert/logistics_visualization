import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PortalHome.vue'),
    meta: {
      title: '中美货运转运平台-首页',
      description: '中美线国际货运代理，覆盖海运、FBA头程、清关与派送服务。',
      keywords: '中美货运,国际物流,FBA头程,海运,清关,派送',
    },
  },
  {
    path: '/tool-center',
    name: 'tool-center',
    component: () => import('@/views/ToolCenter.vue'),
    meta: {
      title: '工具中心-中美货运转运平台',
      description: '国际货运工具中心，提供体积重测算、装柜建议与运输决策辅助。',
      keywords: '物流工具,体积重计算,装柜测算,运输方案',
    },
  },
  {
    path: '/tool-center/fba-first-leg-calculator',
    name: 'fba-first-leg-calculator',
    component: () => import('@/views/FbaEstimator/index.vue'),
    meta: {
      title: 'FBA头程测算工具-工具中心',
      description: '用于 FBA 头程场景的计费重与费用测算，辅助报价和发运决策。',
      keywords: 'FBA头程,计费重,物流报价,跨境物流',
    },
  },
  {
    path: '/tool-center/container-sim',
    name: 'container-sim',
    component: () => import('@/views/tools/container-sim/index.vue'),
    meta: {
      title: '3D装箱模拟-工具中心',
      description: '三维装箱模拟与装载可视化，提升装箱利用率与运输可执行性。',
      keywords: '3D装箱,装箱模拟,集装箱,物流工具',
    },
  },
  {
    path: '/tool-center/container-calculator',
    name: 'container-calculator',
    component: () => import('@/views/tools/container-calculator/index.vue'),
    meta: {
      title: '装柜计算器-工具中心',
      description: '根据体积、重量与件型辅助判断整柜/拼箱方案。',
      keywords: '装柜计算器,整柜,拼箱,CBM',
    },
  },
  {
    path: '/tool-center/container-calculator/wizard',
    name: 'container-calculator-wizard',
    component: () => import('@/views/tools/container-calculator-wizard/index.vue'),
    meta: {
      title: '装柜计算向导-工具中心',
      description: '四步向导式装柜计算流程，快速输出可执行装柜建议。',
      keywords: '装柜向导,装柜方案,物流规划',
    },
  },
  {
    path: '/me',
    name: 'me',
    component: () => import('@/views/Me.vue'),
    meta: {
      title: '个人中心-中美货运转运平台',
      description: '获取中美线货运顾问联系方式与咨询渠道。',
      keywords: '货运顾问,物流咨询,联系方式',
    },
  },
  {
    path: '/contact-us',
    name: 'contact-us',
    component: () => import('@/views/ContactUs.vue'),
    meta: {
      title: '联系我们-中美货运转运平台',
      description: '无需登录提交咨询需求，获取中美线海运、FBA头程与清关派送建议。',
      keywords: '联系我们,物流咨询,货运线索,FBA头程咨询',
    },
  },
];

export function createAppRouter() {
  const history = import.meta.env.SSR
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL);

  return createRouter({
    history,
    routes,
  });
}

const router = createAppRouter();

export default router;
