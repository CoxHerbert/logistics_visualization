<template>
  <a-layout class="portal-layout">
    <a-layout-header class="portal-header">
      <div class="header-inner">
        <div class="header-shell">
          <RouterLink to="/" class="brand">
            <img class="brand-logo" src="/images/logo.png" alt="logo" />
            <div class="brand-text">
              <div class="brand-title">{{ copy.brandTitle }}</div>
              <div class="brand-sub">{{ copy.brandSub }}</div>
            </div>
          </RouterLink>

          <a-menu mode="horizontal" :selected-keys="[activeKey]" class="top-menu">
            <a-menu-item key="home">
              <RouterLink to="/">{{ copy.navHome }}</RouterLink>
            </a-menu-item>
            <a-menu-item key="tool-center">
              <RouterLink to="/tool-center">{{ copy.navToolCenter }}</RouterLink>
            </a-menu-item>
            <a-menu-item key="me">
              <RouterLink to="/me">{{ copy.navMe }}</RouterLink>
            </a-menu-item>
          </a-menu>

          <div class="header-cta">
            <a-button @click="goToAdmin">{{ copy.adminAction }}</a-button>
          </div>
        </div>
      </div>
    </a-layout-header>

    <a-layout-content class="portal-content">
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute();

const copy = {
  adminAction: '进入后台管理',
  brandSub: 'China-US Freight Forwarding Portal',
  brandTitle: '中美货运转运平台',
  navHome: '首页',
  navMe: '个人中心',
  navToolCenter: '工具中心',
};

const adminUrl = import.meta.env.VITE_ADMIN_URL || '/';
const goToAdmin = () => {
  window.open(adminUrl, '_blank', 'noopener,noreferrer');
};

const activeKey = computed(() => {
  if (route.path.startsWith('/tool-center')) return 'tool-center';
  if (route.path.startsWith('/me')) return 'me';
  return 'home';
});
</script>
