<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

import { calcFclTool, type ToolCalcResp } from '@/api/portal'

type VesselProvider = {
  key: string
  label: string
  url: string
}

const formState = reactive({
  origin: '上海',
  destination: '洛杉矶',
  mode: '海运',
  containerType: '40HQ',
  containerCount: 1
})

const toolResult = ref<ToolCalcResp>()
const loading = ref(false)

const vesselProviders: VesselProvider[] = [
  { key: 'vesselfinder', label: 'VesselFinder 船名航次查询', url: 'https://www.vesselfinder.com/' },
  { key: 'marinetraffic', label: 'MarineTraffic 船舶动态', url: 'https://www.marinetraffic.com/' }
]

const activeProvider = ref<VesselProvider>(vesselProviders[0])

const queryRoutes = async () => {
  if (formState.containerCount <= 0) {
    message.warning('箱量必须大于 0')
    return
  }
  loading.value = true
  try {
    toolResult.value = await calcFclTool({
      origin: formState.origin,
      destination: formState.destination,
      containerType: formState.containerType,
      containerCount: formState.containerCount
    })
  } catch (error: any) {
    message.error(error?.message || '查询失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

queryRoutes()

const leadQuery = computed(() => ({
  origin: formState.origin,
  destination: formState.destination,
  shipMode: formState.mode === '海运' ? 20 : 10,
  cargoType: 10,
  remark: `来源工具：航线查询；箱型：${formState.containerType}；箱量：${formState.containerCount}；预估总费用：${toolResult.value?.total ?? '-'}。`
}))
</script>

<template>
  <a-card title="中美航线查询 + FCL 参考报价">
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
      <a-form-item label="箱型">
        <a-select v-model:value="formState.containerType" style="width: 120px">
          <a-select-option value="20GP">20GP</a-select-option>
          <a-select-option value="40GP">40GP</a-select-option>
          <a-select-option value="40HQ">40HQ</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="箱量">
        <a-input-number v-model:value="formState.containerCount" :min="1" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" :loading="loading" @click="queryRoutes">查询</a-button>
      </a-form-item>
      <a-form-item>
        <RouterLink :to="{ path: '/get-plan', query: leadQuery }">
          <a-button>根据结果获取方案</a-button>
        </RouterLink>
      </a-form-item>
    </a-form>

    <a-card v-if="toolResult" style="margin-top: 16px" size="small" title="工具计算结果">
      <a-table
        :pagination="false"
        :data-source="toolResult.costBreakdown"
        row-key="name"
        :columns="[
          { title: '费用项', dataIndex: 'name', key: 'name' },
          { title: '金额', dataIndex: 'amount', key: 'amount' }
        ]"
      />
      <a-alert
        style="margin-top: 12px"
        type="success"
        show-icon
        :message="`合计：${toolResult.total}`"
      />
      <a-typography-paragraph v-for="note in toolResult.notes" :key="note" style="margin-bottom: 0">
        · {{ note }}
      </a-typography-paragraph>
    </a-card>
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
