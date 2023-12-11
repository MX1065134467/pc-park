import base from './base'
import axios from '@/utils/http'

const api = {
  // 获取待收费信息
  getPendingChargeInfo(params) {
    return axios.get(`${base.baseUrl}/pendingCharge/getPendingChargeInfo`, { params })
  },
  // 车道闸口查询
  pendingChargeList(params) {
    return axios.get(`${base.baseUrl}/pendingCharge/gate/get/list`, { params })
  },
  // 车型列表查询
  carTypeList(params) {
    return axios.get(`${base.baseUrl}/pendingCharge/car/type/list`, { params })
  },
  // 无牌车辆入场登记
  regist(params) {
    return axios.post(`${base.baseUrl}/carInOut/regist`, params)
  },
  // 根据车牌号查询入场记录
  recordIn(params) {
    return axios.get(`${base.baseUrl}/carInOut/record/in`, { params })
  },
  // 无牌车辆入场补录
  supple(params) {
    return axios.post(`${base.baseUrl}/carInOut/supple`, params)
  },
  // 待出场无牌车辆记录列表
  carInOutList(params) {
    return axios.get(`${base.baseUrl}/carInOut/record/in/list`, { params })
  },
  // 无牌车辆离场（无牌和人工结算）
  vehicleExit(params) {
    return axios.post(`${base.baseUrl}/carInOut/vehicleExit`, params)
  },
  // 待支付停车订单列表查询
  unPaidList(params) {
    return axios.get(`${base.baseUrl}/order/unPaid/list`, { params })
  },
  // 现金支付
  cashPay(params) {
    return axios.post(`${base.baseUrl}/pay/cashPay`, params)
  },
  // 最近订单列表
  PaidList(params) {
    return axios.get(`${base.baseUrl}/order/paid/list`, { params })
  },
  // 查询订单详情
  orderDetail(params) {
    return axios.get(`${base.baseUrl}/order/detail`, { params })
  },
  // 车型切换
  calculate(params) {
    return axios.post(`${base.baseUrl}/carInOut/switch/calculate`, params)
  },
  // 车型切换列表
  carStyleCut(params) {
    return axios.get(`${base.baseUrl}/ParkRule/switch/list`, { params })
  },
  // 车道闸口操作
  operate(params) {
    return axios.post(`${base.baseUrl}/pendingCharge/gate/operate`, params)
  },
  // 扫码支付
  codePay(params) {
    return axios.post(`${base.baseUrl}/pay/codePay`, params)
  },
  // 查询出入场图片
  getInOutFileList(params) {
    return axios.get(`${base.baseUrl}/carInOut/getInOutFileList`, { params })
  }
}
export default api
