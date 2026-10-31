<template>
  <div class="page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">收藏 IP 库</h1>
        <div class="page-subtitle">查看和管理收藏的 Cloudflare IP</div>
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
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
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
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import CfIpFavoriteApi from "@/api/CfIpFavoriteApi";
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
} = useIpListPage((q: any) => CfIpFavoriteApi.page(q))

function onDelete(row: any) {
  ElMessageBox.confirm('确认删除该IP吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    CfIpFavoriteApi.delete(row.ip).then(res => {
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
</style>
