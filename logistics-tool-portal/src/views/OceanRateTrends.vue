<template>
  <div class="ocean-rate-page">
    <section class="rate-hero">
      <div>
        <div class="rate-hero__kicker">Ocean Rate Trends</div>
        <h1>中美海运费走势</h1>
        <p>
          先用走势判断市场区间，再决定是否要询价、锁舱或调整出货节奏。当前页面先提供趋势骨架和演示数据，后续可接
          SCFI、FBX 等数据源。
        </p>
      </div>

      <div class="rate-hero__summary">
        <div class="summary-card">
          <div class="summary-card__label">本周观察</div>
          <div class="summary-card__value">美西回落</div>
          <div class="summary-card__desc">适合继续观察补货窗口和锁价节奏</div>
        </div>
      </div>
    </section>

    <section class="filter-panel">
      <a-row :gutter="[14, 14]">
        <a-col :xs="24" :md="8">
          <div class="filter-item">
            <div class="filter-item__label">指数来源</div>
            <a-segmented v-model:value="selectedSource" block :options="sourceOptions" />
          </div>
        </a-col>
        <a-col :xs="24" :md="8">
          <div class="filter-item">
            <div class="filter-item__label">航线</div>
            <a-select v-model:value="selectedLane" :options="laneOptions" />
          </div>
        </a-col>
        <a-col :xs="24" :md="8">
          <div class="filter-item">
            <div class="filter-item__label">时间范围</div>
            <a-segmented v-model:value="selectedWindow" block :options="windowOptions" />
          </div>
        </a-col>
      </a-row>
    </section>

    <section class="metric-grid">
      <div class="metric-card">
        <div class="metric-card__label">当前报价区间</div>
        <div class="metric-card__value">{{ activeSeries.latestPrice }}</div>
        <div class="metric-card__desc">40HQ 参考口径，适合作为报价前趋势判断</div>
      </div>
      <div class="metric-card">
        <div class="metric-card__label">近四周变动</div>
        <div class="metric-card__value" :class="{ 'is-down': activeSeries.change.startsWith('-') }">
          {{ activeSeries.change }}
        </div>
        <div class="metric-card__desc">帮助判断当前是追价、观望还是锁舱</div>
      </div>
      <div class="metric-card">
        <div class="metric-card__label">趋势判断</div>
        <div class="metric-card__value">{{ activeSeries.signal }}</div>
        <div class="metric-card__desc">{{ activeSeries.signalDesc }}</div>
      </div>
    </section>

    <section class="content-grid">
      <div class="chart-panel">
        <div class="panel-head">
          <div>
            <div class="panel-kicker">Trend Snapshot</div>
            <h2>{{ activeSeries.title }}</h2>
          </div>
        </div>

        <div class="trend-chart">
          <div class="trend-chart__grid"></div>
          <div class="trend-chart__bars">
            <div v-for="point in visiblePoints" :key="point.label" class="trend-chart__bar-item">
              <div class="trend-chart__bar-wrap">
                <div class="trend-chart__bar" :style="{ height: `${point.percent}%` }"></div>
              </div>
              <div class="trend-chart__price">{{ point.price }}</div>
              <div class="trend-chart__label">{{ point.label }}</div>
            </div>
          </div>
        </div>

        <div class="chart-note">
          当前为演示数据。正式接入时建议按“来源 + 航线 + 日期 + 箱型口径”落库，前端只做展示与筛选。
        </div>
      </div>

      <div class="side-panel">
        <div class="insight-card">
          <div class="panel-kicker">Lane Insight</div>
          <h3>使用建议</h3>
          <ul>
            <li>价格快速上行时，优先和客户确认是否需要提前锁舱。</li>
            <li>价格回落阶段，更适合做补货窗口判断和报价调整。</li>
            <li>美西和美东应分开看，不能混在一起判断走势。</li>
          </ul>
        </div>

        <div class="insight-card">
          <div class="panel-kicker">Data Source</div>
          <h3>建议接入</h3>
          <ul>
            <li>SCFI：适合国内出口端周度趋势。</li>
            <li>FBX：适合中美航线高频价格观察。</li>
            <li>Drewry WCI：适合跨太平洋市场参考。</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="table-panel">
      <div class="panel-head">
        <div>
          <div class="panel-kicker">Recent Records</div>
          <h2>近期记录</h2>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="activeSeries.points"
        :pagination="false"
        row-key="label"
        size="middle"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type TrendPoint = {
  label: string;
  price: string;
  raw: number;
};

