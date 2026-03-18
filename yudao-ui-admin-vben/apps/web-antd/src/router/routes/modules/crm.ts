import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/crm',
    name: 'CrmCenter',
    meta: {
      title: '客户管理',
      icon: 'simple-icons:civicrm',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: 'clue/detail/:id',
        name: 'CrmClueDetail',
        meta: {
          title: '线索详情',
          activePath: '/crm/clue',
          hideInMenu: true,
          authority: ['crm:clue:query'],
        },
        component: () => import('#/views/crm/clue/detail/index.vue'),
      },
      {
        path: 'customer/detail/:id',
        name: 'CrmCustomerDetail',
        meta: {
          title: '客户详情',
          activePath: '/crm/customer',
          hideInMenu: true,
          authority: ['crm:customer:query'],
        },
        component: () => import('#/views/crm/customer/detail/index.vue'),
      },
      {
        path: 'business/detail/:id',
        name: 'CrmBusinessDetail',
        meta: {
          title: '商机详情',
          activePath: '/crm/business',
          hideInMenu: true,
          authority: ['crm:business:query'],
        },
        component: () => import('#/views/crm/business/detail/index.vue'),
      },
      {
        path: 'contract/detail/:id',
        name: 'CrmContractDetail',
        meta: {
          title: '合同详情',
          activePath: '/crm/contract',
          hideInMenu: true,
          authority: ['crm:contract:query'],
        },
        component: () => import('#/views/crm/contract/detail/index.vue'),
      },
      {
        path: 'receivable-plan/detail/:id',
        name: 'CrmReceivablePlanDetail',
        meta: {
          title: '回款计划详情',
          activePath: '/crm/receivable-plan',
          hideInMenu: true,
          authority: ['crm:receivable-plan:query'],
        },
        component: () => import('#/views/crm/receivable/plan/detail/index.vue'),
      },
      {
        path: 'receivable/detail/:id',
        name: 'CrmReceivableDetail',
        meta: {
          title: '回款详情',
          activePath: '/crm/receivable',
          hideInMenu: true,
          authority: ['crm:receivable:query'],
        },
        component: () => import('#/views/crm/receivable/detail/index.vue'),
      },
      {
        path: 'contact/detail/:id',
        name: 'CrmContactDetail',
        meta: {
          title: '联系人详情',
          activePath: '/crm/contact',
          hideInMenu: true,
          authority: ['crm:contact:query'],
        },
        component: () => import('#/views/crm/contact/detail/index.vue'),
      },
      {
        path: 'product/detail/:id',
        name: 'CrmProductDetail',
        meta: {
          title: '产品详情',
          activePath: '/crm/product',
          hideInMenu: true,
          authority: ['crm:product:query'],
        },
        component: () => import('#/views/crm/product/detail/index.vue'),
      },
    ],
  },
];

export default routes;
