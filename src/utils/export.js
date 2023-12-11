import base from '@/api/base'
import axios from 'axios'
import { getToken } from '@/common/cache.js'
/*
params  导出传参
url     导出接口地址
method  接口请求方式
title   导出文件名
*/
const handleTransformParams = (params, url, method, title) => {
  const token = getToken()
  axios({
    method: method,
    url: `${base.baseUrl}${url}`,
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: token
    }
  }).then(res => {
    const blob = new Blob([res.data], {
      type: 'application/vnd.ms-excel'
    })
    var downloadA = document.createElement('a')
    downloadA.href = window.URL.createObjectURL(blob)
    downloadA.download = title
    downloadA.click()
    window.URL.revokeObjectURL(downloadA.href)
  })
}
export default handleTransformParams
