<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import { createFreightLead, type FreightLeadCreateReq } from '@/api/portal'

const route = useRoute()

const formState = reactive<FreightLeadCreateReq>({
  contactName: (route.query.contactName as string) || '',
  contactPhone: (route.query.contactPhone as string) || '',
  departureCity: (route.query.departureCity as string) || (route.query.origin as string) || '',
  destinationCity: (route.query.destinationCity as string) || (route.query.destination as string) || '',
  shipMode: Number(route.query.shipMode || 10),
  cargoType: Number(route.query.cargoType || 10),
  remark: (route.query.remark as string) || ''
})

const shipModeOptions = [
  { label: '快递', value: 10 },
  { label: '零担', value: 20 },
  { label: '整车', value: 30 }
]

const cargoTypeOptions = [
  { label: '普货', value: 10 },
  { label: '易碎', value: 20 },
  { label: '冷链', value: 30 }
]

const handleSubmit = async () => {
  console.log('formState')
  try {
    const leadId = await createFreightLead(formState)
    message.success(`提交成功，线索编号：${leadId}`)
  } catch (error: any) {
    message.error(error?.message || '提交失败，请稍后重试')
  }
}
</script>

<template>
  <a-card title="获取运输方案 / 留资" class="get-plan-card">
    <a-alert type="info" show-icon style="margin-bottom: 16px" message="提交后将由顾问回访，提供中美线运输与清关方案。" />

    <a-form layout="vertical" @finish="handleSubmit">
      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="联系人" name="contactName">
            <a-input v-model:value="formState.contactName" placeholder="请输入联系人" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="联系电话" name="contactPhone">
            <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="出发地">
            <a-input v-model:value="formState.departureCity" placeholder="如：上海" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="目的地">
            <a-input v-model:value="formState.destinationCity" placeholder="如：洛杉矶" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="运输方式">
            <a-select v-model:value="formState.shipMode" :options="shipModeOptions" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="货物类型">
            <a-select v-model:value="formState.cargoType" :options="cargoTypeOptions" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="补充说明">
        <a-textarea v-model:value="formState.remark" :rows="4" placeholder="可填写货物品类、重量体积、预计发运时间等" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">提交并获取方案</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style scoped>
.get-plan-card {
  margin-top: 8px;
}
</style>
