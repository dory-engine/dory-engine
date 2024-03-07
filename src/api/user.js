import request from '@/utils/request'
export default {
  login (param) {
    return request.post('/public/login', param)
  },
  logout () {
    return request.post('/account/logout', {})
  },
  forgetPassword (param) {
    return request.post('/public/password/forget', param)
  },
  resetPassword (param) {
    return request.post('/public/password/reset', param)
  },
  getProfile () {
    return request.get('/account/profile')
  },
  updateProfile (param) {
    return request.post('/account/profile', param)
  },
  getAccessToken () {
    return request.get('/account/accessTokens')
  },
  postAccessToken (param) {
    return request.post('/account/accessToken', param)
  },
  deleteAccessToken (accessTokenName) {
    return request.delete(`/account/accessToken/${accessTokenName}`)
  },
  changePassword (param) {
    return request.post('/account/password/change', param)
  }
}
