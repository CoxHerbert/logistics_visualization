<template>
  <a-card class="section-card" title="柜型选择" :bordered="false">
    <a-checkbox-group :value="modelValue" @update:value="handleChange" style="width: 100%">
      <a-row :gutter="12">
        <a-col v-for="item in specs" :key="item.code" :span="24">
          <div style="border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px 16px;">
            <a-checkbox :value="item.code">
              <span style="font-weight: 600; margin-right: 8px">{{ item.name }}</span>
              <span style="color: #667085; font-size: 12px">
                {{ item.innerLengthCm }} × {{ item.innerWidthCm }} × {{ item.innerHeightCm }} cm / {{ item.volumeM3 }} m³
              </span>
            </a-checkbox>
          </div>
        </a-col>
      </a-row>
    </a-checkbox-group>
    <div class="table-note">默认全选，推荐至少保留 20GP / 40GP / 40HQ 三种柜型对比。</div>
  </a-card>
</template>

<script lang="ts" setup>
import { CONTAINER_SPECS } from '@/constants/containerSpecs';
import type { ContainerCode } from '@/types/loadCalculator';

interface Props {
  modelValue: ContainerCode[];
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: ContainerCode[]): void;
}>();

const specs = CONTAINER_SPECS;

function handleChange(value: ContainerCode[]) {
  emit('update:modelValue', value.length ? value : ['20GP']);
}
</script>
