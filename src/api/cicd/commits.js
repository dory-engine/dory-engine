import request from '@/utils/request'
export default {
  getCommits (parmas) {
    return request.post('/cicd/commits', parmas)
  }
}