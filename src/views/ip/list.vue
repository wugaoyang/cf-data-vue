<template>
  <el-row class="query">
    <view>
      <el-input
          v-model="queryData.ip"
          style="max-width: 600px; width: 200px"
          placeholder="请输入ip"
          @keyup="search"
          clearable
      >
        <template #prepend>ip</template>
      </el-input>
    </view>
    <view>
      <el-input
          v-model="queryData.countryNameCN"
          style="max-width: 600px; width: 200px"
          placeholder="请输入国家名字"
          @keyup="search"
          clearable
      >
        <template #prepend>国家名字</template>
      </el-input>
    </view>
    <view>
      <el-input
          v-model="queryData.countryCode"
          style="max-width: 600px; width: 200px"
          placeholder="请输入国家代码"
          @keyup="search"
          clearable
      >
        <template #prepend>国家代码</template>
      </el-input>
    </view>

    <view>
      <el-checkbox v-model="queryData.countryCodeIsNull" @change="search">国家代码为空</el-checkbox>
    </view>
    <view>
      <el-select
          v-model="queryData.status"
          style="max-width: 600px; width: 150px"
          @change="search"
          clearable
      >
        <el-option label="全部" value=""></el-option>
        <el-option label="启用" value="1">启用</el-option>
        <el-option label="禁用" value="0">禁用</el-option>
        <template #prefix>状态</template>
      </el-select>
    </view>

    <view>
      <el-select
          v-model="queryData.reachable"
          style="max-width: 600px; width: 150px"
          @change="search"
          aria-label=""
          clearable
      >
        <el-option label="全部" value=""></el-option>
        <el-option label="是" value="1">是</el-option>
        <el-option label="否" value="0">否</el-option>
        <template #prefix>可达</template>
      </el-select>
    </view>
    <view>
      <el-input
          type="number"
          v-model="queryData.delay1"
          style="max-width: 600px; width: 200px"
          placeholder="请输入延迟"
          @keyup="search"
          clearable
      >
        <template #prepend>延迟>=</template>
      </el-input>
    </view>
    <view>
      <el-input
          type="number"
          v-model="queryData.delay2"
          style="max-width: 600px; width: 200px"
          placeholder="请输入延迟"
          @keyup="search"
          clearable
      >
        <template #prepend>延迟<=</template>
      </el-input>
    </view>
    <view>
      <el-input
          type="number"
          v-model="queryData.speed1"
          style="max-width: 600px; width: 200px"
          placeholder="请输入速度"
          @keyup="search"
          clearable
      >
        <template #prepend>速度>=</template>
      </el-input>
    </view>
    <view>
      <el-input
          type="number"
          v-model="queryData.speed2"
          style="max-width: 600px; width: 200px"
          placeholder="请输入速度"
          @keyup="search"
          clearable
      >
        <template #prepend>速度<=</template>
      </el-input>
    </view>
    <view>
      <el-input
          v-model="queryData.name"
          style="max-width: 600px; width: 200px"
          placeholder="请输入名字"
          @keyup="search"
          clearable
      >
        <template #prepend>名字</template>
      </el-input>
    </view>
    <view>
      <el-input
          v-model="queryData.group"
          style="max-width: 600px; width: 200px"
          placeholder="请输入分组"
          @keyup="search"
          clearable
      >
        <template #prepend>分组</template>
      </el-input>
    </view>

    <view>
      <el-button type="primary" @click="search">查询</el-button>
    </view>
    <view>
      <el-button type="primary" @click="reset">重置</el-button>
    </view>
    <view>
      <el-input v-model="seconds"
                type="number"
                style="max-width: 600px; width: 120px"
                @change="check">
        <template #append>秒</template>
      </el-input>
    </view>
    <view>
      <el-checkbox v-model="autoRefresh">自动刷新</el-checkbox>
    </view>
  </el-row>
  <el-table :data="bestIpList" style="width: 100%" v-loading="loading">
    <el-table-column type="index" width="50"/>
    <el-table-column prop="ip" label="IP" width="150"/>
    <el-table-column prop="cityNameCN" label="城市(中文)"/>
    <el-table-column prop="cityNameEN" label="城市(英文)"/>
    <el-table-column prop="countryNameCN" label="国家名字"/>
    <el-table-column prop="countryCode" label="国家代码"/>
    <el-table-column prop="source" label="来源"/>
    <el-table-column prop="delay" label="延迟(ms)"/>
    <el-table-column prop="speed" label="速度(MB/s)"/>
    <el-table-column prop="status" label="状态"/>
    <el-table-column prop="name" label="名字" width="180"/>
    <el-table-column prop="group" label="分组"/>
    <el-table-column prop="updatedTime" width="170" label="更新时间"/>
    <el-table-column label="操作" width="240">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <vxe-pager
      v-model:currentPage="pageVO.pageIndex"
      v-model:pageSize="pageVO.pageSize"
      :total="pageVO.total"
      @page-change="getIpList">
  </vxe-pager>

  <el-dialog v-model="editDialogVisible" :title="'编辑 - ' + editForm.ip" width="600px" class="edit-dialog">
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
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import IpInfoApi from "@/api/IpInfoApi";

const pageVO = reactive({
  total: 10,
  pageIndex: 1,
  pageSize: 10
})


let query = {
  name: '',
  group: '',
  status: '',
  countryCode: '',
  countryNameCN: '',
  reachable: '',
  ip: '',
  delay1: '',
  delay2: '',
  speed1: '',
  speed2: '',
  countryCodeIsNull: false
};
const queryData = reactive(query)

const loading = ref(true)
const bestIpList = ref([])
const autoRefresh = ref(false)
const seconds = ref(3)

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

getIpList()

let interval = setInterval(() => {
  if (autoRefresh.value && !loading.value) {
    getIpList();
  }
}, seconds.value * 1000)

function check() {
  clearInterval(interval)
  seconds.value = seconds.value < 1 ? 1 : seconds.value;
  interval = setInterval(() => {
    if (autoRefresh.value && !loading.value) {
      getIpList();
    }
  }, seconds.value * 1000)
}

function search() {
  pageVO.pageIndex = 1;
  getIpList()
}

function reset() {
  queryData.name = '';
  queryData.group = '';
  queryData.status = '';
  queryData.countryCode = '';
  queryData.countryNameCN = '';
  queryData.reachable = '';
  queryData.ip = '';
  queryData.delay1 = '';
  queryData.delay2 = '';
  queryData.speed1 = '';
  queryData.speed2 = '';
  queryData.countryCodeIsNull = false;
  pageVO.pageIndex = 1
  getIpList()
}

function getIpList() {
  loading.value = true
  let query = {
    data: queryData,
    pageVO: pageVO
  }
  IpInfoApi.page(query).then(res => {
    bestIpList.value = res.data.data
    pageVO.total = res.data.total
    loading.value = false
  })
}

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
<style>
.query view {
  margin: 5px 5px 5px;
}
.edit-dialog :deep(.el-dialog) {
  margin-top: 10px !important;
}
</style>
