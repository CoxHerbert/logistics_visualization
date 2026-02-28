<template>
  <div class="page">
    <a-page-header title="FBA 运输成本预估" sub-title="用户端：少字段强引导。快速出区间价；精准版支持多箱型明细。" />

    <a-card :bordered="false" class="card">
      <a-tabs v-model:activeKey="tab">
        <!-- Quick -->
        <a-tab-pane key="quick" tab="快速预估（10秒）">
          <a-row :gutter="16">
            <a-col :span="14">
              <a-form layout="vertical">
                <a-row :gutter="12">
                  <a-col :span="8">
                    <a-form-item label="服务类型">
                      <a-select v-model:value="quick.serviceType" :options="serviceOptions" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="起运地">
                      <a-input v-model:value="quick.origin" placeholder="如：上海/宁波/深圳" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="目的地">
                      <a-input v-model:value="quick.destination" placeholder="如：LAX / 纽约 / ONT8" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="品名">
                  <a-input v-model:value="quick.goodsName" placeholder="如：玩具/家居用品/电子配件" />
                </a-form-item>

                <a-row :gutter="12">
                  <a-col :span="12">
                    <a-form-item label="总体积（CBM）">
                      <a-input-number v-model:value="quick.totalCbm" :min="0" :step="0.0001" style="width:100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="总重量（kg）">
                      <a-input-number v-model:value="quick.totalKg" :min="0" :step="0.01" style="width:100%" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <div class="flags">
                  <a-checkbox v-model:checked="quick.isBattery">带电</a-checkbox>
                  <a-checkbox v-model:checked="quick.isLiquid">液体</a-checkbox>
                  <a-checkbox v-model:checked="quick.isPowder">粉末</a-checkbox>
                </div>

                <a-alert type="info" show-icon message="建议：快速预估只给区间价。若你不确定 CBM，可切换到「精准报价」用箱型明细自动汇总。"
                  style="margin-top:12px" />
              </a-form>
            </a-col>

            <a-col :span="10">
              <EstimateResult v-if="quickOut" :out="quickOut" :serviceType="quick.serviceType" />
              <a-empty v-else description="填写 CBM 与 KG 后自动生成区间价" />
              <div class="cta">
                <a-button type="primary" size="large" :disabled="!quickOut" @click="submitLead('quick')">
                  获取精准报价（提交线索）
                </a-button>
                <div class="tip">这里示例为前端弹窗。你后续接 portal-api 提交 lead 即可。</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Precise -->
        <a-tab-pane key="precise" tab="精准报价（1分钟）">
          <a-row :gutter="16">
            <a-col :span="14">
              <a-form layout="vertical">
                <a-row :gutter="12">
                  <a-col :span="8">
                    <a-form-item label="服务类型">
                      <a-select v-model:value="precise.serviceType" :options="serviceOptions" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="起运地">
                      <a-input v-model:value="precise.origin" placeholder="如：上海/宁波/深圳" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="目的地">
                      <a-input v-model:value="precise.destination" placeholder="如：LAX / 纽约 / ONT8" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="品名">
                  <a-input v-model:value="precise.goodsName" placeholder="如：玩具/家居用品/电子配件" />
                </a-form-item>

                <div class="flags">
                  <a-checkbox v-model:checked="precise.flags.isBattery">带电</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isLiquid">液体</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isPowder">粉末</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isMagnetic">带磁</a-checkbox>
                </div>

                <div v-if="precise.serviceType === 'FCL'" class="fclBox">
                  <div class="lbl">整柜柜型</div>
                  <a-radio-group v-model:value="containerType" button-style="solid">
                    <a-radio-button value="20GP">20GP</a-radio-button>
                    <a-radio-button value="40GP">40GP</a-radio-button>
                    <a-radio-button value="40HQ">40HQ</a-radio-button>
                  </a-radio-group>
                  <div class="subtip">整柜用户端通常只需选柜型 + 基本信息；箱型明细可选（用于建议装柜）。</div>
                </div>

                <CartonCardList v-model="precise.cartons" />

                <a-row :gutter="12" style="margin-top:12px">
                  <a-col :span="12">
                    <a-form-item label="货值（USD，可选）">
                      <a-input-number v-model:value="precise.cargoValueUsd" :min="0" :step="0.01" style="width:100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="出货时间（可选）">
                      <a-input v-model:value="precise.readyDate" placeholder="如：下周/2026-03-10" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="备注（可选）">
                  <a-textarea v-model:value="precise.remark" placeholder="如：是否需贴标/是否超长/目的仓代码/地址" />
                </a-form-item>
              </a-form>
            </a-col>

            <a-col :span="10">
              <EstimateResult v-if="preciseOut" :out="preciseOut" :serviceType="precise.serviceType" />
              <a-empty v-else description="至少添加一个箱型并填写尺寸/箱数/重量" />

              <div class="cta">
                <a-button type="primary" size="large" :disabled="!preciseOut" @click="submitLead('precise')">
                  提交询价（生成线索）
                </a-button>
                <div class="tip">建议你在提交时带上：origin/destination/goodsName/cartons/flags。</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import CartonCardList from "./components/CartonCardList.vue";
