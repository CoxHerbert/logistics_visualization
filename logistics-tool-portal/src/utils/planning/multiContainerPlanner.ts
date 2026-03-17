import type {
  ContainerCode,
  ContainerSpec,
  MultiContainerPlan,
  MultiContainerPlanItem,
  PlanningCargoSummary,
} from '@/types/loadCalculator';
import { generateCombinations } from './combination';
import { evaluatePlan } from './evaluator';
import { getPlanRiskLevel, scorePlan } from './scoring';

function getCompositionLabel(composition: MultiContainerPlanItem[]) {
  return composition.map((item) => `${item.count} x ${item.containerCode}`).join(' + ');
}

function getRecommendationTag(index: number, canFit: boolean): string | undefined {
  if (!canFit) return undefined;
  if (index === 0) return '推荐';
  if (index === 1) return '备选';
  return '可行';
}

export function planContainers(
  cargo: PlanningCargoSummary,
  containerSpecs: ContainerSpec[],
  selectedCodes?: ContainerCode[],
  maxPlans = 5,
): MultiContainerPlan[] {
  const availableCodes = (selectedCodes?.length ? selectedCodes : containerSpecs.map((item) => item.code)) as ContainerCode[];
  const combinations = generateCombinations(availableCodes, 1, 5);

  const plans = combinations.map((composition, idx) => {
    const evaluation = evaluatePlan(cargo, composition, containerSpecs);
    const totalContainers = composition.reduce((sum, item) => sum + item.count, 0);
    const score = scorePlan(evaluation, totalContainers);
    const riskLevel = getPlanRiskLevel(evaluation);

    return {
      id: `plan-${idx + 1}`,
      composition,
      totalContainers,
      canFit: evaluation.canFit,
      volumeUsageRate: evaluation.volumeUsageRate,
      weightUsageRate: evaluation.weightUsageRate,
      unplacedQuantity: evaluation.unplacedQuantity,
      score,
      riskLevel,
      summary: getCompositionLabel(composition),
    } satisfies MultiContainerPlan;
  });

  const sorted = plans.sort((a, b) => {
    if (a.canFit !== b.canFit) return a.canFit ? -1 : 1;
    return b.score - a.score;
  });

  return sorted.slice(0, maxPlans).map((plan, index) => ({
    ...plan,
    recommendationTag: getRecommendationTag(index, plan.canFit),
  }));
}
