<template>
  <div class="page">
    <a-page-header
      title="FBA 头程成本预估"
      sub-title="先快速预估，再直接提交线索，由业务跟进精准报价。"
    />

    <a-card :bordered="false" class="card">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="quick" tab="快速预估（10 秒）">
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
                      <a-input v-model:value="quick.origin" placeholder="如：上海 / 宁波 / 深圳" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="目的地">
                      <a-input v-model:value="quick.destination" placeholder="如：LAX / 纽约 / ONT8" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="品名">
                  <a-input v-model:value="quick.goodsName" placeholder="如：玩具 / 家居用品 / 电子配件" />
                </a-form-item>

                <a-row :gutter="12">
                  <a-col :span="12">
                    <a-form-item label="总体积（CBM）">
                      <a-input-number
                        v-model:value="quick.totalCbm"
                        :min="0"
                        :step="0.0001"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="总重量（kg）">
                      <a-input-number
                        v-model:value="quick.totalKg"
                        :min="0"
                        :step="0.01"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>

                <div class="flags">
                  <a-checkbox v-model:checked="quick.isBattery">带电</a-checkbox>
                  <a-checkbox v-model:checked="quick.isLiquid">液体</a-checkbox>
                  <a-checkbox v-model:checked="quick.isPowder">粉末</a-checkbox>
                </div>

                <a-alert
                  type="info"
                  show-icon
                  message="快速预估只提供区间价。需要精准报价时，直接提交线索即可。"
                  style="margin-top: 12px"
                />
              </a-form>
            </a-col>

            <a-col :span="10">
              <EstimateResult v-if="quickOut" :out="quickOut" :serviceType="quick.serviceType" />
              <a-empty v-else description="填写 CBM 和 KG 后自动生成区间价" />
              <div class="cta">
                <a-button type="primary" size="large" :disabled="!quickOut" @click="openLeadModal('quick')">
                  获取精准报价
                </a-button>
                <div class="tip">无需登录，提交后会直接保存到 CRM 线索。</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="precise" tab="精准报价（1 分钟）">
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
                      <a-input v-model:value="precise.origin" placeholder="如：上海 / 宁波 / 深圳" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="目的地">
                      <a-input v-model:value="precise.destination" placeholder="如：LAX / 纽约 / ONT8" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="品名">
                  <a-input v-model:value="precise.goodsName" placeholder="如：玩具 / 家居用品 / 电子配件" />
                </a-form-item>

                <div class="flags">
                  <a-checkbox v-model:checked="precise.flags.isBattery">带电</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isLiquid">液体</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isPowder">粉末</a-checkbox>
                  <a-checkbox v-model:checked="precise.flags.isMagnetic">带磁</a-checkbox>
                </div>

                <div v-if="precise.serviceType === 'FCL'" class="fcl-box">
                  <div class="label-strong">整柜柜型</div>
                  <a-radio-group v-model:value="containerType" button-style="solid">
                    <a-radio-button value="20GP">20GP</a-radio-button>
                    <a-radio-button value="40GP">40GP</a-radio-button>
                    <a-radio-button value="40HQ">40HQ</a-radio-button>
                  </a-radio-group>
                  <div class="subtip">整柜报价会受柜型、地址、时效和旺季影响，建议提交后人工确认。</div>
                </div>

                <CartonCardList v-model="precise.cartons" />

                <a-row :gutter="12" style="margin-top: 12px">
                  <a-col :span="12">
                    <a-form-item label="货值（USD，可选）">
                      <a-input-number
                        v-model:value="precise.cargoValueUsd"
                        :min="0"
                        :step="0.01"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="出货时间（可选）">
                      <a-input v-model:value="precise.readyDate" placeholder="如：下周 / 2026-05-01" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="业务备注（可选）">
                  <a-textarea
                    v-model:value="precise.remark"
                    :rows="3"
                    placeholder="如：是否贴标、目的仓代码、是否超长、是否需要派送"
                  />
                </a-form-item>
              </a-form>
            </a-col>

            <a-col :span="10">
              <EstimateResult v-if="preciseOut" :out="preciseOut" :serviceType="precise.serviceType" />
              <a-empty v-else description="至少添加一个箱型并填写尺寸、数量、重量" />

              <div class="cta">
                <a-button type="primary" size="large" :disabled="!preciseOut" @click="openLeadModal('precise')">
                  提交询价
                </a-button>
                <div class="tip">提交后会按当前测算结果和填写信息生成 CRM 线索。</div>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      v-model:open="leadModalOpen"
      title="提交线索"
      :confirm-loading="submittingLead"
      ok-text="提交"
      cancel-text="取消"
      @ok="submitLead"
    >
      <a-form layout="vertical">
        <a-form-item label="公司 / 联系人名称" required>
          <a-input v-model:value="leadForm.name" maxlength="255" placeholder="如：宁波雷之声" />
        </a-form-item>
        <a-form-item label="手机号" required>
          <a-input v-model:value="leadForm.mobile" maxlength="20" placeholder="用于销售回访" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="leadForm.email" maxlength="255" placeholder="可选，便于发送报价" />
        </a-form-item>
        <a-form-item label="微信">
          <a-input v-model:value="leadForm.wechat" maxlength="255" placeholder="可选" />
        </a-form-item>
        <a-form-item label="QQ">
          <a-input v-model:value="leadForm.qq" maxlength="20" placeholder="可选" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            v-model:value="leadForm.remark"
            :rows="3"
            maxlength="500"
            placeholder="可补充收货地址、仓库代码、贴标要求等"
          />
        </a-form-item>
      </a-form>
      <div class="tip">
        当前提交会自动带上本页测算摘要；为避免刷接口，前端会做冷却限制，后端也做了 IP 限流。
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

