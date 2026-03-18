<script lang="ts" setup>
import type { CrmCustomerBankAccountApi } from '#/api/crm/customer/bankAccount';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCustomerBankAccount,
  getCustomerBankAccount,
  updateCustomerBankAccount,
} from '#/api/crm/customer/bankAccount';

const emit = defineEmits(['success']);

const formData = ref<CrmCustomerBankAccountApi.BankAccount>();
const getTitle = computed(() =>
  formData.value?.id ? '编辑银行账户' : '新增银行账户',
);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'customerId',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'accountName',
      label: '户名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'bankName',
      label: '开户行',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'bankAccountNo',
      label: '银行账号',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'swiftCode',
      label: 'Swift',
      component: 'Input',
    },
    {
      fieldName: 'currency',
      label: '币种',
      component: 'Input',
      defaultValue: 'CNY',
    },
    {
      fieldName: 'defaultStatus',
      label: '默认账户',
      component: 'Switch',
      defaultValue: false,
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        rows: 3,
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    modalApi.lock();
    try {
      const values =
        (await formApi.getValues()) as CrmCustomerBankAccountApi.BankAccount;
      await (values.id
        ? updateCustomerBankAccount(values)
        : createCustomerBankAccount(values));
      message.success('保存成功');
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    await formApi.resetForm();
    const data = modalApi.getData<CrmCustomerBankAccountApi.BankAccount>();
    if (!data) return;
    modalApi.lock();
    try {
      formData.value = data.id ? await getCustomerBankAccount(data.id) : data;
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-2/5">
    <Form class="mx-4" />
  </Modal>
</template>
