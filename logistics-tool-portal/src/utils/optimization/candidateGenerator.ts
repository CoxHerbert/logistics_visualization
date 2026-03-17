import type { CargoLikeInput, PackagingOptimizationCandidate } from '@/types/packagingOptimization';

function clampPositive(value: number, min = 0.1) {
  return value < min ? min : value;
}

export function generatePackagingCandidates(cargo: CargoLikeInput): PackagingOptimizationCandidate[] {
  const candidates: PackagingOptimizationCandidate[] = [];

  [2, 4, 6].forEach((delta, index) => {
    if (cargo.heightCm - delta >= 5) {
      candidates.push({
        id: `reduce-height-${index + 1}`,
        title: `降低箱高 ${delta}cm`,
        description: '通过优化内包材或外箱尺寸，尝试提升层数与装载率。',
        beforeCargo: { ...cargo },
        afterCargo: { ...cargo, heightCm: clampPositive(cargo.heightCm - delta) },
        actions: [{ type: 'reduce_height', label: `箱高 -${delta}cm`, deltaHeightCm: delta }],
        riskMessages: ['需确认产品保护性与外箱强度是否仍满足运输要求。'],
      });
    }
  });

  if (!cargo.allowRotate) {
    candidates.push({
      id: 'enable-rotation',
      title: '允许旋转装柜',
      description: '如产品与包装允许，可通过开放摆放方向提升装柜灵活性。',
      beforeCargo: { ...cargo },
      afterCargo: { ...cargo, allowRotate: true },
      actions: [{ type: 'enable_rotation', label: '允许旋转', enableRotation: true }],
      riskMessages: ['需确认标签朝向、产品受压面与客户要求。'],
    });
  }

  if (cargo.weightKg > 2) {
    const deltaWeight = Math.min(1.5, cargo.weightKg * 0.08);
    candidates.push({
      id: 'reduce-weight',
      title: '减轻单箱重量',
      description: '通过更换包材或分摊单箱货量，降低高重量利用率风险。',
      beforeCargo: { ...cargo },
      afterCargo: { ...cargo, weightKg: clampPositive(cargo.weightKg - deltaWeight) },
      actions: [{ type: 'reduce_weight', label: '单箱减重', deltaWeightKg: deltaWeight }],
      riskMessages: ['需确认是否会影响装箱件数与出货效率。'],
    });
  }

  return candidates;
}
