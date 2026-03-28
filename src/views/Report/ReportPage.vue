<template>
  <div class="report-container">
    <div class="empty-report" v-if="!report">
      <el-empty :image-size="120" description="暂无面试报告，请先完成模拟面试">
        <el-button type="primary" size="large" @click="$router.push('/job-select')">
          <el-icon><VideoPlay /></el-icon>
          开始面试
        </el-button>
      </el-empty>
    </div>

    <div v-else>
      <!-- 概览卡片 -->
      <el-row :gutter="16" class="overview-row">
        <el-col :span="6" :xs="12">
          <el-card shadow="never" class="stat-card">
            <div class="stat-score" :style="{ color: scoreColor }">{{ report.score }}</div>
            <div class="stat-label">综合评分</div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="12">
          <el-card shadow="never" class="stat-card">
            <div class="stat-value">{{ report.jobName }}</div>
            <div class="stat-label">面试岗位</div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="12">
          <el-card shadow="never" class="stat-card">
            <div class="stat-value">{{ report.duration }}分钟</div>
            <div class="stat-label">面试时长</div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="12">
          <el-card shadow="never" class="stat-card">
            <div class="stat-value">{{ report.questions?.length || 0 }}题</div>
            <div class="stat-label">回答题数</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 雷达图 -->
        <el-col :lg="10" :md="24">
          <el-card shadow="never" class="section-card">
            <template #header>
              <span class="section-title">能力雷达图</span>
            </template>
            <div ref="radarChartRef" class="radar-chart"></div>
          </el-card>
        </el-col>

        <!-- AI 评语 + 改进建议 -->
        <el-col :lg="14" :md="24">
          <el-card shadow="never" class="section-card">
            <template #header>
              <span class="section-title">AI 综合评价</span>
            </template>
            <div class="comment-box">
              <p>{{ report.comment }}</p>
            </div>
            <div class="improve-section" v-if="report.improvementPlan?.length">
              <h4>改进建议</h4>
              <ul class="improve-list">
                <li v-for="(item, i) in report.improvementPlan" :key="i">{{ item }}</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 各题详情 -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <span class="section-title">逐题分析</span>
        </template>
        <el-collapse accordion>
          <el-collapse-item
            v-for="(q, i) in report.questions"
            :key="i"
            :name="i"
          >
            <template #title>
              <div class="q-title-row">
                <el-tag size="small" :type="q.score >= 80 ? 'success' : q.score >= 60 ? 'warning' : 'danger'">
                  {{ q.score }}分
                </el-tag>
                <span class="q-title-text">{{ q.question?.substring(0, 50) }}{{ q.question?.length > 50 ? '...' : '' }}</span>
              </div>
            </template>
            <div class="q-detail">
              <div class="q-section">
                <div class="q-label">问题</div>
                <div class="q-content">{{ q.question }}</div>
              </div>
              <div class="q-section" v-if="q.answer">
                <div class="q-label">你的回答</div>
                <div class="q-content">{{ q.answer }}</div>
              </div>
              <el-row :gutter="12" v-if="q.highlights || q.weaknesses">
                <el-col :span="12">
                  <div class="q-feedback good" v-if="q.highlights">
                    <div class="fb-title">✅ 亮点</div>
                    <div class="fb-text">{{ q.highlights }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="q-feedback bad" v-if="q.weaknesses">
                    <div class="fb-title">⚠️ 不足</div>
                    <div class="fb-text">{{ q.weaknesses }}</div>
                  </div>
                </el-col>
              </el-row>
              <div class="q-suggestion" v-if="q.suggestion">
                <div class="fb-title">💡 改进建议</div>
                <div class="fb-text">{{ q.suggestion }}</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- 操作按钮 -->
      <div class="report-actions">
        <el-button @click="$router.push('/history')" size="large">查看历史</el-button>
        <el-button @click="$router.push('/learn')" type="success" size="large">学习推荐</el-button>
        <el-button type="primary" @click="$router.push('/job-select')" size="large">再次面试</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { VideoPlay } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const interviewStore = useInterviewStore()
const report = computed(() => interviewStore.currentReport)
const radarChartRef = ref(null)

const scoreColor = computed(() => {
  const s = report.value?.score || 0
  if (s >= 85) return '#67c23a'
  if (s >= 70) return '#e6a23c'
  return '#f56c6c'
})

const dimLabels = {
  technicalDepth: '技术深度',
  logicExpression: '逻辑表达',
  communicationSkill: '沟通能力',
  jobFit: '岗位匹配'
}

onMounted(async () => {
  await nextTick()
  if (!report.value?.dimensions || !radarChartRef.value) return

  const dims = report.value.dimensions
  const indicators = Object.keys(dims).map((k) => ({
    name: dimLabels[k] || k,
    max: 100
  }))
  const values = Object.values(dims).map((d) => d.score)

  const chart = echarts.init(radarChartRef.value)
  chart.setOption({
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#606266', fontSize: 13 }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: '能力评估',
            areaStyle: { color: 'rgba(64,158,255,0.2)' },
            lineStyle: { color: '#409eff', width: 2 },
            itemStyle: { color: '#409eff' }
          }
        ]
      }
    ]
  })

  window.addEventListener('resize', () => chart.resize())
})
</script>

<style scoped>
.report-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.overview-row { margin-bottom: 16px; }

.stat-card {
  text-align: center;
  border-radius: 12px;
  border: none;
  margin-bottom: 16px;
}

.stat-score {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.section-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.radar-chart {
  height: 320px;
  width: 100%;
}

.comment-box {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.comment-box p {
  margin: 0;
  line-height: 1.7;
  color: #606266;
}

.improve-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.improve-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  line-height: 2;
}

.q-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.q-title-text {
  font-size: 14px;
  color: #303133;
}

.q-detail {
  padding: 12px;
}

.q-section {
  margin-bottom: 12px;
}

.q-label {
  font-weight: 600;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.q-content {
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.7;
  color: #303133;
  white-space: pre-wrap;
}

.q-feedback {
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.q-feedback.good { background: #f0f9eb; }
.q-feedback.bad { background: #fef0f0; }

.fb-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
  color: #303133;
}

.fb-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.q-suggestion {
  margin-top: 10px;
  padding: 10px 12px;
  background: #fdf6ec;
  border-radius: 6px;
}

.report-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
}

.report-actions .el-button {
  min-width: 120px;
  border-radius: 8px;
}

.empty-report { padding: 60px 0; }

:deep(.el-card__header) {
  padding: 14px 20px;
  background: #fafafa;
}

:deep(.el-collapse) { border: none; }

:deep(.el-collapse-item__header) {
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 0 12px;
}

@media (max-width: 768px) {
  .report-container { padding: 16px; }
  .report-actions { flex-direction: column; }
  .report-actions .el-button { width: 100%; }
}
</style>
