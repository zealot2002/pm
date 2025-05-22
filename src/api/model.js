import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Modelservice/'

// 模块列表
export function getModelList(params) {
  return https.post(baseUrl + 'modellist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    pid: params.pid || 0,
    eid: params.eid || getUserId(),
    page: params.page || 1,
    pagecount: params.pagecount || 10
  })
}

// 创建模块
export function addModel(params) {
  return https.post(baseUrl + 'addmodel', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    modelname: params.modelname,
    rem: params.rem,
    startdate: params.startdate,
    enddate: params.enddate,
    bid: params.bid || 0,
    fid: params.fid || 0,
    did: params.did || 0,
    pid: params.pid
  })
}

// 修改模块
export function updateModel(params) {
  return https.post(baseUrl + 'updatemodel', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    modelname: params.modelname,
    rem: params.rem,
    startdate: params.startdate,
    enddate: params.enddate,
    bid: params.bid || 0,
    fid: params.fid || 0,
    did: params.did || 0,
    pid: params.pid
  })
}

// 删除模块
export function deleteModel(id) {
  return https.post(baseUrl + 'delmodel', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: id
  })
} 