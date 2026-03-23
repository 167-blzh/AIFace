<template>
  <div class="interview-container">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="job-info">
        <el-tag type="primary" effect="dark">{{ interviewStore.currentJob?.name }}</el-tag>
        <el-tag type="info" effect="plain">{{ answerCount }}/{{ maxAnswers }} 题</el-tag>
        <span class="timer" :class="{ 'timer-warn': minutes < 5 }">
          ⏱ {{ minutes }}:{{ String(seconds).padStart(2, '0') }}
        </span>
      </div>
      <el-button type="danger" size="small" plain @click="confirmFinish">
        结束面试
      </el-button>
    </div>

    <!-- 对话区域 -->
    <div class="chat-area" ref="chatAreaRef">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-msg"
        :class="msg.role === 'assistant' ? 'msg-ai' : 'msg-user'"
      >
        <div class="msg-avatar">
          <el-avatar :size="36" :style="msg.role === 'assistant' ? 'background:#409eff' : 'background:#67c23a'">
            {{ msg.role === 'assistant' ? 'AI' : '我' }}
          </el-avatar>
        </div>
        <div class="msg-bubble">
          <div class="msg-text">{{ msg.content }}</div>
          <div class="msg-time">{{ msg.time }}</div>
        </div>
      </div>

      <!-- AI 正在输入 -->
      <div v-if="aiTyping" class="chat-msg msg-ai">
        <div class="msg-avatar">
          <el-avatar :size="36" style="background:#409eff">AI</el-avatar>
        </div>
        <div class="msg-bubble">
          <div class="msg-text typing">
            <span v-if="streamingText">{{ streamingText }}</span>
            <span v-else class="dots">正在思考<span class="dot-ani">...</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-row">
        <el-button
          v-if="speechSupported"
          :type="isListening ? 'danger' : 'default'"
          circle
          @click="toggleSpeech"
          class="mic-btn"
        >
          <el-icon :size="20">
            <Microphone v-if="!isListening" />
            <VideoPause v-else />
          </el-icon>
        </el-button>
        <el-input
          v-model="userInput"
          :placeholder="aiTyping ? 'AI 正在回复...' : '输入你的回答...'"
          :disabled="aiTyping || finished"
          @keydown.enter.exact.prevent="sendMessage"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          resize="none"
          class="chat-input"
        />
        <el-button
          type="primary"
          :disabled="!userInput.trim() || aiTyping || finished"
          @click="sendMessage"
          class="send-btn"
        >
          发送
        </el-button>
      </div>
      <div v-if="speechError" class="speech-error">
        <el-text type="danger" size="small">{{ speechError }}</el-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Microphone, VideoPause } from '@element-plus/icons-vue'
import { getQuestions } from '@/data/questionBank'
import { matchTopics } from '@/data/knowledgeBase'
import {
  hasApiKey,
  buildInterviewerPrompt,
  interviewerReply,
  evaluateInterview
} from '@/api/ai'
import { evaluateInterviewLocal } from '@/utils/evaluation'
import { useSpeechRecognition } from '@/composables/useSpeech'

const interviewStore = useInterviewStore()
const router = useRouter()

// 校验
if (!interviewStore.currentJob) {
  ElMessage.warning('请先选择面试岗位！')
  router.push('/job-select')
}

const jobId = interviewStore.currentJob?.id || 'backend'
const jobName = interviewStore.currentJob?.name || 'Java后端开发'
const config = interviewStore.interviewConfig || { duration: '30', questionCount: 8, types: [] }

// 获取题目
const questions = getQuestions(jobId, {
  types: config.types?.length ? config.types : undefined,
  count: config.questionCount || 8
})

// 语音
const {
  isListening,
  transcript,
  isSupported: speechSupported,
  error: speechError,
  toggle: toggleSpeech
} = useSpeechRecognition()

watch(transcript, (val) => {
  if (val) userInput.value += val
})

// 计时器
const totalDuration = parseInt(config.duration || '30')
const remainingTime = ref(totalDuration * 60)
const minutes = ref(Math.floor(remainingTime.value / 60))
const seconds = ref(remainingTime.value % 60)
let timer = null

// 对话状态
const messages = ref([])
const userInput = ref('')
const aiTyping = ref(false)
const streamingText = ref('')
const finished = ref(false)
const chatAreaRef = ref(null)
const useAI = hasApiKey()
const answerCount = ref(0) // 用户回答计数
const maxAnswers = config.questionCount || 8 // 最大回答数

// 对话历史（发给 AI 的格式）
const conversationHistory = ref([])

const now = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

const scrollToBottom = async () => {
  await nextTick()
  if (chatAreaRef.value) {
    chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
  }
}

const addMessage = (role, content) => {
  messages.value.push({ role, content, time: now() })
  scrollToBottom()
}

// 初始化面试
onMounted(async () => {
  // 启动计时
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      minutes.value = Math.floor(remainingTime.value / 60)
      seconds.value = remainingTime.value % 60
    } else {
      clearInterval(timer)
      ElMessage.warning('面试时间到，正在生成报告...')
      finishInterview()
    }
  }, 1000)

  // AI 开场
  if (useAI) {
    const knowledgeTopics = matchTopics(jobId, questions.flatMap((q) => q.keywords || []))
    const systemPrompt = buildInterviewerPrompt(jobName, questions, knowledgeTopics.slice(0, 5))
    conversationHistory.value = [{ role: 'system', content: systemPrompt }]

    aiTyping.value = true
    streamingText.value = ''
    try {
      const reply = await interviewerReply(conversationHistory.value, (chunk, full) => {
        streamingText.value = full
        scrollToBottom()
      })
      conversationHistory.value.push({ role: 'assistant', content: reply })
      addMessage('assistant', reply)
    } catch (e) {
      addMessage('assistant', `你好！我是${jobName}面试官。让我们开始吧。\n\n${questions[0].content}`)
    }
    aiTyping.value = false
    streamingText.value = ''
  } else {
    // 无 AI 模式：按顺序提问
    addMessage('assistant', `你好！我是${jobName}面试官，今天由我来进行模拟面试。\n\n第 1 题：${questions[0].content}`)
  }
})

