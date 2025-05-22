import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Progressservice/'

// 进度列表
export function getProgressList(params) {
  return https.post(baseUrl + 'jdlist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: params.eid || getUserId(),
    pid: params.pid || 0,
    page: params.page || 1,
    pagecount: params.pagecount || 10
  })
}

// 更新进度
export function updateProgress(params) {
  return https.post(baseUrl + 'jdupdate', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    rem: params.rem,
    state: params.state,
    enddate: params.enddate || '',
    reason: params.reason || '',
    scheme: params.scheme || ''
  })
} 