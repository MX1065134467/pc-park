import Vue from 'vue'
import VueRouter from 'vue-router'
import systemManage from './module/systemManage'
import userManage from './module/userManage'
import platformManage from './module/platformManage'
import basicFacilities from './module/basicFacilities'
import dataAnalysis from './module/dataAnalysis'
import operationsManage from './module/operationsManage' // 运营管理
import artificailCharge from './module/artificailCharge' // 人工收费
import parkingCardSell from './module/parkingCardSell' // 车位卡售卖
import {
  getToken,
  removerToken
} from '@/common/cache.js'
const _import = require('./_import_' + process.env.NODE_ENV)

// 解决重复点击导航路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: {
    name: 'login'
  }
}, {
  path: '/login',
  name: 'login',
  component: _import('login/index')
}, {
  path: '',
  name: 'basic',
  component: _import('index'),
  redirect: to => {
    const useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (useInfo.isInitPwd === 1) {
      return '/system/my-center'
    } else {
      return '/dataAnalysis/index'
    }
  },
  children: [
    ...systemManage,
    ...userManage,
    ...platformManage,
    ...basicFacilities,
    ...dataAnalysis,
    ...basicFacilities,
    ...operationsManage,
    ...artificailCharge,
    ...parkingCardSell
  ]
}]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    removerToken()
    next()
  }
  if (to.path !== '/artificailCharge/charge-await') {
    sessionStorage.removeItem('socet')
  }
  const token = getToken()
  if (!token && to.path !== '/login') {
    next({
      path: '/login'
    })
  }
  next()
})

export default router
