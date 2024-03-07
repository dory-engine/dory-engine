<template>
  <div>
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_menu_mail_send_logs_management')">
      <v-card>
        <v-card-title>
          <v-form ref="form">
            <v-container class="d-flex flex-wrap">
              <v-text-field
                class="mr-8"
                :label="$vuetify.lang.t('$vuetify.lang_from_mail_log_to')"
                dense
                v-model="mailLogsForm.to"
                @keyup.enter="mailLogsSearch()"
              >
              </v-text-field>
              <v-text-field
                class="mr-8"
                :label="$vuetify.lang.t('$vuetify.lang_from_mail_log_subject')"
                dense
                v-model="mailLogsForm.subject"
                @keyup.enter="mailLogsSearch()"
              >
              </v-text-field>
              <v-select
                :items="[
                  {text: $vuetify.lang.t('$vuetify.lang_form_all'), value: ''},
                  {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: 'yes'},
                  {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: 'no'}
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_from_mail_log_enable_resend')"
                class="mr-8"
                dense
                v-model="mailLogsForm.enableResend"
                @blur="mailLogsSearch()"
              >
              </v-select>
              <v-select
                :items="['SUCCESS', 'FAIL']"
                :label="$vuetify.lang.t('$vuetify.lang_from_mail_log_statuses')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="mailLogsForm.statuses"
                @blur="mailLogsSearch()"
              >
              </v-select>
              <template>
                <v-menu
                  v-model="menu"
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
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_menu_mail_send_logs')}}
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="resendMail()">{{$vuetify.lang.t('$vuetify.lang_view_mail_log_resend')}}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="mailLogsHeaders"
            :items="mailLogsData.mailLogs"
            :page="mailLogsForm.page"
            :items-per-page="mailLogsForm.perPage"
            :server-items-length="mailLogsData.totalCount"
            item-key="index"
            show-expand
            show-select
            :footer-props="{
              showCurrentPage: true,
              itemsPerPageOptions: [ 5, 10, 15, 20 ]
            }"
            :loading="tableLoading"
            @update:options="changeOptions($event)"
            @input="selectRows($event)"
            :value="selectList"
          >
            <template v-slot:item.status="{ item }">
              <v-chip small dark v-if="item.status == 'SUCCESS'" color="green">
                {{ item.status }}
              </v-chip>
              <v-chip small dark v-else color="error">
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.enableResend="{ item }">
              <v-chip small dark v-if="item.enableResend" color="green">
                {{ $vuetify.lang.t('$vuetify.lang_view_mail_log_resend') }}
              </v-chip>
              <v-chip small dark v-else color="grey">
                {{ $vuetify.lang.t('$vuetify.lang_view_mail_log_resend') }}
              </v-chip>
            </template>
            <template v-slot:item.createTime="{ item }">
              <div>{{ item.createTime }}</div>
              <div>{{ item.duration }}</div>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-1 commits-table">
                <Monaco
                  ref="monaco"
                  :monacoOptions="item.msgEditorOption"
                  :height="500"
                  style="height: 30vh; overflow: hidden;"
                ></Monaco>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </PageCard>
    <div class="dialog-box">
      <v-dialog
          v-model="auditDialog"
          max-width="960px"
          persistent
        >
          <v-card>
            <v-card-title>
              <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_menu_view_logs') }}</span>
            </v-card-title>
            <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
              <pre
                v-for="(logMsg, i) in logList"
                :key="i"
                :id="'log' + i"
                :style="logMsg.logType | changeColor"
              >[{{ logMsg.logType }}] {{ logMsg.endTime }}  {{ logMsg.content }}</pre>
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
  </div>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'MailLogs',
  components: {
    PageCard,
    Operations,
    Monaco
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  data () {
    return {
      userToken: '',
      auditDialog: false,
      disableBtn: false,
      logList: [],
      mailLogsForm: {
        to: '',
        subject: '',
        enableResend: '',
        statuses: [],
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        page: 1,
        perPage: 10
      },
      mailLogIDs: [],
      selectList: [],
      mailLogsData: {},
      searchData: {},
      tableLoading: true,
      dates: [],
      menu: false
    }
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    vm.getList()
  },
  methods: {
    getList () {
      const vm = this
      vm.tableLoading = true
      request.post('admin/mailLogs', vm.mailLogsForm).then(response => {
        response.data.mailLogs.forEach((row, index) => {
          row.index = index
          var msg = ''
          if (row.text !== '') {
            msg = row.text
          } else if (row.html !== '') {
            msg = row.html
          }
          row.msgEditorOption = {
            value: msg,
            automaticLayout:true,
            readOnly: true,
            theme: "vs-dark",
            language: "plaintext"
          }
        })
        vm.mailLogsData = response.data
        vm.tableLoading = false
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    mailLogsSearch () {
      const vm = this
      vm.tableLoading = true
      var dates = vm.dates.sort()
      vm.mailLogsForm.createTimeRange.startDate = dates[0]
      vm.mailLogsForm.createTimeRange.endDate = dates[1]
      request.post('admin/mailLogs', vm.mailLogsForm).then(response => {
        response.data.mailLogs.forEach((row, index) => {
          row.index = index          
          var msg = ''
          if (row.text !== '') {
            msg = row.text
          } else if (row.html !== '') {
            msg = row.html
          }
          row.msgEditorOption = {
            value: msg,
            automaticLayout:true,
            readOnly: true,
            theme: "vs-dark",
            language: "plaintext"
          }
        })
        vm.mailLogsData = response.data
        vm.tableLoading = false
        vm.successTip(true, response.msg)
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    selectRows (rows) {
      const vm = this
      vm.selectList = rows
      vm.mailLogIDs = []
      rows.map(row => {
        vm.mailLogIDs.push(row.mailLogID)
      })
    },
    resendMail () {
      const vm = this
      if (vm.mailLogIDs.length > 0) {
        request.put('/admin/mailLogs', {
          mailLogIDs: vm.mailLogIDs
        }).then(response => {
          vm.successTip(true,response.msg)
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
        vm.selectList = []
        vm.mailLogIDs = []
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_select_nothing'))
      }
    },
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
        vm.ws.onclose = (e) => {
          vm.logList.push({logType: 'END'})
          vm.disableBtn = false
          vm.getList(false)
        }
      }
    },
    closeLog () {
      this.auditDialog = false
    },
    changeOptions (data) {
      const vm = this
      vm.mailLogsForm.page = data.page
      vm.mailLogsForm.perPage = data.itemsPerPage
      vm.getList()
    },
    clearDates () {
      this.dates = []
      this.menu = false
      this.mailLogsSearch()
    },
    dateRangeSubmit () {
      this.menu = false
      this.mailLogsSearch()
    },
  },
  filters: {
    changeColor: function (value) {
      if(value == 'FAIL'){
        return {color: 'red'}
      }else if(value == 'INFO'){
        return {color: 'green'}
      }else{
        return null
      }
    },
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    mailLogsHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_to'), value: 'to', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_subject'), value: 'subject', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_enable_resend'), value: 'enableResend', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_statuses'), value: 'status', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_msg'), value: 'msg', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_log_create_time'), value: 'createTime', sortable: true },
      ]
    }
  }
}
</script>

<style>
.commits-table .CodeMirror {
  height: auto;
}
.commits-table .CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
<style lang="scss" scoped>

</style>
