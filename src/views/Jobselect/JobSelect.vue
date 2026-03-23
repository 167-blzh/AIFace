<template>
  <div class="job-select-container">
    <!-- 岗位选择 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">
            <el-icon class="card-icon"><User /></el-icon>
            选择目标岗位
          </h3>
          <el-steps :active="0" finish-status="success" simple>
            <el-step title="选择岗位" />
            <el-step title="配置面试" />
            <el-step title="开始面试" />
          </el-steps>
        </div>
      </template>

      <el-row :gutter="24">
        <el-col :lg="12" :md="12" :sm="24" :xs="24" v-for="job in jobs" :key="job.id">
          <div
            class="job-card"
            :class="{ 'is-active': selectedJob === job.id }"
            @click="selectJob(job)"
          >
            <div class="job-icon" :style="{ color: job.color }">
              <el-icon :size="32"><component :is="job.icon" /></el-icon>
            </div>
            <div class="job-content">
              <h4 class="job-name">{{ job.name }}</h4>
              <p class="job-desc">{{ job.description }}</p>
              <div class="job-tags">
                <el-tag v-for="tag in job.tags" :key="tag" size="small" effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <el-icon v-if="selectedJob === job.id" class="job-check" color="#67c23a" :size="24">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 面试配置 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">
            <el-icon class="card-icon"><Setting /></el-icon>
            面试配置
          </h3>
        </div>
      </template>

      <el-form :model="config" label-width="120px" class="config-form">
        <el-form-item label="面试时长">
          <el-select v-model="config.duration" style="width: 200px">
            <el-option label="15分钟" value="15" />
            <el-option label="30分钟" value="30" />
            <el-option label="45分钟" value="45" />
          </el-select>
        </el-form-item>

        <el-form-item label="题目数量">
          <el-select v-model="config.questionCount" style="width: 200px">
            <el-option label="5 题（快速）" :value="5" />
            <el-option label="8 题（标准）" :value="8" />
            <el-option label="12 题（深度）" :value="12" />
          </el-select>
        </el-form-item>

        <el-form-item label="题型偏好">
          <el-checkbox-group v-model="config.types">
            <el-checkbox v-for="t in availableTypes" :key="t" :label="t" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item class="submit-item">
          <el-button
            type="primary"
            @click="startInterview"
            :disabled="!selectedJob"
            size="large"
            class="start-btn"
          >
            <el-icon><VideoPlay /></el-icon>
            开始模拟面试
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Setting, VideoPlay, CircleCheckFilled, Monitor, Cellphone } from '@element-plus/icons-vue'
import { jobList as jobs, getQuestionTypes } from '@/data/questionBank'

const interviewStore = useInterviewStore()
const router = useRouter()

const selectedJob = ref(null)

const config = reactive({
  duration: '30',
  questionCount: 8,
  types: ['技术知识', '项目经历']
})

const availableTypes = computed(() => {
  if (!selectedJob.value) return ['技术知识', '项目经历', '场景题', '行为题']
  return getQuestionTypes(selectedJob.value)
})

const selectJob = (job) => {
  selectedJob.value = job.id
  interviewStore.setCurrentJob(job)
  config.types = getQuestionTypes(job.id)
}

const startInterview = () => {
  if (!selectedJob.value) {
    ElMessage.warning('请先选择面试岗位')
    return
  }
  localStorage.setItem('interviewDuration', config.duration)
  interviewStore.setConfig({ ...config })
  interviewStore.startInterview()
  router.push('/interview')
}
</script>

<style scoped>
.job-select-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.section-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon { color: #409eff; }

.job-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  margin-bottom: 16px;
}

.job-card:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.job-card.is-active {
  border-color: #409eff;
  background-color: #ecf5ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.job-icon { margin-right: 16px; flex-shrink: 0; }
.job-content { flex: 1; }
.job-name { margin: 0 0 6px 0; font-size: 16px; font-weight: 600; color: #303133; }
.job-desc { margin: 0 0 8px 0; color: #666; font-size: 14px; }

.job-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.job-tags .el-tag {
  font-size: 12px;
}

.job-check { margin-left: 16px; flex-shrink: 0; }

.config-form { max-width: 600px; margin: 0 auto; }
.submit-item { text-align: center; margin-top: 24px; }

.start-btn {
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

:deep(.el-card__header) {
  border-bottom: 1px solid #ebeef5;
  padding: 16px 24px;
  background-color: #fafafa;
}

:deep(.el-card__body) { padding: 24px; }

@media (max-width: 768px) {
  .job-select-container { padding: 16px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .config-form { max-width: 100%; }
}
</style>
