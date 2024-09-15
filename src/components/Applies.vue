<template>
  <div class="applies">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_menu_applies_management')">
      <v-card>
        <v-card-title>
          <v-tabs grow v-model="mode">
            <v-tab @change="tabChange(0)">{{$vuetify.lang.t('$vuetify.lang_form_all')}}</v-tab>
            <v-tab @change="tabChange(1)">{{$vuetify.lang.t('$vuetify.lang_form_i_created')}}</v-tab>
            <v-tab @change="tabChange(2)">{{$vuetify.lang.t('$vuetify.lang_form_i_related')}}</v-tab>
          </v-tabs>
          <search-form>
            <v-autocomplete
              :items="projectItems"
              :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
              dense
              small-chips
              multiple
              clearable
              v-model="appliesForm.projectNames"
              @change="$observables.queryPage$.next('')"
            ></v-autocomplete>
            <v-autocomplete
              :items="[
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_new_project_node_ports'), value: 'nodePortAdd'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_delete_project_node_ports'), value: 'nodePortDelete'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_new_project_envs'), value: 'envAdd'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_update_project_env'), value: 'envUpdate'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_delete_project_envs'), value: 'envDelete'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_delete_project_envs_all'), value: 'envDeleteAll'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_delete_project'), value: 'projectDelete'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_update_project'), value: 'projectUpdate'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_update_resource_quota'), value: 'envQuotaConfigUpdate'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_assign_pv'), value: 'envPvcAdd'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_assign_storage_class_pv'), value: 'envPvcScAdd'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_remove_pv'), value: 'envPvcDelete'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_new_user'), value: 'userAdd'},
                {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_other'), value: 'other'},
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_type')"
              dense
              small-chips
              multiple
              clearable
              v-model="appliesForm.kinds"
              @change="$observables.queryPage$.next('')"
            ></v-autocomplete>
            <v-autocomplete
              :items="(() => {
                return [
                  {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_reviewing'), value: 'reviewing'},
                  {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_returning'), value: 'returning'},
                  {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_processing'), value: 'processing'},
                  {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_closing'), value: 'closing'},
                  {text: $vuetify.lang.t('$vuetify.lang_form_search_apply_closed'), value: 'closed'},
                ]
              })()"
              :label="$vuetify.lang.t('$vuetify.lang_form_status')"
              dense
              small-chips
              multiple
              clearable
              v-model="appliesForm.statuses"
              @change="$observables.queryPage$.next('')"
            ></v-autocomplete>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_ticket')"
              dense
              v-model="appliesForm.applyTicket"
              @keyup.enter="$observables.queryPage$.next('')"
            >
            </v-text-field>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_username')"
              dense
              v-model="appliesForm.username"
              @keyup.enter="$observables.queryPage$.next('')"
            >
            </v-text-field>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_user_name')"
              dense
              v-model="appliesForm.name"
              @keyup.enter="$observables.queryPage$.next('')"
            >
            </v-text-field>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_title')"
              dense
              v-model="appliesForm.title"
              @keyup.enter="$observables.queryPage$.next('')"
            >
            </v-text-field>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_content')"
              dense
              v-model="appliesForm.content"
              @keyup.enter="$observables.queryPage$.next('')"
            >
            </v-text-field>
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
                    v-model="createDateRangeText"
                    :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_create_time')"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    class="mr-8"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="createDates"
                  range
                  no-title
                  @change="createDateRangeSubmit()"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    small
                    @click="clearCreateDates()"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_form_clear')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
            <template>
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="updateDateRangeText"
                    :label="$vuetify.lang.t('$vuetify.lang_form_update_time')"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    class="mr-8"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="updateDates"
                  range
                  no-title
                  @change="updateDateRangeSubmit()"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    small
                    @click="updateClearCreateDates()"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_form_clear')}}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
            <v-autocomplete
              :items="[
                { value: 0, text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                { value: 1, text: $vuetify.lang.t('$vuetify.lang_form_sort_update_time_desc') },
                { value: 2, text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
                { value: 3, text: $vuetify.lang.t('$vuetify.lang_form_sort_update_time_asc') },
                { value: 4, text: $vuetify.lang.t('$vuetify.lang_form_sort_apply_ticket_asc') },
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
              class="mr-8"
              clearable
              dense
              v-model="appliesForm.sortMode"
              @change="$observables.queryPage$.next('')"
            ></v-autocomplete>
          </search-form>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="desserts"
            :server-items-length="total"
            class="elevation-1"
            dense
            item-key="applyTicket"
            show-expand
            :options="{
              page: appliesForm.page,
              itemsPerPage: appliesForm.perPage
            }"
            :footer-props="{
              showCurrentPage: true,
              itemsPerPageOptions: [ 5, 10, 15, 20 ]
            }"
            @update:options="(value) => {
              $observables.pageOptionsChange$.next(value)
            }"
            :loading="pageLoading"
          >
            <template v-slot:item.applyTicket="{ item }">
              <span>{{item.applyTicket}}</span>
            </template>
            <template v-slot:item.handle="{ item }">
              <Operations
                :operations="[
                  {
                    key: 'return',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_return'),
                    onClick: () => {
                      $observables.returnModifyClick$.next(item)
                    }
                  },
                  {
                    key: 'accept',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_accept'),
                    onClick: () => {
                      $observables.acceptClick$.next(item)
                    }
                  },
                  {
                    key: 'modify',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_modify'),
                    onClick: () => {
                      $observables.modifyClick$.next(item)
                    }
                  },
                  {
                    key: 'close',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_close'),
                    onClick: () => {
                      $observables.closeClick$.next(item)
                    }
                  },
                  {
                    key: 'comment',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_comment'),
                    onClick: () => {
                      $observables.commentClick$.next(item)
                    }
                  },
                  {
                    key: 'reply',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_reply'),
                    onClick: () => {
                      $observables.replyClick$.next(item)
                    }
                  },
                  {
                    key: 'apply',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_apply'),
                    onClick: () => {
                      $observables.applyClick$.next(item)
                    }
                  },
                  {
                    key: 'execute',
                    text: $vuetify.lang.t('$vuetify.lang_menu_apply_execute'),
                    color: '#F44336',
                    onClick: () => {
                      $observables.executeClick$.next(item)
                    }
                  },
                ].filter(row => {
                  if(item.showExecute) {
                    return [...item.opTypes, 'execute'].includes(row.key)
                  } else {
                    return item.opTypes.includes(row.key)
                  }
                })"
              ></Operations>
            </template>
            <template v-slot:item.kind="{ item }">
              <div>{{cnKind[item.kind]}}</div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip small :color="rtnStatusChipColor(item)" :dark="!!rtnStatusChipColor(item)">{{status[item.status]}}</v-chip>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-1">
                <div style="display: flex">
                  <v-card class="rounded-0" style="flex: 1 1 0; width: 0%">
                    <v-card-text class="py-0">
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left" v-if="item.projectName && item.projectName !== ''">
                              projectName
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_apply_log_content')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_attachments')}}
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td class="text-wrap" v-if="item.projectName && item.projectName !== ''">{{ item.projectName }}</td>
                            <td class="text-wrap">{{ item.content }}</td>
                            <td>
                              <v-chip class="mr-2" v-for="(attachment, i) in (item.attachments || [])" :key="i" @click="$observables.attachmentDownloadClick$.next(attachment)">
                                {{ attachment.fileName }}
                              </v-chip>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                    <v-card-text class="py-0" style="overflow-x: auto; max-width: 100%" v-if="rtnApplyParams(item).length > 0">
                      <div style="display: flex">
                        <InfoSingleTable
                          style="flex: 1 1 0; width: 0%"
                          :infos="rtnApplyParams(item)"
                        />
                      </div>
                    </v-card-text>
                    <v-card-title class="pa-1 pl-4 subtitle-1">
                      {{$vuetify.lang.t('$vuetify.lang_view_apply_logs')}}
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="subHeaders"
                        :items="item.applyLogs"
                        disable-pagination
                        class="elevation-1"
                        dense
                        item-key="createTime"
                        show-expand
                        hide-default-footer
                      >
                        <template v-slot:item.username="{ item }">
                          <span class="mr-1">{{ item.username }}</span>
                          <span>({{ item.name }})</span>
                        </template>
                        <template v-slot:item.opType="{ item }">
                          <div>{{cnOpType[item.opType]}}</div>
                        </template>
                        <template v-slot:item.attachments="{ item }">
                          <v-chip class="mr-2" v-for="(attachment, i) in (item.attachments || [])" :key="i" @click="$observables.attachmentDownloadClick$.next(attachment)">
                            {{ attachment.fileName }}
                          </v-chip>
                        </template>
                        <template v-slot:item.data-table-expand="config">
                          <v-icon
                            v-if="config.item.param && Object.keys(config.item.param).length > 0"
                            :class="['v-data-table__expand-icon', {
                                'v-data-table__expand-icon--active': config.isExpanded
                              }]"
                            @click="(e) => {
                              e.stopPropagation()
                              config.expand(!config.isExpanded)
                            }"
                          >
                            $expand
                          </v-icon>
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                          <EmbedTd :colspan="headers.length" class="pa-1">
                            <v-card class="rounded-0">
                              <v-card-title class="text-body-1">
                                {{$vuetify.lang.t('$vuetify.lang_view_apply_log_params')}}
                              </v-card-title>
                              <v-card-text>
                                <InfoSingleTable
                                  :infos="Object.entries(item.param || {}).map(([key, value]) => {
                                    const showValue = typeof value === 'string' ? value : JSON.stringify(value)
                                    return {key, value: showValue, name: key}
                                  })"
                                />
                              </v-card-text>
                            </v-card>
                          </EmbedTd>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </div>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </PageCard>
    <v-dialog
      v-model="operationDialog"
      max-width="600px"
    >
      <OperationCard
        v-bind="operationCardConfig.attrs"
        v-on="Object.entries(operationCardConfig.listeners).reduce((acc, [key, value]) => {
          if(value) {
            acc[key] = value
          }
          return acc
        }, {})"
      />
    </v-dialog>
    <v-dialog
      v-model="logDialog"
      max-width="960px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}</span>
        </v-card-title>
        <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
            <pre
              v-for="(logMsg, i) in logCardConfig.attrs.logList"
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
            @click="(logCardConfig.listeners.confirm || (() => {}))"
          >
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import OperationCard from '@/lib/ui-lib/components/OperationCard'
import request, { rtnRetryWhenOperator } from '@/utils/request'
import { defer, forkJoin, of, race, Subject } from 'rxjs'
import { catchError, mergeMap, filter, tap, map, pluck, withLatestFrom, switchMap, finalize, takeUntil, take, scan, skip } from 'rxjs/operators'
import { pick, cloneDeep } from 'lodash/fp'
import Vue from 'vue'
import APPLIES_API from '@/api/admin/applies'
import CONSOLE_APPLIES_API from '@/api/console/applies'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import { webSocket } from 'rxjs/webSocket'
import User from '@/services/user'
import ATTACHMENT_API from '@/api/admin/attachment'
import CONSOLE_ATTACHMENT_API from '@/api/console/attachment'
import SearchForm from '@/lib/ui-lib/components/SearchForm'
import {vuetify} from '@/plugins/vuetify'

