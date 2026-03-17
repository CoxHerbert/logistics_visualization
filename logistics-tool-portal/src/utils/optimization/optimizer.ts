import type {
  CargoLikeInput,
  PackagingOptimizationEvaluation,
  PackagingOptimizationResult,
  SimplePlanSummary,
} from '@/types/packagingOptimization';
import { generatePackagingCandidates } from './candidateGenerator';
import { evaluatePackagingCandidate } from './evaluator';

export interface PlannerLikeResult {
  planText: string;
  totalContainerCount: number;
  estimatedVolumeUsageRate: number;
  estimatedWeightUsageRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export type PlannerLikeFn = (cargo: CargoLikeInput) => PlannerLikeResult;

function toSimpleSummary(plan: PlannerLikeResult): SimplePlanSummary {
  return {
    planText: plan.planText,
    totalContainerCount: plan.totalContainerCount,
    estimatedVolumeUsageRate: plan.estimatedVolumeUsageRate,
    estimatedWeightUsageRate: plan.estimatedWeightUsageRate,
    riskLevel: plan.riskLevel,
  };
}

export function optimizePackagingForCargo(
  cargo: CargoLikeInput,
  planner: PlannerLikeFn,
): PackagingOptimizationEvaluation[] {
  const before = toSimpleSummary(planner(cargo));
  const candidates = generatePackagingCandidates(cargo);

  return candidates
    .map((candidate) => {
      const after = toSimpleSummary(planner(candidate.afterCargo));
      return evaluatePackagingCandidate(candidate, before, after);
    })
    .sort((a, b) => b.benefitScore - a.benefitScore);
}

export function optimizePackagingForCargoSet(
  cargos: CargoLikeInput[],
  planner: PlannerLikeFn,
): PackagingOptimizationResult {
  const perSku = cargos.map((cargo, index) => ({
    skuName: cargo.skuName || `SKU-${index + 1}`,
    suggestions: optimizePackagingForCargo(cargo, planner).slice(0, 3),
  }));

  const globalAdvice: string[] = [];
  const distinctHeights = new Set(cargos.map((cargo) => cargo.heightCm));
  if (distinctHeights.size >= 3) {
    globalAdvice.push('当前多 SKU 箱高差异较大，建议优先尝试统一箱高，提升现场装柜灵活性。');
  }
  const nonRotatableCount = cargos.filter((cargo) => !cargo.allowRotate).length;
  if (nonRotatableCount > 0) {
    globalAdvice.push('部分 SKU 不允许旋转，建议核对是否存在可放开的摆放限制。');
  }
  if (globalAdvice.length === 0) {
    globalAdvice.push('当前多 SKU 结构较稳定，可优先优化高箱高、高重量 SKU。');
  }

  return { perSku, globalAdvice };
}
