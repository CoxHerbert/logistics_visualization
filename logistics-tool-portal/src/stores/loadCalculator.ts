import { defineStore } from 'pinia';
import { CONTAINER_SPECS } from '@/constants/containerSpecs';
import type {
  CalculationOptions,
  CalculationSnapshot,
  CalculatorMode,
  CargoInput,
  CargoItemInput,
  ContainerCode,
  LoadCalculationSummary,
} from '@/types/loadCalculator';
import type { CargoLikeInput } from '@/types/packagingOptimization';
import type { CostScenarioInput, MultiContainerPlanBase } from '@/types/v7Costing';
import {
  calculateContainerResult,
  calculateMixedContainerResult,
  createDefaultOptions,
  getRecommendedResult,
} from '@/utils/loadCalculator';
import { optimizePackagingForCargoSet } from '@/utils/optimization';
import { costPlans, getCostFriendlyPlan } from '@/utils/costing/costEngine';
import { exportClientProposalMarkdown } from '@/utils/costing/planExporter';
import { planContainers } from '@/utils/planning/multiContainerPlanner';

const STORAGE_KEY = 'container-calculator-v7-history';

const defaultCargo: CargoInput = {
  lengthCm: 60,
  widthCm: 40,
  heightCm: 40,
  weightKg: 18,
  quantity: 500,
  allowRotate: true,
};

const defaultOptions: CalculationOptions = createDefaultOptions();

const defaultCostScenario: CostScenarioInput = {
  currency: 'USD',
  oceanFreightByContainer: {
    '20GP': 1800,
    '40GP': 2600,
    '40HQ': 2800,
  },
  truckingPerContainer: 350,
  customsPerShipment: 120,
  docsPerShipment: 60,
  thcPerContainer: 180,
  bufferFee: 100,
  destinationFeeOptional: 0,
};

function createCargoItem(partial?: Partial<CargoItemInput>): CargoItemInput {
  return {
    id: Math.random().toString(36).slice(2, 10),
    skuName: 'SKU-1',
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    weightKg: 18,
    quantity: 100,
    allowRotate: true,
    maxStackLayers: undefined,
    fragile: false,
    remark: '',
    ...partial,
  };
}

