<template>
  <div class="page">
    <a-page-header
      title="FBA 成本计算器（自由组合 · Vben Admin）"
      sub-title="多箱型体积汇总 + 8项成本自由组合 + 明细与报价文本"
    />

    <a-row :gutter="[12,12]">
      <a-col :xl="15" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false" class="card">
          <template #title><span class="t">基础信息</span></template>

          <a-form layout="vertical">
            <a-row :gutter="12">
              <a-col :span="8">
                <a-form-item label="模板">
                  <a-select v-model:value="templateId" :options="templateOptions" />
                  <div class="hint">{{ templateNote }}</div>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="始发地">
                  <a-select v-model:value="origin" :options="originOptions" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="目的地">
                  <a-select v-model:value="destination" :options="destOptions" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="12">
              <a-col :span="6">
                <a-form-item label="体积单位">
                  <a-select v-model:value="unit" :options="unitOptions" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="空运体积重除数（cm³/kg）">
                  <a-input-number v-model:value="airDivisor" :min="1" :step="1" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="USD→CNY 汇率">
                  <a-input-number v-model:value="usdCny" :min="0" :step="0.01" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="关税税率（%）">
                  <a-input-number v-model:value="dutyRate" :min="0" :step="0.01" style="width:100%" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item label="申报货值（USD）">
                  <a-input-number v-model:value="cargoUsd" :min="0" :step="0.01" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="备注（可选）">
                  <a-input v-model:value="remark" placeholder="如：目的仓代码/带电/是否超长等" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>

        <CartonTableCompact v-model="cartons" :unit="unit" :airDivisor="airDivisor" @totals="onTotals" />

        <CostItemsTable v-model="items" />
      </a-col>

      <a-col :xl="9" :lg="24" :md="24" :sm="24" :xs="24">
        <ResultPanel
          :bases="bases"
          :breakdown="breakdown"
          :origin="origin"
          :destination="destination"
          :remark="remark"
          :totalCny="totalCny"
          :quoteText="quoteText"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CartonTableCompact from "./components/CartonTableCompact.vue";
import CostItemsTable from "./components/CostItemsTable.vue";
import ResultPanel from "./components/ResultPanel.vue";

import { defaultTemplates, origins, destinations, itemCatalog, type CostItem, type ServiceTemplateId } from "./utils/templates";
import { summarizeCartons, computeCost, buildQuoteText, type CartonRow, type Bases, type BreakdownLine } from "./utils/pricing";

const templateId = ref<ServiceTemplateId>("SEA_LCL_DDU");
const origin = ref(origins[0]);
const destination = ref(destinations[0]);

const unit = ref<"cm" | "m">("cm");
const airDivisor = ref(6000);
const usdCny = ref(7.15);
const dutyRate = ref(10);
const cargoUsd = ref(5000);
const remark = ref("");

const cartons = ref<CartonRow[]>([
  { id: "a1", name: "箱型A", qty: 50, size: "60*40*35", weightKg: 22 },
  { id: "b1", name: "箱型B", qty: 30, size: "50*35*30", weightKg: 18 },
]);

const items = ref<CostItem[]>(JSON.parse(JSON.stringify(defaultTemplates[0].items)));

const totals = ref<ReturnType<typeof summarizeCartons>>(summarizeCartons(cartons.value, unit.value, airDivisor.value));
function onTotals(t: ReturnType<typeof summarizeCartons>) {
  totals.value = t;
}

const templateOptions = defaultTemplates.map((t) => ({ label: t.name, value: t.id }));
const templateNote = computed(() => defaultTemplates.find((t) => t.id === templateId.value)?.notes || "");
const originOptions = origins.map((o) => ({ label: o, value: o }));
const destOptions = destinations.map((d) => ({ label: d, value: d }));
const unitOptions = [
  { label: "cm", value: "cm" },
  { label: "m", value: "m" },
];

watch(templateId, (id) => {
  const tpl = defaultTemplates.find((t) => t.id === id);
  if (tpl) items.value = JSON.parse(JSON.stringify(tpl.items));
});

const bases = computed<Bases>(() => ({
  totalCartons: totals.value.totalCartons,
  totalCbm: totals.value.totalCbm,
  totalKg: totals.value.totalKg,
  chargeableKg: totals.value.chargeableKg,
  cargoUsd: cargoUsd.value,
  dutyRate: dutyRate.value,
  usdCny: usdCny.value,
}));

const cost = computed(() =>
  computeCost(items.value, bases.value, (k) => (itemCatalog as any)[k] || k),
);

const breakdown = computed<BreakdownLine[]>(() => cost.value.breakdown);
const totalCny = computed(() => cost.value.total);

const quoteText = computed(() =>
  buildQuoteText({
    origin: origin.value,
    destination: destination.value,
    bases: bases.value,
    breakdown: breakdown.value,
    remark: remark.value,
  }),
);
</script>

<style scoped>
.page { padding: 12px; }
.card { border-radius: 16px; }
.t { font-weight: 800; }
.hint { font-size: 12px; color: rgba(0,0,0,.55); margin-top: 6px; line-height: 1.5; }
</style>
