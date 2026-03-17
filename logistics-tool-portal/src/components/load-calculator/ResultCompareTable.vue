<template>
  <a-card class="section-card" title="柜型对比" :bordered="false">
    <a-table :columns="columns" :data-source="results" :pagination="false" row-key="containerCode" size="middle" :scroll="{ x: 1160 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'containerName'">
          <a-space>
            <span>{{ record.containerName }}</span>
            <a-tag v-if="record.containerCode === recommendedCode" color="processing">推荐</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'canFit'">
          <a-tag :color="record.canFit ? 'success' : 'error'">{{ record.canFit ? '可装下' : '装不下' }}</a-tag>
        </template>
        <template v-else-if="column.key === 'volumeUsageRate' || column.key === 'weightUsageRate' || column.key === 'countUsageRate'">
          {{ formatPercent(record[column.key]) }}
        </template>
        <template v-else-if="column.key === 'riskLevel'">
          <a-tag :color="record.riskLevel === 'high' ? 'error' : record.riskLevel === 'medium' ? 'warning' : 'success'">
            {{ record.riskLevel === 'high' ? '高' : record.riskLevel === 'medium' ? '中' : '低' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'summaryLabel'">
          {{ record.summaryLabel || (record.calculationMethod === 'heuristic' ? '混装估算' : '规则计算') }}
        </template>
      </template>
    </a-table>
    <div class="table-note">
      V3 已加入门口预留空间、顶部余量、重量缓冲和业务场景策略，结果相比 V2 更偏执行落地。
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { ContainerCalculationResult, ContainerCode } from '@/types/loadCalculator';
import { formatPercent } from '@/utils/format';

defineProps<{
  results: ContainerCalculationResult[];
  recommendedCode?: ContainerCode;
}>();

const columns: TableColumnsType<ContainerCalculationResult> = [
  { title: '柜型', dataIndex: 'containerName', key: 'containerName', width: 150, fixed: 'left' },
  { title: '计算方式', dataIndex: 'summaryLabel', key: 'summaryLabel', width: 200 },
  { title: '最大件数', dataIndex: 'maxFitByCount', key: 'maxFitByCount', width: 120 },
  { title: '当前需求', dataIndex: 'requestedQuantity', key: 'requestedQuantity', width: 100 },
  { title: '是否装下', dataIndex: 'canFit', key: 'canFit', width: 110 },
  { title: '体积利用率', dataIndex: 'volumeUsageRate', key: 'volumeUsageRate', width: 120 },
  { title: '重量利用率', dataIndex: 'weightUsageRate', key: 'weightUsageRate', width: 120 },
  { title: '件数装载率', dataIndex: 'countUsageRate', key: 'countUsageRate', width: 120 },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100 },
  { title: '剩余重量(kg)', dataIndex: 'remainWeightKg', key: 'remainWeightKg', width: 120 },
];
</script>
