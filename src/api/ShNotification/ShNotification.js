import request from '@/utils/request'

// 查询通知列表
export function listShNotification(query) {
  return request({
    url: '/ShNotification/ShNotification/list',
    method: 'get',
    params: query
  })
}

// 查询通知详细
export function getShNotification(nid) {
  return request({
    url: '/ShNotification/ShNotification/' + nid,
    method: 'get'
  })
}

// 新增通知
export function addShNotification(data) {
  return request({
    url: '/ShNotification/ShNotification',
    method: 'post',
    data: data
  })
}

// 修改通知
export function updateShNotification(data) {
  return request({
    url: '/ShNotification/ShNotification',
    method: 'put',
    data: data
  })
}

// 删除通知
export function delShNotification(nid) {
  return request({
    url: '/ShNotification/ShNotification/' + nid,
    method: 'delete'
  })
}
