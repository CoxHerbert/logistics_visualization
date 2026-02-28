<template>
  <a-card :bordered="true" style="border-radius:16px">
    <div class="title">预估结果</div>

    <a-row :gutter="12" style="margin-top:12px">
      <a-col :span="12">
        <div class="kpi">
          <div class="k">价格区间（CNY）</div>
          <div class="v">¥ {{ fmt(out.priceMinCny) }} ~ ¥ {{ fmt(out.priceMaxCny) }}</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">时效区间（天）</div>
          <div class="v">{{ out.transitMinDays }} ~ {{ out.transitMaxDays }} 天</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">计费参考</div>
          <div class="v">{{ out.basis.cbm.toFixed(6).replace(/\.?0+$/,'') }} CBM / {{ out.basis.kg.toFixed(2).replace(/\.?0+$/,'') }} kg</div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="kpi">
          <div class="k">口径提示</div>
          <div class="v small">{{ toneTip }}</div>
        </div>
      </a-col>
    </a-row>

    <a-divider />

    <a-row :gutter="12">
      <a-col :span="12">
        <div class="sec">
          <div class="secT">包含</div>
          <ul>
            <li v-for="x in out.included" :key="x">{{ x }}</li>
          </ul>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="sec">
          <div class="secT">不包含</div>
          <ul>
            <li v-for="x in out.excluded" :key="x">{{ x }}</li>
          </ul>
        </div>
      </a-col>
    </a-row>

    <div v-if="out.notes.length" class="notes">
      <div class="secT">说明</div>
      <ul>
        <li v-for="n in out.notes" :key="n">{{ n }}</li>
      </ul>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { EstimateOut } from "../pricing";
import type { ServiceType } from "../schema";
import { computed } from "vue";

const props = defineProps<{ out: EstimateOut; serviceType: ServiceType }>();

const fmt = (n:number) => new Intl.NumberFormat("zh-CN").format(Math.round(n));

const toneTip = computed(() => {
  if (props.serviceType === "SEA_DDP") return "海派/海卡口径通常为到仓一口价（是否含税以最终确认为准）";
  if (props.serviceType === "FCL") return "整柜价格与提柜/还柜地址、柜型、旺季关系大，建议提交线索拿精准价";
  return "拼箱价格会随旺季、查验、目的仓/地址属性波动，建议以确认单为准";
});
</script>

<style scoped>
.title{font-weight:800;font-size:14px}
.kpi{padding:10px 12px;background:#fafafa;border-radius:12px}
.k{font-size:12px;color:rgba(0,0,0,.6)}
.v{margin-top:6px;font-size:14px;font-weight:800}
.v.small{font-size:12px;font-weight:600;color:rgba(0,0,0,.65)}
.secT{font-weight:700;margin-bottom:6px}
.sec ul{margin:0;padding-left:18px;color:rgba(0,0,0,.7)}
.notes{margin-top:10px;padding:10px 12px;background:#fff7e6;border-radius:12px}
</style>
