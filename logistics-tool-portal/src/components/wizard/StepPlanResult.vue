<template>
  <a-card title="Step 3 · 方案结果" :bordered="false">
    <a-empty v-if="!resultSummary" description="请先完成计算" />
    <template v-else>
      <a-alert
        type="success"
        show-icon
        :message="`推荐方案：${recommendedTitle}`"
        style="margin-bottom: 16px"
      />

      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="12">
          <a-card size="small" title="推荐摘要">
            <a-descriptions size="small" :column="1">
              <a-descriptions-item label="方案">{{ recommendedTitle }}</a-descriptions-item>
              <a-descriptions-item label="利用率">{{ recommendedUtilization }}</a-descriptions-item>
              <a-descriptions-item label="风险等级">
                <a-tag :color="riskTagColor">{{ recommendedRisk }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="说明">{{ recommendedReason }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small" title="风险提示">
            <a-empty v-if="!resultSummary.riskMessages.length" description="暂无风险" />
            <a-space v-else direction="vertical">
              <a-alert v-for="item in resultSummary.riskMessages" :key="item" type="warning" :message="item" show-icon />
            </a-space>
          </a-card>
        </a-col>
      </a-row>

      <a-collapse v-if="resultSummary.alternativePlans?.length" style="margin-bottom: 16px">
        <a-collapse-panel key="comparison" :header="`方案对比详情（${resultSummary.alternativePlans.length}个）`">
          <MultiPlanComparison :plans="resultSummary.alternativePlans as any" />
        </a-collapse-panel>
      </a-collapse>

      <a-card size="small" title="装柜结构图（按方案查看）">
        <a-tabs v-if="resultSummary.planPreviews?.length" type="card" size="small">
          <a-tab-pane
            v-for="plan in resultSummary.planPreviews"
            :key="plan.planId"
            :tab="plan.title"
          >
            <a-row :gutter="[12, 12]">
              <a-col v-for="preview in plan.layouts" :key="preview.id" :span="24">
                <a-card size="small" :title="preview.title">
                  <ContainerPreviewV2 :layout="preview.layout" />
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
        <a-empty v-else description="暂无结构预览" />
      </a-card>
    </template>

    <template #actions>
      <div style="display:flex;justify-content:space-between;width:100%">
        <a-button @click="emit('prev')">返回修改条件</a-button>
        <a-button type="primary" @click="emit('next')">下一步看优化</a-button>
      </div>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { WizardResultSummary } from '@/types/containerWizard';
import ContainerPreviewV2 from '@/components/load-calculator/ContainerPreviewV2.vue';
import MultiPlanComparison from '@/components/load-calculator/MultiPlanComparison.vue';

const props = defineProps<{ resultSummary: WizardResultSummary | null }>();
const emit = defineEmits<{ (e: 'prev'): void; (e: 'next'): void }>();

function readRecommendedField(key: string, fallback = '--'): string {
  const plan = (props.resultSummary?.recommendedPlan || null) as Record<string, unknown> | null;
  const value = plan?.[key];
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return fallback;
}

const recommendedTitle = computed(() => readRecommendedField('title', '待补充'));
const recommendedUtilization = computed(() => readRecommendedField('utilization', '--'));
const recommendedRisk = computed(() => readRecommendedField('riskLevel', '--'));
const recommendedReason = computed(() => readRecommendedField('reason', '--'));

const riskTagColor = computed(() => {
  if (recommendedRisk.value === 'low') return 'green';
  if (recommendedRisk.value === 'high') return 'red';
  if (recommendedRisk.value === 'medium') return 'orange';
  return 'default';
});
</script>
