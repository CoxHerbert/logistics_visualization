<template>
  <a-card class="section-card" title="货物信息 V4" :bordered="false">
    <a-space direction="vertical" size="middle" style="width: 100%">
      <a-radio-group :value="mode" button-style="solid" @update:value="emit('update:mode', $event)">
        <a-radio-button value="single">单箱规模式</a-radio-button>
        <a-radio-button value="mixed">多 SKU 估算</a-radio-button>
      </a-radio-group>

      <a-card size="small" title="计算策略" :bordered="false" style="background: #f8fafc">
        <a-row :gutter="12">
          <a-col :span="12">
            <div class="mini-label">装柜策略</div>
            <a-select :value="localOptions.loadingProfile" style="width: 100%" @update:value="updateOption('loadingProfile', $event)">
              <a-select-option value="conservative">保守</a-select-option>
              <a-select-option value="balanced">平衡</a-select-option>
              <a-select-option value="aggressive">激进</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <div class="mini-label">业务场景</div>
            <a-select :value="localOptions.scenario" style="width: 100%" @update:value="updateOption('scenario', $event)">
              <a-select-option value="general">通用出货</a-select-option>
              <a-select-option value="fba">FBA</a-select-option>
              <a-select-option value="traditional">传统外贸</a-select-option>
              <a-select-option value="fragile">易碎货</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <div class="mini-label">装载方向</div>
            <a-select :value="localOptions.loadDirection" style="width: 100%" @update:value="updateOption('loadDirection', $event)">
              <a-select-option value="tail-first">尾门优先</a-select-option>
              <a-select-option value="balanced">前后均衡</a-select-option>
              <a-select-option value="heavy-front">重货靠前</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <div class="mini-label">重箱预警(kg/箱)</div>
            <a-input-number :value="localOptions.floorWeightAlertKg" :min="20" :precision="0" style="width: 100%" @update:value="updateOption('floorWeightAlertKg', $event || 20)" />
          </a-col>
          <a-col :span="8">
            <div class="mini-label">预留门口空间(cm)</div>
            <a-input-number :value="localOptions.reserveDoorSpaceCm" :min="0" :precision="0" style="width: 100%" @update:value="updateOption('reserveDoorSpaceCm', $event || 0)" />
          </a-col>
          <a-col :span="8">
            <div class="mini-label">预留顶部空间(cm)</div>
            <a-input-number :value="localOptions.reserveTopSpaceCm" :min="0" :precision="0" style="width: 100%" @update:value="updateOption('reserveTopSpaceCm', $event || 0)" />
          </a-col>
          <a-col :span="8">
            <div class="mini-label">重量缓冲(%)</div>
            <a-input-number :value="localOptions.reserveWeightBufferRate * 100" :min="0" :max="30" :precision="0" style="width: 100%" @update:value="updateWeightBuffer" />
          </a-col>
          <a-col :span="24">
            <a-checkbox :checked="localOptions.enforceDoorCheck" @update:checked="updateOption('enforceDoorCheck', $event)">启用柜门净口检查</a-checkbox>
          </a-col>
        </a-row>
      </a-card>

      <template v-if="mode === 'single'">
        <a-form ref="singleFormRef" layout="vertical" :model="localCargo" :rules="rules">
          <a-row :gutter="12">
            <a-col :span="12"><a-form-item label="单箱长(cm)" name="lengthCm"><a-input-number v-model:value="localCargo.lengthCm" style="width: 100%" :min="1" :precision="0" /></a-form-item></a-col>
            <a-col :span="12"><a-form-item label="单箱宽(cm)" name="widthCm"><a-input-number v-model:value="localCargo.widthCm" style="width: 100%" :min="1" :precision="0" /></a-form-item></a-col>
            <a-col :span="12"><a-form-item label="单箱高(cm)" name="heightCm"><a-input-number v-model:value="localCargo.heightCm" style="width: 100%" :min="1" :precision="0" /></a-form-item></a-col>
            <a-col :span="12"><a-form-item label="单箱重量(kg)" name="weightKg"><a-input-number v-model:value="localCargo.weightKg" style="width: 100%" :min="0.1" :precision="2" /></a-form-item></a-col>
            <a-col :span="24"><a-form-item label="箱数" name="quantity"><a-input-number v-model:value="localCargo.quantity" style="width: 100%" :min="1" :precision="0" /></a-form-item></a-col>
          </a-row>
          <a-form-item>
            <a-checkbox v-model:checked="localCargo.allowRotate">允许箱体旋转计算</a-checkbox>
          </a-form-item>
        </a-form>
      </template>

      <template v-else>
        <div class="mini-note">V4 混装模式加入柜门净口检查、重箱预警、拆柜建议和操作清单，更适合现场装柜判断。</div>
        <a-table :data-source="localItems" :pagination="false" row-key="id" size="small" :scroll="{ x: 1280 }">
          <a-table-column title="SKU" data-index="skuName" key="skuName" :width="140">
            <template #default="{ record }"><a-input :value="record.skuName" @update:value="updateItem(record.id, 'skuName', $event)" /></template>
          </a-table-column>
          <a-table-column title="长" key="lengthCm" :width="90"><template #default="{ record }"><a-input-number :value="record.lengthCm" :min="1" style="width: 100%" @update:value="updateItem(record.id, 'lengthCm', $event)" /></template></a-table-column>
          <a-table-column title="宽" key="widthCm" :width="90"><template #default="{ record }"><a-input-number :value="record.widthCm" :min="1" style="width: 100%" @update:value="updateItem(record.id, 'widthCm', $event)" /></template></a-table-column>
          <a-table-column title="高" key="heightCm" :width="90"><template #default="{ record }"><a-input-number :value="record.heightCm" :min="1" style="width: 100%" @update:value="updateItem(record.id, 'heightCm', $event)" /></template></a-table-column>
          <a-table-column title="重量" key="weightKg" :width="100"><template #default="{ record }"><a-input-number :value="record.weightKg" :min="0.1" :precision="2" style="width: 100%" @update:value="updateItem(record.id, 'weightKg', $event)" /></template></a-table-column>
          <a-table-column title="数量" key="quantity" :width="100"><template #default="{ record }"><a-input-number :value="record.quantity" :min="1" style="width: 100%" @update:value="updateItem(record.id, 'quantity', $event)" /></template></a-table-column>
          <a-table-column title="限层" key="maxStackLayers" :width="100"><template #default="{ record }"><a-input-number :value="record.maxStackLayers" :min="1" style="width: 100%" placeholder="不限" @update:value="updateItem(record.id, 'maxStackLayers', $event)" /></template></a-table-column>
          <a-table-column title="旋转" key="allowRotate" :width="80"><template #default="{ record }"><a-switch :checked="record.allowRotate" @update:checked="updateItem(record.id, 'allowRotate', $event)" /></template></a-table-column>
          <a-table-column title="易碎" key="fragile" :width="80"><template #default="{ record }"><a-switch :checked="record.fragile" @update:checked="updateItem(record.id, 'fragile', $event)" /></template></a-table-column>
          <a-table-column title="操作" key="actions" :width="90" fixed="right">
            <template #default="{ record }">
              <a-button danger type="link" @click="emit('remove-item', record.id)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <a-button block @click="emit('add-item')">新增 SKU</a-button>
      </template>

      <a-space wrap>
        <a-button type="primary" @click="handleSubmit">开始计算</a-button>
        <a-button @click="$emit('reset')">重置</a-button>
        <a-button @click="$emit('demo-single')">单箱示例</a-button>
        <a-button @click="$emit('demo-mixed')">多 SKU 示例</a-button>
      </a-space>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import { computed, ref } from 'vue';
