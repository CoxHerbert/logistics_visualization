<template>
  <view class="yd-page-container">
    <wd-navbar title="线索列表（临时入口）" left-arrow placeholder safe-area-inset-top fixed @click-left="handleBack" />

    <view class="p-24rpx">
      <wd-search v-model="query.contactValue" placeholder="输入 contactValue" @search="handleSearch" @clear="handleSearch" />
    </view>

    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-20rpx rounded-12rpx bg-white p-20rpx"
      >
        <view class="mb-12rpx text-30rpx text-[#333] font-600">
          {{ item.contactValue || item.contactPhone || item.contactName || '-' }}
        </view>
        <view class="mb-8rpx text-24rpx text-[#666]">
          状态：{{ item.status || '-' }}
        </view>
        <view class="mb-12rpx text-24rpx text-[#666]">
          创建时间：{{ item.createTime || '-' }}
        </view>
        <wd-button type="primary" size="small" @click="handleDetail(item.id)">
          查看详情
        </wd-button>
      </view>

      <wd-status-tip v-if="list.length === 0" image="content" tip="暂无线索数据" />
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { FreightLead } from '@/api/freight/lead'
import type { LoadMoreState } from '@/http/types'

import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'

import { getLeadPage } from '@/api/freight/lead'
import { navigateBackPlus } from '@/utils'

const toast = useToast()

const list = ref<FreightLead[]>([])
const total = ref(0)
const loadMoreState = ref<LoadMoreState>('loading')

const query = ref({
  pageNo: 1,
  pageSize: 10,
  contactValue: '',
})

function handleBack() {
  navigateBackPlus()
}

async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getLeadPage(query.value)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    query.value.pageNo = query.value.pageNo > 1 ? query.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
    toast.error('网络异常')
  }
}

function handleSearch() {
  query.value.pageNo = 1
  list.value = []
  getList()
}

function loadMore() {
  if (loadMoreState.value === 'finished') {
    return
  }
  query.value.pageNo++
  getList()
}

function handleDetail(id?: number) {
  if (!id) {
    toast.error('缺少参数')
    return
  }
  uni.navigateTo({
    url: `/pages/freight/lead-detail/index?id=${id}`,
  })
}

onReachBottom(() => {
  loadMore()
})

onMounted(() => {
  getList()
})
</script>
