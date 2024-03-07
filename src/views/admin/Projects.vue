<script>
import ChipPairs from '@/lib/ui-lib/components/ChipPairs'
import InfoCard from '@/lib/ui-lib/components/InfoCard'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip', 'reload'],
  name: 'Projects',
  components: { InfoSingleTable, InfoCard, ChipPairs, Operations },
  data () {
    return {
      userObj: {},
      projectsForm: {
        projectNames: [],
        projectTeam: '',
        page: 1,
        perPage: 10
      },
      addProjectForm: {
        projectInfo: {
          projectName: '',
          projectNamespace: '',
          projectShortName: '',
          projectDesc: '',
          projectTeam: '',
          projectArch: 'amd64',
          defaultPv: '',
          privileged: false,
        },
        gitRepoSetting: {
          gitRepoType: '',
          gitRepoName: '',
          gitRepoPath: '',
          gitRepoUrl: '',
          gitRepoSourceBranch: '',
          gitRepoUser: '',
          gitRepoToken: '',
          gitRepoPassword: '',
          gitRepoDir: {
            buildSettingsDir: '',
            databaseScriptsDir: '',
            demoCodesDir: '',
            deployScriptsDir: '',
            documentsDir: '',
            testScriptsDir: '',
          },
        },
        imageRepoSetting: {
          imageRepoName: '',
          imageRepoHostName: '',
          imageRepoGroupName: '',
          imageRepoUserName: '',
          imageRepoPassword: '',
        },
        artifactRepoSetting: {
          artifactRepoType: '',
          artifactRepoName: '',
          artifactRepoHostName: '',
          artifactRepoPort: 0,
          artifactRepoPath: '',
          artifactRepoUserName: '',
          artifactRepoPassword: '',
          artifactRepoHttpUpload: {
            url: '',
            insecure: false,
            method: 'PUT',
          },
          artifactRepoHttpDownload: {
            url: '',
            insecure: false,
          },
        },
        scanCodeRepoSetting: {
          scanCodeRepoName: '',
        },
        tenantCode: '',
        envName: '',
        enableArtifactRepoProxy: true,
        createDemoOnExistGitRepo: true,
      },
      envPvNames: [],
      gitRepoTypes: [],
      gitRepoTypeHint: '',
      repoNames: {},
      archNames: [],
      tenantCodes: [],
      disableBtn: false,
      tableLoading: true,
      targetProjectName: '',
      targetEnvName: '',
      targetProjectRepo: {
        gitRepoType: '',
        imageRepoName: '',
        artifactRepoType: '',
        scanCodeRepoName: '',
      },
      recyleNodePort: '',
      pageData: {
        totalCount: 0,
        rows: [],
        displayRows: []
      },
      addProjectDialog: false,
      addNodePortDialog: false,
      deleteEnvDialog: false,
      deleteNodePortDialog: false,
      projectName: [],
      projectList: [],
      projectNamespaceList: [],
      newEnvDialog: false,
      newEnvSelect: [],
      newEnvSelectList: [],
      assignEnvSelectList: [],
      updateProjectDialog: false,
      deleteProjectDialog: false,
      deleteProjectName: '',
      auditDialog: false,
      auditMessage: '',
      ws: null,
      userToken: '',
      logList: [],
      handleEnvType: '0',
      handleEnvName: '',
      deleteProjectForm: {
        gitRepoDelete: false,
        scanCodeRepoDelete: false,
        imageRepoDelete: false,
        artifactRepoDelete: false,
        namespaceDelete: false,
      },
      updateProjectForm: {
        privileged: '',
        projectDesc: '',
        projectTeam: '',
        projectArch: '',
        gitRepoUser: '',
        gitRepoToken: '',
        gitRepoPassword: '',
        gitRepoDir: {
          buildSettingsDir: '',
          databaseScriptsDir: '',
          demoCodesDir: '',
          deployScriptsDir: '',
          documentsDir: '',
          testScriptsDir: '',
        },
        imageRepoHostName: '',
        imageRepoGroupName: '',
        imageRepoUserName: '',
        imageRepoPassword: '',
        artifactRepoHostName: '',
        artifactRepoPort: 0,
        artifactRepoPath: '',
        artifactRepoUserName: '',
        artifactRepoPassword: '',
        artifactRepoHttpUpload: {
          url: '',
          insecure: false,
          method: '',
        },
        artifactRepoHttpDownload: {
          url: '',
          insecure: false,
        },
        scanCodeRepoName: '',
      },
      deleteEnvName: '',
      envPvs: [],
    }
  },
  methods: {
    getProjects() {
      const vm = this
      request.post('admin/projects', vm.projectsForm).then(response => {
        vm.pageData.rows = response.data.projects
        vm.pageData.totalCount = response.data.totalCount
        vm.pageData.displayRows = vm.pageData.rows.map((row,index) => {
          row.index = index
          return Object.assign({}, row, {
            pipelinesInfoCard: vm.rtnPipelinesInfoCard(row),
            projectTeam: row.projectInfo.projectTeam,
            projectGit: row.projectInfo.projectGroup,
          })
        })
        vm.tableLoading = false
        vm.successTip(true, response.msg)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    updateOptions() {
      const vm = this
      vm.tableLoading = true
      request.post('admin/projects', vm.projectsForm).then(response => {
        vm.pageData.rows = response.data.projects
        vm.pageData.totalCount = response.data.totalCount
        vm.pageData.displayRows = vm.pageData.rows.map((row,index) => {
          row.index = index
          return Object.assign({}, row, {
            pipelinesInfoCard: vm.rtnPipelinesInfoCard(row),
            projectTeam: row.projectInfo.projectTeam,
            projectGit: row.projectInfo.projectGroup,
          })
        })
        vm.tableLoading = false
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    updateGitRepoTypeHint() {
      const vm = this
      if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalCreate') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_internal_create_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_internal_exist_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_github_create_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_github_exist_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_gitee_create_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_gitee_exist_tip_1')
      } else if (vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist') {
        vm.gitRepoTypeHint = vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_external_exist_tip_1')
      }
    },
    updateEnvPvNames() {
      const vm = this
      vm.envPvNames = [
        {
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_default_pv_auto_alloc'),
          value: '',
        }
      ]
      vm.envPvs.forEach(envPv => {
        if (envPv.envName === vm.addProjectForm.envName) {
          envPv.pvs.forEach(pv => {
            let pvName = {
              text: pv.pvName,
              value: pv.pvName,
            }
            vm.envPvNames.push(pvName)
          })
        }
      })
      vm.addProjectForm.projectInfo.defaultPv = ''
    },
    rtnPipelinesInfoCard (row) {
      const vm = this
      return {
        title: vuetify.preset.lang.t('$vuetify.lang_view_pipelines_list'),
        content (h) {
          return <VSimpleTable dense>
            <template slot="default">
              <thead>
                <tr>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_branch_name')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_ci_envs')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_production_envs')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_success_fail_abort_count')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_latest_run_time')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_latest_run_result')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_operations')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {row.pipelines.map(item => {
                  var chipColor = ''
                  switch(item.status.result) {
                    case 'FAIL':
                      chipColor = 'red'
                      break;
                    case 'RUNNING':
                      chipColor = 'blue'
                      break;
                    case 'SUCCESS':
                      chipColor = 'green'
                      break;
                    case 'ABORT':
                      chipColor = 'grey'
                      break;
                    case 'INPUT':
                      chipColor = 'orange'
                      break;
                    case 'PAUSE':
                      chipColor = 'blue-grey'
                      break;
                  }
                  return <tr>
                    <td>
                      <router-link to={{name: 'CicdPipeline', params: { pipelineName: item.pipelineName }}}>{ item.pipelineName }</router-link>
                    </td>
                    <td>{ item.branchName }</td>
                    <td>
                      {
                        item.envs.map(item => {
                          return <div class="my-1"><VChip color="primary" small>{ item }</VChip></div>
                        })
                      }
                    </td>
                    <td>
                      {
                        item.envProductions.map(item => {
                          return <div class="my-1"><VChip color="primary" small>{ item }</VChip></div>
                        })
                      }
                    </td>
                    <td>
                      <span class="green--text">{ item.successCount }</span>/
                      <span class="red--text">{ item.failCount }</span>/
                      <span class="grey--text">{ item.abortCount }</span>
                    </td>
                    <td>{ item.status.startTime }</td>
                    <td>
                      <div slot="default">
                        <div>{ item.status.duration }</div>
                        <VChip vShow={item.status.result} small class="mb-1 white--text" color={ chipColor }>
                          { item.status.result }
                        </VChip>
                      </div>
                    </td>
                    <td>
                      <div>
                        <VBtn small color="primary" vOn:click_stop={ () => {
                          request.post(`/cicd/pipeline/${item.pipelineName}`).then(response => {
                            vm.$router.push({
                              name: 'CicdRun',
                              params: {
                                'runName': response.data.runName
                              }
                            })
                          }).catch(error => {
                            vm.errorTip(true, error.response.data.msg)
                          })
                        } }>{ vuetify.preset.lang.t('$vuetify.lang_menu_execute') }</VBtn>
                      </div>
                    </td>
                  </tr>
                })}
              </tbody>
            </template>
          </VSimpleTable>
        }
      }
    },
    // websocket
    showLog (response) {
      const vm =this
      vm.logList = []
      vm.auditDialog = response.data.withAdminLog
      if(response.data.withAdminLog){
        vm.disableBtn = true
        vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${response.data.auditID}?x-user-token=${vm.userToken}`)
        vm.ws.onmessage = (event) => {
          vm.logList.push(JSON.parse(event.data))
        }
        vm.ws.onclose = () => {
          vm.disableBtn = false
          vm.logList.push({logType: 'END'})
        }
      }
    },
    getRepoNames () {
      const vm = this
      request.get('/public/about').then(response => {
        vm.addProjectForm.gitRepoSetting.gitRepoDir = response.data.config.gitRepoDir
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg);
      })
      request.get('/admin/repoNames').then(response => {
        vm.repoNames = response.data
        if (!vm.userObj.isAdmin && vm.userObj.isTenantAdmin) {
          vm.addProjectForm.tenantCode = vm.tenantCodes[0]
        }
        let imageRepoNames = []
        vm.repoNames.imageRepoNames.forEach(item => {
          imageRepoNames.push({text: item, value: item})
        })
        imageRepoNames.push({text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_name_use_external_image_repo'), value: ''})
        vm.repoNames.imageRepoNames = imageRepoNames

        vm.addProjectForm.gitRepoSetting.gitRepoName = ''
        vm.addProjectForm.imageRepoSetting.imageRepoName = ''
        vm.addProjectForm.artifactRepoSetting.artifactRepoName = ''
        vm.addProjectForm.scanCodeRepoSetting.scanCodeRepoName = ''

        vm.addProjectForm.gitRepoSetting.gitRepoType = ''
        if (vm.repoNames.gitRepoNames.length > 0) {
          vm.addProjectForm.gitRepoSetting.gitRepoName = vm.repoNames.gitRepoNames[0]
        }
        if (vm.repoNames.imageRepoNames.length > 0) {
          vm.addProjectForm.imageRepoSetting.imageRepoName = vm.repoNames.imageRepoNames[0]
        }
        if (vm.repoNames.artifactRepoNames.length > 0) {
          vm.addProjectForm.artifactRepoSetting.artifactRepoName = vm.repoNames.artifactRepoNames[0]
        }

        vm.gitRepoTypes = []
        if (vm.repoNames.gitRepoNames.length > 0) {
          vm.gitRepoTypes.push({
            text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_internal_create'),
            value: 'internalCreate',
          })
          vm.gitRepoTypes.push({
            text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_internal_exist'),
            value: 'internalExist',
          })
        }
        vm.gitRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_github_create'),
          value: 'githubCreate',
        })
        vm.gitRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_github_exist'),
          value: 'githubExist',
        })
        vm.gitRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_gitee_create'),
          value: 'giteeCreate',
        })
        vm.gitRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_gitee_exist'),
          value: 'giteeExist',
        })
        vm.gitRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type_external_exist'),
          value: 'externalExist',
        })

        vm.artifactRepoTypes = []
        if (vm.repoNames.artifactRepoNames.length > 0) {
          vm.artifactRepoTypes.push({
            text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type_artifact_repo'),
            value: 'artifactRepo',
          })
        }
        vm.artifactRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type_internal'),
          value: 'internal',
        })
        vm.artifactRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type_http'),
          value: 'http',
        })
        vm.artifactRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type_ftp'),
          value: 'ftp',
        })
        vm.artifactRepoTypes.push({
          text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type_sftp'),
          value: 'sftp',
        })
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    }
  },
  created () {
    const vm = this
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    vm.userToken = vm.userObj.userToken
    request.get(`/admin/archNames`).then(response => {
      vm.archNames = response.data.archNames
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get(`/admin/tenantCodes`).then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get('/admin/projectNames').then(response => {
      vm.projectList = response.data.projectNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.post('/admin/projects',vm.projectsForm).then(response => {
      vm.pageData.rows = response.data.projects
      vm.pageData.totalCount = response.data.totalCount
      vm.tableLoading = false
      vm.pageData.displayRows = vm.pageData.rows.map((row,index) => {
        row.index = index
        return Object.assign({}, row, {
          pipelinesInfoCard: vm.rtnPipelinesInfoCard(row),
          projectTeam: row.projectInfo.projectTeam,
          projectGit: row.projectInfo.projectGroup,
        })
      })
    }).catch(error => {
      console.log(error.response.data)
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/envNames').then(response => {
      vm.newEnvSelectList = response.data.envNames
      response.data.envNames.forEach(envName => {
        request.get(`/admin/env/${envName}/pvNames`).then(resp => {
          let envPv = {
            "envName": envName,
            "pvs": resp.data.pvs,
          }
          vm.envPvs.push(envPv)
        }).catch(err => {
          vm.errorTip(true, err.response.data.msg)
        })
      })
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/projectNamespaces').then(response => {
      vm.projectNamespaceList.push({
        text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_namespace_auto_create'),
        value: '',
      })
      response.data.projectNamespaces.forEach(projectNamespace => {
        vm.projectNamespaceList.push({
          text: projectNamespace,
          value: projectNamespace,
        })
      })
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  render (createElement, context) {
    const vm = this
    return <VCard flat>
      <VCardTitle>
        {vuetify.preset.lang.t('$vuetify.lang_menu_projects_management')}
      </VCardTitle>
      <VDataTable
        headers={[
          { value: 'projectName', text: vuetify.preset.lang.t('$vuetify.lang_view_project_name'), sortable: false },
          { value: 'projectNamespace', text: vuetify.preset.lang.t('$vuetify.lang_view_project_namespace'),sortable: false },
          { value: 'projectGit', text: vuetify.preset.lang.t('$vuetify.lang_view_project_repo'),sortable: false },
          { value: 'env', text: vuetify.preset.lang.t('$vuetify.lang_view_project_available_envs'), sortable: false },
          { value: 'handle', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false }
        ]}
        items={vm.pageData.displayRows}
        server-items-length={vm.pageData.totalCount}
        footerProps={{
          showCurrentPage: true,
          itemsPerPageOptions: [ 5, 10, 15, 20 ]
        }}
        page={vm.projectsForm.page}
        items-per-page={vm.projectsForm.perPage}
        showExpand
        itemKey="index"
        expanded={[0]}
        loading={vm.tableLoading}
        on={{
          'update:options': (value) => {
            vm.projectsForm.page = value.page
            vm.projectsForm.perPage = value.itemsPerPage
            vm.updateOptions()
          }
        }}
        scopedSlots={{
          'item.projectName': ({item}) => {
            return <router-link to={{name: 'AdminProject', params: { projectName: item.projectInfo.projectName }}}>
              <div>
                {item.projectInfo.projectName} (<span>{item.projectInfo.projectShortName}</span>)
              </div>
              <div>{item.projectInfo.projectDesc}</div>
            </router-link>
          },
          'item.projectNamespace': ({item}) => {
            return <span>
              <div>
                {item.projectInfo.projectNamespace} (<span>{item.projectInfo.shortName}</span>)
                <v-tooltip
                  bottom={true}
                  scopedSlots={{
                    activator: ({on, attrs}) => {
                      return <v-icon
                        color='orange'
                        vShow={item.projectInfo.privileged}
                        {...{
                          props: attrs,
                          on
                        }}
                      >
                        mdi-security
                      </v-icon>
                    }
                  }}
                >
                  <div>{vuetify.preset.lang.t('$vuetify.lang_view_project_privileged')}</div>
                </v-tooltip>
              </div>
              <div>{vuetify.preset.lang.t('$vuetify.lang_view_project_team')}: {item.projectInfo.projectTeam}</div>
              <div>{vuetify.preset.lang.t('$vuetify.lang_view_project_arch')}: {item.projectInfo.projectArch}</div>
              <div>{vuetify.preset.lang.t('$vuetify.lang_view_tenant_code')}: {item.tenantCode}</div>
            </span>
          },
          'item.projectGit': ({item}) => {
            return <div class="repo-wrap">
              <div class="mb-1">
                <a target="_Blank" href={item.projectRepo.gitRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_git_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1">
                <a target="_Blank" href={item.projectRepo.imageRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_image_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1" v-show={item.projectRepo.artifactRepo !== ''}>
                <a target="_Blank" href={item.projectRepo.artifactRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_artifact_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1" v-show={item.projectRepo.artifactRepoType === 'internal'}>
                <router-link to={{name: 'CicdArtifact', params: { projectName: item.projectInfo.projectName }}}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_artifact_repo')}</v-chip>
                </router-link>
              </div>
              <div class="mb-1" v-show={item.projectRepo.scanCodeRepo !== ''}>
                <a target="_Blank" href={item.projectRepo.scanCodeRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_scan_code_repo')}</v-chip>
                </a>
              </div>
            </div>
          },
          'item.env': ({item}) => {
            return <div class="d-flex justify-space-between" style="vertical-align: top;">
              {
                item.projectNodePorts.map(i => {
                  let envNodePorts = i.envNodePorts.map(envNodePort => {
                    return <div class="my-1">
                        <v-chip outlined={!envNodePort.isDefault} color={envNodePort.isDefault ? 'success' : 'primary'} small vOn:click={() => {
                          if (!envNodePort.isDefault) {
                            vm.deleteNodePortDialog = true
                            vm.targetProjectName = item.projectInfo.projectName
                            vm.targetEnvName = i.envName
                            vm.recyleNodePort = envNodePort.nodePortStart
                          }
                        }}>
                          {envNodePort.nodePortStart}-{envNodePort.nodePortEnd}
                        </v-chip>
                      </div>
                  })
                  return <div class="mt-4">
                    <Operations
                      operations={[
                        { text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports'), onClick: () => {
                          vm.addNodePortDialog = true
                          vm.targetProjectName = item.projectInfo.projectName
                          vm.targetEnvName = i.envName
                        } },
                        { text: vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs'), onClick: () => {
                          vm.deleteEnvDialog = true
                          vm.confirmValue = ''
                          vm.targetProjectName = item.projectInfo.projectName
                          vm.deleteEnvName = i.envName
                          vm.handleEnvType = '0'
                        } },
                      ]}
                      optButtonText={i.envName}
                    >
                    </Operations>
                    { envNodePorts }
                  </div>
                })
              }
            </div>
          },
          'item.handle': ({item}) => {
            return <div>
              <Operations
                operations={[
                  { text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs'), onClick: () => {
                    request.post('/console/envNames/tenantCode', {tenantCode: item.tenantCode}).then(response => {
                      vm.assignEnvSelectList = response.data.envNames
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                    vm.newEnvDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                  } },
                  { text: vuetify.preset.lang.t('$vuetify.lang_form_update_project'), onClick: () => {
                    vm.updateProjectDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                    vm.targetProjectRepo = item.projectRepo
                    vm.updateProjectForm.privileged = item.projectInfo.privileged
                    vm.updateProjectForm.projectDesc = item.projectInfo.projectDesc
                    vm.updateProjectForm.projectTeam = item.projectInfo.projectTeam
                    vm.updateProjectForm.projectArch = item.projectInfo.projectArch
                    vm.updateProjectForm.gitRepoDir = vm.targetProjectRepo.gitRepoDir
                  } },
                  { text: vuetify.preset.lang.t('$vuetify.lang_form_delete_project'), onClick: () => {
                    vm.deleteProjectDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                  } },
                ]}
              >
              </Operations>
            </div>
          },
          'expanded-item': (config) => {
            return <td colspan={config.headers.length} class="pa-1">
              <InfoCard
                props={ config.item.pipelinesInfoCard }
              />
            </td>
          }
        }}
      >
        <template slot="top">
          <VForm>
            <VContainer fluid>
              <VRow class="flex-wrap">
                <VCol
                  cols="4"
                >
                  <VSelect
                    v-model={vm.projectsForm.projectNames}
                    items={vm.projectList}
                    label={vuetify.preset.lang.t('$vuetify.lang_form_project_name')}
                    multiple
                    dense
                    small-chips
                    vOn:blur={() => {
                      vm.getProjects()
                    }}
                  />
                </VCol>

                <VCol
                  cols="4"
                >
                  <VTextField
                    label={vuetify.preset.lang.t('$vuetify.lang_form_project_team')}
                    dense
                    v-model={vm.projectsForm.projectTeam}
                    vOn:keydown_enter={() => {
                      vm.getProjects()
                    }}
                  />
                </VCol>
                <VCol
                  cols="3"
                >
                  <VBtn color="primary" vOn:click_stop={ () => {
                    vm.addProjectDialog = true
                    vm.getRepoNames()
                  } }>{ vuetify.preset.lang.t('$vuetify.lang_form_new_project') }</VBtn>
                </VCol>
              </VRow>
            </VContainer>
          </VForm>
        </template>
      </VDataTable>
      <VDialog
        v-model={vm.addProjectDialog}
        max-width="800px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_new_project')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="addProjectRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_project_prompt')}</small>
              </v-alert>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_name')}
                      required
                      dense
                      v-model={vm.addProjectForm.projectInfo.projectName}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_name_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_short_name')}
                      required
                      dense
                      v-model={vm.addProjectForm.projectInfo.projectShortName}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_short_name_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc')}
                      required
                      dense
                      v-model={vm.addProjectForm.projectInfo.projectDesc}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team')}
                      required
                      dense
                      v-model={vm.addProjectForm.projectInfo.projectTeam}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_tenant_code')}
                      dense
                      small-chips
                      required={vm.userObj.isTenantAdmin && !vm.userObj.isAdmin}
                      clearable={vm.userObj.isAdmin}
                      items={vm.tenantCodes}
                      v-model={vm.addProjectForm.tenantCode}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_tenant_code_tip_1')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch')}
                      required
                      dense
                      items={vm.archNames}
                      v-model={vm.addProjectForm.projectInfo.projectArch}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch_tip_1')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol cols="12" class="params-item">
                    <VCol cols="12">
                      <VSelect
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoType}
                        items={vm.gitRepoTypes}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type')}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        dense
                        hint={vm.gitRepoTypeHint}
                        persistent-hint
                        vOn:change={() => {
                          vm.updateGitRepoTypeHint()
                        }}
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist'}
                    >
                      <VSelect
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoName}
                        items={vm.repoNames.gitRepoNames}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_name')}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        dense
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_name_tip_1')}
                        persistent-hint
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_path')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoPath}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_path_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_url')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoUrl}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_url_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_source_branch')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoSourceBranch}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_source_branch_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoUser}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoToken}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeCreate' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token_tip_1')}
                        persistent-hint
                        type={"password"}
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoPassword}
                        rules={[v => (!(vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password_tip_1')}
                        persistent-hint
                        type={"password"}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VSelect
                        v-model={vm.addProjectForm.enableArtifactRepoProxy}
                        items={[{text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true}, {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false}]}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_enable_artifact_repo_proxy')}
                        dense
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_enable_artifact_repo_proxy_tip_1')}
                        persistent-hint
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.gitRepoSetting.gitRepoType === 'internalExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'githubExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'giteeExist' || vm.addProjectForm.gitRepoSetting.gitRepoType === 'externalExist'}
                    >
                      <VSelect
                        v-model={vm.addProjectForm.createDemoOnExistGitRepo}
                        items={[{text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true}, {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false}]}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_create_demo_on_exist_git_repo')}
                        dense
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_create_demo_on_exist_git_repo_tip_1')}
                        persistent-hint
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_build_settings_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.buildSettingsDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_database_scripts_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.databaseScriptsDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_demo_codes_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.demoCodesDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_deploy_scripts_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.deployScriptsDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_documents_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.documentsDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_test_scripts_dir')}
                        required
                        dense
                        v-model={vm.addProjectForm.gitRepoSetting.gitRepoDir.testScriptsDir}
                        rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-model={vm.addProjectForm.projectInfo.projectNamespace}
                      items={vm.projectNamespaceList}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_namespace')}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_namespace_tip_1')}
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.addProjectForm.projectInfo.projectNamespace === ''}
                  >
                    <VSelect
                      v-model={vm.addProjectForm.projectInfo.privileged}
                      items={[{text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true}, {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false}]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_privileged')}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_privileged_tip_1')}
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    class="params-item"
                    v-show={vm.addProjectForm.projectInfo.projectNamespace === ''}
                  >
                    <VCol cols="12">
                      <VSelect
                        v-model={vm.addProjectForm.imageRepoSetting.imageRepoName}
                        items={vm.repoNames.imageRepoNames}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_name')}
                        dense
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_name_tip_1')}
                        persistent-hint
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === ''}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.imageRepoSetting.imageRepoHostName}
                        rules={[v => (!(vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === '') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === ''}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.imageRepoSetting.imageRepoGroupName}
                        rules={[v => (!(vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === '') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === ''}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.imageRepoSetting.imageRepoUserName}
                        rules={[v => (!(vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === '') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === ''}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.imageRepoSetting.imageRepoPassword}
                        rules={[v => (!(vm.addProjectForm.imageRepoSetting.imageRepoName === '' || vm.addProjectForm.imageRepoSetting.imageRepoName.value === '') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password_tip_1')}
                        persistent-hint
                        type={"password"}
                      ></VTextField>
                    </VCol>
                  </VCol>
                  <VCol
                    cols="12"
                    class="params-item"
                    v-show={vm.addProjectForm.projectInfo.projectNamespace === ''}
                  >
                    <VCol cols="12">
                      <VSelect
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoType}
                        items={vm.artifactRepoTypes}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_type')}
                        rules={[v => (!(vm.addProjectForm.projectInfo.projectNamespace === '' || vm.addProjectForm.projectInfo.projectNamespace.value === '') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        dense
                        vOn:change={() => {
                          vm.updateGitRepoTypeHint()
                        }}
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'artifactRepo'}
                    >
                      <VSelect
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoName}
                        items={vm.repoNames.artifactRepoNames}
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_name')}
                        dense
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_name_tip_1')}
                        persistent-hint
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoHostName}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_port') + '*'}
                        required
                        dense
                        type="number"
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoPort}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoPath}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_user_name') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoUserName}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_password') + '*'}
                        required
                        dense
                        type="password"
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoPassword}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'ftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'sftp' || vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_url') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoHttpUpload.url}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VSelect
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_method') + '*'}
                        dense
                        vModel={vm.addProjectForm.artifactRepoSetting.artifactRepoHttpUpload.method}
                        items={
                          ['PUT', 'POST']
                        }
                      ></VSelect>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VSelect
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_insecure') + '*'}
                        dense
                        vModel={vm.addProjectForm.artifactRepoSetting.artifactRepoHttpUpload.insecure}
                        items={
                          [
                            {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                            {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                          ]
                        }
                      ></VSelect>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VTextField
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_url') + '*'}
                        required
                        dense
                        v-model={vm.addProjectForm.artifactRepoSetting.artifactRepoHttpDownload.url}
                        rules={[v => (!(vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http') || !!v) || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                        hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1')}
                        persistent-hint
                      ></VTextField>
                    </VCol>
                    <VCol
                      cols="12"
                      v-show={vm.addProjectForm.artifactRepoSetting.artifactRepoType === 'http'}
                    >
                      <VSelect
                        label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_insecure') + '*'}
                        dense
                        vModel={vm.addProjectForm.artifactRepoSetting.artifactRepoHttpDownload.insecure}
                        items={
                          [
                            {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                            {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                          ]
                        }
                      ></VSelect>
                    </VCol>

                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-model={vm.addProjectForm.scanCodeRepoSetting.scanCodeRepoName}
                      items={vm.repoNames.scanCodeRepoNames}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name')}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name_tip_1')}
                      persistent-hint
                    />
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-model={vm.addProjectForm.envName}
                      items={vm.newEnvSelectList}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_env_name')}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_env_name_tip_1')}
                      persistent-hint
                      vOn:change={() => {
                        vm.updateEnvPvNames()
                      }}
                    />
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      v-show={vm.addProjectForm.projectInfo.projectNamespace === ''}
                      v-model={vm.addProjectForm.projectInfo.defaultPv}
                      items={vm.envPvNames}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_default_pv')}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_default_pv_tip_1')}
                      persistent-hint
                    />
                  </VCol>
                </VRow>
              </VContainer>
            </VForm>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.addProjectDialog = false
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                if(vm.$refs.addProjectRef.validate()) {
                  if (typeof(vm.addProjectForm.imageRepoSetting.imageRepoName) === 'object') {
                    vm.addProjectForm.imageRepoSetting.imageRepoName = vm.addProjectForm.imageRepoSetting.imageRepoName.value
                  }
                  vm.addProjectForm.artifactRepoSetting.artifactRepoPort = Number(vm.addProjectForm.artifactRepoSetting.artifactRepoPort)
                  request.post('/admin/project', vm.addProjectForm).then(response => {
                    vm.successTip(true, response.msg)
                    vm.addProjectDialog = false
                    vm.showLog(response)
                    request.get('/admin/projectNamespaces').then(response => {
                      vm.projectNamespaceList = []
                      vm.projectNamespaceList.push({
                        text: vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_namespace_auto_create'),
                        value: '',
                      })
                      response.data.projectNamespaces.forEach(projectNamespace => {
                        vm.projectNamespaceList.push({
                          text: projectNamespace,
                          value: projectNamespace,
                        })
                      })
                    }).catch(error => {
                      vm.errorTip(true, error.response.data.msg)
                    })
                  }).catch(error => {
                    vm.errorTip(true, error.response.data.msg)
                  })
                } else {
                  vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
                }
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.deleteNodePortDialog}
        max-width="600px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_delete_project_node_ports')}</span>
          </VCardTitle>
          <VCardText>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_project_node_ports_prompt')}</small>
            </v-alert>
            <div>
              {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_node_ports_tip_1', vm.targetProjectName, vm.targetEnvName, vm.recyleNodePort)}
            </div>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.deleteNodePortDialog = false
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                request.post(`/admin/project/${vm.targetProjectName}/nodePortDelete`, {envName: vm.targetEnvName, nodePort: vm.recyleNodePort}).then(response => {
                  vm.deleteNodePortDialog = false
                  vm.successTip(true, response.msg)
                  vm.showLog(response)
                  vm.updateOptions()
                }).catch(error => {
                  vm.errorTip(true, error.response.data.msg)
                })
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.deleteEnvDialog}
        width="600px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vm.handleEnvType == 0 ? vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs') : vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_all')}</span>
          </VCardTitle>
          <VCardText>
            <v-alert icon="mdi-alert-circle" prominent text type={vm.handleEnvType == 1 ? 'error' : 'info'}>
              <small vShow={vm.handleEnvType == 0}>
                {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_prompt')}
              </small>
              <small vShow={vm.handleEnvType == 1}>
                {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_all_prompt')}<v-chip small color="red">{vuetify.preset.lang.t('$vuetify.lang_form_dangerous_operation')}</v-chip>
              </small>
            </v-alert>
            <v-container>
              <v-form ref="deleteEnvRef">
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model={ vm.handleEnvType }
                      items={ [{text: vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs'), value: '0'}, {text: vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_all'), value: '1'}] }
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_select')}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" vShow={vm.handleEnvType == 1}>
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_env')}
                      required
                      dense
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      vModel={vm.confirmValue}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteEnvName)}
                      persistent-hint
                    ></VTextField>
                  </v-col>
                </v-row>
                <div vShow={vm.handleEnvType == 0}>
                  {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_tip_1', vm.targetProjectName, vm.deleteEnvName)}
                </div>
                <div vShow={vm.handleEnvType == 1}>
                  {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_all_tip_1', vm.targetProjectName, vm.deleteEnvName)}
                </div>
              </v-form>
            </v-container>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.deleteEnvDialog = false
                vm.confirmValue = ''
                vm.$refs.deleteEnvRef.resetValidation()
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                if(vm.handleEnvType == '0'){
                  request.post(`/admin/project/${vm.targetProjectName}/envDelete`, { envName: vm.deleteEnvName }).then(response => {
                    vm.successTip(true, response.msg)
                    vm.showLog(response)
                    vm.updateOptions()
                    vm.deleteEnvDialog = false
                  }).catch(error => {
                    vm.errorTip(true, error.response.data.msg)
                  })
                }else{
                  if(vm.deleteEnvName == vm.confirmValue){
                    request.post(`/admin/project/${vm.targetProjectName}/envDeleteAll`, { envName: vm.deleteEnvName }).then(response => {
                      vm.successTip(true, response.msg)
                      vm.showLog(response)
                      vm.updateOptions()
                      vm.confirmValue = ''
                      vm.$refs.deleteEnvRef.resetValidation()
                      vm.deleteEnvDialog = false
                    }).catch(error => {
                      vm.errorTip(true, error.response.data.msg)
                    })
                  }else{
                    vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteEnvName))
                  }
                }
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.addNodePortDialog}
        max-width="600px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports')}</span>
          </VCardTitle>
          <VCardText>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports_prompt')}</small>
            </v-alert>
            <div>
              {vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports_tip_1', vm.targetProjectName, vm.targetEnvName)}
            </div>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.addNodePortDialog = false
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.addNodePortDialog = false
                vm.tableLoading = true
                request.post(`/admin/project/${vm.targetProjectName}/nodePortAdd`, {envName: vm.targetEnvName}).then(response => {
                  vm.successTip(true, response.msg)
                  vm.tableLoading = false
                  vm.showLog(response)
                  vm.updateOptions()
                }).catch(error => {
                  vm.tableLoading = false
                  vm.errorTip(true, error.response.data.msg)
                })
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <v-dialog
        v-model={vm.newEnvDialog}
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs')}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_prompt')}</small>
            </v-alert>
            <v-form ref="chooseEnvRef">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model={ vm.newEnvSelect }
                    items={ vm.assignEnvSelectList }
                    label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_env_names')}
                    multiple
                    persistent-hint
                    small-chips
                    dense
                    required
                    rules={[v => v.length > 0 || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <div>
              {vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_tip_1', vm.targetProjectName)}
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              vOn:click={() => {
                vm.newEnvDialog = false
                vm.$refs.chooseEnvRef.reset()
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </v-btn>
            <v-btn
              color="primary"
              text
              vOn:click={() => {
                if(vm.newEnvSelect.length > 0){
                  vm.tableLoading = true
                  request.post(`/admin/project/${vm.targetProjectName}/envAdd`, { envNames: vm.newEnvSelect }).then(response => {
                    vm.newEnvDialog = false
                    vm.successTip(true, response.msg)
                    vm.showLog(response)
                    vm.$refs.chooseEnvRef.reset()
                    vm.updateOptions()
                  }).catch(error => {
                    vm.tableLoading = false
                    vm.errorTip(true, error.response.data.msg)
                  })
                }else{
                  vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_input'))
                }
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <VDialog
        v-model={vm.updateProjectDialog}
        max-width="600px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_update_project')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="updateProjectRef">
              <small></small>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_privileged')}
                      dense
                      vModel={vm.updateProjectForm.privileged}
                      items={
                        [
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                        ]
                      }
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_privileged_tip_1')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc')}
                      required
                      dense
                      vModel={vm.updateProjectForm.projectDesc}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team')}
                      required
                      dense
                      vModel={vm.updateProjectForm.projectTeam}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch')}
                      required
                      dense
                      items={vm.archNames}
                      v-model={vm.updateProjectForm.projectArch}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch_tip_1')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.gitRepoType === 'githubCreate' || vm.targetProjectRepo.gitRepoType === 'githubExist' || vm.targetProjectRepo.gitRepoType === 'giteeCreate' || vm.targetProjectRepo.gitRepoType === 'giteeExist' || vm.targetProjectRepo.gitRepoType === 'externalExist'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user')}
                      dense
                      v-model={vm.updateProjectForm.gitRepoUser}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.gitRepoType === 'githubCreate' || vm.targetProjectRepo.gitRepoType === 'githubExist' || vm.targetProjectRepo.gitRepoType === 'giteeCreate' || vm.targetProjectRepo.gitRepoType === 'giteeExist'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token')}
                      dense
                      v-model={vm.updateProjectForm.gitRepoToken}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                      type={"password"}
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.gitRepoType === 'externalExist'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password')}
                      dense
                      v-model={vm.updateProjectForm.gitRepoPassword}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                      type={"password"}
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_build_settings_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.buildSettingsDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_database_scripts_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.databaseScriptsDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_demo_codes_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.demoCodesDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_deploy_scripts_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.deployScriptsDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_documents_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.documentsDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_test_scripts_dir')}
                      required
                      dense
                      v-model={vm.updateProjectForm.gitRepoDir.testScriptsDir}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.imageRepoName === ''}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name')}
                      dense
                      v-model={vm.updateProjectForm.imageRepoHostName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.imageRepoName === ''}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name')}
                      dense
                      v-model={vm.updateProjectForm.imageRepoGroupName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.imageRepoName === ''}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name')}
                      dense
                      v-model={vm.updateProjectForm.imageRepoUserName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.imageRepoName === ''}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password')}
                      dense
                      v-model={vm.updateProjectForm.imageRepoPassword}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                      type={"password"}
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'ftp' || vm.targetProjectRepo.artifactRepoType === 'sftp'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name')}
                      dense
                      v-model={vm.updateProjectForm.artifactRepoHostName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'ftp' || vm.targetProjectRepo.artifactRepoType === 'sftp'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_port')}
                      dense
                      type="number"
                      v-model={vm.updateProjectForm.artifactRepoPort}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'ftp' || vm.targetProjectRepo.artifactRepoType === 'sftp'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path')}
                      dense
                      v-model={vm.updateProjectForm.artifactRepoPath}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'ftp' || vm.targetProjectRepo.artifactRepoType === 'sftp' || vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_user_name')}
                      dense
                      v-model={vm.updateProjectForm.artifactRepoUserName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'ftp' || vm.targetProjectRepo.artifactRepoType === 'sftp' || vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_password')}
                      dense
                      type="password"
                      v-model={vm.updateProjectForm.artifactRepoPassword}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_url')}
                      dense
                      v-model={vm.updateProjectForm.artifactRepoHttpUpload.url}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_method')}
                      dense
                      vModel={vm.updateProjectForm.artifactRepoHttpUpload.method}
                      items={
                        ['PUT', 'POST']
                      }
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_insecure')}
                      dense
                      vModel={vm.updateProjectForm.artifactRepoHttpUpload.insecure}
                      items={
                        [
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                        ]
                      }
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_url')}
                      dense
                      v-model={vm.updateProjectForm.artifactRepoHttpDownload.url}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VSelect
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_insecure')}
                      dense
                      vModel={vm.updateProjectForm.artifactRepoHttpDownload.insecure}
                      items={
                        [
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                          {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                        ]
                      }
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VSelect>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.scanCodeRepoName === ''}
                  >
                    <VSelect
                      v-model={vm.updateProjectForm.scanCodeRepoName}
                      items={vm.repoNames.scanCodeRepoNames}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name')}
                      dense
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    />
                  </VCol>
                </VRow>
              </VContainer>
            </VForm>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.updateProjectDialog = false
                vm.$refs.updateProjectRef.resetValidation()
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                if(vm.$refs.updateProjectRef.validate()){
                  vm.tableLoading = true
                  vm.updateProjectDialog = false
                  vm.updateProjectForm.artifactRepoPort = Number(vm.updateProjectForm.artifactRepoPort)
                  request.post(`/admin/project/${vm.targetProjectName}`, vm.updateProjectForm).then(response => {
                    vm.tableLoading = false
                    vm.successTip(true, response.msg)
                    vm.$refs.updateProjectRef.resetValidation()
                    vm.showLog(response)
                    vm.updateOptions()
                  }).catch(error => {
                    vm.tableLoading = false
                    vm.errorTip(true, error.response.data.msg)
                  })
                } else {
                  vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
                }
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.deleteProjectDialog}
        max-width="600px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_delete_project')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="deleteProjectRef">
              <v-alert icon="mdi-alert-circle" prominent text type="error">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_project_prompt')}<v-chip small color="red">{vuetify.preset.lang.t('$vuetify.lang_form_dangerous_operation')}</v-chip></small>
              </v-alert>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      vModel={vm.deleteProjectForm.gitRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_git_repo_delete')}
                      dense
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      vModel={vm.deleteProjectForm.scanCodeRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_scan_code_repo_delete')}
                      dense
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      vModel={vm.deleteProjectForm.imageRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_image_repo_delete')}
                      dense
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      vModel={vm.deleteProjectForm.artifactRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_artifact_repo_delete')}
                      dense
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VSelect
                      vModel={vm.deleteProjectForm.namespaceDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_namespace_delete')}
                      dense
                    ></VSelect>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_project_name')}
                      required
                      dense
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      vModel={vm.deleteProjectName}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetProjectName)}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                </VRow>
              </VContainer>
              <div>
                {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_tip_1', vm.targetProjectName)}
              </div>
            </VForm>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.deleteProjectDialog = false
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_cancel') }
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                if(vm.$refs.deleteProjectRef.validate() && (vm.targetProjectName === vm.deleteProjectName)){
                  request.post(`/admin/project/${vm.deleteProjectName}/delete`, vm.deleteProjectForm).then(response => {
                    vm.successTip(true, response.msg)
                    vm.deleteProjectDialog = false
                    vm.showLog(response)
                    vm.updateOptions()
                  }).catch(error => {
                    vm.errorTip(true, error.response.data.msg)
                  })
                } else {
                  vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetProjectName))
                }
              }}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.auditDialog}
        max-width="800px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_view_logs')}</span>
          </VCardTitle>
          <VCardText id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 500px;">
            {
              vm.logList.map((item, i) => {
                let logColor = ''
                switch (item.logType) {
                  case 'FAIL':
                    logColor = 'red'
                    break
                  case 'INFO':
                    logColor = 'green'
                    break
                }
                return <pre style={{color: logColor}} id={'log'+i} >[{item.logType}] {item.endTime}  {item.content}</pre>
              })
            }
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.auditDialog = false
                vm.ws.close()
                vm.updateOptions()
              }}
              disabled={this.disableBtn}
              loading={this.disableBtn}
            >
              { vuetify.preset.lang.t('$vuetify.lang_menu_confirm') }
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCard>
  }
}
</script>

<style scoped>
#log-container .CodeMirror {
  height: auto;
}
#log-container .CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}

.params-item {
  padding: 8px;
  border: 1px solid #d2c7c7;
  border-radius: 5px;
  margin-bottom: 16px;
}

</style>
