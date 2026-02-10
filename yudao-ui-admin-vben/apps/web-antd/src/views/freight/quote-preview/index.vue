<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Descriptions, Table } from 'ant-design-vue';

import { getFreightQuote } from '#/api/freight/quote';

interface FeeItem {
  name: string;
  amount: number;
}

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const quote = ref<any>();
const feeItems = ref<FeeItem[]>([]);
const extraRemark = ref('');

const quoteId = computed(() => Number(route.params.id));

const columns = [
  { title: '费用项', dataIndex: 'name', key: 'name' },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 180 },
];

function parseRemark(remark?: string) {
  if (!remark) {
    return;
  }
  try {
    const parsed = JSON.parse(remark);
    if (Array.isArray(parsed?.feeItems)) {
      feeItems.value = parsed.feeItems;
    }
    if (parsed?.remark) {
      extraRemark.value = parsed.remark;
    }
  } catch {
    extraRemark.value = remark;
  }
}

async function loadData() {
  if (!quoteId.value || Number.isNaN(quoteId.value)) {
    return;
  }
  loading.value = true;
  try {
    quote.value = await getFreightQuote(quoteId.value);
    parseRemark(quote.value?.remark);
    if (feeItems.value.length === 0) {
      feeItems.value = [
        { name: '报价总额', amount: Number(quote.value?.total || 0) },
      ];
    }
  } finally {
    loading.value = false;
  }
}

function handlePrint() {
  window.print();
}

onMounted(loadData);
</script>

<template>
  <Page auto-content-height title="报价预览" :loading="loading">
    <template #extra>
      <Button @click="router.back()"> 返回 </Button>
      <Button type="primary" @click="handlePrint"> 打印 / 导出 PDF </Button>
    </template>

    <Card class="print-area" title="货运报价单">
      <Descriptions :column="2" bordered size="small">
        <Descriptions.Item label="报价单号">{{ quote?.id }}</Descriptions.Item>
        <Descriptions.Item label="线索 ID">
          {{ quote?.leadId }}
        </Descriptions.Item>
        <Descriptions.Item label="币种">
          {{ quote?.currency }}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {{ quote?.createTime || '-' }}
        </Descriptions.Item>
      </Descriptions>

      <Table
        class="mt-4"
        :data-source="feeItems"
        :columns="columns"
        :pagination="false"
        row-key="name"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            {{ quote?.currency }} {{ Number(record.amount || 0).toFixed(2) }}
          </template>
        </template>
      </Table>

      <div class="font-600 mt-4 text-right text-[18px]">
        合计：{{ quote?.currency }} {{ Number(quote?.total || 0).toFixed(2) }}
      </div>

      <div v-if="extraRemark" class="mt-4 text-gray-600">
        备注：{{ extraRemark }}
      </div>
    </Card>
  </Page>
</template>

<style scoped>
@media print {
  .ant-page-header,
  :deep(.vben-page-header),
  button {
    display: none !important;
  }

  .print-area {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
