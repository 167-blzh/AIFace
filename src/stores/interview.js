import { defineStore } from 'pinia'

const HISTORY_KEY = 'interview_history'

export const useInterviewStore = defineStore('interview', {
  state: () => ({
    currentJob: null,
    interviewHistory: JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'),
    currentReport: null,
    isInterviewing: false,
    interviewConfig: null
  }),
  actions: {
    setCurrentJob(job) {
      this.currentJob = job
    },
    setConfig(config) {
      this.interviewConfig = config
    },
    startInterview() {
      this.isInterviewing = true
    },
    finishInterview(report) {
      this.isInterviewing = false
      this.currentReport = report
      this.interviewHistory.unshift(report)
      this._saveHistory()
    },
    deleteHistory(index) {
      this.interviewHistory.splice(index, 1)
      this._saveHistory()
    },
    clearHistory() {
      this.interviewHistory = []
      this._saveHistory()
    },
    _saveHistory() {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.interviewHistory))
    }
  }
})
