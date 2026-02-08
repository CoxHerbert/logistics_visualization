import { http } from './http'

export type DashboardStats = {
  inquiriesToday: number
  shipmentsInTransit: number
  alerts: number
}

export type FreightLeadCreateReq = {
  contactName: string
  contactPhone: string
  departureCity?: string
  destinationCity?: string
  shipMode: number
  cargoType: number
  remark?: string
}

type CommonResult<T> = {
  code: number
  data: T
  msg: string
}

const WEB_API_BASE = import.meta.env.VITE_WEB_API_BASE_URL ?? ''

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await http.get<DashboardStats>('/dashboard/stats')
  return data
}

export const createFreightLead = async (payload: FreightLeadCreateReq): Promise<number> => {
  const { data } = await http.post<CommonResult<number>>(`${WEB_API_BASE}/web-api/freight/lead/create`, payload)
  if (typeof data?.code === 'number' && data.code !== 0) {
    throw new Error(data.msg || '提交失败')
  }
  return data.data
}
