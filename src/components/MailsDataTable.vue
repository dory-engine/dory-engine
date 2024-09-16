
<script>
import { cloneDeep, get, mergeAll } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'MailsDataTable',
  components: { 
    DataTable, 
    Monaco, 
  },
  functional: true,
  props: ['mailLogs', 'console'],
  render (createElement, context) {
    const headers = [
      { text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), value: 'stepInfo.runName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_step_action'), value: 'stepInfo.stepAction', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_module_type'), value: 'stepInfo.moduleType', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_status'), value: 'stepInfo.result', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_receivers'), value: 'mail.receiverMail', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_mail_status'), value: 'result', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_trigger_time'), value: 'createTime', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
    ]
    const data = cloneDeep(context.data)
    const mailLogs = (context.props.mailLogs || []).map((row, index) => {
      return mergeAll([row, { index }])
    })
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || mailLogs)
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
        <div>{ config.item.mail.duration }</div>,
        <v-chip small class="mb-1 white--text" color={chipColor}>
          { config.item.result }
        </v-chip>
      ]
    }))
    set(data, ['scopedSlots', 'expanded-item'], context.scopedSlots['expanded-item'] || ((config) => {
      const item = config.item
      var logFileLink = <span></span>
      var varFileLink = <span></span>
      if (item.mail.logFile) {
        logFileLink = <a href={item.mail.logFile} target="_Blank">{item.mail.logFile}</a>
      }
      if (item.mail.varFile) {
        varFileLink = <a href={item.mail.varFile} target="_Blank">{item.mail.varFile}</a>
      }
      var v = `
${item.mail.title}

------------------------

${item.mail.content}`
      item.mailContentEditor = {
        value: v,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "plaintext",
        wordWrap: "on",
      }
      var errMsg = <span></span>
      if (item.errMsg !== "") {
        errMsg = <v-chip color="red" text-color="white">{ item.errMsg }</v-chip>
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
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_mail_exception')}
          </v-card-title>
          <v-card-text>
            { errMsg }
          </v-card-text>
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_mail_detail')}
          </v-card-title>
          <v-card-text>
            <Monaco
              ref="monaco"
              monacoOptions={item.mailContentEditor}
              style="height: 50vh; overflow: hidden;"
            ></Monaco>
          </v-card-text>
          <v-card-title>
            {vuetify.preset.lang.t('$vuetify.lang_view_mail_attachments')}
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_mail_run_log_attachments')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_mail_pipeline_variables_attachments')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ logFileLink }</td>
                  <td>{ varFileLink }</td>
                </tr>
              </tbody>

            </v-simple-table>
          </v-card-text>
        </v-card>
      </td>
    }))
    set(data, ['scopedSlots', 'item.handle'], context.scopedSlots['item.handle'] || ((config) => {
      return <div>
        <v-btn small class="my-1" color="primary" vOn:click={() => {
          context.props.console(config.item.stepInfo.runName, config.item.stepInfo.stepID)
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
