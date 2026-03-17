<template>
  <a-card class="section-card" title="SKU 明细拆分" :bordered="false" v-if="items.length">
    <a-table :data-source="items" :pagination="false" size="small" row-key="skuName">
      <a-table-column title="SKU" data-index="skuName" key="skuName" />
      <a-table-column title="数量" data-index="quantity" key="quantity" />
      <a-table-column title="体积(m³)" key="volumeM3">
        <template #default="{ record }">{{ record.volumeM3.toFixed(2) }}</template>
      </a-table-column>
      <a-table-column title="重量(kg)" key="weightKg">
        <template #default="{ record }">{{ record.weightKg.toFixed(1) }}</template>
      </a-table-column>
      <a-table-column title="堆叠" data-index="stackLimitLabel" key="stackLimitLabel" />
      <a-table-column title="尺寸可行" key="dimensionFit">
        <template #default="{ record }"><a-tag :color="record.dimensionFit ? 'green' : 'red'">{{ record.dimensionFit ? '可行' : '超限' }}</a-tag></template>
      </a-table-column>
      <a-table-column title="柜门可过" key="doorPass">
        <template #default="{ record }"><a-tag :color="record.doorPass ? 'blue' : 'red'">{{ record.doorPass ? '可过' : '卡门风险' }}</a-tag></template>
      </a-table-column>
      <a-table-column title="易碎" key="fragile">
        <template #default="{ record }">{{ record.fragile ? '是' : '否' }}</template>
      </a-table-column>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import type { SkuBreakdownItem } from '@/types/loadCalculator';
defineProps<{ items: SkuBreakdownItem[] }>();
</script>
