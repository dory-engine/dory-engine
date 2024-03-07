<script>
import { omit, mergeAll, omitBy } from 'lodash/fp'
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'Operations',
  functional: true,
  render (createElement, context) {
    if (context.props.operations && context.props.operations.length === 1) {
      const data = mergeAll({}, {
        on: {
          click: context.props.operations[0].onClick || (() => {})
        },
        props: {
          color: 'primary',
          small: true
        }
      }, omitBy((value) => {
        return value === undefined
      }, context.data))
      return createElement('VBtn', data, context.children || [context.props.operations[0].text])
    } else if (context.props.operations && context.props.operations.length > 1) {
      const data = mergeAll({
        props: {
          openOnHover: true
        },
        scopedSlots: {
          activator ({ on, attrs }) {
            return createElement('VBtn', { on, attrs })
          }
        }
      }, context.data)
      const firstOpt = context.props.operations[0]
      const otherOpts = context.props.operations.slice(1)
      return <VMenu
        open-on-hover={context.props.triggerType === 'afterArrow'}
        offset-y={true}
        left={true}
        scopedSlots={{
          activator ({ on, attrs }) {
            if (context.props.triggerType === 'afterArrow') {
              return <v-btn
                color={context.props.color || 'primary'}
                small
                class="my-1"
                vOn:click={() => {
                  (firstOpt.onClick || (() => {
                  }))()
                }}
                vOn:mouseleave={on.mouseleave}
              >
                {firstOpt.text}
                <v-icon
                  right={true}
                  dark={true}
                  {...{ on: omit('mouseleave', on), attrs }}
                >
                  mdi-menu-down
                </v-icon>
              </v-btn>
            } else {
              return <v-btn
                color={context.props.color || 'primary'}
                small
                class="my-1"
                {...{ on, attrs }}
              >
                {context.props.optButtonText || vuetify.preset.lang.t('$vuetify.lang_menu_select_options')}
              </v-btn>
            }
          }
        }}
      >
        <v-list>
          { (context.props.triggerType === 'afterArrow' ? otherOpts : context.props.operations).map(row => {
            return <v-list-item dense vOn:click={() => { (row.onClick || (() => {}))() }}>
              <v-list-item-title style={{
                color: row.color
              }}>{row.text}</v-list-item-title>
            </v-list-item>
          }) }
        </v-list>
      </VMenu>
    } else {
      return null
    }
  }
}
</script>

<style scoped>

</style>
