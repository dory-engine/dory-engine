import request from '@/utils/request'
export default {
  getEnvs (params) {
    return request.post('/admin/envs', params)
  },
  getEnvNames () {
    return request.get('/admin/envNames/search')
  },
  getEnvPvs (envName) {
    return request.get(`/admin/env/${envName}/pvs`)
  },
  getEnvScs (envName) {
    return request.get(`/admin/env/${envName}/scs`)
  },
  createPv (envName, pvConfig) {
    return request.post(`/admin/env/${envName}/pvAdd`, pvConfig)
  },
  modifyPv (envName, pvConfig) {
    return request.post(`/admin/env/${envName}/pvUpdate`, pvConfig)
  },
  deletePv (envName, pvConfig) {
    return request.post(`/admin/env/${envName}/pvDelete`, pvConfig)
  },
  createEnv (envConfig) {
    return request.post('/admin/env', envConfig)
  },
  modifyEnv (envName, envConfig) {
    return request.post(`/admin/env/${envName}`, envConfig)
  },
  deleteEnv (envName) {
    return request.delete(`/admin/env/${envName}`)
  },
  getDefaultEnv () {
    return request.get('admin/env')
  },
  getDefaultPV (envName) {
    return request.get(`/admin/env/${envName}/pvDefault`)
  }
}
