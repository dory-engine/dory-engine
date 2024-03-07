
<script>
import { cloneDeep, get, mergeAll } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'AdminWebhookLogs',
  components: { 
    DataTable,
    InfoSingleTable,
    Monaco, 
  },
  functional: true,
  props: ['adminWebhookLogs'],
  render (createElement, context) {
    const headers = [
      { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_admin_action'), value: 'adminAction', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_webhook_url'), value: 'request.url', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_webhook_method'), value: 'request.method', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_return_status_code'), value: 'response.statusCode', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_status'), value: 'result', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_trigger_time'), value: 'createTime', sortable: false },
    ]
    const data = cloneDeep(context.data)
    const adminWebhookLogs = (context.props.adminWebhookLogs || []).map((row, index) => {
      return mergeAll([row, { index }])
    })
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || adminWebhookLogs)
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'index')
    if (get(['attrs', 'showExpand'], data) === undefined) {
      set(data, ['attrs', 'showExpand'], true)
    }
    set(data, ['scopedSlots', 'item.result'], context.scopedSlots['item.result'] || ((config) => {
      let chipColor = ''
      switch (config.item.result) {
        case 'FAIL':
          chipColor = 'red'
          break
        case 'SUCCESS':
          chipColor = 'green'
          break
      }
      return [
        <div>{ config.item.response.duration }</div>,
        <v-chip small class="mb-1 white--text" color={chipColor}>
          { config.item.result }
        </v-chip>
      ]
    }))
    set(data, ['scopedSlots', 'expanded-item'], context.scopedSlots['expanded-item'] || ((config) => {
      const item = config.item
      item.requestCurlEditor = {
        value: item.request.curl,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "shell",
        wordWrap: "on",
      }
      item.responseDataEditor = {
        value: item.response.body,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: item.response.kind,
        wordWrap: "on",
      }
      var headers = []
      if (item.response.headers !== null) {
        item.response.headers.forEach(header => {
          headers.push(header.name + ": " + header.value)
        })
      }
      var headersContent = headers.join("\n")
      item.responseHeadersEditor = {
        value: headersContent,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml",
        wordWrap: "on",
      }
      var requestCurlEditor = <v-expansion-panel>
        <v-expansion-panel-header><strong>{vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_curl')}</strong></v-expansion-panel-header>
        <v-expansion-panel-content>
          <Monaco
            ref="monaco"
            monacoOptions={item.requestCurlEditor}
            style="height: 30vh; overflow: hidden;"
          ></Monaco>
        </v-expansion-panel-content>
      </v-expansion-panel>
      var responseDataEditor = <v-expansion-panel>
        <v-expansion-panel-header><strong>{vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_response_body')}</strong></v-expansion-panel-header>
        <v-expansion-panel-content>
          <Monaco
            ref="monaco"
            monacoOptions={item.responseDataEditor}
            style="height: 40vh; overflow: hidden;"
          ></Monaco>
        </v-expansion-panel-content>
      </v-expansion-panel>
      var responseHeadersEditor = <v-expansion-panel>
        <v-expansion-panel-header><strong>{vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_response_headers')}</strong></v-expansion-panel-header>
        <v-expansion-panel-content>
          <Monaco
            ref="monaco"
            monacoOptions={item.responseHeadersEditor}
            style="height: 30vh; overflow: hidden;"
          ></Monaco>
        </v-expansion-panel-content>
      </v-expansion-panel>
      var expansionPanels = []
      if (item.request.curl !== "") {
        expansionPanels.push(requestCurlEditor)
      }
      if (item.response.body !== "") {
        expansionPanels.push(responseDataEditor)
      }
      if (item.response.headers !== null) { 
        if (item.response.headers.length > 0) {
          expansionPanels.push(responseHeadersEditor)
        }
      }
      var errMsg = []
      if (item.errMsg !== "") {
        errMsg = [
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_exception')}
          </v-card-title>,
          <v-card-text>
            <v-chip color="red" text-color="white">{ item.errMsg }</v-chip>
          </v-card-text>
        ]
      }
      return <td colspan={config.headers.length} class="pa-1">
        <v-card class="rounded-0">
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_vars')}
          </v-card-title>
          <v-card-text>
            <InfoSingleTable
              infos={
                Object.entries(item.adminWebhookVars).map(([key, value]) => {
                  const showValue = (() => {
                    if (typeof value === 'string') {
                      return value
                    } else {
                      return JSON.stringify(value)
                    }
                  })()
                  return { name: key, value: showValue }
                })
              }
            />
          </v-card-text>
          { errMsg }
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_detail')}
          </v-card-title>
          <v-card-text>
            <v-expansion-panels accordion>
              { expansionPanels }
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </td>
    }))
    return <DataTable {...data} >
      { context.children }
    </DataTable>
  }
}
</script>

<style scoped>

</style>
