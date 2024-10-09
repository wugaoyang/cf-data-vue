<template>
  <div>
    <vxe-textarea v-model="bestIps" placeholder="优选ip更新" :autosize="{ minRows: 10, maxRows: 20 }" style="margin-bottom: 10px"></vxe-textarea>
    <div  style="text-align: right"><vxe-button status="primary" content="更新" @click="submit"></vxe-button></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import bestIp from "@/api/bestIp";

const bestIps = ref('')

function submit(){
  console.log("submit")
  bestIp.update({'bestIp': bestIps.value})
}
</script>
