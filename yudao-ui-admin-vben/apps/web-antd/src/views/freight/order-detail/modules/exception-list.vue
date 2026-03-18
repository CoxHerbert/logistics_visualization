<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  deleteFreightOrderException,
  getFreightOrderExceptionList,
  saveFreightOrderException,
} from '#/api/freight/order';
import { getSimpleUserList } from '#/api/system/user';
import { TableAction } from '#/components/table-action';

const props = defineProps<{
  orderId?: number;
}>();

const exceptionTypeOptions = [
  { label: '订舱异常', value: 'BOOKING' },
  { label: '报关异常', value: 'CUSTOMS' },
  { label: '甩柜', value: 'ROLLOVER' },
  { label: '延误', value: 'DELAY' },
  { label: '查验', value: 'INSPECTION' },
  { label: '改港', value: 'PORT_CHANGE' },
  { label: '提单异常', value: 'BL' },
  { label: '派送异常', value: 'DELIVERY' },
  { label: '入仓异常', value: 'WAREHOUSE' },
  { label: '费用异常', value: 'FEE' },
  { label: '客户资料异常', value: 'CUSTOMER' },
  { label: '其他', value: 'OTHER' },
];

const stageOptions = [
  { label: '录单', value: 'ENTRY' },
  { label: '审核', value: 'REVIEW' },
  { label: '报价', value: 'QUOTE' },
  { label: '订舱', value: 'BOOKING' },
  { label: '报关', value: 'CUSTOMS' },
  { label: '运输', value: 'TRANSIT' },
  { label: '到港', value: 'ARRIVAL' },
  { label: '签收', value: 'SIGN' },
  { label: '结算', value: 'SETTLEMENT' },
];

const severityOptions = [
  { label: '低', value: 'LOW' },
  { label: '中', value: 'MEDIUM' },
  { label: '高', value: 'HIGH' },
  { label: '严重', value: 'CRITICAL' },
];

const typeMap = Object.fromEntries(
  exceptionTypeOptions.map((item) => [item.value, item.label]),
);
const stageMap = Object.fromEntries(
  stageOptions.map((item) => [item.value, item.label]),
);
const severityMap = Object.fromEntries(
  severityOptions.map((item) => [item.value, item.label]),
);

const loading = ref(false);
const dataSource = ref<FreightOrderApi.OrderException[]>([]);

async function loadData() {
  if (!props.orderId) {
    dataSource.value = [];
    return;
  }
  loading.value = true;
  try {
    dataSource.value = await getFreightOrderExceptionList(props.orderId);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.orderId,
  () => {
    void loadData();
  },
  { immediate: true },
);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: { triggerFields: [''], show: () => false },
    },
    {
      fieldName: 'orderId',
      component: 'Input',
      dependencies: { triggerFields: [''], show: () => false },
    },
    {
      fieldName: 'exceptionType',
      label: '异常类型',
      component: 'Select',
      componentProps: { options: exceptionTypeOptions },
      rules: 'required',
    },
    {
      fieldName: 'exceptionStage',
      label: '异常阶段',
      component: 'Select',
      componentProps: { options: stageOptions, allowClear: true },
    },
    {
      fieldName: 'severity',
      label: '严重程度',
      component: 'Select',
      componentProps: { options: severityOptions, allowClear: true },
    },
    {
      fieldName: 'responsibleUserId',
      label: '责任人',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      fieldName: 'title',
      label: '异常标题',
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'occurTime',
      label: '发生时间',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'closed',
      label: '是否关闭',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '否', value: false },
          { label: '是', value: true },
        ],
      },
      defaultValue: false,
    },
    {
      fieldName: 'content',
      label: '异常说明',
      component: 'Textarea',
      componentProps: { rows: 3 },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'solution',
      label: '处理方案',
      component: 'Textarea',
      componentProps: { rows: 3 },
      formItemClass: 'col-span-2',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!props.orderId) return;
    const { valid } = await formApi.validate();
    if (!valid) return;
    modalApi.lock();
    try {
      const values =
        (await formApi.getValues()) as FreightOrderApi.OrderException;
      values.orderId = props.orderId;
      await saveFreightOrderException(values);
      message.success(values.id ? '异常记录已更新' : '异常记录已新增');
      await loadData();
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    await formApi.resetForm();
    const data = modalApi.getData<FreightOrderApi.OrderException>();
    await formApi.setValues({
      orderId: props.orderId,
      closed: false,
      ...data,
    });
  },
});

function handleCreate() {
  modalApi.setData({ orderId: props.orderId }).open();
}

function handleEdit(record: FreightOrderApi.OrderException) {
  modalApi.setData(record).open();
}

async function handleDelete(record: FreightOrderApi.OrderException) {
  if (!record.id) return;
  await deleteFreightOrderException(record.id);
  message.success('异常记录已删除');
  await loadData();
}
</script>

<template>
  <div class="mb-3 flex justify-end">
    <a-button type="primary" @click="handleCreate">新增异常</a-button>
  </div>
  <a-table
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
    row-key="id"
    size="small"
  >
    <a-table-column title="发生时间" width="180">
      <template #default="{ record }">
        {{ formatDateTime(record.occurTime || record.createTime) || '-' }}
      </template>
    </a-table-column>
    <a-table-column title="异常类型" width="120">
      <template #default="{ record }">
        {{ typeMap[record.exceptionType] || record.exceptionType || '-' }}
      </template>
    </a-table-column>
    <a-table-column title="阶段" width="100">
      <template #default="{ record }">
        {{ stageMap[record.exceptionStage] || record.exceptionStage || '-' }}
      </template>
    </a-table-column>
    <a-table-column title="严重程度" width="100">
      <template #default="{ record }">
        {{ severityMap[record.severity] || record.severity || '-' }}
      </template>
    </a-table-column>
    <a-table-column title="异常标题" data-index="title" min-width="180" />
    <a-table-column title="异常说明" data-index="content" min-width="220" />
    <a-table-column title="处理方案" data-index="solution" min-width="220" />
    <a-table-column title="状态" width="90">
      <template #default="{ record }">
        <a-tag :color="record.closed ? 'success' : 'warning'">
          {{ record.closed ? '已关闭' : '处理中' }}
        </a-tag>
      </template>
    </a-table-column>
    <a-table-column title="操作" width="140" fixed="right">
      <template #default="{ record }">
        <TableAction
          :actions="[
            { label: '编辑', onClick: () => handleEdit(record) },
            {
              label: '删除',
              danger: true,
              popConfirm: { title: '确认删除这条异常记录？' },
              onClick: () => handleDelete(record),
            },
          ]"
        />
      </template>
    </a-table-column>
  </a-table>

  <Modal title="异常记录" class="w-3/4">
    <Form class="mx-4" />
  </Modal>
</template>
