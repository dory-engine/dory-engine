import request from '@/utils/request'
export default {
  getPipeline (pipelineName) {
    return request.get(`/cicd/pipeline/${pipelineName }`)
  }
}