<script>
export default {
  name: 'InfoSingleTable',
  functional: true,
  props: {
    infos: {
      type: Array,
      required: false,
      default () {
        /* {
        * key: string || number,
        * name: string,
        * value: string, number, object, function
        * } */
        return []
      }
    }
  },
  render (createElement, context) {
    const VNode = createElement('span').constructor
    const rtnNode = <VSimpleTable {...context.data}>
      <thead>
        <tr>
          { context.props.infos.map(info => {
            return <th class="text-left">{ info.name }</th>
          }) }
        </tr>
      </thead>
      <tbody>
        <tr
        >
          { context.props.infos.map(info => {
            const value = (() => {
              if (!info.value || info.value === '') {
                return null
              } else if (typeof info.value === 'function') {
                return info.value(createElement)
              } else if (typeof info.value === 'object' && !(info.value instanceof VNode)) {
                return createElement(info.tag, info.data, info.children)
              } else if (typeof info.value === 'string' && context.scopedSlots[info.value]) {
                return context.scopedSlots[info.value]()
              } else {
                return info.value
              }
            })()
            return <td style="word-break:break-all;">{ value }</td>
          }) }
        </tr>
      </tbody>
    </VSimpleTable>
    return rtnNode
  }
}
</script>

<style scoped>

</style>
