import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/freight',
    name: 'Freight',
    meta: {
      title: '货运线索',
      icon: 'lucide:truck',
      order: 90,
    },
    children: [
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
    ],
  },
];

export default routes;
