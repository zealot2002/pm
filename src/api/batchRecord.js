import https from '@/utils/http'
// 创建批次
const createBatchesUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/addchokerbatch'
// 批次列表
const getBatchesListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/chokerbatchlist'

const checkInBatcheUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/batchin'

const checkOutBatcheUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/batchout'

const getCollarListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/batchinfo'

export function createBatches(params) {
  return https.postNew(createBatchesUrl, params)
}

export function getBatchesList(params) {
  return https.postNew(getBatchesListUrl, params)
}

export function checkInBatche(params) {
  return https.postNew(checkInBatcheUrl, params)
}

export function checkOutBatche(params) {
  return https.postNew(checkOutBatcheUrl, params)
}

export function getCollarList(params) {
  return https.postNew(getCollarListUrl, params)
}
