import request from '@/utils/request'
export default {
  getProject (projectName) {
    return request.get(`/cicd/project/${projectName}`)
  }
}
