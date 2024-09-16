
<script>
import { cloneDeep, get, mergeAll } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'WebhooksDataTable',
  components: { 
    DataTable, 
    Monaco, 
  },
  functional: true,
  props: ['webhookLogs', 'runLog'],
  render (createElement, context) {
    const headers = [
      { text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), value: 'stepInfo.runName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_trigger_before_execute'), value: 'stepInfo.beforeExecute', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_step_action'), value: 'stepInfo.stepAction', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_module_type'), value: 'stepInfo.moduleType', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_status'), value: 'stepInfo.result', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_return_status_code'), value: 'response.statusCode', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_status'), value: 'result', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_trigger_time'), value: 'createTime', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
    ]
    const data = cloneDeep(context.data)
    const webhookLogs = (context.props.webhookLogs || []).map((row, index) => {
      return mergeAll([row, { index }])
    })
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || webhookLogs)
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'index')
    if (get(['attrs', 'showExpand'], data) === undefined) {
      set(data, ['attrs', 'showExpand'], true)
    }
    set(data, ['scopedSlots', 'item.stepInfo.runName'], context.scopedSlots['item.stepInfo.runName'] || ((config) => {
      return <router-link to={{name: 'CicdRun', params: { 'runName': config.item.stepInfo.runName }}}>
        { config.item.stepInfo.runName }
      </router-link>
    }))
    set(data, ['scopedSlots', 'item.stepInfo.stepAction'], context.scopedSlots['item.stepInfo.stepAction'] || ((config) => {
      return <div>
        <div>{ config.item.stepInfo.stepAction }</div>
        { config.item.stepInfo.architecture ? <div><v-chip small class="mr-2" color="primary">{config.item.stepInfo.architecture}</v-chip></div> : null}
      </div>
    }))
    set(data, ['scopedSlots', 'item.stepInfo.result'], context.scopedSlots['item.stepInfo.result'] || ((config) => {
      if (config.item.stepInfo.result === '') {
        return [
          <div>{ config.item.stepInfo.duration }</div>,
        ]
      } else {
        let chipColor = ''
        switch (config.item.stepInfo.result) {
          case 'FAIL':
            chipColor = 'red'
            break
          case 'RUNNING':
            chipColor = 'blue'
            break
          case 'SUCCESS':
            chipColor = 'green'
            break
          case 'ABORT':
            chipColor = 'grey'
            break
          case 'INPUT':
            chipColor = 'orange'
            break
          case 'PAUSE':
            chipColor = 'blue-grey'
            break
        }
        return [
          <div>{ config.item.stepInfo.duration }</div>,
          <v-chip small class="mb-1 white--text" color={chipColor}>
            { config.item.stepInfo.result }
          </v-chip>
        ]
      }
    }))
    set(data, ['scopedSlots', 'item.result'], context.scopedSlots['item.result'] || ((config) => {
      let chipColor = ''
      switch (config.item.result) {
        case 'FAIL':
          chipColor = 'red'
          break
        case 'RUNNING':
          chipColor = 'blue'
          break
        case 'SUCCESS':
          chipColor = 'green'
          break
        case 'ABORT':
          chipColor = 'grey'
          break
        case 'INPUT':
          chipColor = 'orange'
          break
        case 'PAUSE':
          chipColor = 'blue-grey'
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
      item.response.headers.forEach(header => {
        headers.push(header.name + ": " + header.value)
      })
      var headersContent = headers.join("\n")
      item.responseHeadersEditor = {
        value: headersContent,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml",
        wordWrap: "on",
      }
      var stepDetailYaml = YAML.stringify(item.stepInfo.stepDetail, 4)
      item.responseYamlEditor = {
        value: stepDetailYaml,
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
      var responseYamlEditor = <v-expansion-panel>
        <v-expansion-panel-header><strong>{vuetify.preset.lang.t('$vuetify.lang_view_webhook_request_step_detail')}</strong></v-expansion-panel-header>
        <v-expansion-panel-content>
          <Monaco
            ref="monaco"
            monacoOptions={item.responseYamlEditor}
            style="height: 50vh; overflow: hidden;"
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
      if (item.response.headers.length > 0) {
        expansionPanels.push(responseHeadersEditor)
      }
      if (item.responseYamlEditor.value !== "{}") {
        expansionPanels.push(responseYamlEditor)
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
            {vuetify.preset.lang.t('$vuetify.lang_view_step_detail')}
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_branch_name')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_env')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_step_desc')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_return_message')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <router-link to={{name: 'CicdPipeline', params: { 'pipelineName': item.stepInfo.pipelineName }}}>
                      { item.stepInfo.pipelineName }
                    </router-link>
                  </td>
                  <td>{ item.stepInfo.branchName }</td>
                  <td>{ item.stepInfo.envName }</td>
                  <td>{ item.stepInfo.stepName }</td>
                  <td>{ item.stepInfo.msg }</td>
                </tr>
              </tbody>
            </v-simple-table>
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
    set(data, ['scopedSlots', 'item.handle'], context.scopedSlots['item.handle'] || ((config) => {
      return <div>
        <v-btn small class="my-1" color="primary" vOn:click={() => {
          context.props.runLog(config.item.stepInfo.runName, config.item.stepInfo.stepID)
        }}>{vuetify.preset.lang.t('$vuetify.lang_menu_view_logs')}</v-btn>
      </div>
    }))
    return <DataTable {...data} >
      { context.children }
    </DataTable>
  }
}
</script>

<style scoped>

</style>
