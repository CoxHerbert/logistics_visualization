import type { ContainerCode, MultiContainerPlanItem } from '@/types/loadCalculator';

function buildTwoTypePlans(
  left: ContainerCode,
  right: ContainerCode,
  totalCount: number,
): MultiContainerPlanItem[][] {
  const plans: MultiContainerPlanItem[][] = [];
  for (let leftCount = 1; leftCount < totalCount; leftCount += 1) {
    plans.push([
      { containerCode: left, count: leftCount },
      { containerCode: right, count: totalCount - leftCount },
    ]);
  }
  return plans;
}

export function generateCombinations(
  codes: ContainerCode[],
  minCount: number,
  maxCount: number,
): MultiContainerPlanItem[][] {
  const results: MultiContainerPlanItem[][] = [];

  for (let totalCount = minCount; totalCount <= maxCount; totalCount += 1) {
    for (const code of codes) {
      results.push([{ containerCode: code, count: totalCount }]);
    }

    for (let i = 0; i < codes.length; i += 1) {
      for (let j = i + 1; j < codes.length; j += 1) {
        results.push(...buildTwoTypePlans(codes[i], codes[j], totalCount));
      }
    }
  }

  return results;
}
