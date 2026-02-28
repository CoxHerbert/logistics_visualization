<template>
  <a-card :bordered="false" class="card">
    <template #title><span class="t">汇总与明细</span></template>

    <a-row :gutter="[12,12]">
      <a-col :span="12">
        <div class="kpi">
          <div class="k">总成本</div>
          <div class="v">¥ {{ fmt(totalCny) }}</div>
          <div class="s">所有启用项合计</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">每箱成本</div>
          <div class="v">¥ {{ fmt(perCarton) }}</div>
          <div class="s">总成本 / 总箱数</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">每CBM成本</div>
          <div class="v">¥ {{ fmt(perCbm) }}</div>
          <div class="s">总成本 / 总CBM</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">关税估算</div>
          <div class="v">¥ {{ fmt(dutyCny) }}</div>
          <div class="s">货值×税率</div>
        </div>
      </a-col>
    </a-row>

    <a-divider />

    <a-table
      :dataSource="breakdown"
      :columns="bdColumns"
      :pagination="false"
      size="small"
      rowKey="label"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'label'">
          <div>
            <b>{{ record.label }}</b>
            <div class="hint">{{ record.note }}</div>
          </div>
        </template>
        <template v-else-if="column.key === 'amount'">
          <div class="amt">¥ {{ fmt(record.amountCny) }}</div>
        </template>
      </template>
    </a-table>

    <a-divider />

    <div class="row" style="justify-content: space-between; align-items: center">
      <div class="t">对外报价文本</div>
      <a-button @click="copy" type="primary">复制</a-button>
    </div>
    <a-textarea :value="quoteText" :rows="10" readonly />

    <div class="hint" style="margin-top: 10px">
      提示：这套工具更适合销售端/内部端。用户端建议输出“区间价 + 留资”，减少误解与争议。
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BreakdownLine, Bases } from "../utils/pricing";

const props = defineProps<{
  bases: Bases;
  breakdown: BreakdownLine[];
  origin: string;
  destination: string;
  remark?: string;
  totalCny: number;
  quoteText: string;
}>();

const bdColumns = [
  { title: "费用项", key: "label" },
  { title: "金额(CNY)", key: "amount", width: 160 },
];

const fmt = (n: number) => new Intl.NumberFormat("zh-CN").format(Math.round(n));

const dutyCny = computed(() => props.bases.cargoUsd * (props.bases.dutyRate / 100) * props.bases.usdCny);
const perCarton = computed(() => (props.bases.totalCartons > 0 ? props.totalCny / props.bases.totalCartons : 0));
const perCbm = computed(() => (props.bases.totalCbm > 0 ? props.totalCny / props.bases.totalCbm : 0));

async function copy() {
  const text = props.quoteText || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}
</script>

<style scoped>
.card { border-radius: 16px; }
.t { font-weight: 800; }
.kpi { background: #fafafa; border-radius: 14px; padding: 12px; }
.k { font-size: 12px; color: rgba(0,0,0,.6); }
.v { margin-top: 6px; font-size: 16px; font-weight: 900; }
.s { margin-top: 6px; font-size: 12px; color: rgba(0,0,0,.55); }
.hint { font-size: 12px; color: rgba(0,0,0,.55); margin-top: 4px; }
.amt { text-align: right; font-weight: 800; }
.row { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
