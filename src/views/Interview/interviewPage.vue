<template>
  <div class="interview-container">
    <el-card class="interview-card" shadow="never">
      <template #header>
        <div class="interview-header">
          <div class="job-info">
            <h3 class="job-title">{{ interviewStore.currentJob?.name }}</h3>
            <p class="job-desc">{{ interviewStore.currentJob?.desc }}</p>
          </div>
          <div class="timer-container">
            <div class="timer-wrapper">
              <div class="timer-display">
                <el-progress
                  type="dashboard"
                  :percentage="progressPercentage"
                  :width="80"
                  :color="timerColor"
                  :stroke-width="8"
                  :show-text="false"
                />
                <div class="timer-text">
                  <span class="time-value">{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</span>
                  <span class="time-label">剩余时间</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 面试内容区 -->
      <div class="interview-content">
        <!-- 进度条 -->
        <div class="progress-bar">
          <el-progress
            :percentage="questionProgress"
            :stroke-width="12"
            :text-inside="true"
            status="success"
          />
          <div class="progress-text">
            第 {{ currentQuestionIndex + 1 }} 题，共 {{ questionList.length }} 题
          </div>
        </div>

        <!-- 问题展示 -->
        <div class="question-card" v-if="currentQuestion">
          <div class="question-header">
            <el-tag type="primary" size="small" class="question-number">
              {{ currentQuestionIndex + 1 }}/{{ questionList.length }}
            </el-tag>
            <el-tag :type="getQuestionTypeTag(currentQuestion.type)" size="small">
              {{ currentQuestion.type }}
            </el-tag>
          </div>
          <h4 class="question-title">{{ currentQuestion.content }}</h4>
        </div>

        <!-- 答案输入 -->
        <el-form class="answer-form" ref="answerFormRef">
          <el-form-item label="你的回答" class="answer-item">
            <el-input
              v-model="answerContent"
              type="textarea"
              :rows="8"
              placeholder="请输入你的回答..."
              class="answer-input"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          <div class="btn-group">
            <el-button
              @click="prevQuestion"
              :disabled="currentQuestionIndex === 0"
              size="large"
            >
              <el-icon><ArrowLeft /></el-icon>
              上一题
            </el-button>
            <el-button
              @click="nextQuestion"
              v-if="currentQuestionIndex < questionList.length - 1"
              type="primary"
              size="large"
            >
              下一题
              <el-icon><ArrowRight /></el-icon>
            </el-button>
            <el-button
              type="primary"
              @click="finishInterview"
              v-else
              :loading="submitting"
              size="large"
            >
              <el-icon><Check /></el-icon>
              提交面试
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue'

const interviewStore = useInterviewStore()
const router = useRouter()

// 校验当前是否有选中岗位
if (!interviewStore.currentJob) {
  ElMessage.warning('请先选择面试岗位！')
  router.push('/job-select')
}

// 面试时长（分钟）
const totalDuration = parseInt(localStorage.getItem('interviewDuration') || 30)
// 剩余时间（秒）
const remainingTime = ref(totalDuration * 60)
// 计时器
let timer = null

// 计算进度百分比
const progressPercentage = computed(() => {
  return ((totalDuration * 60 - remainingTime.value) / (totalDuration * 60)) * 100
})

// 获取计时器颜色
const timerColor = computed(() => {
  if (progressPercentage.value < 30) return '#67C23A' // 绿色
  if (progressPercentage.value < 70) return '#E6A23C' // 黄色
  return '#F56C6C' // 红色
})

// 格式化时间
const minutes = computed(() => Math.floor(remainingTime.value / 60))
const seconds = computed(() => remainingTime.value % 60)

// 问题进度
const questionProgress = computed(() => {
  return ((currentQuestionIndex.value + 1) / questionList.value.length) * 100
})

// 面试问题列表（根据岗位生成）
const questionList = ref([
  // Java后端
  ...(interviewStore.currentJob?.id === 'backend' ? [
    { content: 'Spring Boot的自动配置原理是什么？', type: '技术知识点' },
    { content: '谈谈你做过的微服务项目中遇到的挑战及解决方案', type: '项目经历' },
    { content: '如何设计一个高并发的订单系统？', type: '场景题' },
    { content: '你为什么选择离开上一家公司？', type: '行为题' }
  ] : []),
  // 前端
  ...(interviewStore.currentJob?.id === 'frontend' ? [
    { content: 'Vue3的Composition API相比Options API有哪些优势？', type: '技术知识点' },
    { content: '谈谈你做过的前端性能优化项目', type: '项目经历' },
    { content: '如何实现一个大型前端项目的工程化架构？', type: '场景题' },
    { content: '你如何处理团队中的技术分歧？', type: '行为题' }
  ] : []),
  // 算法
  ...(interviewStore.currentJob?.id === 'algorithm' ? [
    { content: '说说快速排序的时间复杂度及优化方式', type: '技术知识点' },
    { content: '谈谈你做过的机器学习项目中的特征工程', type: '项目经历' },
    { content: '如何设计一个推荐系统的召回策略？', type: '场景题' },
    { content: '你遇到过的最难的算法问题是什么？如何解决的？', type: '行为题' }
  ] : [])
])

// 当前问题索引
const currentQuestionIndex = ref(0)
// 当前问题
const currentQuestion = computed(() => questionList.value[currentQuestionIndex.value])
// 回答内容
const answerContent = ref('')
// 所有回答
const allAnswers = ref({})
// 提交状态
const submitting = ref(false)

// 获取问题类型标签
const getQuestionTypeTag = (type) => {
  switch(type) {
    case '技术知识点':
      return 'warning'
    case '项目经历':
      return 'success'
    case '场景题':
      return 'primary'
    case '行为题':
      return 'info'
    default:
      return 'default'
  }
}

// 上一题
const prevQuestion = () => {
  // 保存当前回答
  allAnswers.value[currentQuestionIndex.value] = answerContent.value
  currentQuestionIndex.value--
  // 恢复之前的回答
  answerContent.value = allAnswers.value[currentQuestionIndex.value] || ''
}

// 下一题
const nextQuestion = () => {
  if (!answerContent.value.trim()) {
    ElMessage.warning('请输入回答后再继续！')
    return
  }
  // 保存当前回答
  allAnswers.value[currentQuestionIndex.value] = answerContent.value
  currentQuestionIndex.value++
  // 恢复之前的回答
  answerContent.value = allAnswers.value[currentQuestionIndex.value] || ''
}

// 完成面试
const finishInterview = async () => {
  if (!answerContent.value.trim()) {
    ElMessage.warning('请输入回答后提交！')
    return
  }

  submitting.value = true
  // 保存最后一题回答
  allAnswers.value[currentQuestionIndex.value] = answerContent.value

  try {
    // 模拟生成面试报告（实际项目可对接AI评分）
    const score = Math.floor(Math.random() * 20) + 80 // 80-100分
    const report = {
      jobName: interviewStore.currentJob.name,
      score,
      createTime: new Date().toLocaleString(),
      duration: totalDuration,
      questions: questionList.value.map((q, index) => ({
        ...q,
        answer: allAnswers.value[index] || ''
      })),
      // 模拟AI评语
      comment: score >= 90
        ? '你的回答非常优秀，对岗位核心知识点掌握透彻，项目经验丰富！'
        : score >= 85
          ? '你的回答整体良好，对基础知识点掌握扎实，可在项目深度上进一步提升。'
          : '你的回答基本达标，建议加强核心知识点的学习和项目实践。'
    }

    // 结束面试并保存报告
    interviewStore.finishInterview(report)
    ElMessage.success('面试提交成功！正在为您生成评估报告...')

    // 跳转到报告页
    setTimeout(() => {
      router.push('/report')
    }, 1500)
  } catch (error) {
    ElMessage.error('面试提交失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

// 开始计时
onMounted(() => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      // 时间到自动提交
      clearInterval(timer)
      ElMessage.warning('面试时间已到，系统将自动提交！')
      finishInterview()
    }
  }, 1000)
})

// 清除计时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.interview-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.interview-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.interview-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
}

.job-info {
  flex: 1;
}

.job-title {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.job-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.timer-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 120px;
}

.timer-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.time-label {
  display: block;
  font-size: 12px;
  color: #909399;
}

.progress-bar {
  margin-bottom: 24px;
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.question-card {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
  border-left: 4px solid #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.question-number {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}

.question-title {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #303133;
  font-weight: 500;
}

.answer-form {
  margin-top: 20px;
}

.answer-item {
  margin-bottom: 24px;
}

.answer-input {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.answer-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.btn-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.btn-group .el-button {
  min-width: 120px;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #ebeef5;
  padding: 16px 24px;
  background-color: #fafafa;
  border-radius: 16px 16px 0 0;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-progress__text) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 12px;
}

@media (max-width: 768px) {
  .interview-container {
    padding: 16px;
  }

  .interview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .timer-container {
    width: 100%;
    justify-content: center;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn-group .el-button {
    width: 100%;
  }

  .question-header {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
