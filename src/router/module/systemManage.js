const _import = require('../_import_' + process.env.NODE_ENV)
export default [{
  path: '/system/my-center',
  name: 'systemMyCenter',
  component: _import('systemManage/myCenter'),
  meta: {
    firstMenu: '系统管理',
    title: '个人中心'
  }
},
{
  path: '/system/log',
  name: 'systemLog',
  component: _import('systemManage/log'),
  meta: {
    firstMenu: '系统管理',
    title: '操作日志'
  }
},
{
  path: '/system/account',
  name: 'systemAccount',
  component: _import('systemManage/account'),
  meta: {
    firstMenu: '系统管理',
    title: '账户管理'
  }
},
{
  path: '/system/manage',
  name: 'systemManage',
  component: _import('systemManage/manage/index'),
  meta: {
    firstMenu: '系统管理',
    title: '系统管理'
  }
},
{
  path: '/system/role',
  name: 'systemRole',
  component: _import('systemManage/role'),
  meta: {
    firstMenu: '系统管理',
    title: '角色管理'
  }
},
{
  path: '/system/carCheck',
  name: 'systemCarCheck',
  component: _import('systemManage/carCheck'),
  meta: {
    firstMenu: '系统管理',
    title: '车辆排查'
  }
},
{
  path: '/system/carCheck/detail',
  name: 'carCheckDetail',
  component: _import('systemManage/carCheckDetail'),
  meta: {
    firstMenu: '系统设置',
    secondMenu: '车辆排查',
    parentPath: '/system/carCheck',
    title: '停车详情'
  }
}
]
