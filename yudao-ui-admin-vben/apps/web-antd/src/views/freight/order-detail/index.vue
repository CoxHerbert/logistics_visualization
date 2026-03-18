<script lang="ts" setup>
import type { FreightOrderApi } from '#/api/freight/order';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { formatDateTime } from '@vben/utils';

import { message } from 'ant-design-vue';

import {
  getFreightOrder,
  getFreightOrderFeeList,
  getFreightOrderLogList,
} from '#/api/freight/order';
import { ACTION_ICON, TableAction } from '#/components/table-action';
import {
  statusTextMap,
  transportModeOptions,
} from '#/views/freight/orders/data';

import Form from '../orders/modules/form.vue';

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const loading = ref(false);
const order = ref<FreightOrderApi.Order>();
const feeList = ref<FreightOrderApi.OrderFee[]>([]);
const logList = ref<FreightOrderApi.OrderLog[]>([]);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const stepStatusMap: Record<string, number> = {
  ARRIVED: 4,
  BOOKED: 3,
  CANCELLED: 0,
  COMPLETED: 5,
  CUSTOMS_PROCESSING: 4,
  DRAFT: 0,
  IN_TRANSIT: 4,
  PENDING_BOOKING: 3,
  PENDING_QUOTE: 2,
  PENDING_REVIEW: 1,
  QUOTED: 2,
  SIGNED: 4,
};

const stepItems = computed(() => [
  { title: '创建评估', tip: '录入客户、运输方式、POL、POD 等基础委托资料' },
  { title: '评估中', tip: '确认资料完整，提交审核并进入报价准备' },
  { title: '最终评审', tip: '补充货物、GW、CBM 等报价关键字段' },
  { title: '执行订舱', tip: '维护 Booking No.、SO No.、ETD、ETA 等订舱信息' },
  { title: '运输交付', tip: '跟踪报关、ATD、ATA、POD 等运输节点' },
  { title: '评估完成', tip: '确认应收、应付、利润，完成业务归档' },
]);

const currentStep = computed(
  () => stepStatusMap[order.value?.status || 'DRAFT'] ?? 0,
);
const currentStatusText = computed(
  () => statusTextMap[order.value?.status || ''] || order.value?.status || '-',
);
const transportModeText = computed(
  () =>
    transportModeOptions.find(
      (item) => item.value === order.value?.transportMode,
    )?.label ||
    order.value?.transportMode ||
    '-',
);
const totalReceivable = computed(() => order.value?.receivableAmount ?? 0);
const totalPayable = computed(() => order.value?.payableAmount ?? 0);
const totalProfit = computed(() => order.value?.profitAmount ?? 0);
const pageTitle = computed(() => order.value?.orderNo || '业务单详情');

function formatValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') return '-';
  return value;
}

function getStepState(index: number) {
  const status = order.value?.status;
  if (status === 'CANCELLED') {
    if (index < currentStep.value) return 'finished';
    if (index === currentStep.value) return 'error';
    return 'pending';
  }
  if (index < currentStep.value) return 'finished';
  if (index === currentStep.value) return 'active';
  return 'pending';
}

function handleBack() {
  tabs.closeCurrentTab();
  router.push('/freight/orders');
}

function handleEdit() {
  if (!order.value?.id) return;
  formModalApi.setData({ id: order.value.id }).open();
}

