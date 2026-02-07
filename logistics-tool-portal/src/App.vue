<script setup lang="ts">
import type { Component } from 'vue'

type ToolCard = {
  key: string
  name: string
  desc: string
  icon: string
  tag: string
}

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

const quickStats = [
  { label: '今日询价', value: '126' },
  { label: '在途票数', value: '384' },
  { label: '异常预警', value: '7' }
]

const iconMap = (name: string): Component => name as unknown as Component
</script>

<template>
  <a-layout class="portal-layout">
    <a-layout-header class="portal-header">
      <div class="title">国际货运代理 · 工具门户</div>
      <a-space>
        <a-input-search placeholder="搜索工具/航线/客户" style="width: 280px" />
        <a-button type="primary">新建任务</a-button>
      </a-space>
    </a-layout-header>

    <a-layout-content class="portal-content">
      <a-row :gutter="16" class="stats-row">
        <a-col v-for="item in quickStats" :key="item.label" :xs="24" :sm="8">
          <a-card>
            <a-statistic :title="item.label" :value="item.value" />
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
            <a-button type="link" style="padding-left: 0">立即进入</a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>
