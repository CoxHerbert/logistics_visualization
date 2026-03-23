import type { ServiceType, CartonLine } from "./schema";

export interface EstimateOut {
  priceMinCny: number;
  priceMaxCny: number;
  transitMinDays: number;
  transitMaxDays: number;
  included: readonly string[];
  excluded: readonly string[];
  notes: string[];
  basis: {
    cbm: number;
    kg: number;
  };
}

// ===== 示例费率（用户端建议展示“区间”，避免承诺过死） =====
// 你后续可把这些改成后端下发：按 origin/destination/serviceType + 货物属性给不同费率
const RATE = {
  LCL: {
    // CNY/CBM 区间 + 固定费
    cnyPerCbmMin: 680,
    cnyPerCbmMax: 980,
    originFixed: 260,
    docFixed: 180,
    destPerCbmMin: 280,
    destPerCbmMax: 420,
    deliveryPerCbmMin: 320,
    deliveryPerCbmMax: 520,
    transit: [18, 28],
    included: ["订舱", "出口操作", "目的港操作", "尾程派送（到仓）"],
    excluded: ["关税（默认不含）", "查验/滞港/超重超尺寸等异常费用"],
  },
  FCL: {
    // 按柜区间：仅示例（真实可按柜型/港口/派送距离）
    byContainer: {
      "20GP": [16500, 23500],
      "40GP": [22500, 31500],
      "40HQ": [23500, 33500],
    },
    transit: [18, 30],
    included: ["整柜订舱", "出口操作", "目的港操作"],
    excluded: ["关税（默认不含）", "尾程派送（按地址/仓库计）", "查验/滞港等"],
  },
  SEA_DDP: {
    // 海派/海卡到仓一口价：通常含清关/派送，税可能含也可能不含
    cnyPerCbmMin: 900,
    cnyPerCbmMax: 1350,
    minCbm: 1,
    transit: [16, 25],
    included: ["订舱", "清关", "派送到仓（口径以模板为准）"],
    excluded: ["特殊货附加费（带电/液体/粉末）", "超长超重费"],
  }
} as const;

// 特货附加：简单按 CBM 加价（示例）
function specialSurchargePerCbm(flags?: {isBattery?:boolean; isLiquid?:boolean; isPowder?:boolean; isMagnetic?:boolean}){
  let add = 0;
  if (!flags) return add;
  if (flags.isBattery) add += 60;
  if (flags.isLiquid) add += 80;
  if (flags.isPowder) add += 80;
  if (flags.isMagnetic) add += 30;
  return add; // CNY/CBM
}

export function parseSizeToCbm(size: string, unit: "cm" | "m" = "cm"): number {
  if (!size) return 0;
  const s = String(size).trim().replace(/×/g,"*").replace(/x/gi,"*").replace(/\s+/g,"*");
  const parts = s.split("*").map(p=>Number(p)).filter(n=>Number.isFinite(n) && n>0);
  if (parts.length < 3) return 0;
  const [L,W,H] = parts;
  if (unit === "m") return L*W*H;
  return (L*W*H)/1_000_000;
}

export function summarizeCartons(cartons: CartonLine[], unit: "cm" | "m" = "cm"){
  let cbm = 0;
  let kg = 0;
  cartons.forEach(c=>{
    const qty = Math.max(0, Math.floor(Number(c.qty||0)));
    const perCbm = (c.cbm && c.cbm>0) ? c.cbm : parseSizeToCbm(c.size, unit);
    cbm += qty * perCbm;
    kg += qty * (Number(c.weightKg||0));
  });
  return { cbm, kg };
}

// 用户端：给区间（min/max）
export function estimate(serviceType: ServiceType, basis: {cbm:number; kg:number}, opts?: {
  containerType?: "20GP"|"40GP"|"40HQ";
  flags?: {isBattery?:boolean; isLiquid?:boolean; isPowder?:boolean; isMagnetic?:boolean};
}): EstimateOut {
  const cbm = Math.max(0, basis.cbm);
  const kg = Math.max(0, basis.kg);
  const notes: string[] = [];
  const addPerCbm = specialSurchargePerCbm(opts?.flags);

  if (serviceType === "LCL"){
    const r = RATE.LCL;
    const min = cbm * (r.cnyPerCbmMin + addPerCbm) + r.originFixed + r.docFixed + cbm * r.destPerCbmMin + cbm * r.deliveryPerCbmMin;
    const max = cbm * (r.cnyPerCbmMax + addPerCbm) + r.originFixed + r.docFixed + cbm * r.destPerCbmMax + cbm * r.deliveryPerCbmMax;
    if (addPerCbm>0) notes.push(`已按特货属性增加 ${addPerCbm} CNY/CBM（示例规则，可在 pricing.ts 调整）`);
    return {
      priceMinCny: Math.round(min),
      priceMaxCny: Math.round(max),
      transitMinDays: r.transit[0],
      transitMaxDays: r.transit[1],
      included: r.included,
      excluded: r.excluded,
      notes,
      basis: { cbm, kg }
    };
  }

  if (serviceType === "SEA_DDP"){
    const r = RATE.SEA_DDP;
    const billCbm = Math.max(r.minCbm, cbm);
    const min = billCbm * (r.cnyPerCbmMin + addPerCbm);
    const max = billCbm * (r.cnyPerCbmMax + addPerCbm);
    if (cbm < r.minCbm) notes.push(`最低计费 ${r.minCbm} CBM，已按 ${r.minCbm} 计费`);
    if (addPerCbm>0) notes.push(`已按特货属性增加 ${addPerCbm} CNY/CBM（示例规则）`);
    return {
      priceMinCny: Math.round(min),
      priceMaxCny: Math.round(max),
      transitMinDays: r.transit[0],
      transitMaxDays: r.transit[1],
      included: r.included,
      excluded: r.excluded,
      notes,
      basis: { cbm, kg }
    };
  }

  // FCL
  const ct = opts?.containerType || "40HQ";
  const r = RATE.FCL;
  const [min,max] = r.byContainer[ct];
  notes.push("整柜报价通常与提柜/还柜地址、码头、柜型、旺季等强相关，建议提交线索后给精准价");
  return {
    priceMinCny: min,
    priceMaxCny: max,
    transitMinDays: r.transit[0],
    transitMaxDays: r.transit[1],
    included: r.included,
    excluded: r.excluded,
    notes,
    basis: { cbm, kg }
  };
}
