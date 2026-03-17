<template>
  <a-card class="section-card" title="拆柜建议" :bordered="false" v-if="plan">
    <a-space direction="vertical" size="small" style="width: 100%">
      <a-alert type="warning" show-icon :message="`建议方案：${plan.sameContainerLabel}`" />
      <a-list size="small" bordered :data-source="plan.lines">
        <template #renderItem="{ item }">
          <a-list-item>{{ item }}</a-list-item>
        </template>
      </a-list>
      <a-row :gutter="12">
        <a-col :span="8"><div class="metric-card"><div class="metric-label">按体积</div><div class="metric-value">{{ plan.byVolume }}</div></div></a-col>
        <a-col :span="8"><div class="metric-card"><div class="metric-label">按重量</div><div class="metric-value">{{ plan.byWeight }}</div></div></a-col>
        <a-col :span="8"><div class="metric-card"><div class="metric-label">按件数</div><div class="metric-value">{{ plan.byCount }}</div></div></a-col>
      </a-row>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import type { SplitPlanSuggestion } from '@/types/loadCalculator';
defineProps<{ plan?: SplitPlanSuggestion }>();
</script>
