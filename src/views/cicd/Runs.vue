<template>
  <div class="runs">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_runs_list')">
      <v-card>
        <v-card-title>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="projectItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.projectNames"
                @blur="getRuns()"
              ></v-autocomplete>
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
              <v-combobox
                :label="$vuetify.lang.t('$vuetify.lang_form_run_name')"
                class="mr-8"
                dense
                multiple
                small-chips
                hide-selected
                v-model="runsForm.runNames"
                @blur="getRuns()"
              >
              </v-combobox>
              <v-autocomplete
                :items="branchItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.branchNames"
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
              <v-autocomplete
                :items="archNames"
                :label="$vuetify.lang.t('$vuetify.lang_form_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.archNames"
                @blur="getRuns()"
              ></v-autocomplete>
              <v-autocomplete
                :items="['manual', 'webhook', 'crontab']"
                :label="$vuetify.lang.t('$vuetify.lang_form_trigger_kind')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="runsForm.triggerKinds"
                @blur="getRuns()"
              ></v-autocomplete>
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_start_user')"
                class="mr-8"
                dense
                v-model="runsForm.startUser"
                @keydown.enter="getRuns()"
              />
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_tag_name')"
                class="mr-8"
                dense
                v-model="runsForm.tagName"
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
    </PageCard>
  </div>
</template>

<script>
import request from '@/utils/request'
import RunsDataTable from "@/components/RunsDataTable";
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import RUNS_API from '@/api/cicd/runs';
import User from '@/services/user'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Runs',
  components: { RunsDataTable, PageCard },
  data () {
    return {
      dates: [],
      menu2: false,
      runsForm:{
        projectNames: [],
        pipelineNames: [],
        runNames: [],
        triggerKinds: [],
        branchNames: [],
        archNames: [],
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
      archNames: [],
      runsData: {},
      tableLoading: true,
      projectItems: [],
      pipelineItems: [],
      branchItems: [],
      statusItems: [ 'RUNNING', 'SUCCESS', 'FAIL', 'ABORT', 'INPUT' ],
      durationItems: [ 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_1'), value: 1 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_2'), value: 2 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_3'), value: 3 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_4'), value: 4 }, 
        { text: vuetify.preset.lang.t('$vuetify.lang_form_duration_tip_5'), value: 5 }
      ]
    }
  },
  created () {
    const vm = this
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
    request.get('/cicd/archNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.archNames = response.data.archNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    vm.websocketInit()
  },
  destroyed() {
    const vm = this
		vm.websock.close()
	},
  methods: {
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
    pageOptions(data){
      this.runsForm.page = data.page
      this.runsForm.perPage = data.perPage
      if(this.runsForm.duration == null) {
        this.runsForm.duration = 0
      }
      this.runsForm.startTimeRange.startDate = this.dates[0]
      this.runsForm.startTimeRange.endDate = this.dates[1]
      RUNS_API.getRuns(this.runsForm).then(response => {
        // console.log(response.data)
        this.runsData = response.data
        this.tableLoading = false
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
  }
}
</script>

<style lang="scss" scoped>

</style>
