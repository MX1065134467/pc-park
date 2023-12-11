/**
 * 时间格式化
 * type: 格式化类型
 */
export const timeFormat = (time, type = '') => {
  const date = new Date(time)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let hh = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  hh = hh < 10 ? '0' + hh : hh
  mm = mm < 10 ? '0' + mm : mm
  ss = ss < 10 ? '0' + ss : ss
  let result = ''
  type = type.toLocaleLowerCase()
  switch (type) {
    case 'yyyy-mm-dd':
      result = `${y}-${m}-${d}`
      break
    case 'mm-dd':
      result = `${m} - ${d}`
      break
    case 'hh-mm':
      result = `${hh} : ${mm}`
      break
    default:
      result = `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      break
  }
  return result
}
// 导出
export const downloadFile = (res, fName) => {
  const content = res
  const bolb = new Blob([content], {
    type: 'application/vnd.ms-excel'
  })
  if ('download' in document.createElement('a')) {
    const link = document.createElement('a')
    link.download = fName + '_' + Date.now() + '.xlsx'
    link.style.display = 'none'
    link.href = URL.createObjectURL(bolb)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } else {
    navigator.msSaveBlob(bolb, fName)
  }
}
// 深拷贝
export const deepClone = (newObj, oldObj) => {
  for (const k in oldObj) {
    const item = oldObj[k]
    if (item instanceof Array) {
      newObj[k] = []
      deepClone(newObj[k], item)
    } else if (item instanceof Object) {
      newObj[k] = {}
      deepClone(newObj[k], item)
    } else {
      newObj[k] = item
    }
  }
}
