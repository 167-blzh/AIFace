/**
 * 知识库 - 包含考点知识、优秀回答范例和学习资源
 */

export const knowledgeBase = {
  backend: {
    categories: [
      {
        name: 'Java基础',
        icon: '☕',
        topics: [
          {
            id: 'java-collections',
            name: 'Java 集合框架',
            keywords: ['HashMap', 'ArrayList', 'LinkedList', 'ConcurrentHashMap', '红黑树', '扩容'],
            summary:
              'Java 集合框架提供了一套高效的数据结构和算法实现。HashMap 基于数组+链表/红黑树，JDK1.8 引入红黑树优化长链表查询。ConcurrentHashMap 用 CAS+synchronized 保证线程安全。',
            keyPoints: [
              'HashMap: 数组+链表+红黑树（链表长度>8转红黑树）',
              '扩容: 负载因子0.75，容量翻倍，rehash',
              'ConcurrentHashMap: JDK1.8 用 CAS+synchronized 取代分段锁',
              'ArrayList vs LinkedList: 随机访问 vs 插入删除'
            ],
            exampleAnswer:
              'HashMap底层是数组+链表+红黑树结构。put操作时，先对key进行hash运算确定数组下标，如果该位置为空直接插入；如果发生哈希冲突，以链表形式追加。JDK1.8中，当链表长度超过8且数组长度大于64时，链表会转化为红黑树，将查询时间复杂度从O(n)降到O(logn)。扩容时机是元素数量超过容量*负载因子（默认0.75），新容量翻倍并重新分配元素。',
            resources: [
              { title: 'Java HashMap 源码分析', type: '文章', url: 'https://javaguide.cn/java/collection/hashmap-source-code.html' },
              { title: '深入理解 ConcurrentHashMap', type: '文章', url: 'https://javaguide.cn/java/collection/concurrent-hash-map-source-code.html' }
            ]
          },
          {
            id: 'java-jvm',
            name: 'JVM 与垃圾回收',
            keywords: ['GC', '垃圾回收', '新生代', '老年代', 'CMS', 'G1', 'ZGC', '可达性分析', '内存模型'],
            summary:
              'JVM 内存分为堆（新生代+老年代）、方法区、栈等。垃圾回收通过可达性分析判断对象存活，常用算法有标记清除、标记整理、复制算法。现代收集器如 G1、ZGC 追求低延迟。',
            keyPoints: [
              '内存区域: 堆（新生代Eden+S0+S1, 老年代）、方法区、虚拟机栈、本地方法栈、程序计数器',
              '可达性分析: 从GC Roots出发，不可达对象标记为可回收',
              '垃圾收集器: Serial、Parallel、CMS（并发标记清除）、G1（分区收集）、ZGC（低延迟）',
              '调优: -Xms/-Xmx 堆大小，-XX:+UseG1GC 选择收集器'
            ],
            exampleAnswer:
              'JVM垃圾回收基于可达性分析，从GC Roots（如栈中引用、静态变量）出发，遍历引用链，不可达的对象标记为可回收。常见算法包括：标记-清除（碎片问题）、标记-整理（移动对象无碎片）、复制算法（新生代S0/S1交替复制）。新生代用复制算法（Eden:S0:S1=8:1:1），老年代用标记-整理。G1收集器将堆分为多个Region，优先回收垃圾最多的Region，兼顾吞吐和延迟。',
            resources: [
              { title: 'JVM 垃圾回收详解', type: '文章', url: 'https://javaguide.cn/java/jvm/jvm-garbage-collection.html' },
              { title: 'JVM 调优实战', type: '文章', url: 'https://javaguide.cn/java/jvm/jvm-parameters-intro.html' }
            ]
          },
          {
            id: 'java-concurrent',
            name: 'Java 并发编程',
            keywords: ['线程', 'synchronized', 'ReentrantLock', 'volatile', '线程池', 'CAS', 'AQS'],
            summary:
              'Java 并发编程核心包括线程同步（synchronized/Lock）、volatile 可见性、线程池管理、CAS 无锁编程和 AQS 框架。',
            keyPoints: [
              'synchronized: 偏向锁→轻量级锁→重量级锁，锁升级不可逆',
              'ReentrantLock: 可重入、可中断、支持公平锁、多Condition',
              'volatile: 保证可见性和有序性，不保证原子性',
              '线程池: corePoolSize → 队列 → maxPoolSize → 拒绝策略'
            ],
            exampleAnswer:
              'synchronized 和 ReentrantLock 都是可重入锁。区别在于：synchronized 是 JVM 层面的，自动释放；ReentrantLock 是 API 层面，需要手动 lock/unlock，但支持公平锁、可中断、超时等待、多 Condition。synchronized 在 JDK1.6 后优化了锁升级机制：无锁→偏向锁→轻量级锁→重量级锁。ReentrantLock 底层基于 AQS（AbstractQueuedSynchronizer），通过 CAS 操作 state 实现加锁解锁。',
            resources: [
              { title: 'Java 并发编程指南', type: '文章', url: 'https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html' }
            ]
          }
        ]
      },
      {
        name: 'Spring框架',
        icon: '🌱',
        topics: [
          {
            id: 'spring-boot',
            name: 'Spring Boot 自动配置',
            keywords: ['自动配置', 'SpringBootApplication', 'spring.factories', '条件注解', 'Starter'],
            summary:
              'Spring Boot 通过 @EnableAutoConfiguration 和 spring.factories/AutoConfiguration.imports 机制实现自动装配，结合 @Conditional 系列注解按条件加载 Bean。',
            keyPoints: [
              '@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan',
              '自动配置类在 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 中声明',
              '@ConditionalOnClass, @ConditionalOnMissingBean 等条件注解控制是否生效',
              '自定义 Starter: 写 AutoConfiguration 类 + spring.factories'
            ],
            exampleAnswer:
              'Spring Boot 自动配置的核心是 @EnableAutoConfiguration。启动时，Spring Boot 会扫描所有依赖 jar 包中 META-INF/spring.factories 文件，加载其中的自动配置类。每个自动配置类上有 @Conditional 系列注解（如 @ConditionalOnClass、@ConditionalOnMissingBean），只有满足条件时才会生效。比如引入了 spring-boot-starter-web，就会自动配置 Tomcat 和 Spring MVC。如果手动定义了同类型的 Bean，@ConditionalOnMissingBean 会让自动配置退让。',
            resources: [
              { title: 'Spring Boot 自动配置原理', type: '文章', url: 'https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.html' }
            ]
          },
          {
            id: 'spring-aop',
            name: 'Spring AOP',
            keywords: ['AOP', '切面', '代理', 'JDK Proxy', 'CGLIB', '事务'],
            summary: 'Spring AOP 通过动态代理实现面向切面编程，JDK 动态代理适用于接口，CGLIB 通过字节码生成子类代理。',
            keyPoints: [
              'JDK Proxy: 基于接口，生成代理对象实现接口方法',
              'CGLIB: 基于继承，生成目标类的子类，不能代理 final 类/方法',
              'Spring 默认: 有接口用 JDK Proxy，无接口用 CGLIB',
              '@Transactional 失效: 自调用、非public方法、异常被捕获'
            ],
            exampleAnswer:
              'Spring AOP 底层通过动态代理实现。如果目标类实现了接口，默认使用 JDK 动态代理，通过 Proxy.newProxyInstance 创建代理；如果没有接口，使用 CGLIB，通过 ASM 字节码框架生成目标类的子类。核心概念包括：切面（Aspect）、切点（Pointcut，定义在哪切）、通知（Advice，切入什么逻辑，如@Before、@After、@Around）。常见应用：事务管理、日志记录、权限校验。',
            resources: [
              { title: 'Spring AOP 原理详解', type: '文章', url: 'https://javaguide.cn/system-design/framework/spring/spring-knowledge-and-questions-summary.html' }
            ]
          }
        ]
      },
      {
        name: '数据库',
        icon: '🗄️',
        topics: [
          {
            id: 'mysql-index',
            name: 'MySQL 索引',
            keywords: ['B+树', '索引', '聚簇索引', '覆盖索引', '最左前缀', '回表', 'EXPLAIN'],
            summary:
              'MySQL InnoDB 使用 B+ 树作为索引结构。聚簇索引叶子节点存数据行，二级索引叶子存主键值（需回表）。联合索引遵循最左前缀匹配。',
            keyPoints: [
              'B+树: 多路平衡树，叶子节点有序链表，适合范围查询',
              '聚簇索引: 主键索引，叶子节点存完整数据行',
              '覆盖索引: 查询列都在索引中，避免回表',
              '索引失效: 函数操作、隐式转换、OR、!='
            ],
            exampleAnswer:
              'MySQL索引主要基于B+树结构。InnoDB表的主键索引是聚簇索引，叶子节点直接存储完整数据行；其他索引是二级索引，叶子节点存主键值，查询需要回表获取完整数据。联合索引遵循最左前缀匹配原则，比如(a,b,c)索引，查询a=1 and b=2可以用到索引，但b=2 and c=3不行。覆盖索引是指查询的字段都在索引中，无需回表，可以显著提升查询性能。EXPLAIN 的 key 列显示实际使用的索引，type 列显示访问类型（const>eq_ref>ref>range>index>ALL）。',
            resources: [
              { title: 'MySQL 索引详解', type: '文章', url: 'https://javaguide.cn/database/mysql/mysql-index.html' }
            ]
          },
          {
            id: 'redis',
            name: 'Redis 核心',
            keywords: ['Redis', '缓存', 'String', 'Hash', 'List', 'ZSet', '持久化', '缓存穿透', '缓存击穿'],
            summary:
              'Redis 是基于内存的 K-V 数据库，支持 String/Hash/List/Set/ZSet 五种基本数据结构，通过 RDB 和 AOF 实现持久化。',
            keyPoints: [
              '数据结构: String(缓存)、Hash(对象)、List(队列)、Set(去重)、ZSet(排行榜)',
              '持久化: RDB(快照)、AOF(日志)、混合持久化',
              '缓存穿透: 布隆过滤器/空值缓存',
              '缓存击穿: 热点key过期，互斥锁/逻辑过期'
            ],
            exampleAnswer:
              'Redis有五种基本数据结构：String适合缓存和计数器；Hash适合存对象；List可做消息队列；Set支持交集并集；ZSet（有序集合）适合排行榜。持久化方面，RDB是定时快照，恢复快但可能丢数据；AOF记录每条写命令，数据更安全但文件大。Redis 4.0引入混合持久化，RDB+AOF结合。缓存三大问题：穿透（查不存在的数据，用布隆过滤器）、击穿（热点key过期，用互斥锁）、雪崩（大量key同时过期，打散过期时间）。',
            resources: [
              { title: 'Redis 常见面试题', type: '文章', url: 'https://javaguide.cn/database/redis/redis-questions-01.html' }
            ]
          }
        ]
      },
      {
        name: '系统设计',
        icon: '🏗️',
        topics: [
          {
            id: 'system-design',
            name: '分布式系统设计',
            keywords: ['微服务', '分布式', '限流', '熔断', '消息队列', 'CAP', 'BASE'],
            summary: '分布式系统设计涉及服务拆分、通信、一致性、可用性等。常见组件包括注册中心、配置中心、网关、消息队列等。',
            keyPoints: [
              'CAP: 一致性(C)、可用性(A)、分区容错(P)，三选二',
              '微服务: Spring Cloud、Dubbo，服务注册发现+负载均衡+熔断降级',
              '消息队列: RabbitMQ/Kafka/RocketMQ，解耦+异步+削峰',
              '分布式事务: 2PC、TCC、Saga、最终一致性'
            ],
            exampleAnswer:
              '设计分布式系统时，首先要考虑CAP定理：在分区容错（P）必须保证的前提下，在一致性（C）和可用性（A）之间做权衡。微服务架构中，常用Spring Cloud体系：Nacos（注册中心+配置中心）、OpenFeign（服务调用）、Sentinel（限流熔断）、Gateway（网关）。消息队列用于解耦和削峰，如订单创建后通过MQ异步通知库存和积分服务。分布式事务可用Seata的AT模式或TCC模式。',
            resources: [
              { title: '系统设计面试指南', type: '文章', url: 'https://javaguide.cn/system-design/system-design-questions.html' }
            ]
          }
        ]
      }
    ]
  },

  frontend: {
    categories: [
      {
        name: 'JavaScript核心',
        icon: '⚡',
        topics: [
          {
            id: 'js-event-loop',
            name: '事件循环与异步',
            keywords: ['事件循环', 'Event Loop', '宏任务', '微任务', 'Promise', 'async/await'],
            summary:
              'JavaScript 是单线程语言，通过事件循环实现异步。宏任务（setTimeout、setInterval）和微任务（Promise.then、MutationObserver）在每轮循环中按顺序执行。',
            keyPoints: [
              '执行顺序: 同步代码 → 微任务队列清空 → 宏任务（一个）→ 微任务队列清空 → ...',
              '微任务: Promise.then/catch/finally、MutationObserver、queueMicrotask',
              '宏任务: setTimeout、setInterval、I/O、UI渲染',
              'async/await: 语法糖，await 后面的代码相当于 .then 回调'
            ],
            exampleAnswer:
              'JavaScript事件循环的执行顺序是：先执行同步代码（调用栈），然后清空微任务队列（Promise.then等），再执行一个宏任务（setTimeout等），然后再清空微任务...如此循环。例如：console.log(1); setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(3)); console.log(4); 输出顺序是1,4,3,2。因为同步代码先执行(1,4)，然后微任务(3)，最后宏任务(2)。',
            resources: [
              { title: '事件循环机制详解', type: '文章', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop' }
            ]
          },
          {
            id: 'js-closure',
            name: '闭包与作用域',
            keywords: ['闭包', '作用域', '词法环境', '内存泄漏', '柯里化', '模块模式'],
            summary:
              '闭包是函数和其词法环境的组合，内部函数可以访问外部函数的变量。常用于数据封装、柯里化、防抖节流等。',
            keyPoints: [
              '定义: 函数能够记住并访问其词法作用域，即使在作用域外执行',
              '应用: 模块模式（私有变量）、柯里化、防抖/节流、事件处理器',
              '注意: 循环中的闭包陷阱（var vs let）、内存泄漏（定时器/DOM引用）',
              '解决内存泄漏: 手动置null、removeEventListener、clearTimeout'
            ],
            exampleAnswer:
              '闭包是指一个函数能够访问其外部函数作用域中的变量，即使外部函数已经执行完毕。本质是函数创建时会保存一个对词法环境的引用。常见应用：防抖函数中，内部函数访问外部的timer变量实现延迟执行；模块模式中，通过IIFE+闭包实现私有变量。需要注意的问题：循环中使用var声明会导致闭包共享同一个变量（用let或立即执行函数解决）；未清理的闭包引用可能导致内存泄漏。',
            resources: [
              { title: 'MDN 闭包', type: '文章', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures' }
            ]
          }
        ]
      },
      {
        name: 'Vue框架',
        icon: '💚',
        topics: [
          {
            id: 'vue3-reactivity',
            name: 'Vue 3 响应式原理',
            keywords: ['Proxy', 'reactive', 'ref', '依赖收集', '触发更新', 'effect'],
            summary:
              'Vue 3 使用 Proxy 替代 Object.defineProperty 实现响应式。Proxy 可以拦截对象的所有操作，支持数组和新增属性的响应式。',
            keyPoints: [
              'Proxy: 拦截 get/set/deleteProperty 等操作',
              'ref: 包装基本类型为响应式，内部用 .value 访问',
              'reactive: 将对象包装为 Proxy，深层响应式',
              '依赖收集: get 时 track（收集effect），set 时 trigger（触发更新）'
            ],
            exampleAnswer:
              'Vue 3的响应式核心从Object.defineProperty换成了Proxy。Proxy可以拦截对象的所有操作（get/set/delete等），解决了Vue 2中无法检测新增属性和数组下标修改的问题。reactive()将对象包装为深层Proxy；ref()用于基本类型，内部是一个{value: xxx}的对象。响应式原理是：读取数据时（get），收集当前的副作用函数（effect/组件渲染函数）作为依赖；修改数据时（set），触发所有依赖重新执行。这就是track和trigger的过程。',
            resources: [
              { title: 'Vue 3 响应式原理', type: '文章', url: 'https://cn.vuejs.org/guide/extras/reactivity-in-depth.html' }
            ]
          },
          {
            id: 'vue3-composition',
            name: 'Composition API',
            keywords: ['setup', 'Composition API', 'composables', '逻辑复用'],
            summary:
              'Composition API 是 Vue 3 的核心特性，通过函数组合的方式组织组件逻辑，解决 Options API 中逻辑分散的问题。',
            keyPoints: [
              '<script setup>: 编译时语法糖，更简洁',
              'composables: 以 use 开头的函数，封装可复用逻辑',
              '优势: 更好的逻辑复用、类型推断、代码组织',
              'vs Options API: 相关逻辑集中 vs 按选项分散'
            ],
            exampleAnswer:
              'Composition API通过函数的方式组织组件逻辑，最大的优势是逻辑复用和代码组织。在Options API中，一个功能的data、methods、computed分散在不同选项里；Composition API可以将相关逻辑集中在一起。通过composables（以use开头的函数）实现逻辑复用，比mixins更清晰，没有命名冲突问题。<script setup>是编译时语法糖，顶层变量自动暴露给模板，defineProps/defineEmits定义接口。',
            resources: [
              { title: 'Composition API 指南', type: '文章', url: 'https://cn.vuejs.org/guide/extras/composition-api-faq.html' }
            ]
          }
        ]
      },
      {
        name: '浏览器与网络',
        icon: '🌐',
        topics: [
          {
            id: 'browser-render',
            name: '浏览器渲染原理',
            keywords: ['重绘', '重排', '渲染树', 'GPU加速', 'DOM', 'CSSOM'],
            summary: '浏览器渲染流程：HTML→DOM树，CSS→CSSOM树，合成渲染树，布局（重排），绘制（重绘），合成。',
            keyPoints: [
              '渲染流程: DOM + CSSOM → 渲染树 → Layout → Paint → Composite',
              '重排(Reflow): 改变布局属性（width/height/position），开销大',
              '重绘(Repaint): 改变外观属性（color/background），开销中等',
              'GPU加速: transform/opacity/will-change 触发合成层'
            ],
            exampleAnswer:
              '浏览器渲染流程：解析HTML构建DOM树，解析CSS构建CSSOM树，两者合成渲染树（只包含可见节点），然后进行布局（计算几何信息）和绘制（生成像素）。重排是指改变了元素的布局属性（如width、height、position），需要重新计算布局，开销最大；重绘是改变了外观属性（如color、background），不影响布局但需要重新绘制。优化方式：批量修改DOM（DocumentFragment）、使用transform代替位置变化（触发GPU合成层，跳过布局和绘制）、使用will-change提前告知浏览器。',
            resources: [
              { title: '浏览器渲染原理', type: '文章', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work' }
            ]
          },
          {
            id: 'http-cache',
            name: 'HTTP 缓存',
            keywords: ['缓存', 'Cache-Control', 'ETag', 'Last-Modified', '强缓存', '协商缓存'],
            summary:
              '强缓存通过 Cache-Control/Expires 判断，未过期直接用缓存（200 from cache）。协商缓存通过 ETag/Last-Modified 与服务器验证，未修改返回 304。',
            keyPoints: [
              '强缓存: Cache-Control: max-age=3600 或 Expires',
              '协商缓存: ETag/If-None-Match（精确）、Last-Modified/If-Modified-Since（秒级）',
              '优先级: Cache-Control > Expires，ETag > Last-Modified',
              '策略: HTML用协商缓存，JS/CSS用强缓存+hash文件名'
            ],
            exampleAnswer:
              'HTTP缓存分为强缓存和协商缓存。强缓存通过Cache-Control（如max-age=3600）或Expires头控制，在有效期内浏览器直接使用缓存，不发请求，状态码200(from cache)。协商缓存需要向服务器验证：服务器返回ETag（内容hash）和Last-Modified（修改时间），下次请求带上If-None-Match和If-Modified-Since，服务器对比后如果没变化返回304。前端部署策略通常是：HTML文件用协商缓存（每次验证），JS/CSS/图片用强缓存+内容hash文件名（如app.abc123.js），文件内容变了hash就变了，自动更新。',
            resources: [
              { title: 'HTTP 缓存机制', type: '文章', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching' }
            ]
          }
        ]
      },
      {
        name: '工程化',
        icon: '🔧',
        topics: [
          {
            id: 'build-tools',
            name: '构建工具 Webpack/Vite',
            keywords: ['Webpack', 'Vite', 'ESM', 'HMR', 'tree shaking', 'code splitting'],
            summary:
              'Webpack 是传统 bundler，打包所有模块；Vite 利用浏览器原生 ESM，开发时按需编译，生产时用 Rollup 打包。',
            keyPoints: [
              'Webpack: 入口→依赖图→loader转换→plugin处理→输出bundle',
              'Vite开发: 利用浏览器ESM，按需编译（秒级启动）',
              'Vite生产: 用Rollup打包（成熟的tree shaking和code splitting）',
              'HMR: Vite精准到模块级别，Webpack需要更多配置'
            ],
            exampleAnswer:
              'Webpack和Vite的核心区别在于开发模式。Webpack需要先打包所有模块再启动服务器，项目越大越慢。Vite利用浏览器原生ES Module，启动时只需启动服务器，浏览器请求哪个模块就编译哪个，实现秒级启动。HMR也更快，Vite只需更新修改的模块，不受项目大小影响。生产环境中，Vite使用Rollup打包，因为浏览器请求大量小模块会有性能问题，需要打包合并。Rollup的tree shaking能力更强，更适合库的打包。esbuild虽然快但不支持代码分割和CSS处理，所以生产环境不用它。',
            resources: [
              { title: 'Vite 官方文档', type: '文章', url: 'https://cn.vitejs.dev/guide/why.html' }
            ]
          }
        ]
      }
    ]
  }
}

/**
 * 根据关键词匹配知识点
 * @param {string} jobId - 岗位ID
 * @param {string[]} keywords - 关键词列表
 * @returns {object[]} 匹配的知识点
 */
export function matchTopics(jobId, keywords) {
  const kb = knowledgeBase[jobId]
  if (!kb) return []

  const matched = []
  const lowerKeywords = keywords.map((k) => k.toLowerCase())

  for (const category of kb.categories) {
    for (const topic of category.topics) {
      const topicKeywords = topic.keywords.map((k) => k.toLowerCase())
      const score = lowerKeywords.filter((k) =>
        topicKeywords.some((tk) => tk.includes(k) || k.includes(tk))
      ).length

      if (score > 0) {
        matched.push({ ...topic, category: category.name, matchScore: score })
      }
    }
  }

  return matched.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * 获取薄弱项推荐的学习资源
 * @param {string} jobId - 岗位ID
 * @param {object} evaluation - 评估结果
 * @returns {object[]} 推荐的学习资源
 */
export function getRecommendations(jobId, evaluation) {
  const kb = knowledgeBase[jobId]
  if (!kb || !evaluation) return []

  const recommendations = []

  // 从评估结果中提取薄弱关键词
  const weakKeywords = []
  if (evaluation.questions) {
    for (const q of evaluation.questions) {
      if (q.score < 70) {
        weakKeywords.push(...(q.keywords || []))
      }
    }
  }

  if (weakKeywords.length === 0) {
    // 没有明显薄弱项，推荐所有类别的第一个主题
    for (const category of kb.categories) {
      if (category.topics.length > 0) {
        const topic = category.topics[0]
        recommendations.push({
          topic: topic.name,
          category: category.name,
          reason: '巩固基础知识',
          resources: topic.resources,
          keyPoints: topic.keyPoints
        })
      }
    }
    return recommendations
  }

  // 根据薄弱关键词匹配知识点
  const matched = matchTopics(jobId, weakKeywords)
  for (const topic of matched.slice(0, 5)) {
    recommendations.push({
      topic: topic.name,
      category: topic.category,
      reason: `该知识点在面试中表现需要提升`,
      resources: topic.resources,
      keyPoints: topic.keyPoints,
      exampleAnswer: topic.exampleAnswer
    })
  }

  return recommendations
}

/**
 * 获取所有学习资源（按类别）
 * @param {string} jobId - 岗位ID
 * @returns {object[]} 类别和资源列表
 */
export function getAllResources(jobId) {
  const kb = knowledgeBase[jobId]
  if (!kb) return []
  return kb.categories
}
