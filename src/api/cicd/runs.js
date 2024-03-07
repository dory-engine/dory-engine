import request from '@/utils/request'
export default {
  getRuns (params) {
    return request.post('/cicd/runs', params)
  },
  getRun (runName) {
    return request.get('/cicd/run/' + runName)
  }
}
