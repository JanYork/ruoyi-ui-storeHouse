import request from '@/utils/request'

// 查询文章列表
export function listShTopic(query) {
  return request({
    url: '/ShTopic/ShTopic/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getShTopic(topicId) {
  return request({
    url: '/ShTopic/ShTopic/' + topicId,
    method: 'get'
  })
}

// 新增文章
export function addShTopic(data) {
  return request({
    url: '/ShTopic/ShTopic',
    method: 'post',
    data: data
  })
}

// 修改文章
export function updateShTopic(data) {
  return request({
    url: '/ShTopic/ShTopic',
    method: 'put',
    data: data
  })
}

// 删除文章
export function delShTopic(topicId) {
  return request({
    url: '/ShTopic/ShTopic/' + topicId,
    method: 'delete'
  })
}
