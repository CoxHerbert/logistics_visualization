import type { ContainerSpec, MultiContainerPlanItem, PlanningCargoSummary } from '@/types/loadCalculator';
import { safeDivide } from '@/utils/math';

export interface PlanEvaluation {
  canFit: boolean;
  volumeUsageRate: number;
  weightUsageRate: number;
  unplacedQuantity: number;
  totalVolumeM3: number;
  totalWeightKg: number;
}

export function evaluatePlan(
  cargo: PlanningCargoSummary,
  composition: MultiContainerPlanItem[],
  containerSpecs: ContainerSpec[],
): PlanEvaluation {
  const totalVolumeM3 = composition.reduce((sum, item) => {
    const spec = containerSpecs.find((container) => container.code === item.containerCode);
    return sum + (spec ? spec.volumeM3 * item.count : 0);
  }, 0);
  const totalWeightKg = composition.reduce((sum, item) => {
    const spec = containerSpecs.find((container) => container.code === item.containerCode);
    return sum + (spec ? spec.maxPayloadKg * item.count : 0);
  }, 0);

  const volumeUsageRate = safeDivide(cargo.totalVolumeM3, totalVolumeM3);
  const weightUsageRate = safeDivide(cargo.totalWeightKg, totalWeightKg);
  const canFit = volumeUsageRate <= 1 && weightUsageRate <= 1;

  const bottleneckUsage = Math.max(volumeUsageRate, weightUsageRate);
  const loadedQuantity = bottleneckUsage <= 0 ? 0 : Math.floor(cargo.totalQuantity / bottleneckUsage);
  const unplacedQuantity = canFit ? 0 : Math.max(0, cargo.totalQuantity - loadedQuantity);

  return {
    canFit,
    volumeUsageRate,
    weightUsageRate,
    unplacedQuantity,
    totalVolumeM3,
    totalWeightKg,
  };
}
