const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/artificailCharge/charge-await',
    name: 'chargeAwait',
    component: _import('artificailCharge/chargeAwait'),
    meta: {
      firstMenu: '人工收费',
      title: '待收费'
    },
    props: (route) => ({
      routeData: route.query.routeData
    })
  },
  {
    path: '/artificailCharge/charge-await/awaitList',
    name: 'awaitList',
    component: _import('artificailCharge/handMovement'),
    meta: {
      firstMenu: '人工收费',
      secondMenu: '待收费',
      parentPath: '/artificailCharge/charge-await',
      title: '待收费列表'
    }
  },
  {
    path: '/artificailCharge/account-checking',
    name: 'accountChecking',
    component: _import('artificailCharge/accountChecking'),
    meta: {
      firstMenu: '人工收费',
      title: '交班对账'
    }
  },
  {
    path: '/artificailCharge/charge-record',
    name: 'chargeRecord',
    component: _import('artificailCharge/chargeRecord'),
    meta: {
      firstMenu: '人工收费',
      title: '收费记录'
    }
  },
  {
    path: '/artificailCharge/charge-record/detail',
    name: 'chargeDetail',
    component: _import('artificailCharge/chargeDetail'),
    meta: {
      firstMenu: '人工收费',
      secondMenu: '收费记录',
      parentPath: '/artificailCharge/charge-record',
      title: '收费详情'
    }
  }
]
