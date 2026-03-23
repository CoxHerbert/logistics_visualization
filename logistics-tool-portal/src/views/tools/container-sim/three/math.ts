export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function snapValue(v: number, grid: number) {
  if (grid <= 0) return v;
  return Math.round(v / grid) * grid;
}

export function overlapArea2D(
  ax: number,
  az: number,
  al: number,
  aw: number,
  bx: number,
  bz: number,
  bl: number,
  bw: number,
) {
  const x1 = Math.max(ax, bx);
  const z1 = Math.max(az, bz);
  const x2 = Math.min(ax + al, bx + bl);
  const z2 = Math.min(az + aw, bz + bw);
  const dx = Math.max(0, x2 - x1);
  const dz = Math.max(0, z2 - z1);
  return dx * dz;
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

export function almostEqual(a: number, b: number, eps = 1e-3) {
  return Math.abs(a - b) <= eps;
}
