
<script>
export default {
  name: 'InfoCard',
  functional: true,
  props: {
    title: {
      type: [String, Function, Object, Array],
      required: false,
      default: null
    },
    content: {
      type: [String, Function, Object, Array],
      required: false,
      default () {
        return ''
      }
    }
  },
  render (createElement, context) {
    const VNode = <span />.constructor
    const cardClass = context.data.class || context.data.staticClass
    const defaultSlot = context.scopedSlots.default
    const title = (() => {
      const titleProp = context.props.title
      if (!titleProp || titleProp === '') {
        return null
      } else if (typeof titleProp === 'object' && !(titleProp instanceof VNode)) {
        return createElement(titleProp.tag, titleProp.data, titleProp.children)
      } else if (typeof titleProp === 'string' && context.scopedSlots[titleProp]) {
        return <VCardTitle class="py-2">
          <h5>
            { context.scopedSlots[titleProp]() }
          </h5>
        </VCardTitle>
      } else {
        return <VCardTitle class="py-2">
          <h5>
            { titleProp }
          </h5>
        </VCardTitle>
      }
    })()
    const content = (() => {
      if (defaultSlot) {
        return defaultSlot()
      } else {
        return (typeof context.props.content === 'function' ? context.props.content(createElement) : context.props.content)
      }
    })()
    return <v-card class={cardClass || 'elevation-8 rounded-0 no-shadow'} {...context.data}>
      { title }
      <VCardText>
        { content }
      </VCardText>
    </v-card>
  }
}
</script>

<style scoped>

</style>
