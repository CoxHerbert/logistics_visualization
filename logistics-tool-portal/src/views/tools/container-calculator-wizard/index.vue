<template>
  <div class="container-calculator-wizard-page">
    <a-space direction="vertical" style="width:100%" :size="16">
      <CalculatorStepper :current-step="store.currentStep" />

      <StepCargoInfo
        v-if="store.currentStep === 0"
        :cargo-mode="store.cargoMode"
        :single-cargo-form="store.singleCargoForm"
        :pallet-form="store.palletForm"
        :multi-sku-form="store.multiSkuForm"
        @update:cargo-mode="store.setCargoMode"
        @update:single-cargo-form="store.patchSingleCargo"
        @update:pallet-form="store.patchPallet"
        @update:multi-sku-form="store.setMultiSkuForm"
        @add:multi-sku-item="store.addMultiSkuItem"
        @remove:multi-sku-item="store.removeMultiSkuItem($event)"
        @next="store.nextStep"
      />

      <StepConstraints
        v-else-if="store.currentStep === 1"
        :form="store.constraintForm"
        @update:form="store.patchConstraint"
        @prev="store.prevStep"
        @calculate="handleCalculate"
      />

      <StepPlanResult
        v-else-if="store.currentStep === 2"
        :result-summary="store.resultSummary"
        @prev="store.setStep(1)"
        @next="store.nextStep"
      />

      <StepOptimization
        v-else
        :suggestions="store.optimizationSuggestions"
        @prev="store.prevStep"
        @restart="store.resetAll"
        @export="handleExport"
      />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import CalculatorStepper from '@/components/wizard/CalculatorStepper.vue';
import StepCargoInfo from '@/components/wizard/StepCargoInfo.vue';
import StepConstraints from '@/components/wizard/StepConstraints.vue';
import StepPlanResult from '@/components/wizard/StepPlanResult.vue';
import StepOptimization from '@/components/wizard/StepOptimization.vue';
import { useContainerWizardStore } from '@/stores/containerWizard';
import { CONTAINER_SPECS } from '@/constants/containerSpecs';
import { calculateContainerResult, calculateMixedContainerResult, getRecommendedResult } from '@/utils/loadCalculator';
import { planContainers } from '@/utils/planning/multiContainerPlanner';
import { buildContainerLayout } from '@/utils/layout/layoutEngine';
import { optimizePackagingForCargoSet } from '@/utils/optimization';
import { costPlans, getCostFriendlyPlan } from '@/utils/costing/costEngine';
import { exportClientProposalMarkdown } from '@/utils/costing/planExporter';
import type { CargoLikeInput } from '@/types/packagingOptimization';
import type { CostScenarioInput, MultiContainerPlanBase } from '@/types/v7Costing';
import type { CalculationOptions, CargoItemInput, MultiContainerPlan } from '@/types/loadCalculator';
import type { OptimizationSuggestion } from '@/types/containerWizard';

const store = useContainerWizardStore();

function buildCostScenario(): CostScenarioInput {
  return {
    currency: 'USD',
    oceanFreightByContainer: {
      '20GP': store.constraintForm.oceanFreightByContainer['20GP'],
      '40GP': store.constraintForm.oceanFreightByContainer['40GP'],
      '40HQ': store.constraintForm.oceanFreightByContainer['40HQ'],
    },
    truckingPerContainer: 350,
    customsPerShipment: 120,
    docsPerShipment: 60,
    thcPerContainer: 180,
    bufferFee: 100,
    destinationFeeOptional: 0,
  };
}

function toCalcOptions(): Partial<CalculationOptions> {
  return {
    scenario: store.constraintForm.scenario,
    loadingProfile: store.constraintForm.strategy,
    reserveDoorSpaceCm: store.constraintForm.reserveDoorCm,
    reserveTopSpaceCm: store.constraintForm.reserveTopCm,
    reserveWeightBufferRate: store.constraintForm.weightBufferRate,
    enforceDoorCheck: store.constraintForm.enableDoorCheck,
    loadDirection: store.constraintForm.heavyForward ? 'heavy-front' : 'balanced',
  };
}

