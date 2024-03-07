<script>
export default {
  name: 'InfoTab',
  functional: true,
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    tabValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    tabs: {
      type: Array,
      required: false,
      default () {
        /* {
        * key: string,
        * name: string || function
        * content: string || function
        * } */
        return []
      }
    }
  },
  render (createElement, context) {
    const updateTabValue = context.listeners['update:tabValue'] || (() => {})
    // vOn:change={(value) => { updateTabValue(context.props.tabs[value].key) }}
    const cardClass = context.data.class || context.data.staticClass
    return <VCard class={cardClass || 'elevation-8 rounded-0'}>
      {/* <VCardTitle class="text-center justify-center py-6"> */}
      <VCardTitle class="text-center justify-center py-6">
        {/* <h6 class="font-weight-bold display-3 basil--text"> */}
        <h4>
          { context.props.title }
        </h4>
      </VCardTitle>
      <VTabs
        grow
        value={ context.props.tabValue }
        vOn:change={(value) => { updateTabValue(value) }}
      >
        { context.props.tabs.map(row => <VTab
          key={ row.key }
        >
          { row.name }
        </VTab>) }
      </VTabs>

      <VTabsItems
        value={ context.props.tabValue }
      >
        { context.props.tabs.map(row => <VTabItem
          key={ row.key }
        >
          { typeof row.content === 'function' ? row.content(createElement) : row.content }
        </VTabItem>) }
      </VTabsItems>
    </VCard>
  }
}
</script>

<style scoped>

</style>
