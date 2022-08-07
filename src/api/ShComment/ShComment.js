import request from '@/utils/request'

// 查询评论列表
export function listShComment(query) {
  return request({
    url: '/ShComment/ShComment/list',
    method: 'get',
    params: query
  })
}

// 查询评论详细
export function getShComment(commentId) {
  return request({
    url: '/ShComment/ShComment/' + commentId,
    method: 'get'
  })
}

// 新增评论
export function addShComment(data) {
  return request({
    url: '/ShComment/ShComment',
    method: 'post',
    data: data
  })
}

// 修改评论
export function updateShComment(data) {
  return request({
    url: '/ShComment/ShComment',
    method: 'put',
    data: data
  })
}

// 删除评论
export function delShComment(commentId) {
  return request({
    url: '/ShComment/ShComment/' + commentId,
    method: 'delete'
  })
}