function buildSingleCargoLike(): CargoLikeInput {
  return {
    skuName: '当前SKU',
    lengthCm: store.singleCargoForm.lengthCm,
    widthCm: store.singleCargoForm.widthCm,
    heightCm: store.singleCargoForm.heightCm,
    weightKg: store.singleCargoForm.weightKg,
    quantity: store.singleCargoForm.quantity,
    allowRotate: store.singleCargoForm.allowRotate,
  };
}

function palletizeCargoLike(cargo: CargoLikeInput): CargoLikeInput {
  const pallet = store.palletForm;
  if (!pallet.enabled) return cargo;

  const unitsPerPallet = Math.max(1, pallet.unitsPerPallet);
  const palletCount = Math.max(1, Math.ceil(cargo.quantity / unitsPerPallet));
  const totalWeightKg = cargo.weightKg * cargo.quantity + palletCount * Math.max(0, pallet.palletWeightKg);

  return {
    skuName: `${cargo.skuName}-托盘`,
    lengthCm: pallet.lengthCm,
    widthCm: pallet.widthCm,
    heightCm: pallet.totalHeightCm,
    weightKg: totalWeightKg / palletCount,
    quantity: palletCount,
    allowRotate: pallet.allowRotate,
  };
}

function palletizeCargoItem(item: CargoItemInput): CargoItemInput {
  const pallet = store.palletForm;
  if (!pallet.enabled) return item;

  const unitsPerPallet = Math.max(1, pallet.unitsPerPallet);
  const palletCount = Math.max(1, Math.ceil(item.quantity / unitsPerPallet));
  const totalWeightKg = item.weightKg * item.quantity + palletCount * Math.max(0, pallet.palletWeightKg);

  return {
    ...item,
    skuName: `${item.skuName}-托盘`,
    lengthCm: pallet.lengthCm,
    widthCm: pallet.widthCm,
    heightCm: pallet.totalHeightCm,
    weightKg: totalWeightKg / palletCount,
    quantity: palletCount,
    allowRotate: pallet.allowRotate,
    maxStackLayers: 1,
  };
}

function buildPlanningCargo(cargo: CargoLikeInput) {
  return {
    totalVolumeM3: (cargo.lengthCm * cargo.widthCm * cargo.heightCm * cargo.quantity) / 1_000_000,
    totalWeightKg: cargo.weightKg * cargo.quantity,
    totalQuantity: cargo.quantity,
  };
}

function toPlanBase(multiPlans: MultiContainerPlan[]): MultiContainerPlanBase[] {
  return multiPlans.map((plan, index) => ({
    planId: `plan-${index + 1}`,
    containers: plan.composition,
    totalContainerCount: plan.totalContainers,
    estimatedVolumeUsageRate: plan.volumeUsageRate,
    estimatedWeightUsageRate: plan.weightUsageRate,
    canFit: plan.canFit,
    riskLevel: plan.riskLevel,
    riskMessages: [],
    score: plan.score,
    recommendationTag: plan.recommendationTag,
    summaryText: plan.summary,
  }));
}

