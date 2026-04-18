<template>
  <div class="me-page">
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
            <a-button type="primary" size="large">联系顾问</a-button>
            <a-button size="large">复制联系方式</a-button>
          </a-space>

          <div class="qrcode-section">
            <h3>扫码添加我</h3>
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <div class="qrcode-card">
                  <img src="/images/wechat-connect.jpg" alt="微信二维码" class="qrcode-image" />
                  <p>微信</p>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="qrcode-card">
                  <img src="/images/qq-connect.jpg" alt="QQ二维码" class="qrcode-image" />
                  <p>QQ</p>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
const profile = {
  name: 'Coxherbert',
  title: '中美线货运顾问',
  phone: '+86 158-2422-3890',
  wechat: 'coxherbert',
  email: 'coxherbert98@gmail.com',
  slogan: '为跨境卖家和外贸工厂提供中美海空运 + 清关 + 派送一站式方案。',
};
</script>

<style scoped>
.me-page {
  max-width: 1380px;
  margin: 0 auto;
}

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

.qrcode-section {
  margin-top: 20px;
}

.qrcode-section h3 {
  margin-bottom: 12px;
}

.qrcode-card {
  text-align: center;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
}

.qrcode-image {
  width: 100%;
  max-width: 180px;
  border-radius: 6px;
}
</style>
