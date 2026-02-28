import type { CargoItem, PlacedBox } from './types';

export function calcCBM(l: number, w: number, h: number) {
    return (l * w * h) / 1_000_000;
}

export function expandAllItems(cargoList: CargoItem[]) {
    const items: Array<{
        cargoId: string;
        name: string;
        l: number;
        w: number;
        h: number;
        weight: number;
    }> = [];

    for (const c of cargoList) {
        for (let i = 0; i < c.qty; i++) {
            items.push({ cargoId: c.id, name: c.name, l: c.l, w: c.w, h: c.h, weight: c.weight });
        }
    }

    // 底面积大优先，其次重，再其次高
    items.sort((a, b) => b.l * b.w - a.l * a.w || b.weight - a.weight || b.h - a.h);
    return items;
}

export function aabbOverlap2D(
    ax: number,
    az: number,
    al: number,
    aw: number,
    bx: number,
    bz: number,
    bl: number,
    bw: number,
) {
    const overlapX = !(ax + al <= bx || bx + bl <= ax);
    const overlapZ = !(az + aw <= bz || bz + bw <= az);
    return overlapX && overlapZ;
}

export function canPlaceAtLayer(
    x: number,
    z: number,
    yLayer: number,
    box: { l: number; w: number },
    placed: PlacedBox[],
    container: { innerLength: number; innerWidth: number },
    exceptIndex: number | null = null,
) {
    if (x < 0 || z < 0) return false;
    if (x + box.l > container.innerLength) return false;
    if (z + box.w > container.innerWidth) return false;

    for (let i = 0; i < placed.length; i++) {
        if (exceptIndex != null && i === exceptIndex) continue;
        const p = placed[i];
        const sameLayer = Math.abs(p.y - yLayer) < 0.001;
        if (!sameLayer) continue;
        if (aabbOverlap2D(x, z, box.l, box.w, p.x, p.z, p.l, p.w)) return false;
    }
    return true;
}
