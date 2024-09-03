<template>
  <PageCard name="">
    <v-card :loading="cardLoading" class="pipeline-card">
      <v-card-title>
        <h5>{{$vuetify.lang.t('$vuetify.lang_view_run_detail')}}</h5>
      </v-card-title>
      <InfoCard
        class="mb-4 top-card no-shadow"
        title=""
      >
        <info-single-table
          :infos="[
            { key: 'runName', name: $vuetify.lang.t('$vuetify.lang_view_run_name'), value: run.runName},
            { key: 'projectPipelineName', name: $vuetify.lang.t('$vuetify.lang_view_project_pipeline_name'), value: 'projectPipelineName'},
            { key: 'projectTagName', name: $vuetify.lang.t('$vuetify.lang_view_tag_name'), value: 'projectTagName'},
            { key: 'startUser', name: $vuetify.lang.t('$vuetify.lang_view_start_user'), value: run.startUser},
            { key: 'triggerKind', name: $vuetify.lang.t('$vuetify.lang_view_trigger_kind'), value: 'triggerKind'},
            { key: 'startTime', name: $vuetify.lang.t('$vuetify.lang_view_start_time'), value: run.status.startTime},
            { key: 'runResult', name: $vuetify.lang.t('$vuetify.lang_view_run_result'), value: 'runResult'},
            { key: 'opt', name: $vuetify.lang.t('$vuetify.lang_view_operations'), value: 'opt'}
          ]"
        >
          <template v-slot:projectPipelineName>
            <div class="mt-1"><v-chip outlined small color="primary" :to="{name: 'CicdProject', params: {projectName: run.projectName || ''}}">{{run.projectName}}</v-chip></div>
            <div class="mt-1"><v-chip outlined small color="primary" :to="{name: 'CicdPipeline', params: {pipelineName: run.pipelineName || ''}}">{{run.pipelineName}}</v-chip></div>
          </template>
          <template v-slot:projectTagName>
            <a v-if="run.gitURL" :href="run.gitURL" target="_blank">{{ run.tagName }}</a>
            <div v-else>{{ run.tagName }}</div>
          </template>
          <template v-slot:triggerKind>
            <v-chip v-if="run.triggerKind" small class="mb-1 white--text" style="text-transform:uppercase" color="teal">
              {{run.triggerKind}}
            </v-chip>
          </template>
          <template v-slot:runResult>
            <div>{{ run.status.duration }}</div>
            <v-chip small class="mb-1 white--text" :color="statusColorMap[run.status.result] || 'primary'">
              {{run.status.result}}
            </v-chip>
          </template>
          <template v-slot:opt>
            <v-btn class="mr-2 my-1" small color="primary" @click="goProjectDef(run.projectName)">{{$vuetify.lang.t('$vuetify.lang_menu_project_def')}}</v-btn>
            <v-btn v-if="run.branchName" small :color="errMsgPipelineDef === '' ? 'primary' : 'error'" class="mr-2 my-1" @click="openPipelineDef(run.projectName, run.branchName)">{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_def')}}</v-btn>
            <v-btn v-if="run.pipelineDefYaml != ''" color="primary" small @click="openRunDef()">{{$vuetify.lang.t('$vuetify.lang_menu_view_run_def')}}</v-btn>
            <br/>
            <v-btn v-if="run.status.result == 'INPUT' || run.status.result == 'RUNNING' || run.status.result == 'PAUSE'" small color="primary" class="mr-2 my-1" @click="abortRun(run.runName)">{{$vuetify.lang.t('$vuetify.lang_menu_abort_run')}}</v-btn>
            <span 
              class="mr-2"
              v-if="!(run.status.result == 'INPUT' || run.status.result == 'RUNNING' || run.status.result == 'PAUSE')" 
            >
              <Operations
                color="green"
                dark
                :operations="opts"
                :opt-button-text="$vuetify.lang.t('$vuetify.lang_menu_execute_batch')"
              />
            </span>
            <v-btn v-if="!(run.status.result == 'INPUT' || run.status.result == 'RUNNING' || run.status.result == 'PAUSE')" small color="primary" class="mr-2" @click="reRun(run.pipelineName)">{{$vuetify.lang.t('$vuetify.lang_menu_redo_run')}}</v-btn>
            <v-btn v-if="run.status.result == 'PAUSE'" color="primary" small @click="topRun(run.runName)">{{$vuetify.lang.t('$vuetify.lang_menu_run_queue_top')}}</v-btn>
          </template>
        </info-single-table>
      </InfoCard>
    </v-card>
    <info-card
      title="tabs"
      class="mb-4">
      <template v-slot:tabs>
        <v-tabs v-model="tab">
          <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_run_logs')}}</v-tab>
          <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_run_commits')}}</v-tab>
          <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_run_modules')}}</v-tab>
          <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_steps')}}</v-tab>
        </v-tabs>
      </template>
      <v-tabs-items v-model="tab" class="pa-1">
        <v-tab-item>
          <div v-show="currentSelectNodeData.nodeType">
            <info-single-table
              :infos="[
                { key: 'nodeType', name: $vuetify.lang.t('$vuetify.lang_view_run_node_type'), value: currentSelectNodeData.nodeType},
                { key: 'nodeName', name: $vuetify.lang.t('$vuetify.lang_view_run_node_name'), value: currentSelectNodeData.nodeName},
                { key: 'status', name: $vuetify.lang.t('$vuetify.lang_view_status'), value: 'status'},
                { key: 'startTime', name: $vuetify.lang.t('$vuetify.lang_view_start_time'), value: currentSelectNodeData.startTime},
                { key: 'endTime', name: $vuetify.lang.t('$vuetify.lang_view_end_time'), value: currentSelectNodeData.endTime},
                { key: 'duration', name: $vuetify.lang.t('$vuetify.lang_view_duration'), value: currentSelectNodeData.duration}
              ]"
            >
              <template v-slot:status>
                <v-chip small class="mb-1 white--text" :color="statusColorMap[currentSelectNodeData.logType] || 'primary'">
                  {{currentSelectNodeData.logType}}
                </v-chip>
              </template>
            </info-single-table>
          </div>
          <info-card color="blue lighten-4" outlined title="" class="mt-1" id="inputConfigForm" v-show="inputConfigMap.data">
            <v-container fluid v-if="inputConfigMap.data">
              <v-row align="center">
                <v-col cols="12" class="py-0">
                  {{ inputConfigMap.data.desc }}
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-if="inputConfigMap.data.options.length > 0"
                    v-model="inputConfigMap.model"
                    :items="inputConfigMap.data.options"
                    :label="inputConfigMap.data.title"
                    :multiple="inputConfigMap.data.isMultiple"
                    item-text="name"
                    item-value="value"
                    dense
                  ></v-autocomplete>
                  <v-alert type="error" v-if="inputConfigMap.data.isMultiple && inputConfigMap.data.options.length === 0">
                    {{ $vuetify.lang.t('$vuetify.lang_view_no_options_to_select') }}
                  </v-alert>
                </v-col>
                <v-col
                  v-if="inputConfigMap.data.isApiOnly !== true"
                  cols="12"
                  class="justify-end d-flex"
                >
                  <v-btn
                    v-if="!(inputConfigMap.data.isMultiple && inputConfigMap.data.options.length === 0)"
                    color="primary"
                    class="mr-2"
                    @click="() => {
                      if(typeof inputConfigMap.model === 'object'){
                        inputConfigMap.model = inputConfigMap.model.toString()
                      }
                      if(!inputConfigMap.model && inputConfigMap.data.options.length > 0){
                        snackbar.show = true
                        snackbar.text = $vuetify.lang.t('$vuetify.lang_tip_please_input')
                        snackbar.color = 'error'
                      } else {
                        request.post(`/cicd/run/${$route.params.runName}/input`, {
                          phaseID: inputConfigMap.data.phaseID,
                          inputValue: inputConfigMap.model
                        }).then(() => {
                          inputConfigMap = {}
                        })
                      }
                    }"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
                  </v-btn>
                  <v-btn
                    @click="() => {
                          request.post(`/cicd/run/${$route.params.runName}/input`, {
                            phaseID: inputConfigMap.data.phaseID,
                            inputValue: 'ABORT'
                          }).then(() => {
                            inputConfigMap = {}
                          })
                        }"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_menu_abort_run')}}
                  </v-btn>
                </v-col>
                <v-col
                  v-else
                  cols="12"
                >
                  <v-alert
                    dense
                    type="info"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_tip_wait_api_input')}}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </info-card>
          <div style="overflow-x: auto">
            <vue-pipeline
              ref="pipeline"
              :x="parseInt(50)"
              :y="parseInt(55)"
              :data="pipelineData"
              :showArrow="false"
              :ystep="70"
              :xstep="160"
              :lineStyle="'default'"
              :selected-list="selectedList"
              @node-click="(node, index) => {
                $observables.graphNodeClick$.next({node, index})
                if (node.name === 'Start' || node.name === 'End') {
                  stepLog = true
                } else {
                  stepLog = false
                }
              }"
            />
          </div>
          <v-expansion-panels class="mt-2">
            <v-expansion-panel v-for="(stepArr, i) in stepsList" :key="i" :id="'ex' + stepArr[0].stepID" v-if="!stepLog || stepArr[stepArr.length - 1].logType !== 'ABORT'">
              <v-expansion-panel-header>
                <v-row>
                <v-col cols="2">{{ $vuetify.lang.t('$vuetify.lang_view_step') }}</v-col>
                  <v-col class="text-truncate" :title="stepArr[0].content">{{ stepArr[0].content }}</v-col>
                  <!--                  <v-divider vertical class="mx-2" style="height: 15px"/>-->
                  <v-col style="width: 105px; flex: 0 0 105px">
                    <v-chip small class="mb-1 white--text" :color="statusColorMap[stepArr[stepArr.length - 1].logType] || 'primary'">
                      {{stepArr[stepArr.length - 1].logType}}
                    </v-chip>
                  </v-col>
                  <v-col cols="3">
                    <span>{{ stepArr[0].createTime }}</span>
                    <span v-show="['SUCCESS', 'ABORT', 'FAIL'].includes(stepArr[stepArr.length - 1].logType)">
                      / {{ stepArr[stepArr.length - 1].content }}
                    </span>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative" class="pa-2">
                <pre
                  v-for="(logMsg, i) in logList.filter(log => log.stepID === stepArr[0].stepID)"
                  :key="i"
                  :id="'log' + i"
                  :ref="'log' + i"
                  :style="logMsg.logType | changeColor"
                >[{{ logMsg.logType }}] {{ logMsg.createTime }}  {{ logMsg.content }}</pre>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div ref="outputRunLog" style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative" class="pa-2 mt-2" >
            <div ref="outputRunLogDiv"></div>
            <v-btn
              :fixed="true"
              :style="{
                bottom: '30px',
                right: '38px',
                zIndex: 10000
              }"
              fab
              color="primary"
              ref="logAbsoluteBtn"
              @click="() => {
                if(scrollToEnd) {
                  scrollToEnd = false
                } else {
                  $vuetify.goTo('#log' + (logList.length - 1), {
                    duration: 500
                  })
                  scrollToEnd = true
                }
              }"
              v-click-outside="() => {
                scrollToEnd = false
              }"
            >
              <v-icon v-if="!scrollToEnd">mdi-chevron-down</v-icon>
              <v-icon v-else>mdi-close</v-icon>
            </v-btn>
            <v-btn
              :fixed="true"
              :style="{
                bottom: '102px',
                right: '38px',
                zIndex: 10000
              }"
              fab
              color="primary"
              @click="() => {
                $vuetify.goTo('.top-card', {
                  duration: 500
                })
              }"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
            <pre
              v-for="(logMsg, i) in logList"
              :key="i"
              :id="'log' + i"
              :ref="'log' + i"
              :style="logMsg.logType | changeColor"
            >[{{ logMsg.logType }}] {{ logMsg.createTime }}  {{ logMsg.content }}</pre>
          </div>
        </v-tab-item>
        <v-tab-item>
          <CommitsDataTable
            :commits="commitsPageData.rows"
            :items-per-page="commitsPageData.pageSize"
            :page="commitsPageData.currentPage"
            :server-items-length="commitsPageData.total"
            class="elevation-1 commits-table"
            dense
            :footer-props="{
                showCurrentPage: true,
                itemsPerPageOptions: [ 5, 10, 15, 20 ]
              }"
            show-expand
            :loading="commitsPageData.loading"
            :loading-text="$vuetify.lang.t('$vuetify.lang_tip_loading_data')"
            @update:options="(value) => {
              commitsPageData.currentPage = value.page
              commitsPageData.pageSize = value.itemsPerPage
              $observables.queryCommitsPage$.next('dataOptionChange')
            }"
          />
        </v-tab-item>
        <v-tab-item>
          <module-infos v-if="modules" :modules="modules" :projectName="run.projectName" />
        </v-tab-item>
        <v-tab-item>
          <v-container class="d-flex flex-wrap" fluid>
            <v-autocomplete
              :items="statusItems"
              :label="$vuetify.lang.t('$vuetify.lang_form_status')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="stepsForm.statusResults"
              @blur="() => {
                $observables.queryStepsPage$.next('searchForm')
              }"
            ></v-autocomplete>
            <v-autocomplete
              :items="stepItems"
              :label="$vuetify.lang.t('$vuetify.lang_form_step_action')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="stepsForm.stepActions"
              @blur="() => {
                $observables.queryStepsPage$.next('searchForm')
              }"
            ></v-autocomplete>
            <v-autocomplete
              :items="moduleNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_module_name')"
              class="mr-8"
              dense
              clearable
              v-model="stepsForm.moduleName"
              @change="() => {
                $observables.queryStepsPage$.next('searchForm')
              }"
            ></v-autocomplete>
            <v-autocomplete
              :items="moduleItems"
              :label="$vuetify.lang.t('$vuetify.lang_form_module_type')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="stepsForm.moduleTypes"
              @blur="() => {
                $observables.queryStepsPage$.next('searchForm')
              }"
            ></v-autocomplete>
            <v-autocomplete
              :items="[
                { value: 'createTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                { value: 'createTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
              class="mr-8"
              clearable
              dense
              v-model="stepsForm.sortMode"
              @change="() => {
                $observables.queryStepsPage$.next('searchForm')
              }"
            ></v-autocomplete>
          </v-container>
          <StepsDataTable
            :steps="stepsPageData.rows"
            :server-items-length="stepsPageData.total"
            :loading="stepsPageData.loading"
            :footerProps="{
              showCurrentPage: true
            }"
            :expanded.sync="stepsPageData.expanded"
            :options="{
              page: stepsPageData.currentPage,
              itemsPerPage: stepsPageData.pageSize
            }"
            @update:options="(value) => {
              stepsPageData.currentPage = value.page
              stepsPageData.pageSize = value.itemsPerPage
              $observables.queryStepsPage$.next('dataOptionChange')
            }"
            :console="runLog"
          />
        </v-tab-item>
      </v-tabs-items>
    </info-card>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="2000"
      :color="snackbar.color"
      class="white--text"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-dialog
      v-model="runDefDialog"
      max-width="960px"
      persistent
      eager
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_run_def')}}</span>
          <v-spacer></v-spacer>
          <v-icon class="ml-4" @click="() => {
            this.closeRunDef()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <Monaco
            ref="monacoRunDef"
            :monacoOptions="singleMonacoOptions"
            :height="600"
          ></Monaco>
        </v-card-text>
      </v-card>
    </v-dialog>
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
            :ref="'log' + i"
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
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <DialogDefs
      :projectName="targetProjectName"
      ref="DialogDefs"
    />
  </PageCard>
