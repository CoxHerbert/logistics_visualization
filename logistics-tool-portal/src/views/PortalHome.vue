<template>
  <section class="hero-section">
    <a-row :gutter="24" align="middle">
      <a-col :xs="24" :lg="13">
        <h1>国际货运代理官网门户</h1>
        <p>
          覆盖海运、空运、铁路与多式联运，提供订舱、报关、仓储、拖车、保险等全链路物流解决方案。
        </p>
        <a-space>
          <a-button type="primary" size="large">立即询价</a-button>
          <a-button size="large">联系我们</a-button>
        </a-space>
        <a-row :gutter="12" class="hero-tags">
          <a-col v-for="tag in strengths" :key="tag"><a-tag color="blue">{{ tag }}</a-tag></a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :lg="11">
        <img class="hero-image" src="/images/hero-freight.svg" alt="国际货运代理官网主视觉" />
      </a-col>
    </a-row>
  </section>

  <section class="overview-section">
    <a-row :gutter="16">
      <a-col :xs="24" :md="8" v-for="item in portalStore.stats" :key="item.label">
        <a-card>
          <a-statistic :title="item.label" :value="item.value" :loading="portalStore.loading" />
        </a-card>
      </a-col>
    </a-row>
  </section>

  <section>
    <h2 class="section-title">核心服务</h2>
    <a-row :gutter="16">
      <a-col v-for="service in services" :key="service.title" :xs="24" :sm="12" :lg="6">
        <a-card hoverable class="service-card">
          <template #title>
            <a-space>
              <component :is="service.icon" />
              <span>{{ service.title }}</span>
            </a-space>
          </template>
          <p>{{ service.desc }}</p>
        </a-card>
      </a-col>
    </a-row>
  </section>

  <section class="tools-banner-wrapper">
    <img src="/images/tools-banner.svg" alt="货代工具功能横幅" class="tools-banner" />
  </section>

  <section>
    <h2 class="section-title">优势航线</h2>
    <a-table :pagination="false" :data-source="hotRoutes" :columns="columns" row-key="route" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  GlobalOutlined,
  RocketOutlined,
  SafetyOutlined,
  ReconciliationOutlined
} from '@ant-design/icons-vue'
import { usePortalStore } from '@/stores/portal'

const portalStore = usePortalStore()

const strengths = ['全球代理网络', '7×24 客服响应', '节点可视化追踪', '专业关务支持']

const services = [
  { title: '海运整箱/拼箱', desc: '主力港口周班服务，覆盖欧美、东南亚、中东、非洲。', icon: GlobalOutlined },
  { title: '空运时效专线', desc: '核心机场直飞/中转资源，支持门到门时效保障。', icon: RocketOutlined },
  { title: '合规与保险', desc: '报关清关、贸易合规审单、货运险与责任险支持。', icon: SafetyOutlined },
  { title: '供应链可视化', desc: '节点跟踪、异常预警、账单对账统一管理。', icon: ReconciliationOutlined }
]

const hotRoutes = [
  { route: '上海 → 洛杉矶', transit: '14-18 天', mode: '海运快船', frequency: '每周 3 班' },
  { route: '深圳 → 鹿特丹', transit: '25-30 天', mode: '海运普船', frequency: '每周 2 班' },
  { route: '香港 → 法兰克福', transit: '3-5 天', mode: '空运直飞', frequency: '每日舱位' }
]

const columns = [
  { title: '热门航线', dataIndex: 'route', key: 'route' },
  { title: '运输方式', dataIndex: 'mode', key: 'mode' },
  { title: '参考时效', dataIndex: 'transit', key: 'transit' },
  { title: '班次', dataIndex: 'frequency', key: 'frequency' }
]

onMounted(async () => {
  await portalStore.refreshStats()
})
</script>
