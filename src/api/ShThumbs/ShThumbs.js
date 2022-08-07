import request from '@/utils/request'

// 查询点赞列表
export function listShThumbs(query) {
  return request({
    url: '/ShThumbs/ShThumbs/list',
    method: 'get',
    params: query
  })
}

// 查询点赞详细
export function getShThumbs(thumbsId) {
  return request({
    url: '/ShThumbs/ShThumbs/' + thumbsId,
    method: 'get'
  })
}

// 新增点赞
export function addShThumbs(data) {
  return request({
    url: '/ShThumbs/ShThumbs',
    method: 'post',
    data: data
  })
}

// 修改点赞
export function updateShThumbs(data) {
  return request({
    url: '/ShThumbs/ShThumbs',
    method: 'put',
    data: data
  })
}

// 删除点赞
export function delShThumbs(thumbsId) {
  return request({
    url: '/ShThumbs/ShThumbs/' + thumbsId,
    method: 'delete'
  })
}