function handleCalculate() {
  const selectedCodes = store.constraintForm.selectedContainers;
  const containers = CONTAINER_SPECS.filter((item) => selectedCodes.includes(item.code));
  if (!containers.length) {
    message.warning('请至少选择一个柜型');
    return;
  }

  const cargo = palletizeCargoLike(buildSingleCargoLike());
  const rawWizardItems: CargoItemInput[] = store.multiSkuForm.map((item) => ({
    id: item.id,
    skuName: item.skuName,
    lengthCm: item.lengthCm,
    widthCm: item.widthCm,
    heightCm: item.heightCm,
    weightKg: item.weightKg,
    quantity: item.quantity,
    allowRotate: item.allowRotate,
    maxStackLayers: item.maxStackLayers,
    fragile: item.fragile,
    remark: '',
  }));
  const wizardItems = rawWizardItems.map((item) => palletizeCargoItem(item));
  if (store.cargoMode === 'multiSku' && wizardItems.length === 0) {
    message.warning('请先添加至少一个 SKU');
    return;
  }
  const options = toCalcOptions();
  const results = containers.map((container) => (
    store.cargoMode === 'single'
      ? calculateContainerResult(cargo as any, container, options)
      : calculateMixedContainerResult(wizardItems, container, options)
  ));
  const recommended = getRecommendedResult(results);

  const planningCargo = store.cargoMode === 'single'
    ? buildPlanningCargo(cargo)
    : {
        totalVolumeM3: wizardItems.reduce(
          (sum, item) => sum + (item.lengthCm * item.widthCm * item.heightCm * item.quantity) / 1_000_000,
          0,
        ),
        totalWeightKg: wizardItems.reduce((sum, item) => sum + item.weightKg * item.quantity, 0),
        totalQuantity: wizardItems.reduce((sum, item) => sum + item.quantity, 0),
      };
  const multiPlans = planContainers(planningCargo, containers, selectedCodes as any, 5);

  const layout = buildContainerLayout({
    containerCode: recommended.containerCode,
    containerName: recommended.containerName,
    perRow: Math.max(1, recommended.layout.perRow),
    perCol: Math.max(1, recommended.layout.perCol),
    totalLayers: Math.max(1, recommended.layout.totalLayers),
    totalBoxes: recommended.loadedQuantity,
    items: store.cargoMode === 'single'
      ? [{ skuId: 'SKU-1', skuName: cargo.skuName || '当前SKU', quantity: recommended.loadedQuantity, zoneType: 'normal' }]
      : wizardItems.map((item) => ({
          skuId: item.id,
          skuName: item.skuName,
          quantity: item.quantity,
          zoneType: item.fragile ? 'fragile' : (item.weightKg >= 80 ? 'heavy' : 'normal'),
        })),
  });

  const planPreviews = multiPlans.map((plan, planIndex) => {
    const avgBoxesPerContainer = Math.max(1, Math.ceil(planningCargo.totalQuantity / Math.max(1, plan.totalContainers)));
    const layouts = plan.composition.flatMap((item) => {
      const container = containers.find((c) => c.code === item.containerCode);
      const refResult = results.find((r) => r.containerCode === item.containerCode) || recommended;
      if (!container) return [];

      return Array.from({ length: item.count }, (_, i) => {
        const previewLayout = buildContainerLayout({
          containerCode: container.code,
          containerName: container.name,
          perRow: Math.max(1, refResult.layout.perRow),
          perCol: Math.max(1, refResult.layout.perCol),
          totalLayers: Math.max(1, refResult.layout.totalLayers),
          totalBoxes: Math.min(avgBoxesPerContainer, refResult.maxFitByCount || avgBoxesPerContainer),
          items: store.cargoMode === 'single'
            ? [{
                skuId: 'SKU-1',
                skuName: cargo.skuName || '当前SKU',
                quantity: Math.min(avgBoxesPerContainer, refResult.maxFitByCount || avgBoxesPerContainer),
                zoneType: 'normal',
              }]
            : wizardItems.map((sku) => ({
                skuId: sku.id,
                skuName: sku.skuName,
                quantity: Math.max(1, Math.ceil(sku.quantity / Math.max(1, plan.totalContainers))),
                zoneType: sku.fragile ? 'fragile' : (sku.weightKg >= 80 ? 'heavy' : 'normal'),
              })),
        });

        return {
          id: `${plan.id}-${item.containerCode}-${i + 1}`,
          title: `${container.code} 第 ${i + 1} 柜`,
          layout: previewLayout,
        };
      });
    });

    return {
      planId: plan.id,
      title: `方案 ${planIndex + 1} · ${plan.summary}`,
      layouts,
    };
  });

  store.setResultSummary({
    recommendedPlan: {
      title: `${recommended.containerCode} · 装载 ${recommended.loadedQuantity}/${recommended.requestedQuantity}`,
      utilization: `${(recommended.volumeUsageRate * 100).toFixed(1)}%`,
      riskLevel: recommended.riskLevel,
      reason: recommended.summaryLabel || '按当前输入自动推荐',
    },
    alternativePlans: multiPlans as any,
    riskMessages: recommended.riskMessages,
    layout,
    planPreviews,
  });

  const optimizationInput: CargoLikeInput[] = store.cargoMode === 'single'
    ? [cargo]
    : wizardItems.map((item) => ({
        skuName: item.skuName,
        lengthCm: item.lengthCm,
        widthCm: item.widthCm,
        heightCm: item.heightCm,
        weightKg: item.weightKg,
        quantity: item.quantity,
        allowRotate: item.allowRotate,
      }));

  const optimization = optimizePackagingForCargoSet(optimizationInput, (item) => {
    const plans = planContainers(buildPlanningCargo(item), containers, selectedCodes as any, 1);
    const top = plans[0];
    return {
      planText: top?.summary || '无可用方案',
      totalContainerCount: top?.totalContainers || 0,
      estimatedVolumeUsageRate: top?.volumeUsageRate || 0,
      estimatedWeightUsageRate: top?.weightUsageRate || 0,
      riskLevel: top?.riskLevel || 'high',
    };
  });

  const costScenario = buildCostScenario();
  const costedPlans = costPlans(
    toPlanBase(multiPlans),
    {
      totalVolumeM3: planningCargo.totalVolumeM3,
      totalWeightKg: planningCargo.totalWeightKg,
      totalQuantity: planningCargo.totalQuantity,
      skuCount: store.cargoMode === 'single' ? 1 : wizardItems.length,
    },
    costScenario,
  );
  const costPlan = getCostFriendlyPlan(costedPlans);

  const costSuggestion = costPlan
    ? [{
        id: 'cost-friendly',
        title: '成本友好方案',
        description: `${costPlan.summaryText || ''}，总成本 ${costScenario.currency} ${costPlan.costBreakdown.totalCost.toFixed(2)}`,
        impact: '降低综合成本',
        level: 'success' as const,
      }]
    : [];

  const optimizationSuggestionList: OptimizationSuggestion[] = [
    ...optimization.perSku.flatMap((sku) => sku.suggestions.slice(0, 2).map((s) => {
      const level: OptimizationSuggestion['level'] =
        s.recommendationTag === '推荐' ? 'success' : (s.recommendationTag === '可尝试' ? 'info' : 'warning');
      return {
        id: `${sku.skuName}-${s.candidateId}`,
        title: `${sku.skuName}: ${s.title}`,
        description: s.gainSummary,
        impact: `评分 ${s.benefitScore.toFixed(1)}`,
        level,
      };
    })),
    ...costSuggestion,
  ];

  store.setOptimizationSuggestions(optimizationSuggestionList);

  const proposal = exportClientProposalMarkdown({
    customerName: '',
    cargoSummary: {
      totalVolumeM3: planningCargo.totalVolumeM3,
      totalWeightKg: planningCargo.totalWeightKg,
      totalQuantity: planningCargo.totalQuantity,
      skuCount: store.cargoMode === 'single' ? 1 : wizardItems.length,
    },
    recommended: costPlan,
    alternatives: costedPlans.filter((item) => item.planId !== costPlan?.planId).slice(0, 3),
    currency: costScenario.currency,
  });
  store.setProposalMarkdown(proposal);
  store.setStep(2);
}

function handleExport() {
  if (!store.proposalMarkdown) {
    message.warning('暂无可导出方案，请先完成计算');
    return;
  }
  const blob = new Blob([store.proposalMarkdown], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `container-wizard-proposal-${Date.now()}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
  message.success('方案已导出');
}
</script>

<style scoped>
.container-calculator-wizard-page {
  max-width: 1320px;
  margin: 0 auto;
}
</style>
