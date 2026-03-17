<template>
  <a-card class="section-card" title="本地测算记录" :bordered="false">
    <a-empty v-if="history.length === 0" description="暂无本地记录" />
    <a-list v-else :data-source="history" item-layout="horizontal">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-button type="link" @click="$emit('load', item.id)">载入</a-button>
            <a-button type="link" danger @click="$emit('delete', item.id)">删除</a-button>
          </template>
          <a-list-item-meta :title="item.title" :description="`${formatTime(item.createdAt)} · ${item.summary.mode === 'single' ? '单箱规' : '多 SKU'}`" />
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
import type { CalculationSnapshot } from '@/types/loadCalculator';

defineProps<{
  history: CalculationSnapshot[];
}>();

defineEmits<{
  (e: 'load', id: string): void;
  (e: 'delete', id: string): void;
}>();

function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', { hour12: false });
}
</script>
