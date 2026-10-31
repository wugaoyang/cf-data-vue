<template>
  <div class="page">
    <div class="about-card card">
      <div class="about-header">
        <div class="about-logo">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div>
          <h1 class="about-title">CF Data</h1>
          <p class="about-subtitle">Cloudflare IP Database Management</p>
        </div>
      </div>

      <el-divider/>

      <div class="about-content">
        <div class="about-item">
          <span class="about-item-icon">📋</span>
          <div>
            <h3>IP 库管理</h3>
            <p>查看、编辑、删除 Cloudflare IP,支持多维度筛选(国家、延迟、速度、状态等)。</p>
          </div>
        </div>
        <div class="about-item">
          <span class="about-item-icon">✏️</span>
          <div>
            <h3>批量更新</h3>
            <p>粘贴优选 IP 列表,一键批量更新到数据库,支持分组管理和旧数据清理。</p>
          </div>
        </div>
        <div class="about-item">
          <span class="about-item-icon">⭐</span>
          <div>
            <h3>收藏管理</h3>
            <p>独立维护收藏 IP 库,与默认库隔离,方便管理常用优选 IP。</p>
          </div>
        </div>
        <div class="about-item">
          <span class="about-item-icon">📊</span>
          <div>
            <h3>实时统计</h3>
            <p>Dashboard 实时展示各库 IP 数量、启用状态和最佳 IP 信息,支持自动刷新。</p>
          </div>
        </div>
      </div>

      <el-divider/>

      <div class="about-footer">
        <span>技术栈:Vue 3 · Vite · Element Plus · vxe-table · Cloudflare Workers · D1</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-card {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-xl);
}

.about-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.about-logo {
  color: var(--color-primary);
  display: flex;
  align-items: center;
}

.about-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.about-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--text-placeholder);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.about-item {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
}

.about-item-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.about-item h3 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-regular);
}

.about-item p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.about-footer {
  text-align: center;
  font-size: 13px;
  color: var(--text-placeholder);
}

@media (max-width: 640px) {
  .about-content {
    grid-template-columns: 1fr;
  }
}
</style>
