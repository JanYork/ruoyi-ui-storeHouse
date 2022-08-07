import request from '@/utils/request'

// 查询用户列表
export function listShuserinfo(query) {
  return request({
    url: '/Shuserinfo/Shuserinfo/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getShuserinfo(uid) {
  return request({
    url: '/Shuserinfo/Shuserinfo/' + uid,
    method: 'get'
  })
}

// 新增用户
export function addShuserinfo(data) {
  return request({
    url: '/Shuserinfo/Shuserinfo',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateShuserinfo(data) {
  return request({
    url: '/Shuserinfo/Shuserinfo',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delShuserinfo(uid) {
  return request({
    url: '/Shuserinfo/Shuserinfo/' + uid,
    method: 'delete'
  })
}
