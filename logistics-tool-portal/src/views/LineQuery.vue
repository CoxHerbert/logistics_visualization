<script setup lang="ts">
import { reactive, ref } from 'vue'

type RouteItem = {
  route: string
  mode: string
  transit: string
  priceHint: string
}

type VesselProvider = {
  key: string
  label: string
  url: string
}

const formState = reactive({
  origin: '上海',
  destination: '洛杉矶',
  mode: '海运'
})

const result = ref<RouteItem[]>([])

const mockData: RouteItem[] = [
  { route: '上海 → 洛杉矶', mode: '海运', transit: '14-18 天', priceHint: 'USD 1850 / 40HQ 起' },
  { route: '宁波 → 长滩', mode: '海运', transit: '15-20 天', priceHint: 'USD 1760 / 40HQ 起' },
  { route: '深圳 → 纽约', mode: '海运', transit: '28-35 天', priceHint: 'USD 2980 / 40HQ 起' },
  { route: '上海 → 芝加哥', mode: '空运', transit: '4-6 天', priceHint: 'USD 5.6 / KG 起' },
  { route: '深圳 → 洛杉矶', mode: '空运', transit: '3-5 天', priceHint: 'USD 5.2 / KG 起' }
]

const vesselProviders: VesselProvider[] = [
  { key: 'vesselfinder', label: 'VesselFinder 船名航次查询', url: 'https://www.vesselfinder.com/' },
  { key: 'marinetraffic', label: 'MarineTraffic 船舶动态', url: 'https://www.marinetraffic.com/' }
]

const activeProvider = ref<VesselProvider>(vesselProviders[0])

const queryRoutes = () => {
  result.value = mockData.filter(
    (item) =>
      item.mode === formState.mode &&
      item.route.includes(formState.origin.trim()) &&
      item.route.includes(formState.destination.trim())
  )
}

queryRoutes()
</script>

<template>
  <a-card title="中美航线查询">
    <a-alert
      type="info"
      show-icon
      style="margin-bottom: 16px"
      message="船名航次查询（站内 iframe）"
      description="以下为第三方页面嵌入，若平台限制 iframe 显示，可点击“新窗口打开”。"
    />

    <a-space wrap style="margin-bottom: 12px">
      <a-button
        v-for="item in vesselProviders"
        :key="item.key"
        :type="activeProvider.key === item.key ? 'primary' : 'default'"
        @click="activeProvider = item"
      >
        {{ item.label }}
      </a-button>
      <a-button type="link" :href="activeProvider.url" target="_blank" rel="noopener noreferrer">
        新窗口打开
      </a-button>
    </a-space>

    <iframe
      :src="activeProvider.url"
      title="船名航次查询"
      class="vessel-iframe"
      referrerpolicy="no-referrer"
    />

    <a-form layout="inline" style="margin-top: 16px">
      <a-form-item label="中国起运港/城市">
        <a-input v-model:value="formState.origin" placeholder="例如：上海" />
      </a-form-item>
      <a-form-item label="美国目的港/城市">
        <a-input v-model:value="formState.destination" placeholder="例如：洛杉矶" />
      </a-form-item>
      <a-form-item label="运输方式">
        <a-select v-model:value="formState.mode" style="width: 120px">
          <a-select-option value="海运">海运</a-select-option>
          <a-select-option value="空运">空运</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="queryRoutes">查询</a-button>
      </a-form-item>
    </a-form>

    <a-table
      style="margin-top: 16px"
      :pagination="false"
      :data-source="result"
      row-key="route"
      :columns="[
        { title: '中美航线', dataIndex: 'route', key: 'route' },
        { title: '运输方式', dataIndex: 'mode', key: 'mode' },
        { title: '参考时效', dataIndex: 'transit', key: 'transit' },
        { title: '参考价格', dataIndex: 'priceHint', key: 'priceHint' }
      ]"
    />
  </a-card>
</template>

<style scoped>
.vessel-iframe {
  width: 100%;
  height: 560px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  background: #fff;
}
</style>
