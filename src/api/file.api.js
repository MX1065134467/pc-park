import base from './base'
import axios from '@/utils/http'

const api = {
  // 单个图片上传接口
  uploadSingleFile(params) {
    return axios.post(`${base.baseUrl}/file/uploadSingle`, params, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  // 删除图片
  deleteImg(params) {
    return axios.delete(`${base.baseUrl}/file/deleteSingle`, { params })
  },
  // 图片批量上传
  uploadBatchImg(params) {
    return axios.post(`${base.baseUrl}/file/upload`, params, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  // 批量删除图片
  batchDeleteImg(params) {
    return axios.delete(`${base.baseUrl}/file/delete`, { params })
  }
}

export default api
