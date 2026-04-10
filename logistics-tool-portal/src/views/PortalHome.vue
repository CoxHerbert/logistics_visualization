<template>
  <div class="home-page">
    <section id="hero" class="hero-section">
      <div class="hero-copy">
        <div class="hero-badge">China-US Freight Portal</div>
        <h1>{{ copy.heroTitle }}</h1>
        <p class="hero-description">{{ copy.heroDescription }}</p>
        <div class="hero-actions">
          <RouterLink to="/get-plan">
            <a-button type="primary" size="large">{{ copy.heroPrimary }}</a-button>
          </RouterLink>
          <RouterLink to="/tool-center">
            <a-button size="large">{{ copy.heroSecondary }}</a-button>
          </RouterLink>
        </div>
      </div>

      <div class="hero-visual">
        <img class="hero-image" src="/images/home/pier.jpg" :alt="copy.heroTitle" />
        <div class="hero-panel">
          <div class="hero-panel__label">{{ copy.coreLabel }}</div>
          <div class="hero-panel__title">{{ copy.coreTitle }}</div>
          <div class="hero-panel__desc">{{ copy.coreDesc }}</div>
        </div>
      </div>
    </section>

    <nav class="anchor-nav">
      <a
        v-for="item in anchorItems"
        :key="item.href"
        class="anchor-nav__item"
        :href="item.href"
      >
        {{ item.label }}
      </a>
    </nav>

    <section id="stats" class="stats-grid">
      <div v-for="item in dashboardStats" :key="item.label" class="stat-card">
        <div class="stat-card__label">{{ item.label }}</div>
        <div class="stat-card__value">{{ item.value }}</div>
      </div>
      <div class="stat-card stat-card--accent">
        <div class="stat-card__label">{{ copy.coverageLabel }}</div>
        <div class="stat-card__value">{{ copy.coverageValue }}</div>
      </div>
    </section>

    <section id="rates" class="rate-section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Ocean Rate Trends</div>
          <h2 class="section-title">{{ copy.rateTitle }}</h2>
          <p class="section-desc">{{ copy.rateDesc }}</p>
        </div>
        <RouterLink to="/tool-center/ocean-rate-trends">
          <a-button>{{ copy.rateAction }}</a-button>
        </RouterLink>
      </div>

      <div class="rate-panel">
        <div class="rate-summary">
          <div class="rate-summary__source">{{ activeTrend.source }}</div>
          <div class="rate-summary__lane">{{ activeTrend.title }}</div>
          <div class="rate-summary__price">{{ activeTrend.latestPrice }}</div>
          <div class="rate-summary__signal">{{ copy.rateSignal }}: {{ activeTrend.signal }}</div>
        </div>
        <div class="rate-bars">
          <button
            v-for="tab in trendTabs"
            :key="tab.key"
            class="rate-tab"
            :class="{ 'is-active': activeTrendKey === tab.key }"
            type="button"
            @click="activeTrendKey = tab.key"
          >
            {{ tab.label }}
          </button>
          <div class="rate-bars__grid">
            <div v-for="point in ratePoints" :key="point.label" class="rate-bar-item">
              <div class="rate-bar-item__wrap">
                <div class="rate-bar-item__bar" :style="{ height: `${point.percent}%` }"></div>
              </div>
              <div class="rate-bar-item__price">{{ point.price }}</div>
              <div class="rate-bar-item__label">{{ point.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tools" class="quick-section">
      <div class="section-head">
        <div>
          <div class="section-kicker">Quick Access</div>
          <h2 class="section-title">{{ copy.quickTitle }}</h2>
        </div>
      </div>
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in quickEntries" :key="item.title" :xs="24" :md="12" :xl="6">
          <RouterLink :to="item.to" class="quick-card">
            <div class="quick-card__icon">{{ item.icon }}</div>
            <div class="quick-card__title">{{ item.title }}</div>
            <div class="quick-card__desc">{{ item.description }}</div>
          </RouterLink>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { usePortalStore } from '@/stores/portal';

type TrendPoint = { label: string; price: string; raw: number };
type TrendSeries = { latestPrice: string; points: TrendPoint[]; signal: string; source: string; title: string };

const copy = {
  coreDesc: '\u4ece\u56fd\u5185\u63d0\u8d27\u5230\u7f8e\u56fd\u7b7e\u6536\uff0c\u5173\u952e\u8282\u70b9\u7edf\u4e00\u8ddf\u8fdb\uff0c\u5f02\u5e38\u4fe1\u606f\u53ca\u65f6\u53cd\u9988\u3002',
  coreLabel: '\u6838\u5fc3\u4fdd\u969c',
  coreTitle: '\u8ba2\u8231 + \u6e05\u5173 + \u6d3e\u9001\u8054\u52a8',
  coverageLabel: '\u670d\u52a1\u8986\u76d6',
  coverageValue: '\u6d77\u8fd0 / \u7a7a\u8fd0 / \u6e05\u5173 / \u5c3e\u7a0b',
  heroDescription: '\u805a\u7126\u4e2d\u56fd\u5230\u7f8e\u56fd\u56fd\u9645\u8d27\u8fd0\u3002\u9996\u9875\u5148\u7ed9\u4f60\u770b\u5546\u54c1\u80fd\u529b\u548c\u8fd0\u4ef7\u8d70\u52bf\uff0c\u518d\u518d\u5f15\u5bfc\u8fdb\u5165\u65b9\u6848\u6216\u5de5\u5177\u3002',
  heroPrimary: '\u83b7\u53d6\u8fd0\u8f93\u65b9\u6848',
  heroSecondary: '\u8fdb\u5165\u5de5\u5177\u4e2d\u5fc3',
  heroTitle: '\u4e2d\u56fd\u5230\u7f8e\u56fd\u56fd\u9645\u8d27\u8fd0\uff0c\u4e00\u7ad9\u5f0f\u65b9\u6848\u95e8\u6237',
  quickTitle: '\u5e38\u7528\u5165\u53e3',
  rateAction: '\u67e5\u770b\u5b8c\u6574\u884c\u60c5',
  rateDesc: '\u8fd0\u4ef7\u8d70\u52bf\u653e\u5728\u9996\u9875\uff0c\u66f4\u9002\u5408\u505a\u95e8\u6237\u5c55\u793a\u548c\u8be2\u4ef7\u5f15\u5bfc\u3002',
  rateSignal: '\u8d8b\u52bf\u5224\u65ad',
  rateTitle: '\u4e2d\u7f8e\u6d77\u8fd0\u8d39\u8d70\u52bf',
};

const anchorItems = [
  { href: '#hero', label: '\u9996\u5c4f' },
  { href: '#stats', label: '\u6570\u636e\u6982\u89c8' },
  { href: '#rates', label: '\u8fd0\u4ef7\u8d70\u52bf' },
  { href: '#tools', label: '\u5e38\u7528\u5165\u53e3' },
];

const quickEntries = [
  { description: '\u5feb\u901f\u63d0\u4ea4\u9700\u6c42\uff0c\u83b7\u53d6\u65b9\u6848\u5efa\u8bae\u3002', icon: '01', title: '\u83b7\u53d6\u65b9\u6848', to: '/get-plan' },
  { description: '\u96c6\u4e2d\u67e5\u770b\u6d4b\u7b97\u3001\u6a21\u62df\u4e0e\u62a5\u4ef7\u5de5\u5177\u3002', icon: '02', title: '\u5de5\u5177\u4e2d\u5fc3', to: '/tool-center' },
  { description: '\u5148\u770b\u4e2d\u7f8e\u6d77\u8fd0\u884c\u60c5\uff0c\u518d\u51b3\u5b9a\u662f\u5426\u8be2\u4ef7\u6216\u9501\u8231\u3002', icon: '03', title: '\u6d77\u8fd0\u8d39\u8d70\u52bf', to: '/tool-center/ocean-rate-trends' },
  { description: '\u67e5\u770b\u88c5\u7bb1\u6a21\u62df\u4e0e\u96c6\u88c5\u7bb1\u5de5\u5177\u3002', icon: '04', title: '\u88c5\u7bb1\u6a21\u62df', to: '/tool-center/container-sim' },
];

const trendTabs = [
  { key: 'scfi-wc', label: 'SCFI 美西' },
  { key: 'scfi-ec', label: 'SCFI 美东' },
  { key: 'fbx-wc', label: 'FBX 美西' },
];

const trendSeries: Record<string, TrendSeries> = {
  'fbx-wc': { latestPrice: '$4,820', points: [{ label: 'W1', price: '$5,420', raw: 5420 }, { label: 'W2', price: '$5,160', raw: 5160 }, { label: 'W3', price: '$4,980', raw: 4980 }, { label: 'W4', price: '$4,820', raw: 4820 }], signal: '\u56de\u843d\u4e2d', source: 'FBX', title: '\u4e2d\u56fd / \u4e1c\u4e9a \u2192 \u7f8e\u897f' },
  'scfi-ec': { latestPrice: '$3,960', points: [{ label: 'W1', price: '$4,220', raw: 4220 }, { label: 'W2', price: '$4,140', raw: 4140 }, { label: 'W3', price: '$4,060', raw: 4060 }, { label: 'W4', price: '$3,960', raw: 3960 }], signal: '\u9ad8\u4f4d\u6574\u7406', source: 'SCFI', title: '\u4e0a\u6d77\u51fa\u53e3 \u2192 \u7f8e\u4e1c' },
  'scfi-wc': { latestPrice: '$3,280', points: [{ label: 'W1', price: '$3,680', raw: 3680 }, { label: 'W2', price: '$3,520', raw: 3520 }, { label: 'W3', price: '$3,410', raw: 3410 }, { label: 'W4', price: '$3,280', raw: 3280 }], signal: '\u56de\u8c03\u4e2d', source: 'SCFI', title: '\u4e0a\u6d77\u51fa\u53e3 \u2192 \u7f8e\u897f' },
};

const portalStore = usePortalStore();
const activeTrendKey = ref('scfi-wc');

const activeTrend = computed(() => trendSeries[activeTrendKey.value]);
const ratePoints = computed(() => {
  const max = Math.max(...activeTrend.value.points.map((item) => item.raw));
  return activeTrend.value.points.map((item) => ({
    ...item,
    percent: Math.max(28, Math.round((item.raw / max) * 100)),
  }));
});

const dashboardStats = computed(() => {
  const values = portalStore.stats.map((item) => item.value);
  return [
    { label: '\u4eca\u65e5\u8be2\u4ef7', value: values[0] ?? '126' },
    { label: '\u5728\u9014\u7968\u6570', value: values[1] ?? '384' },
    { label: '\u5f02\u5e38\u9884\u8b66', value: values[2] ?? '7' },
  ];
});

onMounted(() => {
  portalStore.refreshStats();
});
</script>

<style scoped lang="scss">
.home-page {
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-section,
.rate-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 20px;
}

.hero-section {
  padding: 30px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 32%),
    linear-gradient(135deg, #f8fbff 0%, #ffffff 46%, #f7f4ee 100%);
  box-shadow: 0 28px 80px -44px rgba(15, 23, 42, 0.32);
}

.hero-badge,
.section-kicker {
  display: inline-flex;
  width: fit-content;
  padding: 8px 14px;
  border: 1px solid rgba(37, 99, 235, 0.14);
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.06);
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-copy h1,
.section-title {
  margin: 18px 0 0;
  color: #0f172a;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.08;
}

.hero-description,
.section-desc {
  margin-top: 14px;
  color: #64748b;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
  overflow: hidden;
  min-height: 360px;
  border-radius: 24px;
  background: #0f172a;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-panel {
  position: absolute;
  right: 18px;
  bottom: 18px;
  max-width: 280px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
}

.hero-panel__label {
  font-size: 12px;
  opacity: 0.7;
  text-transform: uppercase;
}

.hero-panel__title {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 700;
}

.hero-panel__desc {
  margin-top: 8px;
  line-height: 1.8;
  opacity: 0.82;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.anchor-nav {
  position: sticky;
  top: 88px;
  z-index: 8;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 50px -42px rgba(15, 23, 42, 0.24);
}

.anchor-nav__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  background: #fff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.anchor-nav__item:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.18);
  color: #1d4ed8;
}

.stat-card,
.rate-summary,
.rate-bars,
.quick-card {
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow: 0 20px 56px -44px rgba(15, 23, 42, 0.28);
}

.stat-card {
  min-height: 128px;
  padding: 20px 22px;
}

.stat-card__label {
  color: #64748b;
  font-size: 13px;
}

.stat-card__value {
  margin-top: 10px;
  color: #0f172a;
  font-size: 30px;
  font-weight: 800;
}

.stat-card--accent {
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 34%),
    linear-gradient(135deg, #f8fbff, #ffffff);
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  margin-top: 8px;
  font-size: 28px;
}

.rate-summary,
.rate-bars {
  padding: 22px;
}

.rate-summary__source {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.rate-summary__lane {
  margin-top: 10px;
  color: #0f172a;
  font-size: 24px;
  font-weight: 800;
}

.rate-summary__price {
  margin-top: 16px;
  color: #0f172a;
  font-size: 34px;
  font-weight: 800;
}

.rate-summary__signal {
  margin-top: 12px;
  color: #2563eb;
  font-weight: 700;
}

.rate-bars {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.rate-tab {
  padding: 9px 14px;
  margin-right: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  background: #fff;
  color: #334155;
  cursor: pointer;
}

.rate-tab.is-active {
  border-color: rgba(37, 99, 235, 0.18);
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
}

.rate-bars__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  align-items: end;
  min-height: 240px;
}

.rate-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rate-bar-item__wrap {
  display: flex;
  align-items: end;
  width: 100%;
  height: 180px;
}

.rate-bar-item__bar {
  width: 100%;
  border-radius: 18px 18px 10px 10px;
  background: linear-gradient(180deg, #38bdf8, #2563eb);
}

.rate-bar-item__price {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.rate-bar-item__label {
  color: #64748b;
  font-size: 12px;
}

.quick-card {
  display: block;
  height: 100%;
  padding: 22px;
  text-decoration: none;
}

.quick-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #0f172a;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

.quick-card__title {
  margin-top: 18px;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
}

.quick-card__desc {
  margin-top: 10px;
  color: #64748b;
  line-height: 1.8;
}

@media (max-width: 1200px) {
  .hero-section,
  .rate-panel,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 22px;
  }

  .hero-copy h1,
  .section-title {
    font-size: 30px;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .rate-bars__grid {
    grid-template-columns: 1fr;
  }

  .anchor-nav {
    top: 76px;
  }
}
</style>
