<script>
import { get, cloneDeep, isArray, camelCase } from 'lodash/fp'
import { set } from 'lodash'
export default {
  name: 'DataTable',
  functional: true,
  render (createElement, context) {
    const data = cloneDeep(context.data)
    data.attrs = Object.entries(data.attrs).reduce((acc, [key, value]) => {
      acc[camelCase(key)] = value
      return acc
    }, {})
    const tableClass = get('class', data)
    if (!tableClass) {
      set(data, 'class', ['dory-data-table'])
    } else if (isArray(tableClass)) {
      tableClass.push('dory-data-table')
    } else {
      set(data, 'class', ['dory-data-table', tableClass])
    }
    if (!get(['attrs', 'footerProps', 'itemsPerPageOptions'], data)) {
      set(data, ['attrs', 'footerProps', 'itemsPerPageOptions'], [5, 10, 15, 20])
    }
    Object.entries(context.slots()).forEach(([key, value]) => {
      if (!get(['scopedSlots', key], data)) {
        set(data, ['scopedSlots', key], () => {
          return value
        })
      }
    })
    return createElement('v-data-table', data, [])
  }
}
</script>