import { createPortalClue } from '@/api/portal';

import CartonCardList from './components/CartonCardList.vue';
import EstimateResult from './components/EstimateResult.vue';
import { estimate, summarizeCartons } from './pricing';
import type { PreciseForm, QuickForm, ServiceType } from './schema';

const LOCAL_RATE_LIMIT_KEY = 'portal_clue_submit_records_v1';
const LOCAL_MIN_INTERVAL_MS = 60 * 1000;
const LOCAL_MAX_SUBMITS_PER_DAY = 3;

const tab = ref<'quick' | 'precise'>('quick');
const leadMode = ref<'quick' | 'precise'>('quick');
const leadModalOpen = ref(false);
const submittingLead = ref(false);

const serviceOptions = [
  { label: '拼箱 LCL', value: 'LCL' },
  { label: '整柜 FCL', value: 'FCL' },
  { label: '海派 / 海卡', value: 'SEA_DDP' },
];

const quick = reactive<QuickForm>({
  serviceType: 'LCL',
  origin: '上海',
  destination: '洛杉矶（LAX）',
  goodsName: '',
  totalCbm: undefined,
  totalKg: undefined,
  isBattery: false,
  isLiquid: false,
  isPowder: false,
});

const precise = reactive<PreciseForm>({
  serviceType: 'LCL',
  origin: '上海',
  destination: '洛杉矶（LAX）',
  goodsName: '',
  cartons: [
    { id: 'a1', qty: 50, size: '60*40*35', weightKg: 22, name: '主箱' },
    { id: 'b1', qty: 30, size: '50*35*30', weightKg: 18, name: '配件箱' },
  ],
  cargoValueUsd: undefined,
  readyDate: '',
  remark: '',
  flags: { isBattery: false, isLiquid: false, isPowder: false, isMagnetic: false },
});

const leadForm = reactive({
  name: '',
  mobile: '',
  email: '',
  wechat: '',
  qq: '',
  remark: '',
});

const containerType = ref<'20GP' | '40GP' | '40HQ'>('40HQ');

const quickOut = computed(() => {
  const cbm = Number(quick.totalCbm || 0);
  const kg = Number(quick.totalKg || 0);
  if (!(cbm > 0 && kg > 0)) return null;
  return estimate(quick.serviceType as ServiceType, { cbm, kg }, {
    flags: { isBattery: !!quick.isBattery, isLiquid: !!quick.isLiquid, isPowder: !!quick.isPowder },
  });
});

const preciseOut = computed(() => {
  if (!precise.cartons?.length) return null;
  const { cbm, kg } = summarizeCartons(precise.cartons, 'cm');
  if (!(cbm > 0 && kg > 0)) return null;
  return estimate(precise.serviceType as ServiceType, { cbm, kg }, {
    containerType: containerType.value,
    flags: precise.flags,
  });
});

function formatFlagList(flags: Record<string, boolean>, labels: Record<string, string>) {
  return Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([key]) => labels[key])
    .join('、');
}

function safeTrim(value?: string) {
  return value?.trim() || '';
}

function openLeadModal(mode: 'quick' | 'precise') {
  if (mode === 'quick' && !quickOut.value) {
    message.error('请先完成快速预估');
    return;
  }
  if (mode === 'precise' && !preciseOut.value) {
    message.error('请先完成精准测算');
    return;
  }
  leadMode.value = mode;
  leadModalOpen.value = true;
}

function getLocalSubmitRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_RATE_LIMIT_KEY);
    if (!raw) return [] as number[];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Number.isFinite(item));
  } catch {
    return [];
  }
}

function validateLocalSubmitLimit() {
  const now = Date.now();
  const records = getLocalSubmitRecords().filter((item) => now - item < 24 * 60 * 60 * 1000);
  const latest = records[records.length - 1];

  if (latest && now - latest < LOCAL_MIN_INTERVAL_MS) {
    const remainSeconds = Math.ceil((LOCAL_MIN_INTERVAL_MS - (now - latest)) / 1000);
    throw new Error(`提交过于频繁，请 ${remainSeconds} 秒后再试`);
  }

  if (records.length >= LOCAL_MAX_SUBMITS_PER_DAY) {
    throw new Error('今日提交次数已达上限，请明天再试');
  }

  return records;
}

