import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'

const baseUrl = '/admin-api/freight/lead'

export interface FreightLead {
  id: number
  contactValue?: string
  contactName?: string
  contactPhone?: string
  shipMode?: string | number
  cargoType?: string | number
  volumeCbm?: number
  weightKg?: number
  cartons?: number
  originPort?: string
  destination?: string
  status?: string | number
  createTime?: string
  departureCity?: string
  destinationCity?: string
  remark?: string
}

export interface FreightLeadPageParam extends PageParam {
  contactValue?: string
  status?: string | number
}

/** 获取线索详情 */
export function getLead(id: number) {
  return http.get<FreightLead>(`${baseUrl}/get?id=${id}`)
}

/** 获取线索分页（临时入口页使用） */
export function getLeadPage(params: FreightLeadPageParam) {
  return http.get<PageResult<FreightLead>>(`${baseUrl}/page`, params)
}
