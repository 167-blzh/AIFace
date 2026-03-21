import { defineStore } from 'pinia'

export const useInterviewStore = defineStore('interview', {
  state: () => ({
    currentJob: null, // 当前选择岗位
    interviewHistory: [], // 面试历史
    currentReport: null, // 当前评估报告
    isInterviewing: false, // 是否正在面试
  }),
  actions: {
    setCurrentJob(job) {
      this.currentJob = job
    },
    startInterview() {
      this.isInterviewing = true
    },
    finishInterview(report) {
      this.isInterviewing = false
      this.currentReport = report
      this.interviewHistory.unshift(report)
    },
  },
})
