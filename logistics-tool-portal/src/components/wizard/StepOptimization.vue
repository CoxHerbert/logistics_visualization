<template>
  <a-card title="Step 4 · 优化建议" :bordered="false">
    <a-empty v-if="!suggestions.length" description="暂无优化建议" />
    <a-space v-else direction="vertical" style="width:100%">
      <a-card v-for="item in suggestions" :key="item.id" size="small">
        <template #title>{{ item.title }}</template>
        <p>{{ item.description }}</p>
        <a-tag>{{ item.level }}</a-tag>
        <a-tag v-if="item.impact">{{ item.impact }}</a-tag>
      </a-card>
    </a-space>

    <template #actions>
      <div style="display:flex;justify-content:space-between;width:100%">
        <a-button @click="emit('prev')">返回结果</a-button>
        <a-space>
          <a-button @click="emit('restart')">重新开始</a-button>
          <a-button type="primary" @click="emit('export')">导出方案</a-button>
        </a-space>
      </div>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import type { OptimizationSuggestion } from '@/types/containerWizard';

defineProps<{ suggestions: OptimizationSuggestion[] }>();
const emit = defineEmits<{ (e: 'prev'): void; (e: 'restart'): void; (e: 'export'): void }>();
</script>
