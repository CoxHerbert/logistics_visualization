import { http } from '@/http/http'

const adminBaseUrl = '/admin-api/freight/lead-activity'
const appBaseUrl = '/app-api/freight/lead-activity'

export type LeadActivityType = 'NOTE' | 'CALL' | 'WECHAT' | 'EMAIL'

export interface FreightLeadActivity {
  id: number
  leadId: number
  type?: LeadActivityType
  content: string
  creator?: string
  createTime?: string
}

export interface CreateLeadActivityReq {
  leadId: number
  type: LeadActivityType
  content: string
}

/** 新增跟进（移动端） */
export function createActivity(data: CreateLeadActivityReq) {
  return http.post<number>(`${appBaseUrl}/create`, data)
}

/** 跟进列表（详情页时间线） */
export function listActivity(leadId: number) {
  return http.get<FreightLeadActivity[]>(`${adminBaseUrl}/list?leadId=${leadId}`)
}
