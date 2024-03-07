<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_audit_logs_management')">
    <v-card>
      <v-card-title>
        <v-form style="width: 100%">
          <v-container class="d-flex flex-wrap" fluid>
            <v-row>
              <v-col cols="3">
                <v-autocomplete
                  :items="typesResponse.data.opTypes"
                  :label="$vuetify.lang.t('$vuetify.lang_form_audit_logs_type')"
                  dense
                  small-chips
                  multiple
                  clearable
                  v-model="pageRequest.opTypes"
                  @change="$observables.queryPage$.next('opTypesChange')"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-select
                  :items="projectNamesResponse.data.projectNames"
                  :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
                  dense
                  small-chips
                  multiple
                  clearable
                  v-model="pageRequest.projectNames"
                  @change="$observables.queryPage$.next('projectNamesChange')"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="[ 'SUCCESS', 'FAIL' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_status')"
                  dense
                  small-chips
                  multiple
                  clearable
                  v-model="pageRequest.statusResults"
                  @change="$observables.queryPage$.next('statusResultsChange')"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="[ 'yes', 'no' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_with_admin_log')"
                  dense
                  clearable
                  v-model="pageRequest.withAdminLog"
                  @change="$observables.queryPage$.next('withAdminLogChange')"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="[ 'yes', 'no' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_with_apply_ticket')"
                  dense
                  clearable
                  v-model="pageRequest.withApplyTicket"
                  @change="$observables.queryPage$.next('withApplyTicketChange')"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_search_apply_ticket')"
                  dense
                  v-model="pageRequest.applyTicket"
                  @keyup.enter="$observables.queryPage$.next('applyTicketChange')"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_operate_username')"
                  dense
                  v-model="pageRequest.username"
                  @keyup.enter="$observables.queryPage$.next('userNameChange')"
                />
              </v-col>
              <v-col cols="3">
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
                        :label="$vuetify.lang.t('$vuetify.lang_form_operate_time')"
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
                      @change="() => {
                        menu2 = false
                        $observables.queryPage$.next('submitDateChange')
                      }"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        small
                        @click="clearDates()"
                      >
                        {{$vuetify.lang.t('$vuetify.lang_form_clear')}}
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="pageResponse.data.auditLogs"
          :server-items-length="pageResponse.data.totalCount"
          class="elevation-1"
          dense
          item-key="auditLogID"
          show-expand
          :options="{
            page: pageRequest.page,
            itemsPerPage: pageRequest.perPage
          }"
          :loading="pageLoading"
          @update:options="(value) => {
            $observables.pageOptionChange$.next(value)
          }"
        >
          <template v-slot:item.params="{ item }">
            <template v-if="rtnParamsMaxLength(item.params) < 50">
              <div class="my-1" v-for="(entry, i) in Object.entries(item.params)" :key="i">
                {{ entry[0] }}: {{ entry[1] }}
              </div>
            </template>
            <v-btn v-else color="primary" small @click="() => {
              paramsDetailObj = item.params
              paramsDetailDialog = true
            }">
              {{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}
            </v-btn>
          </template>
          <template v-slot:item.duration="{ item }">
            <div class="my-1">{{ item.duration }}</div>
            <v-chip v-if="item.status == 'FAIL'" small class="mb-1 white--text" color="red">
              {{ item.status }}
            </v-chip>
            <v-chip v-else-if="item.status == 'SUCCESS'" small class="mb-1 white--text" color="green">
              {{ item.status }}
            </v-chip>
            <v-chip v-else-if="item.status == 'INPUT'" small class="mb-1 white--text" color="orange">
              {{ item.status }}
            </v-chip>
            <v-chip v-else-if="item.status == 'RUNNING'" small class="mb-1 white--text" color="blue">
              {{ item.status }}
            </v-chip>
            <v-chip v-else-if="item.status == 'ABORT'" small class="mb-1 white--text" color="grey">
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:expanded-item="{ item, headers }">
            <td :colspan="headers.length + 1" class="pa-1">
              <v-card class="rounded-0">
                <v-card-text v-if="rtnParamsInfos(item.params).length > 0">
                  <div>{{$vuetify.lang.t('$vuetify.lang_view_audit_logs_params')}}</div>
                  <info-single-table
                    :infos="rtnParamsInfos(item.params)"
                  />
                </v-card-text>
                <v-card-text>
                  <div>{{$vuetify.lang.t('$vuetify.lang_view_detail')}}</div>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            {{$vuetify.lang.t('$vuetify.lang_view_audit_logs_response')}}
                          </th>
                          <th class="text-left">
                            {{$vuetify.lang.t('$vuetify.lang_view_audit_logs_execute_logs')}}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ item.msg }}</td>
                          <td>
                            <v-btn
                              v-if="item.withAdminLog"
                              class="my-1"
                              color="primary"
                              small
                              @click="() => {
                                $observables.viewDetailLogClick$.next(item.auditLogID)
                              }"
                            >
                              {{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="detailLogDialog"
      width="960"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}</span>
        </v-card-title>
        <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
            <pre
              v-for="(logMsg, i) in detailLogItems"
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
                detailLogDialog = false
              }"
          >
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="paramsDetailDialog"
      max-width="800px"
      persistent
      eager
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_view_detail')}}</span>
        </v-card-title>
        <v-card-text>
          <Monaco
            ref="monaco"
            :monacoOptions="singleMonacoOptions"
            :height="500"
          ></Monaco>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.paramsDetailDialog = false
              this.$refs.monaco.monacoEditor.setValue('')
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageCard>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import AUDIT_API from '@/api/admin/audit'
import YAML from "yamljs";
import { defer, forkJoin, of, Subject, combineLatest } from 'rxjs'
import { catchError, mergeMap, filter, skip, tap, switchMap, finalize, scan, pluck, map, delayWhen, withLatestFrom } from 'rxjs/operators'
import { rtnRetryWhenOperator } from '@/utils/request'
import { webSocket } from 'rxjs/webSocket'
import User from '@/services/user'
import InfoCard from '@/lib/ui-lib/components/InfoCard'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'AuditLogs',
  components: {
    InfoSingleTable,
    InfoCard,
    PageCard,
    Operations,
    Monaco,
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  subscriptions () {
    // const vm = this
    return {
      queryPage$: new Subject(),
      queryTypes$: new Subject(),
      pageOptionChange$: new Subject(),
      viewDetailLogClick$: new Subject(),
      queryProjectNames$: new Subject()
    }
  },
  data () {
    return {
      pageRequest: {
        username: '',
        projectNames: [],
        opTypes: [],
        withAdminLog: '',
        withApplyTicket: '',
        statusResults: [],
        startTimeRange: {
          startDate: '',
          endDate: ''
        },
        page: 1,
        perPage: 10
      },
      pageResponse: {
        data: {
          auditLogs: [],
          totalCount: 0
        }
      },
      pageLoading: false,
      typesResponse: {
        data: {
          opTypes: []
        }
      },
      projectNamesResponse: {
        data: {
          projectNames: []
        }
      },
      detailLogDialog: false,
      detailLogItems: [],
      dates: [],
      menu2: false,
      paramsDetailDialog: false,
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
    }
  },
  methods: {
    clearDates () {
      this.dates = []
      this.menu2 = false
      this.$observables.queryPage$.next('clearDates')
    },
    rtnParamsMaxLength (params) {
      return Object.entries(params).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc = Math.max(value.length, acc)
        } else {
          acc = Math.max(JSON.stringify(value).length, acc)
        }
        return acc
      }, 0)
    },
    rtnParamsInfos (params) {
      const vm = this
      return Object.entries(params).map(([key, value]) => {
        let valueStr = (typeof value === 'object' ? YAML.stringify(value, 4) : value.toString())
        if (valueStr === '{}' || valueStr === '[]' || valueStr === 'null') {
          valueStr = ''
        }
        let isButton = false
        if (typeof value === 'object' && valueStr !== '' ) {
          isButton = true
        }
        return {
          key,
          value: isButton ? <v-btn color="primary" small vOn:click={() => {
            console.log(value)
            vm.$refs.monaco.monacoEditor.setValue(valueStr)
            vm.paramsDetailDialog = true
          }}
          >
            {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
          </v-btn> : <div>{valueStr}</div>,
          name: key
        }
      })
    }
  },
  created () {
    const vm = this
    vm.$observables.queryProjectNames$.pipe(
      mergeMap(next => {
        return defer(() => {
          return AUDIT_API.getProjectNames()
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return null
          })
        )
      })
    ).subscribe(next => {
      vm.projectNamesResponse = next
    })
    vm.$observables.queryPage$.pipe(
      tap(next => {
        vm.pageLoading = true
      }),
      mergeMap(next => {
        const dates = [...vm.dates].sort()
        vm.pageRequest.startTimeRange.startDate = dates[0]
        vm.pageRequest.startTimeRange.endDate = dates[1]
        return defer(() => {
          return AUDIT_API.getAuditLogs(vm.pageRequest)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.pageLoading = false
            return null
          })
        )
      }),
      filter(next => next),
      withLatestFrom(of(vm.$observables.queryPage$))
    ).subscribe(([next, queryDate]) => {
      vm.pageLoading = false
      next.data.auditLogs.forEach((row, index) => {
        if (row.withAdminLog) {
          // console.log(row, index)
        }
      })
      vm.pageResponse = next
      if (queryDate !== 'init') {
        vm.successTip(true, next.msg)
      }
    })
    vm.$observables.queryTypes$.pipe(
      mergeMap(next => {
        return defer(() => {
          return AUDIT_API.getAuditLogTypes()
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return null
          })
        )
      }),
      filter(next => next)
    ).subscribe(next => {
      vm.typesResponse = next
    })
    vm.$observables.pageOptionChange$.pipe(
      skip(1)
    ).subscribe(next => {
      vm.pageRequest.perPage = next.itemsPerPage
      vm.pageRequest.page = next.page
      vm.$observables.queryPage$.next('optionChange')
    })
    vm.$observables.viewDetailLogClick$.pipe(
      tap(next => {
        vm.detailLogDialog = true
      }),
      switchMap(next => {
        return webSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${next}?x-user-token=${User.getInstance().state.userObj.userToken}`).pipe(
          catchError(error => {
            console.log(error)
            return of(null)
          }),
          finalize(() => {
            console.log('final')
          }),
          filter(next => next),
          scan((acc, next) => {
            acc.push(next)
            return acc
          }, []),
          tap(next => {
            vm.detailLogItems = next
          })
        )
      }),
      switchMap(next => {
        return vm.$watchAsObservable('detailLogDialog').pipe(
          pluck('newValue'),
          filter(next => next === false)
        )
      })
    ).subscribe(next => {
      console.log(next)
      vm.detailLogItems = []
    })
    vm.$observables.queryTypes$.next('init')
    vm.$observables.queryPage$.next('init')
    vm.$observables.queryProjectNames$.next('init')
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    headers () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_audit_logs_type'), value: 'opType', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_project_name'), value: 'projectName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_apply_ticket'), value: 'applyTicket', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operate_username'), value: 'username', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operate_time'), value: 'startTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_status'), value: 'duration', sortable: false }
      ]
    }
  },
  filters: {
    changeColor: function (value) {
      if (value == 'FAIL') {
        return { color: 'red' }
      } else if (value == 'INFO') {
        return { color: 'green' }
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
