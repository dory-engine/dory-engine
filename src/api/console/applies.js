import request from '@/utils/request'

export default {
  getApplies (params) {
    return request.post('/console/applies', params)
  },
  applyOperate (applyTicket, params) {
    return request.post(`/console/apply/${applyTicket}`, params)
  },
  executeApply (applyTicket, projectName, params) {
    return request.post(`/console/apply/${applyTicket}/${projectName}`, params)
  },
  downloadAttachment (attachmentID) {
    return request.get(`/console/attachment/${attachmentID}`, {
      responseType: 'blob'
    })
  },
  getProjectNames () {
    return request.get('/console/projectNames')
  }
}
