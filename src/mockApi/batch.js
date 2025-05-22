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

// 创建批次规格
const createBatchSpecificationUrl = hostUrl + 'batch-specifications/create'
// 获取批次规格
const getBatchSpecificationUrl = hostUrl + 'batch-specifications/list'
// 更新批次规格
const updateBatchSpecificationUrl = hostUrl + 'batch-specifications/update'
// 删除批次规格
const deleteBatchSpecificationUrl = hostUrl + 'batch-specifications/delete'

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

export function createBatchSpecification(params) {
  return https.postMock(createBatchSpecificationUrl, params)
}

export function getBatchSpecification(params) {
  return https.postMock(getBatchSpecificationUrl, params)
}

export function updateBatchSpecification(params) {
  return https.postMock(updateBatchSpecificationUrl, params)
}

export function deleteBatchSpecification(params) {
  return https.postMock(deleteBatchSpecificationUrl, params)
}
