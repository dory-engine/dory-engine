import request from '@/utils/request'
export default {
  getProjectName () {
    return request.get('/cicd/projectNames')
  },
  getProjects (params) {
    return request.post('/cicd/projects', params)
  }
}