</template>

<script>
import {
  catchError,
  delay,
  mergeMap,
  pluck,
  retryWhen,
  scan,
  filter,
  map,
  tap,
  startWith,
  auditTime,
  switchMap,
  share,
  distinctUntilChanged,
  delayWhen,
  groupBy,
  shareReplay,
  withLatestFrom, debounceTime, bufferTime
} from 'rxjs/operators'
import InfoCard from '@/lib/ui-lib/components/InfoCard'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import StepsDataTable from '@/components/StepsDataTable'
import CommitsDataTable from '@/components/CommitsDataTable'
import DialogDefs from "@/components/DialogDefs";
import Monaco from "@/lib/monaco/Monaco";
import RUNS_API from '@/api/cicd/runs'
import STEPS_API from '@/api/cicd/steps'
import COMMITS_API from '@/api/cicd/commits'
import request, { rtnRetryWhenOperator } from '@/utils/request'
import { defer, of, Subject, combineLatest, forkJoin } from 'rxjs'
import ModuleInfos from '@/components/ModuleInfos'
import { webSocket } from 'rxjs/webSocket'
import { debounce } from 'lodash'
import { isEmpty, cloneDeep } from 'lodash/fp'
import User from '@/services/user'
import {vuetify} from '@/plugins/vuetify'

