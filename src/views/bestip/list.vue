<template>
  <div class="query">
    <span><el-input
        v-model="queryData.name"
        style="max-width: 600px; width: 200px"
        placeholder="请输入名字"
        @keyup="getIpList"
    >
      <template #prepend>名字</template>
    </el-input>
      </span>
    <span>
    <el-input
        v-model="queryData.group"
        style="max-width: 600px; width: 200px"
        placeholder="请输入分组"
        @keyup="getIpList"
    >
      <template #prepend>分组</template>
    </el-input>
      </span>
    <span>
    <el-input
        v-model="queryData.countryCode"
        style="max-width: 600px; width: 200px"
        placeholder="请输入国家代码"
        @keyup="getIpList"
    >
      <template #prepend>国家代码</template>
    </el-input>
    </span>
    <span>
    <el-select
        v-model="queryData.status"
        style="max-width: 600px; width: 150px"
        @change="getIpList"
    >
      <el-option label="" value=""></el-option>
      <el-option label="启用" value="1">启用</el-option>
      <el-option label="禁用" value="0">禁用</el-option>
      <template #prefix>状态</template>
    </el-select>
    </span>

    <span>
    <el-select
        v-model="queryData.reachable"
        style="max-width: 600px; width: 150px"
        @change="getIpList"
    >
      <el-option label="" value=""></el-option>
      <el-option label="是" value="1">是</el-option>
      <el-option label="否" value="0">否</el-option>
      <template #prefix>可达</template>
    </el-select>
    </span>
    <el-button type="primary" @click="getIpList">查询</el-button>

    <el-checkbox v-model="autoRefresh">自动刷新</el-checkbox>
  </div>
  <el-table :data="bestIpList" style="width: 100%" :height="500" v-loading="loading">
    <el-table-column type="index" width="50"/>
    <el-table-column prop="ip" label="IP" width="180"/>
    <el-table-column prop="name" label="名字" width="180"/>
    <el-table-column prop="group" label="分组"/>
    <el-table-column prop="cityNameCN" label="城市"/>
    <el-table-column prop="cityNameEN" label="城市"/>
    <el-table-column prop="countryNameCN" label="国家名字"/>
    <el-table-column prop="countryCode" label="国家代码"/>
    <el-table-column prop="source" label="来源"/>
    <el-table-column prop="delay" label="延迟(ms)"/>
    <el-table-column prop="speed" label="速度(MB/s)"/>
    <el-table-column prop="status" label="状态"/>
    <el-table-column prop="updatedTime" width="170" label="更新时间"/>
  </el-table>

  <!--  <vxe-table-->
  <!--      border-->
  <!--      height="500"-->
  <!--      :loading="loading"-->
  <!--      :data="bestIpList">-->
  <!--    <vxe-table-column type="index" width="50"/>-->
  <!--    <vxe-table-column field="ip" title="IP" width="180"/>-->
  <!--    <vxe-table-column field="name" title="名字" width="180"/>-->
  <!--    <vxe-table-column field="group" title="分组"/>-->
  <!--    <vxe-table-column field="area" title="区域"/>-->
  <!--    <vxe-table-column field="speed" title="速度(MB/s)"/>-->
  <!--    <vxe-table-column field="status" title="状态"/>-->
  <!--    <vxe-table-column field="updatedTime" title="更新时间"/>-->
  <!--  </vxe-table>-->

  <vxe-pager
      v-model:currentPage="pageVO.pageIndex"
      v-model:pageSize="pageVO.pageSize"
      :total="pageVO.total"
      @page-change="getIpList">
  </vxe-pager>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import BestIpApi from "@/api/BestIpApi";

const pageVO = reactive({
  total: 10,
  pageIndex: 1,
  pageSize: 10
})

const queryData = reactive({
  name: '',
  group: '',
  status: '',
  countryCode: '',
  reachable: ''
})

const loading = ref(true)
const bestIpList = ref([])
const autoRefresh = ref(false)

getIpList()

setInterval(()=>{
  if (autoRefresh.value && !loading.value){
    getIpList();
  }
}, 5000)

function getIpList() {
  loading.value = true
  let query = {
    data: queryData,
    pageVO: pageVO
  }
  BestIpApi.page(query).then(res => {
    bestIpList.value = res.data.data
    pageVO.total = res.data.total
    loading.value = false
  })
}

</script>
<style>
.query span {
  margin: 5px;
}
</style>
