<template>
  <a-card :bordered="false" class="card">
    <template #title>
      <div class="titleRow">
        <span class="t">箱型明细（多规格 · 紧凑版）</span>
        <a-tag color="blue">尺寸支持 60*40*35 / 60x40x35 / 60×40×35 / 60 40 35</a-tag>
      </div>
    </template>

    <div class="pasteBox">
      <a-collapse ghost>
        <a-collapse-panel key="1" header="粘贴箱规自动解析（V2增强）">
          <div class="hint">
            一行一个箱型，示例：<br/>
            <code>箱型A 50 60*40*35 22kg</code><br/>
            <code>50箱 60x40x35cm 22kg</code><br/>
            <code>60×40×35 22kg x50</code><br/>
            <code>配件箱 qty=30 size=50*35*30 weight=18</code><br/>
            <code>50ctn 0.084cbm 22kg</code>
          </div>
          <a-textarea v-model:value="pasteText" :rows="5" placeholder="把客户发来的箱规/明细直接粘贴到这里…" />
          <div class="pasteActions">
            <a-button type="primary" @click="applyParsed('append')">解析并追加</a-button>
            <a-button @click="applyParsed('replace')">解析并覆盖</a-button>
            <a-button type="text" @click="pasteText = ''">清空</a-button>
          </div>
          <a-alert v-if="parseTip" type="info" show-icon :message="parseTip" style="margin-top:10px" />
        </a-collapse-panel>
      </a-collapse>
    </div>

    <template #extra>
      <a-button type="primary" @click="addRow">新增箱型</a-button>
    </template>

    <a-table
      :dataSource="rows"
      :columns="columns"
      :pagination="false"
      size="small"
      rowKey="id"
      :scroll="{ x: 980 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-input v-model:value="record.name" placeholder="箱型A（可选）" size="small" />
        </template>

        <template v-else-if="column.key === 'qty'">
          <a-input-number v-model:value="record.qty" :min="0" :step="1" size="small" style="width: 100%" />
        </template>

        <template v-else-if="column.key === 'size'">
          <a-input v-model:value="record.size" placeholder="60*40*35" size="small" />
          <div class="hint">单位：{{ unit }}</div>
        </template>

        <template v-else-if="column.key === 'weightKg'">
          <a-input-number v-model:value="record.weightKg" :min="0" :step="0.01" size="small" style="width: 100%" />
        </template>

        <template v-else-if="column.key === 'cbm'">
          <a-input-number v-model:value="record.cbm" :min="0" :step="0.000001" size="small" style="width: 100%" placeholder="可选" />
          <div class="hint">留空则按尺寸算</div>
        </template>

        <template v-else-if="column.key === 'rowOut'">
          <div class="out">
            <a-tag>{{ rowCbm(record).toFixed(6).replace(/\.?0+$/,'') }} CBM</a-tag>
            <div class="hint">{{ rowKg(record).toFixed(2).replace(/\.?0+$/,'') }} kg</div>
          </div>
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-button danger type="text" size="small" @click="removeRow(record.id)">删</a-button>
        </template>
      </template>
    </a-table>

    <div class="sum">
      <div class="kpi">总箱数：<b>{{ totals.totalCartons }}</b></div>
      <div class="kpi">总体积：<b>{{ totals.totalCbm.toFixed(6).replace(/\.?0+$/,'') }}</b> CBM</div>
      <div class="kpi">总实重：<b>{{ totals.totalKg.toFixed(2).replace(/\.?0+$/,'') }}</b> kg</div>
      <div class="kpi">计费重：<b>{{ totals.chargeableKg.toFixed(2).replace(/\.?0+$/,'') }}</b> kg</div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CartonRow } from "../utils/pricing";
import { parseSizeToCbm, summarizeCartons, parseCartonText } from "../utils/pricing";

const props = defineProps<{
  modelValue: CartonRow[];
  unit: "cm" | "m";
  airDivisor: number;
}>();

const pasteText = ref("");
const parseTip = ref("");

const emit = defineEmits<{
  (e: "update:modelValue", v: CartonRow[]): void;
  (e: "totals", v: ReturnType<typeof summarizeCartons>): void;
}>();

function uid() {
  return Math.random().toString(16).slice(2, 10);
}

function addRow() {
  const next = props.modelValue.slice();
  next.push({ id: uid(), name: "新箱型", qty: 1, size: "60*40*35", weightKg: 1 });
  emit("update:modelValue", next);
}

function removeRow(id: string) {
  emit("update:modelValue", props.modelValue.filter((x) => x.id !== id));
}

function applyParsed(mode: "append" | "replace") {
  const parsed = parseCartonText(pasteText.value);
  if (!parsed.length) {
    parseTip.value = "未识别到有效箱型：至少需要『箱数 + 尺寸』或『箱数 + 单箱CBM』。";
    return;
  }
  const mapped: CartonRow[] = parsed.map((p) => ({
    id: uid(),
    name: p.name || "解析箱型",
    qty: p.qty,
    size: p.size,
    weightKg: p.weightKg || 0,
    cbm: p.cbm,
  }));
  const next = mode === "replace" ? mapped : props.modelValue.concat(mapped);
  emit("update:modelValue", next);
  parseTip.value = `解析成功：${mapped.length} 行已${mode === "replace" ? "覆盖" : "追加"}。`;
}

const rows = computed(() => props.modelValue);

const columns = [
  { title: "箱型", key: "name", width: 180 },
  { title: "箱数", key: "qty", width: 90 },
  { title: "尺寸 L×W×H", key: "size", width: 200 },
  { title: "单箱重(kg)", key: "weightKg", width: 120 },
  { title: "单箱CBM(可选)", key: "cbm", width: 140 },
  { title: "行CBM/行KG", key: "rowOut", width: 150 },
  { title: "", key: "actions", width: 60 },
];

function rowCbm(r: CartonRow) {
  const qty = Math.max(0, Math.floor(Number(r.qty || 0)));
  const per = r.cbm && r.cbm > 0 ? r.cbm : parseSizeToCbm(r.size, props.unit);
  return qty * per;
}
function rowKg(r: CartonRow) {
  const qty = Math.max(0, Math.floor(Number(r.qty || 0)));
  return qty * Number(r.weightKg || 0);
}

const totals = computed(() => {
  const t = summarizeCartons(props.modelValue, props.unit, props.airDivisor);
  emit("totals", t);
  return t;
});
</script>

<style scoped>
.card { border-radius: 16px; }
.titleRow { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.t { font-weight: 800; }
.hint { font-size: 12px; color: rgba(0,0,0,.55); margin-top: 4px; }
.out { display: flex; flex-direction: column; align-items: flex-end; }
.pasteBox { margin-bottom: 10px; }
.pasteActions { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
.pasteBox code { background: rgba(0,0,0,.04); padding: 2px 6px; border-radius: 8px; }
.sum { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(0,0,0,.08); }
.kpi { font-size: 12px; color: rgba(0,0,0,.65); }
.kpi b { color: rgba(0,0,0,.88); }
</style>