// 当前无 AI 模式下的题目索引
const currentQIndex = ref(0)

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || aiTyping.value || finished.value) return

  // 停止语音
  if (isListening.value) toggleSpeech()

  addMessage('user', text)
  userInput.value = ''

  if (useAI) {
    // AI 模式
    conversationHistory.value.push({ role: 'user', content: text })
    answerCount.value++

    // 达到题目上限，强制结束
    if (answerCount.value >= maxAnswers) {
      conversationHistory.value.push({
        role: 'user',
        content: '（系统提示：面试题目已全部回答完毕，请立即结束面试并给出简短的整体印象。）'
      })
    }

    aiTyping.value = true
    streamingText.value = ''

    try {
      const reply = await interviewerReply(conversationHistory.value, (chunk, full) => {
        streamingText.value = full
        scrollToBottom()
      })
      conversationHistory.value.push({ role: 'assistant', content: reply })
      addMessage('assistant', reply)

      // 检查是否结束：AI 说了结束语，或者已达到回答上限
      if (
        reply.includes('面试到这里就结束了') ||
        reply.includes('辛苦了') ||
        reply.includes('面试结束') ||
        answerCount.value >= maxAnswers
      ) {
        finished.value = true
        setTimeout(() => finishInterview(), 2000)
      }
    } catch (e) {
      addMessage('assistant', '抱歉，AI 暂时无法响应。请稍后重试或直接结束面试。')
    }

    aiTyping.value = false
    streamingText.value = ''
  } else {
    // 无 AI 模式：简单追问 + 下一题
    currentQIndex.value++
    await new Promise((r) => setTimeout(r, 800))

    if (currentQIndex.value < questions.length) {
      const q = questions[currentQIndex.value]
      addMessage('assistant', `好的，我了解了。\n\n第 ${currentQIndex.value + 1} 题：${q.content}`)
    } else {
      addMessage('assistant', '面试到这里就结束了，辛苦了！正在为你生成评估报告...')
      finished.value = true
      setTimeout(() => finishInterview(), 2000)
    }
  }
}

const confirmFinish = () => {
  ElMessageBox.confirm('确定要结束面试吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '继续面试',
    type: 'warning'
  }).then(() => finishInterview())
}

const finishInterview = async () => {
  clearInterval(timer)
  finished.value = true

  // 收集问答对
  const qaList = []
  const userMsgs = messages.value.filter((m) => m.role === 'user')

  for (let i = 0; i < Math.min(userMsgs.length, questions.length); i++) {
    qaList.push({ question: questions[i], answer: userMsgs[i].content })
  }

  let evaluation

  if (useAI && conversationHistory.value.length > 2) {
    try {
      addMessage('assistant', '正在使用 AI 为你生成详细评估报告...')
      evaluation = await evaluateInterview(jobName, conversationHistory.value)
    } catch {
      evaluation = evaluateInterviewLocal(qaList, jobId)
    }
  } else {
    evaluation = evaluateInterviewLocal(qaList, jobId)
  }

  const report = {
    jobId,
    jobName,
    score: evaluation.overallScore,
    dimensions: evaluation.dimensions,
    createTime: new Date().toLocaleString(),
    duration: totalDuration,
    questions: evaluation.questions || qaList.map((qa, i) => ({
      question: qa.question.content,
      answer: qa.answer,
      score: 70,
      highlights: '',
      weaknesses: '',
      suggestion: ''
    })),
    comment: evaluation.overallComment,
    improvementPlan: evaluation.improvementPlan || [],
    conversation: messages.value
  }

  interviewStore.finishInterview(report)
  ElMessage.success('评估报告已生成！')
  router.push('/report')
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.interview-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background: #f0f2f5;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.job-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timer {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  font-variant-numeric: tabular-nums;
}

.timer-warn { color: #f56c6c; }

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-msg {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.msg-ai { align-self: flex-start; }
.msg-user { align-self: flex-end; flex-direction: row-reverse; }

.msg-bubble {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  max-width: 100%;
}

.msg-user .msg-bubble {
  background: #409eff;
  color: #fff;
}

.msg-text {
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-time {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.msg-user .msg-time { color: rgba(255, 255, 255, 0.7); }

.typing .dots { color: #999; }

.dot-ani {
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.input-area {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.mic-btn { flex-shrink: 0; }

.chat-input { flex: 1; }

.send-btn {
  flex-shrink: 0;
  height: 40px;
  min-width: 72px;
  border-radius: 8px;
}

.speech-error { margin-top: 6px; }

:deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 8px 12px;
  max-height: 120px;
}

@media (max-width: 768px) {
  .chat-msg { max-width: 90%; }
  .top-bar { padding: 10px 14px; }
  .chat-area { padding: 14px; }
  .input-area { padding: 12px 14px; }
}
</style>
