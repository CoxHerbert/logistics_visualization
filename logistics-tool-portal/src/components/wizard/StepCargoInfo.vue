<template>
  <a-card title="Step 1 · 货物信息" :bordered="false">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-radio-group :value="cargoMode" @update:value="emit('update:cargoMode', $event)">
        <a-radio-button value="single">单箱模式</a-radio-button>
        <a-radio-button value="multiSku">多 SKU</a-radio-button>
      </a-radio-group>

      <template v-if="cargoMode === 'single'">
        <a-form layout="vertical">
          <a-row :gutter="16">
            <a-col :span="8"><a-form-item label="长(cm)"><a-input-number :value="singleCargoForm.lengthCm" style="width:100%" @update:value="patch('lengthCm', $event)" /></a-form-item></a-col>
            <a-col :span="8"><a-form-item label="宽(cm)"><a-input-number :value="singleCargoForm.widthCm" style="width:100%" @update:value="patch('widthCm', $event)" /></a-form-item></a-col>
            <a-col :span="8"><a-form-item label="高(cm)"><a-input-number :value="singleCargoForm.heightCm" style="width:100%" @update:value="patch('heightCm', $event)" /></a-form-item></a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12"><a-form-item label="单箱重量(kg)"><a-input-number :value="singleCargoForm.weightKg" style="width:100%" @update:value="patch('weightKg', $event)" /></a-form-item></a-col>
            <a-col :span="12"><a-form-item label="箱数"><a-input-number :value="singleCargoForm.quantity" style="width:100%" @update:value="patch('quantity', $event)" /></a-form-item></a-col>
          </a-row>
          <a-checkbox :checked="singleCargoForm.allowRotate" @update:checked="patch('allowRotate', $event)">允许旋转</a-checkbox>
        </a-form>
      </template>

      <template v-else>
        <a-table :data-source="multiSkuForm" :pagination="false" row-key="id" size="small" :scroll="{ x: 1280 }">
          <a-table-column title="SKU" data-index="skuName" key="skuName" :width="140">
            <template #default="{ record }"><a-input :value="record.skuName" @update:value="updateSkuItem(record.id, 'skuName', $event)" /></template>
          </a-table-column>
          <a-table-column title="长" key="lengthCm" :width="90"><template #default="{ record }"><a-input-number :value="record.lengthCm" :min="1" style="width: 100%" @update:value="updateSkuItem(record.id, 'lengthCm', $event)" /></template></a-table-column>
          <a-table-column title="宽" key="widthCm" :width="90"><template #default="{ record }"><a-input-number :value="record.widthCm" :min="1" style="width: 100%" @update:value="updateSkuItem(record.id, 'widthCm', $event)" /></template></a-table-column>
          <a-table-column title="高" key="heightCm" :width="90"><template #default="{ record }"><a-input-number :value="record.heightCm" :min="1" style="width: 100%" @update:value="updateSkuItem(record.id, 'heightCm', $event)" /></template></a-table-column>
          <a-table-column title="重量" key="weightKg" :width="100"><template #default="{ record }"><a-input-number :value="record.weightKg" :min="0.1" :precision="2" style="width: 100%" @update:value="updateSkuItem(record.id, 'weightKg', $event)" /></template></a-table-column>
          <a-table-column title="数量" key="quantity" :width="100"><template #default="{ record }"><a-input-number :value="record.quantity" :min="1" style="width: 100%" @update:value="updateSkuItem(record.id, 'quantity', $event)" /></template></a-table-column>
          <a-table-column title="限层" key="maxStackLayers" :width="100"><template #default="{ record }"><a-input-number :value="record.maxStackLayers" :min="1" style="width: 100%" placeholder="不限" @update:value="updateSkuItem(record.id, 'maxStackLayers', $event)" /></template></a-table-column>
          <a-table-column title="旋转" key="allowRotate" :width="80"><template #default="{ record }"><a-switch :checked="record.allowRotate" @update:checked="updateSkuItem(record.id, 'allowRotate', $event)" /></template></a-table-column>
          <a-table-column title="易碎" key="fragile" :width="80"><template #default="{ record }"><a-switch :checked="record.fragile" @update:checked="updateSkuItem(record.id, 'fragile', $event)" /></template></a-table-column>
          <a-table-column title="操作" key="actions" :width="90" fixed="right">
            <template #default="{ record }">
              <a-button danger type="link" @click="emit('remove:multiSkuItem', record.id)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <a-button block @click="emit('add:multiSkuItem')">新增 SKU</a-button>
      </template>

      <a-card size="small" title="托盘模式">
        <a-space direction="vertical" style="width:100%" :size="12">
          <a-checkbox :checked="palletForm.enabled" @update:checked="patchPallet('enabled', $event)">启用托盘模式</a-checkbox>

          <a-row v-if="palletForm.enabled" :gutter="12">
            <a-col :span="8">
              <a-form-item label="托盘规格">
                <a-select :value="palletForm.preset" @update:value="onPresetChange">
                  <a-select-option value="CN_120x100">国标 120x100</a-select-option>
                  <a-select-option value="EU_120x80">欧标 120x80</a-select-option>
                  <a-select-option value="US_121x101">美标 121x101</a-select-option>
                  <a-select-option value="custom">自定义</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="每托箱数">
                <a-input-number :value="palletForm.unitsPerPallet" :min="1" style="width:100%" @update:value="patchPallet('unitsPerPallet', $event || 1)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="托盘自重(kg)">
                <a-input-number :value="palletForm.palletWeightKg" :min="0" :step="1" style="width:100%" @update:value="patchPallet('palletWeightKg', $event || 0)" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row v-if="palletForm.enabled" :gutter="12">
            <a-col :span="6">
              <a-form-item label="托盘长(cm)">
                <a-input-number :value="palletForm.lengthCm" :min="1" :disabled="palletForm.preset !== 'custom'" style="width:100%" @update:value="patchPallet('lengthCm', $event || 1)" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="托盘宽(cm)">
                <a-input-number :value="palletForm.widthCm" :min="1" :disabled="palletForm.preset !== 'custom'" style="width:100%" @update:value="patchPallet('widthCm', $event || 1)" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="托盘总高(cm)">
                <a-input-number :value="palletForm.totalHeightCm" :min="1" style="width:100%" @update:value="patchPallet('totalHeightCm', $event || 1)" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="托盘可旋转">
                <a-switch :checked="palletForm.allowRotate" @update:checked="patchPallet('allowRotate', $event)" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </a-card>
    </a-space>

    <template #actions>
      <div style="display:flex;justify-content:flex-end;width:100%">
        <a-button type="primary" @click="emit('next')">下一步</a-button>
      </div>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import type { CargoMode, PalletForm, SingleCargoForm, SkuCargoItem } from '@/types/containerWizard';

