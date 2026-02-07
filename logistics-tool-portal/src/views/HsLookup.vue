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
  { hsCode: '84713000', product: '便携式自动数据处理设备', taxRate: '0% / 13%', regulation: '需规范申报品牌型号' },
  { hsCode: '94036099', product: '其他木制家具', taxRate: '5% / 13%', regulation: '部分国家需提供材质证明' },
  { hsCode: '42021290', product: '旅行箱包', taxRate: '10% / 13%', regulation: '关注目的国标签合规' }
]

const doSearch = () => {
  const key = keyword.value.trim()
  list.value = key
    ? mockList.filter((i) => i.product.includes(key) || i.hsCode.includes(key))
    : []
}
</script>

<template>
  <a-card title="HS 编码查询">
    <a-input-search
      v-model:value="keyword"
      placeholder="输入品名或 HS 编码，例如：家具 / 9403"
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
        { title: '税率参考', dataIndex: 'taxRate', key: 'taxRate' },
        { title: '监管要点', dataIndex: 'regulation', key: 'regulation' }
      ]"
    />
  </a-card>
</template>
