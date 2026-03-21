<template>
  <div class="home-container">
    <el-row :gutter="24" class="main-row">
      <!-- 左侧内容区 -->
      <el-col :lg="16" :md="14" :sm="24" :xs="24">
        <!-- AI模拟面试卡片 -->
        <el-card class="feature-card" shadow="never">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon class="card-icon">
                  <Avatar />
                </el-icon>
                AI模拟面试
              </h3>
              <el-tag type="success" effect="plain">推荐</el-tag>
            </div>
          </template>

          <div class="interview-section">
            <p class="desc">选择目标岗位，开始沉浸式模拟面试，获取专业能力评估与提升建议</p>
            <el-button
              type="primary"
              size="large"
              class="start-btn"
              @click="$router.push('/job-select')"
            >
              <el-icon><VideoPlay /></el-icon>
              开始面试
            </el-button>
          </div>
        </el-card>

        <!-- 最近面试记录 -->
        <el-card class="history-card mt-24" shadow="never">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon class="card-icon">
                  <Document />
                </el-icon>
                最近面试记录
              </h3>
              <el-link type="primary" href="/history" :underline="false">
                查看全部
              </el-link>
            </div>
          </template>

          <div class="table-container">
            <el-table
              :data="interviewStore.interviewHistory.slice(0, 5)"
              style="width: 100%"
              border
              stripe
              empty-text="暂无面试记录"
              :header-cell-style="{ background: '#fafafa', fontWeight: '600' }"
            >
              <el-table-column prop="jobName" label="岗位名称" width="140" show-overflow-tooltip />
              <el-table-column label="综合得分" width="120">
                <template #default="scope">
                  <el-rate
                    :model-value="scope.row.score / 20"
                    disabled
                    size="small"
                    allow-half
                    show-score
                    score-template="{value}"
                    text-color="#ff9900"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="面试时间" width="160" />
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="viewReport(scope.row)"
                  >
                    查看报告
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧能力成长区 -->
      <el-col :lg="8" :md="10" :sm="24" :xs="24">
        <el-card class="chart-card h-full" shadow="never">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon class="card-icon">
                  <TrendCharts />
                </el-icon>
                能力成长曲线
              </h3>
              <el-tag type="info" size="small">
                {{ interviewStore.interviewHistory.length }} 次面试
              </el-tag>
            </div>
          </template>

          <div class="chart-container">
            <InterviewChart class="h-full" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useInterviewStore } from '@/stores/interview'
import InterviewChart from '@/views/Home/InterviewChart.vue'
import { useRouter } from 'vue-router'
import {
  Avatar,
  VideoPlay,
  Document,
  TrendCharts
} from '@element-plus/icons-vue'

const interviewStore = useInterviewStore()
const router = useRouter()

const viewReport = (row) => {
  interviewStore.currentReport = row
  router.push('/report')
}
</script>

<style scoped>
.home-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.main-row {
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card, .history-card, .chart-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.feature-card:hover,
.history-card:hover,
.chart-card:hover {
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
  font-size: 20px;
}

.interview-section {
  text-align: center;
  padding: 24px 0;
}

.desc {
  margin: 16px auto 24px;
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  max-width: 500px;
}

.start-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.table-container {
  padding-top: 8px;
}

.mt-24 {
  margin-top: 24px;
}

.h-full {
  height: 100%;
}

.chart-container {
  height: calc(100% - 60px);
  padding: 10px 0;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #ebeef5;
  padding: 16px 20px;
  background-color: #fafafa;
  border-radius: 16px 16px 0 0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table .el-table__row):hover > td {
  background-color: #f8f9ff;
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .interview-section {
    padding: 16px 0;
  }

  .desc {
    font-size: 14px;
    margin: 12px auto 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-title {
    font-size: 16px;
  }

  .start-btn {
    width: 100%;
    padding: 12px 20px;
  }

  .el-col {
    margin-bottom: 24px;
  }

  .el-col:last-child {
    margin-bottom: 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .el-col {
    margin-bottom: 24px;
  }

  .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>
