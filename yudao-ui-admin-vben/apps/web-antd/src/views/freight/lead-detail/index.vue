<script lang="ts" setup>
import type { FreightLeadActivityApi, FreightLeadApi } from '#/api/freight/lead';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { Button, Card, DatePicker, Descriptions, Form, Input, message, Select, Timeline } from 'ant-design-vue';

import {
  createFreightLeadActivity,
  getFreightLead,
  getFreightLeadActivityList,
  updateFreightLead,
} from '#/api/freight/lead';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const creatingActivity = ref(false);
const lead = ref<FreightLeadApi.Lead>();
const activityList = ref<FreightLeadActivityApi.Activity[]>([]);

const leadId = computed(() => Number(route.params.id));

const statusOptions = [
  { label: '新建', value: 10 },
  { label: '跟进中', value: 20 },
  { label: '已转化', value: 30 },
  { label: '已关闭', value: 40 },
];

const statusForm = reactive({
  status: 10,
  remark: '',
});

const activityForm = reactive<FreightLeadActivityApi.ActivityCreateReqVO>({
  leadId: 0,
  content: '',
});

async function loadLeadDetail() {
  if (Number.isNaN(leadId.value)) {
    return;
  }
  loading.value = true;
  try {
    const [leadData, activities] = await Promise.all([
      getFreightLead(leadId.value),
      getFreightLeadActivityList(leadId.value),
    ]);
    lead.value = leadData;
    activityList.value = activities;
    statusForm.status = leadData.status;
    statusForm.remark = leadData.remark || '';
    activityForm.leadId = leadId.value;
  } finally {
    loading.value = false;
  }
}

async function handleUpdateStatus() {
  if (!lead.value) {
    return;
  }
  saving.value = true;
  try {
    await updateFreightLead({
      id: lead.value.id,
      status: statusForm.status,
      remark: statusForm.remark,
    });
    message.success('线索状态更新成功');
    await loadLeadDetail();
  } finally {
    saving.value = false;
  }
}

async function handleCreateActivity() {
  if (!activityForm.content.trim()) {
    message.warning('请输入跟进内容');
    return;
  }
  creatingActivity.value = true;
  try {
    await createFreightLeadActivity({
      leadId: leadId.value,
      content: activityForm.content,
      nextContactTime: activityForm.nextContactTime,
    });
    activityForm.content = '';
    activityForm.nextContactTime = undefined;
    message.success('新增跟进成功');
    await loadLeadDetail();
  } finally {
    creatingActivity.value = false;
  }
}

onMounted(loadLeadDetail);
</script>

<template>
  <Page auto-content-height title="线索详情" :loading="loading">
    <template #extra>
      <Button @click="router.push('/freight/leads')">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        返回列表
      </Button>
    </template>

    <Card title="线索信息">
      <Descriptions :column="2" bordered size="small">
        <Descriptions.Item label="线索编号">{{ lead?.id }}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{{ lead?.createTime || '-' }}</Descriptions.Item>
        <Descriptions.Item label="联系人">{{ lead?.contactName || '-' }}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{{ lead?.contactPhone || '-' }}</Descriptions.Item>
        <Descriptions.Item label="出发地">{{ lead?.departureCity || '-' }}</Descriptions.Item>
        <Descriptions.Item label="目的地">{{ lead?.destinationCity || '-' }}</Descriptions.Item>
        <Descriptions.Item label="运输方式">{{ lead?.shipMode }}</Descriptions.Item>
        <Descriptions.Item label="货物类型">{{ lead?.cargoType }}</Descriptions.Item>
      </Descriptions>
    </Card>

    <Card class="mt-4" title="状态调整">
      <Form layout="inline">
        <Form.Item label="线索状态">
          <Select v-model:value="statusForm.status" :options="statusOptions" style="width: 160px" />
        </Form.Item>
        <Form.Item label="备注">
          <Input
            v-model:value="statusForm.remark"
            placeholder="可选，更新线索备注"
            style="width: 360px"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" :loading="saving" @click="handleUpdateStatus">
            更新状态
          </Button>
        </Form.Item>
      </Form>
    </Card>

    <Card class="mt-4" title="新增跟进">
      <Form layout="inline">
        <Form.Item label="跟进内容" required>
          <Input
            v-model:value="activityForm.content"
            placeholder="请输入跟进内容"
            style="width: 420px"
          />
        </Form.Item>
        <Form.Item label="下次联系时间">
          <DatePicker
            v-model:value="activityForm.nextContactTime"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次联系时间"
            style="width: 220px"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" :loading="creatingActivity" @click="handleCreateActivity">
            新增跟进
          </Button>
        </Form.Item>
      </Form>
    </Card>

    <Card class="mt-4" title="跟进时间线">
      <Timeline v-if="activityList.length > 0">
        <Timeline.Item v-for="item in activityList" :key="item.id">
          <div class="text-[14px]">{{ item.content }}</div>
          <div class="text-[12px] text-gray-500 mt-1">
            {{ item.createTime || '-' }} · {{ item.creator || '-' }}
            <span v-if="item.nextContactTime"> · 下次联系：{{ item.nextContactTime }}</span>
          </div>
        </Timeline.Item>
      </Timeline>
      <div v-else class="text-gray-500">暂无跟进记录</div>
    </Card>
  </Page>
</template>
