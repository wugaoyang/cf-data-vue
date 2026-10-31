<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import IpInfoApi from '@/api/IpInfoApi'
import CfIpFavoriteApi from '@/api/CfIpFavoriteApi'
import { useRouter } from 'vue-router'

const router = useRouter()

const bestIp = ref<any>(null)
const bestFavoriteIp = ref<any>(null)
const ipStats = ref<{ total: number; active: number }>({ total: 0, active: 0 })
const favoriteStats = ref<{ total: number; active: number }>({ total: 0, active: 0 })
const loading = ref(true)
const refreshInterval = 30
const refreshTimer = ref<number | null>(null)
const autoRefresh = ref(false)

const navItems = [
  { path: '/ip/list', title: 'IP 库管理', desc: '查看和管理 IP 列表', icon: '📋', color: '#409eff' },
  { path: '/ip/update', title: 'IP 更新', desc: '批量更新优选 IP', icon: '✏️', color: '#67c23a' },
  { path: '/favorite/list', title: '收藏 IP 库', desc: '查看和管理收藏的 IP', icon: '⭐', color: '#e6a23c' },
  { path: '/favorite/update', title: '收藏 IP 更新', desc: '批量更新收藏优选 IP', icon: '🔖', color: '#f56c6c' }
]

async function fetchBestIp() {
  try {
    const res = await IpInfoApi.getBestIp()
    if (res.data?.code === 200) {
      bestIp.value = res.data.data
    }
  } catch (e) {
    console.error('Failed to fetch best IP:', e)
  }
}

async function fetchBestFavoriteIp() {
  try {
    const res = await CfIpFavoriteApi.getBestIp()
    if (res.data?.code === 200) {
      bestFavoriteIp.value = res.data.data
    }
  } catch (e) {
    console.error('Failed to fetch favorite best IP:', e)
  }
}

async function fetchStats() {
  try {
    const ipRes = await IpInfoApi.list({})
    if (ipRes.data?.code === 200) {
      const items = ipRes.data.data || []
      ipStats.value.total = items.length
      ipStats.value.active = items.filter((item: any) => item.status === '1').length
    }
    const favRes = await CfIpFavoriteApi.list({})
    if (favRes.data?.code === 200) {
      const items = favRes.data.data || []
      favoriteStats.value.total = items.length
      favoriteStats.value.active = items.filter((item: any) => item.status === '1').length
    }
    loading.value = false
  } catch (e) {
    console.error('Failed to fetch stats:', e)
    loading.value = false
  }
}

function startAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
  if (autoRefresh.value) {
    refreshTimer.value = window.setInterval(() => {
      fetchBestIp()
      fetchBestFavoriteIp()
    }, refreshInterval * 1000)
  }
}

onMounted(() => {
  fetchBestIp()
  fetchBestFavoriteIp()
  fetchStats()
})

onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
})
</script>

