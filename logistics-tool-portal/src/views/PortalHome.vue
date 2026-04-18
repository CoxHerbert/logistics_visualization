<template>
  <div class="home-page">
    <section id="hero" class="hero-section section-card">
      <div class="hero-main">
        <p class="hero-kicker">China-US Freight Forwarding</p>
        <h1>中美线国际货运代理（FBA头程 / 海运 / 海卡）</h1>
        <p class="hero-subtitle">稳定渠道 · 控风险 · 不玩极限低价</p>

        <div class="hero-actions">
          <RouterLink to="/me">
            <a-button type="primary" size="large">联系顾问</a-button>
          </RouterLink>
          <RouterLink to="/me">
            <a-button size="large">立即咨询</a-button>
          </RouterLink>
        </div>

        <div class="trust-tags">
          <span v-for="item in trustTags" :key="item" class="trust-tag">{{ item }}</span>
        </div>

        <p class="hero-quote">我们不承诺最低价，但尽量让每一票货走得更稳。</p>
      </div>

      <div class="hero-side">
        <img class="hero-image" src="/images/home/pier.jpg" alt="中美线物流" />
        <div class="hero-side-card">
          <p class="hero-side-card__kicker">销售核心</p>
          <p class="hero-side-card__title">能报价的很多，能兜底的不多</p>
        </div>
      </div>
    </section>

    <nav class="anchor-nav">
      <a v-for="item in anchorItems" :key="item.href" class="anchor-nav__item" :href="item.href">
        {{ item.label }}
      </a>
    </nav>

    <section id="advantage" class="section-card section-block">
      <div class="section-head">
        <p class="section-kicker">Why Us</p>
        <h2>为什么客户选择我们？</h2>
      </div>
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in advantages" :key="item.title" :xs="24" :md="8">
          <div class="info-card">
            <div class="info-card__title">{{ item.title }}</div>
            <div class="info-card__desc">{{ item.desc }}</div>
          </div>
        </a-col>
      </a-row>
    </section>

    <section id="services" class="section-card section-block">
      <div class="section-head">
        <p class="section-kicker">Services</p>
        <h2>服务范围</h2>
      </div>
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in services" :key="item.title" :xs="24" :md="12" :xl="6">
          <div class="service-card">
            <div class="service-card__code">{{ item.code }}</div>
            <div class="service-card__title">{{ item.title }}</div>
            <div class="service-card__desc">{{ item.desc }}</div>
          </div>
        </a-col>
      </a-row>
    </section>

    <section id="risk" class="section-card section-block">
      <div class="section-head">
        <p class="section-kicker">Risk Control</p>
        <h2>海运全流程风险控制</h2>
      </div>

      <div class="risk-flow-chain">
        <span v-for="(node, index) in riskNodes" :key="node" class="risk-flow-chain__node">
          {{ node }}<i v-if="index !== riskNodes.length - 1">→</i>
        </span>
      </div>

      <div class="risk-layout">
        <div class="risk-step-list">
          <button
            v-for="item in riskSteps"
            :key="item.key"
            type="button"
            class="risk-step"
            :class="{ 'is-active': activeRiskKey === item.key }"
            @click="activeRiskKey = item.key"
          >
            {{ item.title }}
          </button>
        </div>

        <div class="risk-detail">
          <div class="risk-detail__item">
            <p class="risk-detail__label">风险点</p>
            <p class="risk-detail__value">{{ activeRisk.risk }}</p>
          </div>
          <div class="risk-detail__item">
            <p class="risk-detail__label">影响</p>
            <p class="risk-detail__value">{{ activeRisk.impact }}</p>
          </div>
          <div class="risk-detail__item">
            <p class="risk-detail__label">解决方案</p>
            <p class="risk-detail__value">{{ activeRisk.solution }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="section-card contact-section">
      <div class="section-head">
        <p class="section-kicker">Contact</p>
        <h2>准备出货？现在就聊</h2>
      </div>
      <p class="contact-desc">通过顶部导航的“联系我们”可直接提交咨询；也可以先加微信，沟通出货计划和风险点。</p>

      <div class="wechat-card">
        <p class="wechat-card__label">微信咨询</p>
        <p class="wechat-card__value">{{ wechatId }}</p>
        <p class="wechat-card__hint">匿名提交入口已移动到页面顶部 header，所有页面都可以直接发起咨询。</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

type RiskItem = {
  impact: string;
  key: string;
  risk: string;
  solution: string;
  title: string;
};

const anchorItems = [
  { href: '#hero', label: '首屏' },
  { href: '#advantage', label: '为什么选我们' },
  { href: '#services', label: '服务范围' },
  { href: '#risk', label: '风险流程' },
  { href: '#contact', label: '联系我们' },
];

const trustTags = ['可对比航次 / 船期透明', '支持备选渠道（旺季不甩柜）', '异常全流程跟进'];

const advantages = [
  { title: '稳定优先', desc: '不做极限低价渠道，优先保证时效稳定和可交付。' },
  { title: '响应及时', desc: '出现异常第一时间响应，明确责任和处理节奏。' },
  { title: '备选补位', desc: '主方案受限时可快速切换备选渠道，减少断档风险。' },
];

const services = [
  { code: '01', title: 'FBA头程（海派 / 海卡）', desc: '匹配平台入仓要求，平衡成本与时效。' },
  { code: '02', title: '整柜（FCL）', desc: '适合稳定出货，提供舱位与节点管控。' },
  { code: '03', title: '拼箱（LCL）', desc: '低起运门槛，支持多批次拼箱出货。' },
  { code: '04', title: '清关 + 派送', desc: '到港后续流程衔接，减少末端延误。' },
];

const riskNodes = ['订舱', '提柜', '装柜', '报关', '装船', '到港', '清关', '派送'];

const riskSteps: RiskItem[] = [
  {
    key: 'booking',
    title: '订舱',
    risk: '旺季舱位紧张，临时甩柜或改期。',
    impact: '整体时效延后，后续节点连锁延迟。',
    solution: '提前锁舱 + 备选船东并行评估，关键货提前预排。',
  },
  {
    key: 'loading',
    title: '装柜',
    risk: '装柜计划不合理，超重或空间浪费。',
    impact: '增加成本并可能触发现场二次调整。',
    solution: '装柜前预演与复核，明确箱型、重量和装载优先级。',
  },
  {
    key: 'customs',
    title: '清关',
    risk: '资料不完整或品名归类不准确。',
    impact: '查验概率上升，提货与派送延误。',
    solution: '发运前完成资料校验，敏感货预审并准备补充文件。',
  },
  {
    key: 'delivery',
    title: '派送',
    risk: '预约仓不顺或尾程承运衔接不足。',
    impact: '产生额外仓租、改约费与客户投诉。',
    solution: '到港前锁定预约窗口，异常件建立升级处理机制。',
  },
];

const activeRiskKey = ref(riskSteps[0]!.key);

const activeRisk = computed(() => {
  return riskSteps.find((item) => item.key === activeRiskKey.value) ?? riskSteps[0]!;
});

const wechatId = import.meta.env.VITE_WECHAT_ID || '请在 .env 中配置 VITE_WECHAT_ID';
</script>

<style scoped lang="scss">
.home-page {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, #fff, #f8fafc);
  box-shadow: 0 20px 50px -42px rgba(15, 23, 42, 0.28);
}

.section-block {
  padding: 26px;
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 20px;
  padding: 28px;
}

.hero-kicker,
.section-kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-main h1,
.section-head h2 {
  margin: 12px 0 0;
  color: #0f172a;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
}

.hero-subtitle {
  margin: 12px 0 0;
  color: #334155;
  font-size: 18px;
  font-weight: 600;
}

.hero-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.trust-tags {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trust-tag {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: rgba(37, 99, 235, 0.06);
  color: #1e3a8a;
  font-size: 13px;
  font-weight: 600;
}

.hero-quote {
  margin: 16px 0 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
}

.hero-side {
  position: relative;
  min-height: 320px;
  border-radius: 18px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-side-card {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
}

.hero-side-card__kicker {
  margin: 0;
  opacity: 0.7;
  font-size: 12px;
}

.hero-side-card__title {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 700;
}

.anchor-nav {
  position: sticky;
  top: 88px;
  z-index: 8;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
}

.anchor-nav__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  color: #334155;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.section-head {
  margin-bottom: 16px;
}

.info-card,
.service-card {
  height: 100%;
  padding: 18px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 16px;
  background: #fff;
}

.info-card__title,
.service-card__title {
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
}

.info-card__desc,
.service-card__desc {
  margin-top: 8px;
  color: #64748b;
  line-height: 1.7;
}

.service-card__code {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.risk-flow-chain {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.risk-flow-chain__node {
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.risk-flow-chain__node i {
  margin-left: 8px;
  color: #94a3b8;
  font-style: normal;
}

.risk-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
}

.risk-step-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-step {
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  text-align: left;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
}

.risk-step.is-active {
  border-color: rgba(37, 99, 235, 0.35);
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
}

.risk-detail {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.risk-detail__label {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.risk-detail__value {
  margin: 4px 0 0;
  color: #0f172a;
  line-height: 1.7;
  font-weight: 600;
}

.contact-section {
  padding: 26px;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 36%),
    linear-gradient(180deg, #fff, #f8fafc);
}

.contact-desc {
  margin: 0;
  color: #475569;
  line-height: 1.8;
}

.wechat-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  border: 1px dashed rgba(37, 99, 235, 0.35);
  background: rgba(37, 99, 235, 0.04);
}

.wechat-card__label {
  margin: 0;
  color: #1e3a8a;
  font-size: 12px;
  font-weight: 700;
}

.wechat-card__value {
  margin: 6px 0 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
}

.wechat-card__hint {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.7;
}

@media (max-width: 992px) {
  .hero-section,
  .risk-layout {
    grid-template-columns: 1fr;
  }

  .anchor-nav {
    top: 76px;
  }
}
</style>