import EstimateResult from "./components/EstimateResult.vue";
import type { QuickForm, PreciseForm, ServiceType } from "./schema";
import { estimate, summarizeCartons } from "./pricing";

const tab = ref<"quick" | "precise">("quick");

const serviceOptions = [
  { label: "拼箱 LCL", value: "LCL" },
  { label: "整柜 FCL", value: "FCL" },
  { label: "海派/海卡（到仓）", value: "SEA_DDP" },
];

const quick = reactive<QuickForm>({
  serviceType: "LCL",
  origin: "上海",
  destination: "洛杉矶 (LAX)",
  goodsName: "",
  totalCbm: undefined,
  totalKg: undefined,
  isBattery: false,
  isLiquid: false,
  isPowder: false,
});

const precise = reactive<PreciseForm>({
  serviceType: "LCL",
  origin: "上海",
  destination: "洛杉矶 (LAX)",
  goodsName: "",
  cartons: [
    { id: "a1", qty: 50, size: "60*40*35", weightKg: 22, name: "主箱" },
    { id: "b1", qty: 30, size: "50*35*30", weightKg: 18, name: "配件箱" },
  ],
  cargoValueUsd: undefined,
  readyDate: "",
  remark: "",
  flags: { isBattery: false, isLiquid: false, isPowder: false, isMagnetic: false },
});

const containerType = ref<"20GP" | "40GP" | "40HQ">("40HQ");

const quickOut = computed(() => {
  const cbm = Number(quick.totalCbm || 0);
  const kg = Number(quick.totalKg || 0);
  if (!(cbm > 0 && kg > 0)) return null;
  return estimate(quick.serviceType as ServiceType, { cbm, kg }, {
    flags: { isBattery: !!quick.isBattery, isLiquid: !!quick.isLiquid, isPowder: !!quick.isPowder }
  });
});

const preciseOut = computed(() => {
  if (!precise.cartons?.length) return null;
  const { cbm, kg } = summarizeCartons(precise.cartons, "cm");
  if (!(cbm > 0 && kg > 0)) return null;
  return estimate(precise.serviceType as ServiceType, { cbm, kg }, {
    containerType: containerType.value,
    flags: precise.flags
  });
});

function submitLead(mode: "quick" | "precise") {
  // 这里演示用 alert；你接 portal-api 时，把 payload POST 出去即可
  const payload = mode === "quick"
    ? { ...quick }
    : { ...precise, containerType: containerType.value, totals: preciseOut.value?.basis };
  alert("提交线索 payload（示例）\\n\\n" + JSON.stringify(payload, null, 2));
}
</script>

<style scoped>
.page {
  padding: 12px
}

.card {
  border-radius: 16px
}

.flags {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 6px
}

.cta {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px
}

.tip {
  font-size: 12px;
  color: rgba(0, 0, 0, .55)
}

.fclBox {
  padding: 12px;
  border: 1px dashed rgba(0, 0, 0, .12);
  border-radius: 14px;
  margin: 8px 0 12px
}

.lbl {
  font-weight: 700;
  margin-bottom: 8px
}

.subtip {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, .55);
  line-height: 1.5
}
</style>
