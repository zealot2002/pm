import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Companyservice/'

// 公司列表
export function getCompanyList(params) {
  return https.post(baseUrl + 'gslist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    ...params
  })
}

// 添加公司
export function addCompany(params) {
  return https.post(baseUrl + 'addgs', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    name: params.name,
    rem: params.rem
  })
}

// 修改公司
export function updateCompany(params) {
  return https.post(baseUrl + 'updategs', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    id: params.id,
    name: params.name,
    rem: params.rem
  })
}

// 删除公司
export function deleteCompany(id) {
  return https.post(baseUrl + 'delgs', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    id: id
  })
}

// 部门列表
export function getDepartmentList(params) {
  return https.post(baseUrl + 'bmlist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    ...params
  })
}

// 添加部门
export function addDepartment(params) {
  return https.post(baseUrl + 'addbm', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    cid: params.cid,
    name: params.name,
    rem: params.rem
  })
}

// 修改部门
export function updateDepartment(params) {
  return https.post(baseUrl + 'updatebm', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    id: params.id,
    cid: params.cid,
    name: params.name,
    rem: params.rem
  })
}

// 删除部门
export function deleteDepartment(params) {
  return https.post(baseUrl + 'delbm', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: getUserId(),
    id: params.id,
    cid: params.cid
  })
} 