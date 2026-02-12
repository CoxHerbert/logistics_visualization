<template>
  <a-layout class="portal-layout">
    <!-- Header -->
    <a-layout-header class="portal-header">
      <div class="header-inner">
        <!-- 左侧：品牌 + 菜单 -->
        <div class="header-main">
          <!-- Brand -->
          <div class="brand">
            <div class="brand-title">中美线国际货运代理</div>
            <div class="brand-sub">China-US Freight Forwarding Portal</div>
          </div>

          <!-- Menu -->
          <a-menu mode="horizontal" theme="dark" :selected-keys="[activeKey]" class="top-menu">
            <a-menu-item key="home">
              <RouterLink to="/">首页</RouterLink>
            </a-menu-item>

            <a-menu-item key="line-query">
              <RouterLink to="/line-query">航线查询</RouterLink>
            </a-menu-item>

            <a-menu-item key="volume-pricing">
              <RouterLink to="/volume-pricing">体积计价</RouterLink>
            </a-menu-item>

            <a-menu-item key="hs-lookup">
              <RouterLink to="/hs-lookup">HS 查询</RouterLink>
            </a-menu-item>

            <a-menu-item key="me">
              <RouterLink to="/me">我的名片</RouterLink>
            </a-menu-item>

            <a-menu-item key="get-plan">
              <RouterLink to="/get-plan">获取方案</RouterLink>
            </a-menu-item>
          </a-menu>
        </div>

      </div>
    </a-layout-header>

    <!-- Content -->
    <a-layout-content class="portal-content">
      <RouterView />
    </a-layout-content>

    <!-- 悬浮 CTA -->
    <div class="floating-cta">
      <RouterLink to="/get-plan?remark=来源入口：全站悬浮CTA">
        <a-button type="primary" size="large">
          获取运输方案
        </a-button>
      </RouterLink>
    </div>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'

const route = useRoute()

const activeKey = computed(() => {
  if (route.path.startsWith('/line-query')) return 'line-query'
  if (route.path.startsWith('/volume-pricing')) return 'volume-pricing'
  if (route.path.startsWith('/hs-lookup')) return 'hs-lookup'
  if (route.path.startsWith('/me')) return 'me'
  if (route.path.startsWith('/get-plan')) return 'get-plan'
  return 'home'
})
</script>
