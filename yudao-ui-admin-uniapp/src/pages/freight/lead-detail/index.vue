<template>
  <view class="yd-page-container">
    <wd-navbar
      title="线索详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <wd-cell-group border>
      <wd-cell title="contactValue" :value="contactValue">
        <template #right>
          <wd-button size="small" type="primary" @click.stop="handleCopyContact">
            复制
          </wd-button>
        </template>
      </wd-cell>
      <wd-cell title="shipMode" :value="displayValue(leadDetail?.shipMode)" />
      <wd-cell title="cargoType" :value="displayValue(leadDetail?.cargoType)" />
      <wd-cell title="volumeCbm" :value="displayValue(leadDetail?.volumeCbm)" />
      <wd-cell title="weightKg" :value="displayValue(leadDetail?.weightKg)" />
      <wd-cell title="cartons" :value="displayValue(leadDetail?.cartons)" />
      <wd-cell title="originPort" :value="originPortValue" />
      <wd-cell title="destination" :value="destinationValue" />
      <wd-cell title="status" :value="displayValue(leadDetail?.status)" />
      <wd-cell title="createTime" :value="displayValue(leadDetail?.createTime)" />
    </wd-cell-group>

    <view class="mt-20rpx rounded-12rpx bg-white p-24rpx">
      <view class="mb-20rpx text-30rpx text-[#333] font-600">
        快速新增跟进
      </view>
      <view class="mb-16rpx">
        <text class="mb-8rpx block text-26rpx text-[#666]">type</text>
        <picker :range="activityTypeOptions" range-key="label" :value="activityTypeIndex" @change="onTypeChange">
          <view class="input-like">
            {{ activityForm.type }}
          </view>
        </picker>
      </view>
      <view class="mb-16rpx">
        <text class="mb-8rpx block text-26rpx text-[#666]">content</text>
        <wd-textarea v-model="activityForm.content" placeholder="请输入跟进内容（1~300字）" :maxlength="300" />
      </view>
      <wd-button type="primary" block :loading="submitting" @click="handleSubmitActivity">
        提交跟进
      </wd-button>
    </view>

    <view class="mt-20rpx rounded-12rpx bg-white p-24rpx">
      <view class="mb-20rpx text-30rpx text-[#333] font-600">
        跟进时间线
      </view>
      <view v-if="activityList.length === 0" class="py-20rpx text-center text-24rpx text-[#999]">
        暂无跟进记录
      </view>
      <view v-for="item in activityList" :key="item.id" class="mb-16rpx border-b border-[#f0f0f0] pb-16rpx last:border-b-none">
        <view class="mb-8rpx text-26rpx text-[#333]">
          {{ item.content }}
        </view>
        <view class="text-22rpx text-[#999]">
          {{ item.type || '-' }} · {{ item.createTime || '-' }} · {{ item.creator || '-' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { FreightLead } from '@/api/freight/lead'
import type { CreateLeadActivityReq, FreightLeadActivity, LeadActivityType } from '@/api/freight/leadActivity'

import { computed, onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'

import { getLead } from '@/api/freight/lead'
import { createActivity, listActivity } from '@/api/freight/leadActivity'
import { navigateBackPlus } from '@/utils'

const props = defineProps<{ id?: number | string }>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const toast = useToast()
const leadId = computed(() => Number(props.id))

const leadDetail = ref<FreightLead>()
const activityList = ref<FreightLeadActivity[]>([])
const submitting = ref(false)

const activityTypeOptions: { label: LeadActivityType, value: LeadActivityType }[] = [
  { label: 'NOTE', value: 'NOTE' },
  { label: 'CALL', value: 'CALL' },
  { label: 'WECHAT', value: 'WECHAT' },
  { label: 'EMAIL', value: 'EMAIL' },
]

const activityForm = ref<CreateLeadActivityReq>({
  leadId: 0,
  type: 'NOTE',
  content: '',
})

const activityTypeIndex = computed(() => activityTypeOptions.findIndex(item => item.value === activityForm.value.type))

const contactValue = computed(() => {
  return leadDetail.value?.contactValue || leadDetail.value?.contactPhone || leadDetail.value?.contactName || '-'
})

const originPortValue = computed(() => {
  return displayValue(leadDetail.value?.originPort || leadDetail.value?.departureCity)
})

const destinationValue = computed(() => {
  return displayValue(leadDetail.value?.destination || leadDetail.value?.destinationCity)
})

function displayValue(val: any) {
  return val === null || val === undefined || val === '' ? '-' : String(val)
}

function handleBack() {
  navigateBackPlus('/pages/freight/lead-list/index')
}

function onTypeChange(event: any) {
  const index = Number(event?.detail?.value || 0)
  activityForm.value.type = activityTypeOptions[index]?.value || 'NOTE'
}

function handleCopyContact() {
  if (!contactValue.value || contactValue.value === '-') {
    return
  }
  uni.setClipboardData({
    data: contactValue.value,
    success: () => {
      toast.success('已复制')
    },
  })
}

async function loadLeadDetail() {
  try {
    leadDetail.value = await getLead(leadId.value)
  } catch (error: any) {
    const msg = error?.msg || error?.message || '网络异常'
    toast.error(msg === 'Network Error' ? '网络异常' : `提交失败${msg ? `: ${msg}` : ''}`)
  }
}

async function loadActivityList() {
  try {
    activityList.value = await listActivity(leadId.value)
  } catch (error: any) {
    const msg = error?.msg || error?.message
    toast.error(msg ? `提交失败: ${msg}` : '网络异常')
  }
}

async function handleSubmitActivity() {
  const content = activityForm.value.content.trim()
  if (content.length < 1 || content.length > 300) {
    toast.warning('content 需为 1~300 字')
    return
  }
  submitting.value = true
  try {
    await createActivity({
      leadId: leadId.value,
      type: activityForm.value.type,
      content,
    })
    activityForm.value.content = ''
    toast.success('已提交')
    await loadActivityList()
  } catch (error: any) {
    const msg = error?.msg || error?.message
    toast.error(msg ? `提交失败: ${msg}` : '网络异常')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!leadId.value) {
    toast.error('缺少参数')
    return
  }
  activityForm.value.leadId = leadId.value
  await Promise.all([loadLeadDetail(), loadActivityList()])
})
</script>

<style scoped lang="scss">
.input-like {
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
}
</style>