async function loadData() {
  const id = Number(route.params.id);
  if (!id) {
    message.error('业务单编号无效');
    return;
  }
  loading.value = true;
  try {
    const [detail, fees, logs] = await Promise.all([
      getFreightOrder(id),
      getFreightOrderFeeList(id),
      getFreightOrderLogList(id),
    ]);
    order.value = detail;
    feeList.value = fees;
    logList.value = logs;
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <Page auto-content-height :title="pageTitle" :loading="loading">
    <FormModal @success="loadData" />
    <template #extra>
      <TableAction
        :actions="[
          {
            label: '返回',
            type: 'default',
            icon: 'lucide:arrow-left',
            onClick: handleBack,
          },
          {
            label: '编辑',
            type: 'primary',
            icon: ACTION_ICON.EDIT,
            auth: ['freight:order:update'],
            onClick: handleEdit,
          },
        ]"
      />
    </template>

    <a-card class="mb-4 overflow-hidden">
      <div class="mb-4 text-sm text-gray-500">
        当前状态：{{ currentStatusText }}
      </div>
      <div class="order-steps-grid">
        <div
          v-for="(item, index) in stepItems"
          :key="item.title"
          class="order-step-item"
          :class="`is-${getStepState(index)}`"
        >
          <div class="order-step-head">
            <span class="order-step-index">{{ index + 1 }}</span>
            <span class="order-step-line"></span>
          </div>
          <div class="order-step-title">{{ item.title }}</div>
          <div class="order-step-tip">{{ item.tip }}</div>
        </div>
      </div>
    </a-card>

    <a-card>
      <a-tabs>
        <a-tab-pane key="basic" tab="基础信息" force-render>
          <div class="label-value-grid">
            <div class="label-value-item">
              <div class="label-value-label">客户</div>
              <div class="label-value-value">
                {{ formatValue(order?.customerName) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">运输方式</div>
              <div class="label-value-value">{{ transportModeText }}</div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">业务类型</div>
              <div class="label-value-value">
                {{ formatValue(order?.bizType) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">贸易条款</div>
              <div class="label-value-value">
                {{ formatValue(order?.incoterms) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">POL 起运港</div>
              <div class="label-value-value">
                {{ formatValue(order?.originPort) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">POD 目的港</div>
              <div class="label-value-value">
                {{ formatValue(order?.destinationPort) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">联系人</div>
              <div class="label-value-value">
                {{ formatValue(order?.contactName) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">联系电话</div>
              <div class="label-value-value">
                {{ formatValue(order?.contactPhone) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">货物品名</div>
              <div class="label-value-value">
                {{ formatValue(order?.cargoName) }}
              </div>
            </div>
            <div class="label-value-item">
              <div class="label-value-label">箱型箱量</div>
              <div class="label-value-value">
                {{ formatValue(order?.containerInfo) }}
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="summary" tab="金额汇总" force-render>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a-card size="small">
              <a-statistic title="应收" :value="totalReceivable" />
            </a-card>
            <a-card size="small">
              <a-statistic title="应付" :value="totalPayable" />
            </a-card>
            <a-card size="small">
              <a-statistic title="利润" :value="totalProfit" />
            </a-card>
          </div>
        </a-tab-pane>

        <a-tab-pane key="transport" tab="单证与运输信息" force-render>
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Booking No. 订舱号">
              {{ formatValue(order?.bookingNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="SO No.">
              {{ formatValue(order?.soNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="B/L No. 提单号">
              {{ formatValue(order?.blNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="Customs No. 报关单号">
              {{ formatValue(order?.customsNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="Container No. 柜号">
              {{ formatValue(order?.containerNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="Seal No. 封条号">
              {{ formatValue(order?.sealNo) }}
            </a-descriptions-item>
            <a-descriptions-item label="ETD 预计离港">
              {{ formatDateTime(order?.etd) || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="ETA 预计到港">
              {{ formatDateTime(order?.eta) || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="ATD 实际离港">
              {{ formatDateTime(order?.atd) || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="ATA 实际到港">
              {{ formatDateTime(order?.ata) || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="POD 签收时间">
              {{ formatDateTime(order?.signTime) || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              {{ formatValue(order?.remark) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <a-tab-pane key="logs" tab="操作日志" force-render>
          <a-table
            :data-source="logList"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <a-table-column title="操作时间" width="180">
              <template #default="{ record }">
                {{ formatDateTime(record.createTime) || '-' }}
              </template>
            </a-table-column>
            <a-table-column title="动作" data-index="actionType" width="140" />
            <a-table-column
              title="操作人"
              data-index="operatorName"
              width="120"
            />
            <a-table-column title="状态流转" width="220">
              <template #default="{ record }">
                {{ record.fromStatus || '-' }} -> {{ record.toStatus || '-' }}
              </template>
            </a-table-column>
            <a-table-column title="说明" data-index="content" />
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="fees" tab="费用明细" force-render>
          <a-table
            :data-source="feeList"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <a-table-column title="类型" data-index="feeType" width="110" />
            <a-table-column title="费用名称" data-index="feeName" />
            <a-table-column title="币种" data-index="currency" width="110" />
            <a-table-column title="数量" data-index="quantity" width="90" />
            <a-table-column title="单价" data-index="unitPrice" width="120" />
            <a-table-column title="金额" data-index="amount" width="110" />
            <a-table-column title="备注" data-index="remark" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </Page>
</template>

<style scoped>
.order-steps-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.order-step-item {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 16px 16px 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.order-step-item.is-active {
  border-color: #1677ff;
  box-shadow: 0 8px 24px rgb(22 119 255 / 12%);
  transform: translateY(-1px);
}

.order-step-item.is-finished {
  border-color: #91caff;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
}

.order-step-item.is-error {
  border-color: #ff7875;
  background: linear-gradient(180deg, #fff1f0 0%, #ffffff 100%);
}

.order-step-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #d9d9d9;
  color: #8c8c8c;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.order-step-line {
  height: 2px;
  flex: 1;
  border-radius: 999px;
  background: #e5e7eb;
}

.order-step-title {
  margin-top: 10px;
  color: #262626;
  font-size: 14px;
  font-weight: 600;
}

.order-step-tip {
  margin-top: 6px;
  min-height: 40px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}

.label-value-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.label-value-item {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background: #fafafa;
  padding: 14px 16px;
}

.label-value-label {
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}

.label-value-value {
  margin-top: 6px;
  color: #262626;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.8;
  word-break: break-all;
}

.order-step-item.is-active .order-step-index {
  border-color: #1677ff;
  background: #1677ff;
  color: #fff;
}

.order-step-item.is-active .order-step-line {
  background: linear-gradient(90deg, #1677ff 0%, #69b1ff 100%);
}

.order-step-item.is-active .order-step-title {
  color: #1677ff;
}

.order-step-item.is-finished .order-step-index {
  border-color: #69b1ff;
  background: #e6f4ff;
  color: #1677ff;
}

.order-step-item.is-finished .order-step-line {
  background: #91caff;
}

.order-step-item.is-error .order-step-index {
  border-color: #ff7875;
  background: #ff7875;
  color: #fff;
}

.order-step-item.is-error .order-step-line {
  background: #ffccc7;
}

@media (max-width: 1440px) {
  .order-steps-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .order-steps-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .label-value-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
