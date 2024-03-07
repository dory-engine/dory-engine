import request from '@/utils/request'
export default {
  getSteps (params) {
    return request.post('/cicd/steps', params)
  }
}