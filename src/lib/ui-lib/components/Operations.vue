<script>
import { mergeAll, omitBy } from 'lodash/fp'
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'Operations',
  functional: true,
  render (createElement, context) {
    if (context.props.operations && context.props.operations.length > 0) {
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
      return <VMenu
        open-on-hover={true}
        offset-y={true}
        left={true}        
        scopedSlots={{
          activator ({ on, attrs }) {
            return <v-btn
              color={context.props.color || 'primary'}
              small
              dark={context.props.dark}
              class="my-1"
              {...{ on, attrs }}
            >
              {(context.props.optButtonIcon) ? <v-icon dark={true}>{context.props.optButtonIcon}</v-icon> : null}              
              {context.props.optButtonText || vuetify.preset.lang.t('$vuetify.lang_menu_select_options')}
              <v-icon
                right={true}
                dark={true}
              >
                mdi-menu-down
              </v-icon>
            </v-btn>
          }
        }}
      >
        <v-list>
          { context.props.operations.map(row => {
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
