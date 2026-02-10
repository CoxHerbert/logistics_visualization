<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FreightLeadApi } from '#/api/freight/lead';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFreightLeadPage } from '#/api/freight/lead';

import { useGridColumns, useGridFormSchema } from './data';

const { push } = useRouter();

function handleDetail(row: FreightLeadApi.Lead) {
  push({ path: `/freight/leads/${row.id}` });
}

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getFreightLeadPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
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
  } as VxeTableGridOptions<FreightLeadApi.Lead>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="线索列表">
      <template #contactName="{ row }">
        <Button type="link" @click="handleDetail(row)">
          {{ row.contactName }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
