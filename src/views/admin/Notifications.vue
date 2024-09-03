<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_menu_notifications_management')">
    <v-card class=" " flat>
      <v-card-title>
        <v-form ref="form">
          <v-container class="d-flex flex-wrap">
            <v-autocomplete
              :items="[ 'yes', 'no' ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_read')"
              class="mr-8"
              dense
              clearable
              v-model="notificationsForm.read"
              @change="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.projectNames || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.projectNames"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.pipelineNames || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_name')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.pipelineNames"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-combobox
              :label="$vuetify.lang.t('$vuetify.lang_form_run_name')"
              class="mr-8"
              dense
              multiple
              small-chips
              hide-selected
              v-model="notificationsForm.runNames"
              @blur="getList(true)"
            >
            </v-combobox>
            <v-autocomplete
              :items="options.branchNames || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_branch_name')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.branchNames"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.envNames || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_env')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.envNames"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.stepActions || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_step_action')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.stepActions"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.moduleTypes || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_module_type')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.moduleTypes"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="[ 'SUCCESS', 'FAIL' ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_status')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.stepResults"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="options.usernames || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_username')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="notificationsForm.usernames"
              @blur="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="[ 'yes', 'no' ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_step')"
              class="mr-8"
              dense
              small-chips
              clearable
              v-model="notificationsForm.isStep"
              @change="getList(true)"
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
              :items="[
                { value: 'createTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                { value: 'createTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
              class="mr-8"
              clearable
              dense
              v-model="notificationsForm.sortMode"
              @change="getList(true)"
            ></v-autocomplete>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <NotificationsDataTable
          :steps="pageData.notifications"
          :server-items-length="pageData.totalCount"
          :loading="tableLoading"
          :footerProps="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :expanded.sync="expanded"
          :options="{
            page: notificationsForm.page,
            itemsPerPage: notificationsForm.perPage
          }"
          @update:options="(value) => {
            notificationsForm.page = value.page
            notificationsForm.perPage = value.itemsPerPage
            getList(false)
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
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageCard>
</template>

<script>
import NotificationsDataTable from '@/components/NotificationsDataTable'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import request from '@/utils/request'
import { debounce } from 'lodash'
import { cloneDeep } from 'lodash/fp'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Notifications',
  components: { NotificationsDataTable, PageCard },
  data () {
    return {
      tableLoading: true,
      notificationsForm: {
        projectNames: [],
        pipelineNames: [],
        runNames: [],
        branchNames: [],
        envNames: [],
        stepActions: [],
        moduleTypes: [],
        stepResults: [],
        usernames: [],
        isStep: '',
        read: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        sortMode: '',
        page: 1,
        perPage: 10
      },
      pageData: {
        notifications: [],
        totalCount: 0
      },
      expanded: [],
      dates:[],
      menu2: false,
      options: {},
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
    vm.getList(false)
    request.get('/admin/notificationOptions').then(response => {
      vm.options = response.data
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
  },
  methods: {
    getList (hasTip) {
      const vm = this
      vm.tableLoading = true
      var dates = vm.dates.sort()
      vm.notificationsForm.createTimeRange.startDate = dates[0]
      vm.notificationsForm.createTimeRange.endDate = dates[1]
      request.post('/admin/notifications', vm.notificationsForm).then(response => {
        vm.pageData = response.data
        vm.tableLoading = false
        // console.log(response.data.notifications)
        if(hasTip) {
          vm.successTip(true,response.msg)
        }
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true,error.response.data.msg)
      })
    },
    clearDates () {
      this.dates = []
      this.menu2 = false
      this.getList(true)
    },
    dateRangeSubmit () {
      this.menu2 = false
      this.getList(true)
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
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
</style>
