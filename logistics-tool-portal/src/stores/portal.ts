import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getDashboardStats } from '@/api/portal'

export const usePortalStore = defineStore('portal', () => {
  const inquiriesToday = ref(126)
  const shipmentsInTransit = ref(384)
  const alerts = ref(7)
  const loading = ref(false)

  const stats = computed(() => [
    { label: '今日询价', value: inquiriesToday.value.toString() },
    { label: '在途票数', value: shipmentsInTransit.value.toString() },
    { label: '异常预警', value: alerts.value.toString() }
  ])

  const refreshStats = async () => {
    loading.value = true
    try {
      const data = await getDashboardStats()
      inquiriesToday.value = data.inquiriesToday
      shipmentsInTransit.value = data.shipmentsInTransit
      alerts.value = data.alerts
    } catch {
      // 若后端接口暂未联通，则保留默认演示数据
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    stats,
    refreshStats
  }
})
