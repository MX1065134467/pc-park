const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/basicFacility/equip-type',
    name: 'equipType',
    component: _import('basicFacility/equipType'),
    meta: {
      firstMenu: '基础设施',
      title: '设备类型'
    }
  },
  {
    path: '/basicFacility/park-manage',
    name: 'parkManage',
    component: _import('basicFacility/parkManage'),
    meta: {
      firstMenu: '基础设施',
      title: '停车库管理'
    }
  },
  {
    path: '/basicFacility/equip-manage',
    name: 'equipManage',
    component: _import('basicFacility/equipManage'),
    meta: {
      firstMenu: '基础设施',
      title: '设备管理'
    }
  },
  {
    path: '/basicFacility/manage-park',
    name: 'managePark',
    component: _import('basicFacility/dialog/managePark'),
    meta: {
      firstMenu: '基础设施',
      secondMenu: '停车库管理',
      parentPath: '/basicFacility/park-manage',
      title: '管理车位'
    }
  },
  {
    path: '/basicFacility/parkManagePage',
    name: 'parkManagePage',
    component: _import('basicFacility/dialog/parkManagePage'),
    meta: {
      firstMenu: '基础设施',
      secondMenu: '停车库管理',
      parentPath: '/basicFacility/park-manage',
      title: '新增车库'
    }
  }
]
