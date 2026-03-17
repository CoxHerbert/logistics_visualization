<template>
  <a-card class="section-card" title="现场操作清单" :bordered="false" v-if="items.length">
    <a-list size="small" :data-source="items" bordered>
      <template #renderItem="{ item, index }">
        <a-list-item>{{ index + 1 }}. {{ item }}</a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
defineProps<{ items: string[] }>();
</script>
