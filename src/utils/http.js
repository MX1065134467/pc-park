import axios from 'axios'
import router from '@/router'
import {
  getToken,
  removerToken,
  removeUserInfo
} from '@/common/cache.js'
// import { Message } from 'element-ui'

// 根据不同的状态码，生成不同的提示信息
const showStatus = (status) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}

// 创建 axios 实例
const service = axios.create({
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    put: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  // 跨域请求时是否需要使用凭证
  withCredentials: false,
  //   timeout: 60000,
  timeout: 300000,
  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus() {
    return true
  },
  // 在传递给 then/catch 前，修改响应数据
  transformResponse: [(data) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data)
    }
    return data
  }]
})

// 请求拦截器
service.interceptors.request.use((config) => {
  if (config.url.includes('/VMS2Service.cgi')) {
    const token = localStorage.getItem('vmsToken')
    if (token) {
      config.headers['auth-token'] = token
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  } else {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  }
}, (error) => {
  console.log(error)
  // 错误抛到业务代码
  error.data = {
    error
  }
  error.data.msg = '服务器异常，请联系管理员！'
  return Promise.resolve(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  const status = response.status
  let msg = ''
  if (status < 200 || status >= 300) {
    // 处理http错误，抛到业务代码
    msg = showStatus(status)
    if (typeof response.data === 'string') {
      response.data = {
        msg
      }
    } else {
      response.data.msg = response.data.message ? response.data.message : msg
    }
  } else {
    if (response.data.code === 401) {
      removeUserInfo()
      removerToken()
      router.replace('/')
    }
  }
  return response
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
  return Promise.resolve(error)
})

export default service
