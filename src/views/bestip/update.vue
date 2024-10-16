<template>
  <div>
    <el-input
        v-model="group"
        style="max-width: 600px; width: 300px"
        placeholder="请输入分组（默认CF）"
    >
      <template #prepend>分组</template>
    </el-input>
    删除原有分组:
    <el-switch
        v-model="deleteOld"
        class="ml-2"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        :active-value=1
        :inactive-value=0
    />
    <vxe-textarea v-model="bestIps" placeholder="优选ip更新" :autosize="{ minRows: 10, maxRows: 20 }"
                  style="margin-bottom: 10px; margin-top: 10px"></vxe-textarea>
    <div style="text-align: right">
      <vxe-button status="primary" content="更新" :disabled="updating" @click="submit"></vxe-button>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="表数据" name="first">
        <el-table :data="bestIpList" style="width: 100%">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="ip" label="IP" width="180"/>
          <el-table-column prop="name" label="名字" width="180"/>
          <el-table-column prop="group" label="分组"/>
          <el-table-column prop="area" label="区域"/>
          <el-table-column prop="speed" label="速度(MB/s)"/>
          <el-table-column prop="delay" label="延迟(ms)"/>
          <el-table-column prop="status" label="状态"/>
          <el-table-column prop="updatedTime" label="更新时间"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订阅数据" name="second">
         <pre>
{{ bestIpValue }}
         </pre>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import BestIpApi from "@/api/BestIpApi";
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
  BestIpApi.update({'bestIps': bestIps.value}, group.value, deleteOld.value).then(res => {
    updating.value = false;
    loading.close();
    init();
  })
}

function getIpList() {
  BestIpApi.list({}).then(res => {
    bestIpList.value = res.data
  })
}

function getIpValue() {
  BestIpApi.value().then(res => {
    bestIpValue.value = res.data
  })
}

function init() {
  getIpList();
  getIpValue();
}

init();
</script>
