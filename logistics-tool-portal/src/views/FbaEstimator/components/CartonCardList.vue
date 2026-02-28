<template>
  <div class="box">
    <div class="head">
      <div>
        <div class="title">箱型明细（支持多规格）</div>
        <div class="sub">每个箱型一张卡：箱数 + 尺寸 + 单箱重。尺寸支持 60*40*35 / 60x40x35 / 60×40×35。</div>
      </div>
      <a-button type="primary" @click="add">新增箱型</a-button>
    </div>

    <a-row :gutter="[12,12]">
      <a-col v-for="(it, idx) in modelValue" :key="it.id" :xs="24" :md="12" :xl="8">
        <a-card size="small" :title="`箱型 #${idx+1}`" :bordered="true">
          <template #extra>
            <a-button danger type="text" @click="remove(it.id)">删除</a-button>
          </template>

          <a-form layout="vertical">
            <a-form-item label="箱型名称（可选）">
              <a-input v-model:value="it.name" placeholder="如：主箱/配件箱" />
            </a-form-item>

            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item label="箱数">
                  <a-input-number v-model:value="it.qty" :min="0" :step="1" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="单箱重量(kg)">
                  <a-input-number v-model:value="it.weightKg" :min="0" :step="0.01" style="width:100%" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="尺寸 L×W×H（cm）">
              <a-input v-model:value="it.size" placeholder="60*40*35" />
            </a-form-item>

            <a-form-item label="单箱CBM（可选，优先使用）">
              <a-input-number v-model:value="it.cbm" :min="0" :step="0.000001" style="width:100%" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <div class="foot">
      <div class="kpi">总箱数：<b>{{ totals.cartons }}</b></div>
      <div class="kpi">总体积：<b>{{ totals.cbm.toFixed(6).replace(/\.?0+$/,'') }}</b> CBM</div>
      <div class="kpi">总实重：<b>{{ totals.kg.toFixed(2).replace(/\.?0+$/,'') }}</b> kg</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CartonLine } from "../schema";
import { summarizeCartons } from "../pricing";

const props = defineProps<{
  modelValue: CartonLine[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: CartonLine[]): void;
}>();

function uid(){
  return Math.random().toString(16).slice(2,10);
}

function add(){
  const next = props.modelValue.slice();
  next.push({ id: uid(), qty: 1, size: "60*40*35", weightKg: 1, name: "", cbm: undefined });
  emit("update:modelValue", next);
}

function remove(id: string){
  emit("update:modelValue", props.modelValue.filter(x => x.id !== id));
}

const totals = computed(() => {
  const { cbm, kg } = summarizeCartons(props.modelValue, "cm");
  const cartons = props.modelValue.reduce((s, c) => s + Math.max(0, Math.floor(Number(c.qty || 0))), 0);
  return { cbm, kg, cartons };
});
</script>

<style scoped>
.box { border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 16px; background: #fff; }
.head { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; margin-bottom: 12px; }
.title { font-size: 14px; font-weight: 700; }
.sub { font-size: 12px; color: rgba(0,0,0,.55); margin-top: 6px; line-height: 1.5; }
.foot { display:flex; gap:18px; flex-wrap:wrap; margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(0,0,0,.08); }
.kpi { font-size: 12px; color: rgba(0,0,0,.65); }
.kpi b { color: rgba(0,0,0,.88); }
</style>
