<template>
  <div class="layout-legend">
    <div
      v-for="item in legends"
      :key="item.skuId"
      class="legend-item"
    >
      <span class="swatch" :style="{ backgroundColor: item.color }"></span>
      <span class="name">{{ item.skuName }}</span>
      <a-tag v-if="item.zoneType === 'heavy'" color="orange">重货</a-tag>
      <a-tag v-else-if="item.zoneType === 'fragile'" color="red">易碎</a-tag>
      <a-tag v-else-if="item.zoneType === 'mixed'" color="blue">混装</a-tag>
      <span class="qty" v-if="item.quantity !== undefined">{{ item.quantity }} 箱</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LayoutSkuLegendItem } from '@/types/layout';

defineProps<{
  legends: LayoutSkuLegendItem[];
}>();
</script>

<style scoped>
.layout-legend {
  display: grid;
  gap: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.name {
  font-weight: 500;
}
.qty {
  color: #666;
  font-size: 12px;
}
</style>
