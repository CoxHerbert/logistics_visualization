<template>
  <a-card title="Step 2 · 装柜条件" :bordered="false">
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="业务场景">
            <a-select :value="form.scenario" @update:value="patch('scenario', $event)">
              <a-select-option value="general">通用出货</a-select-option>
              <a-select-option value="fba">FBA</a-select-option>
              <a-select-option value="traditional">传统外贸</a-select-option>
              <a-select-option value="fragile">易碎货</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="装柜策略">
            <a-select :value="form.strategy" @update:value="patch('strategy', $event)">
              <a-select-option value="conservative">保守</a-select-option>
              <a-select-option value="balanced">平衡</a-select-option>
              <a-select-option value="aggressive">激进</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="柜型选择">
            <a-select mode="multiple" :value="form.selectedContainers" @update:value="patch('selectedContainers', $event)">
              <a-select-option value="20GP">20GP</a-select-option>
              <a-select-option value="40GP">40GP</a-select-option>
              <a-select-option value="40HQ">40HQ</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-button type="link" @click="patch('showAdvanced', !form.showAdvanced)">
        {{ form.showAdvanced ? '收起高级设置' : '展开高级设置' }}
      </a-button>

      <a-row v-if="form.showAdvanced" :gutter="16">
        <a-col :span="8"><a-form-item label="门口预留(cm)"><a-input-number :value="form.reserveDoorCm" style="width:100%" @update:value="patch('reserveDoorCm', $event)" /></a-form-item></a-col>
        <a-col :span="8"><a-form-item label="顶部余量(cm)"><a-input-number :value="form.reserveTopCm" style="width:100%" @update:value="patch('reserveTopCm', $event)" /></a-form-item></a-col>
        <a-col :span="8"><a-form-item label="重量缓冲率"><a-input-number :value="form.weightBufferRate" :step="0.01" :min="0" :max="0.5" style="width:100%" @update:value="patch('weightBufferRate', $event)" /></a-form-item></a-col>
      </a-row>

      <a-row v-if="form.showAdvanced" :gutter="16">
        <a-col :span="8">
          <a-form-item label="20GP 价格 (USD/柜)">
            <a-input-number
              :value="form.oceanFreightByContainer['20GP']"
              :min="0"
              :step="50"
              style="width:100%"
              @update:value="patchFreight('20GP', $event)"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="40GP 价格 (USD/柜)">
            <a-input-number
              :value="form.oceanFreightByContainer['40GP']"
              :min="0"
              :step="50"
              style="width:100%"
              @update:value="patchFreight('40GP', $event)"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="40HQ 价格 (USD/柜)">
            <a-input-number
              :value="form.oceanFreightByContainer['40HQ']"
              :min="0"
              :step="50"
              style="width:100%"
              @update:value="patchFreight('40HQ', $event)"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-space v-if="form.showAdvanced">
        <a-checkbox :checked="form.enableDoorCheck" @update:checked="patch('enableDoorCheck', $event)">启用柜门校验</a-checkbox>
        <a-checkbox :checked="form.heavyForward" @update:checked="patch('heavyForward', $event)">重货靠前</a-checkbox>
      </a-space>
    </a-form>

    <template #actions>
      <div style="display:flex;justify-content:space-between;width:100%">
        <a-button @click="emit('prev')">上一步</a-button>
        <a-button type="primary" @click="emit('calculate')">立即计算</a-button>
      </div>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import type { ConstraintForm } from '@/types/containerWizard';

const props = defineProps<{ form: ConstraintForm }>();
const emit = defineEmits<{
  (e: 'update:form', value: Partial<ConstraintForm>): void;
  (e: 'prev'): void;
  (e: 'calculate'): void;
}>();

function patch<K extends keyof ConstraintForm>(key: K, value: ConstraintForm[K]) {
  emit('update:form', { [key]: value } as Partial<ConstraintForm>);
}

function patchFreight(code: '20GP' | '40GP' | '40HQ', value?: number) {
  emit('update:form', {
    oceanFreightByContainer: {
      ...props.form.oceanFreightByContainer,
      [code]: value ?? 0,
    },
  });
}
</script>