export default {
  name: 'Applies',
  components: {
    SearchForm,
    InfoSingleTable,
    PageCard,
    Operations,
    EmbedTd: {
      functional: true,
      render (createElement, context) {
        return createElement('td', context.data, context.children)
      }
    },
    OperationCard
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  props: {
    inMenu: {
      type: String,
      required: false,
      default: 'admin'
    }
  },
  subscriptions () {
    return {
      queryPage$: new Subject(),
      returnModifyClick$: new Subject(),
      acceptClick$: new Subject(),
      modifyClick$: new Subject(),
      closeClick$: new Subject(),
      commentClick$: new Subject(),
      replyClick$: new Subject(),
      applyClick$: new Subject(),
      executeClick$: new Subject(),
      attachmentDownloadClick$: new Subject(),
      queryProjectNames$: new Subject(),
      pageOptionsChange$: new Subject()
    }
  },
  data () {
    return {
      disabledDefNames: [],
      projectItems: [],
      projectForm: '',
      appliesForm: {
        mode: 0,
        projectNames: [],
        kinds: [],
        statuses: [],
        applyTicket: '',
        username: '',
        name: '',
        title: '',
        content: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        updateTimeRange: {
          startDate: '',
          endDate: ''
        },
        sortMode: null,
        page: 1,
        perPage: 10
      },
      operationDialog: false,
      operationCardConfig: {
        attrs: {},
        listeners: {
          confirm: null,
          cancel: null
        }
      },
      logDialog: false,
      logCardConfig: {
        attrs: {
          logList: []
        },
        listeners: {
          confirm: null
        }
      },
      pageLoading: false,
      desserts: [],
      total: 0,
      attachments: [],
      status: {
        reviewing: vuetify.preset.lang.t('$vuetify.lang_view_apply_reviewing'),
        returning: vuetify.preset.lang.t('$vuetify.lang_view_apply_returning'),
        processing: vuetify.preset.lang.t('$vuetify.lang_view_apply_processing'),
        closing: vuetify.preset.lang.t('$vuetify.lang_view_apply_closing'),
        closed: vuetify.preset.lang.t('$vuetify.lang_view_apply_closed'),
      },
      cnKind: {
        nodePortAdd: vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_node_ports'),
        nodePortDelete: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_node_ports'),
        envAdd: vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_project_envs'),
        envDelete: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs'),
        envDeleteAll: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project_envs_all'),
        envUpdate: vuetify.preset.lang.t('$vuetify.lang_menu_apply_update_project_env'),
        projectDelete: vuetify.preset.lang.t('$vuetify.lang_menu_apply_delete_project'),
        projectUpdate: vuetify.preset.lang.t('$vuetify.lang_menu_apply_update_project'),
        envQuotaConfigUpdate: vuetify.preset.lang.t('$vuetify.lang_menu_apply_update_resource_quota'),
        envPvcAdd: vuetify.preset.lang.t('$vuetify.lang_menu_apply_assign_pv'),
        envPvcScAdd: vuetify.preset.lang.t('$vuetify.lang_menu_apply_assign_storage_class_pv'),
        envPvcDelete: vuetify.preset.lang.t('$vuetify.lang_menu_apply_remove_pv'),
        userAdd: vuetify.preset.lang.t('$vuetify.lang_menu_apply_new_user'),
        other: vuetify.preset.lang.t('$vuetify.lang_menu_apply_other'),
      },
      menu1: false,
      menu2: false,
      createDates: [],
      updateDates: [],
      mode: 0,
    }
  },
  created () {
    const vm = this
    vm.getDisabledDefNames()
    function clearOperationForm () {
      vm.operationCardConfig.attrs.confirmLoading = false
      vm.operationCardConfig.attrs.title = ''
      vm.operationCardConfig.attrs.formRef = null
      vm.operationCardConfig.attrs.formInfo = ''
      vm.operationCardConfig.attrs.formEls = []
      vm.operationCardConfig.attrs.msg = null
      vm.operationCardConfig.listeners.cancel = null
      vm.operationCardConfig.listeners.confirm = null
    }
    function rtnOperationCardConfig (opType, kind, opParam) {
      const reactiveOpParam = Vue.observable(cloneDeep(opParam))
      const reactiveCommonParam = Vue.observable({
        content: '',
        projectAttachment: [],
        attachmentIDs: []
      })
      let formEls = []
      const commonEls = [
        <VTextField
          label={vuetify.preset.lang.t('$vuetify.lang_form_apply_log_content')}
          required
          dense
          value={reactiveCommonParam.content}
          vOn:input={(value) => { reactiveCommonParam.content = value }}
          rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
        />,
        <v-file-input
          label={vuetify.preset.lang.t('$vuetify.lang_form_apply_attachments')}
          required
          dense
          multiple
          small-chips
          show-size
          value={reactiveCommonParam.projectAttachment}
          vOn:change={(value) => { reactiveCommonParam.projectAttachment = value }}
        />
      ]
      let msg = null
      if (
        [
          // 'accept',
          'close',
          'comment',
          'apply'
        ].includes(opType) ||
        [
          'nodePortDelete',
          'envAdd',
          'envDelete',
          'envDeleteAll',
          'envPvcAdd',
          'envPvcScAdd',
          'envPvcDelete',
          'other'
        ].includes(kind)
      ) {
        msg = null
      } else if (kind === 'nodePortAdd') {
        formEls = [
          <VTextField
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_port')}
            required
            dense
            value={reactiveOpParam.nodePort}
            vOn:input={(value) => { reactiveOpParam.nodePort = Number(value) }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_node_port_tip_1')}
            persistent-hint
          />,
        ]
      } else if (kind === 'projectDelete') {
        formEls = [
          <VAutocomplete
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_type')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.gitRepoDelete}
            vOn:input={(value) => { reactiveOpParam.gitRepoDelete = value }}
          />,
          <VAutocomplete
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_scan_code_repo_delete')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.scanCodeRepoDelete}
            vOn:input={(value) => { reactiveOpParam.scanCodeRepoDelete = value }}
          />,
          <VAutocomplete
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_image_repo_delete')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.imageRepoDelete}
            vOn:input={(value) => { reactiveOpParam.imageRepoDelete = value }}
          />,
          <VAutocomplete
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_artifact_repo_delete')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.artifactRepoDelete}
            vOn:input={(value) => { reactiveOpParam.artifactRepoDelete = value }}
          />,
          <VAutocomplete
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_project_namespace_delete')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.namespaceDelete}
            vOn:input={(value) => { reactiveOpParam.namespaceDelete = value }}
          />,
        ]
      } else if (kind === 'projectUpdate') {
        formEls = [
          <VTextField
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc')}
            required
            dense
            value={reactiveOpParam.projectDesc}
            vOn:input={(value) => { reactiveOpParam.projectDesc = value }}
            rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_desc_tip_1')}
            persistent-hint
          />,
          <VTextField
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team')}
            required
            dense
            value={reactiveOpParam.projectTeam}
            vOn:input={(value) => { reactiveOpParam.projectTeam = value }}
            rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_project_team_tip_1')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoUser !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user')}
            dense
            value={reactiveOpParam.gitRepoUser}
            vOn:input={(value) => { reactiveOpParam.gitRepoUser = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_user_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoToken !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token')}
            dense
            value={reactiveOpParam.gitRepoToken}
            vOn:input={(value) => { reactiveOpParam.gitRepoToken = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_token_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
            type={"password"}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoPassword !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password')}
            dense
            value={reactiveOpParam.gitRepoPassword}
            vOn:input={(value) => { reactiveOpParam.gitRepoPassword = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_password_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
            type={"password"}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.buildSettingsDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_build_settings_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.buildSettingsDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.buildSettingsDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.databaseScriptsDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_database_scripts_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.databaseScriptsDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.databaseScriptsDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.demoCodesDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_demo_codes_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.demoCodesDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.demoCodesDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.deployScriptsDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_deploy_scripts_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.deployScriptsDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.deployScriptsDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.documentsDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_documents_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.documentsDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.documentsDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.gitRepoDir.testScriptsDir !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_git_repo_dir_test_scripts_dir')}
            dense
            value={reactiveOpParam.gitRepoDir.testScriptsDir}
            vOn:input={(value) => { reactiveOpParam.gitRepoDir.testScriptsDir = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
          />,
          <VTextField
            v-show={reactiveOpParam.imageRepoHostName !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name')}
            dense
            value={reactiveOpParam.imageRepoHostName}
            vOn:input={(value) => { reactiveOpParam.imageRepoHostName = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_host_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.imageRepoGroupName !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name')}
            dense
            value={reactiveOpParam.imageRepoGroupName}
            vOn:input={(value) => { reactiveOpParam.imageRepoGroupName = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_group_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.imageRepoUserName !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name')}
            dense
            value={reactiveOpParam.imageRepoUserName}
            vOn:input={(value) => { reactiveOpParam.imageRepoUserName = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_user_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.imageRepoPassword !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password')}
            dense
            value={reactiveOpParam.imageRepoPassword}
            vOn:input={(value) => { reactiveOpParam.imageRepoPassword = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_image_repo_password_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
            type={"password"}
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoHostName !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name')}
            dense
            value={reactiveOpParam.artifactRepoHostName}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHostName = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoPort !== 0}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_port')}
            dense
            value={reactiveOpParam.artifactRepoPort}
            vOn:input={(value) => { reactiveOpParam.artifactRepoPort = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
            type={"number"}
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoPath !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path')}
            dense
            value={reactiveOpParam.artifactRepoPath}
            vOn:input={(value) => { reactiveOpParam.artifactRepoPath = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_path_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoUserName !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_user_name')}
            dense
            value={reactiveOpParam.artifactRepoUserName}
            vOn:input={(value) => { reactiveOpParam.artifactRepoUserName = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoPassword !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_password')}
            dense
            value={reactiveOpParam.artifactRepoPassword}
            vOn:input={(value) => { reactiveOpParam.artifactRepoPassword = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
            type={"password"}
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoHttpUpload.url !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_url')}
            dense
            value={reactiveOpParam.artifactRepoHttpUpload.url}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHttpUpload.url = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VAutocomplete
            v-show={reactiveOpParam.artifactRepoHttpUpload.url !== '' && reactiveOpParam.artifactRepoHttpUpload.method !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_method')}
            dense
            items={['PUT', 'POST']}
            value={reactiveOpParam.artifactRepoHttpUpload.method}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHttpUpload.method = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VAutocomplete
            v-show={reactiveOpParam.artifactRepoHttpUpload.url !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_insecure')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.artifactRepoHttpUpload.insecure}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHttpUpload.insecure = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VTextField
            v-show={reactiveOpParam.artifactRepoHttpDownload.url !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_url')}
            dense
            value={reactiveOpParam.artifactRepoHttpDownload.url}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHttpDownload.url = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
          <VAutocomplete
            v-show={reactiveOpParam.artifactRepoHttpDownload.url !== ''}
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_insecure')}
            dense
            items={[
              {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
              {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
            ]}
            value={reactiveOpParam.artifactRepoHttpDownload.insecure}
            vOn:input={(value) => { reactiveOpParam.artifactRepoHttpDownload.insecure = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_leave_it_empty')}
            persistent-hint
          />,
        ]
        reactiveOpParam.artifactRepoPort = Number(reactiveOpParam.artifactRepoPort)
      } else if (kind === 'envUpdate') {
        formEls = [
          <v-container>
            <v-row>
              <v-col cols="12">
                <div><span class="headline">{vuetify.preset.lang.t('$vuetify.lang_form_update_project_env', reactiveOpParam.envName)}</span></div>
                <div class="justify-space-between align-center mt-4">
                  <v-autocomplete
                    value={reactiveOpParam.privileged}
                    items={[
                      {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false},
                    ]}
                    vOn:input={(value) => { reactiveOpParam.privileged = value }}
                    label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_privileged')}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_privileged_tip_1')}
                    persistent-hint
                    dense
                  ></v-autocomplete>
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-autocomplete
                    value={reactiveOpParam.disabledDefs}
                    items={vm.disabledDefNames}
                    vOn:input={(value) => { reactiveOpParam.disabledDefs = value }}
                    label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_defs')}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_defs_tip_1')}
                    persistent-hint
                    dense
                    multiple
                    small-chips
                  ></v-autocomplete>
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-combobox
                    label={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_patches')}
                    dense
                    multiple
                    small-chips
                    hide-selected
                    value={reactiveOpParam.disabledPatches}
                    vOn:input={(value) => { reactiveOpParam.disabledPatches = value }}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_update_project_env_disabled_patches_tip_1')}
                    persistent-hint
                    append-icon=""
                  >
                  </v-combobox>
                </div>
              </v-col>
            </v-row>
          </v-container>,
        ]
      } else if (kind === 'envQuotaConfigUpdate') {
        formEls = [
          <v-container>
            <v-row>
              <v-col cols="6">
                <div class="justify-space-between align-center mt-4">
                  <div><strong>{vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota')}</strong></div>
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request')}
                    dense
                    value={reactiveOpParam.namespaceQuota.memoryRequest}
                    vOn:input={(value) => { reactiveOpParam.namespaceQuota.memoryRequest = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request')}
                    dense
                    value={reactiveOpParam.namespaceQuota.cpuRequest}
                    vOn:input={(value) => { reactiveOpParam.namespaceQuota.cpuRequest = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit')}
                    dense
                    value={reactiveOpParam.namespaceQuota.memoryLimit}
                    vOn:input={(value) => { reactiveOpParam.namespaceQuota.memoryLimit = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit')}
                    dense
                    value={reactiveOpParam.namespaceQuota.cpuLimit}
                    vOn:input={(value) => { reactiveOpParam.namespaceQuota.cpuLimit = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit')}
                    dense
                    type="number"
                    value={reactiveOpParam.namespaceQuota.podsLimit}
                    vOn:input={(value) => { reactiveOpParam.namespaceQuota.podsLimit = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit_tip_1')}
                    persistent-hint
                  />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="justify-space-between align-center mt-4">
                  <div><strong>{vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota')}</strong></div>
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')}
                    dense
                    value={reactiveOpParam.defaultQuota.memoryRequest}
                    vOn:input={(value) => { reactiveOpParam.defaultQuota.memoryRequest = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request')}
                    dense
                    value={reactiveOpParam.defaultQuota.cpuRequest}
                    vOn:input={(value) => { reactiveOpParam.defaultQuota.cpuRequest = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit')}
                    dense
                    value={reactiveOpParam.defaultQuota.memoryLimit}
                    vOn:input={(value) => { reactiveOpParam.defaultQuota.memoryLimit = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit_tip_1')}
                    persistent-hint
                  />
                </div>
                <div class="justify-space-between align-center mt-4">
                  <v-text-field
                    label={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit')}
                    dense
                    value={reactiveOpParam.defaultQuota.cpuLimit}
                    vOn:input={(value) => { reactiveOpParam.defaultQuota.cpuLimit = value }}
                    rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
                    hint={vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit_tip_1')}
                    persistent-hint
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <div class="justify-space-between align-center mt-4">
                  <strong>{vuetify.preset.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas')}</strong>
                </div>
                <div class="justify-space-between align-center mt-4">
                  { JSON.stringify(reactiveOpParam.namespaceQuota.extraQuotas) }
                </div>
              </v-col>
              <v-col cols="6">
                <div class="justify-space-between align-center mt-4">
                  <strong>{vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}</strong>
                </div>
                <div class="justify-space-between align-center mt-4">
                  { JSON.stringify(reactiveOpParam.defaultQuota.extraRequest) }
                </div>
                <div class="justify-space-between align-center mt-4">
                  <strong>{vuetify.preset.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}</strong>
                </div>
                <div class="justify-space-between align-center mt-4">
                  { JSON.stringify(reactiveOpParam.defaultQuota.extraLimit) }
                </div>
              </v-col>
            </v-row>
          </v-container>,
        ]
      } else if (kind === 'userAdd') {
        formEls = [
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_username')}
            required
            dense
            value={reactiveOpParam.username}
            vOn:input={(value) => { reactiveOpParam.username = value }}
            rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_username_tip_1')}
            persistent-hint
          />,
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_name')}
            required
            dense
            value={reactiveOpParam.name}
            vOn:input={(value) => { reactiveOpParam.name = value }}
            rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_name_tip_1')}
            persistent-hint
          />,
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mail')}
            required
            dense
            value={reactiveOpParam.mail}
            vOn:input={(value) => { reactiveOpParam.mail = value }}
            rules={[
              v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required'),
              v => /.+@.+\..+/.test(v) || vuetify.preset.lang.t('$vuetify.lang_tip_format_not_correct')
            ]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mail_tip_1')}
            persistent-hint
          />,
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mobile')}
            required
            dense
            value={reactiveOpParam.mobile}
            vOn:input={(value) => { reactiveOpParam.mobile = value }}
            rules={[v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required')]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_new_user_mobile_tip_1')}
            persistent-hint
          />,
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_tenant_code')}
            required
            dense
            value={reactiveOpParam.tenantCode}
            vOn:input={(value) => { reactiveOpParam.tenantCode = value }}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_tenant_code_tip_1')}
            persistent-hint
          />,
        ]
      }
      return {
        formEls: formEls,
        opParam: reactiveOpParam,
        commonEls,
        commonParam: reactiveCommonParam,
        msg
      }
    }
    function rtnRxOperators (item, opType) {
      const opTypeMap = {
        return: vuetify.preset.lang.t('$vuetify.lang_menu_apply_return'),
        accept: vuetify.preset.lang.t('$vuetify.lang_menu_apply_accept'),
        modify: vuetify.preset.lang.t('$vuetify.lang_menu_apply_modify'),
        close: vuetify.preset.lang.t('$vuetify.lang_menu_apply_close'),
        comment: vuetify.preset.lang.t('$vuetify.lang_menu_apply_comment'),
        reply: vuetify.preset.lang.t('$vuetify.lang_menu_apply_reply'),
        execute: vuetify.preset.lang.t('$vuetify.lang_menu_apply_execute')
      }
      return [
        map(next => {
          return [next, new Subject(), rtnOperationCardConfig(opType, next.kind, next.opParam)]
        }),
        tap(next => {
          const operationConfig = next[2]
          vm.operationCardConfig.attrs.confirmLoading = false
          vm.operationCardConfig.attrs.title = opTypeMap[opType]
          vm.operationCardConfig.attrs.formRef = opType + 'Form'
          vm.operationCardConfig.attrs.formInfo = vuetify.preset.lang.t('$vuetify.lang_form_required_tip')
          if (opType !== 'execute') {
            vm.operationCardConfig.attrs.formEls = operationConfig.formEls.concat(operationConfig.commonEls)
          } else {
            vm.operationCardConfig.attrs.formEls = [
              <v-text-field
                label={vuetify.preset.lang.t('$vuetify.lang_view_apply_ticket')}
                dense
                value={next[0].applyTicket}
                persistent-hint
                disabled
              />
            ].concat(operationConfig.formEls)
          }
          vm.operationCardConfig.attrs.msg = operationConfig.msg
          vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
          vm.operationCardConfig.listeners.confirm = () => { next[1].next(true) }
          vm.operationDialog = true
        }),
        mergeMap(next => {
          var formRef = vm.operationCardConfig.attrs.formRef
          return race([
            next[1].pipe(
              map(confirm => {
                switch(formRef){
                  case 'returnForm':
                    return vm.$refs.returnForm.validate()
                    break
                  case 'acceptForm':
                    return vm.$refs.acceptForm.validate()
                    break
                  case 'modifyForm':
                    return vm.$refs.modifyForm.validate()
                    break
                  case 'closeForm':
                    return vm.$refs.closeForm.validate()
                    break
                  case 'commentForm':
                    return vm.$refs.commentForm.validate()
                    break
                  case 'replyForm':
                    return vm.$refs.replyForm.validate()
                    break
                  case 'executeForm':
                    return vm.$refs.executeForm.validate()
                    break
                  default:
                    return confirm
                }
              })
            ),
            vm.$watchAsObservable('operationDialog').pipe(
              pluck('newValue'),
              filter(next => !next)
            )
          ]).pipe(
            withLatestFrom(of(next[0]), of(next[2]))
          )
        }),
        filter(next => next[0]),
        tap(next => {
          vm.operationCardConfig.listeners.cancel = null
          vm.operationCardConfig.attrs.confirmLoading = true
        }),
        mergeMap(next => {
          const attachmentIdsObservable = (() => {
            if (next[2].commonParam.projectAttachment && next[2].commonParam.projectAttachment.length > 0) {
              return defer(() => {
                if (vm.inMenu === 'admin') {
                  return ATTACHMENT_API.uploadAttachments(next[2].commonParam.projectAttachment)
                } else {
                  return CONSOLE_ATTACHMENT_API.uploadAttachments(next[2].commonParam.projectAttachment)
                }
              }).pipe(
                rtnRetryWhenOperator(),
                tap(next => {
                  vm.successTip(true, next.msg)
                }),
                catchError(error => {
                  console.log(error)
                  vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
                  vm.operationCardConfig.attrs.confirmLoading = false
                  vm.errorTip(true, error.response.data.msg)
                  return of(null)
                }),
                pluck('data', 'attachmentIDs')
              )
            } else {
              return of([])
            }
          })()
          return forkJoin([...(next).map(row => of(row)), attachmentIdsObservable])
        }),
        filter(next => next[3]),
        mergeMap(next => {
          // const envConfig = next[2]
          // const envConfig = next[1]
          // const params = pick(['attachmentIDs', 'content'], next[1])
          const params = {}
          if (opType !== 'execute') {
            params.opType = opType
            params.param = next[2].opParam
            params.content = next[2].commonParam.content
            // params.attachmentIDs = next[2].commonParam.attachmentIDs
            params.attachmentIDs = next[3]
          } else {
            params.applyTicket = next[1].applyTicket
            Object.entries(next[2].opParam).forEach(([key, value]) => {
              params[key] = value
            })
          }
          let promise = null
          if (opType !== 'execute') {
            promise = vm.inMenu === 'admin' ? APPLIES_API.applyOperate(next[1].applyTicket, params) : CONSOLE_APPLIES_API.applyOperate(next[1].applyTicket, params)
          } else {
            const projectName = next[1].projectName && next[1].projectName !== '' ? next[1].projectName : '-'
            promise = vm.inMenu === 'admin' ? APPLIES_API.executeApply(next[1].applyTicket, projectName, params) : CONSOLE_APPLIES_API.executeApply(next[1].applyTicket, projectName, params)
          }
          return defer(() => {
            return promise
          }).pipe(
            rtnRetryWhenOperator(),
            catchError(next => {
              vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
              vm.operationCardConfig.attrs.confirmLoading = false
              vm.errorTip(true, next.response.data.msg)
              return of(null)
            })
          )
        }),
        filter(next => next),
        tap(next => {
          vm.operationDialog = false
          vm.operationCardConfig.attrs.confirmLoading = false
          vm.successTip(true, next.msg)
          if (!next.data.withAdminLog) {
            vm.$observables.queryPage$.next('operationComplete')
          }
        }),
        filter(next => next.data.withAdminLog),
        tap(next => {
          vm.logDialog = true
          vm.logCardConfig.listeners.confirm = () => { vm.logDialog = false }
        }),
        switchMap(next => {
          return webSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/${vm.inMenu}/${next.data.auditID}?x-user-token=${User.getInstance().state.userObj.userToken}`).pipe(
            catchError(error => {
              console.log(error)
              return of(null)
            }),
            finalize(() => {
              console.log('final')
            }),
            filter(next => next),
            takeUntil(vm.$watchAsObservable('logDialog').pipe(
              pluck('newValue'),
              filter(next => next === false),
              take(1)
            )),
            scan((acc, next) => {
              acc.push(next)
              return acc
            }, []),
            tap(next => {
              vm.logCardConfig.attrs.logList = next
            })
          )
        }),
        switchMap(next => {
          return vm.$watchAsObservable('logDialog').pipe(
            pluck('newValue'),
            filter(next => next === false),
            take(1)
          )
        }),
        tap(next => {
          vm.logCardConfig.attrs.logList = []
          vm.$observables.queryPage$.next('logDialogClose')
        })
      ]
    }
    vm.$observables.queryProjectNames$.pipe(
      mergeMap(next => {
        return defer(() => {
          if (vm.inMenu === 'admin') {
            return APPLIES_API.getProjectNames()
          } else {
            return CONSOLE_APPLIES_API.getProjectNames()
          }
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(err => {
            console.log(err)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.projectItems = next.data.projectNames
      })
    ).subscribe(() => {})
    vm.$watchAsObservable('operationDialog').pipe(
      pluck('newValue'),
      filter(next => !next),
      tap(next => {
        clearOperationForm()
      })
    ).subscribe(() => {})
    vm.$observables.queryPage$.pipe(
      tap(next => {
        vm.pageLoading = true
      }),
      mergeMap(next => {
        const dates = [...vm.createDates].sort()
        const dates2 = [...vm.updateDates].sort()
        vm.appliesForm.createTimeRange.startDate = dates[0]
        vm.appliesForm.createTimeRange.endDate = dates[1]
        vm.appliesForm.updateTimeRange.startDate = dates2[0]
        vm.appliesForm.updateTimeRange.endDate = dates2[1]
        return defer(() => {
          if (vm.inMenu === 'console') {
            return CONSOLE_APPLIES_API.getApplies(vm.appliesForm)
          } else {
            return request.post('/admin/applies', vm.appliesForm)
          }
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.pageLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.desserts = next.data.applies
        vm.total = next.data.totalCount
        vm.pageLoading = false
      }),
      withLatestFrom(vm.$observables.queryPage$),
      tap(next => {
        if (next[1] !== 'init') {
          vm.successTip(true, next[0].msg)
        }
      })
    ).subscribe(() => {})
    vm.$observables.pageOptionsChange$.pipe(
      tap(value => {
        vm.appliesForm.page = value.page
        vm.appliesForm.perPage = value.itemsPerPage
      }),
      skip(1),
      tap(next => {
        vm.$observables.queryPage$.next('pageOptionsChange')
      })
    ).subscribe(() => {})
    vm.$observables.returnModifyClick$.pipe(
      ...rtnRxOperators(null, 'return')
    ).subscribe(next => {})
    vm.$observables.acceptClick$.pipe(
      ...rtnRxOperators(null, 'accept')
    ).subscribe(next => {})
    vm.$observables.modifyClick$.pipe(
      ...rtnRxOperators(null, 'modify')
    ).subscribe(next => {})
    vm.$observables.closeClick$.pipe(
      ...rtnRxOperators(null, 'close')
    ).subscribe(next => {})
    vm.$observables.commentClick$.pipe(
      ...rtnRxOperators(null, 'comment')
    ).subscribe(next => {})
    vm.$observables.replyClick$.pipe(
      ...rtnRxOperators(null, 'reply')
    ).subscribe(next => {})
    vm.$observables.applyClick$.pipe(
      ...rtnRxOperators(null, 'apply')
    ).subscribe(next => {})
    vm.$observables.executeClick$.pipe(
      ...rtnRxOperators(null, 'execute')
    ).subscribe(next => {})
    vm.$observables.attachmentDownloadClick$.pipe(
      mergeMap(next => {
        return forkJoin([
          of(next),
          defer(() => {
            if (vm.inMenu === 'admin') {
              return APPLIES_API.downloadAttachment(next.attachmentID)
            } else {
              return CONSOLE_APPLIES_API.downloadAttachment(next.attachmentID)
            }
          }).pipe(
            rtnRetryWhenOperator(),
            catchError(err => {
              console.log(err)
              vm.errorTip(true, err.response.data.msg)
              return of(null)
            })
          )
        ])
      }),
      filter(next => next[1]),
      tap(next => {
        var blob = next[1]
        var a = document.createElement('a')
        var url = window.URL.createObjectURL(blob)
        var filename = next[0].fileName
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    ).subscribe(next => {})
    vm.$observables.queryPage$.next('init')
    vm.$observables.queryProjectNames$.next('init')
  },
  methods: {
    getDisabledDefNames () {
      const vm = this
      request.get(`/public/about`).then(response => {
        vm.disabledDefNames = response.data.config.disabledDefNames
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    tabChange (data) {
      const vm = this
      vm.appliesForm.mode = data
      vm.$observables.queryPage$.next('tabChange')
    },
    createDateRangeSubmit () {
      this.menu2 = false
      this.$observables.queryPage$.next('searchForm')
    },
    updateDateRangeSubmit () {
      this.menu1 = false
      this.$observables.queryPage$.next('searchForm')
    },
    clearCreateDates () {
      this.createDates = []
      this.menu1 = false
      this.$observables.queryPage$.next('searchForm')
    },
    updateClearCreateDates () {
      this.updateDates = []
      this.menu2 = false
      this.$observables.queryPage$.next('searchForm')
    },
    rtnApplyParams (item) {
      // const projectParamsArr = item.projectName && item.projectName !== '' ? [['projectName', item.projectName]] : []
      // return projectParamsArr.concat(Object.entries(item.opParam)).map(([key, value]) => {
      return Object.entries(item.opParam).map(([key, value]) => {
        const showValue = (() => {
          if (typeof value === 'string') {
            return value
          } else {
            return JSON.stringify(value)
          }
        })()
        return { key, value: showValue, name: key }
      })
    },
    rtnStatusChipColor (item) {
      if (item.todo) {
        return 'red'
      } else if (['closed'].includes(item.status)) {
        return null
      } else {
        return 'light-blue'
      }
    },
  },
  filters: {
    changeColor: function (value) {
      if (value === 'FAIL') {
        return { color: 'red' }
      } else if (value === 'INFO') {
        return { color: 'green' }
      } else {
        return null
      }
    }
  },
  computed: {
    cnOpType () {
      return {
        return: vuetify.preset.lang.t('$vuetify.lang_menu_apply_return'),
        accept: vuetify.preset.lang.t('$vuetify.lang_menu_apply_accept'),
        modify: vuetify.preset.lang.t('$vuetify.lang_menu_apply_modify'),
        close: vuetify.preset.lang.t('$vuetify.lang_menu_apply_close'),
        comment: vuetify.preset.lang.t('$vuetify.lang_menu_apply_comment'),
        reply: vuetify.preset.lang.t('$vuetify.lang_menu_apply_reply'),
        execute: vuetify.preset.lang.t('$vuetify.lang_menu_apply_execute'),
        apply: vuetify.preset.lang.t('$vuetify.lang_menu_apply_apply'),
      }
    },
    headers () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_ticket'), value: 'applyTicket', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_title'), value: 'title', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_user'), value: 'username', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_type'), value: 'kind', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_time'), value: 'createTime', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_update_time'), value: 'updateTime', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_status'), value: 'status', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false }
      ]
    },
    subHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_reply_user'), value: 'username', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_log_type'), value: 'opType', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_log_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_log_content'), value: 'content', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_attachments'), value: 'attachments', sortable: false }
      ]
    },
    createDateRangeText () {
      return this.createDates.join(' ~ ')
    },
    updateDateRangeText () {
      return this.updateDates.join(' ~ ')
    }
  }
}
</script>

<style lang="scss" scoped>
.limit-config tr{
  td {
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
  }
  th {
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
  }
}
</style>
