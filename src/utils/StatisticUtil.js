import { getNickname, getUniqueid } from '@/utils/SpUtil.js'
import router from '@/router'
import { doLog } from '@/api/log'

// 公共配置
const commonConfig = {
  platform: 'pc',
  activityid: process.env.VUE_APP_ACTIVITY_ID,
  uniqueid: getUniqueid(),
  openid: 'no',
  petid: 'no'
}

// 获取基础数据
function getBaseData() {
  return {
    ...commonConfig,
    sf: getAdminDescription(),
    page: router.currentRoute.meta.title || '',
    prepage: sessionStorage.getItem('prepage') || ''
  }
}

function getAdminDescription() {
  const userDescription = getNickname()
  return userDescription
}
// 日志打印
function logData(type, data) {
  // console.log(`数据统计—————— log${type}:`, JSON.stringify(data, null, 2))
}

export function logView() {
  const obj = {
    ...getBaseData(),
    eventtype: 'view',
    act: 'look',
    data: ''
  }
  logData('View', obj)
  doLog(obj)
}

export function logAction(act, params = {}) {
  const obj = {
    ...getBaseData(),
    eventtype: 'click',
    act: act,
    data: JSON.stringify(params)
  }
  logData('Action', obj)
  doLog(obj)
}
