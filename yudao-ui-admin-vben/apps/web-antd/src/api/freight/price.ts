import { defHttp } from '@/utils/http/axios';

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

export interface FreightPricePageReq {
  pageNo: number;
  pageSize: number;
  transportType?: number;
  origin?: string;
  destination?: string;
  status?: number;
}

export const getFreightPricePage = (params: FreightPricePageReq) =>
  defHttp.get({ url: '/admin-api/freight/price/page', params });

export const getFreightPrice = (id: number) =>
  defHttp.get({ url: '/admin-api/freight/price/get', params: { id } });

export const createFreightPrice = (data: any) =>
  defHttp.post({ url: '/admin-api/freight/price/create', data });

export const updateFreightPrice = (data: any) =>
  defHttp.put({ url: '/admin-api/freight/price/update', data });

export const updateFreightPriceStatus = (id: number, status: number) =>
  defHttp.put({ url: '/admin-api/freight/price/update-status', params: { id, status } });
