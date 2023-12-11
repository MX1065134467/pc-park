const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/userManage/index',
    name: 'userManage',
    component: _import('userManage/index'),
    meta: {
      firstMenu: '用户管理',
      title: '用户列表'
    }
  },
  {
    path: '/userManage/user',
    name: 'userManageUser',
    component: _import('userManage/user'),
    meta: {
      firstMenu: '用户管理',
      secondMenu: '用户列表',
      parentPath: '/userManage/index',
      title: '用户中心'
    }
  }, {
    path: '/userManage/user/detail',
    name: 'userManageDetail',
    component: _import('userManage/detail/parkDetail'),
    meta: {
      firstMenu: '用户管理',
      secondMenu: '用户列表',
      parentPath: '/userManage/index',
      title: '用户中心'
    }
  }
]
