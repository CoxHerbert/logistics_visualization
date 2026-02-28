import type { CostItem, ChargeType } from "./templates";

export interface CartonRow {
  id: string;
  name?: string;
  qty: number;
  size: string; // "60*40*35"
  weightKg: number; // per carton
  cbm?: number; // per carton override
}

export interface Bases {
  totalCartons: number;
  totalCbm: number;
  totalKg: number;
  chargeableKg: number;
  cargoUsd: number;
  dutyRate: number;
  usdCny: number;
}

export interface BreakdownLine {
  key: string;
  label: string;
  amountCny: number;
  note?: string;
}

export function parseSizeToCbm(size: string, unit: "cm" | "m" = "cm"): number {
  if (!size) return 0;
  const s = String(size).trim().replace(/×/g, "*").replace(/x/gi, "*").replace(/\s+/g, "*");
  const parts = s.split("*").map((p) => Number(p)).filter((n) => Number.isFinite(n) && n > 0);
  if (parts.length < 3) return 0;
  const [L, W, H] = parts;
  return unit === "m" ? L * W * H : (L * W * H) / 1_000_000;
}

export function summarizeCartons(rows: CartonRow[], unit: "cm" | "m", airDivisor: number) {
  let totalCartons = 0;
  let totalCbm = 0;
  let totalKg = 0;

  rows.forEach((r) => {
    const qty = Math.max(0, Math.floor(Number(r.qty || 0)));
    const perCbm = r.cbm && r.cbm > 0 ? r.cbm : parseSizeToCbm(r.size, unit);
    totalCartons += qty;
    totalCbm += qty * perCbm;
    totalKg += qty * Number(r.weightKg || 0);
  });

  const divisor = airDivisor > 0 ? airDivisor : 6000;
  const volKg = (totalCbm * 1_000_000) / divisor;
  const chargeableKg = Math.max(totalKg, volKg);

  return { totalCartons, totalCbm, totalKg, chargeableKg, volKg };
}

function clampMin(v: number, min?: number) {
  if (!min || min <= 0) return v;
  return Math.max(v, min);
}

export function computeCost(items: CostItem[], bases: Bases, labelOf: (k: string) => string) {
  const usdToCny = (usd: number) => usd * bases.usdCny;
  const cargoCny = bases.cargoUsd * bases.usdCny;

  const breakdown: BreakdownLine[] = [];

  items.forEach((it) => {
    if (!it.enabled) return;

    const ct: ChargeType = it.chargeType;
    const currency = it.currency || "CNY";
    const minBase = it.minBase || 0;
    const minFee = it.minFee || 0;

    const baseCbm = clampMin(bases.totalCbm, minBase);
    const baseKg = clampMin(bases.totalKg, minBase);
    const baseCkg = clampMin(bases.chargeableKg, minBase);

    let amount = 0;
    let note = it.note || "";

    if (ct === "FIXED") {
      amount = Number(it.rate || 0);
    } else if (ct === "PER_CBM") {
      amount = baseCbm * Number(it.rate || 0);
      note = note || `按CBM：基数=${baseCbm.toFixed(3)}`;
    } else if (ct === "PER_KG") {
      amount = baseKg * Number(it.rate || 0);
      note = note || `按实重：基数=${baseKg.toFixed(2)}kg`;
    } else if (ct === "PER_CHARGEABLE_KG") {
      amount = baseCkg * Number(it.rate || 0);
      note = note || `按计费重：基数=${baseCkg.toFixed(2)}kg`;
    } else if (ct === "PERCENT_CARGO_VALUE") {
      const pct = Number(it.percent || 0);
      amount = cargoCny * (pct / 100);
      note = note || `按货值：${pct}%`;
    }

    if (minFee > 0) amount = Math.max(amount, minFee);

    let amountCny = amount;
    if (currency === "USD") amountCny = usdToCny(amount);

    breakdown.push({
      key: it.key,
      label: labelOf(it.key),
      amountCny,
      note,
    });
  });

  const total = breakdown.reduce((s, b) => s + b.amountCny, 0);
  return { total, breakdown, cargoCny };
}
export interface ParsedCarton {
  name?: string;
  qty: number;
  size: string;
  weightKg: number;
  cbm?: number;
}

