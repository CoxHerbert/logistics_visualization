<template>
  <a-card :bordered="false" class="card">
    <template #title>
      <div class="titleRow">
        <span class="t">成本项（自由组合）</span>
        <a-tag>8项可开关</a-tag>
      </div>
    </template>

    <a-table
      :dataSource="items"
      :columns="columns"
      :pagination="false"
      size="small"
      rowKey="key"
      :scroll="{ x: 980 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'item'">
          <div>
            <b>{{ labelOf(record.key) }}</b>
            <div class="hint">{{ record.note }}</div>
          </div>
        </template>

        <template v-else-if="column.key === 'enabled'">
          <a-switch v-model:checked="record.enabled" size="small" />
        </template>

        <template v-else-if="column.key === 'chargeType'">
          <a-select
            v-model:value="record.chargeType"
            :options="chargeTypeOptions"
            size="small"
            style="width: 180px"
          />
        </template>

        <template v-else-if="column.key === 'currency'">
          <a-select v-model:value="record.currency" size="small" style="width: 90px">
            <a-select-option value="CNY">CNY</a-select-option>
            <a-select-option value="USD">USD</a-select-option>
          </a-select>
        </template>

        <template v-else-if="column.key === 'rate'">
          <a-input-number
            v-if="record.chargeType !== 'PERCENT_CARGO_VALUE'"
            v-model:value="record.rate"
            :min="0"
            :step="0.01"
            size="small"
            style="width: 140px"
          />
          <a-input-number
            v-else
            v-model:value="record.percent"
            :min="0"
            :step="0.01"
            size="small"
            style="width: 140px"
            addon-after="%"
          />
          <div class="hint">{{ record.chargeType === 'PERCENT_CARGO_VALUE' ? '填百分比' : '填费率/金额' }}</div>
        </template>

        <template v-else-if="column.key === 'minBase'">
          <a-input-number v-model:value="record.minBase" :min="0" :step="0.01" size="small" style="width: 120px" />
        </template>

        <template v-else-if="column.key === 'minFee'">
          <a-input-number v-model:value="record.minFee" :min="0" :step="0.01" size="small" style="width: 120px" />
        </template>
      </template>
    </a-table>

    <div class="hint" style="margin-top: 10px">
      说明：阶梯/表达式（更高级）建议放“销售端/后台配置”里做；用户端不推荐暴露。
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { CostItem } from "../utils/templates";
import { chargeTypeOptions, itemCatalog } from "../utils/templates";

const props = defineProps<{
  modelValue: CostItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: CostItem[]): void;
}>();

const items = props.modelValue;

const columns = [
  { title: "成本项", key: "item", width: 220 },
  { title: "启用", key: "enabled", width: 80 },
  { title: "计费方式", key: "chargeType", width: 210 },
  { title: "币种", key: "currency", width: 110 },
  { title: "费率/金额", key: "rate", width: 190 },
  { title: "最低基数", key: "minBase", width: 140 },
  { title: "最低收费", key: "minFee", width: 140 },
];

function labelOf(k: string) {
  return (itemCatalog as any)[k] || k;
}
</script>

<style scoped>
.card { border-radius: 16px; }
.titleRow { display: flex; gap: 10px; align-items: center; }
.t { font-weight: 800; }
.hint { font-size: 12px; color: rgba(0,0,0,.55); margin-top: 4px; line-height: 1.4; }
</style>
