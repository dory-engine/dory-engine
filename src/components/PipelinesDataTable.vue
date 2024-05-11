<script>
import { set } from 'lodash'
import { get, cloneDeep } from 'lodash/fp'
import { DateTime } from 'luxon'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'PipelinesDataTable',
  components: { Operations },
  functional: true,
  props: ['projectName', 'pipelines', 'opsBatchDefs', 'goRun', 'openPipelineDef', 'goProjectDef'],
  render (createElement, context) {
    const data = cloneDeep(context.data)
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || [
      { value: 'pipelineName', text: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name'), sortable: true },
      { value: 'branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: true },
      { value: 'envs', text: vuetify.preset.lang.t('$vuetify.lang_view_ci_envs'), sortable: false },
      { value: 'envProductions', text: vuetify.preset.lang.t('$vuetify.lang_view_production_envs'), sortable: false },
      { value: 'count', text: vuetify.preset.lang.t('$vuetify.lang_view_success_fail_abort_count'), sortable: false },
      { value: 'lastRunTime', text: vuetify.preset.lang.t('$vuetify.lang_view_latest_run_time'), sortable: false },
      { value: 'lastRunResult', text: vuetify.preset.lang.t('$vuetify.lang_view_latest_run_result'), sortable: false },
      { value: 'operation', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false }
    ])
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || context.props.pipelines || [])
    set(data, ['scopedSlots', 'item.pipelineName'], context.scopedSlots['item.pipelineName'] || ((config) => {
      return <router-link to={{name: 'CicdPipeline', params: { pipelineName: config.item.pipelineName }}}>{ config.item.pipelineName }</router-link>
    }))
    set(data, ['scopedSlots', 'item.envs'], context.scopedSlots['item.envs'] || ((config) => {
      return config.item.envs.map(row => {
        return <div class="my-1"><VChip color="primary" small>{ row }</VChip></div>
      })
    }))
    set(data, ['scopedSlots', 'item.envProductions'], context.scopedSlots['item.envProductions'] || ((config) => {
      return config.item.envProductions.map(row => {
        return <div class="my-1"><VChip color="primary" small>{ row }</VChip></div>
      })
    }))
    set(data, ['scopedSlots', 'item.count'], context.scopedSlots['item.count'] || ((config) => {
      return [
        <span class="green--text">{ config.item.successCount }</span>,
        '/',
        <span class="red--text">{ config.item.failCount }</span>,
        '/',
        <span class="grey--text">{ config.item.abortCount }</span>
      ]
    }))
    set(data, ['scopedSlots', 'item.lastRunTime'], context.scopedSlots['item.lastRunTime'] || ((config) => {
      const dataTime = DateTime.fromISO(config.item.status.startTime)
      return dataTime.isValid ? DateTime.fromISO(config.item.status.startTime).toFormat('yyyy-MM-dd HH:mm:ss') : config.item.status.startTime
    }))
    set(data, ['scopedSlots', 'item.lastRunResult'], context.scopedSlots['item.lastRunResult'] || ((config) => {
      let chipColor = ''
      switch (config.item.status.result) {
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
        <div>{ config.item.status.duration }</div>,
        <VChip vShow={config.item.status.result} small class="mb-1 white--text" color={ chipColor }>
          { config.item.status.result }
        </VChip>
      ]
    }))
    set(data, ['scopedSlots', 'item.operation'], context.scopedSlots['item.operation'] || ((config) => {
      var opts = []
      context.props.opsBatchDefs.forEach((row, i) => {
        opts.push(
          {
            text: row.opsBatchDesc,
            onClick: () => {
              request.post(`/cicd/batch/${context.props.projectName}/${row.opsBatchName}`).then(response => {
                context.props.goRun(response.data.runName)
              }).catch(_ => {})
            }
          }
        )
      })
      return <div>
        <span class="mr-2" vShow={config.item.branchName === ''}>
          <Operations
            color={'green'}
            dark={true}
            operations={opts}
            optButtonText={vuetify.preset.lang.t('$vuetify.lang_menu_execute_batch')}
          >
          </Operations>
        </span>
        <VBtn color={config.item.errMsgPipelineDef === '' ? 'primary' : 'error'} small class="my-1 mr-2" vShow={config.item.branchName} vOn:click_stop={() => {
          context.props.openPipelineDef(context.props.projectName, config.item.branchName)
        }}>{vuetify.preset.lang.t('$vuetify.lang_menu_pipeline_def')}</VBtn>
        <VBtn color="primary" small class="my-1" vOn:click={() => {
          request.post(`/cicd/pipeline/${config.item.pipelineName}`).then(response => {
            context.props.goRun(response.data.runName)
          }).catch(error => {context.injections.errorTip(true,error.response.data.msg)})
        }}>{vuetify.preset.lang.t('$vuetify.lang_menu_execute')}</VBtn>
      </div>
    }))
    const children = context.children
    return createElement(DataTable, data, children)
  }
}
</script>

<style scoped>

</style>
