import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/LayoutIndex.vue'
import Home from '@/views/Home/HomeIndex.vue'
import JobSelect from '@/views/Jobselect/JobSelect.vue'
import Login from '@/views/Login/LoginIndex.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import History from '@/views/History/HistoryPage.vue'
import Report from '@/views/Report/ReportPage.vue'
import Interview from '@/views/Interview/interviewPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { noAuth: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/',
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'job-select', name: 'JobSelect', component: JobSelect },
      { path: 'interview', name: 'Interview', component: Interview },
      { path: 'report', name: 'Report', component: Report },
      { path: 'history', name: 'History', component: History },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 不需要登录
  if (to.meta.noAuth) {
    return next()
  }

  // 未登录 → 去登录
  if (!userStore.isLogin()) {
    return next('/login')
  }

  // 权限控制
  if (to.meta.role && userStore.userInfo.role !== to.meta.role) {
    ElMessage.error('无权限访问')
    return next('/')
  }

  next()
})

export default router
