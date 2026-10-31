<template>
  <div class="page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">IP 库管理</h1>
        <div class="page-subtitle">查看、编辑、管理所有 Cloudflare IP</div>
      </div>
      <div class="header-actions">
        <span class="refresh-label">刷新间隔</span>
        <el-input-number v-model="seconds" :min="1" :max="60" :step="1" size="default" @change="check" class="seconds-input"/>
        <el-checkbox v-model="autoRefresh" class="auto-refresh-cb">自动刷新</el-checkbox>
      </div>
    </div>

    <!-- 查询工具栏 -->
    <div class="toolbar">
      <div class="filter-item">
        <el-input v-model="queryData.ip" placeholder="IP 地址" style="width: 160px" @keyup.enter="search" clearable>
          <template #prefix>IP</template>
        </el-input>
      </div>
      <div class="filter-item">
        <el-input v-model="queryData.countryNameCN" placeholder="国家名字" style="width: 150px" @keyup.enter="search" clearable>
          <template #prefix>国家</template>
        </el-input>
      </div>
      <div class="filter-item">
        <el-input v-model="queryData.countryCode" placeholder="国家代码" style="width: 130px" @keyup.enter="search" clearable>
          <template #prefix>代码</template>
        </el-input>
      </div>
      <div class="filter-item">
        <el-select v-model="queryData.status" style="width: 110px" @change="search" clearable placeholder="状态">
          <el-option label="全部" value=""/>
          <el-option label="启用" value="1"/>
          <el-option label="禁用" value="0"/>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="queryData.reachable" style="width: 110px" @change="search" clearable placeholder="可达">
          <el-option label="全部" value=""/>
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </div>
      <div class="filter-item">
        <el-input type="number" v-model="queryData.delay1" placeholder="延迟 ≥" style="width: 120px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-input type="number" v-model="queryData.delay2" placeholder="延迟 ≤" style="width: 120px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-input type="number" v-model="queryData.speed1" placeholder="速度 ≥" style="width: 120px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-input type="number" v-model="queryData.speed2" placeholder="速度 ≤" style="width: 120px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-input v-model="queryData.name" placeholder="名字" style="width: 140px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-input v-model="queryData.group" placeholder="分组" style="width: 120px" @keyup.enter="search" clearable/>
      </div>
      <div class="filter-item">
        <el-checkbox v-model="queryData.countryCodeIsNull" @change="search">国家代码为空</el-checkbox>
      </div>
      <div class="toolbar-buttons">
        <el-button type="primary" @click="search">
          <span style="margin-right: 4px">🔍</span>查询
        </el-button>
        <el-button @click="reset">
          <span style="margin-right: 4px">🔄</span>重置
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrap">
      <el-table :data="bestIpList" style="width: 100%" v-loading="loading" stripe>
        <el-table-column type="index" width="55"/>
        <el-table-column prop="ip" label="IP" width="150">
          <template #default="{ row }">
            <span class="mono">{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="countryNameCN" label="国家"/>
        <el-table-column prop="countryCode" label="国家代码" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.countryCode" size="small">{{ row.countryCode }}</el-tag>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="cityNameCN" label="城市(中)"/>
        <el-table-column prop="cityNameEN" label="城市(英)"/>
        <el-table-column prop="group" label="分组" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.group" size="small" type="info">{{ row.group }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="delay" label="延迟(ms)" width="100" align="right"/>
        <el-table-column prop="speed" label="速度(MB/s)" width="110" align="right"/>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="Number(row.status) === 1 ? 'success' : 'danger'" size="small">
              {{ Number(row.status) === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名字" width="140"/>
        <el-table-column prop="updatedTime" width="160" label="更新时间">
          <template #default="{ row }">
            <span class="text-muted">{{ row.updatedTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pager-wrap">
      <vxe-pager
          v-model:currentPage="pageVO.pageIndex"
          v-model:pageSize="pageVO.pageSize"
          :total="pageVO.total"
          @page-change="getIpList">
      </vxe-pager>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" :title="'编辑 IP - ' + editForm.ip" width="640px" class="edit-dialog">
    <el-alert title="提示" type="warning" description="该分组下所有IP将被重新提交，请谨慎操作，所有字段均可编辑。" :closable="false" style="margin-bottom:16px" />
    <el-form :model="editForm" label-width="100px">
      <el-form-item label="IP地址">
        <el-input v-model="editForm.ip" />
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="分组">
        <el-input v-model="editForm.group" disabled />
      </el-form-item>
      <el-form-item label="区域">
        <el-input v-model="editForm.area" />
      </el-form-item>
      <el-form-item label="城市(中文)">
        <el-input v-model="editForm.cityNameCN" />
      </el-form-item>
      <el-form-item label="城市(英文)">
        <el-input v-model="editForm.cityNameEN" />
      </el-form-item>
      <el-form-item label="国家(中文)">
        <el-input v-model="editForm.countryNameCN" />
      </el-form-item>
      <el-form-item label="国家代码">
        <el-input v-model="editForm.countryCode" />
      </el-form-item>
      <el-form-item label="来源">
        <el-input v-model="editForm.source" />
      </el-form-item>
      <el-form-item label="延迟(ms)">
        <el-input v-model.number="editForm.delay" type="number" />
      </el-form-item>
      <el-form-item label="速度(MB/s)">
        <el-input v-model.number="editForm.speed" type="number" />
      </el-form-item>
      <el-form-item label="可达性">
        <el-switch v-model="editForm.reachable" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="editForm.status" active-value="1" inactive-value="0" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="editDelete">删除此IP</el-button>
      <el-button type="primary" :disabled="saving" @click="editIpUpdate">保存编辑的IP</el-button>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import IpInfoApi from "@/api/IpInfoApi";
import { useIpListPage } from "@/composables/useIpListPage";

const {
  pageVO,
  queryData,
  loading,
  bestIpList,
  autoRefresh,
  seconds,
  check,
  search,
  reset,
  getIpList
} = useIpListPage((q: any) => IpInfoApi.page(q))

const editDialogVisible = ref(false)
const saving = ref(false)
const editForm = reactive({
  ip: '',
  name: '',
  group: '',
  area: '',
  cityNameCN: '',
  cityNameEN: '',
  countryNameCN: '',
  countryCode: '',
  source: '',
  delay: null as number | null,
  speed: null as number | null,
  reachable: false,
  status: '1'
})

function onEdit(row: any) {
  editForm.ip = row.ip || ''
  editForm.name = row.name || ''
  editForm.group = row.group || ''
  editForm.area = row.area || ''
  editForm.cityNameCN = row.cityNameCN || ''
  editForm.cityNameEN = row.cityNameEN || ''
  editForm.countryNameCN = row.countryNameCN || ''
  editForm.countryCode = row.countryCode || ''
  editForm.source = row.source || ''
  editForm.delay = row.delay ?? null
  editForm.speed = row.speed ?? null
  editForm.reachable = row.reachable ?? false
  editForm.status = row.status ?? '1'
  editDialogVisible.value = true
}

async function editIpUpdate() {
  saving.value = true
  await IpInfoApi.update(
    {
      name: editForm.name,
      ip: editForm.ip,
      group: editForm.group,
      area: editForm.area,
      cityNameCN: editForm.cityNameCN,
      cityNameEN: editForm.cityNameEN,
      countryNameCN: editForm.countryNameCN,
      countryCode: editForm.countryCode,
      source: editForm.source,
      delay: editForm.delay,
      speed: editForm.speed,
      reachable: editForm.reachable,
      status: editForm.status
    },
    editForm.group,
    0
  )
  ElMessage({ message: '保存成功', type: 'success' })
  editDialogVisible.value = false
  getIpList()
  saving.value = false
}

function editDelete() {
  ElMessageBox.confirm('确认删除该IP吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    IpInfoApi.delete(editForm.ip).then(() => {
      ElMessage({message: '删除成功', type: 'success'});
      editDialogVisible.value = false
      getIpList();
    }).catch(() => {
      ElMessage({message: '删除失败', type: 'error'});
    });
  }).catch(()=>{});
}

function onDelete(row: any) {
  ElMessageBox.confirm('确认删除该IP吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    IpInfoApi.delete(row.ip).then(() => {
      ElMessage({message: '删除成功', type: 'success'});
      getIpList();
    }).catch(() => {
      ElMessage({message: '删除失败', type: 'error'});
    });
  }).catch(()=>{});
}

</script>
<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.refresh-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.seconds-input {
  width: 110px;
}

.auto-refresh-cb {
  font-size: 13px;
  color: var(--text-secondary);
}

.toolbar-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.pager-wrap {
  padding: 16px 0;
  display: flex;
  justify-content: flex-end;
}

.text-muted {
  color: var(--text-placeholder);
  font-size: 12px;
}

.edit-dialog .el-dialog {
  top: 10px !important;
  margin-top: 0 !important;
  max-height: calc(100vh - 20px) !important;
}

.edit-dialog .el-dialog__body {
  max-height: calc(100vh - 20px - 118px) !important;
  overflow-y: auto !important;
}
</style>
