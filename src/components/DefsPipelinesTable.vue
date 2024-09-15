<script>
import { set } from 'lodash'
import { get, cloneDeep } from 'lodash/fp'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'DefsPipelinesTable',
  components: { Operations },
  functional: true,
  props: ['projectName', 'pipelines', 'opsBatchDefs', 'goRun', 'openPipelineDef'],
  render (createElement, context) {
    const data = cloneDeep(context.data)
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || [
      { value: 'pipelineName', text: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name'), sortable: true },
      { value: 'branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
      { value: 'pipelineArch', text: vuetify.preset.lang.t('$vuetify.lang_view_architecture'), sortable: false },
      { value: 'envs', text: vuetify.preset.lang.t('$vuetify.lang_view_ci_envs'), sortable: false },
      { value: 'envProductions', text: vuetify.preset.lang.t('$vuetify.lang_view_production_envs'), sortable: false },
      { value: 'operation', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false }
    ])
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || context.props.pipelines || [])
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'branchName')
    set(data, ['scopedSlots', 'item.pipelineName'], context.scopedSlots['item.pipelineName'] || ((config) => {
      return <router-link to={{name: 'CicdPipeline', params: { pipelineName: config.item.pipelineName }}}>{ config.item.pipelineName }</router-link>
    }))
    set(data, ['scopedSlots', 'item.pipelineArch'], context.scopedSlots['item.pipelineArch'] || ((config) => {
      if (config.item.pipelineDef.pipelineArch) {
        return <v-chip small class="mr-2" color="primary">{config.item.pipelineDef.pipelineArch}</v-chip>
      } else {
        return null
      }
    }))
    set(data, ['scopedSlots', 'item.envs'], context.scopedSlots['item.envs'] || ((config) => {
      return config.item.envs.map(row => {
        return <v-chip small class="mr-2" color="primary">{row}</v-chip> 
      })
    }))
    set(data, ['scopedSlots', 'item.envProductions'], context.scopedSlots['item.envProductions'] || ((config) => {
      return config.item.envProductions.map(row => {
        return <v-chip small class="mr-2" color="primary">{row}</v-chip> 
      })
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
              }).catch(error => {context.injections.errorTip(true,error.response.data.msg)})
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
.flex-nowrap .row {
  flex-wrap: nowrap !important;
}
</style>
