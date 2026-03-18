<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FreightOrderApi } from '#/api/freight/order';

import { useRouter } from 'vue-router';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFreightOrderPage } from '#/api/freight/order';
import {
  statusTextMap,
  transportModeOptions,
} from '#/views/freight/orders/data';

const props = defineProps<{
  contractId: number;
}>();

const { push } = useRouter();

function handleDetail(row: FreightOrderApi.Order) {
  push({ name: 'FreightOrderDetail', params: { id: row.id } });
}

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        title: '业务单号',
        field: 'orderNo',
        minWidth: 180,
        fixed: 'left',
        slots: { default: 'orderNo' },
      },
      {
        title: '客户',
        field: 'customerName',
        minWidth: 160,
      },
      {
        title: '运输方式',
        field: 'transportMode',
        minWidth: 140,
        formatter: ({ cellValue }) =>
          transportModeOptions.find((item) => item.value === cellValue)
            ?.label ??
          cellValue ??
          '-',
      },
      {
        title: 'POL',
        field: 'originPort',
        minWidth: 120,
      },
      {
        title: 'POD',
        field: 'destinationPort',
        minWidth: 120,
      },
      {
        title: '状态',
        field: 'status',
        minWidth: 120,
        formatter: ({ cellValue }) =>
          statusTextMap[cellValue] ?? cellValue ?? '-',
      },
      {
        title: 'ETD',
        field: 'etd',
        minWidth: 160,
        formatter: 'formatDateTime',
      },
      {
        title: 'ETA',
        field: 'eta',
        minWidth: 160,
        formatter: 'formatDateTime',
      },
      {
        title: '创建时间',
        field: 'createTime',
        minWidth: 170,
        formatter: 'formatDateTime',
      },
    ],
    height: 500,
    proxyConfig: {
      ajax: {
        query: async ({ page }) =>
          await getFreightOrderPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            contractId: props.contractId,
          }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: false,
      zoom: true,
    },
  } as VxeTableGridOptions<FreightOrderApi.Order>,
});
</script>

<template>
  <Grid>
    <template #orderNo="{ row }">
      <Button type="link" @click="handleDetail(row)">
        {{ row.orderNo }}
      </Button>
    </template>
  </Grid>
</template>
