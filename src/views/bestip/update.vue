<template>
  <div>
    <el-input
        v-model="area"
        style="max-width: 600px"
        placeholder="请输入区域"
    >
      <template #prepend>区域</template>
    </el-input>
    <vxe-textarea v-model="bestIps" placeholder="优选ip更新" :autosize="{ minRows: 10, maxRows: 20 }" style="margin-bottom: 10px; margin-top: 10px"></vxe-textarea>
    <div  style="text-align: right"><vxe-button status="primary" content="更新" @click="submit"></vxe-button></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import bestIp from "@/api/bestIp";

const bestIps = ref('')
const area = ref('')

function submit(){
  bestIp.update({'bestIps': bestIps.value}, area.value)
}
</script>
