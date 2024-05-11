<template>
  <div>
    <v-card
      class=" "
      flat
    >
      <v-card-title>
        {{$vuetify.lang.t('$vuetify.lang_view_steps')}}
      </v-card-title>
      <v-card-text>
        <VForm>
          <VContainer fluid>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="projectItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.projectNames"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.pipelineNames"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-combobox
                :label="$vuetify.lang.t('$vuetify.lang_view_run_name')"
                class="mr-8"
                dense
                multiple
                small-chips
                hide-selected
                v-model="stepsForm.runNames"
                @blur="stepsSearch()"
              >
              </v-combobox>
              <v-autocomplete
                :items="branchItems"
                :label="$vuetify.lang.t('$vuetify.lang_view_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.branchNames"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="envItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_env')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.envNames"
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
                :label="$vuetify.lang.t('$vuetify.lang_form_step_action')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.stepActions"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_module_type')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="stepsForm.moduleTypes"
                @blur="stepsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNames"
                :label="$vuetify.lang.t('$vuetify.lang_form_module_name')"
                class="mr-8"
                dense
                clearable
                v-model="stepsForm.moduleName"
                @change="stepsSearch()"
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
            </v-container>
          </VContainer>
        </VForm>
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
    <v-dialog
      v-model="auditDialog"
      max-width="960px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}</span>
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
import request from '@/utils/request'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/theme/base16-dark.css'
import { catchError, delay, filter, mergeMap, retryWhen, scan, tap, withLatestFrom } from 'rxjs/operators'
import StepsDataTable from '@/components/StepsDataTable'
import { defer, of, Subject } from 'rxjs'
import STEPS_API from '@/api/cicd/steps'
import MODULE_API from '@/api/cicd/module'
import PROJECTS_API from '@/api/cicd/projects'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Steps',
  components: { StepsDataTable },
  subscriptions () {
    return {
      queryPage$: new Subject()
    }
  },
  data () {
    return {
      stepsForm:{
        projectNames: [],
        pipelineNames: [],
        runNames: [],
        branchNames: [],
        envNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        stepActions: [],
        moduleTypes: [],
        stepIDs: [],
        moduleName: '',
        duration: 0,
        createTimeRange: {
            startDate: '',
            endDate: ''
        },
      },
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
      projectItems: [],
      pipelineItems: [],
      runItems: [],
      branchItems: [],
      envItems: [],
      statusItems: [],
      stepItems: [],
      moduleItems: [],
      moduleNames: [],
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
      disableBtn: false
    }
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    if (vm.$route.params.stepID !== undefined) {
      vm.stepsForm.stepIDs.push(vm.$route.params.stepID)
    }
    // vm.$watchAsObservable('testYmlDialog').pipe(
    //   filter(next => next),
    //   delay(300)
    // ).subscribe(next => {
    //   if (vm.$refs.yamlCodeMirror) {
    //     vm.$refs.yamlCodeMirror.refresh()
    //   }
    // })
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
    request.get('/cicd/projectNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.projectItems = response.data.projectNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/pipelineNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.pipelineItems = response.data.pipelineNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/branchNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.branchItems = response.data.branchNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/envNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.envItems = response.data.envNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/stepOptions').then(response => {
      if (response.data.statusResults !== null) {
        vm.statusItems = response.data.statusResults
      }
      if (response.data.stepActions !== null) {
        vm.stepItems = response.data.stepActions
      }
      if (response.data.moduleTypes !== null) {
        vm.moduleItems = response.data.moduleTypes
      }
      if (response.data.moduleNames !== null) {
        vm.moduleNames = response.data.moduleNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
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
    }
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
  }
}
</script>

<style lang="scss" scoped>
.v-text-field {
  //min-width: 300px;
}
.v-autocomplete {
  //width: 280px;
}
</style>
