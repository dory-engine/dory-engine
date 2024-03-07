<script>
import { set } from 'lodash'
import { get, cloneDeep } from 'lodash/fp'
import DataTable from '@/lib/ui-lib/components/DataTable'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'DefsPipelinesTable',
  functional: true,
  props: ['pipelines', 'goRun', 'openPipelineDef'],
  render (createElement, context) {
    const data = cloneDeep(context.data)
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || [
      { value: 'branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
      { value: 'envs', text: vuetify.preset.lang.t('$vuetify.lang_view_ci_envs'), sortable: false },
      { value: 'envProductions', text: vuetify.preset.lang.t('$vuetify.lang_view_production_envs'), sortable: false },
      { value: 'operation', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false }
    ])
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || context.props.pipelines || [])
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'branchName')
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
      return <div>
        <VBtn color={config.item.errMsgPipelineDef === '' ? 'primary' : 'error'} small class="my-1 mr-2" vOn:click_stop={() => {
          context.props.openPipelineDef('', config.item.branchName)
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
