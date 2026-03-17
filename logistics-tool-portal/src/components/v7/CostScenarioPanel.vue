<template>
  <a-card title="成本参数设置 V7" :bordered="false">
    <a-form layout="vertical">
      <a-row :gutter="12">
        <a-col :span="8">
          <a-form-item label="币种">
            <a-input v-model:value="localValue.currency" placeholder="USD" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="20GP 海运费">
            <a-input-number v-model:value="localValue.oceanFreightByContainer['20GP']" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="40GP 海运费">
            <a-input-number v-model:value="localValue.oceanFreightByContainer['40GP']" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12">
        <a-col :span="8">
          <a-form-item label="40HQ 海运费">
            <a-input-number v-model:value="localValue.oceanFreightByContainer['40HQ']" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="拖车费/柜">
            <a-input-number v-model:value="localValue.truckingPerContainer" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="报关费/票">
            <a-input-number v-model:value="localValue.customsPerShipment" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12">
        <a-col :span="8">
          <a-form-item label="文件费/票">
            <a-input-number v-model:value="localValue.docsPerShipment" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="港杂/柜">
            <a-input-number v-model:value="localValue.thcPerContainer" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="缓冲预留">
            <a-input-number v-model:value="localValue.bufferFee" style="width: 100%" :min="0" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { CostScenarioInput } from '@/types/v7Costing';

const props = defineProps<{
  modelValue: CostScenarioInput;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CostScenarioInput): void;
}>();

const localValue = reactive<CostScenarioInput>({
  ...props.modelValue,
  oceanFreightByContainer: { ...props.modelValue.oceanFreightByContainer },
});

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(localValue, value);
    localValue.oceanFreightByContainer = { ...value.oceanFreightByContainer };
  },
  { deep: true },
);

watch(
  () => localValue,
  () => {
    emit('update:modelValue', {
      ...localValue,
      oceanFreightByContainer: { ...localValue.oceanFreightByContainer },
    });
  },
  { deep: true },
);
</script>
