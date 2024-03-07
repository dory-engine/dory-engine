<script>
export default {
  name: 'ChipPairs',
  functional: true,
  props: {
    pairs: {
      type: Array,
      required: false,
      default () {
        /* {
        * key: string || number,
        * name: string,
        * value: string, number
        * } */
        return []
      }
    }
  },
  render (createElement, context) {
    return <div class="d-flex">
      { context.props.pairs.map(pair => {
        return <div>
          <VChip
            class="ma-2"
            color="primary"
            text-color="white"
            { ...{ key: pair.key }}
          >
            { pair.name }
          </VChip>
          <span>{ (!pair.value || pair.value === '') ? null : pair.value }</span>
        </div>
      }) }
    </div>
  }
}
</script>

<style scoped>

</style>
