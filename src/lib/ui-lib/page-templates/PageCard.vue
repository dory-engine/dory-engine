<script>
/*
* props: {
*   name: string
* }
* */
import { mergeAll } from 'lodash/fp'
export default {
  name: 'PageCard',
  functional: true,
  render (createElement, context) {
    const data = mergeAll({}, {
      props: {
        flat: true
      }
    }, context.data)
    const children = [
      context.props.name && context.props.name !== '' ? <v-card-title>{context.props.name}</v-card-title> : null
    ].concat(context.children)
    return createElement('v-card', data, children)
  }
}
</script>

<style scoped>

</style>