/**
 * Parse pasted carton lines into structured rows.
 * Supported examples (one per line):
 * - 箱型A 50 60*40*35 22kg
 * - 50箱 60x40x35cm 22kg
 * - 60×40×35 22kg x50
 * - 配件箱 qty=30 size=50*35*30 weight=18
 * - 50ctn 0.084cbm 22kg
 */
export function parseCartonText(text: string): ParsedCarton[] {
  if (!text) return [];
  const lines = String(text)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const out: ParsedCarton[] = [];

  for (const line0 of lines) {
    const line = line0.replace(/[，,;；]+/g, " ").replace(/\t+/g, " ");

    let name: string | undefined;
    const nameMatch = line.match(/^(?<name>[\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z0-9_\- ]{0,20})\s+(?=\d)/);
    if (nameMatch?.groups?.name) name = nameMatch.groups.name.trim();

    const sizeMatch = line.match(/(?<size>\d+(?:\.\d+)?\s*(?:\*|x|×|\s)\s*\d+(?:\.\d+)?\s*(?:\*|x|×|\s)\s*\d+(?:\.\d+)?)/i);
    const size = sizeMatch?.groups?.size
      ? sizeMatch.groups.size.replace(/\s+/g, "*").replace(/×/g, "*").replace(/x/gi, "*")
      : "";

    const cbmMatch = line.match(/(?:cbm\s*=?\s*)(\d+(?:\.\d+)?)/i) || line.match(/(\d+(?:\.\d+)?)\s*cbm/i);
    const cbm = cbmMatch ? Number(cbmMatch[1]) : undefined;

    const wMatch =
      line.match(/(?:weight|w|重量)\s*=?\s*(\d+(?:\.\d+)?)/i) ||
      line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|千克)/i);
    const weightKg = wMatch ? Number(wMatch[1]) : 0;

    const qMatch =
      line.match(/(?:qty|数量|箱数)\s*=?\s*(\d+)/i) ||
      line.match(/(\d+)\s*(?:箱|ctn|ctns|cartons?)/i) ||
      line.match(/x\s*(\d+)\b/i);

    let qty = qMatch ? Number(qMatch[1]) : 0;
    if (!qty) {
      const fb = line.match(/(^|\s)(\d+)\b/);
      if (fb) qty = Number(fb[2]);
    }

    if (qty > 0 && (size || (cbm != null && cbm > 0))) {
      out.push({
        name,
        qty,
        size: size || "60*40*35",
        weightKg: weightKg > 0 ? weightKg : 0,
        cbm: cbm && cbm > 0 ? cbm : undefined,
      });
    }
  }

  return out;
}


export function buildQuoteText(params: {
  origin: string;
  destination: string;
  bases: Bases;
  breakdown: BreakdownLine[];
  remark?: string;
}) {
  const { origin, destination, bases, breakdown, remark } = params;
  const lines: string[] = [];
  lines.push("FBA总成本（自由组合估算）");
  lines.push(`路线：${origin} -> ${destination}`);
  lines.push(
    `箱数：${bases.totalCartons}｜体积：${bases.totalCbm.toFixed(6).replace(/\.?0+$/,"")}CBM｜实重：${bases.totalKg.toFixed(2).replace(/\.?0+$/,"")}kg｜计费重：${bases.chargeableKg.toFixed(2).replace(/\.?0+$/,"")}kg`
  );
  lines.push(`货值：${bases.cargoUsd.toFixed(2)}USD｜税率：${bases.dutyRate.toFixed(2)}%｜汇率：1USD=${bases.usdCny.toFixed(2)}CNY`);
  if (remark) lines.push(`备注：${remark}`);
  lines.push("--- 费用明细（CNY）---");
  breakdown.forEach((b) => lines.push(`${b.label}: ${Math.round(b.amountCny).toLocaleString("zh-CN")} ${b.note ? `(${b.note})` : ""}`));
  lines.push("----------------------");
  lines.push(`总计：${Math.round(breakdown.reduce((s, b) => s + b.amountCny, 0)).toLocaleString("zh-CN")} CNY`);
  return lines.join("\n");
}
