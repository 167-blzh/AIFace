<template>
  <div class="report-container">
    <!-- 无报告提示 -->
    <div class="empty-report" v-if="!interviewStore.currentReport">
      <el-empty
        :image-size="120"
        description="暂无面试报告，请先完成模拟面试"
      >
        <el-button type="primary" size="large" @click="$router.push('/job-select')">
          <el-icon><VideoPlay /></el-icon>
          开始面试
        </el-button>
      </el-empty>
    </div>

    <!-- 报告内容 -->
    <div v-else>
      <el-card class="report-card" shadow="never">
        <template #header>
          <div class="report-header">
            <h3 class="report-title">
              <el-icon class="report-icon">
                <DocumentChecked />
              </el-icon>
              面试评估报告
            </h3>
            <el-tag type="success" size="large">
              {{ interviewStore.currentReport.score }}分
            </el-tag>
          </div>
        </template>

        <!-- 报告概览 -->
        <div class="report-overview">
          <div class="overview-grid">
            <div class="overview-item">
              <div class="item-icon">
                <el-icon><Briefcase /></el-icon>
              </div>
              <div class="item-content">
                <h4>应聘岗位</h4>
                <p>{{ interviewStore.currentReport.jobName }}</p>
              </div>
            </div>

            <div class="overview-item">
              <div class="item-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="item-content">
                <h4>面试时长</h4>
                <p>{{ interviewStore.currentReport.duration }}分钟</p>
              </div>
            </div>

            <div class="overview-item">
              <div class="item-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="item-content">
                <h4>面试时间</h4>
                <p>{{ interviewStore.currentReport.createTime }}</p>
              </div>
            </div>

            <div class="overview-item">
              <div class="item-icon">
                <el-icon><Star /></el-icon>
              </div>
              <div class="item-content">
                <h4>综合评分</h4>
                <div class="rating-wrapper">
                  <el-rate
                    v-model="score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}分"
                    :colors="['#F56C6C', '#E6A23C', '#67C23A']"
                  />
                  <span class="score-level">{{ getScoreDesc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI评语 -->
        <div class="ai-comment">
          <h4 class="section-title">
            <el-icon><Lightning /></el-icon>
            AI 评估评语
          </h4>
          <div class="comment-content">
            <p>{{ interviewStore.currentReport.comment }}</p>
          </div>
        </div>

        <!-- 问答详情 -->
        <div class="qa-details">
          <h4 class="section-title">
            <el-icon><ChatLineRound /></el-icon>
            问答详情
          </h4>
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item, index) in interviewStore.currentReport.questions"
              :key="index"
              :title="`第${index + 1}题：${item.content.substring(0, 40)}${item.content.length > 40 ? '...' : ''}`"
              :name="index"
            >
              <div class="qa-item">
                <div class="question-section">
                  <div class="question-header">
                    <span class="question-label">问题</span>
                    <el-tag :type="getQuestionTypeTag(item.type)" size="small">
                      {{ item.type }}
                    </el-tag>
                  </div>
                  <div class="question-content">
                    {{ item.content }}
                  </div>
                </div>

                <div class="answer-section">
                  <div class="answer-header">
                    <span class="answer-label">你的回答</span>
                    <el-tag type="success" size="small">
                      {{ item.answer ? '已回答' : '未作答' }}
                    </el-tag>
                  </div>
                  <div class="answer-content">
                    {{ item.answer || '该问题暂无回答' }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 操作按钮 -->
        <div class="report-actions">
          <el-button @click="$router.push('/history')" size="large">
            <el-icon><Document /></el-icon>
            查看历史报告
          </el-button>
          <el-button type="primary" @click="$router.push('/job-select')" size="large">
            <el-icon><VideoPlay /></el-icon>
            再次面试
          </el-button>
          <el-button type="success" @click="exportReport" size="large">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import {
  Document,
  VideoPlay,
  DocumentChecked,
  Briefcase,
  Timer,
  Calendar,
  Star,
  Lightning,
  ChatLineRound,
  Download
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const interviewStore = useInterviewStore()

// 评分（转换为星级，100分=5星）
const score = computed(() => interviewStore.currentReport?.score / 20 || 0)

// 评分等级描述
const getScoreDesc = computed(() => {
  const s = interviewStore.currentReport?.score || 0
  if (s >= 95) return '优秀'
  if (s >= 90) return '良好'
  if (s >= 85) return '中等'
  return '需提升'
})

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

// 导出报告（模拟）
const exportReport = () => {
  ElMessage.success('报告导出成功！（实际项目可对接PDF导出库）')
  // 实际项目可使用 html2pdf/jspdf 等库实现真实导出
}
</script>

<style scoped>
.report-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.report-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.report-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
}

.report-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-icon {
  color: #409eff;
}

.empty-report {
  padding: 60px 0;
}

.report-overview {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #eef2f6 100%);
  border-radius: 12px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.overview-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.overview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf5ff;
  border-radius: 50%;
  color: #409eff;
  font-size: 20px;
}

.item-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.item-content p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.rating-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.score-level {
  font-weight: 600;
  color: #67c23a;
  font-size: 14px;
}

.ai-comment {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-radius: 12px;
  border-left: 4px solid #409eff;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-content {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.comment-content p {
  margin: 0;
  line-height: 1.7;
  color: #606266;
  font-size: 15px;
}

.qa-details {
  margin-bottom: 24px;
}

.qa-item {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.question-section, .answer-section {
  margin-bottom: 16px;
}

.question-section:last-child, .answer-section:last-child {
  margin-bottom: 0;
}

.question-header, .answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-label, .answer-label {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.question-content, .answer-content {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}

.report-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.report-actions .el-button {
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

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

:deep(.el-rate__icon) {
  margin-right: 2px;
}

@media (max-width: 768px) {
  .report-container {
    padding: 16px;
  }

  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .report-actions {
    flex-direction: column;
  }

  .report-actions .el-button {
    width: 100%;
  }

  .qa-item {
    padding: 12px;
  }
}
</style>
