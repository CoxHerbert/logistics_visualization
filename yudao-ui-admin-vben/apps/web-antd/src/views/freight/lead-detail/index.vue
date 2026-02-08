<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Alert, Card } from 'ant-design-vue';

import type { FreightLeadApi } from '#/api/freight/lead';
import { getFreightLead } from '#/api/freight/lead';

const route = useRoute();
const lead = ref<FreightLeadApi.Lead>();

const leadId = computed(() => Number(route.params.id));

onMounted(async () => {
  if (!Number.isNaN(leadId.value)) {
    lead.value = await getFreightLead(leadId.value);
  }
});
</script>

<template>
  <Page auto-content-height>
    <Card title="线索详情（占位）">
      <Alert
        type="info"
        show-icon
        message="该页面为详情占位，后续可扩展完整详情与跟进记录。"
      />
      <div class="mt-4">线索 ID：{{ leadId }}</div>
      <div class="mt-2">联系人：{{ lead?.contactName || '-' }}</div>
      <div class="mt-2">联系电话：{{ lead?.contactPhone || '-' }}</div>
    </Card>
  </Page>
</template>