function readHistory(): CalculationSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalculationSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(history: CalculationSnapshot[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

function toPlanningCargo(cargo: CargoLikeInput) {
  return {
    totalVolumeM3: (cargo.lengthCm * cargo.widthCm * cargo.heightCm * cargo.quantity) / 1_000_000,
    totalWeightKg: cargo.weightKg * cargo.quantity,
    totalQuantity: cargo.quantity,
  };
}

function toPlanBase(multiPlans: NonNullable<LoadCalculationSummary['multiPlans']>): MultiContainerPlanBase[] {
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

export const useLoadCalculatorStore = defineStore('loadCalculator', {
  state: () => ({
    mode: 'single' as CalculatorMode,
    selectedContainers: ['20GP', '40GP', '40HQ'] as ContainerCode[],
    cargo: { ...defaultCargo } as CargoInput,
    cargoItems: [
      createCargoItem({ skuName: 'SKU-A', quantity: 240 }),
      createCargoItem({ skuName: 'SKU-B', lengthCm: 72, widthCm: 45, heightCm: 38, weightKg: 21, quantity: 160 }),
    ] as CargoItemInput[],
    options: { ...defaultOptions } as CalculationOptions,
    costScenario: {
      ...defaultCostScenario,
      oceanFreightByContainer: { ...defaultCostScenario.oceanFreightByContainer },
    } as CostScenarioInput,
    summary: null as LoadCalculationSummary | null,
    history: [] as CalculationSnapshot[],
  }),
  actions: {
    init() {
      this.history = readHistory();
    },
    calculate() {
      const containers = CONTAINER_SPECS.filter((item) => this.selectedContainers.includes(item.code));
      const results = containers.map((container) => this.mode === 'single'
        ? calculateContainerResult(this.cargo, container, this.options)
        : calculateMixedContainerResult(this.cargoItems, container, this.options));

      const planningCargo = this.mode === 'single'
        ? {
            totalVolumeM3: (this.cargo.lengthCm * this.cargo.widthCm * this.cargo.heightCm * this.cargo.quantity) / 1_000_000,
            totalWeightKg: this.cargo.weightKg * this.cargo.quantity,
            totalQuantity: this.cargo.quantity,
          }
        : {
            totalVolumeM3: this.cargoItems.reduce(
              (sum, item) => sum + (item.lengthCm * item.widthCm * item.heightCm * item.quantity) / 1_000_000,
              0,
            ),
            totalWeightKg: this.cargoItems.reduce((sum, item) => sum + item.weightKg * item.quantity, 0),
            totalQuantity: this.cargoItems.reduce((sum, item) => sum + item.quantity, 0),
          };

      const multiPlans = planContainers(planningCargo, containers, this.selectedContainers, 5);

      const optimizationCargos: CargoLikeInput[] = this.mode === 'single'
        ? [{
            skuName: '当前SKU',
            lengthCm: this.cargo.lengthCm,
            widthCm: this.cargo.widthCm,
            heightCm: this.cargo.heightCm,
            weightKg: this.cargo.weightKg,
            quantity: this.cargo.quantity,
            allowRotate: this.cargo.allowRotate,
          }]
        : this.cargoItems.map((item) => ({
            skuName: item.skuName,
            lengthCm: item.lengthCm,
            widthCm: item.widthCm,
            heightCm: item.heightCm,
            weightKg: item.weightKg,
            quantity: item.quantity,
            allowRotate: item.allowRotate,
          }));

      const packagingOptimization = optimizePackagingForCargoSet(optimizationCargos, (cargo) => {
        const plans = planContainers(toPlanningCargo(cargo), containers, this.selectedContainers, 1);
        const topPlan = plans[0];
        return {
          planText: topPlan?.summary || '无可用方案',
          totalContainerCount: topPlan?.totalContainers || 0,
          estimatedVolumeUsageRate: topPlan?.volumeUsageRate || 0,
          estimatedWeightUsageRate: topPlan?.weightUsageRate || 0,
          riskLevel: topPlan?.riskLevel || 'high',
        };
      });

      const cargoSummaryForCost = {
        totalVolumeM3: planningCargo.totalVolumeM3,
        totalWeightKg: planningCargo.totalWeightKg,
        totalQuantity: planningCargo.totalQuantity,
        skuCount: this.mode === 'single' ? 1 : this.cargoItems.length,
      };

      const costedPlans = costPlans(toPlanBase(multiPlans), cargoSummaryForCost, this.costScenario);
      const recommendedCostPlan = getCostFriendlyPlan(costedPlans);
      const proposalMarkdown = exportClientProposalMarkdown({
        cargoSummary: cargoSummaryForCost,
        recommended: recommendedCostPlan,
        alternatives: costedPlans.filter((plan) => plan.planId !== recommendedCostPlan?.planId).slice(0, 3),
        currency: this.costScenario.currency,
      });

      this.summary = {
        mode: this.mode,
        cargo: { ...this.cargo },
        cargoItems: this.cargoItems.map((item) => ({ ...item })),
        options: { ...this.options },
        results,
        recommended: getRecommendedResult(results),
        multiPlans,
        packagingOptimization,
        costScenario: {
          ...this.costScenario,
          oceanFreightByContainer: { ...this.costScenario.oceanFreightByContainer },
        },
        costedPlans,
        proposalMarkdown,
        generatedAt: new Date().toISOString(),
      };
    },
    reset() {
      this.mode = 'single';
      this.selectedContainers = ['20GP', '40GP', '40HQ'];
      this.cargo = { ...defaultCargo };
      this.options = { ...defaultOptions };
      this.costScenario = {
        ...defaultCostScenario,
        oceanFreightByContainer: { ...defaultCostScenario.oceanFreightByContainer },
      };
      this.cargoItems = [
        createCargoItem({ skuName: 'SKU-A', quantity: 240 }),
        createCargoItem({ skuName: 'SKU-B', lengthCm: 72, widthCm: 45, heightCm: 38, weightKg: 21, quantity: 160 }),
      ];
      this.summary = null;
    },
    fillSingleDemo(sample?: Partial<CargoInput>) {
      this.mode = 'single';
      this.options = {
        ...defaultOptions,
        scenario: 'traditional',
        loadingProfile: 'balanced',
        loadDirection: 'heavy-front',
        enforceDoorCheck: true,
      };
      this.cargo = {
        ...defaultCargo,
        ...sample,
      };
      this.calculate();
    },
    fillMixedDemo(items?: CargoItemInput[]) {
      this.mode = 'mixed';
      this.options = {
        ...defaultOptions,
        scenario: 'fba',
        loadingProfile: 'conservative',
        reserveDoorSpaceCm: 20,
        reserveTopSpaceCm: 8,
        loadDirection: 'balanced',
        enforceDoorCheck: true,
      };
      this.cargoItems = items?.map((item) => ({ ...item })) || [
        createCargoItem({ skuName: 'FBA-小件', lengthCm: 58, widthCm: 40, heightCm: 42, weightKg: 17.5, quantity: 260 }),
        createCargoItem({ skuName: '传统外贸-中箱', lengthCm: 72, widthCm: 45, heightCm: 38, weightKg: 21, quantity: 180 }),
        createCargoItem({ skuName: '易碎件', lengthCm: 50, widthCm: 35, heightCm: 30, weightKg: 9, quantity: 120, fragile: true, maxStackLayers: 3 }),
      ];
      this.calculate();
    },
    updateOptions(patch: Partial<CalculationOptions>) {
      this.options = { ...this.options, ...patch };
    },
    updateCostScenario(patch: Partial<CostScenarioInput>) {
      this.costScenario = {
        ...this.costScenario,
        ...patch,
        oceanFreightByContainer: {
          ...this.costScenario.oceanFreightByContainer,
          ...(patch.oceanFreightByContainer || {}),
        },
      };
    },
    addCargoItem() {
      this.cargoItems.push(createCargoItem({ skuName: `SKU-${this.cargoItems.length + 1}` }));
    },
    removeCargoItem(id: string) {
      if (this.cargoItems.length <= 1) return;
      this.cargoItems = this.cargoItems.filter((item) => item.id !== id);
    },
    saveSnapshot(title?: string) {
      if (!this.summary) return;
      const snapshot: CalculationSnapshot = {
        id: Math.random().toString(36).slice(2, 10),
        title: title || `${this.summary.mode === 'single' ? '单箱' : '多SKU'}-${this.summary.recommended?.containerCode || '未推荐'}`,
        createdAt: new Date().toISOString(),
        summary: JSON.parse(JSON.stringify(this.summary)) as LoadCalculationSummary,
      };
      this.history = [snapshot, ...this.history].slice(0, 20);
      writeHistory(this.history);
    },
    loadSnapshot(id: string) {
      const snapshot = this.history.find((item) => item.id === id);
      if (!snapshot) return;
      this.mode = snapshot.summary.mode;
      this.cargo = { ...snapshot.summary.cargo };
      this.cargoItems = snapshot.summary.cargoItems.map((item) => ({ ...item }));
      this.options = snapshot.summary.options ? { ...snapshot.summary.options } : { ...defaultOptions };
      this.costScenario = snapshot.summary.costScenario
        ? {
            ...snapshot.summary.costScenario,
            oceanFreightByContainer: { ...snapshot.summary.costScenario.oceanFreightByContainer },
          }
        : {
            ...defaultCostScenario,
            oceanFreightByContainer: { ...defaultCostScenario.oceanFreightByContainer },
          };
      this.summary = JSON.parse(JSON.stringify(snapshot.summary)) as LoadCalculationSummary;
    },
    deleteSnapshot(id: string) {
      this.history = this.history.filter((item) => item.id !== id);
      writeHistory(this.history);
    },
    exportCurrentSummary() {
      if (!this.summary || typeof window === 'undefined') return;
      const blob = new Blob([JSON.stringify(this.summary, null, 2)], { type: 'application/json;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `container-calculation-v7-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    exportAdviceMarkdown() {
      if (!this.summary?.proposalMarkdown || typeof window === 'undefined') return;
      const blob = new Blob([this.summary.proposalMarkdown], { type: 'text/markdown;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `container-proposal-v7-${Date.now()}.md`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    importSummary(raw: string) {
      const summary = JSON.parse(raw) as LoadCalculationSummary;
      this.mode = summary.mode;
      this.cargo = { ...summary.cargo };
      this.cargoItems = summary.cargoItems.map((item) => ({ ...item }));
      this.options = summary.options ? { ...defaultOptions, ...summary.options } : { ...defaultOptions };
      this.costScenario = summary.costScenario
        ? {
            ...defaultCostScenario,
            ...summary.costScenario,
            oceanFreightByContainer: {
              ...defaultCostScenario.oceanFreightByContainer,
              ...summary.costScenario.oceanFreightByContainer,
            },
          }
        : {
            ...defaultCostScenario,
            oceanFreightByContainer: { ...defaultCostScenario.oceanFreightByContainer },
          };
      this.summary = summary;
    },
  },
});
