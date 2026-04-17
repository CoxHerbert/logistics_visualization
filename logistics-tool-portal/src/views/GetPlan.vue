<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

type PlanRequestForm = {
  contactName: string;
  contactPhone: string;
  departureCity?: string;
  destinationCity?: string;
  shipMode: number;
  cargoType: number;
  remark?: string;
};

const route = useRoute();
const submitting = ref(false);

const formState = reactive<PlanRequestForm>({
  contactName: (route.query.contactName as string) || '',
  contactPhone: (route.query.contactPhone as string) || '',
  departureCity: (route.query.departureCity as string) || (route.query.origin as string) || '',
  destinationCity: (route.query.destinationCity as string) || (route.query.destination as string) || '',
  shipMode: Number(route.query.shipMode || 10),
  cargoType: Number(route.query.cargoType || 10),
  remark: (route.query.remark as string) || '',
});

const shipModeOptions = [
  { label: '快递', value: 10 },
  { label: '零担', value: 20 },
  { label: '整车', value: 30 },
];

const cargoTypeOptions = [
  { label: '普货', value: 10 },
  { label: '易碎', value: 20 },
  { label: '冷链', value: 30 },
];

const formRules = {
  contactName: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
    { min: 2, max: 20, message: '联系人长度需在 2-20 个字符之间', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  shipMode: [{ required: true, message: '请选择运输方式', trigger: 'change' }],
  cargoType: [{ required: true, message: '请选择货物类型', trigger: 'change' }],
};

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }
  submitting.value = true;
  try {
    // 线索管理模块已下线：当前仅保留前端收集与成功提示
    await new Promise((resolve) => setTimeout(resolve, 400));
    message.success('提交成功，我们会尽快与您联系');
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <a-card title="获取运输方案 / 留资" class="get-plan-card">
    <a-alert type="info" show-icon style="margin-bottom: 16px" message="提交后将由顾问回访，提供中美线运输与清关方案。" />

    <a-form layout="vertical" :model="formState" :rules="formRules" @finish="handleSubmit">
      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="联系人" name="contactName">
            <a-input v-model:value="formState.contactName" placeholder="请输入联系人" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="联系电话" name="contactPhone">
            <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="出发地">
            <a-input v-model:value="formState.departureCity" placeholder="如：上海" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="目的地">
            <a-input v-model:value="formState.destinationCity" placeholder="如：洛杉矶" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="24" :md="12">
          <a-form-item label="运输方式" name="shipMode">
            <a-select v-model:value="formState.shipMode" :options="shipModeOptions" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="货物类型" name="cargoType">
            <a-select v-model:value="formState.cargoType" :options="cargoTypeOptions" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="补充说明">
        <a-textarea v-model:value="formState.remark" :rows="4" placeholder="可填写货物品类、重量体积、预计发运时间等" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="submitting" :disabled="submitting">
          提交并获取方案
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style scoped>
.get-plan-card {
  margin-top: 8px;
}
</style>
