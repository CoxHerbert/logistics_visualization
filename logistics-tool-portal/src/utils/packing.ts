import type { BoxOrientation, CargoInput, CargoItemInput, ContainerSpec } from '@/types/loadCalculator';

function normalizeCargo(cargo: CargoInput | CargoItemInput): CargoInput {
  return {
    lengthCm: cargo.lengthCm,
    widthCm: cargo.widthCm,
    heightCm: cargo.heightCm,
    weightKg: cargo.weightKg,
    quantity: cargo.quantity,
    allowRotate: cargo.allowRotate,
  };
}

export function getBoxOrientations(cargo: CargoInput | CargoItemInput): BoxOrientation[] {
  const normalized = normalizeCargo(cargo);
  const { lengthCm, widthCm, heightCm, allowRotate } = normalized;

  if (!allowRotate) {
    return [{ lengthCm, widthCm, heightCm, label: 'L-W-H' }];
  }

  const raw = [
    [lengthCm, widthCm, heightCm, 'L-W-H'],
    [lengthCm, heightCm, widthCm, 'L-H-W'],
    [widthCm, lengthCm, heightCm, 'W-L-H'],
    [widthCm, heightCm, lengthCm, 'W-H-L'],
    [heightCm, lengthCm, widthCm, 'H-L-W'],
    [heightCm, widthCm, lengthCm, 'H-W-L'],
  ] as const;

  const uniqueMap = new Map<string, BoxOrientation>();
  raw.forEach(([l, w, h, label]) => {
    const key = `${l}-${w}-${h}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, {
        lengthCm: l,
        widthCm: w,
        heightCm: h,
        label,
      });
    }
  });

  return Array.from(uniqueMap.values());
}

export function calculateOrientationFit(
  container: ContainerSpec,
  orientation: BoxOrientation,
  maxStackLayers?: number,
) {
  const perRow = Math.floor(container.innerLengthCm / orientation.lengthCm);
  const perCol = Math.floor(container.innerWidthCm / orientation.widthCm);
  const naturalLayers = Math.floor(container.innerHeightCm / orientation.heightCm);
  const totalLayers = typeof maxStackLayers === 'number' && maxStackLayers > 0
    ? Math.min(naturalLayers, maxStackLayers)
    : naturalLayers;

  const perLayer = perRow * perCol;
  const maxFitByCount = perLayer * totalLayers;

  return {
    perRow,
    perCol,
    perLayer,
    totalLayers,
    maxFitByCount,
  };
}

export function getBestOrientation(
  container: ContainerSpec,
  orientations: BoxOrientation[],
  maxStackLayers?: number,
) {
  const candidates = orientations.map((orientation) => {
    const fit = calculateOrientationFit(container, orientation, maxStackLayers);
    return {
      orientation,
      ...fit,
    };
  });

  candidates.sort((a, b) => {
    if (b.maxFitByCount !== a.maxFitByCount) return b.maxFitByCount - a.maxFitByCount;
    if (b.perLayer !== a.perLayer) return b.perLayer - a.perLayer;
    return b.totalLayers - a.totalLayers;
  });

  return candidates[0];
}
