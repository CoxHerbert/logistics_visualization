<template>
  <a-card class="section-card" :bordered="false" title="推荐结果 V4">
    <template v-if="result">
      <a-space direction="vertical" size="middle" style="width: 100%">
        <a-alert :type="result.canFit ? 'success' : 'warning'" :message="result.canFit ? `推荐柜型：${result.containerName}` : `当前推荐为最接近方案：${result.containerName}`" show-icon />
        <a-row :gutter="12">
          <a-col :span="8"><div class="metric-card"><div class="metric-label">理论可装</div><div class="metric-value">{{ result.maxFitByCount }}</div></div></a-col>
          <a-col :span="8"><div class="metric-card"><div class="metric-label">体积利用率</div><div class="metric-value">{{ toPercent(result.volumeUsageRate) }}</div></div></a-col>
          <a-col :span="8"><div class="metric-card"><div class="metric-label">重量利用率</div><div class="metric-value">{{ toPercent(result.weightUsageRate) }}</div></div></a-col>
        </a-row>
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="推荐方向">{{ result.bestOrientation.label }}</a-descriptions-item>
          <a-descriptions-item label="计算方式">{{ result.calculationMethod === 'rule' ? '规则测算' : '混装估算' }}</a-descriptions-item>
          <a-descriptions-item label="柜门校验">{{ result.doorCheck?.checked ? (result.doorCheck.canPassDoor ? '通过' : '未通过') : '未启用' }}</a-descriptions-item>
          <a-descriptions-item label="风险等级">{{ riskText[result.riskLevel] }}</a-descriptions-item>
          <a-descriptions-item label="装柜摘要">{{ result.summaryLabel || '-' }}</a-descriptions-item>
          <a-descriptions-item label="拆柜建议">{{ result.splitPlan?.sameContainerLabel || '当前单柜可承载' }}</a-descriptions-item>
        </a-descriptions>
        <a-alert v-if="result.weightDistribution" type="info" show-icon :message="`配重建议：前段 ${(result.weightDistribution.frontRatio * 100).toFixed(0)}% / 后段 ${(result.weightDistribution.rearRatio * 100).toFixed(0)}%`" :description="result.weightDistribution.note" />
      </a-space>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import type { ContainerCalculationResult } from '@/types/loadCalculator';

defineProps<{ result?: ContainerCalculationResult }>();

const riskText = {
  low: '低',
  medium: '中',
  high: '高',
};

function toPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
</script>
