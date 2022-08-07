import request from '@/utils/request'

// 查询收藏列表
export function listShCollection(query) {
  return request({
    url: '/ShCollection/ShCollection/list',
    method: 'get',
    params: query
  })
}

// 查询收藏详细
export function getShCollection(collectionId) {
  return request({
    url: '/ShCollection/ShCollection/' + collectionId,
    method: 'get'
  })
}

// 新增收藏
export function addShCollection(data) {
  return request({
    url: '/ShCollection/ShCollection',
    method: 'post',
    data: data
  })
}

// 修改收藏
export function updateShCollection(data) {
  return request({
    url: '/ShCollection/ShCollection',
    method: 'put',
    data: data
  })
}

// 删除收藏
export function delShCollection(collectionId) {
  return request({
    url: '/ShCollection/ShCollection/' + collectionId,
    method: 'delete'
  })
}