function persistSubmitRecord(records: number[]) {
  const nextRecords = [...records, Date.now()];
  localStorage.setItem(LOCAL_RATE_LIMIT_KEY, JSON.stringify(nextRecords));
}

function buildLeadRemark(mode: 'quick' | 'precise') {
  const sections: string[] = [];
  const userRemark = safeTrim(leadForm.remark);
  if (userRemark) {
    sections.push(`客户备注：${userRemark}`);
  }

  if (mode === 'quick' && quickOut.value) {
    const flags = formatFlagList(
      {
        isBattery: !!quick.isBattery,
        isLiquid: !!quick.isLiquid,
        isPowder: !!quick.isPowder,
      },
      {
        isBattery: '带电',
        isLiquid: '液体',
        isPowder: '粉末',
      },
    );

    sections.push('询价摘要：');
    sections.push(`模式：快速预估`);
    sections.push(`服务类型：${quick.serviceType}`);
    sections.push(`起运地：${safeTrim(quick.origin) || '-'}`);
    sections.push(`目的地：${safeTrim(quick.destination) || '-'}`);
    sections.push(`品名：${safeTrim(quick.goodsName) || '-'}`);
    sections.push(`总体积：${quick.totalCbm || 0} CBM`);
    sections.push(`总重量：${quick.totalKg || 0} KG`);
    if (flags) {
      sections.push(`特殊属性：${flags}`);
    }
    sections.push(`预估说明：${quickOut.value.notes.join('；')}`);
  }

  if (mode === 'precise' && preciseOut.value) {
    const flags = formatFlagList(precise.flags, {
      isBattery: '带电',
      isLiquid: '液体',
      isPowder: '粉末',
      isMagnetic: '带磁',
    });
    const cartonSummary = precise.cartons
      .slice(0, 3)
      .map((carton) => `${carton.name || '箱型'} x${carton.qty} ${carton.size} ${carton.weightKg}kg`)
      .join('；');

    sections.push('询价摘要：');
    sections.push('模式：精准报价');
    sections.push(`服务类型：${precise.serviceType}`);
    sections.push(`起运地：${safeTrim(precise.origin) || '-'}`);
    sections.push(`目的地：${safeTrim(precise.destination) || '-'}`);
    sections.push(`品名：${safeTrim(precise.goodsName) || '-'}`);
    if (precise.serviceType === 'FCL') {
      sections.push(`柜型：${containerType.value}`);
    }
    sections.push(`箱型摘要：${cartonSummary || '-'}`);
    sections.push(`箱型数量：${precise.cartons.length}`);
    if (precise.cargoValueUsd) {
      sections.push(`货值：${precise.cargoValueUsd} USD`);
    }
    if (safeTrim(precise.readyDate)) {
      sections.push(`出货时间：${safeTrim(precise.readyDate)}`);
    }
    if (flags) {
      sections.push(`特殊属性：${flags}`);
    }
    if (safeTrim(precise.remark)) {
      sections.push(`测算备注：${safeTrim(precise.remark)}`);
    }
    sections.push(`预估说明：${preciseOut.value.notes.join('；')}`);
  }

  return sections.join('\n').slice(0, 500);
}

async function submitLead() {
  const name = safeTrim(leadForm.name);
  const mobile = safeTrim(leadForm.mobile);

  if (!name) {
    message.error('请填写公司或联系人名称');
    return;
  }
  if (!mobile) {
    message.error('请填写手机号');
    return;
  }

  let records: number[] = [];
  try {
    records = validateLocalSubmitLimit();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '提交过于频繁');
    return;
  }

  submittingLead.value = true;
  try {
    await createPortalClue({
      name,
      mobile,
      telephone: mobile,
      email: safeTrim(leadForm.email) || undefined,
      wechat: safeTrim(leadForm.wechat) || undefined,
      qq: safeTrim(leadForm.qq) || undefined,
      remark: buildLeadRemark(leadMode.value) || undefined,
    });
    persistSubmitRecord(records);
    leadModalOpen.value = false;
    message.success('线索已提交，我们会尽快联系你');
    leadForm.remark = '';
  } catch (error) {
    message.error(error instanceof Error ? error.message : '线索提交失败');
  } finally {
    submittingLead.value = false;
  }
}
</script>

<style scoped>
.page {
  padding: 12px;
}

.card {
  border-radius: 16px;
}

.flags {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.cta {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}

.fcl-box {
  padding: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  margin: 8px 0 12px;
}

.label-strong {
  font-weight: 700;
  margin-bottom: 8px;
}

.subtip {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.5;
}
</style>
