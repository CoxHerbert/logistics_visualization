<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FreightOrderApi } from '#/api/freight/order';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getFreightOrderPage,
  updateFreightOrderStatus,
} from '#/api/freight/order';

import {
  getOrderTransitionConfig,
  statusTextMap,
  useGridColumns,
  useGridFormSchema,
} from './data';
import FeeModal from './modules/fee-modal.vue';
import Form from './modules/form.vue';
import LogModal from './modules/log-modal.vue';
import TransitionForm from './modules/transition-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [FeeFormModal, feeFormModalApi] = useVbenModal({
  connectedComponent: FeeModal,
  destroyOnClose: true,
});
const [LogModalView, logModalApi] = useVbenModal({
  connectedComponent: LogModal,
  destroyOnClose: true,
});
const [TransitionModal, transitionModalApi] = useVbenModal({
  connectedComponent: TransitionForm,
  destroyOnClose: true,
});
const router = useRouter();

const nextStatusMap: Record<string, string | undefined> = {
  ARRIVED: 'SIGNED',
  BOOKED: 'CUSTOMS_PROCESSING',
  CUSTOMS_PROCESSING: 'IN_TRANSIT',
  DRAFT: 'PENDING_REVIEW',
  IN_TRANSIT: 'ARRIVED',
  PENDING_BOOKING: 'BOOKED',
  PENDING_QUOTE: 'QUOTED',
  PENDING_REVIEW: 'PENDING_QUOTE',
  QUOTED: 'PENDING_BOOKING',
  SIGNED: 'COMPLETED',
};

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formModalApi.setData(null).open();
}

function handleEdit(row: FreightOrderApi.Order) {
  formModalApi.setData(row).open();
}

function handleFees(row: FreightOrderApi.Order) {
  feeFormModalApi.setData(row).open();
}

function handleLogs(row: FreightOrderApi.Order) {
  logModalApi.setData(row).open();
}

function handleViewDetail(row: FreightOrderApi.Order) {
  if (!row.id) return;
  router.push(`/freight/orders/${row.id}`);
}

function handleNextStep(row: FreightOrderApi.Order) {
  const toStatus = nextStatusMap[row.status || ''];
  if (!toStatus) return;
  transitionModalApi.setData({ order: row, toStatus }).open();
}

async function handleCancel(row: FreightOrderApi.Order) {
  await updateFreightOrderStatus({
    id: row.id!,
    toStatus: 'CANCELLED',
  });
  message.success(`状态已更新为：${statusTextMap.CANCELLED || '已取消'}`);
  handleRefresh();
}

function buildActions(row: FreightOrderApi.Order) {
  const actions: any[] = [];
  const isReadonly = ['CANCELLED', 'COMPLETED'].includes(row.status || '');
  if (!isReadonly) {
    actions.push({
      label: '编辑',
      type: 'link',
      icon: ACTION_ICON.EDIT,
      auth: ['freight:order:update'],
      onClick: handleEdit.bind(null, row),
    });
  }
  actions.push(
    {
      label: '费用',
      type: 'link',
      auth: ['freight:order:update'],
      onClick: handleFees.bind(null, row),
    },
    {
      label: '日志',
      type: 'link',
      auth: ['freight:order:query'],
      onClick: handleLogs.bind(null, row),
    },
  );
  const toStatus = nextStatusMap[row.status || ''];
  const transitionConfig = getOrderTransitionConfig(toStatus);
  if (transitionConfig) {
    actions.push({
      label: transitionConfig.label,
      type: 'link',
      auth: ['freight:order:update'],
      onClick: handleNextStep.bind(null, row),
    });
  }
  if (!isReadonly) {
    actions.push({
      label: '取消',
      type: 'link',
      danger: true,
      auth: ['freight:order:update'],
      popConfirm: {
        title: `确认取消业务单 ${row.orderNo} 吗？`,
        confirm: handleCancel.bind(null, row),
      },
    });
  }
  return actions;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) =>
          await getFreightOrderPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<FreightOrderApi.Order>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <FeeFormModal @success="handleRefresh" />
    <LogModalView />
    <TransitionModal @success="handleRefresh" />
    <Grid table-title="业务单列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新建业务单',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #orderNo="{ row }">
        <a-button type="link" class="!px-0" @click="handleViewDetail(row)">
          {{ row.orderNo || '-' }}
        </a-button>
      </template>
      <template #actions="{ row }">
        <TableAction :actions="buildActions(row)" />
      </template>
    </Grid>
  </Page>
</template>
