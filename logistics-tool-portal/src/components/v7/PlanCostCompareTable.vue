<template>
  <a-card title="方案成本对比 V7" :bordered="false">
    <a-table :data-source="plans" :pagination="false" row-key="planId" size="small">
      <a-table-column title="方案" key="plan">
        <template #default="{ record }">
          {{ renderContainers(record) }}
        </template>
      </a-table-column>
      <a-table-column title="总成本" key="totalCost">
        <template #default="{ record }">
          {{ currency }} {{ record.costBreakdown.totalCost.toFixed(2) }}
        </template>
      </a-table-column>
      <a-table-column title="单柜成本" key="costPerContainer">
        <template #default="{ record }">
          {{ currency }} {{ record.costPerContainer.toFixed(2) }}
        </template>
      </a-table-column>
      <a-table-column title="单件成本" key="costPerUnit">
        <template #default="{ record }">
          {{ currency }} {{ record.costPerUnit.toFixed(2) }}
        </template>
      </a-table-column>
      <a-table-column title="标签" key="pricingTag" data-index="pricingTag" />
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import type { CostedPlan } from '@/types/v7Costing';

defineProps<{
  plans: CostedPlan[];
  currency: string;
}>();

function renderContainers(plan: CostedPlan): string {
  return plan.containers.map((item) => `${item.count} x ${item.containerCode}`).join(' + ');
}
</script>
