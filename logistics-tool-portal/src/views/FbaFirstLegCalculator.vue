<template>
  <a-card title="FBA头程价格计算" :bordered="false">
    <a-result
      status="info"
      title="FBA头程价格计算器"
      sub-title="功能入口已建立，下一步可接入详细参数与实时报价规则。"
    >
      <template #extra>
        <RouterLink to="/me">
          <a-button type="primary">联系顾问获取建议</a-button>
        </RouterLink>
      </template>
    </a-result>
  </a-card>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
