<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CrmCustomerBankAccountApi } from '#/api/crm/customer/bankAccount';

import { useVbenModal } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCustomerBankAccount,
  getCustomerBankAccountListByCustomer,
} from '#/api/crm/customer/bankAccount';

import BankAccountForm from './bank-account-form.vue';

const props = defineProps<{
  customerId: number;
}>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: BankAccountForm,
  destroyOnClose: true,
});

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formModalApi
    .setData({
      customerId: props.customerId,
    } as CrmCustomerBankAccountApi.BankAccount)
    .open();
}

function handleEdit(row: CrmCustomerBankAccountApi.BankAccount) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: CrmCustomerBankAccountApi.BankAccount) {
  await deleteCustomerBankAccount(row.id!);
  message.success('删除成功');
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { title: '户名', field: 'accountName', minWidth: 160 },
      { title: '开户行', field: 'bankName', minWidth: 180 },
      { title: '银行账号', field: 'bankAccountNo', minWidth: 220 },
      { title: 'Swift', field: 'swiftCode', minWidth: 140 },
      { title: '币种', field: 'currency', width: 100 },
      {
        title: '默认账户',
        field: 'defaultStatus',
        width: 120,
        slots: { default: 'defaultStatus' },
      },
      { title: '备注', field: 'remark', minWidth: 180 },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        slots: { default: 'actions' },
      },
    ],
    height: 420,
    proxyConfig: {
      ajax: {
        query: async () => {
          const list = await getCustomerBankAccountListByCustomer(
            props.customerId,
          );
          return { list, total: list.length };
        },
      },
    },
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: false,
    },
  } as VxeTableGridOptions<CrmCustomerBankAccountApi.BankAccount>,
});
</script>

<template>
  <div>
    <FormModal @success="handleRefresh" />
    <Grid>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增银行账户',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['crm:customer-bank-account:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #defaultStatus="{ row }">
        <Tag :color="row.defaultStatus ? 'blue' : 'default'">
          {{ row.defaultStatus ? '是' : '否' }}
        </Tag>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['crm:customer-bank-account:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['crm:customer-bank-account:delete'],
              popConfirm: {
                title: `确认删除账户 ${row.accountName} 吗？`,
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </div>
</template>
