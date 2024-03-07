<script>
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'OperationCard',
  functional: true,
  props: ['title', 'formEls', 'formRef', 'formInfo', 'confirmLoading', 'msg'],
  // listeners: ['cancel', 'confirm']
  render (createElement, context) {
    const VNode = <span />.constructor
    const cardTitle = context.props.title && context.props.title !== '' ? <v-card-title>
      <span class="headline">{context.props.title}</span>
    </v-card-title> : null
    const cols = (context.props.formEls || []).concat(context.children).map(el => {
      const formEl = (() => {
        if (!el || el === '') {
          return null
        } else if (typeof el === 'object' && !(el instanceof VNode)) {
          return createElement(el.tag, el.data, el.children)
        } else if (typeof el === 'string' && context.scopedSlots[el]) {
          return context.scopedSlots[el]()
        } else {
          return el
        }
      })()
      return formEl ? <v-col cols="12" class="pb-0">
        { formEl }
      </v-col> : null
    }).filter(row => row)
    return <v-card {...context.data}>
      <v-card-title>
        { cardTitle }
        <v-spacer></v-spacer>
        {
          context.listeners.top ? <div>
            {
              context.listeners.preview ? <v-tooltip
              bottom={true}
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-icon
                    color="primary"
                    {...{
                      props: attrs,
                      on
                    }}
                    vOn:click={ context.listeners.preview }
                  >mdi-cube-scan</v-icon>
                }
              }}
            >
              <span>{vuetify.preset.lang.t('$vuetify.lang_menu_def_view_yaml')}</span>
            </v-tooltip> : null
            }
            {
              context.listeners.update ? <v-tooltip
              bottom={true}
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-icon
                    color="green"
                    class="ml-4"
                    {...{
                      props: attrs,
                      on
                    }}
                    vOn:click={ context.listeners.update }
                  >mdi-progress-check</v-icon>
                }
              }}
            >
              <span>{vuetify.preset.lang.t('$vuetify.lang_menu_def_confirm_change')}</span>
            </v-tooltip> : null
            }
            {
              context.listeners.close ? <v-icon class="ml-4" vOn:click={ context.listeners.close }>
              mdi-close
            </v-icon> : null
            }
          </div> : null
        }
      </v-card-title> 
      <v-card-text>
        { context.props.msg && context.props.msg.length > 0 ? <div>{context.props.msg}</div> : null }
        { cols.length > 0 ? <v-form ref={context.props.formRef && context.props.formRef !== '' ? context.props.formRef : null}>
          {context.props.formInfo && context.props.formInfo !== '' ? <small>{context.props.formInfo}</small> : null}
          <v-container>
            <v-row>
              {cols}
            </v-row>
          </v-container>
        </v-form> : null}
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        { context.listeners.cancel ? <v-btn
          color="blue darken-1"
          text
          vOn:click={ context.listeners.cancel }
        >
          {vuetify.preset.lang.t('$vuetify.lang_menu_cancel')}
        </v-btn> : null }
        { context.listeners.confirm ? <v-btn
          color="blue darken-1"
          text
          vOn:click={ context.listeners.confirm }
          loading={context.props.confirmLoading}
        >
          {vuetify.preset.lang.t('$vuetify.lang_menu_confirm')}
        </v-btn> : null }
      </v-card-actions>
    </v-card>
  }
}
</script>

<style scoped>

</style>
