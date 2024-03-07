import request from '@/utils/request'

export default {
  getAuditLogs (parmas) {
    return request.post('/admin/auditLogs', parmas)
  },
  getAuditLogTypes () {
    return request.get('/admin/auditLogTypes')
  },
  getProjectNames () {
    return request.get('/admin/projectNames')
  }
}
