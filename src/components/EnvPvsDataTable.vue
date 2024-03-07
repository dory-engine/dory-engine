<script>
import { cloneDeep, get } from 'lodash/fp'
import { set } from 'lodash'
import Operations from '@/lib/ui-lib/components/Operations'
import Monaco from "@/lib/monaco/Monaco"
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'EnvPvsDataTable',
  components: { Operations, Monaco },
  functional: true,
  props: ['pvs', 'envItem'],
  // listeners: modifyPv, deletePv
  render (createElement, context) {
    const headers = [
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_name'), value: 'pvName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_type'), value: 'pvType', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_yaml'), value: 'pvYaml', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_bind_project'), value: 'claimRef.namespace', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_bind_status'), value: 'status.phase', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_pv_pvc_name'), value: 'claimRef.name', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'operation', sortable: false }
    ]
    const data = cloneDeep(context.data)
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || context.props.pvs || [])
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'pvName')
    // if (get(['attrs', 'showExpand'], data) === undefined) {
    //   set(data, ['attrs', 'showExpand'], true)
    // }
    set(data, ['scopedSlots', 'item.operation'], context.scopedSlots['item.operation'] || ((config) => {
      var ret = <div></div>
      if (config.item.pvcName === '' || config.item.status.phase === 'Released') {
        ret = <Operations
          operations={[
            {
              text: vuetify.preset.lang.t('$vuetify.lang_menu_delete_pv'),
              onClick: () => {
                (context.listeners.deletePv || (() => {}))(config.item)
              }
            }
          ]}
        />
      }
      return ret
    }))
    set(data, ['scopedSlots', 'item.pvYaml'], context.scopedSlots['item.pvYaml'] || ((config) => {
      let codeValue = config.item.pvYaml
      let dialog = ''
      if(codeValue){
        return <v-dialog
        width="800"
        vModel={dialog}
        eager
        scopedSlots={{
          activator: ({on, attrs}) => {
            return <v-btn
            small
            color="primary"
            {...{
              props: attrs,
              on
            }}>
            {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
            </v-btn>
          }
        }}
        >
          <v-card>
            <v-card-title class="headline">
              {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
            </v-card-title>

            <v-card-text>
              <Monaco
                ref="monaco3"
                monacoOptions={{
                  value: config.item.pvYaml,
                  automaticLayout:true,
                  readOnly: true,
                  theme: "vs-dark",
                  language: "yaml"
                }}
                height={500}
              ></Monaco>
            </v-card-text>
          </v-card>
        </v-dialog>
      }else{
        return <div></div>
      }
    }))
    return <v-data-table
      {...data}
    >
    </v-data-table>
  }
}
</script>

<style scoped>

</style>