import type { CalculationOptions, CalculatorMode, CargoInput, CargoItemInput } from '@/types/loadCalculator';

const props = defineProps<{
  mode: CalculatorMode;
  cargo: CargoInput;
  cargoItems: CargoItemInput[];
  options: CalculationOptions;
}>();

const emit = defineEmits<{
  (e: 'update:mode', value: CalculatorMode): void;
  (e: 'update:cargo', value: CargoInput): void;
  (e: 'update:items', value: CargoItemInput[]): void;
  (e: 'update:options', value: CalculationOptions): void;
  (e: 'add-item'): void;
  (e: 'remove-item', id: string): void;
  (e: 'submit'): void;
  (e: 'reset'): void;
  (e: 'demo-single'): void;
  (e: 'demo-mixed'): void;
}>();

const singleFormRef = ref<FormInstance>();

const localCargo = computed({
  get: () => props.cargo,
  set: (value) => emit('update:cargo', { ...value }),
});

const localItems = computed({
  get: () => props.cargoItems,
  set: (value) => emit('update:items', value.map((item) => ({ ...item }))),
});

const localOptions = computed({
  get: () => props.options,
  set: (value) => emit('update:options', { ...value }),
});

const numberRule = (label: string): Rule[] => [
  { required: true, message: `请输入${label}` },
  { type: 'number', min: 1, message: `${label}需大于 0` },
];

const rules: Record<string, Rule[]> = {
  lengthCm: numberRule('单箱长'),
  widthCm: numberRule('单箱宽'),
  heightCm: numberRule('单箱高'),
  weightKg: [{ required: true, message: '请输入单箱重量' }, { type: 'number', min: 0.1, message: '单箱重量需大于 0' }],
  quantity: [{ required: true, message: '请输入箱数' }, { type: 'number', min: 1, message: '箱数需大于 0' }],
};

function updateItem(id: string, key: keyof CargoItemInput, value: any) {
  localItems.value = localItems.value.map((item) => item.id === id ? { ...item, [key]: value } : item);
}

function updateOption(key: keyof CalculationOptions, value: any) {
  localOptions.value = {
    ...localOptions.value,
    [key]: value,
  };
}

function updateWeightBuffer(value: number | null) {
  updateOption('reserveWeightBufferRate', Number(value || 0) / 100);
}

async function handleSubmit() {
  try {
    if (props.mode === 'single') {
      await singleFormRef.value?.validate();
    } else {
      const invalid = localItems.value.some((item) => !item.skuName || item.lengthCm <= 0 || item.widthCm <= 0 || item.heightCm <= 0 || item.weightKg <= 0 || item.quantity <= 0);
      if (invalid) {
        message.error('请检查多 SKU 数据，长度、宽度、高度、重量、数量均需大于 0');
        return;
      }
    }
    emit('submit');
  } catch {
    message.error('请先完善输入信息');
  }
}
</script>
