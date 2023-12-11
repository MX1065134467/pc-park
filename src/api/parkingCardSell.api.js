import base from './base'
import axios from '@/utils/http'

const api = {
  // 根据当前用户获取停车场列表
  getParkList(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/getparking`, { params })
  },
  // 可售列表
  saleList(params) {
    return axios.get(`${base.baseUrl}/SellParkCard/findParkingCardList`, { params })
  },
  // 可售列表- 详情
  saleDetail(cardId) {
    return axios.get(`${base.baseUrl}/SellParkCard/findParkingCardById/${cardId}`)
  },
  // 购买车位卡
  buyCard(params) {
    return axios.post(`${base.baseUrl}/SellParkCard/BuyParkCard`, params)
  },
  // 管理车位
  parkingManage(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/manage/parkingspaces/single`, { params })
  },
  // 根据停车场查询车库信息
  queryGarage(params) {
    return axios.get(`${base.baseUrl}/ParkingGarage/findParkingGarageListByParkingId`, { params })
  },
  // 获取车位列表
  getGarageList(params) {
    return axios.post(`${base.baseUrl}/parkingSpace/manage/parkingspaces/list`, params)
  },
  // 获取已售车位卡列表
  parkingRecordList(params) {
    return axios.get(`${base.baseUrl}/SellCardRecord/ParkingRecordList`, { params })
  },
  // 购买车位卡支付
  parkCardPay(params) {
    return axios.post(`${base.baseUrl}/SellParkCard/PayParkCard`, params)
  }

}
export default api
