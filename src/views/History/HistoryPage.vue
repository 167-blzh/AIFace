<template>
  <div class="history-container">
    <el-card class="history-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">面试历史记录</h3>
          <el-tag type="info" size="small" class="record-count">
            共 {{ interviewStore.interviewHistory.length }} 条记录
          </el-tag>
        </div>
      </template>

      <!-- 无历史记录提示 -->
      <div class="empty-history" v-if="interviewStore.interviewHistory.length === 0">
        <el-empty
          :image-size="120"
          description="暂无面试历史记录"
        >
          <el-button type="primary" size="large" @click="$router.push('/job-select')">
            开始首次面试
          </el-button>
        </el-empty>
      </div>

      <!-- 历史记录表格 -->
      <el-table
        v-else
        :data="interviewStore.interviewHistory"
        style="width: 100%"
        border
        stripe
        :header-cell-style="{ background: '#fafafa', fontWeight: '600' }"
        :cell-style="{ padding: '12px 0' }"
      >
        <el-table-column prop="jobName" label="应聘岗位" width="200">
          <template #default="scope">
            <span class="job-name">{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="综合得分" width="150">
          <template #default="scope">
            <div class="score-container">
              <el-rate
                :model-value="scope.row.score / 20"
                disabled
                size="small"
                show-score
                text-color="#ff9900"
                score-template="{value}分"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="duration" label="面试时长" width="130">
          <template #default="scope">
            <el-tag type="success" size="small">
              {{ scope.row.duration }} 分钟
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="面试时间" width="200">
          <template #default="scope">
            <div class="time-info">
              <el-icon><Clock /></el-icon>
              <span>{{ scope.row.createTime }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                type="primary"
                size="small"
                plain
                @click="viewReport(scope.row)"
              >
                <el-icon><Document /></el-icon>
                查看报告
              </el-button>
              <el-popconfirm
                title="确定要删除这条面试记录吗？删除后无法恢复！"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteRecord(scope.row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    plain
                  >
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { useInterviewStore } from '@/stores/interview'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Delete, Clock } from '@element-plus/icons-vue'

const interviewStore = useInterviewStore()
const router = useRouter()

// 查看报告
const viewReport = (row) => {
  interviewStore.currentReport = row
  router.push('/report')
}

// 删除记录
const deleteRecord = (row) => {
  // 过滤掉要删除的记录
  interviewStore.interviewHistory = interviewStore.interviewHistory.filter(
    item => item.createTime !== row.createTime
  )

  // 如果删除的是当前报告，清空当前报告
  if (interviewStore.currentReport?.createTime === row.createTime) {
    interviewStore.currentReport = null
  }

  ElMessage.success('面试记录删除成功！')
}
</script>

<style scoped>
.history-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.history-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.record-count {
  margin-top: 2px;
}

.empty-history {
  padding: 60px 0;
}

.score-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.job-name {
  font-weight: 500;
  color: #303133;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons .el-button {
  margin-right: 0 !important;
  height: 32px;
  font-size: 13px;
}

.el-table {
  border-radius: 8px;
}

.el-table :deep(.el-table__header) {
  th {
    background-color: #fafafa !important;
    color: #606266;
    font-weight: 600;
  }
}

.el-table :deep(.el-table__row) {
  &:hover > td {
    background-color: #f8f9ff;
  }
}

@media (max-width: 768px) {
  .history-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .el-table {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
