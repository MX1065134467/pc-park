const _import = require('../_import_' + process.env.NODE_ENV)
export default [
  {
    path: '/dataAnalysis/index',
    name: 'dataAnalysis',
    component: _import('dataAnalysis/index'),
    meta: {
      firstMenu: '数据分析',
      title: '首页'
    }
  },
  {
    path: '/dataAnalysis/report',
    name: 'dataAnalysisReport',
    component: _import('dataAnalysis/dataReport'),
    meta: {
      firstMenu: '数据分析',
      title: '数据报表'
    }
  },
  {
    path: '/dataAnalysis/historyReport',
    name: 'dataAnalysisHistoryReport',
    component: _import('dataAnalysis/dialog/historyReport'),
    meta: {
      firstMenu: '数据分析',
      secondMenu: '数据报表',
      parentPath: '/dataAnalysis/report',
      title: '历史报表'
    }
  },
  {
    path: '/dataAnalysis/count',
    name: 'dataAnalysisCount',
    component: _import('dataAnalysis/dataCount'),
    meta: {
      firstMenu: '数据分析',
      title: '数据分析统计'
    }
  }
]
