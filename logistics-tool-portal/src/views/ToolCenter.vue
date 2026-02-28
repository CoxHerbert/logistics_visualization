<template>
  <section class="tool-center-page">
    <a-card title="工具中心" :bordered="false">
      <a-alert
        type="info"
        show-icon
        message="已启用二级分类导航"
        description="请先选择工具分类，再进入具体工具。"
        class="tool-hint"
      />

      <a-collapse :default-active-key="['price-calculator']" accordion>
        <a-collapse-panel key="price-calculator" header="报价计算器">
          <a-list item-layout="horizontal" :data-source="toolItems">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.description" />
                <template #actions>
                  <RouterLink :to="item.path">
                    <a-button type="primary" size="small">进入</a-button>
                  </RouterLink>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface ToolItem {
  title: string
  description: string
  path: string
}

const toolItems: ToolItem[] = [
  {
    title: 'FBA头程价格计算',
    description: '根据运输方式与基础参数，快速查看 FBA 头程报价结果。',
    path: '/tool-center/fba-first-leg-calculator'
  }
]
</script>

<style scoped>
.tool-center-page {
  max-width: 1080px;
  margin: 0 auto;
}

.tool-hint {
  margin-bottom: 16px;
}
</style>
