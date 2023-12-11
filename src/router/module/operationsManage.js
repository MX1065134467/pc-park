const _import = require('../_import_' + process.env.NODE_ENV)
export default [{
  path: '/operationsManage/white-list-free',
  name: 'whiteListFree',
  component: _import('operationsManage/whiteListFree'),
  meta: {
    firstMenu: '运营管理',
    title: '白名单免费卡'
  }
},
{
  path: '/operationsManage/white-list-free/add',
  name: 'whiteListFreeAdd',
  component: _import('operationsManage/whiteListFreeAdd'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '白名单免费卡',
    parentPath: '/operationsManage/white-list-free',
    title: '新增白名单免费卡'
  }
},
{
  path: '/operationsManage/white-order-list',
  name: 'whiteOrderList',
  component: _import('operationsManage/whiteOrderList'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '白名单免费卡',
    parentPath: '/operationsManage/white-list-free',
    title: '明细列表'
  }
},
{
  path: '/operationsManage/white-list',
  name: 'whiteList',
  component: _import('operationsManage/whiteList'),
  meta: {
    firstMenu: '运营管理',
    title: 'VIP白名单'
  }
},
{
  path: '/operationsManage/hotel-cooperation',
  name: 'whiteList',
  component: _import('operationsManage/hotelCooperation'),
  meta: {
    firstMenu: '运营管理',
    title: '酒店异业合作'
  }
},
{
  path: '/operationsManage/black-list',
  name: 'blackList',
  component: _import('operationsManage/blackList'),
  meta: {
    firstMenu: '运营管理',
    title: '黑名单'
  }
},
{
  path: '/operationsManage/accounting-rules',
  name: 'accountingRules',
  component: _import('operationsManage/accountingRules'),
  meta: {
    firstMenu: '运营管理',
    title: '计费规则'
  }
},
{
  path: '/operationsManage/accounting-rules/add',
  name: 'accountRulesAdd',
  component: _import('operationsManage/accountRulesAdd'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '计费规则',
    parentPath: '/operationsManage/accounting-rules',
    title: '新增计费规则'
  }
},
{
  path: '/operationsManage/parking-card',
  name: 'parkingCard',
  component: _import('operationsManage/parkingCard'),
  meta: {
    firstMenu: '运营管理',
    title: '车位卡'
  }
},
{
  path: '/operationsManage/parking-card/add',
  name: 'addParkingCard',
  component: _import('operationsManage/addParkingCard'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '车位卡',
    parentPath: '/operationsManage/parking-card',
    title: '新增车位卡'
  }
},
{
  path: '/operationsManage/parking-record',
  name: 'parkingRecord',
  component: _import('operationsManage/parkingRecord'),
  meta: {
    firstMenu: '运营管理',
    title: '停车记录'
  }
},
{
  path: '/operationsManage/parking-record/detail',
  name: 'parkingDetail',
  component: _import('operationsManage/parkingDetail'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '停车记录',
    parentPath: '/operationsManage/parking-record',
    title: '停车详情'
  }
},
{
  path: '/operationsManage/payment-record',
  name: 'paymentRecord',
  component: _import('operationsManage/paymentRecord'),
  meta: {
    firstMenu: '运营管理',
    title: '缴费记录'
  }
},
{
  path: '/operationsManage/payment-record/detail',
  name: 'paymentDetail',
  component: _import('operationsManage/paymentDetail'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '缴费记录',
    parentPath: '/operationsManage/payment-record',
    title: '缴费详情'
  }
},
{
  path: '/operationsManage/user-parking-card',
  name: 'userParkingCard',
  component: _import('operationsManage/userParkingCard'),
  meta: {
    firstMenu: '运营管理',
    title: '用户车位卡'
  }
},
{
  path: '/operationsManage/user-parking-card/detail',
  name: 'userCardDetail',
  component: _import('operationsManage/userCardDetail'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '用户车位卡',
    parentPath: '/operationsManage/user-parking-card',
    title: '车位卡详情'
  }
},
{
  path: '/operationsManage/hotel-balance',
  name: 'hotelReconciliation',
  component: _import('operationsManage/hotelBalance'),
  meta: {
    firstMenu: '运营管理',
    title: '酒店结算记录'
  }
},
{
  path: '/operationsManage/hotel-reconciliation',
  name: 'hotelReconciliation',
  component: _import('operationsManage/hotelReconciliation'),
  meta: {
    firstMenu: '运营管理',
    title: '酒店对账'
  }
},
{
  path: '/operationsManage/hotel-reconciliation/orderList',
  name: 'parkingDetail',
  component: _import('operationsManage/hotelOrderList'),
  meta: {
    firstMenu: '运营管理',
    secondMenu: '酒店对账',
    parentPath: '/operationsManage/hotel-reconciliation',
    title: '酒店客户订单'
  }
}
]
