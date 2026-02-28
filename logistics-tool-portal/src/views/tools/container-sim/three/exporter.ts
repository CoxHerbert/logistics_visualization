import { calcCBM } from './packing';
import type { ContainerType, PlacedBox } from './types';

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
  failureSummary?: Array<{ reason: string; count: number }> ;
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
