const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/plateform/parking-manage',
    name: 'parkingManage',
    component: _import('plateform/parkingManage'),
    meta: {
      firstMenu: '平台管理',
      title: '停车场管理'
    }
  },
  {
    path: '/plateform/plate-account',
    name: 'plateAccount',
    component: _import('plateform/plateAccount'),
    meta: {
      firstMenu: '平台管理',
      title: '平台账户'
    }
  },
  {
    path: '/plateform/menu-manage',
    name: 'menuManage',
    component: _import('plateform/menuManage'),
    meta: {
      firstMenu: '平台管理',
      title: '菜单管理'
    }
  }
]
