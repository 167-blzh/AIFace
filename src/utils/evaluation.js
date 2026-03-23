/**
 * 多维评估引擎 - 本地评估（不依赖 AI API 的备用方案）
 * 用于 AI API 不可用时的本地评分
 */

import { matchTopics } from '@/data/knowledgeBase'

/**
 * 本地评估单个回答
 * @param {string} answer - 用户回答
 * @param {object} question - 题目对象（含 keywords）
 * @param {string} jobId - 岗位ID
 * @returns {object} 单题评估结果
 */
export function evaluateAnswer(answer, question, jobId) {
  if (!answer || answer.trim().length === 0) {
    return {
      score: 0,
      highlights: '未作答',
      weaknesses: '未回答该问题',
      suggestion: '建议认真准备并回答每个问题'
    }
  }

  const scores = {
    contentScore: evaluateContent(answer, question),
    expressionScore: evaluateExpression(answer),
    structureScore: evaluateStructure(answer),
    relevanceScore: evaluateRelevance(answer, question, jobId)
  }

  const totalScore = Math.round(
    scores.contentScore * 0.4 +
      scores.expressionScore * 0.2 +
      scores.structureScore * 0.15 +
      scores.relevanceScore * 0.25
  )

  return {
    score: totalScore,
    details: scores,
    highlights: generateHighlights(answer, question, scores),
    weaknesses: generateWeaknesses(answer, question, scores),
    suggestion: generateSuggestion(scores, question),
    keywords: question.keywords || []
  }
}

/**
 * 内容评估 - 关键词命中率和答案深度
 */
function evaluateContent(answer, question) {
  const keywords = question.keywords || []
  if (keywords.length === 0) return 70

  const lowerAnswer = answer.toLowerCase()
  let hitCount = 0

  for (const kw of keywords) {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      hitCount++
    }
  }

  const hitRate = hitCount / keywords.length

  // 基础分 40 + 命中率加成 40 + 长度加成 20
  let score = 40
  score += hitRate * 40

  // 答案长度加成（50字以上开始加分，200字以上满分）
  const length = answer.length
  if (length > 200) score += 20
  else if (length > 100) score += 15
  else if (length > 50) score += 10
  else score += 5

  return Math.min(100, Math.round(score))
}

/**
 * 表达评估 - 语速、清晰度、自信度（基于文本分析）
 */
function evaluateExpression(answer) {
  let score = 60

  // 长度适中加分
  if (answer.length >= 50 && answer.length <= 500) score += 10
  else if (answer.length > 500) score += 5

  // 使用逻辑连接词加分
  const logicWords = ['首先', '其次', '然后', '最后', '因为', '所以', '一方面', '另一方面', '总的来说', '具体来说', '比如', '例如']
  const logicCount = logicWords.filter((w) => answer.includes(w)).length
  score += Math.min(15, logicCount * 5)

  // 使用专业术语密度
  const sentenceCount = answer.split(/[。！？.!?]/).filter(Boolean).length
  if (sentenceCount >= 3) score += 10
  else if (sentenceCount >= 2) score += 5

  // 避免口语化表达
  const casualWords = ['就是', '那个', '嗯', '啊', '这个嘛', '大概']
  const casualCount = casualWords.filter((w) => answer.includes(w)).length
  score -= casualCount * 3

  return Math.max(30, Math.min(100, score))
}

/**
 * 结构评估 - 回答是否有条理
 */
function evaluateStructure(answer) {
  let score = 50

  // 使用分点表述（1. 2. 3. 或 第一 第二 第三）
  const hasNumbering = /[1-9][.、]|第[一二三四五六七八九十]|[①②③④⑤]/.test(answer)
  if (hasNumbering) score += 25

  // 有段落分割
  const paragraphs = answer.split(/\n/).filter((p) => p.trim().length > 0).length
  if (paragraphs >= 3) score += 15
  else if (paragraphs >= 2) score += 10

  // 有总结性语句
  const hasSummary = /总之|综上|总的来说|总结|综合来看/.test(answer)
  if (hasSummary) score += 10

  return Math.min(100, score)
}

