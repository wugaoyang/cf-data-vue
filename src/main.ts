import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
// ...

// 完整导入 表格库
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia()).use(VxeUI).use(VxeUITable)
app.use(router)

app.mount('#app')
