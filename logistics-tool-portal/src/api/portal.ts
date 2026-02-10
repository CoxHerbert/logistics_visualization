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

export type ToolCostItem = {
  name: string
  amount: number
}

export type ToolCalcResp = {
  costBreakdown: ToolCostItem[]
  total: number
  notes: string[]
}

type CommonResult<T> = {
  code: number
  data: T
  msg: string
}

const WEB_API_BASE = import.meta.env.VITE_WEB_API_BASE_URL ?? ''

function unwrapResult<T>(result: CommonResult<T>): T {
  if (typeof result?.code === 'number' && result.code !== 0) {
    throw new Error(result.msg || '请求失败')
  }
  return result.data
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await http.get<DashboardStats>('/dashboard/stats')
  return data
}

export const createFreightLead = async (payload: FreightLeadCreateReq): Promise<number> => {
  const { data } = await http.post<CommonResult<number>>(`${WEB_API_BASE}/web-api/freight/lead/create`, payload)
  return unwrapResult(data)
}

export const calcLclTool = async (payload: {
  origin: string
  destination: string
  volumeCbm: number
  weightKg: number
}): Promise<ToolCalcResp> => {
  const { data } = await http.post<CommonResult<ToolCalcResp>>(`${WEB_API_BASE}/web-api/freight/tool/lcl/calc`, payload)
  return unwrapResult(data)
}

export const calcFclTool = async (payload: {
  origin: string
  destination: string
  containerType: string
  containerCount: number
}): Promise<ToolCalcResp> => {
  const { data } = await http.post<CommonResult<ToolCalcResp>>(`${WEB_API_BASE}/web-api/freight/tool/fcl/calc`, payload)
  return unwrapResult(data)
}

export const checkSensitiveTool = async (payload: {
  cargoDesc: string
}): Promise<ToolCalcResp> => {
  const { data } = await http.post<CommonResult<ToolCalcResp>>(`${WEB_API_BASE}/web-api/freight/tool/sensitive/check`, payload)
  return unwrapResult(data)
}
