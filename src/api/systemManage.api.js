import base from './base'
import axios from '@/utils/http'

const api = {
  // 个人中心-查看
  getPersonalInfo(params) {
    return axios.get(`${base.baseUrl}/UserInfo/findUserInfoById2`, {
      params
    })
  },
  // 个人中心-修改密码
  updatePassword(params) {
    return axios.post(`${base.baseUrl}/UserInfo/updatePassword`, params)
  },
  // 个人中心-修改手机号
  updatePhone(params) {
    return axios.post(`${base.baseUrl}/UserInfo/changePhone`, params)
  },
  // 个人中心-更新账户信息
  updatePersonalInfo(params) {
    return axios.post(`${base.baseUrl}/UserInfo/update`, params)
  },
  // 退出登录
  signOutInfo(params) {
    return axios.post(`${base.baseUrl}/userlogin/signOut`, params)
  },
  // 操作日志-列表查询
  sysLogList(params) {
    return axios.post(`${base.baseUrl}/log/sysLogList`, params)
  },
  // 系统管理-账户管理-查询列表
  getSystemAcountList(params) {
    return axios.post(`${base.baseUrl}/UserInfo/findUserList`, params)
  },
  // 系统管理-账户管理-停用或者使用账户
  stopOrUseAccount(params) {
    return axios.get(`${base.baseUrl}/UserInfo/updateStatus`, {
      params
    })
  },
  // 系统管理-账户管理-添加账户
  addAccount(params) {
    return axios.post(`${base.baseUrl}/UserInfo/addOrEditAccount`, params)
  },
  // 系统管理-账户管理-获取角色
  getRole(params) {
    return axios.get(`${base.baseUrl}/SysRole/findSysRoleList`, {
      params
    })
  },
  // 系统管理-账户管理-查看详情
  getAccountInfo(params) {
    return axios.get(`${base.baseUrl}/UserInfo/findUserInfoById2`, {
      params
    })
  },
  // 系统管理-账户管理-重置账户密码
  getAssets(params) {
    return axios.get(`${base.baseUrl}/UserInfo/resetPassword`, {
      params
    })
  },
  // 角色管理-添加角色
  addRole(params) {
    return axios.post(`${base.baseUrl}/SysRole/add`, params)
  },
  // 角色管理-修改角色
  updateRole(params) {
    return axios.post(`${base.baseUrl}/SysRole/update`, params)
  },
  // 角色管理-获取角色列表
  getRoleList() {
    return axios.get(`${base.baseUrl}/SysRole/findSysRoleList`)
  },
  // 角色管理-查询菜单列表
  getMenuList() {
    return axios.get(`${base.baseUrl}/SysRole/findSysMenuAllList`)
  },
  // 角色管理-角色关联菜单权限
  addPower(params) {
    return axios.post(`${base.baseUrl}/SysRole/saveRoleMenu`, params)
  },
  // 角色管理-查询权限
  getPower(params) {
    return axios.get(`${base.baseUrl}/SysRole/findSysRoleMenuByRoleId`, {
      params
    })
  },
  // 系统管理-账户管理-获取所属车位
  getParking(params) {
    return axios.get(`${base.baseUrl}/ParkingGarage/findParkingGarageListByParkingId`, {
      params
    })
  },
  // 系统管理-账户管理-获取停车场
  getPark(params) {
    return axios.get(`${base.baseUrl}/parkingSpace/getparking`, {
      params
    })
  },
  // 系统管理-系统管理-基础信息
  getBasic() {
    return axios.get(`${base.baseUrl}/systemManage/findParkingInfo`)
  },
  // 系统管理-基础信息-更新停车场对公电话和经纬度
  editBasic(params) {
    return axios.get(`${base.baseUrl}/systemManage/updateParkingInfo`, {
      params
    })
  },
  // 系统管理-分账记录
  getProfitList(params) {
    return axios.post(`${base.baseUrl}/systemManage/findProfitSharingList`, params)
  },
  // 根据停车场获取设备信息
  getEquipListByGatageId(params) {
    return axios.get(`${base.baseUrl}/UserInfo/findRoadWayById`, {
      params
    })
  },
  // 查询未出场记录
  getInRecordList(params) {
    return axios.post(`${base.baseUrl}/carCheck/getInRecordList`, params)
  },
  // 查询未出场记录详情
  getInRecordDetail(params) {
    return axios.get(`${base.baseUrl}/carCheck/getInRecordDetail`, {
      params
    })
  },
  // 移除
  removeRecordList(params) {
    return axios.post(`${base.baseUrl}/carCheck/remove`, params)
  },
  exportRecordList(params) {
    return axios.post(`${base.baseUrl}/carCheck/export`, params, {
      responseType: 'arraybuffer'
    })
  }
}

export default api
