<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  getFreightOrder,
  updateFreightOrder,
  updateFreightOrderStatus,
} from '#/api/freight/order';

import { getOrderTransitionConfig, statusTextMap } from '../data';

const emit = defineEmits(['success']);

interface TransitionModalData {
  order: FreightOrderApi.Order;
  toStatus: string;
}

const formData = ref<FreightOrderApi.Order>();
const toStatus = ref('');
const transitionConfig = computed(() =>
  getOrderTransitionConfig(toStatus.value),
);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  wrapperClass: 'grid-cols-2',
  layout: 'horizontal',
  schema: [],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid || !formData.value?.id || !transitionConfig.value) return;
    modalApi.lock();
    try {
      const values = {
        ...formData.value,
        ...((await formApi.getValues()) as FreightOrderApi.Order),
      } as FreightOrderApi.Order;
      await updateFreightOrder(values);
      await updateFreightOrderStatus({
        id: values.id!,
        toStatus: toStatus.value,
      });
      message.success(
        `已更新节点字段并推进到 ${statusTextMap[toStatus.value] || toStatus.value}`,
      );
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      toStatus.value = '';
      formApi.setState({ schema: [] });
      return;
    }
    const data = modalApi.getData<TransitionModalData>();
    if (!data?.order?.id || !data.toStatus) return;
    toStatus.value = data.toStatus;
    const config = getOrderTransitionConfig(data.toStatus);
    formApi.setState({ schema: config?.schema || [] });
    await nextTick();
    modalApi.lock();
    try {
      formData.value = await getFreightOrder(data.order.id);
      await formApi.resetForm();
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="transitionConfig?.title || '状态推进'" class="w-2/3">
    <div class="mx-4 mb-3">
      <a-alert
        type="info"
        show-icon
        :message="
          transitionConfig?.description ||
          '请先补充当前节点字段，再推进业务状态。'
        "
      />
    </div>
    <Form class="mx-4" />
  </Modal>
</template>
