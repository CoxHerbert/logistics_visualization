<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

import { getFreightOrderLogList } from '#/api/freight/order';

const logList = ref<FreightOrderApi.OrderLog[]>([]);

const actionTextMap: Record<string, string> = {
  CREATE: '新建业务单',
  UPDATE: '编辑业务单',
  STATUS_CHANGE: '状态变更',
  FEE_SAVE: '保存费用明细',
};

const statusTextMap: Record<string, string> = {
  ARRIVED: '已到港',
  BOOKED: '已订舱',
  CANCELLED: '已取消',
  COMPLETED: '已完成',
  CUSTOMS_PROCESSING: '报关中',
  DRAFT: '草稿',
  IN_TRANSIT: '运输中',
  PENDING_BOOKING: '待订舱',
  PENDING_QUOTE: '待报价',
  PENDING_REVIEW: '待审核',
  QUOTED: '已报价',
  SIGNED: '已签收',
};

const contentTextMap: Record<string, string> = {
  CREATE: '创建业务单',
  UPDATE: '更新业务单信息',
  STATUS_CHANGE: '更新业务单状态',
  FEE_SAVE: '保存费用明细',
  'Create freight order': '创建业务单',
  'Save freight order fees': '保存费用明细',
  'Update freight order': '更新业务单信息',
};

function getActionText(actionType?: string) {
  if (!actionType) {
    return '-';
  }
  return actionTextMap[actionType] ?? actionType;
}

function getStatusText(status?: string) {
  if (!status) {
    return '-';
  }
  return statusTextMap[status] ?? status;
}

function getContentText(item: FreightOrderApi.OrderLog) {
  if (!item.content) {
    return '-';
  }
  return (
    contentTextMap[item.content] ??
    contentTextMap[item.actionType] ??
    item.content
  );
}

function formatLogTime(value?: number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'number') {
    return formatDateTime(value < 10_000_000_000 ? value * 1000 : value) || '-';
  }
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && String(value).trim() !== '') {
    return (
      formatDateTime(
        numericValue < 10_000_000_000 ? numericValue * 1000 : numericValue,
      ) || '-'
    );
  }
  return formatDateTime(value) || value;
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      logList.value = [];
      return;
    }
    const data = modalApi.getData<FreightOrderApi.Order>();
    if (!data?.id) {
      return;
    }
    modalApi.lock();
    try {
      logList.value = await getFreightOrderLogList(data.id);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal title="操作日志" class="w-3/5" :show-confirm-button="false">
    <div class="max-h-[70vh] overflow-y-auto pr-2">
      <a-timeline class="pt-2">
        <a-timeline-item v-for="item in logList" :key="item.id" color="blue">
          <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div class="flex items-center justify-between gap-3">
              <div class="font-medium text-gray-900">
                {{ getActionText(item.actionType) }}
              </div>
              <div class="shrink-0 text-xs text-gray-500">
                {{ formatLogTime(item.createTime) }}
              </div>
            </div>
            <div
              v-if="item.fromStatus || item.toStatus"
              class="mt-2 text-sm text-gray-500"
            >
              状态流转：{{ getStatusText(item.fromStatus) }} ->
              {{ getStatusText(item.toStatus) }}
            </div>
            <div class="mt-2 text-sm text-gray-600">
              操作人：{{ item.operatorName || '系统' }}
            </div>
            <div class="mt-2 text-sm leading-6 text-gray-700">
              {{ getContentText(item) }}
            </div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </Modal>
</template>
