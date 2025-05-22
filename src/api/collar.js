import https from '@/utils/http'

const createBatchesUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/addnumber'
// const getBatchesListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/petnumlist'
const getBatchesListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/pcinfo'
const getCollarsByBatchesIdUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Merchants/petnumlist'
export function createBatches(params) {
  return https.postNew(createBatchesUrl, params)
}

export function getBatchesList(params) {
  return https.postNew(getBatchesListUrl, params)
}
export function getBatchesListByMerchantId(params) {
  return https.postNew(getBatchesListUrl, params)
}
export function getCollarsByBatchesId(params) {
  return https.postNew(getCollarsByBatchesIdUrl, params)
}

