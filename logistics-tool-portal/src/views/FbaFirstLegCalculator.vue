<template>
  <a-card title="FBA头程价格计算" :bordered="false">
    <a-result
      status="info"
      title="FBA头程价格计算器"
      sub-title="功能已创建入口，下一步可接入详细参数与实时报价规则。"
    >
      <template #extra>
        <RouterLink to="/get-plan?remark=来源入口：FBA头程价格计算器">
          <a-button type="primary">先提交需求获取方案</a-button>
        </RouterLink>
      </template>
    </a-result>
  </a-card>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
