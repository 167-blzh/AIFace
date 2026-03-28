/**
 * 语音输入/输出 Composable
 * 基于 Web Speech API
 */

import { ref, onUnmounted } from 'vue'

/**
 * 语音识别 Composable
 */
export function useSpeechRecognition() {
  const isListening = ref(false)
  const transcript = ref('')
  const isSupported = ref(false)
  const error = ref('')

  let recognition = null

  // 检测浏览器支持
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  isSupported.value = !!SpeechRecognition

  if (SpeechRecognition) {
    recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      transcript.value = finalTranscript || interimTranscript
    }

    recognition.onerror = (event) => {
      error.value = event.error === 'not-allowed'
        ? '请允许麦克风权限'
        : event.error === 'no-speech'
          ? '未检测到语音，请重试'
          : `语音识别错误: ${event.error}`
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
    }
  }

  function start() {
    if (!recognition) {
      error.value = '当前浏览器不支持语音识别'
      return
    }
    error.value = ''
    transcript.value = ''
    recognition.start()
    isListening.value = true
  }

  function stop() {
    if (recognition && isListening.value) {
      recognition.stop()
      isListening.value = false
    }
  }

  function toggle() {
    if (isListening.value) {
      stop()
    } else {
      start()
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isListening,
    transcript,
    isSupported,
    error,
    start,
    stop,
    toggle
  }
}

/**
 * 语音合成 Composable
 */
export function useSpeechSynthesis() {
  const isSpeaking = ref(false)
  const isSupported = ref('speechSynthesis' in window)

  function speak(text) {
    if (!isSupported.value || !text) return

    // 停止当前朗读
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => {
      isSpeaking.value = true
    }
    utterance.onend = () => {
      isSpeaking.value = false
    }
    utterance.onerror = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isSpeaking,
    isSupported,
    speak,
    stop
  }
}
