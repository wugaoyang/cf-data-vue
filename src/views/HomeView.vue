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
  { path: '/ip/list', title: 'IP 库管理', desc: '查看和管理 IP 列表', icon: '📋', color: '#409EFF' },
  { path: '/ip/update', title: 'IP 更新', desc: '批量更新优选 IP', icon: '✏️', color: '#67C23A' },
  { path: '/favorite/list', title: '收藏 IP 库', desc: '查看和管理收藏的 IP', icon: '⭐', color: '#E6A23C' },
  { path: '/favorite/update', title: '收藏 IP 更新', desc: '批量更新收藏优选 IP', icon: '✏️', color: '#F56C6C' }
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
  <div class="home">
    <div class="header">
      <h1>CF Data Management</h1>
      <p>Cloudflare IP Database Management</p>
    </div>

    <div class="auto-refresh">
      <el-checkbox v-model="autoRefresh" @change="startAutoRefresh">
        自动刷新 ({{ refreshInterval }}s)
      </el-checkbox>
    </div>

    <div class="cards">
      <div class="card" v-for="item in navItems" :key="item.path" @click="router.push(item.path)">
        <div class="card-icon" :style="{ backgroundColor: item.color + '20', color: item.color }">
          {{ item.icon }}
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <div class="card-arrow">&#8594;</div>
      </div>
    </div>

    <div class="section-title">Best IP Status</div>
    <div class="ip-cards">
      <div class="status-card">
        <h3>Default IP</h3>
        <div v-if="loading" class="loading">Loading...</div>
        <template v-else-if="bestIp">
          <div class="ip-info">
            <div class="ip-address">{{ bestIp.ip }}</div>
            <div class="ip-detail">
              <span>{{ bestIp.name || '-' }}</span>
              <span>{{ bestIp.group || '-' }}</span>
              <span>{{ bestIp.cityNameCN || '-' }}</span>
            </div>
            <div class="ip-metrics">
              <div class="metric">
                <span class="label">Delay</span>
                <span class="value">{{ bestIp.delay != null ? bestIp.delay + 'ms' : '-' }}</span>
              </div>
              <div class="metric">
                <span class="label">Speed</span>
                <span class="value">{{ bestIp.speed != null ? bestIp.speed + ' MB/s' : '-' }}</span>
              </div>
              <div class="metric">
                <span class="label">Reach</span>
                <span class="value" :class="bestIp.reachable ? 'success' : 'danger'">
                  {{ bestIp.reachable != null ? (bestIp.reachable ? 'Yes' : 'No') : '-' }}
                </span>
              </div>
            </div>
            <div class="ip-time">{{ bestIp.updatedTime || '-' }}</div>
          </div>
        </template>
        <div v-else class="error">No data available</div>
      </div>

      <div class="status-card">
        <h3>Favorite IP</h3>
        <div v-if="loading" class="loading">Loading...</div>
        <template v-else-if="bestFavoriteIp">
          <div class="ip-info">
            <div class="ip-address">{{ bestFavoriteIp.ip }}</div>
            <div class="ip-detail">
              <span>{{ bestFavoriteIp.name || '-' }}</span>
              <span>{{ bestFavoriteIp.group || '-' }}</span>
              <span>{{ bestFavoriteIp.cityNameCN || '-' }}</span>
            </div>
            <div class="ip-metrics">
              <div class="metric">
                <span class="label">Delay</span>
                <span class="value">{{ bestFavoriteIp.delay != null ? bestFavoriteIp.delay + 'ms' : '-' }}</span>
              </div>
              <div class="metric">
                <span class="label">Speed</span>
                <span class="value">{{ bestFavoriteIp.speed != null ? bestFavoriteIp.speed + ' MB/s' : '-' }}</span>
              </div>
              <div class="metric">
                <span class="label">Reach</span>
                <span class="value" :class="bestFavoriteIp.reachable ? 'success' : 'danger'">
                  {{ bestFavoriteIp.reachable != null ? (bestFavoriteIp.reachable ? 'Yes' : 'No') : '-' }}
                </span>
              </div>
            </div>
            <div class="ip-time">{{ bestFavoriteIp.updatedTime || '-' }}</div>
          </div>
        </template>
        <div v-else class="error">No data available</div>
      </div>
    </div>

    <div class="section-title">IP Statistics</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Default Library</div>
        <div class="stat-value">{{ ipStats.total }}</div>
        <div class="stat-desc">Total / Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active</div>
        <div class="stat-value" style="color: #67C23A">{{ ipStats.active }}</div>
        <div class="stat-desc">of {{ ipStats.total }} IPs</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Favorite Library</div>
        <div class="stat-value">{{ favoriteStats.total }}</div>
        <div class="stat-desc">Total / Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active</div>
        <div class="stat-value" style="color: #67C23A">{{ favoriteStats.active }}</div>
        <div class="stat-desc">of {{ favoriteStats.total }} IPs</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 8px;
}

.header p {
  color: #909399;
  font-size: 14px;
}

.auto-refresh {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s;
}

.card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #303133;
}

.card-content p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.card-arrow {
  font-size: 20px;
  color: #c0c4cc;
  margin-left: 12px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.ip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.status-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  padding: 20px;
}

.status-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #606266;
}

.loading, .error {
  color: #909399;
  text-align: center;
  padding: 20px;
}

.error {
  color: #f56c6c;
}

.ip-info {
  text-align: center;
}

.ip-address {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.ip-detail {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  font-size: 13px;
  color: #606266;
}

.ip-metrics {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.metric .value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.metric .value.success {
  color: #67c23a;
}

.metric .value.danger {
  color: #f56c6c;
}

.ip-time {
  font-size: 12px;
  color: #c0c4cc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  padding: 20px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
