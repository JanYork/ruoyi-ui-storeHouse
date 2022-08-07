import request from '@/utils/request'

// 查询标签列表
export function listShTag(query) {
  return request({
    url: '/ShTag/ShTag/list',
    method: 'get',
    params: query
  })
}

// 查询标签详细
export function getShTag(tagId) {
  return request({
    url: '/ShTag/ShTag/' + tagId,
    method: 'get'
  })
}

// 新增标签
export function addShTag(data) {
  return request({
    url: '/ShTag/ShTag',
    method: 'post',
    data: data
  })
}

// 修改标签
export function updateShTag(data) {
  return request({
    url: '/ShTag/ShTag',
    method: 'put',
    data: data
  })
}

// 删除标签
export function delShTag(tagId) {
  return request({
    url: '/ShTag/ShTag/' + tagId,
    method: 'delete'
  })
}
