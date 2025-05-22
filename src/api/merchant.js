
import https from '@/utils/http'
const getMerchantListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/datalist'
const createMerchantUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/addmerchant'
const updateMerchantUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/updatemerchant'
const deleteMerchantUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/delmerchant'
const getMerchantInfoUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/detailmerchant'

export function getMerchantList(params) {
  return https.post(getMerchantListUrl, params)    
}

export function createMerchant(params) {
  return https.post(createMerchantUrl, params)
}

export function updateMerchant(params) {
  return https.post(updateMerchantUrl, params)
}

export function deleteMerchant(params) {
  return https.post(deleteMerchantUrl, params)
}

export function getMerchantInfo(params) {
  return https.post(getMerchantInfoUrl, params)
}

