<template>
  <div class="tool-center-page">
    <section class="tool-center-hero">
      <div>
        <div class="tool-center-kicker">Tool Center</div>
        <h1>国际货运工具中心</h1>
        <p>
          聚焦高频决策工具，优先支持报价判断、运输方式选择和装柜规划，减少重复沟通成本。
        </p>
      </div>
      <div class="tool-center-hero__meta">
        <div class="hero-meta-card">
          <div class="hero-meta-card__label">当前优先级</div>
          <div class="hero-meta-card__value">装柜测算</div>
          <div class="hero-meta-card__desc">先测算装柜与成本，再进入询价或方案提交。</div>
        </div>
      </div>
    </section>

    <section class="tool-section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Priority Tools</div>
          <h2 class="section-title">优先建设</h2>
        </div>
      </div>

      <a-row :gutter="[18, 18]">
        <a-col v-for="item in priorityTools" :key="item.title" :xs="24" :md="12" :xl="8">
          <RouterLink :to="item.path" class="tool-card" :class="{ 'is-featured': item.featured }">
            <div class="tool-card__top">
              <div class="tool-card__badge">{{ item.badge }}</div>
              <div v-if="item.featured" class="tool-card__feature">推荐</div>
            </div>
            <div class="tool-card__title">{{ item.title }}</div>
            <div class="tool-card__desc">{{ item.description }}</div>
            <div v-if="item.footer" class="tool-card__footer">{{ item.footer }}</div>
          </RouterLink>
        </a-col>
      </a-row>
    </section>

    <section class="tool-section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Existing Tools</div>
          <h2 class="section-title">现有工具</h2>
        </div>
      </div>

      <a-row :gutter="[18, 18]">
        <a-col v-for="item in existingTools" :key="item.title" :xs="24" :md="12" :xl="6">
          <RouterLink :to="item.path" class="tool-card tool-card--compact">
            <div class="tool-card__badge">{{ item.badge }}</div>
            <div class="tool-card__title">{{ item.title }}</div>
            <div class="tool-card__desc">{{ item.description }}</div>
          </RouterLink>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type ToolCard = {
  badge: string;
  description: string;
  featured?: boolean;
  footer?: string;
  path: string;
  title: string;
};

const priorityTools: ToolCard[] = [
  {
    badge: '01',
    description: '输入体积、重量和件数，快速换算空运或快递计费重。',
    featured: true,
    footer: '下一步可继续建设',
    path: '/tool-center/fba-first-leg-calculator',
    title: '体积重 / 计费重',
  },
  {
    badge: '02',
    description: '根据 CBM、重量和件型，辅助判断整柜、拼箱或多柜方案。',
    footer: '适合承接装柜和订舱判断',
    path: '/tool-center/container-calculator',
    title: '整柜 / 拼箱建议',
  },
];

const existingTools: ToolCard[] = [
  {
    badge: 'FBA',
    description: '面向 FBA 头程场景的费用测算。',
    path: '/tool-center/fba-first-leg-calculator',
    title: 'FBA头程价格计算',
  },
  {
    badge: 'V8',
    description: '支持多柜规划、包装优化和成本模型。',
    path: '/tool-center/container-calculator',
    title: '装柜计算器 V8',
  },
  {
    badge: 'V9',
    description: '四步向导式装柜计算流程。',
    path: '/tool-center/container-calculator/wizard',
    title: '装柜计算器 V9',
  },
  {
    badge: '3D',
    description: '三维装箱模拟与装载可视化。',
    path: '/tool-center/container-sim',
    title: '3D装箱模拟',
  },
];
</script>

<style scoped lang="scss">
.tool-center-page {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tool-center-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 320px;
  gap: 20px;
  padding: 28px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.15), transparent 30%),
    linear-gradient(135deg, #f8fbff, #ffffff 48%, #f8fafc);
  box-shadow: 0 26px 70px -44px rgba(15, 23, 42, 0.28);
}

.tool-center-kicker,
.section-kicker {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.tool-center-hero h1,
.section-title {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.tool-center-hero p {
  max-width: 760px;
  margin: 14px 0 0;
  color: #64748b;
  line-height: 1.9;
}

.hero-meta-card {
  height: 100%;
  padding: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.92);
  color: #fff;
}

.hero-meta-card__label {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-meta-card__value {
  margin-top: 12px;
  font-size: 28px;
  font-weight: 800;
}

.hero-meta-card__desc {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.8;
}

.section-head {
  margin-bottom: 16px;
}

.tool-card {
  display: block;
  height: 100%;
  padding: 22px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow: 0 18px 50px -42px rgba(15, 23, 42, 0.26);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: rgba(37, 99, 235, 0.16);
  box-shadow: 0 28px 72px -42px rgba(15, 23, 42, 0.28);
}

.tool-card.is-featured {
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 35%),
    linear-gradient(180deg, #ffffff, #f8fbff);
}

.tool-card--compact {
  min-height: 210px;
}

.tool-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tool-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: #0f172a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.tool-card__feature {
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
}

.tool-card__title {
  margin-top: 18px;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.tool-card__desc {
  margin-top: 10px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.9;
}

.tool-card__footer {
  margin-top: 18px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 992px) {
  .tool-center-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tool-center-hero {
    padding: 22px;
  }

  .tool-center-hero h1,
  .section-title {
    font-size: 28px;
  }
}
</style>
