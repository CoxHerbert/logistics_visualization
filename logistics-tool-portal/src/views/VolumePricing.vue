<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { message } from 'ant-design-vue'

import { calcLclTool, type ToolCalcResp } from '@/api/portal'

const pricing = reactive({
  origin: '上海',
  destination: '洛杉矶',
  length: 60,
  width: 40,
  height: 35,
  weight: 22,
  mode: '空运'
})

const loading = ref(false)
const toolResult = ref<ToolCalcResp>()

const volumeCbm = computed(() => (pricing.length * pricing.width * pricing.height) / 1_000_000)

const leadQuery = computed(() => ({
  origin: pricing.origin,
  destination: pricing.destination,
  shipMode: pricing.mode === '空运' ? 10 : 20,
  cargoType: 10,
  remark: `来源工具：体积计价；体积：${volumeCbm.value.toFixed(3)} CBM；重量：${pricing.weight.toFixed(2)} kg；预估总费用：${toolResult.value?.total ?? '-'}。`
}))

const queryPricing = async () => {
  if (volumeCbm.value <= 0 || pricing.weight <= 0) {
    message.warning('请填写有效体积和重量')
    return
  }
  loading.value = true
  try {
    toolResult.value = await calcLclTool({
      origin: pricing.origin,
      destination: pricing.destination,
      volumeCbm: Number(volumeCbm.value.toFixed(3)),
      weightKg: pricing.weight
    })
  } catch (error: any) {
    message.error(error?.message || '计价失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

queryPricing()
</script>

<template>
  <a-card title="中美线体积计价（LCL 参考）">
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :xs="24" :md="6">
          <a-form-item label="起运地">
            <a-input v-model:value="pricing.origin" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="目的地">
            <a-input v-model:value="pricing.destination" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="运输方式">
            <a-select v-model:value="pricing.mode">
              <a-select-option value="空运">空运</a-select-option>
              <a-select-option value="海运">海运</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="24" :md="6"><a-form-item label="长(cm)"><a-input-number v-model:value="pricing.length" :min="0" style="width: 100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="宽(cm)"><a-input-number v-model:value="pricing.width" :min="0" style="width: 100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="高(cm)"><a-input-number v-model:value="pricing.height" :min="0" style="width: 100%" /></a-form-item></a-col>
        <a-col :xs="24" :md="6"><a-form-item label="实重(kg)"><a-input-number v-model:value="pricing.weight" :min="0" style="width: 100%" /></a-form-item></a-col>
      </a-row>

      <a-space>
        <a-button type="primary" :loading="loading" @click="queryPricing">开始计价</a-button>
        <RouterLink :to="{ path: '/get-plan', query: leadQuery }">
          <a-button>根据结果获取方案</a-button>
        </RouterLink>
      </a-space>
    </a-form>

    <a-alert style="margin-top: 16px" type="info" show-icon :message="`体积：${volumeCbm.toFixed(3)} CBM`" />

    <a-card v-if="toolResult" style="margin-top: 16px" size="small" title="工具计算结果">
      <a-table
        :pagination="false"
        :data-source="toolResult.costBreakdown"
        row-key="name"
        :columns="[
          { title: '费用项', dataIndex: 'name', key: 'name' },
          { title: '金额', dataIndex: 'amount', key: 'amount' }
        ]"
      />
      <a-alert
        style="margin-top: 12px"
        type="success"
        show-icon
        :message="`合计：${toolResult.total}`"
      />
      <a-typography-paragraph v-for="note in toolResult.notes" :key="note" style="margin-bottom: 0">
        · {{ note }}
      </a-typography-paragraph>
    </a-card>
  </a-card>
</template>
