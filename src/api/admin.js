import https from '@/utils/http'
import { getUserId } from '@/utils/SpUtil'

const baseUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Admin/'

// 用户列表
export function getAdminList(params) {
  return https.post(baseUrl + 'adminlist', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    eid: params.eid || getUserId()
  })
}

// 创建用户
export function addAdmin(params) {
  return https.post(baseUrl + 'addadmin', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    passwd: params.passwd,
    empnum: params.empnum,
    name: params.name,
    department: params.department,
    belong: params.belong,
    qx: params.qx || 0
  })
}

// 修改用户
export function updateAdmin(params) {
  return https.post(baseUrl + 'updatepwd', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: params.id,
    passwd: params.passwd,
    empnum: params.empnum,
    name: params.name,
    department: params.department,
    belong: params.belong,
    qx: params.qx
  })
}

// 删除用户
export function deleteAdmin(id) {
  return https.post(baseUrl + 'delemp', {
    activityid: process.env.VUE_APP_ACTIVITY_ID,
    id: id
  })
} 