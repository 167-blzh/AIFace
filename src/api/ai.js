/**
 * AI API 封装 - ModelScope Qwen3-8B
 * 支持多轮对话、面试官角色设定、结构化评估
 */

// API 配置
const API_CONFIG = {
  baseUrl: 'https://api-inference.modelscope.cn/v1/chat/completions',
  apiKey: localStorage.getItem('ai_api_key') || 'ms-5dba4aef-f3e1-478b-9577-5bc07da46832',
  model: 'Qwen/Qwen3-8B'
}

/**
 * 设置 API Key
 */
export function setApiKey (key) {
  API_CONFIG.apiKey = key
  localStorage.setItem('ai_api_key', key)
}

/**
 * 获取当前 API Key
 */
export function getApiKey () {
  return API_CONFIG.apiKey
}

/**
 * 检查 API Key 是否已配置
 */
export function hasApiKey () {
  return !!API_CONFIG.apiKey
}

/**
 * 生成面试官系统提示词
 * @param {string} jobName - 岗位名称
 * @param {object[]} questions - 题目列表
 * @param {object[]} knowledgeTopics - 相关知识点
 * @returns {string} 系统提示词
 */
export function buildInterviewerPrompt (jobName, questions, knowledgeTopics = []) {
  const questionList = questions
    .map((q, i) => `${i + 1}. [${q.type}] ${q.content}`)
    .join('\n')

  const knowledgeRef = knowledgeTopics.length > 0
    ? `\n\n参考知识点：\n${knowledgeTopics.map((t) => `- ${t.name}: ${t.keyPoints?.join('；')}`).join('\n')}`
    : ''

  return `你是一位经验丰富的${jobName}技术面试官，正在进行一场模拟面试。

## 角色设定
- 你是友善但专业的面试官，会根据候选人的回答水平调整提问深度
- 每次只问一个问题，等候选人回答后再继续
- 根据回答质量决定是追问深入还是切换到下一个问题
- 使用自然的对话语气，像真实面试一样

## 面试题目清单（按顺序提问，但可根据情况灵活调整）
${questionList}

## 面试规则
1. 开场时简短自我介绍，然后提出第一个问题
2. 候选人回答后，根据以下情况决定：
   - 回答较好：给予简短肯定，可以追问一个更深入的问题，或进入下一题
   - 回答一般：给予引导提示，让候选人补充
   - 回答较差：给予鼓励，适当提示后进入下一题
3. 追问要自然，围绕候选人的回答中提到的技术点展开
4. 所有题目问完后，说"面试到这里就结束了，辛苦了！"并给出一句简短的整体印象
5. 每次回复控制在 100 字以内，简洁明了
${knowledgeRef}

## 重要
- 不要一次性列出所有问题
- 不要给出答案或评价正确与否
- 保持面试节奏，像真实面试一样自然过渡`
}

/**
 * 生成评估提示词
 * @param {string} jobName - 岗位名称
 * @param {object[]} conversation - 对话记录
 * @returns {string} 评估提示词
 */
export function buildEvaluationPrompt (jobName, conversation) {
  const dialogue = conversation
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'assistant' ? '面试官' : '候选人'}: ${m.content}`)
    .join('\n\n')

  return `请根据以下${jobName}模拟面试的对话记录，给出详细的评估报告。

## 对话记录
${dialogue}

## 请严格按照以下 JSON 格式输出评估结果（不要输出其他内容）：
{
  "overallScore": 85,
  "dimensions": {
    "technicalDepth": { "score": 85, "comment": "对技术原理理解较深入..." },
    "logicExpression": { "score": 80, "comment": "回答有条理..." },
    "communicationSkill": { "score": 90, "comment": "表达清晰..." },
    "jobFit": { "score": 82, "comment": "对岗位要求的理解..." }
  },
  "questions": [
    {
      "question": "问题内容",
      "score": 85,
      "keywords": ["关键词1", "关键词2"],
      "highlights": "回答中的亮点...",
      "weaknesses": "需要改进的地方...",
      "suggestion": "具体改进建议..."
    }
  ],
  "overallComment": "总体评价...",
  "improvementPlan": ["改进建议1", "改进建议2", "改进建议3"]
}

## 评分标准
- 90-100: 优秀，回答深入全面，有独到见解
- 80-89: 良好，掌握核心概念，有一定深度
- 70-79: 中等，了解基本概念，但深度不足
- 60-69: 及格，有基础认知，但不够准确
- 60以下: 不及格，概念模糊或严重错误

请客观公正评估，给出有建设性的反馈。`
}

/**
 * 调用通义千问 API
 * @param {object[]} messages - 消息列表 [{role, content}]
 * @param {object} options - 额外选项
 * @returns {Promise<string>} AI 回复内容
 */
export async function chatCompletion (messages, options = {}) {
  if (!API_CONFIG.apiKey) {
    throw new Error('请先配置 AI API Key')
  }

  const response = await fetch(API_CONFIG.baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || API_CONFIG.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 1024
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 请求失败 (${response.status})`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * 流式调用通义千问 API
 * @param {object[]} messages - 消息列表
 * @param {function} onChunk - 每次收到内容回调
 * @param {object} options - 额外选项
 * @returns {Promise<string>} 完整回复
 */
export async function chatCompletionStream (messages, onChunk, options = {}) {
  if (!API_CONFIG.apiKey) {
    throw new Error('请先配置 AI API Key')
  }

  const response = await fetch(API_CONFIG.baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || API_CONFIG.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 1024,
      stream: true
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 请求失败 (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue
      const data = trimmed.slice(6)
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content || ''
        if (content) {
          fullContent += content
          onChunk(content, fullContent)
        }
      } catch {
        // 跳过无法解析的数据
      }
    }
  }

  return fullContent
}

/**
 * AI 面试官发送消息（流式）
 * @param {object[]} conversationHistory - 完整对话历史
 * @param {function} onChunk - 流式回调
 * @returns {Promise<string>} 完整回复
 */
export async function interviewerReply (conversationHistory, onChunk) {
  return chatCompletionStream(conversationHistory, onChunk, {
    temperature: 0.8,
    maxTokens: 512
  })
}

/**
 * AI 评估面试表现
 * @param {string} jobName - 岗位名称
 * @param {object[]} conversation - 对话记录
 * @returns {Promise<object>} 评估结果 JSON
 */
export async function evaluateInterview (jobName, conversation) {
  const systemPrompt = buildEvaluationPrompt(jobName, conversation)
  const messages = [{ role: 'user', content: systemPrompt }]

  const result = await chatCompletion(messages, {
    temperature: 0.3,
    maxTokens: 2048
  })

  // 尝试解析 JSON
  try {
    // 提取 JSON 部分（可能被 markdown 代码块包裹）
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // JSON 解析失败，返回原始文本
  }

  return {
    overallScore: 75,
    dimensions: {
      technicalDepth: { score: 75, comment: result },
      logicExpression: { score: 75, comment: '' },
      communicationSkill: { score: 75, comment: '' },
      jobFit: { score: 75, comment: '' }
    },
    overallComment: result,
    questions: [],
    improvementPlan: ['建议多练习技术面试题']
  }
}
