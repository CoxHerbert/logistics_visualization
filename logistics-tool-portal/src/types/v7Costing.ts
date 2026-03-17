import type { ContainerCode, MultiContainerPlanItem, RiskLevel } from '@/types/loadCalculator';

export interface MultiContainerPlanBase {
  planId: string;
  containers: MultiContainerPlanItem[];
  totalContainerCount: number;
  estimatedVolumeUsageRate: number;
  estimatedWeightUsageRate: number;
  canFit: boolean;
  riskLevel: RiskLevel;
  riskMessages: string[];
  score: number;
  recommendationTag?: string;
  summaryText?: string;
}

export interface CargoSummaryForCost {
  totalVolumeM3: number;
  totalWeightKg: number;
  totalQuantity: number;
  skuCount: number;
}

export interface CostScenarioInput {
  currency: string;
  oceanFreightByContainer: Partial<Record<ContainerCode, number>>;
  truckingPerContainer?: number;
  customsPerShipment?: number;
  docsPerShipment?: number;
  thcPerContainer?: number;
  bufferFee?: number;
  destinationFeeOptional?: number;
}

export interface PlanCostBreakdown {
  oceanFreight: number;
  trucking: number;
  customs: number;
  docs: number;
  thc: number;
  buffer: number;
  destinationOptional: number;
  totalCost: number;
}

export interface CostedPlan extends MultiContainerPlanBase {
  costBreakdown: PlanCostBreakdown;
  costPerContainer: number;
  costPerUnit: number;
  costPerCbm: number;
  costPerKg: number;
  pricingTag?: 'cost-friendly' | 'balanced' | 'premium-safe';
}

export interface ClientProposalExportInput {
  customerName?: string;
  cargoSummary: CargoSummaryForCost;
  recommended?: CostedPlan;
  alternatives: CostedPlan[];
  currency: string;
}
