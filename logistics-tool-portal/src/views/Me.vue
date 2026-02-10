<script setup lang="ts">
import { RouterLink } from 'vue-router'

const profile = {
  name: 'Ava Chen',
  title: '中美线货运顾问',
  phone: '+86 138-0000-8888',
  wechat: 'Ava-USCN-Logistics',
  email: 'ava.chen@example.com',
  slogan: '为跨境卖家和外贸工厂提供中美海空运 + 清关 + 派送一站式方案。'
}
</script>

<template>
  <a-card title="我的名片" class="me-card">
    <a-row :gutter="20" align="middle">
      <a-col :xs="24" :md="8" class="center-col">
        <img src="/images/hero-freight.svg" alt="顾问头像" class="avatar-image" />
      </a-col>
      <a-col :xs="24" :md="16">
        <h2 class="name">{{ profile.name }}</h2>
        <p class="title">{{ profile.title }}</p>
        <a-typography-paragraph>{{ profile.slogan }}</a-typography-paragraph>

        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="电话">{{ profile.phone }}</a-descriptions-item>
          <a-descriptions-item label="微信">{{ profile.wechat }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ profile.email }}</a-descriptions-item>
        </a-descriptions>

        <a-space style="margin-top: 16px">
          <RouterLink to="/get-plan?origin=上海&destination=洛杉矶&shipMode=20&cargoType=10&remark=来源入口：/me 名片页">
            <a-button type="primary" size="large">立即获取运输方案</a-button>
          </RouterLink>
          <a-button size="large">复制联系方式</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped>
.me-card {
  margin-top: 8px;
}

.center-col {
  text-align: center;
}

.avatar-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e6f4ff;
}

.name {
  margin-bottom: 0;
}

.title {
  margin-top: 4px;
  color: #4f5d73;
}
</style>
