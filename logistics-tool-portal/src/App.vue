<template>
  <a-layout class="portal-layout">
    <a-layout-header class="portal-header">
      <div class="title">国际货运代理 · 工具门户</div>
      <a-space>
        <a-menu mode="horizontal" theme="dark" :selected-keys="[activeKey]" class="top-menu">
          <a-menu-item key="home">
            <RouterLink to="/">首页</RouterLink>
          </a-menu-item>
          <a-menu-item key="tools">
            <RouterLink to="/tools">工具中心</RouterLink>
          </a-menu-item>
        </a-menu>
        <a-input-search placeholder="搜索工具/航线/客户" style="width: 280px" />
      </a-space>
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
const activeKey = computed(() => (route.path === '/tools' ? 'tools' : 'home'))
</script>
