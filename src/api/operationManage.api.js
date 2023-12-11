/* eslint-disable eol-last */
/* eslint-disable indent */
import base from './base'
import axios from '@/utils/http'

const api = {
// 白名单免费卡
// 白名单免费卡列表
exportList(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/export`, params, {
		responseType: 'arraybuffer'
	})
},
getWhiteFreeCard(params) {
	return axios.get(`${base.baseUrl}/WhiteCard/list`, {
		params
	})
},
// 白名单添加免费卡
whiteCardAdd(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/add`, params)
},
// 发送卡片
giveCard(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/give`, params)
},
// 白名单详情
outDetail(params) {
	return axios.get(`${base.baseUrl}/WhiteCard/masterDetail`, {
		params
	})
},
getExportList(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/getExportList`, params)
},
// 白名单导出
exportExcel(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/export/excel`, params, {
		responseType: 'arraybuffer'
	})
},
exportStatus(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/updateExport`, params)
},
// 白名单停用启用
outStatus(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/outStatus`, params)
},
// 白名单明细列表
detailList(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/detailList`, params)
},
// 白名单列表详情
inDetail(params) {
	return axios.get(`${base.baseUrl}/WhiteCard/detail`, {
		params
	})
},
// 导出图片
exportPic(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/export/pic`, params)
},
// 白名单明细列表停用启用
inStatus(params) {
	return axios.post(`${base.baseUrl}/WhiteCard/inStatus`, params)
},
// 获取VIP车辆列表
getList(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/getList`, params)
},
// 新增VIP车辆列表
addParkVip(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/add`, params)
},
// 下载导入模板 vip白名单
downloadExcels() {
	return axios.get(`${base.baseUrl}/ParkVipInfo/download/excel`, { responseType: 'blob' })
},
// VIP导入接口 POST方法
importParkVipInfo(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/import`, params, { responseType: 'blob' })
},
// 查看详情
checkDetail(params) {
	return axios.get(`${base.baseUrl}/ParkVipInfo/detail/${params}`)
},
// 搜索
query(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/query`, params)
},
// 根据当前用户获取停车场列表
getParkList(params) {
	return axios.get(`${base.baseUrl}/parkingSpace/getparking`, {
		params
	})
},
// 更新状态、开始、结束时间信息
updataStatus(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/update`, params)
},
// 批量移除状态
removeList(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/updateList`, params)
},
/*
    * 黑名单
    */
parkBlackList(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/getList`, params)
},
// 查看详情
getDetail(params) {
	return axios.get(`${base.baseUrl}/ParkBlackInfo/detail/${params}`)
},
// 新增黑名单
addBlackList(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/add`, params)
},
// 黑名单处理操作
diaposeBalckList(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/deal`, params)
},
// 复核操作
reCheck(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/review`, params)
},
// 重置操作
resetSingle(params) {
	return axios.get(`${base.baseUrl}/ParkBlackInfo/remove`, {
		params
	})
},
batchReset(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/resetList`, params)
},
/**
 * 计费规则
 */
// 获取列表
getAccountList(params) {
	return axios.post(`${base.baseUrl}/ParkRule/getList`, params)
},
// 新增计费规则
addRules(params) {
	return axios.post(`${base.baseUrl}/ParkRule/add`, params)
},
// 编辑计费规则
updataAccount(params) {
	return axios.post(`${base.baseUrl}/ParkRule/update`, params)
},
// 更新计费状态
updateStatus(params) {
	return axios.post(`${base.baseUrl}/ParkRule/updateStatus`, params)
},
// 通过id查看规则详情信息
rulesDetail(params) {
	return axios.get(`${base.baseUrl}/ParkRule/selectbyid`, {
		params
	})
},
// 停用计费规则
stopRules(params) {
	return axios.get(`${base.baseUrl}/ParkRule/stopRule`, {
		params
	})
},
/**
 * 停车记录-订单
 */
getOrderParkRecords(params) {
	return axios.get(`${base.baseUrl}/parkingOrderRecords/getOrderParkRecords`, {
		params
	})
},
// 查询详情
selectById(params) {
	return axios.get(`${base.baseUrl}/parkingOrderRecords/selectbyid`, {
		params
	})
},
/**
 * 缴费记录-支付
 */
chargeList(params) {
	return axios.get(`${base.baseUrl}/PaymentRecordsInfo/getPayParkRecords`, {
		params
	})
},
// 缴费详情
chargeDetail(params) {
	return axios.get(`${base.baseUrl}/PaymentRecordsInfo/selectbyid`, {
		params
	})
},
/**
 * 车位卡
 */
