import { calcCBM } from './packing';
import type { ContainerType, MultiContainerFeasibility, PlacedBox } from './types';

export type ExportLayerItem = PlacedBox & {
  sequence: number;
};

export type ExportLayerSummary = {
  layerIndex: number;
  y: number;
  count: number;
  items: ExportLayerItem[];
};

export type ExportUnplacedSummary = Array<{
  cargoId: string;
  name: string;
  qty: number;
}>;

export function exportPlanAsJson(input: {
  container: ContainerType;
  placed: PlacedBox[];
  unplacedSummary?: ExportUnplacedSummary;
  failureSummary?: Array<{ reason: string; count: number }>;
  balanceSummary?: {
    centroidX: number;
    centroidZ: number;
    offsetX: number;
    offsetZ: number;
    ratioX: number;
    ratioZ: number;
    toleranceRatio: number;
    isUnbalanced: boolean;
  };
}) {
  const { container, placed, unplacedSummary = [], failureSummary = [], balanceSummary = null } = input;

  const withSequence = placed.map((box, idx) => ({ ...box, sequence: idx + 1 }));
  const layersMap = new Map<number, ExportLayerItem[]>();

  for (const item of withSequence) {
    const bucket = layersMap.get(item.y) || [];
    bucket.push(item);
    layersMap.set(item.y, bucket);
  }

  const layers: ExportLayerSummary[] = [...layersMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([y, items], layerIndex) => ({
      layerIndex,
      y,
      count: items.length,
      items,
    }));

  const payload = {
    generatedAt: new Date().toISOString(),
    container,
    placed: withSequence,
    layers,
    unplacedSummary,
    failureSummary,
    balanceSummary,
    summary: {
      placedCount: placed.length,
      usedCBM: placed.reduce((sum, b) => sum + calcCBM(b.l, b.w, b.h), 0),
      usedWeight: placed.reduce((sum, b) => sum + b.weight, 0),
      layersUsed: layers.length,
      unplacedCount: unplacedSummary.reduce((sum, x) => sum + x.qty, 0),
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `container-plan-${container.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFeasibilityReportAsJson(input: {
  feasibility: MultiContainerFeasibility;
  maxContainers: number;
  options: string[];
}) {
  const { feasibility, maxContainers, options } = input;

  const planRows = feasibility.plans.map((plan) => {
    const usedCBM = plan.placed.reduce((sum, p) => sum + calcCBM(p.l, p.w, p.h), 0);
    const usedWeight = plan.placed.reduce((sum, p) => sum + p.weight, 0);
    return {
      serial: plan.serial,
      containerId: plan.container.id,
      containerName: plan.container.name,
      placedCount: plan.placed.length,
      usedCBM,
      usedWeight,
      cbmUtilization: calcCBM(plan.container.innerLength, plan.container.innerWidth, plan.container.innerHeight) > 0
        ? usedCBM / calcCBM(plan.container.innerLength, plan.container.innerWidth, plan.container.innerHeight)
        : 0,
      weightUtilization: plan.container.maxWeight > 0 ? usedWeight / plan.container.maxWeight : 0,
    };
  });

  const schemeAdvice = feasibility.unplacedCount > 0
    ? `建议采用“${feasibility.plans.length} 个整柜 + 拼箱”方案，拼箱剩余 ${feasibility.unplacedCount} 件。`
    : `建议采用“${feasibility.plans.length} 个整柜”方案，无需拼箱。`;

  const payload = {
    generatedAt: new Date().toISOString(),
    options,
    maxContainers,
    summary: {
      placedCount: feasibility.placedCount,
      unplacedCount: feasibility.unplacedCount,
      fclCount: feasibility.plans.length,
      lclCount: feasibility.unplacedCount,
      schemeAdvice,
    },
    plans: planRows,
    lclRemaining: feasibility.lclRemaining,
    rawPlans: feasibility.plans,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'multi-container-scheme-report.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFeasibilityReportAsText(input: {
  feasibility: MultiContainerFeasibility;
}) {
  const { feasibility } = input;

  const lines: string[] = [];
  lines.push('多柜+拼箱方案报告');
  lines.push(`生成时间: ${new Date().toISOString()}`);
  lines.push(`整柜数量: ${feasibility.plans.length}`);
  lines.push(`整柜装入总件数: ${feasibility.placedCount}`);
  lines.push(`拼箱剩余件数: ${feasibility.unplacedCount}`);
  lines.push('');

  for (const plan of feasibility.plans) {
    const usedCBM = plan.placed.reduce((sum, p) => sum + calcCBM(p.l, p.w, p.h), 0);
    const usedWeight = plan.placed.reduce((sum, p) => sum + p.weight, 0);
    lines.push(`柜 ${plan.serial}: ${plan.container.name} (${plan.container.id})`);
    lines.push(`  装入件数: ${plan.placed.length}`);
    lines.push(`  已用体积: ${usedCBM.toFixed(2)} CBM`);
    lines.push(`  已用重量: ${usedWeight.toFixed(1)} kg`);
  }

  if (feasibility.lclRemaining.length) {
    lines.push('');
    lines.push('拼箱剩余明细:');
    for (const item of feasibility.lclRemaining) {
      lines.push(`  - ${item.name} (${item.cargoId}): ${item.qty} 件`);
    }
  }

  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'multi-container-scheme-report.txt';
  a.click();
  URL.revokeObjectURL(url);
}
