import type { RiskLevel } from '@/types/loadCalculator';

export type OptimizationActionType =
  | 'reduce_height'
  | 'reduce_weight'
  | 'enable_rotation'
  | 'normalize_multi_sku';

export interface PackagingOptimizationAction {
  type: OptimizationActionType;
  label: string;
  deltaHeightCm?: number;
  deltaWeightKg?: number;
  enableRotation?: boolean;
  note?: string;
}

export interface CargoLikeInput {
  skuName?: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  allowRotate?: boolean;
}

export interface PackagingOptimizationCandidate {
  id: string;
  title: string;
  description: string;
  beforeCargo: CargoLikeInput;
  afterCargo: CargoLikeInput;
  actions: PackagingOptimizationAction[];
  riskMessages: string[];
}

export interface SimplePlanSummary {
  planText: string;
  totalContainerCount: number;
  estimatedVolumeUsageRate: number;
  estimatedWeightUsageRate: number;
  riskLevel: RiskLevel;
}

export interface PackagingOptimizationEvaluation {
  candidateId: string;
  title: string;
  description: string;
  beforeSummary: SimplePlanSummary;
  afterSummary: SimplePlanSummary;
  estimatedContainerSaved: number;
  estimatedVolumeUsageDelta: number;
  estimatedWeightUsageDelta: number;
  benefitScore: number;
  recommendationTag: '推荐' | '可尝试' | '需谨慎';
  gainSummary: string;
  riskMessages: string[];
}

export interface PackagingOptimizationResult {
  perSku: Array<{ skuName: string; suggestions: PackagingOptimizationEvaluation[] }>;
  globalAdvice: string[];
}
