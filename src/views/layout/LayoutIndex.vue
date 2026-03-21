<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInterviewStore } from "@/stores/interview";
import {
  HomeFilled,
  EditPen,
  Document,
  DataAnalysis,
  Expand,
  Fold,
  User,
  Setting,
  InfoFilled
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElNotification } from "element-plus";

const userStore = useUserStore();
const router = useRouter();

const route = useRoute();
const interviewStore = useInterviewStore();
const isCollapse = ref(false);
const toggleCollapse = () => (isCollapse.value = !isCollapse.value);
const userAvatar = ref("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");

const logout = () => {
  userStore.logout();
  ElMessage.success("退出登录成功");
  router.push("/login");
};

// 登录提醒通知
const showLoginReminder = () => {
  ElNotification({
    title: '欢迎回来',
    message: '您已成功登录系统',
    type: 'success',
    duration: 3000
  });
};
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside
      width="220px"
      class="layout-aside"
      :class="{ 'is-collapse': isCollapse }"
    >
      <div class="logo">
        <transition name="fade">
          <h2 v-if="!isCollapse" class="logo-text">智能模拟面试</h2>
          <h2 v-else class="logo-short">AI</h2>
        </transition>
      </div>

      <el-menu
        :default-active="route.path"
        class="layout-menu"
        :collapse="isCollapse"
        router
        unique-opened
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>
            <span>首页</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/job-select">
          <el-icon><EditPen /></el-icon>
          <template #title>
            <span>开始面试</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/history">
          <el-icon><Document /></el-icon>
          <template #title>
            <span>面试历史</span>
          </template>
        </el-menu-item>

        <el-menu-item
          index="/report"
          v-if="interviewStore.currentReport"
        >
          <el-icon><DataAnalysis /></el-icon>
          <template #title>
            <span>当前报告</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-button
            @click="toggleCollapse"
            class="collapse-btn"
            :icon="isCollapse ? Expand : Fold"
            circle
            size="small"
          />
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title || $route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-badge :value="3" class="notification-badge" v-if="interviewStore.interviewHistory.length > 0">
            <el-button :icon="InfoFilled" circle size="small" />
          </el-badge>

          <el-dropdown placement="bottom-end">
            <div class="user-info">
              <el-avatar size="small" :src="userAvatar" class="user-avatar" />
              <span class="username">学生用户</span>
              <el-icon class="arrow-down">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="User">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item icon="Setting">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout" icon="CircleClose">
                  <el-icon><CircleClose /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}

.layout-aside {
  background: linear-gradient(180deg, #001529 0%, #000c17 100%);
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.layout-aside.is-collapse {
  width: 64px !important;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(90deg, #002140 0%, #1890ff 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-short {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.layout-menu {
  border: none;
  background: transparent;
  color: #bfbfbf;
  height: calc(100% - 60px);
}

.layout-menu:not(.el-menu--collapse) {
  width: 220px;
}

.layout-menu .el-menu-item {
  margin: 8px 12px;
  border-radius: 8px;
  color: #bfbfbf;
  transition: all 0.3s ease;
}

.layout-menu .el-menu-item:hover {
  background-color: rgba(24, 144, 255, 0.1);
  color: #fff;
}

.layout-menu .el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.2) 0%, rgba(24, 144, 255, 0.3) 100%) !important;
  color: #fff !important;
  border-left: 3px solid #1890ff;
}

.layout-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  background: #f0f2f5;
  border: none;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.breadcrumb {
  margin-left: 16px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #606266;
}

.notification-badge {
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.username {
  font-weight: 500;
  color: #303133;
}

.arrow-down {
  margin-left: 4px;
  transition: all 0.3s;
}

.layout-main {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 0;
  overflow-y: auto;
  position: relative;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-aside {
    width: 64px;
  }

  .logo-text {
    display: none;
  }

  .logo-short {
    display: block;
  }

  .layout-menu:not(.el-menu--collapse) {
    width: 64px;
  }

  .header-left {
    gap: 12px;
  }

  .breadcrumb {
    display: none;
  }

  .user-info .username {
    display: none;
  }

  .user-info .arrow-down {
    display: none;
  }
}

/* 滚动条样式优化 */
.layout-main::-webkit-scrollbar {
  width: 6px;
}

.layout-main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.layout-main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.layout-main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