/**
 * 岗位匹配度评估
 */
function evaluateRelevance(answer, question, jobId) {
  // 通过知识库匹配度来评估
  const answerWords = answer.split(/[\s,，。.!！?？；;：:、]+/).filter((w) => w.length > 1)
  const matched = matchTopics(jobId, answerWords)

  let score = 50

  // 如果匹配到相关知识点，加分
  if (matched.length > 0) {
    score += Math.min(30, matched.length * 10)
  }

  // 问题关键词命中
  const keywords = question.keywords || []
  const lowerAnswer = answer.toLowerCase()
  const hitRate = keywords.filter((k) => lowerAnswer.includes(k.toLowerCase())).length / Math.max(1, keywords.length)
  score += hitRate * 20

  return Math.min(100, Math.round(score))
}

/**
 * 生成亮点分析
 */
function generateHighlights(answer, question, scores) {
  const highlights = []

  if (scores.contentScore >= 80) highlights.push('对核心知识点掌握扎实')
  if (scores.expressionScore >= 80) highlights.push('表达清晰，逻辑性强')
  if (scores.structureScore >= 80) highlights.push('回答有条理，结构清晰')
  if (scores.relevanceScore >= 80) highlights.push('与岗位要求高度匹配')

  if (answer.length > 200) highlights.push('回答较为详细全面')

  const keywords = question.keywords || []
  const hitCount = keywords.filter((k) => answer.toLowerCase().includes(k.toLowerCase())).length
  if (hitCount >= keywords.length * 0.7) highlights.push('覆盖了大部分关键知识点')

  return highlights.length > 0 ? highlights.join('；') : '回答基本完整'
}

/**
 * 生成不足分析
 */
function generateWeaknesses(answer, question, scores) {
  const weaknesses = []

  if (scores.contentScore < 60) weaknesses.push('关键知识点覆盖不足')
  if (scores.expressionScore < 60) weaknesses.push('表达不够清晰，建议使用逻辑连接词')
  if (scores.structureScore < 60) weaknesses.push('回答缺乏条理，建议分点阐述')
  if (scores.relevanceScore < 60) weaknesses.push('回答与岗位要求匹配度不高')

  if (answer.length < 50) weaknesses.push('回答过于简短，缺少细节和案例')

  const keywords = question.keywords || []
  const missed = keywords.filter((k) => !answer.toLowerCase().includes(k.toLowerCase()))
  if (missed.length > 0) {
    weaknesses.push(`未提及关键概念：${missed.slice(0, 3).join('、')}`)
  }

  return weaknesses.length > 0 ? weaknesses.join('；') : '整体表现不错，可以进一步深入'
}

/**
 * 生成改进建议
 */
function generateSuggestion(scores, question) {
  const suggestions = []

  if (scores.contentScore < 70) {
    suggestions.push('建议深入学习相关知识点，理解底层原理而非仅记忆概念')
  }
  if (scores.expressionScore < 70) {
    suggestions.push('建议使用"首先...其次...最后..."的结构化表达方式')
  }
  if (scores.structureScore < 70) {
    suggestions.push('建议采用分点回答，先总述再分点展开')
  }
  if (scores.relevanceScore < 70) {
    suggestions.push('建议结合实际项目经验来回答，体现实战能力')
  }

  return suggestions.length > 0 ? suggestions.join('。') : '保持当前水平，可以尝试更深入的技术探讨'
}

/**
 * 综合评估整场面试（本地版）
 * @param {object[]} qaList - 问答列表 [{question, answer}]
 * @param {string} jobId - 岗位ID
 * @returns {object} 完整评估报告
 */
