<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">IP 更新</h1>
        <div class="page-subtitle">批量更新 Cloudflare 优选 IP</div>
      </div>
    </div>

    <div class="card update-card">
      <div class="update-form">
        <div class="form-row">
          <label>分组</label>
          <el-input v-model="group" placeholder="默认 CF" style="width: 200px"/>
        </div>
        <div class="form-row">
          <label>删除原有分组</label>
          <el-switch
              v-model="deleteOld"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
          />
        </div>
      </div>

      <div class="textarea-wrap">
        <label class="textarea-label">优选 IP 列表（每行一条,格式：ip\tname\tgroup\t...）</label>
        <vxe-textarea v-model="bestIps" placeholder="在此粘贴优选 IP 数据" :autosize="{ minRows: 12, maxRows: 24 }"
                      class="best-ips-textarea"/>
      </div>

      <div class="submit-row">
        <el-button type="primary" size="large" :loading="updating" @click="submit">
          <span style="margin-right: 6px">📤</span>提交更新
        </el-button>
      </div>
    </div>

    <div class="card mt-lg">
      <el-tabs v-model="activeName">
        <el-tab-pane label="📊 表数据" name="first">
          <el-table :data="bestIpList" style="width: 100%" stripe>
            <el-table-column type="index" width="55"/>
            <el-table-column prop="ip" label="IP" width="160">
              <template #default="{ row }">
                <span class="mono">{{ row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名字" width="160"/>
            <el-table-column prop="group" label="分组" width="90">
              <template #default="{ row }">
                <el-tag v-if="row.group" size="small" type="info">{{ row.group }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="area" label="区域"/>
            <el-table-column prop="source" label="来源" width="80"/>
            <el-table-column prop="speed" label="速度(MB/s)" width="110" align="right"/>
            <el-table-column prop="delay" label="延迟(ms)" width="100" align="right"/>
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="Number(row.status) === 1 ? 'success' : 'danger'" size="small">
                  {{ Number(row.status) === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="更新时间" width="170"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="📝 订阅数据" name="second">
          <pre class="subscription-data">{{ bestIpValue }}</pre>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import IpInfoApi from "@/api/IpInfoApi";
import {ElLoading} from "element-plus";

const activeName = ref('first')
const updating = ref(false)
const bestIps = ref('')
const group = ref('')
const deleteOld = ref('0')
const bestIpList = ref([])
const bestIpValue = ref([])

function submit() {
  updating.value = true;
  let loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  IpInfoApi.update({'bestIps': bestIps.value}, group.value, deleteOld.value).then(res => {
    updating.value = false;
    loading.close();
    init();
  })
}

function getIpList() {
  IpInfoApi.list({}).then(res => {
    bestIpList.value = res.data
  })
}

function getBestIp() {
  IpInfoApi.getBestIp().then(res => {
    bestIpValue.value = res.data
  })
}

function init() {
  getIpList();
  getBestIp();
}

init();
</script>

<style scoped>
.update-card {
  padding: var(--space-lg);
}

.update-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-row label {
  font-size: 14px;
  color: var(--text-regular);
  font-weight: 500;
}

.textarea-wrap {
  margin-bottom: var(--space-md);
}

.textarea-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.best-ips-textarea {
  width: 100%;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.submit-row {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
}

.subscription-data {
  background: #1f2329;
  color: #e6e8eb;
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
  overflow: auto;
  max-height: 480px;
  white-space: pre-wrap;
}
</style>
