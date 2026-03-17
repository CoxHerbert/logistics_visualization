<template>
  <a-card size="small" class="section-card">
    <template #title>
      <a-space wrap>
        <span>{{ item.title }}</span>
        <a-tag :color="tagColor(item.recommendationTag)">{{ item.recommendationTag }}</a-tag>
      </a-space>
    </template>
    <a-space direction="vertical" style="width: 100%">
      <div>{{ item.description }}</div>
      <div class="table-note">{{ item.gainSummary }}</div>
      <div class="table-note">
        柜数变化: {{ item.beforeSummary.totalContainerCount }} -> {{ item.afterSummary.totalContainerCount }}，
        体积利用率变化: {{ toPercent(item.estimatedVolumeUsageDelta) }}，
        重量利用率变化: {{ toPercent(item.estimatedWeightUsageDelta) }}
      </div>
      <div class="table-note">收益评分: {{ item.benefitScore.toFixed(1) }}</div>
      <a-alert
        v-for="(risk, index) in item.riskMessages"
        :key="`${item.candidateId}-${index}`"
        type="warning"
        :message="risk"
        show-icon
      />
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import type { PackagingOptimizationEvaluation } from '@/types/packagingOptimization';

defineProps<{ item: PackagingOptimizationEvaluation }>();

function toPercent(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
}

function tagColor(tag: PackagingOptimizationEvaluation['recommendationTag']) {
  if (tag === '推荐') return 'green';
  if (tag === '可尝试') return 'blue';
  return 'orange';
}
</script>
