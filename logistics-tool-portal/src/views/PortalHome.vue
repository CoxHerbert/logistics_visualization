<template>
  <section class="hero-section">
    <a-row :gutter="24" align="middle">
      <a-col :xs="24" :lg="13">
        <h1>中美线国际货运代理</h1>
        <p>
          聚焦中国至美国海运与空运专线，提供订舱、报关、清关、尾程派送与保险服务，适配跨境电商与一般贸易场景。
        </p>
        <a-space>
          <RouterLink to="/get-plan?origin=上海&destination=洛杉矶&shipMode=20&cargoType=10">
            <a-button type="primary" size="large">获取中美报价</a-button>
          </RouterLink>
          <RouterLink to="/get-plan?origin=上海&destination=纽约&shipMode=10&cargoType=10&remark=咨询清关方案">
            <a-button size="large">咨询清关方案</a-button>
          </RouterLink>
        </a-space>
        <a-row :gutter="12" class="hero-tags">
          <a-col v-for="tag in strengths" :key="tag"><a-tag color="blue">{{ tag }}</a-tag></a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :lg="11">
        <img class="hero-image" src="/images/hero-freight.svg" alt="中美线国际货运主视觉" />
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
    <h2 class="section-title">中美线核心服务</h2>
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
    <img src="/images/tools-banner.svg" alt="中美线货代工具功能横幅" class="tools-banner" />
  </section>

  <section>
    <h2 class="section-title">中美热门航线</h2>
    <a-table :pagination="false" :data-source="hotRoutes" :columns="columns" row-key="route" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  GlobalOutlined,
  RocketOutlined,
  SafetyOutlined,
  ReconciliationOutlined
} from '@ant-design/icons-vue'
import { usePortalStore } from '@/stores/portal'

const portalStore = usePortalStore()

const strengths = ['中美固定舱位', '美国清关合规支持', '尾程卡派/快递派送', '7×24 异常响应']

const services = [
  { title: '中美海运整箱/拼箱', desc: '覆盖上海、宁波、深圳至美西/美东主力港口，稳定周班。', icon: GlobalOutlined },
  { title: '中美空运专线', desc: '上海/深圳/香港起飞，直飞 LAX/JFK/ORD，时效稳定。', icon: RocketOutlined },
  { title: '美国清关与保险', desc: '支持 ISF、AMS、Bond 及货运险方案，降低目的港风险。', icon: SafetyOutlined },
  { title: '全程可视化', desc: '订舱到签收全链路节点追踪，异常自动预警与通知。', icon: ReconciliationOutlined }
]

const hotRoutes = [
  { route: '上海 → 洛杉矶 (LAX)', transit: '14-18 天', mode: '海运快船', frequency: '每周 3 班' },
  { route: '宁波 → 长滩 (LGB)', transit: '15-20 天', mode: '海运普船', frequency: '每周 2 班' },
  { route: '深圳 → 纽约 (JFK)', transit: '4-6 天', mode: '空运直飞', frequency: '每日舱位' }
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