type TrendSeries = {
  change: string;
  key: string;
  latestPrice: string;
  points: TrendPoint[];
  signal: string;
  signalDesc: string;
  source: string;
  title: string;
};

const sourceOptions = [
  { label: 'SCFI', value: 'SCFI' },
  { label: 'FBX', value: 'FBX' },
  { label: 'WCI', value: 'WCI' },
];

const laneOptions = [
  { label: '中国 / 东亚 → 美西', value: 'wc' },
  { label: '中国 / 东亚 → 美东', value: 'ec' },
];

const windowOptions = [
  { label: '4周', value: '4w' },
  { label: '8周', value: '8w' },
];

const allSeries: Record<string, TrendSeries> = {
  'FBX-ec': {
    change: '-4.8%',
    key: 'FBX-ec',
    latestPrice: '$6,040',
    points: [
      { label: 'W1', price: '$6,780', raw: 6780 },
      { label: 'W2', price: '$6,520', raw: 6520 },
      { label: 'W3', price: '$6,380', raw: 6380 },
      { label: 'W4', price: '$6,040', raw: 6040 },
    ],
    signal: '缓慢回落',
    signalDesc: '价格仍高于常态区间，但上涨压力开始减弱。',
    source: 'FBX',
    title: 'FBX 中国 / 东亚 → 美东',
  },
  'FBX-wc': {
    change: '-6.2%',
    key: 'FBX-wc',
    latestPrice: '$4,820',
    points: [
      { label: 'W1', price: '$5,420', raw: 5420 },
      { label: 'W2', price: '$5,160', raw: 5160 },
      { label: 'W3', price: '$4,980', raw: 4980 },
      { label: 'W4', price: '$4,820', raw: 4820 },
    ],
    signal: '回落中',
    signalDesc: '适合观察补货窗口，报价可以适度调整。',
    source: 'FBX',
    title: 'FBX 中国 / 东亚 → 美西',
  },
  'SCFI-ec': {
    change: '-3.1%',
    key: 'SCFI-ec',
    latestPrice: '$3,960',
    points: [
      { label: 'W1', price: '$4,220', raw: 4220 },
      { label: 'W2', price: '$4,140', raw: 4140 },
      { label: 'W3', price: '$4,060', raw: 4060 },
      { label: 'W4', price: '$3,960', raw: 3960 },
    ],
    signal: '高位整理',
    signalDesc: '适合继续观察后续船期和仓位变化。',
    source: 'SCFI',
    title: 'SCFI 上海出口 → 美东',
  },
  'SCFI-wc': {
    change: '-5.4%',
    key: 'SCFI-wc',
    latestPrice: '$3,280',
    points: [
      { label: 'W1', price: '$3,680', raw: 3680 },
      { label: 'W2', price: '$3,520', raw: 3520 },
      { label: 'W3', price: '$3,410', raw: 3410 },
      { label: 'W4', price: '$3,280', raw: 3280 },
    ],
    signal: '回调中',
    signalDesc: '更适合报价前做区间判断，不建议单看一周波动。',
    source: 'SCFI',
    title: 'SCFI 上海出口 → 美西',
  },
  'WCI-ec': {
    change: '-2.4%',
    key: 'WCI-ec',
    latestPrice: '$6,280',
    points: [
      { label: 'W1', price: '$6,620', raw: 6620 },
      { label: 'W2', price: '$6,480', raw: 6480 },
      { label: 'W3', price: '$6,340', raw: 6340 },
      { label: 'W4', price: '$6,280', raw: 6280 },
    ],
    signal: '高位震荡',
    signalDesc: '适合作为跨太平洋整体市场参考。',
    source: 'WCI',
    title: 'WCI 上海 → 纽约',
  },
  'WCI-wc': {
    change: '-4.1%',
    key: 'WCI-wc',
    latestPrice: '$5,140',
    points: [
      { label: 'W1', price: '$5,620', raw: 5620 },
      { label: 'W2', price: '$5,420', raw: 5420 },
      { label: 'W3', price: '$5,280', raw: 5280 },
      { label: 'W4', price: '$5,140', raw: 5140 },
    ],
    signal: '轻微回调',
    signalDesc: '美西价格回落更快，适合单独跟踪。',
    source: 'WCI',
    title: 'WCI 上海 → 洛杉矶',
  },
};

