<template>
  <a-card class="section-card" title="执行建议" :bordered="false">
    <a-empty v-if="!(items?.length)" description="暂无执行建议" />
    <a-space v-else direction="vertical" size="middle" style="width: 100%">
      <a-alert
        v-for="(item, index) in (items || [])"
        :key="index"
        :type="item.level"
        :message="item.title"
        :description="item.description"
        show-icon
      />
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import type { AdviceItem } from '@/types/loadCalculator';

defineProps<{ items?: AdviceItem[] }>();
</script>
