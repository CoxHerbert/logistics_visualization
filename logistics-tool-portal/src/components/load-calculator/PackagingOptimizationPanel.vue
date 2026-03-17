<template>
  <a-card class="section-card" title="包装优化建议 V6" :bordered="false">
    <a-empty v-if="!data" description="暂无包装优化建议" />
    <a-space v-else direction="vertical" style="width: 100%" size="middle">
      <a-alert
        v-for="(advice, index) in data.globalAdvice"
        :key="`advice-${index}`"
        type="info"
        :message="advice"
        show-icon
      />

      <a-collapse>
        <a-collapse-panel
          v-for="sku in data.perSku"
          :key="sku.skuName"
          :header="`${sku.skuName}（Top ${sku.suggestions.length}）`"
        >
          <a-space direction="vertical" style="width: 100%">
            <OptimizationCompareCard
              v-for="item in sku.suggestions"
              :key="item.candidateId"
              :item="item"
            />
          </a-space>
        </a-collapse-panel>
      </a-collapse>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import type { PackagingOptimizationResult } from '@/types/packagingOptimization';
import OptimizationCompareCard from '@/components/load-calculator/OptimizationCompareCard.vue';

defineProps<{ data?: PackagingOptimizationResult }>();
</script>
