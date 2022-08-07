import request from '@/utils/request'

// 查询板块列表
export function listShCategory(query) {
  return request({
    url: '/ShCategory/ShCategory/list',
    method: 'get',
    params: query
  })
}

// 查询板块详细
export function getShCategory(categoryId) {
  return request({
    url: '/ShCategory/ShCategory/' + categoryId,
    method: 'get'
  })
}

// 新增板块
export function addShCategory(data) {
  return request({
    url: '/ShCategory/ShCategory',
    method: 'post',
    data: data
  })
}

// 修改板块
export function updateShCategory(data) {
  return request({
    url: '/ShCategory/ShCategory',
    method: 'put',
    data: data
  })
}

// 删除板块
export function delShCategory(categoryId) {
  return request({
    url: '/ShCategory/ShCategory/' + categoryId,
    method: 'delete'
  })
}