<template>
  <div class="page home">
    <!-- 欢迎横幅 -->
    <div class="hero">
      <div class="hero-text">
        <h1 class="hero-title">CF Data Management</h1>
        <p class="hero-desc">Cloudflare IP 数据库管理面板 — 优选、收藏、统计一站式完成</p>
      </div>
      <div class="hero-actions">
        <el-checkbox v-model="autoRefresh" @change="startAutoRefresh">
          自动刷新 ({{ refreshInterval }}s)
        </el-checkbox>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="cards">
      <div class="card nav-card" v-for="item in navItems" :key="item.path" @click="router.push(item.path)">
        <div class="card-icon" :style="{ backgroundColor: item.color + '1f', color: item.color }">
          {{ item.icon }}
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <div class="card-arrow">→</div>
      </div>
    </div>

    <!-- 最佳 IP 状态 -->
    <div class="section">
      <h2 class="section-title">最佳 IP 状态</h2>
      <div class="ip-cards">
        <div class="status-card">
          <div class="status-card-header">
            <h3>默认 IP</h3>
            <el-tag v-if="bestIp" type="success" size="small">
              <span style="margin-left: 4px">●</span> 在线
            </el-tag>
          </div>
          <div v-if="loading" class="empty-state">加载中...</div>
          <template v-else-if="bestIp">
            <div class="ip-info">
              <div class="ip-address mono">{{ bestIp.ip }}</div>
              <div class="ip-detail">
                <span class="ip-tag">{{ bestIp.name || '-' }}</span>
                <span class="ip-tag" v-if="bestIp.group">{{ bestIp.group }}</span>
                <span class="ip-tag" v-if="bestIp.cityNameCN">{{ bestIp.cityNameCN }}</span>
              </div>
              <div class="ip-metrics">
                <div class="metric">
                  <span class="label">延迟</span>
                  <span class="value">{{ bestIp.delay != null ? bestIp.delay + 'ms' : '-' }}</span>
                </div>
                <div class="metric">
                  <span class="label">速度</span>
                  <span class="value">{{ bestIp.speed != null ? bestIp.speed + ' MB/s' : '-' }}</span>
                </div>
                <div class="metric">
                  <span class="label">可达</span>
                  <span class="value" :class="bestIp.reachable ? 'success' : 'danger'">
                    {{ bestIp.reachable != null ? (bestIp.reachable ? '是' : '否') : '-' }}
                  </span>
                </div>
              </div>
              <div class="ip-time">更新于 {{ bestIp.updatedTime || '-' }}</div>
            </div>
          </template>
          <div v-else class="empty-state">暂无数据</div>
        </div>

        <div class="status-card">
          <div class="status-card-header">
            <h3>收藏 IP</h3>
            <el-tag v-if="bestFavoriteIp" type="success" size="small">
              <span style="margin-left: 4px">●</span> 在线
            </el-tag>
          </div>
          <div v-if="loading" class="empty-state">加载中...</div>
          <template v-else-if="bestFavoriteIp">
            <div class="ip-info">
              <div class="ip-address mono">{{ bestFavoriteIp.ip }}</div>
              <div class="ip-detail">
                <span class="ip-tag">{{ bestFavoriteIp.name || '-' }}</span>
                <span class="ip-tag" v-if="bestFavoriteIp.group">{{ bestFavoriteIp.group }}</span>
                <span class="ip-tag" v-if="bestFavoriteIp.cityNameCN">{{ bestFavoriteIp.cityNameCN }}</span>
              </div>
              <div class="ip-metrics">
                <div class="metric">
                  <span class="label">延迟</span>
                  <span class="value">{{ bestFavoriteIp.delay != null ? bestFavoriteIp.delay + 'ms' : '-' }}</span>
                </div>
                <div class="metric">
                  <span class="label">速度</span>
                  <span class="value">{{ bestFavoriteIp.speed != null ? bestFavoriteIp.speed + ' MB/s' : '-' }}</span>
                </div>
                <div class="metric">
                  <span class="label">可达</span>
                  <span class="value" :class="bestFavoriteIp.reachable ? 'success' : 'danger'">
                    {{ bestFavoriteIp.reachable != null ? (bestFavoriteIp.reachable ? '是' : '否') : '-' }}
                  </span>
                </div>
              </div>
              <div class="ip-time">更新于 {{ bestFavoriteIp.updatedTime || '-' }}</div>
            </div>
          </template>
          <div v-else class="empty-state">暂无数据</div>
        </div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="section">
      <h2 class="section-title">IP 统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">默认 IP 库</div>
          <div class="stat-value">{{ ipStats.total }}</div>
          <div class="stat-desc">总 IP 数</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">启用中</div>
          <div class="stat-value stat-success">{{ ipStats.active }}</div>
          <div class="stat-desc">占 {{ ipStats.total }} 个</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">收藏 IP 库</div>
          <div class="stat-value">{{ favoriteStats.total }}</div>
          <div class="stat-desc">总 IP 数</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">启用中</div>
          <div class="stat-value stat-success">{{ favoriteStats.active }}</div>
          <div class="stat-desc">占 {{ favoriteStats.total }} 个</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #409eff 0%, #3a8ee6 50%, #337ecc 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
  box-shadow: var(--shadow-md);
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.hero-desc {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.hero-actions :deep(.el-checkbox) {
  color: #fff;
}

.hero-actions :deep(.el-checkbox__label) {
  color: #fff;
  font-size: 14px;
}

.hero-actions :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #fff;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.nav-card {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-right: var(--space-md);
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--text-regular);
  font-weight: 600;
}

.card-content p {
  margin: 0;
  font-size: 13px;
  color: var(--text-placeholder);
}

.card-arrow {
  font-size: 22px;
  color: var(--text-placeholder);
  margin-left: var(--space-sm);
  transition: transform 0.25s ease;
}

.nav-card:hover .card-arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

.section {
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-regular);
  margin: 0 0 var(--space-md) 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 2px;
}

.ip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: var(--space-md);
}

.status-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.status-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
}

.status-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-regular);
}

.ip-info {
  text-align: center;
}

.ip-address {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.ip-detail {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}

.ip-tag {
  background: #f5f7fa;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
}

.ip-metrics {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-sm);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .label {
  font-size: 12px;
  color: var(--text-placeholder);
  margin-bottom: 4px;
}

.metric .value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-regular);
}

.metric .value.success {
  color: var(--color-success);
}

.metric .value.danger {
  color: var(--color-danger);
}

.ip-time {
  font-size: 12px;
  color: var(--text-placeholder);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
}

.stat-success {
  color: var(--color-success) !important;
}
</style>
