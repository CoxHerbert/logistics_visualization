export type ServiceType = 'LCL' | 'FCL' | 'SEA_DDP'; // 拼箱/整柜/海派(到仓一口价口径)

export interface CartonLine {
    id: string;
    name?: string;
    qty: number;
    size: string; // e.g. "60*40*35" (cm)
    weightKg: number; // per carton
    cbm?: number; // optional override
}

export interface QuickForm {
    serviceType: ServiceType;
    origin: string;
    destination: string; // city/state/amazon code
    goodsName: string;
    isBattery?: boolean;
    isLiquid?: boolean;
    isPowder?: boolean;
    totalCbm?: number; // user can directly input
    totalKg?: number;
}

export interface PreciseForm {
    serviceType: ServiceType;
    origin: string;
    destination: string;
    goodsName: string;
    cartons: CartonLine[];
    cargoValueUsd?: number;
    readyDate?: string;
    remark?: string;
    flags: {
        isBattery: boolean;
        isLiquid: boolean;
        isPowder: boolean;
        isMagnetic: boolean;
    };
}
