import base from './base'
import axios from '@/utils/http'

const api = {
  // 获取车库列表
  getGarageList(params) {
    return axios.get(`${base.baseUrl}/ParkingGarage/findParkingGarageListByParkingId`, { params })
  }
}

export default api
