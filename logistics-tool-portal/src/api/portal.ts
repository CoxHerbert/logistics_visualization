import { http } from './http'

export type DashboardStats = {
  inquiriesToday: number
  shipmentsInTransit: number
  alerts: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await http.get<DashboardStats>('/dashboard/stats')
  return data
}
