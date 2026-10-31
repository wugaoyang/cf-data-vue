import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Element Plus 改为按需导入:
// - 组件由 vite 的 unplugin-vue-components(ElementPlusResolver)自动注册并注入样式
// - JS API(ElMessage / ElMessageBox 等)由 unplugin-auto-import 自动导入
// 因此这里不再全量 import 和 app.use(ElementPlus)。

// vxe-table 保留全量导入(体积小,且无官方按需 resolver)
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)

app.use(createPinia()).use(VxeUI).use(VxeUITable)
app.use(router)

app.mount('#app')
