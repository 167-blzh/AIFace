<template>
  <div class="history-container">
    <el-card class="history-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">面试历史记录</h3>
          <div class="header-actions">
            <el-select v-model="filterJob" placeholder="筛选岗位" clearable size="small" style="width: 140px">
              <el-option label="Java后端开发" value="Java后端开发" />
              <el-option label="Web前端开发" value="Web前端开发" />
            </el-select>
            <el-tag type="info" size="small">
              共 {{ filteredHistory.length }} 条记录
            </el-tag>
          </div>
        </div>
      </template>

      <div class="empty-history" v-if="interviewStore.interviewHistory.length === 0">
        <el-empty :image-size="120" description="暂无面试历史记录">
          <el-button type="primary" size="large" @click="$router.push('/job-select')">
            开始首次面试
          </el-button>
        </el-empty>
      </div>

      <el-table
        v-else
        :data="filteredHistory"
        style="width: 100%"
        border
        stripe
        :header-cell-style="{ background: '#fafafa', fontWeight: '600' }"
      >
        <el-table-column prop="jobName" label="面试岗位" width="180">
          <template #default="{ row }">
            <span class="job-name">{{ row.jobName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="综合评分" width="100" align="center">
          <template #default="{ row }">
            <span class="score-text" :class="scoreClass(row.score)">{{ row.score }}</span>
          </template>
        </el-table-column>

        <el-table-column label="各维度" min-width="240">
          <template #default="{ row }">
            <div class="dim-bars" v-if="row.dimensions">
              <div v-for="(dim, key) in row.dimensions" :key="key" class="dim-bar">
                <span class="dim-label">{{ dimLabels[key] || key }}</span>
                <el-progress
                  :percentage="dim.score"
                  :stroke-width="10"
                  :color="dim.score >= 80 ? '#67c23a' : dim.score >= 60 ? '#e6a23c' : '#f56c6c'"
                  :show-text="false"
                  style="flex:1"
                />
                <span class="dim-score">{{ dim.score }}</span>
              </div>
            </div>
            <span v-else class="no-dim">—</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="时间" width="180">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" plain @click="viewReport(row)">查看</el-button>
            <el-popconfirm title="确定删除这条记录？" @confirm="deleteRecord($index)">
              <template #reference>
                <el-button type="danger" size="small" plain>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const interviewStore = useInterviewStore()
const router = useRouter()
const filterJob = ref('')

const dimLabels = {
  technicalDepth: '技术',
  logicExpression: '逻辑',
  communicationSkill: '沟通',
  jobFit: '匹配'
}

const filteredHistory = computed(() => {
  if (!filterJob.value) return interviewStore.interviewHistory
  return interviewStore.interviewHistory.filter((h) => h.jobName === filterJob.value)
})

const scoreClass = (score) => ({
  'score-good': score >= 85,
  'score-mid': score >= 70 && score < 85,
  'score-low': score < 70
})

const viewReport = (row) => {
  interviewStore.currentReport = row
  router.push('/report')
}

const deleteRecord = (index) => {
  interviewStore.deleteHistory(index)
  ElMessage.success('已删除')
}
</script>

<style scoped>
.history-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.history-card {
  border-radius: 12px;
  border: none;
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.empty-history { padding: 60px 0; }

.job-name { font-weight: 500; color: #303133; }

.score-text { font-size: 20px; font-weight: 700; }
.score-good { color: #67c23a; }
.score-mid { color: #e6a23c; }
.score-low { color: #f56c6c; }

.dim-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dim-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dim-label {
  font-size: 12px;
  color: #909399;
  width: 28px;
  flex-shrink: 0;
}

.dim-score {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  width: 24px;
  text-align: right;
}

.no-dim { color: #c0c4cc; }

.time-text { font-size: 13px; color: #909399; }

:deep(.el-card__header) {
  padding: 14px 20px;
  background: #fafafa;
}

@media (max-width: 768px) {
  .history-container { padding: 16px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>
