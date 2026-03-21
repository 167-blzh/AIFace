import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    // 本地存储所有注册用户
    userList: JSON.parse(localStorage.getItem('userList')) || [],
  }),

  actions: {
    // 登录
    async login(userData) {
      // 验证用户是否存在
      const user = this.userList.find(
        (item) => item.username === userData.username && item.password === userData.password,
      )

      if (!user) {
        throw new Error('账号或密码错误')
      }

      // 生成 token
      this.token = 'admin-token-' + Date.now()
      this.userInfo = {
        username: user.username,
        role: user.username === 'admin' ? 'admin' : 'user',
      }

      // 持久化存储
      localStorage.setItem('token', this.token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      // 记录最后登录的用户名（提升体验）
      localStorage.setItem('lastLoginUsername', user.username)

      return true
    },

    // 注册
    async register(userData) {
      // 检查用户是否已存在
      const isExist = this.userList.some((item) => item.username === userData.username)
      if (isExist) {
        throw new Error('该账号已存在，请更换账号')
      }

      // 添加新用户
      const newUser = {
        username: userData.username,
        password: userData.password,
        createTime: new Date().toLocaleString(),
        role: 'user',
      }

      this.userList.push(newUser)

      // 持久化用户列表
      localStorage.setItem('userList', JSON.stringify(this.userList))

      return true
    },

    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    // 是否登录
    isLogin() {
      return !!this.token
    },

    // 初始化管理员账号（首次加载时自动创建）
    initAdminUser() {
      const adminExist = this.userList.some((item) => item.username === 'admin')
      if (!adminExist) {
        this.userList.push({
          username: 'admin',
          password: 'admin123',
          createTime: new Date().toLocaleString(),
          role: 'admin',
        })
        localStorage.setItem('userList', JSON.stringify(this.userList))
      }
    },
  },
})
