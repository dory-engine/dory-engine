<template>
  <div class="project pa-4">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_project_detail')">
      <v-card class="mb-4" :loading="cardLoading">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_info')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_namespace')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_repo')}}
                  </th>
                  <th class="text-left" v-for="(item,index) in project.projectNodePorts" :key="index">
                    <v-icon v-if="item.privileged">mdi-security</v-icon>
                    {{$vuetify.lang.t('$vuetify.lang_view_env')}}({{item.envName}})
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <template>
                      <span>{{ project.projectInfo.projectName }}</span><span>({{ project.projectInfo.projectShortName}})</span>
                      <div>{{ project.projectInfo.projectDesc }}</div>
                    </template>
                  </td>
                  <td>
                    <div>{{ project.projectInfo.projectNamespace }}({{ project.projectInfo.shortName }})</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_team')}}: {{ project.projectInfo.projectTeam }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_arch')}}: {{ project.projectInfo.projectArch }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_tenant_code')}}: {{ project.tenantCode }}</div>
                  </td>
                  <td>
                    <div class="repo-wrap">
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.gitRepo">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip outlined v-bind="attrs" v-on="on" small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_git_repo')}}</v-chip>
                            </template>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_build_settings_dir') }}: {{ project.projectRepo.gitRepoDir.buildSettingsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_database_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.databaseScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_demo_codes_dir') }}: {{ project.projectRepo.gitRepoDir.demoCodesDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_deploy_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.deployScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_documents_dir') }}: {{ project.projectRepo.gitRepoDir.documentsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_test_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.testScriptsDir }}</div>
                          </v-tooltip>
                        </a>
                      </div>
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.imageRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_image_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepo">
                        <a target="_Blank" :href="project.projectRepo.artifactRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepoType === 'internal'">
                        <router-link :to="{ name: 'CicdArtifact', params: { projectName: project.projectInfo.projectName }}">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </router-link>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.scanCodeRepo">
                        <a target="_Blank" :href="project.projectRepo.scanCodeRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_scan_code_repo')}}</v-chip>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td v-for="(item,index) in project.projectNodePorts" :key="index" style="vertical-align: top;">
                    <template>
                      <div class="my-1" v-for="(envNodePort,i) in item.envNodePorts" :key="i">
                        <v-chip :color="envNodePort.isDefault ? 'success' : 'primary'" small>
                          {{ envNodePort.nodePortStart }}-{{ envNodePort.nodePortEnd }}
                        </v-chip>
                      </div>
                    </template>
                  </td>
                  <td>
                    <v-btn color="primary" small @click="goProjectDef()">{{$vuetify.lang.t('$vuetify.lang_menu_project_def')}}</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_token')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" v-if="project.projectSecret.harborPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_image_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.nexusPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_artifact_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.sonarPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_scan_code_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.sonarToken">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_scan_code_repo_token')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_kubernetes_token')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_update_time')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-if="project.projectSecret.harborPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.imageRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.harborPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectNamespace }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.nexusPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.artifactRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.nexusPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectNamespace }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.sonarPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.scanCodeRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.sonarPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectName }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.sonarToken">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.scanCodeRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-chip outlined small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.sonarToken" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                    </div>
                  </td>
                  <td>
                    <template>
                      <div v-for="(item,index) in project.projectAvailableEnvs" :key="index" class="repo-wrap">
                        <div v-if="item.k8sToken">
                          <a target="_Blank" :href="item.dashboardUrl"><v-chip outlined small color="success" class="mr-1 my-1">{{ item.envName }}</v-chip></a>
                          <v-chip outlined small color="primary" class="ml-1 my-1" v-clipboard:copy="item.k8sToken" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </div>
                      </div>
                    </template>
                  </td>
                  <td>{{ project.projectSecret.refreshTime }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_pipelines_list')}}
        </v-card-title>
        <v-card-text>
          <PipelinesDataTable
            :projectName="targetProjectName"
            :pipelines="project.pipelines"
            :opsBatchDefs="project.opsBatchDefs"
            hideDefaultFooter
            disablePagination
            :goRun="goRun"
            :openPipelineDef="openPipelineDef"
          />
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-text v-if="project.modules">
          <ModuleInfos :modules="project.modules" :projectName="this.$route.params.projectName"></ModuleInfos>
        </v-card-text>
      </v-card>
      <v-card color="blue lighten-4" class="mb-4" v-for="(item,index) in latestSteps" :key="index">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_menu_steps_envs', item.envName)}}
        </v-card-title>
        <v-card-text>
          <StepsDataTable
            :steps="item.steps"
            :console="runLog"
            hide-default-footer
          />
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_runs_list')}}
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="pipelineItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.pipelineNames"
                @blur="getRuns()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.statusResults"
                @blur="getRuns()"
              ></v-autocomplete>
              <v-autocomplete
                :items="durationItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_duration')"
                class="mr-8"
                dense
                clearable
                v-model="runsForm.duration"
                @change="getRuns()"
              ></v-autocomplete>
              <template>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      :label="$vuetify.lang.t('$vuetify.lang_form_start_time')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                    no-title
                    @change="dateRangeSubmit()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_tag_name')"
                class="mr-8"
                dense
                v-model="runsForm.tagName"
                @keydown.enter="getRuns()"
              />
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_start_user')"
                class="mr-8"
                dense
                v-model="runsForm.startUser"
                @keydown.enter="getRuns()"
              />
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text>
          <runs-data-table :page="runsForm.page" :perPage="runsForm.perPage" :runsData="runsData" @getpage="pageOptions" :tableLoading="tableLoading" />
        </v-card-text>
      </v-card>
    </PageCard>
    <v-dialog
      v-model="auditDialog"
      max-width="960px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}</span>
        </v-card-title>
        <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
          <pre
            v-for="(logMsg, i) in logPreview"
            :key="i"
            :id="'log' + i"
            :style="logMsg.logType | changeColor"
          >[{{ logMsg.logType }}] {{ logMsg.createTime }}  {{ logMsg.content }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.auditDialog = false
            }"
            :disabled="disableBtn"
            :loading="disableBtn"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <DialogDefs
      :projectName="targetProjectName"
      ref="DialogDefs"
    />
  </div>
</template>

<script>
import PROJECT_API from '@/api/cicd/project'
import PipelinesDataTable from '@/components/PipelinesDataTable'
import StepsDataTable from '@/components/StepsDataTable'
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import ModuleInfos from "@/components/ModuleInfos";
import RunsDataTable from "@/components/RunsDataTable";
import DialogDefs from "@/components/DialogDefs";
import MODULE_API from '@/api/cicd/module';
import RUNS_API from '@/api/cicd/runs';
import STEPS_API from '@/api/cicd/steps'
import User from '@/services/user'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: "Project",
  components: {
    PipelinesDataTable,
    StepsDataTable,
    ModuleInfos,
    RunsDataTable,
    PageCard,
    DialogDefs,
  },
  data () {
    return {
      dates: [],
      menu2: false,
      project: '',
      pipelineItems: [],
      cardLoading: true,
      statusItems: [ 'RUNNING', 'SUCCESS', 'FAIL', 'ABORT','INPUT' ],
      durationItems: [ 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_1'), value: 1 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_2'), value: 2 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_3'), value: 3 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_4'), value: 4 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_5'), value: 5 }
      ],
      runsForm:{
        projectNames: [],
        pipelineNames: [],
        statusResults: [],
        duration: 0,
        startTimeRange: {
          startDate: '',
          endDate: ''
        },
        tagName: '',
        startUser: '',
        abortUser: '',
        page: 1,
        perPage: 10
      },
      runsData: {},
      latestSteps: [],
      logPreview: [],
      auditDialog: false,
      disableBtn: false,
      userToken: '',
      tableLoading: true,
      targetProjectName: '',
    }
  },
  created () {
    this.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    const projectName = this.$route.params.projectName
    this.targetProjectName = projectName
    this.runsForm.projectNames = [projectName]
    PROJECT_API.getProject(projectName).then(response => {
      this.project = response.data.project
      this.cardLoading = false
      this.project.latestSteps.forEach((row, i) => {
        let param = {
          page: 1,
          perPage: 20,
          stepIDs: row.stepIDs,
        }
        STEPS_API.getSteps(param).then(resp => {
          let latestStep = {
            envName: row.envName,
            steps: resp.data.steps,
          }
          this.latestSteps.push(latestStep)
        }).catch(err => {
          this.errorTip(true, err.response.data.msg)
          this.timer=setTimeout(() => {
            this.$router.go(-1)
          },2000)
        })
      })
    }).catch(error => {
      this.errorTip(true, error.response.data.msg)
      this.timer=setTimeout(() => {
        this.$router.go(-1)
      },2000)
    })
    MODULE_API.getPipelineName().then(response => {
      this.pipelineItems = response.data.pipelineNames
    })
    this.websocketInit()
  },
  destroyed() {
    const vm = this
		vm.websock.close()
	},
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    runLog(runName, stepID) {
      const vm = this
      vm.logPreview = []
      vm.auditDialog = true
      vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/run/${runName}?kind=log&stepID=${stepID}&x-user-token=${vm.userToken}`)
      vm.ws.onmessage = (event) => {
        vm.logPreview.push(JSON.parse(event.data))
      }
      vm.ws.onclose = () => {
        vm.logPreview.push({logType: 'END'})
        vm.disableBtn = false
      }
    },
    clearDates() {
      this.dates = []
      this.menu2 = false
      this.getRuns()
    },
    dateRangeSubmit() {
      this.menu2 = false
      this.getRuns()
    },
    getRuns() {
      if(this.runsForm.duration == null) {
        this.runsForm.duration = 0
      }
      this.runsForm.startTimeRange.startDate = this.dates[0]
      this.runsForm.startTimeRange.endDate = this.dates[1]
      RUNS_API.getRuns(this.runsForm).then(response => {
        this.runsData = response.data
        this.tableLoading = false
        this.successTip(true, response.msg)
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    refresh() {
      if(this.runsForm.duration == null) {
        this.runsForm.duration = 0
      }
      this.runsForm.startTimeRange.startDate = this.dates[0]
      this.runsForm.startTimeRange.endDate = this.dates[1]
      RUNS_API.getRuns(this.runsForm).then(response => {
        this.runsData = response.data
        this.tableLoading = false
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    openPipelineDef(projectName, branchName) {
      this.$refs.DialogDefs.openPipelineDef(projectName, branchName)
    },
    goProjectDef() {
      const vm = this
      vm.$router.push({
        name: 'CicdProjectDef',
        params: {
          projectName: vm.targetProjectName
        }
      })
    },
    pageOptions(data){
      this.runsForm.page = data.page
      this.runsForm.perPage = data.perPage
      if(this.runsForm.duration == null) {
        this.runsForm.duration = 0
      }
      this.runsForm.startTimeRange.startDate = this.dates[0]
      this.runsForm.startTimeRange.endDate = this.dates[1]
      RUNS_API.getRuns(this.runsForm).then(response => {
        this.runsData = response.data
        this.tableLoading = false
      }).catch()
    },
    onCopy() {
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_success'))
    },
    onError() {
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed'))
    },
    goRun(runName) {
      this.$router.push({
        name: 'CicdRun',
        params: {
          'runName': runName
        }
      })
    },
    updateRun(runName) {
      let getForm = {
        page: 1,
        perPage: 1,
        runNames: [runName],
      }
      RUNS_API.getRuns(getForm).then(response => {
        if (response.data.runs.length === 1) {
          let run = response.data.runs[0]
          this.runsData.runs.forEach((item, index) => {
            if (item.runName === run.runName) {
              this.$set(this.runsData.runs, index, run)
            }
          })
        }
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    websocketInit() {
      const vm = this
			vm.websock = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/runStatus?x-user-token=${User.getInstance().state.userObj.userToken}`)
			vm.websock.onmessage = vm.websocketOnMessage
			vm.websock.onopen = vm.websocketOnOpen
			vm.websock.onerror = vm.websocketOnError
			vm.websock.onclose = vm.websocketOnClose
      console.log("websocket init")
		},
		websocketOnOpen() {
		},
		websocketOnError() {
      const vm = this
			console.log("websocket error")
		},
		websocketOnMessage(e) {
      const vm = this
      let runStatusUpdate = JSON.parse(e.data)
      if (runStatusUpdate.status === '') {
        vm.getRuns()
      } else {
        vm.updateRun(runStatusUpdate.runName)
      }
			console.log(runStatusUpdate)
		},
		websocketOnClose(e) {
      const vm = this
			console.log("websocket closed")
		},
  },
  filters: {
    changeColor: function (value) {
      if(value == 'ERROR'){
        return {color: 'red'}
      } else if (value == 'WARNING') {
        return { color: 'orange' }
      }else if(value == 'INFO'){
        return {color: 'white'}
      }else{
        return null
      }
    },
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">
.pipeline-wrap .v-chip.v-size--default {
  height: 42px;
  margin-top: 8px;
}
.pipeline-switch .v-input--selection-controls {
  margin-top: 0px;
}
.pipeline-wrap {
  overflow-y: auto;
}
.pipeline-wrap .v-breadcrumbs{
  flex-wrap: nowrap;
  padding: 18px 0;
}
.step-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}
.step-item.avtive {
  background-color: #D1D1D1;
}
.step-icon {
  width: 24px;
  height: 24px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 24px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  user-select: none;
}
.step-icon.off {
  background-color: #607D8B;
}
.original-icon {
  background-color: #2196F3;
}
.custom-icon {
  background-color: #4CAF50;
}
.pipeline-wrap .v-stepper__header .v-stepper__step {
  flex-shrink: 0;
  justify-content: center;
}
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
.modules-item {
  cursor: pointer;
}
.v-text-field {
  font-size: 14px;
}
.v-autocomplete {
  font-size: 14px;
}
.steps-switch {
  width: 50%;
}
.yaml-btn {
  background-color: #fff !important;
  box-shadow: none !important;
}
.yaml-btn:hover::before {
  opacity: 0 !important;
}
.form-item-15 {
  width: 15%;
}
.form-item-20 {
  width: 20%;
}
.form-item {
  width: 30%;
}
.form-item-40 {
  width: 40%;
}
.form-item-45 {
  width: 45%;
}
.form-item-50 {
  width: 50%;
}
.form-item-60 {
  width: 60%;
}
.form-item-70 {
  width: 70%;
}
.form-item-100 {
  width: 100%;
}
.yaml-btn {
  background-color: #fff !important;
  box-shadow: none !important;
}
.yaml-btn:hover::before {
  opacity: 0 !important;
}
.pr-20 {
  padding-right: 80px;
}
.tip-color {
  color: rgba(0, 0, 0, 0.6);
}
.error-text {
  font-size: 16px;
  font-weight: 400;
  color: #ff5252;
}
.params-item {
  padding: 8px;
  border: 1px solid #d2c7c7;
  border-radius: 5px;
  margin-bottom: 16px;
}
</style>
