<template>
  <a-layout class="portal-layout">
    <a-layout-header class="portal-header">
      <div class="brand">
        <div class="brand-title">Global Freight Link</div>
        <div class="brand-sub">国际货运代理一站式服务平台</div>
      </div>

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
      </a-menu>

      <a-input-search placeholder="搜索航线 / 服务 / 国家" style="width: 260px" />
    </a-layout-header>

    <a-layout-content class="portal-content">
      <RouterView />
    </a-layout-content>
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
  return 'home'
})
</script>
