import type {
  CargoSummaryForCost,
  CostScenarioInput,
  CostedPlan,
  MultiContainerPlanBase,
  PlanCostBreakdown,
} from '@/types/v7Costing';
import type { ContainerCode } from '@/types/loadCalculator';

function sumContainerCount(plan: MultiContainerPlanBase): number {
  return plan.containers.reduce((sum, item) => sum + item.count, 0);
}

function calcOceanFreight(
  plan: MultiContainerPlanBase,
  oceanFreightByContainer: Partial<Record<ContainerCode, number>>,
): number {
  return plan.containers.reduce((sum, item) => {
    const unitPrice = oceanFreightByContainer[item.containerCode] ?? 0;
    return sum + unitPrice * item.count;
  }, 0);
}

export function buildPlanCostBreakdown(plan: MultiContainerPlanBase, scenario: CostScenarioInput): PlanCostBreakdown {
  const containerCount = sumContainerCount(plan);
  const oceanFreight = calcOceanFreight(plan, scenario.oceanFreightByContainer);
  const trucking = (scenario.truckingPerContainer ?? 0) * containerCount;
  const customs = scenario.customsPerShipment ?? 0;
  const docs = scenario.docsPerShipment ?? 0;
  const thc = (scenario.thcPerContainer ?? 0) * containerCount;
  const buffer = scenario.bufferFee ?? 0;
  const destinationOptional = scenario.destinationFeeOptional ?? 0;

  const totalCost = oceanFreight + trucking + customs + docs + thc + buffer + destinationOptional;
  return {
    oceanFreight,
    trucking,
    customs,
    docs,
    thc,
    buffer,
    destinationOptional,
    totalCost,
  };
}

export function attachCostToPlan(
  plan: MultiContainerPlanBase,
  cargoSummary: CargoSummaryForCost,
  scenario: CostScenarioInput,
): CostedPlan {
  const costBreakdown = buildPlanCostBreakdown(plan, scenario);
  const totalContainerCount = Math.max(1, sumContainerCount(plan));
  const totalQuantity = Math.max(1, cargoSummary.totalQuantity);
  const totalVolumeM3 = Math.max(0.0001, cargoSummary.totalVolumeM3);
  const totalWeightKg = Math.max(0.0001, cargoSummary.totalWeightKg);

  const costPerContainer = costBreakdown.totalCost / totalContainerCount;
  const costPerUnit = costBreakdown.totalCost / totalQuantity;
  const costPerCbm = costBreakdown.totalCost / totalVolumeM3;
  const costPerKg = costBreakdown.totalCost / totalWeightKg;

  let pricingTag: CostedPlan['pricingTag'] = 'balanced';
  if (plan.riskLevel === 'low' && plan.estimatedVolumeUsageRate < 0.9) {
    pricingTag = 'premium-safe';
  } else if (costPerContainer < 2500) {
    pricingTag = 'cost-friendly';
  }

  return {
    ...plan,
    costBreakdown,
    costPerContainer,
    costPerUnit,
    costPerCbm,
    costPerKg,
    pricingTag,
  };
}

export function costPlans(
  plans: MultiContainerPlanBase[],
  cargoSummary: CargoSummaryForCost,
  scenario: CostScenarioInput,
): CostedPlan[] {
  return plans.map((plan) => attachCostToPlan(plan, cargoSummary, scenario));
}

export function getCostFriendlyPlan(plans: CostedPlan[]): CostedPlan | undefined {
  return [...plans]
    .filter((item) => item.canFit)
    .sort((a, b) => a.costBreakdown.totalCost - b.costBreakdown.totalCost)[0];
}