export function evaluateInterviewLocal(qaList, jobId) {
  const questionResults = qaList.map(({ question, answer }) =>
    evaluateAnswer(answer, question, jobId)
  )

  const avgScore = Math.round(
    questionResults.reduce((sum, r) => sum + r.score, 0) / Math.max(1, questionResults.length)
  )

  // 计算各维度平均分
  const dimensions = {
    technicalDepth: {
      score: Math.round(questionResults.reduce((s, r) => s + (r.details?.contentScore || 70), 0) / questionResults.length),
      comment: ''
    },
    logicExpression: {
      score: Math.round(questionResults.reduce((s, r) => s + (r.details?.expressionScore || 70), 0) / questionResults.length),
      comment: ''
    },
    communicationSkill: {
      score: Math.round(questionResults.reduce((s, r) => s + (r.details?.structureScore || 70), 0) / questionResults.length),
      comment: ''
    },
    jobFit: {
      score: Math.round(questionResults.reduce((s, r) => s + (r.details?.relevanceScore || 70), 0) / questionResults.length),
      comment: ''
    }
  }

  // 生成各维度评语
  dimensions.technicalDepth.comment = dimensions.technicalDepth.score >= 80
    ? '对技术原理有较深入的理解，能够清楚解释核心概念'
    : '技术深度有待加强，建议深入学习底层原理'
  dimensions.logicExpression.comment = dimensions.logicExpression.score >= 80
    ? '表达逻辑清晰，使用了恰当的逻辑连接词'
    : '表达需要更有条理，建议使用结构化的回答方式'
  dimensions.communicationSkill.comment = dimensions.communicationSkill.score >= 80
    ? '沟通能力良好，回答结构清晰'
    : '建议练习分点回答，提高沟通效率'
  dimensions.jobFit.comment = dimensions.jobFit.score >= 80
    ? '与岗位要求匹配度较高'
    : '建议针对岗位要求加强相关技术的学习'

  let overallComment = ''
  if (avgScore >= 90) overallComment = '表现优秀！对技术知识掌握全面深入，表达清晰有条理，是一位非常有竞争力的候选人。'
  else if (avgScore >= 80) overallComment = '表现良好，核心概念理解到位，建议在部分薄弱领域进一步深入。继续保持，很有潜力！'
  else if (avgScore >= 70) overallComment = '表现中等，对基本概念有一定了解，但深度和广度都需要加强。建议系统性地复习相关知识点。'
  else if (avgScore >= 60) overallComment = '表现一般，部分知识点掌握不够准确。建议制定学习计划，重点突破核心技术。'
  else overallComment = '基础较为薄弱，建议从基础开始系统学习，多做练习和项目实践。'

  return {
    overallScore: avgScore,
    dimensions,
    questions: qaList.map((qa, i) => ({
      question: qa.question.content || qa.question,
      ...questionResults[i]
    })),
    overallComment,
    improvementPlan: generateImprovementPlan(questionResults, dimensions)
  }
}

/**
 * 生成改进计划
 */
function generateImprovementPlan(questionResults, dimensions) {
  const plan = []

  // 找出最薄弱的维度
  const dims = Object.entries(dimensions).sort((a, b) => a[1].score - b[1].score)
  const weakest = dims[0]

  const dimNames = {
    technicalDepth: '技术深度',
    logicExpression: '逻辑表达',
    communicationSkill: '沟通能力',
    jobFit: '岗位匹配度'
  }

  plan.push(`重点提升${dimNames[weakest[0]]}（当前${weakest[1].score}分）`)

  // 找出低分题目的关键词
  const lowScoreQuestions = questionResults.filter((r) => r.score < 70)
  if (lowScoreQuestions.length > 0) {
    const allKeywords = lowScoreQuestions.flatMap((r) => r.keywords || [])
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 5)
    if (uniqueKeywords.length > 0) {
      plan.push(`加强以下知识点的学习：${uniqueKeywords.join('、')}`)
    }
  }

  plan.push('每周进行 1-2 次模拟面试练习，逐步提升面试技巧')
  plan.push('建议阅读推荐学习资源，系统巩固知识体系')

  return plan
}