const props = defineProps<{
  cargoMode: CargoMode;
  singleCargoForm: SingleCargoForm;
  palletForm: PalletForm;
  multiSkuForm: SkuCargoItem[];
}>();

const emit = defineEmits<{
  (e: 'update:cargoMode', value: CargoMode): void;
  (e: 'update:singleCargoForm', value: Partial<SingleCargoForm>): void;
  (e: 'update:palletForm', value: Partial<PalletForm>): void;
  (e: 'update:multiSkuForm', value: SkuCargoItem[]): void;
  (e: 'add:multiSkuItem'): void;
  (e: 'remove:multiSkuItem', id: string): void;
  (e: 'next'): void;
}>();

function patch<K extends keyof SingleCargoForm>(key: K, value: SingleCargoForm[K]) {
  emit('update:singleCargoForm', { [key]: value } as Partial<SingleCargoForm>);
}

function patchPallet<K extends keyof PalletForm>(key: K, value: PalletForm[K]) {
  emit('update:palletForm', { [key]: value } as Partial<PalletForm>);
}

function onPresetChange(value: PalletForm['preset']) {
  if (value === 'CN_120x100') {
    emit('update:palletForm', { preset: value, lengthCm: 120, widthCm: 100 });
    return;
  }
  if (value === 'EU_120x80') {
    emit('update:palletForm', { preset: value, lengthCm: 120, widthCm: 80 });
    return;
  }
  if (value === 'US_121x101') {
    emit('update:palletForm', { preset: value, lengthCm: 121, widthCm: 101 });
    return;
  }
  emit('update:palletForm', { preset: value });
}

function updateSkuItem(id: string, key: keyof SkuCargoItem, value: any) {
  emit(
    'update:multiSkuForm',
    props.multiSkuForm.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
  );
}
</script>
