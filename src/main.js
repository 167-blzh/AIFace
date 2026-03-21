import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化管理员账号
const userStore = useUserStore()
userStore.initAdminUser()
app.config.globalProperties.$echarts = echarts; // 全局挂载

app.mount('#app')
