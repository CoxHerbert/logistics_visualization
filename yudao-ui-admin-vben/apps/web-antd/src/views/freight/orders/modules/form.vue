<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createFreightOrder,
  getFreightOrder,
  updateFreightOrder,
} from '#/api/freight/order';

import {
  getOrderFormStage,
  stageTextMap,
  statusTextMap,
  useFormSchema,
} from '../data';

const emit = defineEmits(['success']);

const formData = ref<FreightOrderApi.Order>();
const currentStatus = computed(() => formData.value?.status || 'DRAFT');
const currentStage = computed(() => getOrderFormStage(currentStatus.value));
const getTitle = computed(() =>
  formData.value?.id ? '编辑业务单' : '新建业务单',
);

const defaultFormValues: Partial<FreightOrderApi.Order> = {
  status: 'DRAFT',
  bizType: 'EXPORT',
  transportMode: 'SEA_FCL',
  currency: 'USD',
  hasBattery: false,
  sensitive: false,
  packageCount: 0,
  grossWeightKg: 0,
  volumeCbm: 0,
  receivableAmount: 0,
  payableAmount: 0,
  profitAmount: 0,
};

function updateStageSchema(status?: string) {
  formApi.updateSchema(useFormSchema(getOrderFormStage(status)));
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  wrapperClass: 'grid-cols-2',
  layout: 'horizontal',
  schema: useFormSchema('basic'),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as FreightOrderApi.Order;
      await (data.id ? updateFreightOrder(data) : createFreightOrder(data));
      message.success(data.id ? '业务单已更新' : '业务单已创建');
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      updateStageSchema('DRAFT');
      return;
    }
    await formApi.resetForm();
    await formApi.setValues(defaultFormValues);
    formData.value = { ...defaultFormValues } as FreightOrderApi.Order;
    updateStageSchema('DRAFT');
    const data = modalApi.getData<FreightOrderApi.Order>();
    if (!data?.id) return;
    modalApi.lock();
    try {
      formData.value = await getFreightOrder(data.id);
      updateStageSchema(formData.value.status);
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-3/4">
    <div class="mx-4 mb-3">
      <a-alert
        type="info"
        show-icon
        :message="`当前状态：${statusTextMap[currentStatus] || currentStatus}`"
        :description="`当前填写阶段：${stageTextMap[currentStage]}。页面仅保留货运专业术语英文，其余字段均使用中文。`"
      />
    </div>
    <Form class="mx-4" />
  </Modal>
</template>
