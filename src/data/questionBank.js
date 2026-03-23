/**
 * 岗位面试题库
 * 包含 Java后端 和 Web前端 两个岗位的面试题
 */

export const jobList = [
  {
    id: 'backend',
    name: 'Java后端开发',
    icon: 'Monitor',
    description: '涵盖 Java 基础、Spring 框架、数据库、微服务、系统设计等',
    color: '#409EFF',
    tags: ['Java', 'Spring Boot', 'MySQL', '微服务']
  },
  {
    id: 'frontend',
    name: 'Web前端开发',
    icon: 'Cellphone',
    description: '涵盖 HTML/CSS/JS、Vue/React 框架、性能优化、工程化等',
    color: '#67C23A',
    tags: ['JavaScript', 'Vue', 'React', 'CSS']
  }
]

export const questionBank = {
  backend: [
    // ===== 技术知识 =====
    {
      id: 'be-01',
      content: '请解释 Java 中 HashMap 的底层实现原理，以及 JDK 1.8 相比 1.7 做了哪些优化？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['数组', '链表', '红黑树', '哈希冲突', '扩容', '负载因子', 'put流程'],
      followUp: '那你知道 ConcurrentHashMap 是怎么保证线程安全的吗？'
    },
    {
      id: 'be-02',
      content: '请详细说明 Spring Boot 的自动配置原理是什么？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['@SpringBootApplication', '@EnableAutoConfiguration', 'spring.factories', '条件注解', '@Conditional', 'SPI'],
      followUp: '如果自动配置的 Bean 和你手动定义的 Bean 冲突了，Spring 怎么处理？'
    },
    {
      id: 'be-03',
      content: '什么是 JVM 垃圾回收机制？请说明常见的垃圾回收算法和垃圾收集器。',
      type: '技术知识',
      difficulty: '较难',
      keywords: ['可达性分析', '标记清除', '标记整理', '复制算法', '分代收集', 'CMS', 'G1', 'ZGC', '新生代', '老年代'],
      followUp: '线上出现 Full GC 频繁，你会怎么排查？'
    },
    {
      id: 'be-04',
      content: 'MySQL 中的索引有哪些类型？B+ 树索引的工作原理是什么？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['B+树', '聚簇索引', '非聚簇索引', '联合索引', '最左前缀', '覆盖索引', '回表', '索引下推'],
      followUp: '什么情况下索引会失效？如何通过 EXPLAIN 来分析慢查询？'
    },
    {
      id: 'be-05',
      content: '请解释 Spring 中 AOP 的实现原理，以及 JDK 动态代理和 CGLIB 代理的区别。',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['动态代理', 'JDK Proxy', 'CGLIB', '切面', '切点', '通知', '织入', '反射', '字节码增强'],
      followUp: 'Spring 事务注解 @Transactional 在什么情况下会失效？'
    },
    {
      id: 'be-06',
      content: '请介绍 Redis 的常用数据结构及其应用场景，以及 Redis 如何实现持久化？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['String', 'Hash', 'List', 'Set', 'ZSet', 'RDB', 'AOF', '混合持久化', '缓存穿透', '缓存击穿', '缓存雪崩'],
      followUp: 'Redis 集群模式下数据是怎么分片的？主从切换的过程是怎样的？'
    },
    {
      id: 'be-07',
      content: '请说明 Java 多线程中 synchronized 和 ReentrantLock 的区别与适用场景。',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['互斥锁', '可重入', '公平锁', '非公平锁', 'Condition', '锁升级', '偏向锁', '轻量级锁', 'AQS'],
      followUp: '你了解 volatile 关键字的作用和底层实现吗？它能替代 synchronized 吗？'
    },
    // ===== 项目经历 =====
    {
      id: 'be-08',
      content: '请介绍你做过的一个后端项目，包括技术栈选型、架构设计和你负责的核心模块。',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['技术选型', '架构设计', '模块划分', '数据库设计', '性能优化', '难点', '解决方案'],
      followUp: '这个项目中你遇到的最大技术挑战是什么？你是怎么解决的？'
    },
    {
      id: 'be-09',
      content: '你在项目中是如何进行数据库设计的？请以一个具体的例子说明。',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['ER图', '范式', '反范式', '分表', '索引设计', '数据量', '查询优化', '主键策略'],
      followUp: '随着数据量增长，你考虑过分库分表方案吗？'
    },
    {
      id: 'be-10',
      content: '你在项目中是如何保证接口性能的？有没有做过性能优化？',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['缓存', '索引', '异步', '批处理', '连接池', 'JVM调优', 'SQL优化', '接口响应时间'],
      followUp: '如果让你把接口响应时间从 500ms 优化到 50ms，你会怎么做？'
    },
    // ===== 场景题 =====
    {
      id: 'be-11',
      content: '如果让你设计一个秒杀系统，你会考虑哪些关键问题？',
      type: '场景题',
      difficulty: '较难',
      keywords: ['限流', '削峰', '消息队列', '库存扣减', '分布式锁', '缓存预热', '超卖', '降级', '熔断'],
      followUp: '如何解决秒杀场景下的超卖问题？'
    },
    {
      id: 'be-12',
      content: '线上服务突然出现大量超时，你会如何排查和处理？',
      type: '场景题',
      difficulty: '较难',
      keywords: ['日志', '监控', '链路追踪', 'CPU', '内存', 'GC', '数据库慢查询', '线程池', '网络', '限流'],
      followUp: '如果排查发现是数据库连接池耗尽导致的，你怎么处理？'
    },
    {
      id: 'be-13',
      content: '如何设计一个分布式唯一 ID 生成方案？',
      type: '场景题',
      difficulty: '中等',
      keywords: ['UUID', '雪花算法', '数据库自增', '号段模式', 'Redis', '时钟回拨', '有序性', '全局唯一'],
      followUp: '雪花算法中如果出现时钟回拨，你怎么处理？'
    },
    // ===== 行为题 =====
    {
      id: 'be-14',
      content: '描述一次你在团队中遇到技术分歧的经历，你是如何处理的？',
      type: '行为题',
      difficulty: '简单',
      keywords: ['沟通', '协作', '妥协', '数据驱动', '技术评审', '方案对比', '说服', '接受意见'],
      followUp: '如果最终采纳的方案不是你的，你后来是怎么配合的？'
    },
    {
      id: 'be-15',
      content: '你是如何学习新技术的？最近在关注什么技术方向？',
      type: '行为题',
      difficulty: '简单',
      keywords: ['学习方法', '技术博客', '源码阅读', '实践项目', '技术社区', '知识体系', '持续学习'],
      followUp: '你觉得 Java 后端开发者最应该掌握的能力是什么？'
    },
    {
      id: 'be-16',
      content: '请讲述一个你在项目deadline紧张时，如何保证代码质量的经历。',
      type: '行为题',
      difficulty: '简单',
      keywords: ['优先级', '时间管理', 'code review', '单元测试', '技术债务', '沟通', '取舍'],
      followUp: '如果时间确实不够，你会选择牺牲哪些方面？'
    }
  ],

  frontend: [
    // ===== 技术知识 =====
    {
      id: 'fe-01',
      content: '请解释 JavaScript 中的事件循环（Event Loop）机制，包括宏任务和微任务。',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['调用栈', '任务队列', '宏任务', '微任务', 'Promise', 'setTimeout', 'requestAnimationFrame', 'MutationObserver'],
      followUp: '请说明以下代码的输出顺序：setTimeout、Promise.then、console.log。'
    },
    {
      id: 'fe-02',
      content: '请详细介绍 Vue 3 的响应式原理，Proxy 相比 Object.defineProperty 有哪些优势？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['Proxy', 'Reflect', 'reactive', 'ref', 'effect', '依赖收集', '触发更新', 'track', 'trigger'],
      followUp: 'ref 和 reactive 有什么区别？什么场景用哪个更合适？'
    },
    {
      id: 'fe-03',
      content: '请解释浏览器的重绘（Repaint）和重排（Reflow），以及如何优化渲染性能？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['DOM树', 'CSSOM', '渲染树', '布局', '绘制', '合成', 'transform', 'will-change', '批量修改', 'DocumentFragment'],
      followUp: '什么是 GPU 加速？如何利用 CSS 触发 GPU 加速？'
    },
    {
      id: 'fe-04',
      content: '请说明 HTTP 缓存机制，包括强缓存和协商缓存的区别和工作流程。',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['Cache-Control', 'Expires', 'ETag', 'Last-Modified', '304', '强缓存', '协商缓存', 'no-cache', 'no-store'],
      followUp: '前端项目中你是如何设计静态资源的缓存策略的？'
    },
    {
      id: 'fe-05',
      content: '请介绍 Vue 3 的 Composition API，与 Options API 相比有什么优势？',
      type: '技术知识',
      difficulty: '简单',
      keywords: ['setup', 'ref', 'reactive', 'computed', 'watch', 'onMounted', '逻辑复用', 'composables', '代码组织'],
      followUp: '如何用 Composition API 封装一个通用的 useFetch composable？'
    },
    {
      id: 'fe-06',
      content: '请解释 JavaScript 中的闭包（Closure），并举例说明其应用场景和可能的问题。',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['词法作用域', '函数作为值', '变量生命周期', '内存泄漏', '模块模式', '柯里化', '防抖', '节流'],
      followUp: '闭包可能导致内存泄漏，你在实际项目中是如何避免的？'
    },
    {
      id: 'fe-07',
      content: '请介绍 Webpack/Vite 的核心原理及区别，为什么 Vite 开发体验更快？',
      type: '技术知识',
      difficulty: '中等',
      keywords: ['bundler', 'ESM', 'HMR', 'rollup', 'esbuild', '按需编译', '预构建', 'code splitting', 'tree shaking'],
      followUp: '在生产环境中，Vite 用什么进行打包？为什么不用 esbuild？'
    },
    // ===== 项目经历 =====
    {
      id: 'fe-08',
      content: '请介绍你做过的一个前端项目，说说技术选型和架构设计。',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['技术选型', '组件设计', '状态管理', '路由设计', '构建工具', '代码规范', '目录结构'],
      followUp: '项目中你是如何做组件拆分和状态管理的？'
    },
    {
      id: 'fe-09',
      content: '你在前端项目中做过哪些性能优化？效果如何？',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['懒加载', '代码分割', '虚拟列表', '图片优化', '缓存', 'CDN', '首屏优化', 'Lighthouse'],
      followUp: '如果首屏加载时间是 5 秒，你会优先从哪些方面入手优化？'
    },
    {
      id: 'fe-10',
      content: '你在项目中如何实现前端的权限控制？',
      type: '项目经历',
      difficulty: '中等',
      keywords: ['路由守卫', '动态路由', '按钮级权限', '角色', 'RBAC', 'token', 'JWT', '指令'],
      followUp: '如果权限数据量很大，你如何在前端高效管理？'
    },
    // ===== 场景题 =====
    {
      id: 'fe-11',
      content: '如果让你设计一个大文件上传功能，你会考虑哪些问题？',
      type: '场景题',
      difficulty: '较难',
      keywords: ['分片上传', '断点续传', '秒传', 'MD5', 'Web Worker', '并发控制', '进度条', '错误重试'],
      followUp: '如何实现断点续传？如果用户关闭浏览器后再次上传同一文件，怎么处理？'
    },
    {
      id: 'fe-12',
      content: '如何实现一个前端监控系统来收集错误和性能数据？',
      type: '场景题',
      difficulty: '较难',
      keywords: ['错误捕获', 'Performance API', 'PerformanceObserver', '上报策略', 'Source Map', 'FCP', 'LCP', 'CLS'],
      followUp: '如何避免监控 SDK 本身对页面性能产生影响？'
    },
    {
      id: 'fe-13',
      content: '如果让你从零搭建一个前端工程化体系，你会包含哪些部分？',
      type: '场景题',
      difficulty: '中等',
      keywords: ['脚手架', 'ESLint', 'Prettier', 'Husky', 'CI/CD', '代码规范', '自动化测试', '组件库', '微前端'],
      followUp: '你是怎么落地代码规范的？如果团队成员不遵守规范，你怎么处理？'
    },
    // ===== 行为题 =====
    {
      id: 'fe-14',
      content: '说说你遇到过最难调试的一个 Bug，你是怎么定位和解决的？',
      type: '行为题',
      difficulty: '简单',
      keywords: ['排查方法', '工具', 'DevTools', '复现', '日志', '二分法', '假设验证'],
      followUp: '从这次经历中你总结了什么调试经验？'
    },
    {
      id: 'fe-15',
      content: '你是如何保持对前端技术的持续学习的？',
      type: '行为题',
      difficulty: '简单',
      keywords: ['技术社区', '博客', '开源', '实践', '知识体系', 'GitHub', '技术分享'],
      followUp: '你觉得前端开发者最重要的核心竞争力是什么？'
    },
    {
      id: 'fe-16',
      content: '在团队协作中，你如何和后端开发者进行高效沟通和协作？',
      type: '行为题',
      difficulty: '简单',
      keywords: ['接口文档', '联调', '沟通', 'Mock', '协作工具', '需求评审', '边界定义'],
      followUp: '如果后端接口返回的数据格式经常变动，你会怎么处理？'
    }
  ]
}

