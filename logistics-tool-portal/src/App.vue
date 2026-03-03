<template>
  <a-layout class="portal-layout">
    <!-- Header -->
    <a-layout-header class="portal-header">
      <div class="header-inner">
        <!-- 左侧：品牌 + 菜单 -->
        <div class="header-main">
          <!-- Brand -->
          <div class="brand">
            <img class="brand-logo" src="/images/logo.png" alt="logo" />
            <div class="brand-text">
              <div class="brand-title">中美线国际货运代理</div>
              <div class="brand-sub">China-US Freight Forwarding Portal</div>
            </div>
          </div>

          <!-- Menu -->
          <a-menu mode="horizontal" theme="dark" :selected-keys="[activeKey]" class="top-menu">
            <a-menu-item key="home">
              <RouterLink to="/">首页</RouterLink>
            </a-menu-item>

            <a-menu-item key="tool-center">
              <RouterLink to="/tool-center">工具中心</RouterLink>
            </a-menu-item>

            <a-menu-item key="me">
              <RouterLink to="/me">我的名片</RouterLink>
            </a-menu-item>

            <a-menu-item key="get-plan">
              <RouterLink to="/get-plan">获取方案</RouterLink>
            </a-menu-item>
          </a-menu>
        </div>

        <div class="romance-widget" @click="cycleLoveLine" role="button" tabindex="0" @keyup.enter="cycleLoveLine">
          <div class="romance-header">
            <span class="heart-dot" :class="{ pulse: sparkle }">❤</span>
            <span class="romance-title">今日浪漫值</span>
            <span class="romance-score">{{ romanceScore }}%</span>
          </div>
          <div class="romance-line">{{ activeLoveLine }}</div>
          <div class="romance-tip">点击切换一句小情话 ✨</div>
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
import { computed, ref } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'

const route = useRoute()

const activeKey = computed(() => {
  if (route.path.startsWith('/tool-center')) return 'tool-center'
  if (route.path.startsWith('/me')) return 'me'
  if (route.path.startsWith('/get-plan')) return 'get-plan'
  return 'home'
})

const loveLines = [
  '你看页面，我看你，都是今天最顺利的航线。',
  '再复杂的运输节点，也比不上一句“我想你”。',
  '这页是给客户看的，也是专门给你偏爱的。',
  '愿每次 ETA 都像见你一样：准时、期待、心动。'
]
const currentLineIndex = ref(0)
const sparkle = ref(false)

const activeLoveLine = computed(() => loveLines[currentLineIndex.value])
const romanceScore = computed(() => 92 + currentLineIndex.value * 2)

const cycleLoveLine = () => {
  currentLineIndex.value = (currentLineIndex.value + 1) % loveLines.length
  sparkle.value = false
  requestAnimationFrame(() => {
    sparkle.value = true
    setTimeout(() => {
      sparkle.value = false
    }, 350)
  })
}
</script>