// 获取车位卡列表
getParkingCardList(params) {
	return axios.get(`${base.baseUrl}/parkingCard/findParkingCardList`, {
		params
	})
},
// 获取车位卡详情
queryCardDetail(id) {
	return axios.get(`${base.baseUrl}/parkingCard/findParkingCardById/${id}`)
},
// 新增车位卡
addParkingCard(params) {
	return axios.post(`${base.baseUrl}/parkingCard/insertParkingCard`, params)
},
// 编辑车位卡
editParkingCard(params) {
	return axios.post(`${base.baseUrl}/parkingCard/updateCardType`, params)
},
// 修改车位卡状态
changeStatus(params) {
	return axios.post(`${base.baseUrl}/parkingCard/updateStatus`, params)
},
/**
 * 用户车位卡
 */
// 获取用户车位卡列表
getUserCardList(params) {
	return axios.post(`${base.baseUrl}/customerParkingCard/findCustomerCardList`, params)
},
// 获取用户车位卡详情
querUserCardDetail(id) {
	return axios.get(`${base.baseUrl}/customerParkingCard/findCustomerCardDetail/${id}`)
},
// 获取用户车位卡使用记录
getUsage(params) {
	return axios.post(`${base.baseUrl}/customerParkingCard/findUsageRecordList`, params)
},
// 获取酒店结算记录列表
getHotelSettlementRecords(params) {
	return axios.get(`${base.baseUrl}/hotelBalance/getSettleRecordList`, {
		params
	})
},
// 获取酒店列表
getHotelList(params) {
	return axios.get(`${base.baseUrl}/hotelBalance/balance/get/hotelList`)
},
// 平账
balanceAccount(params) {
	return axios.post(`${base.baseUrl}/hotelBalance/balance/account`, params)
},
// 酒店对账
hotelReconciliationList(params) {
	return axios.get(`${base.baseUrl}/hotelReconciliation/findReconciliationList`, {
		params
	})
},
// 酒店订单详情
hotelOrderDetail(params) {
	return axios.get(`${base.baseUrl}/hotelReconciliation/get/order/detail`, {
		params
	})
},
// 酒店对账顶部数据统计
getTopData(params) {
	return axios.get(`${base.baseUrl}/hotelReconciliation/getTopData`, {
		params
	})
},
// 酒店客户订单
hotelUserOrder(params) {
	return axios.post(`${base.baseUrl}/hotelReconciliation/get/order/list`, params)
},
// 酒店异业合作导出 POST
exportParkCore(params) {
	return axios.post(`${base.baseUrl}/ParkVipHotelInfo/export/excel`, params, { responseType: 'blob' })
},
// 黑名单导出
ParkBlackInfo(params) {
	return axios.post(`${base.baseUrl}/ParkBlackInfo/export/excel`, params, { responseType: 'blob' })
},
// vip名单导出
ParkVipInfo(params) {
	return axios.post(`${base.baseUrl}/ParkVipInfo/export/excel`, params, { responseType: 'blob' })
},
// 酒店对账导出
hotelReconciliationListExport(params) {
	return axios.get(`${base.baseUrl}/hotelReconciliation/export/reconciliation/list`, {
		params
	}, {
		responseType: 'blob'
	})
},
// 酒店客户订单导出
hotelUserOrderExport(params) {
	return axios.get(`${base.baseUrl}/hotelReconciliation/export/order/list`, {
		params
	}, {
		responseType: 'blob'
	})
},
// 酒店结算记录导出
getHotelSettlementRecordsExport(params) {
	return axios.get(`${base.baseUrl}/hotelBalance/export/settle/list`, {
		params
	}, {
		responseType: 'blob'
	})
},
// 获取车辆类型
getCarTypeList(params) {
	return axios.get(`${base.baseUrl}/pendingCharge/car/type/list`, {
		params
	})
},
// 获取酒店异业合作列表
getHoteList(params) {
	return axios.post(`${base.baseUrl}/ParkVipHotelInfo/getList`, params)
},
// 酒店异业移除
updataHotelStatus(params) {
	return axios.post(`${base.baseUrl}/ParkVipHotelInfo/removeBatch`, params)
},
// 酒店异业详情
getHotelDetail(id) {
	return axios.get(`${base.baseUrl}/ParkVipHotelInfo/detail/` + id)
},
// 统计  停车记录
statOrderParkRecords(params) {
	return axios.get(`${base.baseUrl}/parkingOrderRecords/statOrderParkRecords`, {
		params
	})
},
// 统计  缴费记录
statPayParkRecords(params) {
	return axios.get(`${base.baseUrl}/PaymentRecordsInfo/statPayParkRecords`, {
		params
	})
 }
}

export default api