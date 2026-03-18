<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { FreightOrderApi } from '#/api/freight/order';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getContractSimpleList } from '#/api/crm/contract';
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

const contractSchema: VbenFormSchema[] = [
  {
    fieldName: 'contractId',
    label: '合同',
    component: 'Select',
    formItemClass: 'col-span-1',
    componentProps: {
      options: [],
      placeholder: '请先选择客户',
      allowClear: true,
    },
    dependencies: {
      triggerFields: ['customerId'],
      disabled: (values) => !values.customerId,
      async componentProps(values) {
        if (!values.customerId) {
          return {
            options: [],
            placeholder: '请先选择客户',
          };
        }
        const res = await getContractSimpleList(values.customerId);
        return {
          options: res.map((item) => ({
            label: `${item.no || ''} ${item.name}`.trim(),
            value: item.id,
          })),
          placeholder: '请选择合同',
          allowClear: true,
        };
      },
    },
  },
];

function buildFormSchema(status?: string) {
  const schema = [...useFormSchema(getOrderFormStage(status))];
  const customerIndex = schema.findIndex(
    (item) => item.fieldName === 'customerId',
  );
  if (customerIndex >= 0) {
    schema.splice(customerIndex + 1, 0, ...contractSchema);
  } else {
    schema.push(...contractSchema);
  }
  return schema;
}

function updateStageSchema(status?: string) {
  formApi.setState({
    schema: buildFormSchema(status),
  });
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-2 gap-x-8 gap-y-1',
  layout: 'vertical',
  schema: buildFormSchema('DRAFT'),
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
  <Modal :title="getTitle" class="w-5/6">
    <div class="mx-4 mb-3">
      <a-alert
        type="info"
        show-icon
        :message="`当前状态：${statusTextMap[currentStatus] || currentStatus}`"
        :description="`当前填写阶段：${stageTextMap[currentStage]}。页面仅保留货运专业术语英文，其余字段均使用中文。`"
      />
    </div>
    <Form class="freight-order-form mx-4" />
  </Modal>
</template>

<style scoped>
.freight-order-form {
  :deep(.ant-form-item) {
    margin-bottom: 14px;
  }

  :deep(.freight-order-section) {
    margin-top: 10px;
    margin-bottom: 8px;
    padding: 10px 16px 0;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%);
  }

  :deep(.freight-order-section .ant-divider) {
    margin: 0 0 12px;
    color: #262626;
    font-size: 16px;
    font-weight: 600;
  }

  :deep(.ant-form-item-label > label) {
    color: #262626;
    font-weight: 500;
  }
}
</style>
