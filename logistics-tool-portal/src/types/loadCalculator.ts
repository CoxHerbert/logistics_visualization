import type { PackagingOptimizationResult } from '@/types/packagingOptimization';
import type { CostScenarioInput, CostedPlan } from '@/types/v7Costing';

export type ContainerCode = '20GP' | '40GP' | '40HQ';
export type RiskLevel = 'low' | 'medium' | 'high';
export type CalculatorMode = 'single' | 'mixed';
export type CalculationMethod = 'rule' | 'heuristic';
export type LoadingProfile = 'conservative' | 'balanced' | 'aggressive';
export type ShippingScenario = 'general' | 'fba' | 'traditional' | 'fragile';
export type LoadDirection = 'tail-first' | 'balanced' | 'heavy-front';

export interface ContainerSpec {
  code: ContainerCode;
  name: string;
  innerLengthCm: number;
  innerWidthCm: number;
  innerHeightCm: number;
  volumeM3: number;
  maxPayloadKg: number;
  doorWidthCm: number;
  doorHeightCm: number;
}

export interface CargoInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  allowRotate: boolean;
}

export interface CargoItemInput {
  id: string;
  skuName: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  allowRotate: boolean;
  maxStackLayers?: number;
  fragile?: boolean;
  remark?: string;
}

export interface CalculationOptions {
  loadingProfile: LoadingProfile;
  reserveDoorSpaceCm: number;
  reserveTopSpaceCm: number;
  reserveWeightBufferRate: number;
  scenario: ShippingScenario;
  loadDirection: LoadDirection;
  enforceDoorCheck: boolean;
  floorWeightAlertKg: number;
}

export interface BoxOrientation {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  label: string;
}

export interface LayoutPreview {
  perRow: number;
  perCol: number;
  perLayer: number;
  totalLayers: number;
  drawnBoxes: number;
}

export interface AdviceItem {
  level: 'success' | 'info' | 'warning';
  title: string;
  description: string;
}

export interface SkuBreakdownItem {
  skuName: string;
  quantity: number;
  volumeM3: number;
  weightKg: number;
  fragile: boolean;
  stackLimitLabel: string;
  dimensionFit: boolean;
  doorPass: boolean;
}

export interface SplitPlanSuggestion {
  sameContainerCount: number;
  sameContainerLabel: string;
  byVolume: number;
  byWeight: number;
  byCount: number;
  lines: string[];
}

export interface WeightDistributionPlan {
  strategy: LoadDirection;
  frontRatio: number;
  rearRatio: number;
  note: string;
}

export interface DoorCheckInfo {
  checked: boolean;
  canPassDoor: boolean;
  passOrientations: string[];
  blockedOrientations: string[];
}

export interface ContainerCalculationResult {
  containerCode: ContainerCode;
  containerName: string;
  canFit: boolean;
  bestOrientation: BoxOrientation;
  maxFitByCount: number;
  requestedQuantity: number;
  loadedQuantity: number;
  unplacedQuantity: number;
  volumeUsageRate: number;
  weightUsageRate: number;
  countUsageRate: number;
  totalCargoVolumeM3: number;
  totalCargoWeightKg: number;
  remainVolumeM3: number;
  remainWeightKg: number;
  riskLevel: RiskLevel;
  riskMessages: string[];
  layout: LayoutPreview;
  calculationMethod: CalculationMethod;
  notes?: string[];
  skuCount?: number;
  summaryLabel?: string;
  advice?: AdviceItem[];
  skuBreakdown?: SkuBreakdownItem[];
  optionsSnapshot?: CalculationOptions;
  effectiveCapacity?: {
    volumeM3: number;
    maxPayloadKg: number;
    innerLengthCm: number;
    innerHeightCm: number;
  };
  doorCheck?: DoorCheckInfo;
  splitPlan?: SplitPlanSuggestion;
  operationChecklist?: string[];
  weightDistribution?: WeightDistributionPlan;
}

export interface LoadCalculationSummary {
  mode: CalculatorMode;
  cargo: CargoInput;
  cargoItems: CargoItemInput[];
  options: CalculationOptions;
  results: ContainerCalculationResult[];
  recommended?: ContainerCalculationResult;
  multiPlans?: MultiContainerPlan[];
  packagingOptimization?: PackagingOptimizationResult;
  costScenario?: CostScenarioInput;
  costedPlans?: CostedPlan[];
  proposalMarkdown?: string;
  generatedAt: string;
}

export interface CalculationSnapshot {
  id: string;
  title: string;
  createdAt: string;
  summary: LoadCalculationSummary;
}

export interface PlanningCargoSummary {
  totalVolumeM3: number;
  totalWeightKg: number;
  totalQuantity: number;
}

export interface MultiContainerPlanItem {
  containerCode: ContainerCode;
  count: number;
}

export interface MultiContainerPlan {
  id: string;
  composition: MultiContainerPlanItem[];
  totalContainers: number;
  canFit: boolean;
  volumeUsageRate: number;
  weightUsageRate: number;
  unplacedQuantity: number;
  score: number;
  riskLevel: RiskLevel;
  recommendationTag?: string;
  summary: string;
}
