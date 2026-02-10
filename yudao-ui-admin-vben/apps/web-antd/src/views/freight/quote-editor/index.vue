<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Table,
} from 'ant-design-vue';

import { createFreightQuote } from '#/api/freight/quote';

interface FeeRow {
  key: string;
  name: string;
  amount: number;
}

const route = useRoute();
const router = useRouter();

const saving = ref(false);
const leadId = computed(() =>
  Number(route.query.leadId || route.params.leadId),
);

const form = reactive({
  currency: 'USD',
  remark: '',
});

const feeItems = ref<FeeRow[]>([
  { key: `${Date.now()}`, name: '海运费', amount: 0 },
]);

const total = computed(() =>
  feeItems.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
);

const totalText = computed(() => `${form.currency} ${total.value.toFixed(2)}`);

const columns = [
  { title: '费用项', dataIndex: 'name', key: 'name' },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 180 },
  { title: '操作', key: 'actions', width: 120 },
];

function addItem() {
  feeItems.value.push({
    key: `${Date.now()}-${Math.random()}`,
    name: '',
    amount: 0,
  });
}

function removeItem(key: string) {
  if (feeItems.value.length <= 1) {
    message.warning('至少保留一项费用');
    return;
  }
  feeItems.value = feeItems.value.filter((item) => item.key !== key);
}

async function handleSaveQuote() {
  if (!leadId.value || Number.isNaN(leadId.value)) {
    message.error('缺少 leadId');
    return;
  }
  if (feeItems.value.some((item) => !item.name.trim())) {
    message.warning('请填写所有费用项名称');
    return;
  }
  if (total.value <= 0) {
    message.warning('合计金额必须大于 0');
    return;
  }

  saving.value = true;
  try {
    const quoteId = await createFreightQuote({
      leadId: leadId.value,
      currency: form.currency,
      unitPrice: total.value,
      quantity: 1,
      surcharge: 0,
      remark: JSON.stringify({
        feeItems: feeItems.value,
        remark: form.remark,
      }),
    });
    message.success('报价已保存');
    router.push({ path: `/freight/quote-preview/${quoteId}` });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Page auto-content-height title="报价编辑器">
    <template #extra>
      <Button @click="router.push('/freight/leads')"> 返回线索列表 </Button>
    </template>

    <Card title="基础信息">
      <Form layout="inline">
        <Form.Item label="线索 ID">
          <Input :value="String(leadId || '')" disabled style="width: 180px" />
        </Form.Item>
        <Form.Item label="币种">
          <Input v-model:value="form.currency" style="width: 160px" />
        </Form.Item>
        <Form.Item label="备注">
          <Input
            v-model:value="form.remark"
            placeholder="可选"
            style="width: 360px"
          />
        </Form.Item>
      </Form>
    </Card>

    <Card class="mt-4" title="费用项">
      <template #extra>
        <Button type="dashed" @click="addItem"> 新增费用项 </Button>
      </template>

      <Table
        :data-source="feeItems"
        :columns="columns"
        :pagination="false"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <Input v-model:value="record.name" placeholder="例如：报关费" />
          </template>
          <template v-else-if="column.key === 'amount'">
            <InputNumber
              v-model:value="record.amount"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </template>
          <template v-else-if="column.key === 'actions'">
            <Button danger type="link" @click="removeItem(record.key)">
              删除
            </Button>
          </template>
        </template>
      </Table>

      <div class="mt-4 flex justify-end">
        <Space>
          <span class="text-[16px]">合计：</span>
          <span class="font-600 text-[18px]">{{ totalText }}</span>
        </Space>
      </div>

      <div class="mt-4 flex justify-end">
        <Button type="primary" :loading="saving" @click="handleSaveQuote">
          保存并预览
        </Button>
      </div>
    </Card>
  </Page>
</template>