const userService = User.getInstance()
const statusMap = {
  finish: 'success',
  SUCCESS: 'success',
  abort: 'aborted',
  ABORT: 'aborted',
  fail: 'failure',
  FAIL: 'failure',
  START: 'running',
  RUNNING: 'running',
  INPUT: 'unstable'
}
export default {
  inject: ['reload', 'successTip', 'errorTip', 'warnTip'],
  name: 'Run',
  components: {
    ModuleInfos,
    StepsDataTable,
    CommitsDataTable,
    InfoSingleTable,
    PageCard,
    InfoCard,
    DialogDefs,
    Monaco,
    Operations,
  },
  subscriptions () {
    const vm = this
    const runName$ = vm.$watchAsObservable('$route', { immediate: true }).pipe(
      pluck('newValue', 'params', 'runName'),
      map(next => {
        return next
      }),
      shareReplay(1)
    )
    const queriedRunInfo$ = runName$.pipe(
      mergeMap((runName) => {
        return defer(() => {
          return RUNS_API.getRun(runName)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(err => {
            return of(null).pipe(
              tap(_ => {
                vm.snackbar.show = true
                vm.snackbar.text = err.response.data.msg
                vm.snackbar.color = 'error'
                vm.cardLoading = false
              }),
              delay(2000),
              tap(_ => {
                vm.$router.go(-1)
              })
            )
          })
        )
      }),
      shareReplay(1)
    )
    return {
      runName$: runName$,
      queriedRunInfo$: queriedRunInfo$,
      queryStepsPage$: new Subject(),
      queryCommitsPage$: new Subject(),
      graphNodeClick$: new Subject(),
      stepsLogCompleted$: new Subject(),
      abortRunClick$: new Subject()
    }
  },
  data () {
    const vm = this
    return {
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
      userToken: '',
      auditDialog: false,
      btnLoading: false,
      logPreview: [],
      disableBtn: false,
      console,
      request,
      logAbsoluteBtn: 'absolute',
      scrollToEnd: false,
      cardLoading: true,
      currentSelectNodeData: {},
      run: {
        projectName: '',
        pipelineName: '',
        runName: '',
        status: {}
      },
      modules: '',
      stepsForm: {
        projectNames: [],
        pipelineNames: [],
        runNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        stepActions: [],
        moduleTypes: [],
        moduleName: '',
        sortMode: '',
      },
      statusItems: [],
      stepItems: [],
      moduleItems: [],
      moduleNames: [],
      statusColorMap: {
        FAIL: 'red',
        RUNNING: 'blue',
        SUCCESS: 'green',
        ABORT: 'grey',
        INPUT: 'orange',
        PAUSE: 'blue-grey'
      },
      stepsPageData: {
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        rows: [],
        expanded: []
      },
      commitsPageData: {
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        rows: [],
        expanded: []
      },
      tab: 0,
      phasePipelineData: [{
        name: 'Start',
        hint: 'start',
        status: 'start',
        next: [
          { index: 1, weight: 0 }
        ],
        data: {}
      }, {
        name: 'End',
        hint: 'finish',
        status: 'end',
        next: [],
        data: {}
      }],
      phasePipelineDataShow: [{
        name: 'Start',
        hint: 'start',
        status: 'start',
        next: [
          { index: 1, weight: 0 }
        ],
        data: {}
      }, {
        name: 'End',
        hint: 'finish',
        get status () {
          return statusMap[vm.run.status.result] || 'end'
        },
        next: [],
        data: {}
      }],
      phaseSelectedList: [],
      pipelineData: [{
        name: 'Start',
        hint: 'start',
        status: 'start',
        next: [
          { index: 1, weight: 0 }
        ],
        data: {}
      }, {
        name: 'End',
        hint: 'finish',
        get status () {
          return statusMap[vm.run.status.result] || 'end'
        },
        // status: 'end',
        next: [],
        data: {}
      }],
      pipelineDataShow: [{
        name: 'Start',
        hint: 'start',
        status: 'start',
        next: [
          { index: 1, weight: 0 }
        ],
        data: {}
      }, {
        name: 'End',
        hint: 'finish',
        get status () {
          return statusMap[vm.run.status.result] || 'end'
        },
        next: [],
        data: {}
      }],
      selectedList: [],
      code: '',
      logList: [],
      value: [],
      snackbar: {
        show: false,
        color: 'success',
        text: ''
      },
      stepsList: [],
      inputConfigMap: {},
      endShow: false,
      targetProjectName: '',
      runDefDialog: false,
      originLogWebsocket$: null,
      originDirectiveWebsocket$: null,
      stepLog: true,
      opts: [],      
    }
  },
  methods: {
    abortRun (runName) {
      request.patch(`/cicd/run/${runName}`).then(response => {
      }).catch(_ => {})
    },
    reRun (pipelineName) {
      request.post(`/cicd/pipeline/${pipelineName}`).then(response => {
        this.$router.push({
          name: 'CicdRun',
          params: {
            runName: response.data.runName
          }
        }).catch(error => {this.errorTip(true, error.response.data.msg)})
      })
    },
    batchRun (projectName, opsBatchName) {
      request.post(`/cicd/batch/${projectName}/${opsBatchName}`).then(response => {
        this.$router.push({
          name: 'CicdRun',
          params: {
            runName: response.data.runName
          }
        })
      }).catch(error => {this.errorTip(true, error.response.data.msg)})
    },
    topRun (runName) {
      const vm = this
      request.post(`/cicd/queue/${runName}/top`).then(response => {
        vm.successTip(true, response.msg)
        vm.$router.push({
          name: 'CicdQueue'
        })
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
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
    runLog(runName, stepID) {
      const vm = this
      vm.logPreview = []
      vm.auditDialog = true
      vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/run/${runName}?kind=log&stepID=${stepID}&x-user-token=${vm.userToken}`)
      const logPreviewData = []
      const setLogPreview = debounce(function (logPreviewData) {
        vm.logPreview = cloneDeep(logPreviewData)
      }, 500, {
        leading: true
      })
      vm.ws.onmessage = (event) => {
        logPreviewData.push(JSON.parse(event.data))
        setLogPreview(logPreviewData)
      }
      vm.ws.onclose = () => {
        logPreviewData.push({ logType: 'END' })
        vm.disableBtn = false
      }
    },
    openRunDef() {
      const vm = this;
      vm.$refs.monacoRunDef.monacoEditor.setValue(vm.run.pipelineDefYaml)
      vm.runDefDialog = true;
    },
    closeRunDef() {
      const vm = this;
      vm.$refs.monacoRunDef.monacoEditor.setValue('')
      vm.runDefDialog = false;
    },
  },
  computed: {
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    const runName = vm.$route.params.runName
    vm.targetProjectName = runName.split("-").slice(0, -2).join('-')
    request.get('/cicd/stepOptions').then(response => {
      vm.statusItems = response.data.statusResults
      vm.stepItems = response.data.stepActions
      vm.moduleItems = response.data.moduleTypes
      vm.moduleNames = response.data.moduleNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    vm.$watchAsObservable('tab').pipe(
      pluck('newValue')
    ).subscribe(next => {
      if (next === 1) {
        vm.$observables.queryCommitsPage$.next('tabChange')
      } else if (next === 2) {
        RUNS_API.getRun(vm.run.runName).then(response => {
          vm.run = response.data.run
          vm.opts = []
          vm.run.opsBatchDefs.forEach((row, i) => {
            vm.opts.push(
              {
                text: row.opsBatchDesc,
                onClick: () => {
                  vm.batchRun(vm.targetProjectName, row.opsBatchName)
                }
              }
            )
          })
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      } else if (next === 3) {
        vm.$observables.queryStepsPage$.next('tabChange')
      }
    })
    vm.$observables.queriedRunInfo$.pipe(
      filter(next => next),
      tap(next => {
        vm.cardLoading = false
        vm.copyBranchList = next.data.branchNames
        vm.run = next.data.run
        vm.opts = []
        vm.run.opsBatchDefs.forEach((row, i) => {
          vm.opts.push(
            {
              text: row.opsBatchDesc,
              onClick: () => {
                vm.batchRun(vm.targetProjectName, row.opsBatchName)
              }
            }
          )
        })
        vm.errMsgPipelineDef = next.data.errMsgPipelineDef
        if(next.data.errMsgPipelineDef === undefined){
          vm.errMsgPipelineDef = ''
        }
        vm.cicdCustomStepInserts = next.data.cicdCustomStepInserts
        vm.modules = next.data.modules
      }),
      map(next => {
        return [
          vm.run.projectName,
          vm.run.pipelineName,
          vm.run.runName,
          next
        ]
      }),
      filter(next => {
        return vm.stepsForm.projectNames[0] !== next[0] || vm.stepsForm.pipelineNames[0] !== next[1] || vm.stepsForm.runName !== next[2]
      }),
      tap(next => {
        vm.stepsForm.projectNames = [next[0]]
        vm.stepsForm.pipelineNames = [next[1]]
        vm.stepsForm.runNames = [next[2]]
      }),
      map(next => next[3]),
      filter(next => {
        const status = next.data.run.status.result
        return status !== 'SUCCESS' && status !== 'ABORT' && status !== 'FAIL'
      })
    ).subscribe(next => {
    })
    vm.$observables.queryCommitsPage$.pipe(
      tap(next => {
        vm.commitsPageData.loading = true
      }),
      mergeMap(next => {
        return defer(() => {
          return COMMITS_API.getCommits(Object.assign({}, {
            projectNames: [vm.run.projectName],
            pipelineNames: [vm.run.pipelineName],
            runNames: [vm.run.runName],
          }, {
            page: vm.commitsPageData.currentPage,
            perPage: vm.commitsPageData.pageSize
          }))
        }).pipe(
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
          catchError(err => {
            vm.snackbar.show = true
            vm.snackbar.text = err.response.data.msg
            vm.snackbar.color = 'error'
            vm.commitsPageData.loading = false
            return of(null)
          })
        )
      })
    ).subscribe(response => {
      vm.commitsPageData.loading = false
      vm.commitsPageData.rows = response.data.commits
      vm.commitsPageData.total = response.data.totalCount
      vm.commitsPageData.expanded = []
    })
    vm.$observables.queryStepsPage$.pipe(
      tap(next => {
        vm.stepsPageData.loading = true
      }),
      mergeMap(next => {
        return defer(() => {
          return STEPS_API.getSteps(Object.assign({}, { ...vm.stepsForm }, {
            page: vm.stepsPageData.currentPage,
            perPage: vm.stepsPageData.pageSize
          }))
        }).pipe(
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
          catchError(err => {
            vm.snackbar.show = true
            vm.snackbar.text = err.response.data.msg
            vm.snackbar.color = 'error'
            vm.stepsPageData.loading = false
            return of(null)
          })
        )
      })
    ).subscribe(response => {
      vm.stepsPageData.loading = false
      vm.stepsPageData.rows = response.data.steps
      vm.stepsPageData.displayRows = response.data.steps
      vm.stepsPageData.total = response.data.totalCount
      vm.stepsPageData.expanded = []
    })

    let logWebsocket$ = null
    let reactiveWebsocket$ = null
    logWebsocket$ = vm.$observables.runName$.pipe(
      switchMap(next => {
        vm.originLogWebsocket$ = webSocket({
          url: `${vm.GLOBAL_WS_API}/ws/log/run/${next}?kind=log&x-user-token=${userService.userObj$.getValue().userToken}`
        })
        return vm.originLogWebsocket$.pipe(
          catchError(err => {
            return of({ logType: 'END' })
          })
        )
      }),
      filter(next => next),
      share()
    )
    reactiveWebsocket$ = vm.$observables.runName$.pipe(
      switchMap(next => {
        vm.originDirectiveWebsocket$ = webSocket({
          url: `${vm.GLOBAL_WS_API}/ws/log/run/${next}?kind=directive&x-user-token=${userService.userObj$.getValue().userToken}`
        })
        return vm.originDirectiveWebsocket$.pipe(
          catchError(err => {
            return of(null)
          })
        )
      }),
      filter(next => next),
      share()
    )
    vm.$subscribeTo(combineLatest([
      logWebsocket$.pipe(
        scan((acc, value) => {
          acc.push(value)
          return acc
        }, []),
        auditTime(500)
      ),
      vm.$observables.graphNodeClick$.pipe(
        startWith({ node: { data: {} }, index: 0 }),
        tap(({ node, index }) => {
          if (!node || isEmpty(node.data)) {
            vm.selectedList = vm.pipelineData.map(_ => false)
            vm.phaseSelectedList = vm.phasePipelineData.map(_ => false)
          } else if (node.data.stageID === '') {
            vm.selectedList = vm.pipelineData.map(_ => false)
            vm.phaseSelectedList = vm.phasePipelineData.map((_, nodeIndex) => nodeIndex === index)
          } else {
            vm.selectedList = vm.pipelineData.map((_, nodeIndex) => nodeIndex === index)
            vm.phaseSelectedList = vm.phasePipelineData.map(_ => false)
          }
        }),
        pluck('node')
      )
    ]), {
      next (next) {
        const logList = next[0]
        const nodeClick = next[1]
        const nodeStageId = nodeClick.data.stageID || ''
        const nodePhaseId = nodeClick.data.phaseID || ''
        vm.logList = logList.filter(row => {
          if (
            !nodeClick || (nodeStageId === '' && nodePhaseId === '') ||
            (nodeStageId !== '' && row.phaseID === nodePhaseId && row.stageID === nodeStageId) ||
            (nodeStageId === '' && row.phaseID === nodePhaseId)
          ) {
            return true
          } else {
            return false
          }
        })
        if (vm.scrollToEnd) {
          vm.$nextTick(() => {
            vm.$vuetify.goTo('#log' + (vm.logList.length - 1), {
              duration: 500
            })
            vm.$observables.stepsLogCompleted$.next('')
          })
        } else {
          vm.$nextTick(() => {
            vm.$observables.stepsLogCompleted$.next('')
          })
        }
      },
      error () {},
      complete () {}
    })
    const reactiveData$ = reactiveWebsocket$.pipe(
      bufferTime(500),
      filter(next => next && next.length > 0),
      scan((acc, nextArr) => {
        acc.inputConfigData = {}
        nextArr.forEach((next, index) => {
          const reactiveKey = next.phaseID + '_' + next.stageID + '_' + next.stepID
          let reactiveObj = acc.reactiveMap[reactiveKey]
          if (!reactiveObj) {
            acc.reactiveMap[reactiveKey] = {
              dataList: []
            }
            reactiveObj = acc.reactiveMap[reactiveKey]
          }
          reactiveObj.dataList.push(next)

          if (next.logType === 'INPUT') {
            acc.inputConfigData = next
          }
          if (next.logType === 'CREATE' && next.stepID === '' && next.stageID === '' && next.phaseID !== '') {
            acc.phasePipelineData.push({
              name: next.content,
              hint: next.content,
              status: 'aborted',
              data: next,
              next: [{ index: acc.phasePipelineData.length + 2, weight: 0 }]
            })
            reactiveObj.phasePipeLineIndex = acc.phasePipelineData.length - 1
          } else if (next.logType !== 'CREATE' && next.stepID === '' && next.stageID === '' && next.phaseID !== '') {
            acc.phasePipelineData[reactiveObj.phasePipeLineIndex].status = statusMap[next.logType]
          } else if (next.logType === 'CREATE' && next.stepID === '' && next.stageID !== '' && next.phaseID !== '') {
            const pipelineDataMap = acc.pipelineDataMap
            const phaseList = acc.pipelineDataMap.phaseList
            const phaseListLength = phaseList.length
            const lastPhaseID = phaseList[phaseListLength - 1]
            const phaseID = next.phaseID
            const pipelineData = acc.pipelineData
            const pipelineDataLength = acc.pipelineData.length
            if (!pipelineDataMap[phaseID]) {
              const graphNode = {
                name: next.content,
                hint: next.content,
                status: 'aborted',
                data: next,
                next: [{ index: pipelineDataLength + 1, weight: 0 }]
              }
              pipelineData.push(graphNode)
              pipelineDataMap[phaseID] = pipelineDataLength
              const lastPhaseNodesListStartIndex = pipelineDataMap[lastPhaseID]
              for (let i = lastPhaseNodesListStartIndex; i < pipelineDataLength; i++) {
                pipelineData[i].next[0].index = pipelineDataLength
              }
              acc.pipelineDataMap.phaseList.push(next.phaseID)
            } else {
              const graphNode = {
                name: next.content,
                hint: next.content,
                status: 'aborted',
                data: next,
                next: [{ index: pipelineDataLength + 1, weight: 0 }]
              }
              pipelineData.push(graphNode)
              const last2PhaseID = phaseList[phaseListLength - 2]
              const last2PhaseNodesListStartIndex = pipelineDataMap[last2PhaseID]
              pipelineData[last2PhaseNodesListStartIndex].next.push({ index: pipelineDataLength, weight: 0 })
              const lastPhaseNodesListStartIndex = pipelineDataMap[lastPhaseID]
              for (let i = lastPhaseNodesListStartIndex; i < pipelineDataLength; i++) {
                pipelineData[i].next[0].index = pipelineDataLength + 1
              }
            }
            reactiveObj.pipeLineDataIndex = acc.pipelineData.length - 1
          } else if (next.logType !== 'CREATE' && next.stepID === '' && next.stageID !== '' && next.phaseID !== '') {
            acc.pipelineData[reactiveObj.pipeLineDataIndex].status = statusMap[next.logType]
          } else if (next.logType === 'CREATE' && next.stepID !== '') {
            acc.stepsList.push(reactiveObj.dataList)
          }
        })
        return acc
      }, {
        runResult: null,
        reactiveMap: {},
        phasePipelineData: [],
        pipelineData: [{
          name: 'Start',
          hint: 'start',
          status: 'start',
          next: [{ index: 1, weight: 0 }],
          data: {}
        }],
        pipelineDataMap: {
          phaseList: ['graphStartNode'],
          graphStartNode: 0
        },
        stepsList: [],
        inputConfigData: {}
      }),
      shareReplay(1)
    )
    vm.$subscribeTo(reactiveData$.pipe(
      tap(next => {
        const startTime = new Date().getTime()
        vm.phasePipelineData = [
          {
            name: 'Start',
            hint: 'start',
            status: 'start',
            next: [
              { index: 1, weight: 0 }
            ],
            data: {}
          }, ...next.phasePipelineData, {
            name: 'End',
            hint: 'finish',
            // status: vm.phasePipelineData[vm.phasePipelineData.length - 1].status,
            get status () {
              return statusMap[vm.run.status.result] || 'end'
            },
            next: [],
            data: {}
          }
        ]
        vm.pipelineData = [
          ...next.pipelineData, {
            name: 'End',
            hint: 'finish',
            // status: vm.pipelineData[vm.pipelineData.length - 1].status,
            get status () {
              return statusMap[vm.run.status.result] || 'end'
            },
            next: [],
            data: {}
          }
        ]
        vm.$nextTick(() => {
        })
      })
    ), () => {})
    vm.$subscribeTo(combineLatest([
      reactiveData$,
      vm.$observables.graphNodeClick$.pipe(
        pluck('node')
      )]).pipe(
      map(next => {
        const reactiveMap = next[0].reactiveMap
        const clickNode = next[1].data || {}
        const reactiveObj = reactiveMap[clickNode.phaseID + '_' + clickNode.stageID + '_'] || {
          dataList: []
        }
        return [...(reactiveObj.dataList)]
      }),
      distinctUntilChanged((x, y) => {
        return JSON.stringify(x) === JSON.stringify(y)
      })
    ), next => {
      const currentSelectNodeData = {}
      next.forEach(row => {
        currentSelectNodeData.logType = row.logType
        currentSelectNodeData.nodeType = (() => {
          if (row.phaseID === '') {
            return vuetify.preset.lang.t('$vuetify.lang_view_run')
          } else if (row.stageID === '') {
            return vuetify.preset.lang.t('$vuetify.lang_view_phase')
          } else if (row.stepID === '') {
            return vuetify.preset.lang.t('$vuetify.lang_view_stage')
          } else {
            return vuetify.preset.lang.t('$vuetify.lang_view_step')
          }
        })()
        if (row.logType === 'CREATE') {
          currentSelectNodeData.nodeName = row.content
        } else if (row.logType === 'START') {
          currentSelectNodeData.startTime = row.createTime
        } else if (row.logType === 'SUCCESS') {
          currentSelectNodeData.endTime = row.createTime
          currentSelectNodeData.duration = row.content
        } else if (row.logType === 'ABORT') {
          currentSelectNodeData.endTime = row.createTime
          currentSelectNodeData.duration = row.content
        } else if (row.logType === 'FAIL') {
          currentSelectNodeData.endTime = row.createTime
          currentSelectNodeData.duration = row.content
        } else if (row.logType === 'INPUT') {
          // currentSelectNodeData.endTime = row.createTime
          // currentSelectNodeData.duration = row.content
        }
      })
      vm.currentSelectNodeData = currentSelectNodeData
    })

    vm.$subscribeTo(combineLatest([
      reactiveData$,
      vm.$observables.graphNodeClick$.pipe(
        pluck('node'),
        startWith({})
      )
    ]).pipe(
      map(next => {
        const reactiveStepArr = next[0].stepsList
        const clickNode = next[1].data || {}
        if (!clickNode.phaseID || clickNode.phaseID === '') {
          return reactiveStepArr
        } else if (clickNode.stageID === '') {
          return reactiveStepArr.filter(row => {
            return row[0].phaseID === clickNode.phaseID
          })
        } else {
          return reactiveStepArr.filter(row => {
            return row[0].phaseID === clickNode.phaseID && row[0].stageID === clickNode.stageID
          })
        }
      }),
      distinctUntilChanged((x, y) => {
        return JSON.stringify(x) === JSON.stringify(y)
      })
    ), (next) => {
      vm.stepsList = next
    })

    vm.$subscribeTo(reactiveData$.pipe(
      filter(next => next.inputConfigData && !isEmpty(next.inputConfigData)),
      tap(next => {}),
      withLatestFrom(vm.$observables.runName$),
      mergeMap(next => {
        return request.get(`/cicd/run/${next[1]}/input`)
      }),
      tap(next => {
        const inputResponse = next
        if (inputResponse.data.phaseID === '') {
          vm.inputConfigMap = {}
        } else {
          vm.inputConfigMap = Object.assign({}, inputResponse, {
            model: inputResponse.data.options.length === 0 ? 'CONFIRM' : ''
          })
          vm.$nextTick(() => {
            vm.$vuetify.goTo('#inputConfigForm', {
              offset: 20
            })
          })
        }
      }),
      delayWhen(next => vm.$observables.stepsLogCompleted$),
      tap(next => {
        if (next.data.phaseID !== '') {
          vm.$vuetify.goTo('#inputConfigForm', {
            offset: 20
          })
        }
      })
    ), (next) => {})

    const filteredQueriedRunInfo$ = vm.$observables.queriedRunInfo$.pipe(
      tap(next => {
        // vm.phasePipelineData[vm.phasePipelineData.length - 1].status = statusMap[next.data.run.status.result]
        // vm.pipelineData[vm.pipelineData.length - 1].status = statusMap[next.data.run.status.result]
      }),
      filter(next => {
        const status = next.data.run.status.result
        return status !== 'SUCCESS' && status !== 'ABORT' && status !== 'FAIL' && status !== 'PAUSE'
        // return true
      }),
      shareReplay(1)
    )
    vm.$subscribeTo(reactiveWebsocket$.pipe(
      mergeMap(reactiveItem => {
        return filteredQueriedRunInfo$.pipe(
          map(_ => reactiveItem)
        )
      }),
      distinctUntilChanged((x, y) => {
        return !(
          (x.logType === 'INPUT' && ['START', 'CREATE'].includes(y.logType)) ||
          y.logType === 'INPUT' ||
          (y.phaseID === '' && ['SUCCESS', 'ABORT', 'FAIL'].includes(y.logType))
        )
      })
    ), next => {
      if (['SUCCESS', 'FAIL', 'ABORT'].includes(next.logType)) {
        RUNS_API.getRun(vm.run.runName).then(response => {
          vm.run = response.data.run
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      } else if (next.logType === 'INPUT') {
        vm.run.status.result = next.logType
      } else {
        vm.run.status.result = 'RUNNING'
      }
      // vm.phasePipelineData[vm.phasePipelineData.length - 1].statue = statusMap[vm.run.status.result]
      // vm.pipelineData[vm.pipelineData.length - 1].statue = statusMap[vm.run.status.result]
    })
  },
  mounted () {
    const vm = this
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          vm.logAbsoluteBtn = 'absolute'
        } else if (entry.isIntersecting === false && entry.boundingClientRect.top <= 70) {
          vm.logAbsoluteBtn = 'fixed'
        } else if (entry.isIntersecting === false && entry.boundingClientRect.top >= window.innerHeight) {
          vm.logAbsoluteBtn = 'absolute'
        }
      })
    }, {
      rootMargin: '-70px 0px 0px 0px',
      threshold: [0, 1]
    })
    io.observe(vm.$refs.outputRunLogDiv)
  },
  filters: {
    changeColor: function (value) {
      if (value == 'ERROR') {
        return { color: 'red' }
      } else if (value == 'WARNING') {
        return { color: 'orange' }
      } else {
        return null
      }
    }
  },
  beforeDestroy () {
    const vm = this
    vm.originLogWebsocket$.error({ code: 1005, reason: 'page destroy' })
    vm.originLogWebsocket$.complete()
    vm.originDirectiveWebsocket$.complete()
  }
}
</script>

<style>
.pipeline-card .no-shadow {
  box-shadow: none !important;
}
.pipeline-card .v-card__title {
  padding-bottom: 0;
}
</style>
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
.modules-item {
  cursor: pointer;
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
