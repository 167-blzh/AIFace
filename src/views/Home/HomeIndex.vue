<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h2 class="banner-title">AI 智能模拟面试</h2>
        <p class="banner-desc">选择目标岗位，开启沉浸式 AI 面试体验，获取多维能力评估与个性化提升建议</p>
        <el-button type="primary" size="large" round class="banner-btn" @click="$router.push('/job-select')">
          <el-icon><VideoPlay /></el-icon>
          开始面试
        </el-button>
      </div>
      <div class="banner-illustration">
        <div class="float-card c1">技术深度</div>
        <div class="float-card c2">逻辑表达</div>
        <div class="float-card c3">沟通能力</div>
        <div class="float-card c4">岗位匹配</div>
      </div>
    </div>

    <!-- 数据统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6" :xs="12">
        <div class="stat-item">
          <div class="stat-num">{{ interviewStore.interviewHistory.length }}</div>
          <div class="stat-label">面试次数</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="stat-item">
          <div class="stat-num">{{ avgScore }}</div>
          <div class="stat-label">平均分</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="stat-item">
          <div class="stat-num">{{ bestScore }}</div>
          <div class="stat-label">最高分</div>
        </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="stat-item">
          <div class="stat-num">{{ jobCount }}</div>
          <div class="stat-label">覆盖岗位</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 最近面试 -->
      <el-col :lg="14" :md="24">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="sec-header">
              <span class="sec-title">最近面试</span>
              <el-button text type="primary" @click="$router.push('/history')">查看全部</el-button>
            </div>
          </template>
          <el-table
            :data="interviewStore.interviewHistory.slice(0, 5)"
            style="width: 100%"
            empty-text="暂无面试记录，快去开始第一次面试吧"
            :header-cell-style="{ background: '#fafafa', fontWeight: 600 }"
          >
            <el-table-column prop="jobName" label="岗位" width="140" />
            <el-table-column label="评分" width="80" align="center">
              <template #default="{ row }">
                <span class="table-score" :class="{ good: row.score >= 80, mid: row.score >= 60 && row.score < 80, low: row.score < 60 }">
                  {{ row.score }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" />
            <el-table-column label="" width="90" align="center">
              <template #default="{ row }">
                <el-button type="primary" size="small" text @click="viewReport(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 能力曲线 -->
      <el-col :lg="10" :md="24">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="sec-header">
              <span class="sec-title">能力成长曲线</span>
              <el-tag size="small" type="info">{{ interviewStore.interviewHistory.length }} 次</el-tag>
            </div>
          </template>
          <div class="chart-wrap">
            <InterviewChart />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="16" class="quick-row">
      <el-col :span="8" :xs="24">
        <div class="quick-card" @click="$router.push('/job-select')">
          <div class="quick-icon" style="background:#ecf5ff;color:#409eff">
            <el-icon :size="28"><EditPen /></el-icon>
          </div>
          <div class="quick-text">
            <h4>模拟面试</h4>
            <p>AI 多轮对话面试</p>
          </div>
        </div>
      </el-col>
      <el-col :span="8" :xs="24">
        <div class="quick-card" @click="$router.push('/learn')">
          <div class="quick-icon" style="background:#f0f9eb;color:#67c23a">
            <el-icon :size="28"><Reading /></el-icon>
          </div>
          <div class="quick-text">
            <h4>学习推荐</h4>
            <p>个性化知识提升</p>
          </div>
        </div>
      </el-col>
      <el-col :span="8" :xs="24">
        <div class="quick-card" @click="$router.push('/history')">
          <div class="quick-icon" style="background:#fdf6ec;color:#e6a23c">
            <el-icon :size="28"><DataAnalysis /></el-icon>
          </div>
          <div class="quick-text">
            <h4>面试历史</h4>
            <p>回顾与数据分析</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import InterviewChart from '@/views/Home/InterviewChart.vue'
import { useRouter } from 'vue-router'
import { VideoPlay, EditPen, Reading, DataAnalysis } from '@element-plus/icons-vue'

const interviewStore = useInterviewStore()
const router = useRouter()

const avgScore = computed(() => {
  const h = interviewStore.interviewHistory
  if (!h.length) return '--'
  return Math.round(h.reduce((s, r) => s + (r.score || 0), 0) / h.length)
})

const bestScore = computed(() => {
  const h = interviewStore.interviewHistory
  if (!h.length) return '--'
  return Math.max(...h.map((r) => r.score || 0))
})

const jobCount = computed(() => {
  const jobs = new Set(interviewStore.interviewHistory.map((r) => r.jobName))
  return jobs.size || '--'
})

const viewReport = (row) => {
  interviewStore.currentReport = row
  router.push('/report')
}
</script>

<style scoped>
.home-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px 48px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.banner-title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.banner-desc {
  margin: 0 0 24px 0;
  font-size: 15px;
  opacity: 0.85;
  max-width: 420px;
  line-height: 1.6;
}

.banner-btn {
  font-size: 16px;
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

.banner-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.banner-illustration {
  position: relative;
  width: 200px;
  height: 140px;
  flex-shrink: 0;
}

.float-card {
  position: absolute;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: float 3s ease-in-out infinite;
}

.float-card.c1 { top: 0; left: 10px; animation-delay: 0s; }
.float-card.c2 { top: 10px; right: 0; animation-delay: 0.5s; }
.float-card.c3 { bottom: 10px; left: 0; animation-delay: 1s; }
.float-card.c4 { bottom: 0; right: 10px; animation-delay: 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* 统计行 */
.stats-row { margin-bottom: 20px; }

.stat-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
}

.stat-item:hover { transform: translateY(-2px); }

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* 卡片 */
.section-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 20px;
}

.sec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sec-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-wrap { height: 300px; }

.table-score {
  font-size: 16px;
  font-weight: 700;
}

.table-score.good { color: #67c23a; }
.table-score.mid { color: #e6a23c; }
.table-score.low { color: #f56c6c; }

/* 快捷入口 */
.quick-row { margin-top: 4px; }

.quick-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.25s;
  margin-bottom: 16px;
}

.quick-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.quick-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-text h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.quick-text p {
  margin: 3px 0 0 0;
  font-size: 13px;
  color: #909399;
}

:deep(.el-card__header) {
  padding: 14px 20px;
  background: #fafafa;
}

@media (max-width: 768px) {
  .home-container { padding: 16px; }
  .welcome-banner {
    flex-direction: column;
    padding: 28px 24px;
    text-align: center;
  }
  .banner-illustration { display: none; }
  .banner-title { font-size: 22px; }
}
</style>
