import { calcCBM } from './packing';
import type { ContainerType, PlacedBox } from './types';

export function exportPlanAsJson(input: { container: ContainerType; placed: PlacedBox[] }) {
  const { container, placed } = input;
  const payload = {
    container,
    placed,
    summary: {
      placedCount: placed.length,
      usedCBM: placed.reduce((sum, b) => sum + calcCBM(b.l, b.w, b.h), 0),
      usedWeight: placed.reduce((sum, b) => sum + b.weight, 0),
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
