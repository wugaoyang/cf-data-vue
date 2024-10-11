<template>
  <div>
    <el-input
        v-model="area"
        style="max-width: 600px"
        placeholder="请输入区域"
    >
      <template #prepend>区域</template>
    </el-input>
    是否删除原有的IP:  <el-switch
      v-model="deleteOld"
      class="ml-2"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      :active-value=1
      :inactive-value=0
  />
    <vxe-textarea v-model="bestIps" placeholder="优选ip更新" :autosize="{ minRows: 10, maxRows: 20 }" style="margin-bottom: 10px; margin-top: 10px"></vxe-textarea>
    <div  style="text-align: right"><vxe-button status="primary" content="更新" @click="submit"></vxe-button></div>
    原有数据
    <el-table :data="bestIpList" style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="ip" label="IP" width="180" />
      <el-table-column prop="name" label="名字" width="180" />
      <el-table-column prop="area" label="区域" />
      <el-table-column prop="speed" label="速度(MB/s)" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
  订阅数据
  <pre>
{{bestIpValue}}
  </pre>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import bestIp from "@/api/bestIp";

const bestIps = ref('')
const area = ref('')
const deleteOld = ref('0')
const bestIpList = ref([])
const bestIpValue = ref([])

function submit(){
  bestIp.update({'bestIps': bestIps.value}, area.value, deleteOld.value).then(res =>{
    getIpList()
    init();
  })
}

function init() {
  getIpList();
  getIpValue();
}

init();

function getIpList() {
  bestIp.list({}).then(res => {
    console.log(res.data)
    bestIpList.value = res.data
  })
}

function getIpValue() {
  bestIp.value().then(res => {
    console.log(res.data)
    bestIpValue.value = res.data
  })
}

</script>
