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
<style scoped>
/* ====== Layout spacing ====== */
.hero-section,
.overview-section,
.tools-banner-wrapper,
section {
  /* max-width: 1160px; */
  margin: 0 auto;
}

.hero-section {
  margin-top: 8px;
  padding: 40px 28px;
  border-radius: 20px;
  background:
    radial-gradient(800px 400px at 20% 0%, rgba(22, 119, 255, 0.18), transparent 60%),
    radial-gradient(700px 380px at 100% 30%, rgba(82, 196, 26, 0.12), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.hero-section h1 {
  margin: 0 0 12px 0;
  font-size: 40px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.88);
}

.hero-section p {
  margin: 0 0 22px 0;
  font-size: 15px;
  line-height: 1.75;
  color: rgba(0, 0, 0, 0.62);
  max-width: 640px;
}

/* Buttons: more premium */
:deep(.ant-btn-lg) {
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
}

:deep(.ant-btn-primary) {
  box-shadow: 0 10px 22px rgba(22, 119, 255, 0.28);
}

:deep(.ant-btn-primary:hover) {
  transform: translateY(-1px);
}

:deep(.ant-btn:not(.ant-btn-primary):hover) {
  transform: translateY(-1px);
}

/* Tags under hero */
.hero-tags {
  margin-top: 16px;
}

.hero-tags :deep(.ant-tag) {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(22, 119, 255, 0.18);
  background: rgba(22, 119, 255, 0.06);
  color: rgba(0, 0, 0, 0.72);
}

/* Hero image */
.hero-image {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.12));
  transform: translateY(4px);
}

/* ====== Overview stats ====== */
.overview-section {
  margin-top: 18px;
  margin-bottom: 8px;
  padding: 0 2px;
}

:deep(.ant-card) {
  border-radius: 16px;
}

.overview-section :deep(.ant-card) {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.overview-section :deep(.ant-card-body) {
  padding: 18px 18px 14px;
}

:deep(.ant-statistic-title) {
  color: rgba(0, 0, 0, 0.55);
}

:deep(.ant-statistic-content) {
  font-weight: 800;
}

/* ====== Section title ====== */
.section-title {
  margin: 26px 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.88);
  letter-spacing: -0.01em;
}

/* ====== Services cards ====== */
.service-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  overflow: hidden;
  position: relative;
}

.service-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(380px 120px at 20% 0%, rgba(22, 119, 255, 0.14), transparent 55%);
  pointer-events: none;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.10);
}

.service-card :deep(.ant-card-head) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.service-card :deep(.ant-card-head-title) {
  padding: 14px 0;
  font-weight: 800;
}

.service-card p {
  margin: 10px 0 0;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.62);
}

/* Icons a bit larger */
.service-card :deep(.anticon) {
  font-size: 18px;
  color: rgba(22, 119, 255, 0.95);
}

/* ====== Tools banner ====== */
.tools-banner-wrapper {
  margin: 18px auto 10px;
  padding: 0 2px;
}

.tools-banner {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.08);
  display: block;
}

/* ====== Table ====== */
:deep(.ant-table) {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.ant-table-thead > tr > th) {
  font-weight: 800;
  color: rgba(0, 0, 0, 0.75);
  background: rgba(0, 0, 0, 0.02);
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: rgba(22, 119, 255, 0.05);
}

/* ====== Responsive ====== */
@media (max-width: 992px) {
  .hero-section {
    padding: 28px 18px;
  }

  .hero-section h1 {
    font-size: 32px;
  }

  .hero-image {
    margin-top: 18px;
    max-height: 240px;
  }
}

@media (max-width: 576px) {
  .hero-section {
    border-radius: 16px;
  }

  .hero-section h1 {
    font-size: 28px;
  }

  :deep(.ant-btn-lg) {
    height: 42px;
    border-radius: 12px;
  }
}
</style>
