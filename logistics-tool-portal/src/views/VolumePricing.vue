<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'

const pricing = reactive({
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  mode: '空运',
  unitPrice: 5.5,
  fuelRate: 0.12
})

const volumeWeight = computed(() => (pricing.length * pricing.width * pricing.height) / 6000)
const billingWeight = computed(() => Math.max(volumeWeight.value, pricing.weight))
const baseCost = computed(() => billingWeight.value * pricing.unitPrice)
const estimatedCost = computed(() => baseCost.value * (1 + pricing.fuelRate))
const leadQuery = computed(() => ({
  origin: '上海',
  destination: '洛杉矶',
  shipMode: pricing.mode === '空运' ? 10 : 20,
  cargoType: 10,
  remark: `来源工具：体积计价；体积重：${volumeWeight.value.toFixed(2)}kg；计费重：${billingWeight.value.toFixed(2)}kg；预估费用：USD ${estimatedCost.value.toFixed(2)}`
}))

</script>

<template>
  <a-card title="中美线体积计价（空运/快递）">
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
          <a-form-item label="单价(USD/kg)">
            <a-input-number v-model:value="pricing.unitPrice" :min="0" :step="0.1" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="燃油附加比例">
            <a-input-number v-model:value="pricing.fuelRate" :min="0" :max="1" :step="0.01" style="width:100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-alert type="info" show-icon :message="`体积重：${volumeWeight.toFixed(2)} kg（中美线常用除数 6000）`" style="margin-bottom: 8px" />
    <a-alert type="info" show-icon :message="`计费重：${billingWeight.toFixed(2)} kg`" style="margin-bottom: 8px" />
    <a-alert type="info" show-icon :message="`基础运费：USD ${baseCost.toFixed(2)}`" style="margin-bottom: 8px" />
    <a-alert type="success" show-icon :message="`预估总运费（含燃油）：USD ${estimatedCost.toFixed(2)}`" />

    <div style="margin-top: 16px">
      <RouterLink :to="{ path: '/get-plan', query: leadQuery }">
        <a-button type="primary">按当前计价参数获取方案</a-button>
      </RouterLink>
    </div>
  </a-card>
</template>
