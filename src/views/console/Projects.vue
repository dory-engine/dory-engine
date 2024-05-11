<script>
import ChipPairs from '@/lib/ui-lib/components/ChipPairs'
import InfoCard from '@/lib/ui-lib/components/InfoCard'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Projects',
  components: { InfoSingleTable, InfoCard, ChipPairs, Operations },
  data () {
    return {
      pageData: {
        totalCount: 0,
        rows: [],
        displayRows: []
      },
      projectsForm: {
        projectNames: [],
        projectTeam: '',
        page: 1,
        perPage: 10
      },
      tableLoading: true,
      repoNames: {},
      archNames: [],
      disabledDefNames: [],
      disableBtn: false,
      projectAttachment: [],
      targetProjectName: '',
      targetProjectRepo: {
        gitRepoType: '',
        imageRepoName: '',
        artifactRepoType: '',
        scanCodeRepoName: '',
      },
      auditDialog: false,
      ws: null,
      userToken: '',
      logList: [],
      btnLoading: false,
      addUserForm:{
        username: '',
        name: '',
        mail: '',
        mobile: '',
        tenantCode: '',
        title: '',
        content: '',
        attachmentIDs: []
      },
      userAttachment: [],
      envDeleteForm: {
        envName: '',
        title: '',
        content: '',
        attachmentIDs: []
      },
      envDeleteAttachment: [],
      projectForm: '',
      deleteNodePortDialog: false,
      deleteEnvDialog: false,
      addNodePortDialog: false,
      projectList: [],
      newEnvDialog: false,
      newEnvSelectList: [],
      updateProjectDialog: false,
      deleteProjectDialog: false,
      updateProjectEnvDialog: false,
      addUser: false,
      handleEnvType: '0',
      nodePortDeleteForm: {
        envName: '',
        nodePort: '',
        title: '',
        content: '',
        attachmentIDs: []
      },
      nodePortDeleteAttachment: [],
      nodePortAddForm: {
        envName: '',
        title: '',
        content: '',
        attachmentIDs: []
      },
      nodePortAddAttachment: [],
      envAddForm: {
        envNames: [],
        title: '',
        content: '',
        attachmentIDs: []
      },
      envAddAttachment: [],
      deleteProjectForm: {
        gitRepoDelete: false,
        scanCodeRepoDelete: false,
        imageRepoDelete: false,
        artifactRepoDelete: false,
        namespaceDelete: false,
        title: '',
        content: '',
        attachmentIDs: []
      },
      deleteAttachment: [],
      updateProjectForm: {
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
        title: '',
        content: '',
        attachmentIDs: []
      },
      updateProjectAttachment: [],
      updateProjectEnvForm: {
        envName: '',
        privileged: false,
        disabledDefs: [],
        disabledPatches: [],
        title: '',
        content: '',
        attachmentIDs: []
      },
      updateProjectEnvAttachment: [],
      otherApplyForm: {
        title: '',
        content: '',
        attachmentIDs: []
      },
      otherAttachment: [],
      otherApplyDialog: false
    }
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    request.get('/public/about').then(response => {
      vm.disabledDefNames = response.data.config.disabledDefNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get(`/console/archNames`).then(response => {
      vm.archNames = response.data.archNames
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get('/console/projectNames').then(response => {
      vm.projectList = response.data.projectNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.post('/console/projects', vm.projectsForm).then(response => {
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
      vm.tableLoading = false
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    getProjects() {
      const vm = this
      vm.tableLoading = true
      request.post('console/projects', vm.projectsForm).then(response => {
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
        vm.successTip(true, response.msg)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
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
                      break
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
                        } }>{vuetify.preset.lang.t('$vuetify.lang_menu_execute')}</VBtn>
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
    updateOptions() {
      const vm = this
      vm.tableLoading = true
      request.post('console/projects', vm.projectsForm).then(response => {
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
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    showLog (response) {
      const vm =this
      vm.logList = []
      vm.auditDialog = response.data.withAdminLog
      if(response.data.withAdminLog){
        vm.disableBtn = true
        vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/console/${response.data.auditID}?x-user-token=${vm.userToken}`)
        vm.ws.onmessage = (event) => {
          vm.logList.push(JSON.parse(event.data))
        }
        vm.ws.onclose = () => {
          vm.disableBtn = false
          vm.logList.push({logType: 'END'})
        }
      }
    },
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
            return <router-link to={{name: 'ConsoleProject', params: { projectName: item.projectInfo.projectName }}}>
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
            return <div>
              {
                item.projectAvailableEnvs.map(i => {
                  return <div class="my-1"><v-chip outlined color="orange" small vOn:click={() => {
                    vm.deleteEnvDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                    vm.envDeleteForm.envName = i.envName
                    vm.handleEnvType = '0'
                  }}>{i.envName}</v-chip></div>
                })
              }
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
                            vm.nodePortDeleteForm.envName = i.envName
                            vm.nodePortDeleteForm.nodePort = envNodePort.nodePortStart
                          }
                        }}>
                          {envNodePort.nodePortStart}-{envNodePort.nodePortEnd}
                        </v-chip>
                      </div>
                  })
                  return <div class="mt-4">
                    <Operations
                      operations={[
                        { text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_node_ports'), onClick: () => { 
                          vm.addNodePortDialog = true
                          vm.targetProjectName = item.projectInfo.projectName
                          vm.nodePortAddForm.envName = i.envName
                        } }, 
                        { text: vuetify.preset.lang.t('$vuetify.lang_menu_update_project_env'), onClick: () => {
                          vm.targetProjectName = item.projectInfo.projectName
                          item.projectAvailableEnvs.forEach(pae => {
                          if (pae.envName === i.envName) {
                              vm.updateProjectEnvForm.envName = pae.envName
                              vm.updateProjectEnvForm.privileged = pae.privileged
                              vm.updateProjectEnvForm.disabledDefs = pae.disabledDefs
                              vm.updateProjectEnvForm.disabledPatches = pae.disabledPatches
                            }
                          })
                          if (vm.updateProjectEnvForm.envName === '') {
                            vm.errorTip(true, `envName ${i.envName} not exists`)
                          } else {
                            vm.updateProjectEnvDialog = true
                          }
                        } },
                        { text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs'), onClick: () => { 
                          vm.deleteEnvDialog = true
                          vm.confirmValue = ''
                          vm.targetProjectName = item.projectInfo.projectName
                          vm.envDeleteForm.envName = i.envName
                          vm.handleEnvType = '0'
                        } }, 
                      ]}
                      color="yellow"
                      optButtonText={i.envName}
                      optButtonIcon={(i.privileged ? 'mdi-security' : '')}
                    >
                    </Operations>
                    { envNodePorts }
                  </div>
                })
              }
            </div>
          },
          'item.handle': ({item}) => {
            return <div class="console-projects">
              <Operations
                operations={[
                  { text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_envs'), onClick: () => {
                    request.post('/console/envNames/tenantCode', {tenantCode: item.tenantCode}).then(response => {
                      vm.newEnvSelectList = response.data.envNames
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                    vm.newEnvDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                  } },
                  { text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_update_project'), onClick: () => {
                    vm.updateProjectDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                    vm.targetProjectRepo = item.projectRepo
                    vm.updateProjectForm.projectDesc = item.projectInfo.projectDesc
                    vm.updateProjectForm.projectTeam = item.projectInfo.projectTeam
                    vm.updateProjectForm.projectArch = item.projectInfo.projectArch
                    vm.updateProjectForm.gitRepoDir = vm.targetProjectRepo.gitRepoDir
                  } },
                  { text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project'), onClick: () => {
                    vm.deleteProjectDialog = true
                    vm.targetProjectName = item.projectInfo.projectName
                  } },
                ]}
                  color='yellow'
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
                <VCol cols="4">
                  <VAutocomplete
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
                <VCol cols="3">
                  <VTextField
                    label={vuetify.preset.lang.t('$vuetify.lang_form_project_team')}
                    dense
                    v-model={vm.projectsForm.projectTeam}
                    vOn:keydown_enter={() => {
                      vm.getProjects()
                    }}
                  />
                </VCol>
                <VCol cols="5">
                  <VBtn color="yellow" class="mr-4" vOn:click_stop={ ()=> {
                    vm.addUser = true
                  } }>{vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_user')}</VBtn>
                  <VBtn class="my-1" color="yellow" vOn:click_stop={ ()=> {
                    vm.otherApplyDialog = true
                  } }>{vuetify.preset.lang.t('$vuetify.lang_menu_apply_other')}</VBtn>
                </VCol>
              </VRow>
            </VContainer>
          </VForm>
        </template>
      </VDataTable>
      <VDialog
        v-model={vm.addUser}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_user')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="addUserRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_user_prompt')}</small>
              </v-alert>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_username')}
                      required
                      dense
                      v-model={vm.addUserForm.username}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_username_tip_1')}
                      persistent-hint
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_name')}
                      required
                      dense
                      v-model={vm.addUserForm.name}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_name_tip_1')}
                      persistent-hint
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mail')}
                      required
                      dense
                      v-model={vm.addUserForm.mail}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mail_tip_1')}
                      persistent-hint
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required'), v => /.+@.+/.test(v) || vuetify.preset.lang.t('$vuetify.lang_tip_format_not_correct')]}
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mobile')}
                      required
                      dense
                      v-model={vm.addUserForm.mobile}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mobile_tip_1')}
                      persistent-hint
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_tenant_code')}
                      required
                      dense
                      v-model={vm.addUserForm.tenantCode}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_tenant_code_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.addUserForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.addUserForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.userAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.addUser = false
                vm.$refs.addUserRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.addUserRef.validate()){
                  if(vm.userAttachment.length <= 0){
                    request.post('/console/user', vm.addUserForm).then(response => {
                      vm.addUser = false
                      vm.successTip(true,response.msg)
                      vm.$refs.addUserRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.userAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.addUserForm.attachmentIDs = response.data.attachmentIDs
                      request.post('/console/user', vm.addUserForm).then(response => {
                        vm.addUser = false
                        vm.successTip(true,response.msg)
                        vm.$refs.addUserRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.otherApplyDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_other')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="otherRef">
              <small></small>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.otherApplyForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.otherApplyForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.otherAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.otherApplyDialog = false
                vm.$refs.otherRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.otherRef.validate()){
                  if(vm.otherAttachment.length <= 0){
                    request.post('/console/apply', vm.otherApplyForm).then(response => {
                      vm.otherApplyDialog = false
                      vm.successTip(true,response.msg)
                      vm.$refs.otherRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.otherAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.otherApplyForm.attachmentIDs = response.data.attachmentIDs
                      request.post('/console/apply', vm.otherApplyForm).then(response => {
                        vm.otherApplyDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.otherRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.deleteNodePortDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_node_ports')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="nodePortDeleteRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_project_node_ports_prompt')}</small>
              </v-alert>
              <div>
                {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_node_ports_tip_1', vm.targetProjectName, vm.nodePortDeleteForm.envName, vm.nodePortDeleteForm.nodePort)}
              </div>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.nodePortDeleteForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.nodePortDeleteForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.nodePortDeleteAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.deleteNodePortDialog = false
                vm.$refs.nodePortDeleteRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.nodePortDeleteRef.validate()){
                  if(vm.nodePortDeleteAttachment.length <= 0){
                    request.post(`/console/project/${vm.targetProjectName}/nodePortDelete`, vm.nodePortDeleteForm).then(response => {
                      vm.deleteNodePortDialog = false
                      vm.successTip(true,response.msg)
                      vm.$refs.nodePortDeleteRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.nodePortDeleteAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.nodePortDeleteForm.attachmentIDs = response.data.attachmentIDs
                      request.post(`/console/project/${vm.targetProjectName}/nodePortDelete`, vm.nodePortDeleteForm).then(response => {
                        vm.deleteNodePortDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.nodePortDeleteRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.deleteEnvDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vm.handleEnvType == 0 ? vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs') : vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs_all')}</span>
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
            <div vShow={vm.handleEnvType == 0}>
              {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_tip_1', vm.targetProjectName, vm.envDeleteForm.envName)}
            </div>
            <div vShow={vm.handleEnvType == 1}>
              {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_all_tip_1', vm.targetProjectName, vm.envDeleteForm.envName)}
            </div>
            <VForm ref="envDeleteRef">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_required_tip')}</small>
              <VCol cols="12">
                <v-autocomplete
                  v-model={ vm.handleEnvType }
                  items={ [{text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs'), value: '0'}, {text: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs_all'), value: '1'}] }                  
                  label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_envs_select')}
                  rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                  dense
                ></v-autocomplete>
              </VCol>
              <VCol cols="12">
                <VTextField
                  label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                  required
                  dense
                  v-model={vm.envDeleteForm.title}
                  rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                  hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                  persistent-hint
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                  required
                  dense
                  v-model={vm.envDeleteForm.content}
                  rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                  hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                  persistent-hint
                ></VTextarea>
              </VCol>
              <VCol cols="12">
                <v-file-input
                  label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                  required
                  dense
                  multiple
                  small-chips
                  show-size
                  v-model={vm.envDeleteAttachment}
                  hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                  persistent-hint
                ></v-file-input>
              </VCol>
            </VForm>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.deleteEnvDialog = false
                vm.$refs.envDeleteRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.envDeleteRef.validate()){
                  if(vm.handleEnvType == '0'){
                    if(vm.envDeleteAttachment.length <= 0){
                      request.post(`/console/project/${vm.targetProjectName}/envDelete`, vm.envDeleteForm).then(response => {
                        vm.deleteEnvDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.envDeleteRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }else{
                      vm.btnLoading = true
                      var formData = new FormData();
                      vm.envDeleteAttachment.forEach(attachment => {
                        formData.append('attachment[]', attachment);
                      })
                      request.post('/console/attachment',formData).then(response => {
                        vm.btnLoading = false
                        vm.envDeleteForm.attachmentIDs = response.data.attachmentIDs
                        request.post(`/console/project/${vm.targetProjectName}/envDelete`, vm.envDeleteForm).then(response => {
                          vm.deleteEnvDialog = false
                          vm.successTip(true,response.msg)
                          vm.$refs.envDeleteRef.reset()
                        }).catch(error => {
                          vm.errorTip(true,error.response.data.msg)
                        })
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }
                  }else{
                    if(vm.envDeleteAttachment.length <= 0){
                      request.post(`/console/project/${vm.targetProjectName}/envDeleteAll`, vm.envDeleteForm).then(response => {
                        vm.deleteEnvDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.envDeleteRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }else{
                      vm.btnLoading = true
                      var formData = new FormData();
                      vm.envDeleteAttachment.forEach(attachment => {
                        formData.append('attachment[]', attachment);
                      })
                      request.post('/console/attachment',formData).then(response => {
                        vm.btnLoading = false
                        vm.envDeleteForm.attachmentIDs = response.data.attachmentIDs
                        request.post(`/console/project/${vm.targetProjectName}/envDeleteAll`, vm.envDeleteForm).then(response => {
                          vm.deleteEnvDialog = false
                          vm.successTip(true,response.msg)
                          vm.$refs.envDeleteRef.reset()
                        }).catch(error => {
                          vm.errorTip(true,error.response.data.msg)
                        })
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.updateProjectEnvDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_update_project_env', vm.updateProjectEnvForm.envName)}</span>
          </VCardTitle>
          <VCardText>
            <v-form ref="updateProjectEnvRef">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_required_tip')}</small>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model={vm.updateProjectEnvForm.privileged}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_privileged')}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_privileged_tip_1')}
                      persistent-hint
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model={vm.updateProjectEnvForm.disabledDefs}
                      items={vm.disabledDefNames}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_defs')}
                      dense
                      multiple
                      small-chips
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_defs_tip_1')}
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_patches')}
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model={vm.updateProjectEnvForm.disabledPatches}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_patches_tip_1')}
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.updateProjectEnvForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.updateProjectEnvForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.updateProjectEnvAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.$refs.updateProjectEnvRef.resetValidation()
                vm.updateProjectEnvDialog = false
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              vOn:click={() => {
                vm.tableLoading = true
                request.post(`/console/project/${vm.targetProjectName}/envUpdate`, vm.updateProjectEnvForm).then(response => {
                  vm.updateProjectEnvDialog = false
                  vm.updateProjectEnvForm.envName = ''
                  vm.updateProjectEnvForm.privileged = false
                  vm.updateProjectEnvForm.disabledDefs = []
                  vm.updateProjectEnvForm.disabledPatches = []
                  vm.successTip(true,response.msg)
                  vm.showLog(response)
                  vm.updateOptions()
                }).catch(error => {
                  vm.tableLoading = false
                  vm.errorTip(true, error.response.data.msg)
                })
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.addNodePortDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_node_ports')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="nodePortAddRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports_prompt')}</small>
              </v-alert>
              <div>
                {vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_ports_tip_1', vm.targetProjectName, vm.nodePortAddForm.envName)}
              </div>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.nodePortAddForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.nodePortAddForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.nodePortAddAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.addNodePortDialog = false
                vm.$refs.nodePortAddRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.nodePortAddRef.validate()){
                  if(vm.nodePortAddAttachment.length <= 0){
                    request.post(`/console/project/${vm.targetProjectName}/nodePortAdd`, vm.nodePortAddForm).then(response => {
                      vm.addNodePortDialog = false
                      vm.successTip(true,response.msg)
                      vm.$refs.nodePortAddRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.nodePortAddAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.nodePortAddForm.attachmentIDs = response.data.attachmentIDs
                      request.post(`/console/project/${vm.targetProjectName}/nodePortAdd`, vm.nodePortAddForm).then(response => {
                        vm.addNodePortDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.nodePortAddRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <v-dialog
        v-model={vm.newEnvDialog}
        max-width="600"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_envs')}</span>
          </v-card-title>
          <v-card-text>
          <VForm ref="envAddRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_prompt')}</small>
              </v-alert>
              <div>
                {vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_tip_1', vm.targetProjectName)}
              </div>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <v-autocomplete
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_envs_env_names')}
                      items={ vm.newEnvSelectList }
                      multiple
                      small-chips
                      dense
                      v-model={ vm.envAddForm.envNames }
                      rules={[v => v.length > 0 || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    ></v-autocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.envAddForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.envAddForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.envAddAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
                  </VCol>
                </VRow>
              </VContainer>
            </VForm>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              vOn:click={() => {
                vm.newEnvDialog = false
                vm.$refs.envAddRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </v-btn>
            <v-btn
              color="primary"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.envAddRef.validate()){
                  if(vm.envAddAttachment.length <= 0){
                    request.post(`/console/project/${vm.targetProjectName}/envAdd`, vm.envAddForm).then(response => {
                      vm.newEnvDialog = false
                      vm.successTip(true,response.msg)
                      vm.$refs.envAddRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.envAddAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.envAddForm.attachmentIDs = response.data.attachmentIDs
                      request.post(`/console/project/${vm.targetProjectName}/envAdd`, vm.envAddForm).then(response => {
                        vm.newEnvDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.envAddRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <VDialog
        v-model={vm.updateProjectDialog}
        max-width="600px"
        persistent
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_update_project')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="updateProjectRef">
              <small>{vuetify.preset.lang.t('$vuetify.lang_form_required_tip')}</small>
              <VContainer>
                <VRow>
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
                    <VAutocomplete
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch')}
                      required
                      dense
                      items={vm.archNames}
                      v-model={vm.updateProjectForm.projectArch}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_arch_tip_1')}
                      persistent-hint
                    ></VAutocomplete>
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
                    <VAutocomplete
                      label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_method')}
                      dense
                      vModel={vm.updateProjectForm.artifactRepoHttpUpload.method}
                      items={
                        ['PUT', 'POST']
                      }
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
                      persistent-hint
                    ></VAutocomplete>
                  </VCol>
                  <VCol
                    cols="12"
                    v-show={vm.targetProjectRepo.artifactRepoType === 'http'}
                  >
                    <VAutocomplete
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
                    ></VAutocomplete>
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
                    <VAutocomplete
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
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.updateProjectForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.updateProjectForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.updateProjectAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.$refs.updateProjectRef.reset()
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.updateProjectRef.validate()){
                  if(vm.updateProjectAttachment.length <= 0){
                    request.post(`/console/project/${vm.targetProjectName}`, vm.updateProjectForm).then(response => {
                      vm.updateProjectDialog = false
                      vm.successTip(true,response.msg)
                      vm.$refs.updateProjectRef.reset()
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.updateProjectAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.updateProjectForm.attachmentIDs = response.data.attachmentIDs
                      request.post(`/console/project/${vm.targetProjectName}`, vm.updateProjectForm).then(response => {
                        vm.updateProjectDialog = false
                        vm.successTip(true,response.msg)
                        vm.$refs.updateProjectRef.reset()
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
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
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project')}</span>
          </VCardTitle>
          <VCardText>
            <VForm ref="deleteRef">
              <v-alert icon="mdi-alert-circle" prominent text type="error">
                <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_project_prompt')}<v-chip small color="red">{vuetify.preset.lang.t('$vuetify.lang_form_dangerous_operation')}</v-chip></small>
              </v-alert>
              <div>
                {vuetify.preset.lang.t('$vuetify.lang_form_delete_project_tip_1', vm.targetProjectName)}
              </div>
              <VContainer>
                <VRow>
                  <VCol cols="12">
                    <VAutocomplete
                      vModel={vm.deleteProjectForm.gitRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_git_repo_delete')}
                      dense
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete
                      vModel={vm.deleteProjectForm.scanCodeRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_scan_code_repo_delete')}
                      dense
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete
                      vModel={vm.deleteProjectForm.imageRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_image_repo_delete')}
                      dense
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete
                      vModel={vm.deleteProjectForm.artifactRepoDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_artifact_repo_delete')}
                      dense
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete
                      vModel={vm.deleteProjectForm.namespaceDelete}
                      items={[
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                      ]}
                      label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_namespace_delete')}
                      dense
                    ></VAutocomplete>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_title')}
                      required
                      dense
                      v-model={vm.deleteProjectForm.title}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_title_tip_1')}
                      persistent-hint
                    ></VTextField>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_content')}
                      required
                      dense
                      v-model={vm.deleteProjectForm.content}
                      rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_content_tip_1')}
                      persistent-hint
                    ></VTextarea>
                  </VCol>
                  <VCol cols="12">
                    <v-file-input
                      label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
                      required
                      dense
                      multiple
                      small-chips
                      show-size
                      v-model={vm.deleteAttachment}
                      hint={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments_tip_1')}
                      persistent-hint
                    ></v-file-input>
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
                vm.deleteProjectDialog = false
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
            </VBtn>
            <VBtn
              color="blue darken-1"
              text
              loading={vm.btnLoading}
              disabled={vm.btnLoading}
              vOn:click={() => {
                if(vm.$refs.deleteRef.validate()){
                  if(vm.deleteAttachment.length <= 0){
                    request.post(`/console/project/${vm.targetProjectName}/delete`, vm.deleteProjectForm).then(response => {
                      vm.deleteProjectDialog = false
                      vm.successTip(true,response.msg)
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }else{
                    vm.btnLoading = true
                    var formData = new FormData();
                    vm.deleteAttachment.forEach(attachment => {
                      formData.append('attachment[]', attachment);
                    })
                    request.post('/console/attachment',formData).then(response => {
                      vm.btnLoading = false
                      vm.deleteProjectForm.attachmentIDs = response.data.attachmentIDs
                      request.post(`/console/project/${vm.targetProjectName}/delete`, vm.deleteProjectForm).then(response => {
                        vm.deleteProjectDialog = false
                        vm.successTip(true,response.msg)
                      }).catch(error => {
                        vm.errorTip(true,error.response.data.msg)
                      })
                    }).catch(error => {
                      vm.errorTip(true,error.response.data.msg)
                    })
                  }
                }
              }}
            >
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model={vm.auditDialog}
        max-width="800px"
      >
        <VCard>
          <VCardTitle>
            <span class="headline">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</span>
          </VCardTitle>
          <VCardText id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 500px;">
            {
              vm.logList.map((item, i) => {
                let logColor = ''
                switch (item.logType) {
                  case 'ERROR':
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
              {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCard>
  }
}
</script>

<style scoped>

.params-item {
  padding: 8px;
  border: 1px solid #d2c7c7;
  border-radius: 5px;
  margin-bottom: 16px;
}

</style>
