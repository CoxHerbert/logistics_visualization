<script setup lang="ts">
import { ref } from 'vue'

type HsItem = {
  hsCode: string
  product: string
  taxRate: string
  regulation: string
}

const keyword = ref('')
const list = ref<HsItem[]>([])

const mockList: HsItem[] = [
  { hsCode: '84713000', product: '笔记本电脑（Laptop）', taxRate: '美国参考税率 0%', regulation: '关注 FCC 合规与 UL 认证资料' },
  { hsCode: '85044099', product: '电源适配器（Power Adapter）', taxRate: '美国参考税率 3.9%', regulation: '需关注 FCC/DOE 能效及标签要求' },
  { hsCode: '95030000', product: '塑料玩具（Toys）', taxRate: '美国参考税率 0-6.8%', regulation: '需满足 CPSIA/ASTM F963 要求' }
]

const doSearch = () => {
  const key = keyword.value.trim()
  list.value = key
    ? mockList.filter((i) => i.product.includes(key) || i.hsCode.includes(key))
    : []
}
</script>

<template>
  <a-card title="中美线 HS 编码查询（美国进口参考）">
    <a-input-search
      v-model:value="keyword"
      placeholder="输入品名或 HS 编码，例如：Laptop / 8471"
      enter-button="查询"
      @search="doSearch"
    />

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
  </a-card>
</template>
