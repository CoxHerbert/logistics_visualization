<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { message } from 'ant-design-vue'

import { checkSensitiveTool, type ToolCalcResp } from '@/api/portal'

type HsItem = {
  hsCode: string
  product: string
  taxRate: string
  regulation: string
}

const keyword = ref('')
const list = ref<HsItem[]>([])
const loading = ref(false)
const sensitiveResult = ref<ToolCalcResp>()

const mockList: HsItem[] = [
  { hsCode: '84713000', product: '笔记本电脑（Laptop）', taxRate: '美国参考税率 0%', regulation: '关注 FCC 合规与 UL 认证资料' },
  { hsCode: '85044099', product: '电源适配器（Power Adapter）', taxRate: '美国参考税率 3.9%', regulation: '需关注 FCC/DOE 能效及标签要求' },
  { hsCode: '95030000', product: '塑料玩具（Toys）', taxRate: '美国参考税率 0-6.8%', regulation: '需满足 CPSIA/ASTM F963 要求' }
]

const doSearch = async () => {
  const key = keyword.value.trim()
  list.value = key
    ? mockList.filter((i) => i.product.includes(key) || i.hsCode.includes(key))
    : []

  if (!key) {
    sensitiveResult.value = undefined
    return
  }

  loading.value = true
  try {
    sensitiveResult.value = await checkSensitiveTool({
      cargoDesc: key
    })
  } catch (error: any) {
    message.error(error?.message || '敏感品检测失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const leadQuery = computed(() => ({
  origin: '上海',
  destination: '洛杉矶',
  shipMode: 20,
  cargoType: 10,
  remark: `来源工具：HS 查询；关键词：${keyword.value || '未填写'}；敏感词匹配数：${sensitiveResult.value?.costBreakdown?.[0]?.amount ?? 0}。`
}))
</script>

<template>
  <a-card title="中美线 HS 编码查询（美国进口参考）">
    <a-input-search
      v-model:value="keyword"
      placeholder="输入品名或 HS 编码，例如：Laptop / 8471"
      enter-button="查询"
      :loading="loading"
      @search="doSearch"
    />

    <div style="margin-top: 12px">
      <RouterLink :to="{ path: '/get-plan', query: leadQuery }">
        <a-button type="primary">按当前查询获取运输方案</a-button>
      </RouterLink>
    </div>

    <a-table
      style="margin-top: 16px"
      :pagination="false"
      :data-source="list"
      row-key="hsCode"
      :columns="[
        { title: 'HS 编码', dataIndex: 'hsCode', key: 'hsCode' },
        { title: '商品名称', dataIndex: 'product', key: 'product' },
        { title: '美国税率参考', dataIndex: 'taxRate', key: 'taxRate' },
        { title: '合规要点', dataIndex: 'regulation', key: 'regulation' }
      ]"
    />

    <a-card v-if="sensitiveResult" style="margin-top: 16px" size="small" title="敏感品检测结果">
      <a-table
        :pagination="false"
        :data-source="sensitiveResult.costBreakdown"
        row-key="name"
        :columns="[
          { title: '检测项', dataIndex: 'name', key: 'name' },
          { title: '结果值', dataIndex: 'amount', key: 'amount' }
        ]"
      />
      <a-alert
        style="margin-top: 12px"
        type="info"
        show-icon
        :message="`总计：${sensitiveResult.total}`"
      />
      <a-typography-paragraph v-for="note in sensitiveResult.notes" :key="note" style="margin-bottom: 0">
        · {{ note }}
      </a-typography-paragraph>
    </a-card>
  </a-card>
</template>
