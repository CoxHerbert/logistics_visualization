<script setup lang="ts">
import type { Component } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePortalStore } from '@/stores/portal'

type ToolCard = {
  key: string
  name: string
  desc: string
  icon: string
  tag: string
}

const router = useRouter()
const portalStore = usePortalStore()

const toolCards: ToolCard[] = [
  {
    key: 'quote',
    name: '运价速查',
    desc: '整合海运/空运最新报价，支持按港口、航司和时效快速筛选。',
    icon: 'DollarOutlined',
    tag: '报价'
  },
  {
    key: 'track',
    name: '货物追踪',
    desc: '输入提单号即可查看节点状态，自动高亮异常节点并提醒处理。',
    icon: 'EnvironmentOutlined',
    tag: '追踪'
  },
  {
    key: 'calc',
    name: '费用计算器',
    desc: '支持体积重、附加费与汇率换算，一键导出费用明细。',
    icon: 'CalculatorOutlined',
    tag: '结算'
  },
  {
    key: 'doc',
    name: '单证助手',
    desc: '提供常用单证模板和校验规则，减少报关与清关错误。',
    icon: 'FileTextOutlined',
    tag: '单证'
  }
]

const iconMap = (name: string): Component => name as unknown as Component

onMounted(async () => {
  await portalStore.refreshStats()
})
</script>

<template>
  <a-row :gutter="16" class="stats-row">
    <a-col v-for="item in portalStore.stats" :key="item.label" :xs="24" :sm="8">
      <a-card>
        <a-statistic :title="item.label" :value="item.value" :loading="portalStore.loading" />
      </a-card>
    </a-col>
  </a-row>

  <a-row :gutter="16">
    <a-col v-for="tool in toolCards" :key="tool.key" :xs="24" :sm="12" :lg="6">
      <a-card hoverable class="tool-card">
        <template #title>
          <a-space>
            <component :is="iconMap(tool.icon)" />
            <span>{{ tool.name }}</span>
          </a-space>
        </template>
        <template #extra>
          <a-tag color="blue">{{ tool.tag }}</a-tag>
        </template>
        <p>{{ tool.desc }}</p>
        <a-button type="link" style="padding-left: 0" @click="router.push('/tools')">立即进入</a-button>
      </a-card>
    </a-col>
  </a-row>
</template>
