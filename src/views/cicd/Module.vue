<template>
  <div class="module pa-4">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_module_detail')">
      <v-card class="mb-4" :loading="cardLoading">
        <v-card-title>{{$vuetify.lang.t('$vuetify.lang_view_run_modules')}}</v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="moduleData">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_name')}}
                </th>
                <th class="text-left">
                    {{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}
                  </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_type')}}
                </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_is_latest')}}
                </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_latest_run_time')}}
                </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_runs_count')}}
                </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_module_latest_run_name')}}
                </th>
                <th class="text-left">
                  {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  {{ moduleData.module.moduleName }}
                </td>
                <td>
                  <router-link :to="{ name: 'CicdProject', params: { projectName: moduleData.module.projectName }}">
                    {{ moduleData.module.projectName }}
                  </router-link>
                </td>
                <td>{{ moduleData.module.moduleType }}</td>
                <td>{{ moduleData.module.isLatest }}</td>
                <td>{{ moduleData.module.runTimeLatest }}</td>
                <td>{{ moduleData.module.runCount }}</td>
                <td>
                  <router-link :to="{name: 'CicdRun', params: { 'runName': moduleData.module.runNameLatest }}">
                    {{ moduleData.module.runNameLatest }}
                  </router-link>
                </td>
                <td>
                  <v-btn v-if="!moduleData.module.isLatest && !moduleData.module.hidden" color="primary" small @click="openHideModule(true)">{{$vuetify.lang.t('$vuetify.lang_menu_module_hide')}}</v-btn>
                  <v-btn v-if="!moduleData.module.isLatest && moduleData.module.hidden" color="primary" small @click="openHideModule(false)">{{$vuetify.lang.t('$vuetify.lang_menu_module_show')}}</v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card color="blue lighten-4" class="mb-4" v-for="(item,index) in latestSteps" :key="index">
        <v-card-title>
          <span v-if="item.categoryKind === 'branchName'">{{$vuetify.lang.t('$vuetify.lang_menu_steps_branches', item.categoryName)}}</span>
          <span v-if="item.categoryKind === 'envName'">{{$vuetify.lang.t('$vuetify.lang_menu_steps_envs', item.categoryName)}}</span>
        </v-card-title>
        <v-card-text>
          <StepsDataTable
            :steps="item.steps"
            :console="runLog"
            hide-default-footer
          />
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_steps')}}
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="pipelineItems"
                :label="$vuetify.lang.t('$vuetify.lang_view_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.pipelineNames"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.statusResults"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="stepItems"
                :label="$vuetify.lang.t('$vuetify.lang_view_step_action')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.stepActions"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="durationItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_duration')"
                class="mr-8"
                dense
                clearable
                v-model="stepsForm.duration"
                @change="stepsSearch()"
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
                      :label="$vuetify.lang.t('$vuetify.lang_view_start_time')"
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
                    @change="datePickerChange()"
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
                :label="$vuetify.lang.t('$vuetify.lang_form_run_number')"
                class="mr-8"
                dense
                type="number"
                v-model="stepsForm.runNumber"
                @keydown.enter="stepsSearch()"
              />
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text>
          <StepsDataTable
            :steps="pageData.rows"
            :server-items-length="pageData.total"
            :loading="pageData.loading"
            :footerProps="{
              showCurrentPage: true,
              itemsPerPageOptions: [ 5, 10, 15, 20 ]
            }"
            :expanded.sync="pageData.expanded"
            :options="{
              page: pageData.currentPage,
              itemsPerPage: pageData.pageSize
            }"
            @update:options="(value) => {
              pageData.currentPage = value.page
              pageData.pageSize = value.itemsPerPage
              $observables.queryPage$.next('dataOptionChange')
            }"
            :console="runLog"
          />
        </v-card-text>
      </v-card>
    </PageCard>
    <v-dialog
      v-model="hideModuleDialog"
      max-width="600px"
      persistent
      eager
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ hideModuleTitle }}</span>
        </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{ hideModulePrompt }}</small>
            </v-alert>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.hideModuleDialog = false
                this.hideModuleTitle = ''
                this.hideModulePrompt = ''
                this.isHidden = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="hideModule()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import { catchError, delay, filter, mergeMap, retryWhen, scan, tap, withLatestFrom } from 'rxjs/operators'
