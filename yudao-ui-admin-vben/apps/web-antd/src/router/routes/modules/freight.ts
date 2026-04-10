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
          authority: ['freight:lead:query'],
        },
      },
      {
        path: 'leads',
        name: 'FreightLeads',
        component: () => import('#/views/freight/leads/index.vue'),
        meta: {
          title: '线索列表',
          authority: ['freight:lead:query'],
        },
      },
      {
        path: 'leads/:id',
        name: 'FreightLeadDetail',
        component: () => import('#/views/freight/lead-detail/index.vue'),
        meta: {
          title: '线索详情',
          activePath: '/freight/leads',
          hideInMenu: true,
          authority: ['freight:lead:query'],
        },
      },
      {
        path: 'quote-editor',
        name: 'FreightQuoteEditor',
        component: () => import('#/views/freight/quote-editor/index.vue'),
        meta: {
          title: '报价编辑器',
          activePath: '/freight/leads',
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
          activePath: '/freight/leads',
          hideInMenu: true,
          authority: ['freight:quote:query'],
        },
      },
    ],
  },
];

export default routes;
