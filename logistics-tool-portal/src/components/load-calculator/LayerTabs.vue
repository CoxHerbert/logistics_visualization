<template>
  <div class="layer-tabs">
    <a-segmented
      :value="modelValue"
      :options="options"
      @change="handleChange"
      block
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
  totalLayers: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const options = computed(() =>
  Array.from({ length: props.totalLayers }, (_, index) => ({
    label: `Layer ${index + 1}`,
    value: index + 1,
  })),
);

function handleChange(value: number | string) {
  emit('update:modelValue', Number(value));
}
</script>

<style scoped>
.layer-tabs {
  margin-bottom: 12px;
}
</style>
