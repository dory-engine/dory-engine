<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_pipeline_detail')">
    <VCard style="width: 100%" flat :loading="cardLoading" v-if="pipelineData">
      <VCardText>
        <VCard class="mb-4">
          <VCardTitle>
            <span>{{ $vuetify.lang.t('$vuetify.lang_view_pipeline_info') }}</span>
            <v-spacer></v-spacer>
            <v-btn class="mr-2" small color="primary" @click="goProjectDef(pipelineData.projectInfo.projectName)">{{ $vuetify.lang.t('$vuetify.lang_menu_project_def') }}</v-btn>
            <v-btn v-if="pipelineData.pipeline.branchName" small :color="errMsgPipelineDef === '' ? 'primary' : 'error'" class="mr-2" @click="openPipelineDef(pipelineData.projectInfo.projectName, pipelineData.pipeline.branchName)">{{ $vuetify.lang.t('$vuetify.lang_menu_pipeline_def') }}</v-btn>
            <v-btn small color="primary" @click="runPipeline(pipelineData.pipeline.pipelineName)">{{ $vuetify.lang.t('$vuetify.lang_menu_execute') }}</v-btn>
          </VCardTitle>
          <VCardText>
            <v-simple-table dense v-if="pipelineData">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_pipeline_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_branch_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_architecture')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_ci_envs')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_production_envs')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_success_fail_abort_count')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_latest_run_time')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_latest_run_result')}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{ pipelineData.pipeline.pipelineName }}</td>
                  <td>{{ pipelineData.pipeline.branchName }}</td>
                  <td><v-chip v-if="pipelineData.pipeline.pipelineDef && pipelineData.pipeline.pipelineDef.pipelineArch" small class="mr-2" color="primary">{{ pipelineData.pipeline.pipelineDef.pipelineArch }}</v-chip></td>
                  <td>
                    <template>
                      <div class="my-1" v-for="(item,index) in pipelineData.pipeline.envs" :key="index">
                        <v-chip color="primary" small>{{ item }}</v-chip>
                      </div>
                    </template>
                  </td>
                  <td>
                    <template>
                      <div class="my-1" v-for="(item,index) in pipelineData.pipeline.envProductions" :key="index">
                        <v-chip color="primary" small>{{ item }}</v-chip>
                      </div>
                    </template>
                  </td>
                  <td>
                    <span class="green--text">{{ pipelineData.pipeline.successCount }}</span>/
                    <span class="red--text">{{ pipelineData.pipeline.failCount }}</span>/
                    <span class="grey--text">{{ pipelineData.pipeline.abortCount }}</span>
                  </td>
                  <td>{{ pipelineData.pipeline.status.startTime }}</td>
                  <td>
                    <template>
                      <div>{{ pipelineData.pipeline.status.duration }}</div>
                      <v-chip v-if="pipelineData.pipeline.status.result == 'FAIL'" small class="mb-1 white--text" color="red">
                        {{ pipelineData.pipeline.status.result }}
                      </v-chip>
                      <v-chip v-else-if="pipelineData.pipeline.status.result == 'SUCCESS'" small class="mb-1 white--text" color="green">
                        {{ pipelineData.pipeline.status.result }}
                      </v-chip>
                      <v-chip v-else-if="pipelineData.pipeline.status.result == 'INPUT'" small class="mb-1 white--text" color="orange">
                        {{ pipelineData.pipeline.status.result }}
                      </v-chip>
                      <v-chip v-else-if="pipelineData.pipeline.status.result == 'RUNNING'" small class="mb-1 white--text" color="blue">
                        {{ pipelineData.pipeline.status.result }}
                      </v-chip>
                      <v-chip v-else-if="pipelineData.pipeline.status.result == 'ABORT'" small class="mb-1 white--text" color="grey">
                        {{ pipelineData.pipeline.status.result }}
                      </v-chip>
                    </template>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </VCardText>
        </VCard>
        <VCard class="mb-4">
          <VCardTitle>
            {{$vuetify.lang.t('$vuetify.lang_view_project_info')}}
          </VCardTitle>
          <VCardText>
            <v-simple-table dense v-if="pipelineData">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_namespace')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_repo')}}
                  </th>
                  <th class="text-left" v-for="(item,index) in pipelineData.projectNodePorts" :key="index">
                    <v-icon v-if="item.privileged">mdi-security</v-icon>
                    {{$vuetify.lang.t('$vuetify.lang_view_env')}}({{item.envName}})
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <template>
                      <router-link :to="{ name: 'CicdProject', params: { projectName: pipelineData.projectInfo.projectName }}">
                        <span>{{ pipelineData.projectInfo.projectName }}</span><span>({{ pipelineData.projectInfo.projectShortName}})</span>
                        <div>{{ pipelineData.projectInfo.projectDesc }}</div>
                      </router-link>
                    </template>
                  </td>
                  <td>
                    <div>{{ pipelineData.projectInfo.projectNamespace }}({{ pipelineData.projectInfo.shortName }})</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_team')}}: {{ pipelineData.projectInfo.projectTeam }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_tenant_code')}}: {{ pipelineData.tenantCode }}</div>
                  </td>
                  <td>
                    <div class="repo-wrap">
                      <div class="mb-1">
                        <a target="_Blank" :href="pipelineData.projectRepo.gitRepo">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip outlined v-bind="attrs" v-on="on" small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_git_repo')}}</v-chip>
                            </template>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_build_settings_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.buildSettingsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_database_scripts_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.databaseScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_demo_codes_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.demoCodesDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_deploy_scripts_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.deployScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_documents_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.documentsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_test_scripts_dir') }}: {{ pipelineData.projectRepo.gitRepoDir.testScriptsDir }}</div>
                          </v-tooltip>
                        </a>
                      </div>
                      <div class="mb-1">
                        <a target="_Blank" :href="pipelineData.projectRepo.imageRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_image_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="pipelineData.projectRepo.artifactRepo">
                        <a target="_Blank" :href="pipelineData.projectRepo.artifactRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="pipelineData.projectRepo.artifactRepoType === 'internal'">
                        <router-link :to="{ name: 'CicdArtifact', params: { projectName: pipelineData.projectInfo.projectName }}">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </router-link>
                      </div>
                      <div class="mb-1" v-show="pipelineData.projectRepo.scanCodeRepo">
                        <a target="_Blank" :href="pipelineData.projectRepo.scanCodeRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_scan_code_repo')}}</v-chip>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td v-for="(item,index) in pipelineData.projectNodePorts" :key="index" style="vertical-align: top;">
                    <template>
                      <div class="my-1" v-for="(envNodePort,i) in item.envNodePorts" :key="i">
                        <v-chip :color="envNodePort.isDefault ? 'success' : 'primary'" small>
                          {{ envNodePort.nodePortStart }}-{{ envNodePort.nodePortEnd }}
                        </v-chip>
                      </div>
                    </template>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </VCardText>
        </VCard>
        <VCard class="mb-4">
          <v-card-text>
            <module-infos v-if="pipelineData" :modules="pipelineData.modules" :projectName="pipelineData.projectInfo.projectName" />
          </v-card-text>
        </VCard>
        <v-card>
          <v-card-title>
            {{$vuetify.lang.t('$vuetify.lang_view_runs_list')}}
            <v-form>
              <v-container class="d-flex flex-wrap">
                <v-autocomplete
                  :items="durationItems"
                  :label="$vuetify.lang.t('$vuetify.lang_form_duration')"
                  class="mr-8"
                  dense
                  clearable
                  v-model="runsForm.duration"
                  @change="getRuns()"
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
                        @click="clearDates1()"
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
                <v-autocomplete
                  :items="[
                    { value: 'createTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                    { value: 'createTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
                  ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
                  class="mr-8"
                  clearable
                  dense
                  v-model="runsForm.sortMode"
                  @change="getRuns()"
                ></v-autocomplete>
              </v-container>
            </v-form>
          </v-card-title>
          <v-card-text>
            <runs-data-table :page="runsForm.page" :perPage="runsForm.perPage" :runsData="runsData" @getpage="pageOptions" :tableLoading="tableLoading" />
          </v-card-text>
        </v-card>
      </VCardText>
    </VCard>
    <DialogDefs
      :projectName="targetProjectName"
      ref="DialogDefs"
    />
  </PageCard>
</template>

<script>
import InfoCard from "@/lib/ui-lib/components/InfoCard";
import ModuleInfos from "@/components/ModuleInfos";
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import RunsDataTable from "@/components/RunsDataTable";
import DialogDefs from "@/components/DialogDefs";
import PIPELINE_API from '@/api/cicd/pipeline';
import MODULE_API from '@/api/cicd/module';
import RUNS_API from '@/api/cicd/runs';
import User from '@/services/user'
import request from '@/utils/request';
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Pipeline',
  components: {
    ModuleInfos,
    InfoCard,
    PageCard,
    RunsDataTable,
    DialogDefs,
  },
  data () {
    return {
      pipelineData: '',
      cardLoading: true,
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
        sortMode: '',
        page: 1,
        perPage: 10
      },
      dates: [],
      menu2: false,
      pipelineItems: [],
      statusItems: [ 'RUNNING', 'SUCCESS', 'FAIL', 'ABORT', 'INPUT' ],
      durationItems: [ 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_1'), value: 1 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_2'), value: 2 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_3'), value: 3 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_4'), value: 4 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_5'), value: 5 }
      ],
      runsData: {},
      tableLoading: true,
      targetProjectName: '',
    }
  },
  created () {
    const pipelineName = this.$route.params.pipelineName
    this.runsForm.pipelineNames = [pipelineName]
    this.targetProjectName = pipelineName.split("-").slice(0, -1).join('-')
    PIPELINE_API.getPipeline(pipelineName).then(response => {
      this.pipelineData = response.data
      this.errMsgPipelineDef = response.data.pipeline.errMsgPipelineDef
      this.cicdCustomStepInserts = response.data.cicdCustomStepInserts
      this.cardLoading = false
      this.runsForm.projectNames = [response.data.projectInfo.projectName]
      RUNS_API.getRuns(this.runsForm).then(response => {
        this.tableLoading = false
        this.runsData = response.data
      }).catch()
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
  methods: {
    clearDates1 () {
      this.dates = []
      this.menu2 = false
      this.getRuns()
    },
    dateRangeSubmit () {
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
    goProjectDef(projectName) {
      const vm = this
      vm.$router.push({
        name: 'CicdProjectDef',
        params: {
          projectName: projectName
        }
      })
    },
    openPipelineDef(projectName, branchName) {
      this.$refs.DialogDefs.openPipelineDef(projectName, branchName)
    },
    pageOptions (data){
      this.runsForm.page = data.page
      this.runsForm.perPage = data.perPage
      if(this.runsForm.duration == null) {
        this.runsForm.duration = 0
      }
      this.runsForm.startTimeRange.startDate = this.dates[0]
      this.runsForm.startTimeRange.endDate = this.dates[1]
      RUNS_API.getRuns(this.runsForm).then(response => {
        this.tableLoading = false
        this.runsData = response.data
      }).catch()
    },
    runPipeline (pipelineName) {
      const vm =this
      request.post(`/cicd/pipeline/${pipelineName}`).then(response => {
        vm.$router.push({
          name: 'CicdRun',
          params: {
            'runName': response.data.runName
          }
        })
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
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
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped>
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
.v-text-field {
  min-width: 300px;
}
.mine-css .v-autocomplete {
  width: auto;
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
</style>