const columns = [
  { dataIndex: 'label', title: '周期' },
  { dataIndex: 'price', title: '价格' },
];

const selectedSource = ref('SCFI');
const selectedLane = ref('wc');
const selectedWindow = ref('4w');

const activeSeries = computed(() => allSeries[`${selectedSource.value}-${selectedLane.value}`]);

const visiblePoints = computed(() => {
  const points = selectedWindow.value === '8w'
    ? [...activeSeries.value.points, ...activeSeries.value.points].map((item, index) => ({
        ...item,
        label: `W${index + 1}`,
      }))
    : activeSeries.value.points;

  const max = Math.max(...points.map((item) => item.raw));
  return points.map((item) => ({
    ...item,
    percent: Math.max(24, Math.round((item.raw / max) * 100)),
  }));
});
</script>

<style scoped lang="scss">
.ocean-rate-page {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rate-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 320px;
  gap: 20px;
  padding: 28px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.14), transparent 28%),
    linear-gradient(135deg, #f8fbff, #ffffff 48%, #f8fafc);
  box-shadow: 0 24px 70px -44px rgba(15, 23, 42, 0.3);
}

.rate-hero__kicker,
.panel-kicker {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.rate-hero h1,
.panel-head h2 {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.rate-hero p {
  max-width: 760px;
  margin: 14px 0 0;
  color: #64748b;
  line-height: 1.9;
}

.summary-card {
  height: 100%;
  padding: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.94);
  color: #fff;
}

.summary-card__label {
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.summary-card__value {
  margin-top: 12px;
  font-size: 28px;
  font-weight: 800;
}

.summary-card__desc {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.8;
}

.filter-panel,
.chart-panel,
.side-panel,
.table-panel {
  padding: 22px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow: 0 20px 56px -44px rgba(15, 23, 42, 0.28);
}

.filter-item__label,
.metric-card__label {
  margin-bottom: 10px;
  color: #64748b;
  font-size: 13px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.metric-card {
  padding: 20px 22px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 32%),
    linear-gradient(180deg, #ffffff, #f8fafc);
}

.metric-card__value {
  color: #0f172a;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.metric-card__value.is-down {
  color: #2563eb;
}

.metric-card__desc {
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.8;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) 360px;
  gap: 18px;
}

.panel-head {
  margin-bottom: 16px;
}

.trend-chart {
  position: relative;
  overflow: hidden;
  padding: 24px 18px 12px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8fbff, #ffffff);
}

.trend-chart__grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(148, 163, 184, 0.12) 1px, transparent 1px) 0 0 / 100% 25%;
  pointer-events: none;
}

.trend-chart__bars {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  align-items: end;
  gap: 12px;
  min-height: 320px;
}

.trend-chart__bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.trend-chart__bar-wrap {
  display: flex;
  align-items: end;
  width: 100%;
  height: 220px;
}

.trend-chart__bar {
  width: 100%;
  border-radius: 18px 18px 10px 10px;
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  box-shadow: 0 18px 34px -18px rgba(37, 99, 235, 0.45);
}

.trend-chart__price {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.trend-chart__label {
  color: #64748b;
  font-size: 12px;
}

.chart-note {
  margin-top: 14px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.8;
}

.side-panel {
  display: grid;
  gap: 18px;
}

.insight-card {
  padding: 20px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.insight-card h3 {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
}

.insight-card ul {
  margin: 14px 0 0;
  padding-left: 18px;
  color: #475569;
  line-height: 2;
}

@media (max-width: 1200px) {
  .rate-hero,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .rate-hero,
  .filter-panel,
  .chart-panel,
  .side-panel,
  .table-panel {
    padding: 20px;
  }

  .rate-hero h1,
  .panel-head h2 {
    font-size: 28px;
  }
}
</style>
