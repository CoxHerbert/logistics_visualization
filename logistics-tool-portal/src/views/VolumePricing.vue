<script setup lang="ts">
import { computed, reactive } from 'vue'

const pricing = reactive({
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  mode: '空运',
  unitPrice: 32
})

const volumeWeight = computed(() => (pricing.length * pricing.width * pricing.height) / 6000)
const billingWeight = computed(() => Math.max(volumeWeight.value, pricing.weight))
const estimatedCost = computed(() => billingWeight.value * pricing.unitPrice)
</script>

<template>
  <a-card title="输入货物体积计算价格">
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :xs="24" :md="6"><a-form-item label="长(cm)"><a-input-number v-model:value="pricing.length" :min="0" style="width:100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="宽(cm)"><a-input-number v-model:value="pricing.width" :min="0" style="width:100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="高(cm)"><a-input-number v-model:value="pricing.height" :min="0" style="width:100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="实重(kg)"><a-input-number v-model:value="pricing.weight" :min="0" style="width:100%" /></a-form-item></a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :xs="24" :md="6">
          <a-form-item label="运输方式">
            <a-select v-model:value="pricing.mode">
              <a-select-option value="空运">空运</a-select-option>
              <a-select-option value="快递">快递</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="单价(元/kg)">
            <a-input-number v-model:value="pricing.unitPrice" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-alert type="info" show-icon :message="`体积重：${volumeWeight.toFixed(2)} kg`" style="margin-bottom: 8px" />
    <a-alert type="info" show-icon :message="`计费重：${billingWeight.toFixed(2)} kg`" style="margin-bottom: 8px" />
    <a-alert type="success" show-icon :message="`预估运费：¥ ${estimatedCost.toFixed(2)}`" />
  </a-card>
</template>
