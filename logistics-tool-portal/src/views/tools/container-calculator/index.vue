<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="hero-card">
        <h1 class="hero-title">装柜计算器 V8</h1>
        <div class="hero-desc">
          V8 在 V7 基础上升级装柜结构图：支持分层视图、柜门方向、SKU 图例、重货/易碎标记与行列结构展示。
        </div>
      </div>

      <a-row :gutter="[18, 18]">
        <a-col :xs="24" :lg="10">
          <a-space direction="vertical" size="middle" style="width: 100%">
            <ContainerSelector v-model="selectedContainers" />
            <CostScenarioPanel v-model="costScenario" />
            <CargoForm
              :mode="mode"
              :cargo="cargo"
              :cargo-items="cargoItems"
              :options="options"
              @update:mode="handleModeChange"
              @update:cargo="handleCargoChange"
              @update:items="handleItemsChange"
              @update:options="handleOptionsChange"
              @add-item="store.addCargoItem()"
              @remove-item="store.removeCargoItem($event)"
              @submit="handleCalculate"
              @reset="handleReset"
              @demo-single="fillExampleA"
              @demo-mixed="fillMixedExample"
            />
          </a-space>
        </a-col>

        <a-col :xs="24" :lg="14">
          <a-space direction="vertical" size="middle" style="width: 100%">
            <a-card class="section-card" :bordered="false">
              <a-space wrap>
                <a-button type="primary" @click="handleCalculate">立即计算</a-button>
                <a-button @click="fillExampleA">单箱示例</a-button>
                <a-button @click="fillMixedExample">多 SKU 示例</a-button>
                <a-button :disabled="!summary" @click="handleSaveSnapshot">保存到本地</a-button>
                <a-button :disabled="!summary" @click="store.exportCurrentSummary()">导出 JSON</a-button>
                <a-button :disabled="!summary" @click="store.exportAdviceMarkdown()">导出客户端方案 MD</a-button>
                <a-upload :show-upload-list="false" accept=".json" :before-upload="handleImportFile">
                  <a-button>导入 JSON</a-button>
                </a-upload>
              </a-space>
            </a-card>

            <EmptyState v-if="!summary" />
            <template v-else>
              <ResultSummary :result="summary.recommended" />
              <ResultCompareTable :results="summary.results" :recommended-code="summary.recommended?.containerCode" />
              <MultiPlanComparison :plans="summary.multiPlans || []" />
              <PackagingOptimizationPanel :data="summary.packagingOptimization" />
              <PlanCostCompareTable
                :plans="summary.costedPlans || []"
                :currency="summary.costScenario?.currency || 'USD'"
              />
              <ClientProposalPreview :markdown="summary.proposalMarkdown || ''" />
              <ContainerPreviewV2 v-if="layoutV2" :layout="layoutV2" />
              <SplitPlanCard :plan="summary.recommended?.splitPlan" />
              <PlanAdvice :items="summary.recommended?.advice || []" />
              <OperationChecklist :items="summary.recommended?.operationChecklist || []" />
              <SkuBreakdown :items="summary.recommended?.skuBreakdown || []" />
              <RiskAlertList :messages="summary.recommended?.riskMessages || []" />
            </template>

            <CalculationHistory
              :history="history"
              @load="handleLoadSnapshot"
              @delete="store.deleteSnapshot($event)"
            />
          </a-space>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message, type UploadProps } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import CalculationHistory from '@/components/load-calculator/CalculationHistory.vue';
