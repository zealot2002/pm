
import https from '@/utils/http'
import { hostUrl } from './host'
const getMerchantListUrl = hostUrl + 'merchants/list'
const createMerchantUrl = hostUrl + 'merchants/create'
const updateMerchantUrl = hostUrl + 'merchants/update'
const deleteMerchantUrl = hostUrl + 'merchants/delete'
const searchMerchantUrl = hostUrl + 'merchants/search'

export function getMerchantList(params) {
  return https.postMock(getMerchantListUrl, params)
}

export function createMerchant(params) {
  return https.postMock(createMerchantUrl, params)
}

export function updateMerchant(params) {
  return https.postMock(updateMerchantUrl, params)
}

export function deleteMerchant(params) {
  return https.postMock(deleteMerchantUrl, params)
}

export function searchMerchant(params) {
  return https.postMock(searchMerchantUrl, params)
}

