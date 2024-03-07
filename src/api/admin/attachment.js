import request from '@/utils/request'

export default {
  uploadAttachments (attachmentFiles) {
    const formData = new FormData()
    attachmentFiles.forEach(attachment => {
      formData.append('attachment[]', attachment)
    })
    return request.post('/admin/attachment', formData)
  }
}
