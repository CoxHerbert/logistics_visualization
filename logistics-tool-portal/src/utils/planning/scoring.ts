import type { RiskLevel } from '@/types/loadCalculator';
import type { PlanEvaluation } from './evaluator';

export function getPlanRiskLevel(evaluation: PlanEvaluation): RiskLevel {
  if (!evaluation.canFit || evaluation.weightUsageRate > 1 || evaluation.volumeUsageRate > 1) {
    return 'high';
  }
  if (evaluation.weightUsageRate > 0.9 || evaluation.volumeUsageRate > 0.92) {
    return 'medium';
  }
  return 'low';
}

export function scorePlan(evaluation: PlanEvaluation, totalContainerCount: number): number {
  let score = 0;

  if (evaluation.canFit) score += 60;
  score += Math.max(0, 20 - Math.abs(0.85 - evaluation.volumeUsageRate) * 60);
  score += Math.max(0, 15 - Math.abs(0.8 - evaluation.weightUsageRate) * 50);
  score -= totalContainerCount * 3;
  score -= evaluation.unplacedQuantity * 0.2;

  return Number(score.toFixed(2));
}
