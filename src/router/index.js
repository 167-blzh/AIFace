import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/LayoutIndex.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/LoginIndex.vue'),
    meta: { noAuth: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/',
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home/HomeIndex.vue') },
      { path: 'job-select', name: 'JobSelect', component: () => import('@/views/Jobselect/JobSelect.vue') },
      { path: 'interview', name: 'Interview', component: () => import('@/views/Interview/interviewPage.vue') },
      { path: 'report', name: 'Report', component: () => import('@/views/Report/ReportPage.vue') },
      { path: 'history', name: 'History', component: () => import('@/views/History/HistoryPage.vue') },
      { path: 'learn', name: 'Learn', component: () => import('@/views/Learn/LearnPage.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.noAuth) return next()

  if (!userStore.isLogin()) return next('/login')

  if (to.meta.role && userStore.userInfo.role !== to.meta.role) {
    ElMessage.error('无权限访问')
    return next('/')
  }

  next()
})

export default router
