const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/parkingCardSell/sale-list',
    name: 'saleList',
    component: _import('parkingCardSell/saleList'),
    meta: {
      firstMenu: '业务办理',
      title: '车位卡列表'
    }
  },
  {
    path: '/parkingCardSell/sale-list/buyCard',
    name: 'buyCard',
    component: _import('parkingCardSell/buyCard'),
    meta: {
      firstMenu: '业务办理',
      secondMenu: '车位卡列表',
      parentPath: '/parkingCardSell/sale-list',
      title: '销售会员卡'
    }
  },
  {
    path: '/parkingCardSell/sale-list/choiseStall',
    name: 'choiseStall',
    component: _import('parkingCardSell/choiseStall'),
    meta: {
      firstMenu: '业务办理',
      secondMenu: '车位卡列表',
      parentPath: '/parkingCardSell/sale-list',
      title: '选择车位'
    }
  },
  {
    path: '/parkingCardSell/sale-list/createOrder',
    name: 'createOrder',
    component: _import('parkingCardSell/createOrder'),
    meta: {
      firstMenu: '业务办理',
      secondMenu: '车位卡列表',
      parentPath: '/parkingCardSell/sale-list',
      title: '生成订单'
    }
  },
  {
    path: '/parkingCardSell/sale-record',
    name: 'saleRecord',
    component: _import('parkingCardSell/saleRecord'),
    meta: {
      firstMenu: '业务办理',
      title: '售卡记录'
    }
  },
  {
    path: '/parkingCardSell/sale-record/card-detail',
    name: 'parkingCardDetail',
    component: _import('parkingCardSell/parkingCardDetail'),
    meta: {
      firstMenu: '业务办理',
      secondMenu: '售卡记录',
      parentPath: '/parkingCardSell/sale-record',
      title: '车位卡详情'
    }
  },
  {
    path: '/parkingCardSell/sale-record/parking-detail',
    name: 'parkingSell_parkDetail',
    component: _import('parkingCardSell/parkingSell_parkDetail'),
    meta: {
      firstMenu: '业务办理',
      secondMenu: '售卡记录',
      parentPath: '/parkingCardSell/sale-record',
      title: '停车记录详情'
    }
  }
]
