import request from '@/utils/request'

// 查询配置列表
export function listShConfig(query) {
  return request({
    url: '/ShConfig/ShConfig/list',
    method: 'get',
    params: query
  })
}

// 查询配置详细
export function getShConfig(cid) {
  return request({
    url: '/ShConfig/ShConfig/' + cid,
    method: 'get'
  })
}

// 新增配置
export function addShConfig(data) {
  return request({
    url: '/ShConfig/ShConfig',
    method: 'post',
    data: data
  })
}

// 修改配置
export function updateShConfig(data) {
  return request({
    url: '/ShConfig/ShConfig',
    method: 'put',
    data: data
  })
}

// 删除配置
export function delShConfig(cid) {
  return request({
    url: '/ShConfig/ShConfig/' + cid,
    method: 'delete'
  })
}
