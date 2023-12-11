import base from './base'
import axios from '@/utils/http'

const api = {
  //  收入统计图
  getParkingList(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/get/park/list`, { params: params })
  },
  //  收入统计图
  getIncomeStatistics(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/getIncomeStatistics`, { params: params })
  },
  //  车辆来源地分布
  getOriginDistribution(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/getOriginDistribution`, { params: params })
  },
  //  位利用率图
  getParkSpaceUtilization(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/getParkSpaceUtilization`, { params: params })
  },
  //  进出场流量图
  inOutFlow(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/inOutFlow`, { params: params })
  },
  //  收入统计图
  parkRatio(params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/parkRatio`, { params: params })
  },
  //  当前车流量，已收费用，剩余车位
  topData (params) {
    return axios.get(`${base.baseUrl}/dataAnalysis/topData`, { params: params })
  },
  // 生成报表
  createReport (params) {
    return axios.post(`${base.baseUrl}/dataReport/create/report`, params)
  },
  // 历史报表
  getReportHistory (params) {
    return axios.get(`${base.baseUrl}/dataReport/find/report/list`, { params: params })
  }
}

export default api
