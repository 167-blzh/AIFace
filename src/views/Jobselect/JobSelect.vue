<template>
  <div class="job-select-container">
    <el-card class="job-card-container" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">
            <el-icon class="card-icon">
              <User />
            </el-icon>
            选择目标岗位
          </h3>
          <el-steps :active="0" finish-status="success" simple>
            <el-step title="选择岗位" />
            <el-step title="配置面试" />
            <el-step title="开始面试" />
          </el-steps>
        </div>
      </template>

      <el-radio-group v-model="selectedJob" @change="handleJobChange" class="radio-group">
        <el-row :gutter="24" class="job-grid">
          <el-col
            :lg="8"
            :md="12"
            :sm="24"
            :xs="24"
            v-for="job in jobList"
            :key="job.id"
          >
            <el-radio :label="job.id" class="job-card-wrapper">
              <div
                class="job-card"
                :class="{ 'is-active': selectedJob === job.id }"
              >
                <div class="job-icon">
                  <el-icon :size="32" :color="getJobIconColor(job.id)">
                    <component :is="getJobIcon(job.id)" />
                  </el-icon>
                </div>
                <div class="job-content">
                  <h4 class="job-name">{{ job.name }}</h4>
                  <p class="job-desc">{{ job.desc }}</p>
                </div>
                <div class="job-checkmark">
                  <el-icon v-if="selectedJob === job.id">
                    <CircleCheckFilled />
                  </el-icon>
                </div>
              </div>
            </el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
    </el-card>

    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">
            <el-icon class="card-icon">
              <Setting />
            </el-icon>
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

        <el-form-item label="题型偏好">
          <el-checkbox-group v-model="config.types">
            <el-checkbox label="技术知识点" />
            <el-checkbox label="项目经历" />
            <el-checkbox label="场景题" />
            <el-checkbox label="行为题" />
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
import { ref, reactive } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import {
  User,
  Setting,
  VideoPlay,
  CircleCheckFilled,
  Coin ,
  Monitor,
  DataAnalysis
} from '@element-plus/icons-vue'

const interviewStore = useInterviewStore()
const router = useRouter()

const jobList = ref([
  { id: 'backend', name: 'Java后端开发', desc: 'Spring Boot、微服务、数据库等' },
  { id: 'frontend', name: 'Web前端开发', desc: 'Vue3、React、工程化等' },
  { id: 'algorithm', name: 'Python算法工程师', desc: '数据结构、算法、机器学习等' },
])

const selectedJob = ref(null)
const config = reactive({
  duration: '30',
  types: ['技术知识点', '项目经历']
})

const handleJobChange = (jobId) => {
  const job = jobList.value.find((j) => j.id === jobId)
  interviewStore.setCurrentJob(job)
}

const startInterview = () => {
  localStorage.setItem('interviewDuration', config.duration)
  interviewStore.startInterview()
  router.push('/interview')
}

// 获取岗位对应的图标
const getJobIcon = (jobId) => {
  switch(jobId) {
    case 'backend':
      return Coin
    case 'frontend':
      return Monitor
    case 'algorithm':
      return DataAnalysis
    default:
      return Coin
  }
}

// 获取岗位图标颜色
const getJobIconColor = (jobId) => {
  switch(jobId) {
    case 'backend':
      return '#409eff'
    case 'frontend':
      return '#67c23a'
    case 'algorithm':
      return '#e6a23c'
    default:
      return '#409eff'
  }
}
</script>

<style scoped>
.job-select-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.job-card-container, .config-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.job-card-container:hover, .config-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
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

.card-icon {
  color: #409eff;
}

.radio-group {
  width: 100%;
}

.job-grid {
  margin-top: 16px;
}

.job-card-wrapper {
  width: 100%;
  display: block;
}

.job-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  height: 100%;
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

.job-icon {
  margin-right: 16px;
  flex-shrink: 0;
}

.job-content {
  flex: 1;
}

.job-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.job-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.job-checkmark {
  margin-left: 16px;
  flex-shrink: 0;
}

.job-checkmark .el-icon {
  color: #67c23a;
  font-size: 20px;
}

.config-form {
  max-width: 600px;
  margin: 0 auto;
}

.submit-item {
  text-align: center;
  margin-top: 24px;
}

.start-btn {
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
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

:deep(.el-radio__input) {
  display: none;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-checkbox) {
  margin-right: 24px;
}

@media (max-width: 768px) {
  .job-select-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-title {
    font-size: 16px;
  }

  .job-card {
    flex-direction: column;
    text-align: center;
  }

  .job-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .job-checkmark {
    margin-left: 0;
    margin-top: 12px;
  }

  .config-form {
    max-width: 100%;
  }

  .submit-item {
    margin-top: 16px;
  }
}
</style>
