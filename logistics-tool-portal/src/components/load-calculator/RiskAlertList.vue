<template>
  <a-card class="section-card" title="风险提示" :bordered="false">
    <template v-if="messages.length">
      <a-alert
        v-for="(item, index) in messages"
        :key="index"
        :message="item"
        type="warning"
        show-icon
        style="margin-bottom: 10px"
      />
    </template>
    <a-empty v-else description="当前测算未发现明显风险" />
  </a-card>
</template>

<script lang="ts" setup>
defineProps<{
  messages: string[];
}>();
</script>
