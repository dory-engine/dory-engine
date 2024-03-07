import request from '@/utils/request'

export default {
  applyOperate (applyTicket, params) {
    return request.post(`/admin/apply/${applyTicket}`, params)
  },
  executeApply (applyTicket, projectName, params) {
    return request.post(`/admin/apply/${applyTicket}/${projectName}`, params)
  },
  downloadAttachment (attachmentID) {
    return request.get(`/admin/attachment/${attachmentID}`, {
      responseType: 'blob'
    })
  },
  getProjectNames () {
    return request.get('/admin/projectNames')
  }
}
