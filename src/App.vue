<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeMenu = ref('/')

const menuItems = [
  { path: '/', title: 'Dashboard' },
  { path: '/ip/list', title: 'IP 库' },
  { path: '/ip/update', title: 'IP 更新' },
  { path: '/favorite/list', title: '收藏 IP' },
  { path: '/favorite/update', title: '收藏更新' },
  { path: '/about', title: '关于' }
]

function handleSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <div class="app-container">
    <el-menu
      :default-active="route.path"
      mode="horizontal"
      :ellipsis="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      @select="handleSelect"
    >
      <div class="menu-logo">CF Data</div>
      <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
        {{ item.title }}
      </el-menu-item>
      <div class="menu-spacer"></div>
      <el-menu-item index="/about" style="margin-left: auto">About</el-menu-item>
    </el-menu>
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

:deep(.el-menu) {
  height: 56px;
  line-height: 56px;
  border-bottom: none;
}

.menu-logo {
  color: #409EFF;
  font-size: 18px;
  font-weight: bold;
  padding: 0 20px;
  letter-spacing: 2px;
}

.menu-spacer {
  flex: 1;
}

.app-content {
  background: #f0f2f5;
  min-height: calc(100vh - 56px);
}
</style>
