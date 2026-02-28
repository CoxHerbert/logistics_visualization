import { aabbOverlap2D, almostEqual, clamp, overlapArea2D, snapValue } from './math';
import type {
  CargoItem,
  ContainerType,
  EngineConfig,
  MultiContainerFeasibility,
  MultiContainerPlan,
  PlacedBox,
  SpawnState,
} from './types';

export function calcCBM(l: number, w: number, h: number) {
  return (l * w * h) / 1_000_000;
}

type Orientation = { l: number; w: number; rotated: boolean };

function orientationList(input: { l: number; w: number; rotatable?: boolean }): Orientation[] {
  const list: Orientation[] = [{ l: input.l, w: input.w, rotated: false }];
  if (input.rotatable && !almostEqual(input.l, input.w)) {
    list.push({ l: input.w, w: input.l, rotated: true });
  }
  return list;
}

export function expandAllItems(cargoList: CargoItem[]) {
  const items: Array<Omit<PlacedBox, 'x' | 'y' | 'z'> & { rotatable: boolean }> = [];
  for (const c of cargoList) {
    const qty = Math.max(0, Math.floor(c.qty || 0));
    for (let i = 0; i < qty; i++) {
      items.push({
        cargoId: c.id,
        name: c.name,
        l: c.l,
        w: c.w,
        h: c.h,
        weight: c.weight,
        rotatable: c.rotatable,
        rotated: false,
      });
    }
  }
  items.sort((a, b) => b.l * b.w - a.l * a.w || b.weight - a.weight || b.h - a.h);
  return items;
}

function inflatedDimensions(box: { l: number; w: number }, boxGap: number) {
  const gap = Math.max(0, boxGap);
  return {
    l: box.l + gap,
    w: box.w + gap,
  };
}

export function applySnapping(
  x: number,
  z: number,
  box: { l: number; w: number },
  placed: PlacedBox[],
  container: ContainerType,
  yLayer: number,
  cfg: Pick<EngineConfig, 'snapEnabled' | 'snapGrid' | 'snapTolerance' | 'boxGap'>,
) {
  const inflated = inflatedDimensions(box, cfg.boxGap);

  if (!cfg.snapEnabled) {
    return {
      x: clamp(x, 0, Math.max(0, container.innerLength - inflated.l)),
      z: clamp(z, 0, Math.max(0, container.innerWidth - inflated.w)),
    };
  }

  let sx = snapValue(x, cfg.snapGrid);
  let sz = snapValue(z, cfg.snapGrid);
  const t = Math.max(0, cfg.snapTolerance);

  if (Math.abs(sx) <= t) sx = 0;
  if (Math.abs(sz) <= t) sz = 0;
  const rightGap = container.innerLength - (sx + inflated.l);
  const backGap = container.innerWidth - (sz + inflated.w);
  if (Math.abs(rightGap) <= t) sx = container.innerLength - inflated.l;
  if (Math.abs(backGap) <= t) sz = container.innerWidth - inflated.w;

  for (const p of placed) {
    if (!almostEqual(p.y, yLayer)) continue;
    const pi = inflatedDimensions({ l: p.l, w: p.w }, cfg.boxGap);
    const candidatesX = [p.x - inflated.l, p.x + pi.l];
    const candidatesZ = [p.z - inflated.w, p.z + pi.w];

    for (const cx of candidatesX) {
      if (Math.abs(cx - sx) <= t) sx = cx;
    }
    for (const cz of candidatesZ) {
      if (Math.abs(cz - sz) <= t) sz = cz;
    }
  }

  return {
    x: clamp(sx, 0, Math.max(0, container.innerLength - inflated.l)),
    z: clamp(sz, 0, Math.max(0, container.innerWidth - inflated.w)),
  };
}

export function canPlaceAtLayer(
  x: number,
  z: number,
  yLayer: number,
  box: { l: number; w: number; h?: number },
  placed: PlacedBox[],
  container: ContainerType,
  exceptIndex: number | null = null,
  supportRatio = 0.6,
  boxGap = 0,
) {
  const inflated = inflatedDimensions(box, boxGap);

  if (x < 0 || z < 0) return false;
  if (x + inflated.l > container.innerLength || z + inflated.w > container.innerWidth) return false;

  for (let i = 0; i < placed.length; i++) {
    if (exceptIndex != null && i === exceptIndex) continue;
    const p = placed[i];
    if (!almostEqual(p.y, yLayer)) continue;
    const pi = inflatedDimensions({ l: p.l, w: p.w }, boxGap);
    if (aabbOverlap2D(x, z, inflated.l, inflated.w, p.x, p.z, pi.l, pi.w)) return false;
  }

  if (almostEqual(yLayer, 0)) return true;

  const footprint = inflated.l * inflated.w;
  if (footprint <= 0) return false;

  let supportArea = 0;
  for (let i = 0; i < placed.length; i++) {
    if (exceptIndex != null && i === exceptIndex) continue;
    const p = placed[i];
    if (!almostEqual(p.y + p.h, yLayer)) continue;
    const pi = inflatedDimensions({ l: p.l, w: p.w }, boxGap);
    supportArea += overlapArea2D(x, z, inflated.l, inflated.w, p.x, p.z, pi.l, pi.w);
  }
  return supportArea >= supportRatio * footprint;
}

