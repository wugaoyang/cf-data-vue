<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { path: '/', title: 'Dashboard', icon: '📊' },
  { path: '/ip/list', title: 'IP 库', icon: '📋' },
  { path: '/ip/update', title: 'IP 更新', icon: '✏️' },
  { path: '/favorite/list', title: '收藏 IP', icon: '⭐' },
  { path: '/favorite/update', title: '收藏更新', icon: '🔖' },
]

function handleSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand" @click="router.push('/')">
          <span class="brand-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <span class="brand-name">CF Data</span>
        </div>

        <el-menu
          :default-active="route.path"
          mode="horizontal"
          :ellipsis="false"
          class="nav-menu"
          @select="handleSelect"
        >
          <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
            <span class="menu-icon">{{ item.icon }}</span>
            {{ item.title }}
          </el-menu-item>
          <el-menu-item index="/about">
            <span class="menu-icon">ℹ️</span>
            关于
          </el-menu-item>
        </el-menu>
      </div>
    </header>

    <div class="app-content">
      <RouterView />
    </div>

    <footer class="app-footer">
      CF Data · Cloudflare IP Database Management
    </footer>
  </div>
</template>

<style>
/* 全局通知样式(居中,隐藏关闭按钮) */
.el-notification {
  overflow: hidden !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  top: 70px !important;
}

.el-notification__content {
  overflow: hidden !important;
}

.el-notification__closeBtn {
  display: none !important;
}

.el-notification__wrapper {
  overflow: hidden !important;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

/* ===== 顶部 Header ===== */
.app-header {
  background: linear-gradient(135deg, #2b3a4f 0%, #304156 50%, #2c3e50 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 var(--space-lg);
  max-width: 1440px;
  margin: 0 auto;
  gap: var(--space-lg);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-icon {
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

/* ===== 导航菜单 ===== */
.nav-menu {
  flex: 1;
  background: transparent !important;
  border-bottom: none !important;
}

.nav-menu .el-menu-item {
  color: #bfcbd9 !important;
  font-size: 14px;
  transition: color 0.25s ease;
  position: relative;
}

.nav-menu .el-menu-item:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-radius: 8px;
}

.nav-menu .el-menu-item.is-active {
  color: #409eff !important;
  background: rgba(64, 158, 255, 0.15) !important;
}

.nav-menu .el-menu-item::after {
  display: none !important;
}

.menu-icon {
  margin-right: 6px;
}

/* ===== 内容区 ===== */
.app-content {
  flex: 1;
  background: var(--bg-page);
}

/* ===== 页脚 ===== */
.app-footer {
  text-align: center;
  padding: var(--space-md);
  color: var(--text-placeholder);
  font-size: 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}
</style>
