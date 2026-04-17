import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/freight',
    name: 'Freight',
    meta: {
      title: '国际货代',
      icon: 'lucide:truck',
      order: 90,
      hideInMenu: true,
    },
    children: [
      {
        path: '/tools/fba-flex',
        name: 'FbaFlexCost',
        component: () => import('#/views/freight/tools/fba-flex/index.vue'),
        meta: {
          title: 'FBA 成本计算器',
          icon: 'mdi:calculator',
          authority: ['freight:quote:query'],
        },
      },
      {
        path: 'quote-editor',
        name: 'FreightQuoteEditor',
        component: () => import('#/views/freight/quote-editor/index.vue'),
        meta: {
          title: '报价编辑器',
          activePath: '/tools/fba-flex',
          hideInMenu: true,
          authority: ['freight:quote:create'],
        },
      },
      {
        path: 'quote-preview/:id',
        name: 'FreightQuotePreview',
        component: () => import('#/views/freight/quote-preview/index.vue'),
        meta: {
          title: '报价预览',
          activePath: '/tools/fba-flex',
          hideInMenu: true,
          authority: ['freight:quote:query'],
        },
      },
    ],
  },
];

export default routes;
