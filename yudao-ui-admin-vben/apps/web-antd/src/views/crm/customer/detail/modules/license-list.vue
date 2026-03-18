<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CrmCustomerLicenseApi } from '#/api/crm/customer/license';

import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCustomerLicense,
  getCustomerLicenseListByCustomer,
} from '#/api/crm/customer/license';

import LicenseForm from './license-form.vue';

const props = defineProps<{
  customerId: number;
}>();

const REMIND_DAYS = 30;

const licenseTypeMap: Record<string, string> = {
  BUSINESS_LICENSE: '营业执照',
  TAX_REGISTRATION: '税务登记证',
  IMPORT_EXPORT_RECORD: '进出口备案',
  CUSTOMS_QUALIFICATION: '报关资质',
  OTHER: '其他资质',
};

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: LicenseForm,
  destroyOnClose: true,
});

const today = computed(() => dayjs().startOf('day'));

function getLicenseTypeLabel(type?: string) {
  return licenseTypeMap[type || ''] ?? type ?? '-';
}

function getExpireDiffDays(expireDate?: string) {
  if (!expireDate) return null;
  return dayjs(expireDate).startOf('day').diff(today.value, 'day');
}

function getExpireStatus(expireDate?: string) {
  const diffDays = getExpireDiffDays(expireDate);
  if (diffDays === null) {
    return { color: 'default', text: '未设置到期日' };
  }
  if (diffDays < 0) {
    return { color: 'error', text: '已过期' };
  }
  if (diffDays <= REMIND_DAYS) {
    return { color: 'warning', text: '即将到期' };
  }
  return { color: 'success', text: '有效' };
}

function getExpireTip(expireDate?: string) {
  const diffDays = getExpireDiffDays(expireDate);
  if (diffDays === null) return '-';
  if (diffDays < 0) return `已逾期 ${Math.abs(diffDays)} 天`;
  if (diffDays === 0) return '今天到期';
  return `剩余 ${diffDays} 天`;
}

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formModalApi
    .setData({
      customerId: props.customerId,
    } as CrmCustomerLicenseApi.License)
    .open();
}

function handleEdit(row: CrmCustomerLicenseApi.License) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: CrmCustomerLicenseApi.License) {
  await deleteCustomerLicense(row.id!);
  message.success('删除成功');
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        title: '资质类型',
        field: 'licenseType',
        minWidth: 160,
        slots: { default: 'licenseType' },
      },
      { title: '证照编号', field: 'licenseNo', minWidth: 180 },
      { title: '公司名称', field: 'companyName', minWidth: 220 },
      { title: '到期日期', field: 'expireDate', minWidth: 140 },
      {
        title: '资质状态',
        field: 'expireStatus',
        minWidth: 120,
        slots: { default: 'expireStatus' },
      },
      {
        title: '到期提醒',
        field: 'expireTip',
        minWidth: 140,
        slots: { default: 'expireTip' },
      },
      {
        title: '附件地址',
        field: 'attachmentUrl',
        minWidth: 220,
        slots: { default: 'attachmentUrl' },
      },
      { title: '备注', field: 'remark', minWidth: 180 },
      {
        title: '创建时间',
        field: 'createTime',
        minWidth: 180,
        formatter: 'formatDateTime',
      },
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
          const list = await getCustomerLicenseListByCustomer(props.customerId);
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
  } as VxeTableGridOptions<CrmCustomerLicenseApi.License>,
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
              label: '新增营业执照/资质',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['crm:customer-license:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #licenseType="{ row }">
        <Tag color="blue">
          {{ getLicenseTypeLabel(row.licenseType) }}
        </Tag>
      </template>
      <template #expireStatus="{ row }">
        <a-tag :color="getExpireStatus(row.expireDate).color">
          {{ getExpireStatus(row.expireDate).text }}
        </a-tag>
      </template>
      <template #expireTip="{ row }">
        {{ getExpireTip(row.expireDate) }}
      </template>
      <template #attachmentUrl="{ row }">
        <a
          v-if="row.attachmentUrl"
          :href="row.attachmentUrl"
          target="_blank"
          rel="noreferrer"
          class="text-[var(--primary-color)]"
        >
          查看附件
        </a>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['crm:customer-license:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['crm:customer-license:delete'],
              popConfirm: {
                title: `确认删除资质 ${getLicenseTypeLabel(row.licenseType)} 吗？`,
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </div>
</template>
