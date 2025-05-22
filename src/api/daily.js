import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Dailyservice/'

// 日报列表
export function getDailyList(params) {
  return https.post(baseUrl + 'dailylist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: params.eid + '' || getUserId(),
    pid: params.pid || '',
    page: params.page || 1,
    pagecount: params.pagecount || 10
  })
}

// 添加日报
export function addDaily(params) {
  return https.post(baseUrl + 'adddaily', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    pid: params.pid + '' ,
    mid: params.mid + '' ,
    eid: params.eid + '' || getUserId(),
    rem: params.rem
  })
}

// 修改日报
export function updateDaily(params) {
  return https.post(baseUrl + 'updatedaily', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    pid: params.pid || 0,
    mid: params.mid || 0,
    eid: params.eid || getUserId(),
    rem: params.rem
  })
}

// 删除日报
export function deleteDaily(id) {
  return https.post(baseUrl + 'deldaily', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: id
  })
} 