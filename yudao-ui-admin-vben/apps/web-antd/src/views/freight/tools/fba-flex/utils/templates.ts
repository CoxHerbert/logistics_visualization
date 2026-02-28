export type ServiceTemplateId = "SEA_LCL_DDU" | "SEA_LCL_DDP" | "AIR_DDU";

export const origins = ["上海","宁波","深圳","广州","青岛","厦门","天津","香港"];
export const destinations = ["洛杉矶 (LAX)","长滩 (LGB)","纽约 (NYC)","萨凡纳 (SAV)","休斯顿 (HOU)","芝加哥 (ORD)"];

export type ChargeType =
  | "FIXED"
  | "PER_CBM"
  | "PER_KG"
  | "PER_CHARGEABLE_KG"
  | "PERCENT_CARGO_VALUE";

export const chargeTypeOptions: { label: string; value: ChargeType }[] = [
  { label: "按票固定", value: "FIXED" },
  { label: "按CBM", value: "PER_CBM" },
  { label: "按实重KG", value: "PER_KG" },
  { label: "按计费重KG", value: "PER_CHARGEABLE_KG" },
  { label: "按货值%", value: "PERCENT_CARGO_VALUE" },
];

export type CostItemKey =
  | "linehaul"
  | "origin"
  | "export_customs"
  | "dest_port"
  | "import_customs"
  | "duty"
  | "delivery"
  | "surcharge";

export const itemCatalog: Record<CostItemKey, string> = {
  linehaul: "头程运输费",
  origin: "起运港费用",
  export_customs: "报关费",
  dest_port: "目的港费用",
  import_customs: "清关费",
  duty: "关税",
  delivery: "派送费",
  surcharge: "附加费",
};

export interface CostItem {
  key: CostItemKey;
  enabled: boolean;
  chargeType: ChargeType;
  currency: "CNY" | "USD";
  rate: number;     // FIXED / PER_* 用
  percent?: number; // PERCENT_CARGO_VALUE 用
  minBase?: number; // 最低基数（如最低1CBM/45KG）
  minFee?: number;  // 最低收费（CNY or USD，按 currency）
  note?: string;
}

export interface Template {
  id: ServiceTemplateId;
  name: string;
  notes: string;
  items: CostItem[];
}

export const defaultTemplates: Template[] = [
  {
    id: "SEA_LCL_DDU",
    name: "海运拼箱（DDU 不含税）",
    notes: "示例：运费+港杂+清关/派送，不含关税（可单独开启关税项）。",
    items: [
      { key: "linehaul", enabled: true, chargeType: "PER_CBM", currency: "CNY", rate: 720, minBase: 1, note: "海运费按CBM，最低1CBM" },
      { key: "origin", enabled: true, chargeType: "FIXED", currency: "CNY", rate: 260, note: "起运港操作/文件" },
      { key: "export_customs", enabled: true, chargeType: "FIXED", currency: "CNY", rate: 180, note: "报关/申报" },
      { key: "dest_port", enabled: true, chargeType: "PER_CBM", currency: "CNY", rate: 320, minBase: 1, note: "目的港港杂/操作" },
      { key: "import_customs", enabled: true, chargeType: "FIXED", currency: "USD", rate: 150, note: "清关代理费（USD）" },
      { key: "duty", enabled: false, chargeType: "PERCENT_CARGO_VALUE", currency: "CNY", rate: 0, percent: 10, note: "关税=货值×税率（估算）" },
      { key: "delivery", enabled: true, chargeType: "PER_CBM", currency: "CNY", rate: 380, minBase: 1, note: "尾程派送按CBM" },
      { key: "surcharge", enabled: false, chargeType: "FIXED", currency: "CNY", rate: 0, note: "旺季/燃油/超长等" },
    ],
  },
  {
    id: "SEA_LCL_DDP",
    name: "海运拼箱（DDP 全包）",
    notes: "示例：全包口径。可关闭关税/派送项（如已含在运费里）。",
    items: [
      { key: "linehaul", enabled: true, chargeType: "PER_CBM", currency: "CNY", rate: 950, minBase: 1, note: "全包价示例（按CBM）" },
      { key: "origin", enabled: true, chargeType: "FIXED", currency: "CNY", rate: 260, note: "起运港操作/文件" },
      { key: "export_customs", enabled: true, chargeType: "FIXED", currency: "CNY", rate: 180, note: "报关" },
      { key: "dest_port", enabled: true, chargeType: "PER_CBM", currency: "CNY", rate: 240, minBase: 1, note: "目的港操作" },
      { key: "import_customs", enabled: false, chargeType: "FIXED", currency: "USD", rate: 0, note: "若全包已含可关闭" },
      { key: "duty", enabled: false, chargeType: "PERCENT_CARGO_VALUE", currency: "CNY", rate: 0, percent: 10, note: "DDP通常含税，此处可选" },
      { key: "delivery", enabled: false, chargeType: "PER_CBM", currency: "CNY", rate: 0, minBase: 1, note: "若全包已含可关闭" },
      { key: "surcharge", enabled: false, chargeType: "FIXED", currency: "CNY", rate: 0, note: "旺季/燃油等" },
    ],
  },
  {
    id: "AIR_DDU",
    name: "空运（DDU）",
    notes: "示例：按计费重计费。体积重除数默认6000（cm³/kg）。",
    items: [
      { key: "linehaul", enabled: true, chargeType: "PER_CHARGEABLE_KG", currency: "CNY", rate: 32, minBase: 45, note: "空运费按计费重，最低45kg" },
      { key: "origin", enabled: true, chargeType: "FIXED", currency: "CNY", rate: 220, note: "起运港操作" },
      { key: "export_customs", enabled: false, chargeType: "FIXED", currency: "CNY", rate: 180, note: "可选报关" },
      { key: "dest_port", enabled: true, chargeType: "FIXED", currency: "USD", rate: 60, note: "目的港固定费（USD）" },
      { key: "import_customs", enabled: true, chargeType: "FIXED", currency: "USD", rate: 120, note: "清关代理费（USD）" },
      { key: "duty", enabled: false, chargeType: "PERCENT_CARGO_VALUE", currency: "CNY", rate: 0, percent: 10, note: "关税估算" },
      { key: "delivery", enabled: false, chargeType: "FIXED", currency: "CNY", rate: 0, note: "如需派送可新增/开启" },
      { key: "surcharge", enabled: true, chargeType: "PERCENT_CARGO_VALUE", currency: "CNY", rate: 0, percent: 5, note: "附加费示例：按货值%" },
    ],
  },
];
