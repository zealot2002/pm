
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
// 获取浏览器中的用户信息
export function getToken() {
  return Cookies.get(TokenKey)
}
// 将用户信息存储到浏览器中
export function setToken(token) {
  console.log('setToken: ', token)
  return Cookies.set(TokenKey, token)
}
// 移除浏览器中的数据
export function removeToken() {
  return Cookies.remove(TokenKey)
}
