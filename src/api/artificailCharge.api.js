import base from './base'
import axios from '@/utils/http'

const api = {
  /**
   * 交班对账
   */
  // 获取信息, 查看
  getInfo(params) {
    return axios.get(`${base.baseUrl}/contractcarpaycontroller/gettall`, { params })
  },
  // 获取获取缴费记录列表
  getChargeList(params) {
    return axios.get(`${base.baseUrl}/toll/getall`, { params })
  },
  // 收费记录详情
  chargeDetail(params) {
    return axios.get(`${base.baseUrl}/toll/selectbyid`, { params })
  },
  // 代收费信息查询
  getChargeInfo(params) {
    return axios.get(`${base.baseUrl}/pendingCharge/getPendingChargeInfo`, { params })
  },
  // 主扫支付 --- 废弃
  payment(params) {
    return axios.post(`${base.baseUrl}/pay/scan`, params)
  },
  // 支付状态查询
  payStatus(params) {
    return axios.get(`${base.baseUrl}/pay/payStatus`, { params })
  },
  // 付款码支付
  codePay(params) {
    return axios.post(`${base.baseUrl}/pay/codePay`, params)
  },
  // 现金支付
  cashPay(params) {
    return axios.post(`${base.baseUrl}/pay/cashPay`, params)
  },
  // 手动结费
  handMovement(params) {
    return axios.get(`${base.baseUrl}/pendingCharge/manual/settle`, { params })
  }
}
export default api
