<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import {
  getFreightOrderFeeList,
  saveFreightOrderFees,
} from '#/api/freight/order';

const emit = defineEmits(['success']);

const orderId = ref<number>();
const feeList = ref<FreightOrderApi.OrderFee[]>([]);

const feeTypeOptions = [
  { label: '应收', value: 'RECEIVABLE' },
  { label: '应付', value: 'PAYABLE' },
];

function createEmptyFee(): FreightOrderApi.OrderFee {
  return {
    feeType: 'RECEIVABLE',
    feeName: '',
    currency: 'USD',
    unitName: 'JOB',
    quantity: 1,
    unitPrice: 0,
    amount: 0,
    remark: '',
  };
}

function addFee() {
  feeList.value.push(createEmptyFee());
}

function removeFee(index: number) {
  feeList.value.splice(index, 1);
}

function recalcAmount(record: FreightOrderApi.OrderFee) {
  const qty = Number(record.quantity ?? 0);
  const unitPrice = Number(record.unitPrice ?? 0);
  record.amount = Number((qty * unitPrice).toFixed(2));
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!orderId.value) {
      return;
    }
    modalApi.lock();
    try {
      const payload = feeList.value
        .filter((item) => item.feeName?.trim())
        .map((item) => ({
          ...item,
          amount:
            item.amount === undefined || item.amount === null
              ? Number(
                  (
                    Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0)
                  ).toFixed(2),
                )
              : item.amount,
        }));
      await saveFreightOrderFees({
        orderId: orderId.value,
        fees: payload,
      });
      message.success('费用明细已保存');
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      orderId.value = undefined;
      feeList.value = [];
      return;
    }
    const data = modalApi.getData<FreightOrderApi.Order>();
    if (!data?.id) {
      return;
    }
    orderId.value = data.id;
    modalApi.lock();
    try {
      feeList.value = await getFreightOrderFeeList(data.id);
      if (feeList.value.length === 0) {
        feeList.value = [createEmptyFee()];
      }
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal title="费用明细" class="w-4/5">
    <div class="mb-4 flex justify-end">
      <a-button type="primary" @click="addFee">新增费用</a-button>
    </div>
    <a-table
      :data-source="feeList"
      :pagination="false"
      row-key="id"
      bordered
      size="small"
    >
      <a-table-column title="类型" width="120">
        <template #default="{ record }">
          <a-select
            v-model:value="record.feeType"
            :options="feeTypeOptions"
            class="w-full"
          />
        </template>
      </a-table-column>
      <a-table-column title="费用名称" width="180">
        <template #default="{ record }">
          <a-input v-model:value="record.feeName" />
        </template>
      </a-table-column>
      <a-table-column title="币种" width="100">
        <template #default="{ record }">
          <a-input v-model:value="record.currency" />
        </template>
      </a-table-column>
      <a-table-column title="计费单位" width="100">
        <template #default="{ record }">
          <a-input v-model:value="record.unitName" />
        </template>
      </a-table-column>
      <a-table-column title="数量" width="100">
        <template #default="{ record }">
          <a-input-number
            v-model:value="record.quantity"
            :min="0"
            :precision="3"
            class="w-full"
            @change="recalcAmount(record)"
          />
        </template>
      </a-table-column>
      <a-table-column title="单价" width="120">
        <template #default="{ record }">
          <a-input-number
            v-model:value="record.unitPrice"
            :min="0"
            :precision="2"
            class="w-full"
            @change="recalcAmount(record)"
          />
        </template>
      </a-table-column>
      <a-table-column title="金额" width="120">
        <template #default="{ record }">
          <a-input-number
            v-model:value="record.amount"
            :min="0"
            :precision="2"
            class="w-full"
          />
        </template>
      </a-table-column>
      <a-table-column title="备注">
        <template #default="{ record }">
          <a-input v-model:value="record.remark" />
        </template>
      </a-table-column>
      <a-table-column title="操作" width="80" fixed="right">
        <template #default="{ index }">
          <a-button danger type="link" @click="removeFee(index)">
            删除
          </a-button>
        </template>
      </a-table-column>
    </a-table>
  </Modal>
</template>
