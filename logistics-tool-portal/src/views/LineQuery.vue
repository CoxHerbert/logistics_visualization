<script setup lang="ts">
import { reactive, ref } from 'vue'

type RouteItem = {
  route: string
  mode: string
  transit: string
  priceHint: string
}

const formState = reactive({
  origin: '',
  destination: '',
  mode: '海运'
})

const result = ref<RouteItem[]>([])

const mockData: RouteItem[] = [
  { route: '宁波 → 汉堡', mode: '海运', transit: '28-33 天', priceHint: 'USD 1450 / 40HQ 起' },
  { route: '深圳 → 迪拜', mode: '海运', transit: '16-20 天', priceHint: 'USD 920 / 40HQ 起' },
  { route: '上海 → 芝加哥', mode: '空运', transit: '4-6 天', priceHint: 'USD 4.8 / KG 起' }
]

const queryRoutes = () => {
  result.value = mockData.filter((item) => item.mode === formState.mode)
}
</script>

<template>
  <a-card title="航线查询">
    <a-form layout="inline">
      <a-form-item label="起运港/城市">
        <a-input v-model:value="formState.origin" placeholder="例如：上海" />
      </a-form-item>
      <a-form-item label="目的港/城市">
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
        { title: '航线', dataIndex: 'route', key: 'route' },
        { title: '运输方式', dataIndex: 'mode', key: 'mode' },
        { title: '参考时效', dataIndex: 'transit', key: 'transit' },
        { title: '参考价格', dataIndex: 'priceHint', key: 'priceHint' }
      ]"
    />
  </a-card>
</template>
