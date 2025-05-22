import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Projectservice/'

// 项目列表
export function getProjectList(params) {
  return https.post(baseUrl + 'prolist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: params.eid || getUserId()
  })
}

// 创建项目
export function addProject(params) {
  return https.post(baseUrl + 'addpro', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    name: params.name,
    rem: params.rem,
    startdate: params.startdate,
    enddate: params.enddate
  })
}

// 修改项目
export function updateProject(params) {
  return https.post(baseUrl + 'updatepro', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    name: params.name,
    rem: params.rem,
    startdate: params.startdate,
    enddate: params.enddate
  })
}

// 删除项目
export function deleteProject(id) {
  return https.post(baseUrl + 'delpro', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: id
  })
} 