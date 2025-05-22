import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Versionservice/'

// 版本列表
export function getVersionList(params) {
  return https.post(baseUrl + 'versionlist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: params.eid || getUserId(),
    pid: params.pid || 0,
    page: params.page || 1,
    pagecount: params.pagecount || 10
  })
}

// 添加版本
export function addVersion(params) {
  return https.post(baseUrl + 'addversion', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    pid: params.pid,
    eid: params.eid || getUserId(),
    title: params.title,
    filename: params.filename,
    rem: params.rem
  })
}

// 修改版本
export function updateVersion(params) {
  return https.post(baseUrl + 'updateversion', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    pid: params.pid,
    eid: params.eid || getUserId(),
    title: params.title,
    filename: params.filename,
    rem: params.rem
  })
} 