import request from '@/utils/request'
export default {
  getFixRuns (params) {
    return request.post('/cicd/fixRuns', params)
  }
}
