import type {
  PackagingOptimizationCandidate,
  PackagingOptimizationEvaluation,
  SimplePlanSummary,
} from '@/types/packagingOptimization';

function getRecommendationTag(score: number): '推荐' | '可尝试' | '需谨慎' {
  if (score >= 30) return '推荐';
  if (score >= 10) return '可尝试';
  return '需谨慎';
}

function buildGainSummary(before: SimplePlanSummary, after: SimplePlanSummary, saved: number): string {
  if (saved > 0) {
    return `预计可减少 ${saved} 个柜，方案压柜价值明显。`;
  }
  if (after.riskLevel === 'low' && before.riskLevel !== 'low') {
    return '柜数未减少，但风险等级更低，适合稳妥出货。';
  }
  if (after.estimatedVolumeUsageRate > before.estimatedVolumeUsageRate) {
    return '预计装载率提升，可作为优化包装的尝试方向。';
  }
  return '收益有限，建议结合现场与包装成本综合判断。';
}

export function evaluatePackagingCandidate(
  candidate: PackagingOptimizationCandidate,
  beforeSummary: SimplePlanSummary,
  afterSummary: SimplePlanSummary,
): PackagingOptimizationEvaluation {
  const estimatedContainerSaved = Math.max(0, beforeSummary.totalContainerCount - afterSummary.totalContainerCount);
  const estimatedVolumeUsageDelta = afterSummary.estimatedVolumeUsageRate - beforeSummary.estimatedVolumeUsageRate;
  const estimatedWeightUsageDelta = afterSummary.estimatedWeightUsageRate - beforeSummary.estimatedWeightUsageRate;

  let benefitScore = 0;
  benefitScore += estimatedContainerSaved * 30;
  benefitScore += estimatedVolumeUsageDelta * 100;
  benefitScore += Math.max(0, -estimatedWeightUsageDelta) * 50;
  if (afterSummary.riskLevel === 'low') benefitScore += 8;
  if (afterSummary.riskLevel === 'medium') benefitScore += 3;

  return {
    candidateId: candidate.id,
    title: candidate.title,
    description: candidate.description,
    beforeSummary,
    afterSummary,
    estimatedContainerSaved,
    estimatedVolumeUsageDelta,
    estimatedWeightUsageDelta,
    benefitScore,
    recommendationTag: getRecommendationTag(benefitScore),
    gainSummary: buildGainSummary(beforeSummary, afterSummary, estimatedContainerSaved),
    riskMessages: candidate.riskMessages,
  };
}
