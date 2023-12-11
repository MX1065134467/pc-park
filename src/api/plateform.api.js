import base from './base'
import axios from '@/utils/http'

const api = {
  // 获取停车场列表
  getParkList(params) {
    return axios.post(`${base.baseUrl}/ParkingManage/findParkingList`, params)
  },
  // 根据id获取停车场详情
  getParkDetailById(params) {
    return axios.get(`${base.baseUrl}/ParkingManage/findParkingInfoById`, { params })
  },
  // 新增停车场
  insertPark(params) {
    return axios.post(`${base.baseUrl}/ParkingManage/add`, params)
  },
  // 编辑停车场
  updatePark(params) {
    return axios.post(`${base.baseUrl}/ParkingManage/update`, params)
  },
  // 停用使用停车场
  stopOrUse(params) {
    return axios.get(`${base.baseUrl}/ParkingManage/updateStatus`, { params })
  },
  // 平台账户列表
  getPlateList(params) {
    return axios.post(`${base.baseUrl}/UserInfo/findUserList`, params)
  },
  // 添加
  addAccount(params) {
    return axios.post(`${base.baseUrl}/UserInfo/addAdmin`, params)
  },
  // 修改
  updateAccount(params) {
    return axios.post(`${base.baseUrl}/UserInfo/update`, params)
  },
  // 根据id获取账户信息
  getAccountInfo(params) {
    return axios.get(`${base.baseUrl}/UserInfo/findUserInfoById2`, { params })
  },
  // 停用或者使用账户
  stopOrUseAccount(params) {
    return axios.get(`${base.baseUrl}/UserInfo/updateStatus`, { params })
  },
  // 根据停车场Id查询停车库
  getParksList(params) {
    return axios.get(`${base.baseUrl}/ParkingGarage/findParkingGarageListByParkingId`, { params })
  },
  // 获取菜单列表
  getSysMenuList(params) {
    return axios.get(`${base.baseUrl}/SysMenu/getSysMenuList`, { params })
  },
  // 添加菜单
  insertSysMenu(params) {
    return axios.post(`${base.baseUrl}/SysMenu/insertSysMenu`, params)
  },
  // 根据id查询菜单详情
  getSysMenuById(params) {
    return axios.get(`${base.baseUrl}/SysMenu/getSysMenuById`, { params })
  },
  // 编辑菜单
  updateSysMenu(params) {
    return axios.post(`${base.baseUrl}/SysMenu/updateSysMenu`, params)
  }
}

export default api
