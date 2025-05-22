import https from '@/utils/http'
// 创建批次规格
const createBatchSpecificationUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/addchokergg'
// 获取批次规格
const getBatchSpecificationUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/chokergglist'
// 更新批次规格
const updateBatchSpecificationUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/updatechokergg'
// 删除批次规格
const deleteBatchSpecificationUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/delchokergg'

export function createBatchSpecification(params) {
  return https.postNew(createBatchSpecificationUrl, params)
}

export function getBatchSpecification(params) {
  return https.postNew(getBatchSpecificationUrl, params)
}

export function updateBatchSpecification(params) {
  return https.postNew(updateBatchSpecificationUrl, params)
}

export function deleteBatchSpecification(params) {
  return https.postNew(deleteBatchSpecificationUrl, params)
}
