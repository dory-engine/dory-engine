import request from '@/utils/request'
export default {
  getModule (projectName, moduleType, moduleName) {
    return request.get(`/cicd/module/${projectName}/${moduleType}/${moduleName}`)
  },
  getPipelineName () {
    return request.get('/cicd/pipelineNames')
  }
}