<script>
import { cloneDeep, get, mergeAll } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Monaco from "@/lib/monaco/Monaco"
export default {
  name: 'SystemConfigDataTable',
  components: { 
    DataTable, 
    Monaco, 
  },
  functional: true,
  props: ['appConfigs'],
  render (createElement, context) {
    const headers = [
      { text: '', value: 'appConfig', sortable: false },
    ]
    const data = cloneDeep(context.data)
    const appConfigs = (context.props.appConfigs || []).map((row, index) => {
      return mergeAll([row, { index }])
    })
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || appConfigs)
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'index')
    set(data, ['scopedSlots', 'item.appConfig'], context.scopedSlots['item.appConfig'] || ((config) => {
      const monacoOptions = {
        value: config.item.appConfig,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml",
        wordWrap: "on",
      }
      return <Monaco
        ref="monaco"
        monacoOptions={monacoOptions}
        style="height: 70vh; overflow: hidden;"
      ></Monaco>
    }))
    return <DataTable
      {...data}
      hide-default-header
      hide-default-footer
    >
      { context.children }
    </DataTable>
  }
}

</script>

<style scoped>

</style>
