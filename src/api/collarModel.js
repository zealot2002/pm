import https from '@/utils/http'

const createCollarModelUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/addchokertype'
const getCollarModelListUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/chokertypelist'
const updateCollarModelUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/updatechokertype'
const deleteCollarModelUrl = process.env.VUE_APP_BASE_API + 'qhcwdsxz/Choker/delchokertype'

export function createCollarModel(params) {
  return https.postNew(createCollarModelUrl, params)
}

export function getCollarModelList(params) {
  return https.postNew(getCollarModelListUrl, params)
}

export function updateCollarModel(params) {
  return https.postNew(updateCollarModelUrl, params)
}

export function deleteCollarModel(params) {
  return https.postNew(deleteCollarModelUrl, params)
}
