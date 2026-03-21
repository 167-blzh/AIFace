<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  CircleCheck,
  CircleClose,
  View,
  Hide
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

// 切换登录/注册模式
const isLogin = ref(true)
const loading = ref(false)
const formRef = ref()

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: ['blur', 'change'] },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 6, message: '密码长度不少于 6 个字符', trigger: ['blur', 'change'] }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: ['blur', 'change'] },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]
})

// 表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPwd: ''
})

// 密码显示/隐藏
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 提交表单
const submit = async () => {
  try {
    // 表单验证
    await formRef.value.validate()
    loading.value = true

    if (isLogin.value) {
      // 登录逻辑
      const loginSuccess = await userStore.login(form)
      if (loginSuccess) {
        ElMessage.success('登录成功，欢迎回来！')
        router.push('/')
      }
    } else {
      // 注册逻辑
      const registerSuccess = await userStore.register(form)
      if (registerSuccess) {
        ElMessage.success('注册成功，请登录！')
        // 注册成功后自动切换到登录模式
        isLogin.value = true
        // 清空确认密码
        form.confirmPwd = ''
      }
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
}

// 页面挂载时，自动填充本地缓存的用户名（提升体验）
onMounted(() => {
  const savedUsername = localStorage.getItem('lastLoginUsername')
  if (savedUsername) {
    form.username = savedUsername
  }
})
</script>

<template>
  <div class="login-page">
    <!-- 背景波浪装饰 -->
    <div class="wave wave-1"></div>
    <div class="wave wave-2"></div>
    <div class="wave wave-3"></div>

    <!-- 登录/注册卡片 -->
    <div class="login-card">
      <!-- 标题区域 -->
      <div class="login-header">
        <div class="logo-area">
          <div class="logo-icon">🤖</div>
        </div>
        <h2 class="login-title">
          <span v-if="isLogin">AI 模拟面试系统</span>
          <span v-else>账号注册</span>
        </h2>
        <p class="login-subtitle">
          {{ isLogin ? '欢迎登录，开始你的模拟面试之旅' : '注册新账号，解锁更多功能' }}
        </p>
      </div>

      <!-- 表单区域 -->
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="login-form"
        label-position="left"
        label-width="0"
      >
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号/用户名"
            :prefix-icon="User"
            size="large"
            class="login-input"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            class="login-input"
            :suffix-icon="showPassword ? Hide : View"
            @click:suffix-icon="togglePassword"
          />
        </el-form-item>

        <!-- 确认密码（仅注册显示） -->
        <el-form-item v-if="!isLogin" prop="confirmPwd">
          <el-input
            v-model="form.confirmPwd"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            size="large"
            class="login-input"
            :suffix-icon="showPassword ? Hide : View"
            @click:suffix-icon="togglePassword"
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item class="login-btn-group">
          <el-button
            type="primary"
            size="large"
            @click="submit"
            :loading="loading"
            class="login-submit-btn"
            block
          >
            {{ isLogin ? '登 录' : '注 册' }}
          </el-button>
        </el-form-item>

        <!-- 社交登录选项 -->
        <div class="social-login" v-if="isLogin">
          <div class="divider">
            <span>或使用第三方登录</span>
          </div>
          <div class="social-icons">
            <el-button circle class="social-btn wechat">
              <span class="social-icon">💬</span>
            </el-button>
            <el-button circle class="social-btn github">
              <span class="social-icon">🐙</span>
            </el-button>
            <el-button circle class="social-btn qq">
              <span class="social-icon">🐧</span>
            </el-button>
          </div>
        </div>
      </el-form>

      <!-- 切换登录/注册 -->
      <div class="login-toggle">
        <span @click="isLogin = !isLogin; resetForm()">
          {{ isLogin
            ? '还没有账号？立即注册'
            : '已有账号？返回登录'
          }}
        </span>
        <el-icon>
          <CircleCheck v-if="isLogin" />
          <CircleClose v-else />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体页面布局 */
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 波浪背景装饰 */
.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.1' d='M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
  animation: wave 15s linear infinite;
  z-index: 1;
}

.wave-1 {
  animation-duration: 15s;
  animation-delay: 0s;
  opacity: 0.7;
}

.wave-2 {
  animation-duration: 12s;
  animation-delay: 2s;
  opacity: 0.5;
  height: 120px;
}

.wave-3 {
  animation-duration: 10s;
  animation-delay: 4s;
  opacity: 0.3;
  height: 140px;
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 登录卡片 */
.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* 标题区域 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-area {
  margin-bottom: 16px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 表单样式 */
.login-form {
  margin-bottom: 20px;
}

.login-input {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  height: 50px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.login-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

/* 按钮组 */
.login-btn-group {
  margin-top: 8px;
}

.login-submit-btn {
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border: none;
  transition: all 0.3s ease;
}

.login-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

/* 社交登录 */
.social-login {
  margin-top: 20px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 12px;
  color: #6b7280;
  font-size: 12px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #e5e7eb;
  background: white;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-btn.wechat:hover {
  border-color: #1AAD19;
  color: #1AAD19;
}

.social-btn.github:hover {
  border-color: #333;
  color: #333;
}

.social-btn.qq:hover {
  border-color: #12B7F5;
  color: #12B7F5;
}

.social-icon {
  font-size: 20px;
}

/* 切换登录/注册 */
.login-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.login-toggle:hover {
  color: #3390ff;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    padding: 20px;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    padding: 30px 20px;
  }

  .logo-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .login-title {
    font-size: 22px;
  }

  .social-icons {
    gap: 12px;
  }

  .social-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
