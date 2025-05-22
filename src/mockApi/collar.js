
import https from '@/utils/http'
import { hostUrl } from './host'
// 获取指定批次的项圈列表
const getCollarsByBatchesIdUrl = hostUrl + 'batches/collars'
// 创建批次
const createBatchesUrl = hostUrl + 'batches/create'
// 批次列表
const getBatchesListUrl = hostUrl + 'batches/list'
// 指定商家的批次列表
const getBatchesListByMerchantIdUrl = hostUrl + 'batches/merchant/list'

export function getCollarsByBatchesId(params) {
  return https.postMock(getCollarsByBatchesIdUrl, params)
}

export function createBatches(params) {
  return https.postMock(createBatchesUrl, params)
}

export function getBatchesList(params) {
  return https.postMock(getBatchesListUrl, params)
}

export function getBatchesListByMerchantId(params) {
  return https.postMock(getBatchesListByMerchantIdUrl, params)
}
