const USER_KEY = 'userInfo'
const TOKEN = 'token'
const MENU_PERMISSION = 'menu-permission'

export function saveUserInfo(userInfo) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

export function saveMenuPermission(param) {
  sessionStorage.setItem(MENU_PERMISSION, JSON.stringify(param))
}

export function getMenuPermission() {
  return JSON.parse(sessionStorage.getItem(MENU_PERMISSION))
}

export function saveToken(token) {
  window.sessionStorage.setItem(TOKEN, token)
}

export function removeUserInfo() {
  sessionStorage.removeItem(USER_KEY)
}

export function removerToken() {
  sessionStorage.removeItem(TOKEN)
}

export function getUserInfo() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return userInfo !== 'undefined' ? JSON.parse(userInfo) : ''
}

export function getToken() {
  return window.sessionStorage.getItem(TOKEN)
}

export function getUserId() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return JSON.parse(userInfo).userId
}

export function getUserName() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return JSON.parse(userInfo).userName
}

export function getUserType() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return JSON.parse(userInfo).userType
}

export function getParkingId() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return JSON.parse(userInfo).parkingId
}

export function getAdminType() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  return JSON.parse(userInfo).isAdmin
}
