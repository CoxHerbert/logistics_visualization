import { http, httpPublic } from './http';

export type DashboardStats = {
    inquiriesToday: number;
    shipmentsInTransit: number;
    alerts: number;
};

export type FreightLeadCreateReq = {
    contactName: string;
    contactPhone: string;
    departureCity?: string;
    destinationCity?: string;
    shipMode: number;
    cargoType: number;
    remark?: string;
};

function normalizeLeadPayload(payload: FreightLeadCreateReq): FreightLeadCreateReq {
    const normalized: FreightLeadCreateReq = {
        contactName: payload.contactName.trim(),
        contactPhone: payload.contactPhone.trim(),
        shipMode: payload.shipMode,
        cargoType: payload.cargoType,
    };

    const departureCity = payload.departureCity?.trim();
    if (departureCity) {
        normalized.departureCity = departureCity;
    }

    const destinationCity = payload.destinationCity?.trim();
    if (destinationCity) {
        normalized.destinationCity = destinationCity;
    }

    const remark = payload.remark?.trim();
    if (remark) {
        normalized.remark = remark;
    }

    return normalized;
}

export type ToolCostItem = {
    name: string;
    amount: number;
};

export type ToolCalcResp = {
    costBreakdown: ToolCostItem[];
    total: number;
    notes: string[];
};

type CommonResult<T> = {
    code: number;
    data: T;
    msg: string;
};

function unwrapResult<T>(result: CommonResult<T>): T {
    if (typeof result?.code === 'number' && result.code !== 0) {
        throw new Error(result.msg || '请求失败');
    }
    return result.data;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await http.get<DashboardStats>('/dashboard/stats');
    return data;
};

export const createFreightLead = async (payload: FreightLeadCreateReq): Promise<number> => {
    const { data } = await httpPublic.post<CommonResult<number>>(`/freight/lead/create`, normalizeLeadPayload(payload));
    return unwrapResult(data);
};

export const calcLclTool = async (payload: {
    origin: string;
    destination: string;
    volumeCbm: number;
    weightKg: number;
}): Promise<ToolCalcResp> => {
    const { data } = await http.post<CommonResult<ToolCalcResp>>(`/tools/lcl-pricing`, payload);
    return unwrapResult(data);
};

export const calcFclTool = async (payload: {
    origin: string;
    destination: string;
    containerType: string;
    containerCount: number;
}): Promise<ToolCalcResp> => {
    const { data } = await http.post<CommonResult<ToolCalcResp>>(`/tools/fcl-pricing`, payload);
    return unwrapResult(data);
};

export type ContactConsultCreateReq = {
    contactName: string;
    contactPhone: string;
    companyName?: string;
    shippingRoute?: string;
    remark?: string;
};

export const createContactConsult = async (payload: ContactConsultCreateReq): Promise<number> => {
    const leadPayload = normalizeLeadPayload({
        contactName: payload.contactName,
        contactPhone: payload.contactPhone,
        departureCity: payload.shippingRoute,
        shipMode: 10,
        cargoType: 10,
        remark: [payload.companyName, payload.remark].filter(Boolean).join(' | ') || undefined,
    });
    const { data } = await httpPublic.post<CommonResult<number>>(`/freight/lead/create`, leadPayload);
    return unwrapResult(data);
};
