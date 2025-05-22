import https from '@/utils/http'

const loginUrl = process.env.VUE_APP_BASE_API + 'qhmanage/Login/dologin'

export function login(data) {
  return https.post(loginUrl, {
    account: data.account,
    passwd: data.password,
  })
}