import CargoForm from '@/components/load-calculator/CargoForm.vue';
import ContainerPreviewV2 from '@/components/load-calculator/ContainerPreviewV2.vue';
import ContainerSelector from '@/components/load-calculator/ContainerSelector.vue';
import EmptyState from '@/components/load-calculator/EmptyState.vue';
import MultiPlanComparison from '@/components/load-calculator/MultiPlanComparison.vue';
import OperationChecklist from '@/components/load-calculator/OperationChecklist.vue';
import PackagingOptimizationPanel from '@/components/load-calculator/PackagingOptimizationPanel.vue';
import ClientProposalPreview from '@/components/v7/ClientProposalPreview.vue';
import CostScenarioPanel from '@/components/v7/CostScenarioPanel.vue';
import PlanCostCompareTable from '@/components/v7/PlanCostCompareTable.vue';
import PlanAdvice from '@/components/load-calculator/PlanAdvice.vue';
import ResultCompareTable from '@/components/load-calculator/ResultCompareTable.vue';
import ResultSummary from '@/components/load-calculator/ResultSummary.vue';
import RiskAlertList from '@/components/load-calculator/RiskAlertList.vue';
import SkuBreakdown from '@/components/load-calculator/SkuBreakdown.vue';
import SplitPlanCard from '@/components/load-calculator/SplitPlanCard.vue';
import type { CalculationOptions, CalculatorMode, CargoInput, CargoItemInput } from '@/types/loadCalculator';
import type { LayoutBuildItemInput } from '@/types/layout';
import { useLoadCalculatorStore } from '@/stores/loadCalculator';
import { buildContainerLayout } from '@/utils/layout/layoutEngine';

const store = useLoadCalculatorStore();
const { mode, selectedContainers, cargo, cargoItems, options, costScenario, summary, history } = storeToRefs(store);

const layoutV2 = computed(() => {
  const recommended = summary.value?.recommended;
  if (!recommended) return undefined;

  const items: LayoutBuildItemInput[] = summary.value?.mode === 'single'
    ? [{
        skuId: 'SKU-1',
        skuName: '当前SKU',
        quantity: recommended.loadedQuantity,
        zoneType: 'normal',
      }]
    : (summary.value?.cargoItems || []).map((item) => ({
        skuId: item.id,
        skuName: item.skuName,
        quantity: item.quantity,
        zoneType: item.fragile ? 'fragile' : (item.weightKg >= (options.value.floorWeightAlertKg || 80) ? 'heavy' : 'normal'),
      }));

  return buildContainerLayout({
    containerCode: recommended.containerCode,
    containerName: recommended.containerName,
    perRow: Math.max(1, recommended.layout.perRow),
    perCol: Math.max(1, recommended.layout.perCol),
    totalLayers: Math.max(1, recommended.layout.totalLayers),
    totalBoxes: Math.max(0, recommended.loadedQuantity),
    items,
  });
});

onMounted(() => {
  store.init();
});

watch(
  costScenario,
  () => {
    if (summary.value) {
      store.calculate();
    }
  },
  { deep: true },
);

function handleCalculate() {
  try {
    store.calculate();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '计算失败，请检查输入');
  }
}

function handleReset() {
  store.reset();
}

function handleModeChange(value: CalculatorMode) {
  mode.value = value;
}

function handleCargoChange(value: CargoInput) {
  cargo.value = value;
}

function handleItemsChange(value: CargoItemInput[]) {
  cargoItems.value = value;
}

function handleOptionsChange(value: CalculationOptions) {
  options.value = value;
}

function fillExampleA() {
  store.fillSingleDemo({
    lengthCm: 58,
    widthCm: 40,
    heightCm: 42,
    weightKg: 24,
    quantity: 520,
    allowRotate: true,
  });
}

function fillMixedExample() {
  store.fillMixedDemo();
}

function handleSaveSnapshot() {
  store.saveSnapshot();
  message.success('已保存到本地测算记录');
}

function handleLoadSnapshot(id: string) {
  store.loadSnapshot(id);
  message.success('已载入本地记录');
}

const handleImportFile: UploadProps['beforeUpload'] = async (file) => {
  const text = await file.text();
  try {
    store.importSummary(text);
    message.success('导入成功');
  } catch {
    message.error('导入失败，JSON 内容不正确');
  }
  return false;
};
</script>
