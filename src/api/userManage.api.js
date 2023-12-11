import base from './base'
import axios from '@/utils/http'

const api = {
  // 用户管理列表
  getUserList(params) {
    return axios.get(`${base.baseUrl}/userManagement/userList`, { params })
  },
  // 用户详情
  getUserCenterDetail(params) {
    return axios.post(`${base.baseUrl}/userManagement/userCenterDetail`, params)
  },
  // 用户中心违规记录
  getUserCenterBlackDetail(params) {
    return axios.post(`${base.baseUrl}/userManagement/userCenterBlackDetail`, params)
  },
  // 用户中心积分
  getUserCenterScopeDetail(params) {
    return axios.post(`${base.baseUrl}/userManagement/userCenterScopeDetail`, params)
  },
  // 用户停车记录
  getUserCenterTimeDetail(params) {
    return axios.post(`${base.baseUrl}/userManagement/userCenterTimeDetail`, params)
  },
  // 停车记录详情
  getParkDetail(params) {
    return axios.get(`${base.baseUrl}/userManagement/parkDetail`, { params })
  },
  // 违规记录详情
  getBlackDetail(params) {
    return axios.get(`${base.baseUrl}/userManagement/blackDetail`, { params })
  },
  // 积分记录详情
  getScopeDetail(params) {
    return axios.get(`${base.baseUrl}/userManagement/scopeDetail`, { params })
  },
  // 更新积分详情
  getUpdateInfoDetail(params) {
    return axios.get(`${base.baseUrl}/userManagement/updateInfoDetail`, { params })
  }
}

export default api
