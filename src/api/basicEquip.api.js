import base from './base'
import axios from '@/utils/http'

const api = {
  // 停车库管理列表
  getParkGarageList(params) {
    return axios.post(`${base.baseUrl}/parkingSpace/getall`, params)
  },
  // 停用使用
  stopOrUse(params) {
    return axios({
      url: `${base.baseUrl}/parkingSpace/updatworkstatus?garageId=${params.garageId}&status=${params.status}`,
      method: 'put'
    })
  },
  // 新增车库
  inserGarage(params) {
    return axios.post(`${base.baseUrl}/parkingSpace/create`, params)
  },
  // 获取停车场
  getParkingList(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/getparking`, { params })
  },
  // 设备位置列表
  getEquipmentLocationList(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipInfo/findRoadWayById`, { params })
  },
  // 新增
  inserParking(params) {
    return axios.post(`${base.baseUrl}/parkingSpace/create`, params)
  },
  // 通过id查询详情
  getDetailById(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/selectbyid`, { params })
  },
  // 修改
  updateGarage(params) {
    return axios.put(`${base.baseUrl}/parkingSpace/updatparkinggarage`, params)
  },
  // 获取设备类型(分页)
  getEquipType(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipType/findParkingEquipTypeList`, params)
  },
  // 获取设备类型信息（不分页）
  getEquipTypeSelect(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipType/findParkingEquipTypeList`, { params })
  },
  // 添加设备类型
  addEquipType(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipType/add`, params)
  },
  // 获取设备类型信息
  getEquipById(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipType/findEquipTypeById`, { params })
  },
  // 更新设备类型
  updateEquipType(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipType/update`, params)
  },
  // 设备类型停用使用
  useOrStop(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipType/updateStatus`, { params })
  },
  // 设备管理 设备获取列表
  getEquipList(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipInfo/findParkingEquipInfoList`, params)
  },
  // 获取停车库
  getGarageList(params) {
    return axios.get(`${base.baseUrl}/ParkingGarage/findParkingGarageListByParkingId`, { params })
  },
  // 设备管理添加
  addEquip(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipInfo/add`, params)
  },
  // 设备信息管理 停用使用
  equipStopOrUse(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipInfo/updateStatus`, { params })
  },
  // 设备信息获取详情
  getEquipDetail(params) {
    return axios.get(`${base.baseUrl}/ParkingEquipInfo/findEquipInfoById`, { params })
  },
  // 修改设备信息
  updateEquipInfo(params) {
    return axios.post(`${base.baseUrl}/ParkingEquipInfo/update`, params)
  },
  // 管理车位
  getSingleSpace(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/manage/parkingspaces/single`, { params })
  },
  // 获取停车位
  getSpaceList(params) {
    return axios.post(`${base.baseUrl}/parkingSpace/manage/parkingspaces/list`, params)
  },
  // 指定车位
  pointSpace(params) {
    return axios.put(`${base.baseUrl}/parkingSpace/designated/parkingSpace`, params)
  },
  // 同步信息
  asyncData(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/synchronizeParkInfo`, { params })
  },
  // 设置编号
  setRegularRuls(params) {
    return axios.put(`${base.baseUrl}/parkingSpace/parkingSpace/setnumbering`, params)
  },
  // 生成二维码
  getGenerate(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/parkingSpace/generate/QRCode`, { params })
  }
}

export default api
