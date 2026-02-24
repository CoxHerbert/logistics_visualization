<script setup lang="ts">
import { RouterLink } from 'vue-router'

const toolLinks = [
  {
    key: 'line-query',
    title: '航线查询',
    description: '查看船名航次外链入口，并结合整箱（FCL）费用进行快速参考。',
    to: '/line-query'
  },
  {
    key: 'volume-pricing',
    title: '体积计价',
    description: '按体积/重量计算拼箱参考费用，快速判断运输方案成本区间。',
    to: '/volume-pricing'
  }
]
</script>

<template>
  <a-card title="工具中心" class="tool-center-card">
    <a-typography-paragraph>
      请选择需要使用的工具子类目：
    </a-typography-paragraph>

    <a-row :gutter="12">
      <a-col v-for="item in toolLinks" :key="item.key" :xs="24" :md="12">
        <a-card size="small" :title="item.title" class="tool-item-card">
          <a-typography-paragraph>{{ item.description }}</a-typography-paragraph>
          <RouterLink :to="item.to">
            <a-button type="primary">进入 {{ item.title }}</a-button>
          </RouterLink>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped>
.tool-center-card {
  margin-top: 16px;
}

.tool-item-card {
  height: 100%;
}
</style>
