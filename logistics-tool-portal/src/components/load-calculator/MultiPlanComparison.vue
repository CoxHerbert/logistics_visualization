<template>
  <a-card class="section-card" title="多柜方案对比 V5" :bordered="false">
    <a-empty v-if="!(plans?.length)" description="暂无多柜方案" />
    <a-list v-else :data-source="plans" item-layout="vertical">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space wrap>
            <a-tag color="blue">{{ item.summary }}</a-tag>
            <a-tag :color="item.canFit ? 'green' : 'red'">{{ item.canFit ? '可装下' : '需拆分' }}</a-tag>
            <a-tag :color="riskColor(item.riskLevel)">风险: {{ item.riskLevel }}</a-tag>
            <a-tag v-if="item.recommendationTag" color="gold">{{ item.recommendationTag }}</a-tag>
          </a-space>
          <div class="table-note">
            体积利用率 {{ toPercent(item.volumeUsageRate) }}，重量利用率 {{ toPercent(item.weightUsageRate) }}，
            未装载件数 {{ item.unplacedQuantity }}，评分 {{ item.score }}
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
import type { MultiContainerPlan, RiskLevel } from '@/types/loadCalculator';

defineProps<{ plans?: MultiContainerPlan[] }>();

function toPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function riskColor(level: RiskLevel) {
  if (level === 'high') return 'red';
  if (level === 'medium') return 'orange';
  return 'green';
}
</script>