import StepsDataTable from '@/components/StepsDataTable'
import { defer, of, Subject } from 'rxjs'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import request from '@/utils/request'
import MODULE_API from '@/api/cicd/module'
import STEPS_API from '@/api/cicd/steps'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Module',
  components: { StepsDataTable, PageCard },
  subscriptions () {
    return {
      queryPage$: new Subject()
    }
  },
  data () {
    return {
      moduleData: '',
      cardLoading: true,
      stepsForm:{
        projectNames: [],
        pipelineNames: [],
        statusResults: ["SUCCESS", "FAIL"],
        stepActions: [],
        moduleTypes: [],
        moduleName: '',
        duration: 0,
        createTimeRange: {
            startDate: '',
            endDate: ''
        },
        runNumber: null,
      },
      latestSteps: [],
      pageData: {
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        rows: [],
        displayRows: [],
        expanded: []
      },
      dates: [],
      menu2: false,
      pipelineItems: [],
      statusItems: ['RUNNING', 'SUCCESS', 'FAIL', 'ABORT'],
      stepItems: ['build', 'scanCode', 'packageImage', 'scanImage', 'deploy', 'undo', 'syncImage', 'checkDeploy', 'artifact', 'deployArtifac', 'testApi', 'testPerformance', 'testWebui', 'databaseExec', 'databaseRollback', 'applyMesh', 'changeMesh', 'deployDebug', 'deployStatic'],
      durationItems: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_1'), value: 1 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_2'), value: 2 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_3'), value: 3 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_4'), value: 4 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_5'), value: 5 }
      ],
      userToken: '',
      auditDialog: false,
      btnLoading: false,
      logPreview: [],
      disableBtn: false,
      hideModuleDialog: false,
      hideModuleTitle: '',
      hideModulePrompt: '',
      isHidden: false,
    }
  },
  created () {
    const vm = this
    vm.getModule()
  },
  methods: {
    getModule() {
      const vm = this
      vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
      // @ projectName
      // @ moduleType
      // @ moduleName
      const projectName = this.$route.params.projectName
      const moduleType = this.$route.params.moduleType
      const moduleName = this.$route.params.moduleName
      vm.stepsForm.projectNames = [projectName]
      vm.stepsForm.moduleTypes = [moduleType]
      vm.stepsForm.moduleName = moduleName
      MODULE_API.getModule(projectName,moduleType,moduleName).then(response => {
        this.moduleData = response.data
        this.cardLoading = false
        this.moduleData.module.latestSteps.forEach((row, i) => {
          let param = {
            page: 1,
            perPage: 20,
            stepIDs: row.stepIDs,
          }
          STEPS_API.getSteps(param).then(resp => {
            let latestStep = {
              categoryKind: this.moduleData.module.categoryKind,
              categoryName: row.categoryName,
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
      }).catch(_ => {})
      vm.$observables.queryPage$.pipe(
        tap(next => {
          vm.pageData.loading = true
        }),
        mergeMap(next => {
          const param = Object.assign({}, {...vm.stepsForm}, {
            page: vm.pageData.currentPage,
            perPage: vm.pageData.pageSize
          })
          return defer(() => STEPS_API.getSteps(param)).pipe(
            retryWhen((errors) => {
              return errors.pipe(
                scan((acc, next) => {
                  acc += 1
                  if (acc > 2) {
                    throw next
                  }
                  return acc
                }, 0)
              )
            }),
            catchError((err, caught) => {
              console.log(err)
              vm.errorTip(true, err.response.data.msg)
              vm.pageData.loading = false
              return of(null)
            }),
            withLatestFrom(of(next))
          )
        }),
        filter(next => {
          return next[0]
        })
      ).subscribe(response => {
        vm.pageData.loading = false
        if(response[1] == 'stepsSearch'){
          vm.successTip(true, response[0].msg)
        }
        vm.pageData.rows = response[0].data.steps
        vm.pageData.displayRows = response[0].data.steps
        vm.pageData.total = response[0].data.totalCount
        vm.pageData.expanded = []
      })
    },
    clearDates () {
      this.dates = []
      this.menu2 = false
      this.stepsSearch()
    },
    datePickerChange(){
      this.menu2 = false
      this.stepsSearch()
    },
    stepsSearch() {
      const vm = this
      this.stepsForm.createTimeRange.startDate = this.dates[0]
      this.stepsForm.createTimeRange.endDate = this.dates[1]
      if(this.stepsForm.runNumber == null || this.stepsForm.runNumber == '') {
        this.stepsForm.runNumber = null
      }else{
        this.stepsForm.runNumber = Number(this.stepsForm.runNumber)
      }
      this.stepsForm.duration = Number(this.stepsForm.duration)
      vm.$observables.queryPage$.next('stepsSearch')
    },
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
    openHideModule(isHidden) {
      const vm = this
        vm.isHidden = isHidden
      if (isHidden) {
        vm.hideModuleTitle = vuetify.preset.lang.t('$vuetify.lang_form_module_hide', vm.moduleData.module.moduleName)
        vm.hideModulePrompt = vuetify.preset.lang.t('$vuetify.lang_form_module_hide_prompt')
      } else {
        vm.hideModuleTitle = vuetify.preset.lang.t('$vuetify.lang_form_module_show', vm.moduleData.module.moduleName)
        vm.hideModulePrompt = vuetify.preset.lang.t('$vuetify.lang_form_module_show_prompt')
      }
      vm.hideModuleDialog = true
    },
    hideModule() {
      const vm = this
      const projectName = this.$route.params.projectName
      const moduleType = this.$route.params.moduleType
      const moduleName = this.$route.params.moduleName
      request.post(`/cicd/module/${projectName}/${moduleType}/${moduleName}`, { hidden: vm.isHidden }).then(response => {
        vm.hideModuleDialog = false
        vm.hideModuleTitle = ''
        vm.hideModulePrompt = ''
        vm.isHidden = false
        vm.successTip(true,response.msg)
        vm.getModule()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
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

<style scoped>
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
</style>
