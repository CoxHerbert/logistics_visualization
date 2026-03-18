<script lang="ts" setup>
import type { CrmCustomerLicenseApi } from '#/api/crm/customer/license';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCustomerLicense,
  getCustomerLicense,
  updateCustomerLicense,
} from '#/api/crm/customer/license';

const emit = defineEmits(['success']);

const formData = ref<CrmCustomerLicenseApi.License>();
const getTitle = computed(() =>
  formData.value?.id ? '编辑营业执照/资质' : '新增营业执照/资质',
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
      fieldName: 'licenseType',
      label: '资质类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '营业执照', value: 'BUSINESS_LICENSE' },
          { label: '税务登记证', value: 'TAX_REGISTRATION' },
          { label: '进出口备案', value: 'IMPORT_EXPORT_RECORD' },
          { label: '报关资质', value: 'CUSTOMS_QUALIFICATION' },
          { label: '其他资质', value: 'OTHER' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'licenseNo',
      label: '证照编号',
      component: 'Input',
    },
    {
      fieldName: 'companyName',
      label: '公司名称',
      component: 'Input',
    },
    {
      fieldName: 'expireDate',
      label: '到期日期',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      fieldName: 'attachmentUrl',
      label: '附件地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入附件 URL',
      },
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
        (await formApi.getValues()) as CrmCustomerLicenseApi.License;
      await (values.id
        ? updateCustomerLicense(values)
        : createCustomerLicense(values));
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
    const data = modalApi.getData<CrmCustomerLicenseApi.License>();
    if (!data) return;
    modalApi.lock();
    try {
      formData.value = data.id ? await getCustomerLicense(data.id) : data;
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
