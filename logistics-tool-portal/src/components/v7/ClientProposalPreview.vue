<template>
  <a-card title="客户端方案单预览 V7" :bordered="false">
    <a-typography-paragraph>
      <pre class="proposal-preview">{{ markdown }}</pre>
    </a-typography-paragraph>
  </a-card>
</template>

<script setup lang="ts">
defineProps<{
  markdown: string;
}>();
</script>

<style scoped>
.proposal-preview {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: Consolas, 'Courier New', monospace;
}
</style>
