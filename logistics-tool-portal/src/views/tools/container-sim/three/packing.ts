import { aabbOverlap2D, almostEqual, clamp, overlapArea2D, snapValue } from './math';
import type { CargoItem, ContainerType, EngineConfig, PlacedBox, SpawnState } from './types';

export function calcCBM(l: number, w: number, h: number) {
  return (l * w * h) / 1_000_000;
}

export function expandAllItems(cargoList: CargoItem[]) {
  const items: Array<Omit<PlacedBox, 'x' | 'y' | 'z'>> = [];
  for (const c of cargoList) {
    const qty = Math.max(0, Math.floor(c.qty || 0));
    for (let i = 0; i < qty; i++) {
      items.push({ cargoId: c.id, name: c.name, l: c.l, w: c.w, h: c.h, weight: c.weight });
    }
  }
  items.sort((a, b) => b.l * b.w - a.l * a.w || b.weight - a.weight || b.h - a.h);
  return items;
}

export function applySnapping(
  x: number,
  z: number,
  box: { l: number; w: number },
  placed: PlacedBox[],
  container: ContainerType,
  yLayer: number,
  cfg: Pick<EngineConfig, 'snapEnabled' | 'snapGrid' | 'snapTolerance'>,
) {
  if (!cfg.snapEnabled) {
    return {
      x: clamp(x, 0, Math.max(0, container.innerLength - box.l)),
      z: clamp(z, 0, Math.max(0, container.innerWidth - box.w)),
    };
  }

  let sx = snapValue(x, cfg.snapGrid);
  let sz = snapValue(z, cfg.snapGrid);
  const t = Math.max(0, cfg.snapTolerance);

  // 贴柜壁
  if (Math.abs(sx) <= t) sx = 0;
  if (Math.abs(sz) <= t) sz = 0;
  const rightGap = container.innerLength - (sx + box.l);
  const backGap = container.innerWidth - (sz + box.w);
  if (Math.abs(rightGap) <= t) sx = container.innerLength - box.l;
  if (Math.abs(backGap) <= t) sz = container.innerWidth - box.w;

  // 同层贴箱边
  for (const p of placed) {
    if (!almostEqual(p.y, yLayer)) continue;
    const candidatesX = [p.x - box.l, p.x + p.l];
    const candidatesZ = [p.z - box.w, p.z + p.w];

    for (const cx of candidatesX) {
      if (Math.abs(cx - sx) <= t) sx = cx;
    }
    for (const cz of candidatesZ) {
      if (Math.abs(cz - sz) <= t) sz = cz;
    }
  }

  return {
    x: clamp(sx, 0, Math.max(0, container.innerLength - box.l)),
    z: clamp(sz, 0, Math.max(0, container.innerWidth - box.w)),
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
) {
  if (x < 0 || z < 0) return false;
  if (x + box.l > container.innerLength || z + box.w > container.innerWidth) return false;

  for (let i = 0; i < placed.length; i++) {
    if (exceptIndex != null && i === exceptIndex) continue;
    const p = placed[i];
    if (!almostEqual(p.y, yLayer)) continue;
    if (aabbOverlap2D(x, z, box.l, box.w, p.x, p.z, p.l, p.w)) return false;
  }

  if (almostEqual(yLayer, 0)) return true;

  const footprint = box.l * box.w;
  if (footprint <= 0) return false;

  let supportArea = 0;
  for (let i = 0; i < placed.length; i++) {
    if (exceptIndex != null && i === exceptIndex) continue;
    const p = placed[i];
    if (!almostEqual(p.y + p.h, yLayer)) continue;
    supportArea += overlapArea2D(x, z, box.l, box.w, p.x, p.z, p.l, p.w);
  }
  return supportArea >= supportRatio * footprint;
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

  for (let z = 0; z <= container.innerWidth - spawn.w && spawn.remain > 0; z += step) {
    for (let x = 0; x <= container.innerLength - spawn.l && spawn.remain > 0; x += step) {
      const snapped = applySnapping(x, z, { l: spawn.l, w: spawn.w }, [...placed, ...result], container, yLayer, cfg);
      if (!canPlaceAtLayer(snapped.x, snapped.z, yLayer, { l: spawn.l, w: spawn.w, h: spawn.h }, [...placed, ...result], container, null, cfg.supportRatio)) {
        continue;
      }
      result.push({
        cargoId: spawn.cargoId,
        name: spawn.name,
        l: spawn.l,
        w: spawn.w,
        h: spawn.h,
        weight: spawn.weight,
        x: snapped.x,
        y: yLayer,
        z: snapped.z,
      });
      spawn.remain -= 1;
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
  const step = Math.max(1, cfg.autoStep);

  for (const item of queue) {
    let done = false;
    const maxLayer = Math.max(0, Math.floor((container.innerHeight - item.h) / item.h));

    for (let layer = 0; layer <= maxLayer && !done; layer++) {
      const yLayer = layer * item.h;
      for (let z = 0; z <= container.innerWidth - item.w && !done; z += step) {
        for (let x = 0; x <= container.innerLength - item.l && !done; x += step) {
          const snapped = applySnapping(x, z, { l: item.l, w: item.w }, [...placed, ...result], container, yLayer, cfg);
          if (!canPlaceAtLayer(snapped.x, snapped.z, yLayer, item, [...placed, ...result], container, null, cfg.supportRatio)) {
            continue;
          }
          result.push({ ...item, x: snapped.x, y: yLayer, z: snapped.z });
          done = true;
        }
      }
    }

    if (!done) unplaced += 1;
  }

  return { placed: result, unplaced };
}
