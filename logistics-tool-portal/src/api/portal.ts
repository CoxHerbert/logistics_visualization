import { http, httpPublic } from './http';

type CommonResult<T> = {
  code: number;
  data: T;
  msg: string;
};

export type DashboardStats = {
  inquiriesToday: number;
  shipmentsInTransit: number;
  alerts: number;
};

export type PortalClueCreatePayload = {
  name: string;
  mobile: string;
  telephone?: string;
  email?: string;
  wechat?: string;
  qq?: string;
  remark?: string;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await http.get<DashboardStats>('/dashboard/stats');
  return data;
};

export const createPortalClue = async (payload: PortalClueCreatePayload): Promise<number> => {
  const { data } = await httpPublic.post<CommonResult<number>>('/freight/portal-clue/create', payload);
  if (data.code !== 0) {
    throw new Error(data.msg || '线索提交失败');
  }
  return data.data;
};