/**
 * 获取岗位题目列表
 * @param {string} jobId - 岗位 ID
 * @param {object} options - 筛选选项
 * @param {string[]} options.types - 题目类型筛选
 * @param {number} options.count - 题目数量
 * @returns {object[]} 筛选后的题目列表
 */
export function getQuestions(jobId, options = {}) {
  const questions = questionBank[jobId] || []
  let filtered = [...questions]

  if (options.types && options.types.length > 0) {
    filtered = filtered.filter((q) => options.types.includes(q.type))
  }

  if (options.count && options.count < filtered.length) {
    // 随机选取指定数量，但保证每种类型至少有一题
    const types = [...new Set(filtered.map((q) => q.type))]
    const selected = []

    for (const type of types) {
      const typeQuestions = filtered.filter((q) => q.type === type)
      selected.push(typeQuestions[Math.floor(Math.random() * typeQuestions.length)])
    }

    const remaining = filtered.filter((q) => !selected.includes(q))
    while (selected.length < options.count && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length)
      selected.push(remaining.splice(idx, 1)[0])
    }

    filtered = selected
  }

  return filtered
}

/**
 * 获取题目类型列表
 * @param {string} jobId - 岗位 ID
 * @returns {string[]} 该岗位的题目类型
 */
export function getQuestionTypes(jobId) {
  const questions = questionBank[jobId] || []
  return [...new Set(questions.map((q) => q.type))]
}
