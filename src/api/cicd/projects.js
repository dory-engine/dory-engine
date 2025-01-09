import request from '@/utils/request'
export default {
  getProjectNames () {
    return request.get('/cicd/projectNames')
  },
  getProjectDescs () {
    return request.get('/cicd/projectDescs')
  },
  getProjects (params) {
    return request.post('/cicd/projects', params)
  }
}