function findPlacementForItem(params: {
  item: { l: number; w: number; h: number; rotatable?: boolean };
  placed: PlacedBox[];
  container: ContainerType;
  cfg: EngineConfig;
}) {
  const { item, placed, container, cfg } = params;
  const step = Math.max(1, cfg.autoStep);

  for (const orient of orientationList(item)) {
    const maxLayer = Math.max(0, Math.floor((container.innerHeight - item.h) / item.h));

    for (let layer = 0; layer <= maxLayer; layer++) {
      const yLayer = layer * item.h;
      for (let z = 0; z <= container.innerWidth - orient.w; z += step) {
        for (let x = 0; x <= container.innerLength - orient.l; x += step) {
          const snapped = applySnapping(x, z, { l: orient.l, w: orient.w }, placed, container, yLayer, cfg);
          if (
            !canPlaceAtLayer(
              snapped.x,
              snapped.z,
              yLayer,
              { l: orient.l, w: orient.w, h: item.h },
              placed,
              container,
              null,
              cfg.supportRatio,
              cfg.boxGap,
            )
          ) {
            continue;
          }
          return {
            x: snapped.x,
            y: yLayer,
            z: snapped.z,
            l: orient.l,
            w: orient.w,
            rotated: orient.rotated,
          };
        }
      }
    }
  }

  return null;
}

export function autoPackOne(params: {
  spawn: SpawnState;
  yLayer: number;
  placed: PlacedBox[];
  container: ContainerType;
  cfg: EngineConfig;
}) {
  const { spawn, yLayer, placed, container, cfg } = params;
  const result: PlacedBox[] = [];
  const step = Math.max(1, cfg.autoStep);

  for (const orient of orientationList(spawn)) {
    for (let z = 0; z <= container.innerWidth - orient.w && spawn.remain > 0; z += step) {
      for (let x = 0; x <= container.innerLength - orient.l && spawn.remain > 0; x += step) {
        const merged = [...placed, ...result];
        const snapped = applySnapping(x, z, { l: orient.l, w: orient.w }, merged, container, yLayer, cfg);
        if (
          !canPlaceAtLayer(
            snapped.x,
            snapped.z,
            yLayer,
            { l: orient.l, w: orient.w, h: spawn.h },
            merged,
            container,
            null,
            cfg.supportRatio,
            cfg.boxGap,
          )
        ) {
          continue;
        }
        result.push({
          cargoId: spawn.cargoId,
          name: spawn.name,
          l: orient.l,
          w: orient.w,
          h: spawn.h,
          weight: spawn.weight,
          x: snapped.x,
          y: yLayer,
          z: snapped.z,
          rotated: orient.rotated,
        });
        spawn.remain -= 1;
      }
    }

    if (spawn.remain <= 0) {
      spawn.rotated = orient.rotated;
      break;
    }
  }

  return result;
}

export function autoPackAll(params: {
  cargoList: CargoItem[];
  placed: PlacedBox[];
  container: ContainerType;
  cfg: EngineConfig;
}) {
  const { cargoList, placed, container, cfg } = params;
  const queue = expandAllItems(cargoList);
  const result: PlacedBox[] = [];
  let unplaced = 0;

  for (const item of queue) {
    const merged = [...placed, ...result];
    const fitted = findPlacementForItem({ item, placed: merged, container, cfg });
    if (!fitted) {
      unplaced += 1;
      continue;
    }
    result.push({ ...item, ...fitted });
  }

  return { placed: result, unplaced };
}

export function planMultiContainerFeasibility(params: {
  cargoList: CargoItem[];
  containerOptions: ContainerType[];
  cfg: EngineConfig;
  maxContainers: number;
}) {
  const { cargoList, containerOptions, cfg } = params;
  const maxContainers = Math.max(1, Math.floor(params.maxContainers || 1));

  const queue = expandAllItems(cargoList);
  const placedFlags = queue.map(() => false);
  const plans: MultiContainerPlan[] = [];

  for (let serial = 1; serial <= maxContainers; serial++) {
    let bestPlaced: PlacedBox[] = [];
    let bestContainer: ContainerType | null = null;

    for (const container of containerOptions) {
      const attempt: PlacedBox[] = [];
      for (let idx = 0; idx < queue.length; idx++) {
        if (placedFlags[idx]) continue;
        const item = queue[idx];
        const fitted = findPlacementForItem({ item, placed: attempt, container, cfg });
        if (fitted) attempt.push({ ...item, ...fitted });
      }
      if (attempt.length > bestPlaced.length) {
        bestPlaced = attempt;
        bestContainer = container;
      }
    }

    if (!bestContainer || !bestPlaced.length) break;

    const planCounter = new Map<string, number>();
    for (const p of bestPlaced) {
      const key = `${p.cargoId}|${p.name}|${p.l}|${p.w}|${p.h}|${p.weight}|${p.rotated ? 1 : 0}`;
      planCounter.set(key, (planCounter.get(key) || 0) + 1);
    }

    for (let idx = 0; idx < queue.length; idx++) {
      if (placedFlags[idx]) continue;
      const item = queue[idx];
      const key = `${item.cargoId}|${item.name}|${item.l}|${item.w}|${item.h}|${item.weight}|${item.rotated ? 1 : 0}`;
      const remain = planCounter.get(key) || 0;
      if (remain <= 0) continue;
      planCounter.set(key, remain - 1);
      placedFlags[idx] = true;
    }

    plans.push({
      container: bestContainer,
      serial,
      placed: bestPlaced,
    });

    if (placedFlags.every(Boolean)) break;
  }

  const remainMap = new Map<string, { cargoId: string; name: string; qty: number }>();
  for (let idx = 0; idx < queue.length; idx++) {
    if (placedFlags[idx]) continue;
    const item = queue[idx];
    const prev = remainMap.get(item.cargoId);
    if (prev) prev.qty += 1;
    else remainMap.set(item.cargoId, { cargoId: item.cargoId, name: item.name, qty: 1 });
  }

  const output: MultiContainerFeasibility = {
    plans,
    lclRemaining: [...remainMap.values()],
    placedCount: placedFlags.filter(Boolean).length,
    unplacedCount: placedFlags.filter((x) => !x).length,
  };

  return output;
}
