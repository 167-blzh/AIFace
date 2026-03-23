<template>
  <div class="learn-container">
    <el-card shadow="never" class="section-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">📚 个性化学习推荐</span>
          <el-select v-model="selectedJob" placeholder="选择岗位" size="small" style="width: 160px" @change="loadRecommendations">
            <el-option label="Java后端开发" value="backend" />
            <el-option label="Web前端开发" value="frontend" />
          </el-select>
        </div>
      </template>

      <!-- 薄弱项推荐 -->
      <div v-if="recommendations.length" class="reco-section">
        <h4 class="sub-title">🎯 针对你的薄弱项</h4>
        <el-row :gutter="16">
          <el-col :lg="8" :md="12" :sm="24" v-for="(rec, i) in recommendations" :key="i">
            <el-card shadow="hover" class="reco-card">
              <div class="reco-header">
                <el-tag size="small" type="warning">{{ rec.category }}</el-tag>
                <span class="reco-topic">{{ rec.topic }}</span>
              </div>
              <p class="reco-reason">{{ rec.reason }}</p>
              <div class="reco-points" v-if="rec.keyPoints?.length">
                <div class="point-title">核心知识点：</div>
                <ul>
                  <li v-for="(p, j) in rec.keyPoints.slice(0, 3)" :key="j">{{ p }}</li>
                </ul>
              </div>
              <div class="reco-links" v-if="rec.resources?.length">
                <el-button
                  v-for="(r, j) in rec.resources"
                  :key="j"
                  size="small"
                  text
                  type="primary"
                  @click="openLink(r.url)"
                >
                  📖 {{ r.title }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-divider v-if="recommendations.length" />

      <!-- 全部知识库 -->
      <div class="all-section">
        <h4 class="sub-title">📖 知识库浏览</h4>
        <el-collapse>
          <el-collapse-item
            v-for="(cat, i) in allResources"
            :key="i"
            :title="`${cat.icon} ${cat.name}`"
            :name="i"
          >
            <div v-for="topic in cat.topics" :key="topic.id" class="topic-card">
              <div class="topic-header">
                <span class="topic-name">{{ topic.name }}</span>
                <div class="topic-tags">
                  <el-tag v-for="kw in topic.keywords.slice(0, 4)" :key="kw" size="small" effect="plain">
                    {{ kw }}
                  </el-tag>
                </div>
              </div>
              <p class="topic-summary">{{ topic.summary }}</p>
              <el-collapse>
                <el-collapse-item title="查看参考答案" :name="topic.id">
                  <div class="example-answer">{{ topic.exampleAnswer }}</div>
                </el-collapse-item>
              </el-collapse>
              <div class="topic-resources" v-if="topic.resources?.length">
                <el-button
                  v-for="r in topic.resources"
                  :key="r.url"
                  size="small"
                  text
                  type="primary"
                  @click="openLink(r.url)"
                >
                  🔗 {{ r.title }}
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { getRecommendations, getAllResources } from '@/data/knowledgeBase'

const interviewStore = useInterviewStore()
const selectedJob = ref(interviewStore.currentReport?.jobId || 'backend')
const recommendations = ref([])
const allResources = ref([])

const loadRecommendations = () => {
  const latestReport = interviewStore.currentReport ||
    interviewStore.interviewHistory.find((h) => h.jobId === selectedJob.value)

  recommendations.value = getRecommendations(selectedJob.value, latestReport)
  allResources.value = getAllResources(selectedJob.value)
}

const openLink = (url) => {
  window.open(url, '_blank')
}

onMounted(loadRecommendations)
</script>

<style scoped>
.learn-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.section-card {
  border-radius: 12px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.reco-card {
  border-radius: 10px;
  margin-bottom: 16px;
  border: none;
}

.reco-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reco-topic {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.reco-reason {
  font-size: 13px;
  color: #909399;
  margin: 0 0 10px 0;
}

.reco-points {
  font-size: 13px;
  color: #606266;
}

.reco-points .point-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.reco-points ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}

.reco-links {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.topic-card {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.topic-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.topic-summary {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin: 0 0 10px 0;
}

.example-answer {
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
}

.topic-resources {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

:deep(.el-card__header) {
  padding: 14px 20px;
  background: #fafafa;
}

@media (max-width: 768px) {
  .learn-container { padding: 16px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>
