import base from './base'
import axios from '@/utils/http'

const api = {
  // 登录
  login(params) {
    return axios.post(`${base.baseUrl}/userlogin/login`, params)
  },
  // 获取标题
  getTitles(params) {
    return axios.get(`${base.baseUrl}/sysInfo/getSystemName`, {
      params
    })
  }
}

export default api
