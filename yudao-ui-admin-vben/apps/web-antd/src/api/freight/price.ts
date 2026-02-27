import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export interface FreightPriceVO {
  id: number;
  transportType: number;
  origin: string;
  destination: string;
  priceMode: number;
  unitPrice: number;
  minPrice: number;
  currency: string;
  validFrom: string;
  validTo: string;
  status: number;
  remark?: string;
  createTime?: string;
}

export interface FreightPricePageReq extends PageParam {
  transportType?: number;
  origin?: string;
  destination?: string;
  status?: number;
}

export const getFreightPricePage = (params: FreightPricePageReq) =>
  requestClient.get<PageResult<FreightPriceVO>>('/freight/price/page', { params });

export const getFreightPrice = (id: number) =>
  requestClient.get<FreightPriceVO>(`/freight/price/get?id=${id}`);

export const createFreightPrice = (data: any) =>
  requestClient.post('/freight/price/create', data);

export const updateFreightPrice = (data: any) =>
  requestClient.put('/freight/price/update', data);

export const updateFreightPriceStatus = (id: number, status: number) =>
  requestClient.put(`/freight/price/update-status?id=${id}&status=${status}`);
