
export function getUserId() {
  return localStorage.getItem('userId')
}

export function setUserId(id) {
  localStorage.setItem('userId', id)
}

export function getUserType() {
  return localStorage.getItem('userType')
}

export function setUserType(type) {
  localStorage.setItem('userType', type)
}
export function getNickname() {
  return localStorage.getItem('nickname')
}

export function setNickname(nickname) {
  localStorage.setItem('nickname', nickname)
}

export function getUniqueid() {
  return localStorage.getItem('uniqueid')
}

export function setUniqueid(nickname) {
  localStorage.setItem('uniqueid', nickname)
}

export function getAesToken() {
  console.log('getAesToken', localStorage.getItem('aesToken'))
  return localStorage.getItem('aesToken')
}

export function setAesToken(aesToken) {
  localStorage.setItem('aesToken', aesToken)
}
