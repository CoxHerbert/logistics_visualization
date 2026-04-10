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
            <a-menu-item key="get-plan">
              <RouterLink to="/get-plan">{{ copy.navGetPlan }}</RouterLink>
            </a-menu-item>
          </a-menu>

          <div class="header-cta">
            <RouterLink to="/get-plan?remark=来源入口：首页顶部CTA">
              <a-button type="primary">{{ copy.headerAction }}</a-button>
            </RouterLink>
          </div>
        </div>
      </div>
    </a-layout-header>

    <a-layout-content class="portal-content">
      <RouterView />
    </a-layout-content>

    <div class="floating-cta">
      <RouterLink to="/get-plan?remark=来源入口：全站悬浮CTA">
        <a-button type="primary" size="large">{{ copy.floatingAction }}</a-button>
      </RouterLink>
    </div>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute();

const copy = {
  brandSub: 'China-US Freight Forwarding Portal',
  brandTitle: '中美专线国际货运门户',
  floatingAction: '获取运输方案',
  headerAction: '立即询价',
  navGetPlan: '获取方案',
  navHome: '首页',
  navMe: '我的名片',
  navToolCenter: '工具中心',
};

const activeKey = computed(() => {
  if (route.path.startsWith('/tool-center')) return 'tool-center';
  if (route.path.startsWith('/me')) return 'me';
  if (route.path.startsWith('/get-plan')) return 'get-plan';
  return 'home';
});
</script>
