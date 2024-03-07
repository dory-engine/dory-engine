<script>
import { mergeAll } from 'lodash/fp'
const DEFAULT_PROP = {
  key: 'key',
  children: 'children',
  text: 'text',
  icon: 'icon',
  title: 'title',
  slot: 'slot',
  vNode: 'vNode',
  onClick: 'onClick'
}
export default {
  name: 'NavMenu',
  functional: true,
  props: {
    menuType: {
      type: String,
      default: 'vertical' // horizontal
    },
    prop: {
      type: Object,
      default () {
        return DEFAULT_PROP
      }
    },
    menuData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  render (createElement, context) {
    const prop = Object.assign({}, DEFAULT_PROP, context.props.prop)
    function rtnMenuItem (nodeData, level, position) {
      if (nodeData[prop.children] && nodeData[prop.children].length > 0) {
        return <VListGroup
          class={level === 'top' ? '' : 'ml-5'}
          group={nodeData.key}
        >
          <template slot="activator">
            <v-list-item>
              { nodeData[prop.icon] ? <v-list-item-icon>
                <v-icon>{nodeData[prop.icon]}</v-icon>
              </v-list-item-icon> : null}
              <VListItemTitle>{nodeData[prop.text]}</VListItemTitle>
            </v-list-item>
          </template>
          { nodeData[prop.children].map(childNode => rtnMenuItem(childNode, 'sub', position)) }
        </VListGroup>
      } else {
        const nodeText = (() => {
          if (typeof nodeData[prop.text] === 'function') {
            return nodeData[prop.text](createElement)
          } else {
            return nodeData[prop.text]
          }
        })()
        const to = nodeData.routerKey ? { name: nodeData.routerKey } : undefined
        return <VListItem
          link={true}
          class={level === 'top' ? '' : 'ml-5'}
          vOn:click={() => {
            if (nodeData.onClick) {
              nodeData.onClick(createElement, context)
            }
          }}
          to={to}
          color='primary'
        >
          { nodeData[prop.icon] ? <v-list-item-icon
            class={position === 'inTopBar' ? 'mr-1' : null}
          >
            <v-icon>{nodeData[prop.icon]}</v-icon>
          </v-list-item-icon> : null}
          <VListItemTitle>
            {nodeText}
          </VListItemTitle>
        </VListItem>
      }
    }
    function rtnHorizontalMenuItem (nodeData, type) {
      if (nodeData[prop.children] && nodeData[prop.children].length > 0) {
        return <VMenu
          offset-y={true}
          open-on-hover={true}
          scopedSlots={{
            activator ({ on, attrs }) {
              return <VBtn
                // color="primary"
                dark={true}
                depressed={true}
                text={true}
                props={attrs}
                on={on}
              >
                { nodeData[prop.icon] ? <v-icon>{nodeData[prop.icon]}</v-icon> : null}
                { nodeData[prop.text] }
                <VIcon>mdi-menu-down</VIcon>
              </VBtn>
            }
          }}
        >
          <VList
            dense={true}
          >
            { nodeData[prop.children].map(childNode => rtnMenuItem(childNode, 'top', 'inTopBar')) }
          </VList>
        </VMenu>
      } else {
        const rtnBtn = (config) => {
          const data = {
            props: {
              dark: true,
              depressed: true,
              text: true,
              to: nodeData.routerKey ? { name: nodeData.routerKey } : undefined
            }
          }
          const children = [
            nodeData[prop.icon] ? <v-icon>{nodeData[prop.icon]}</v-icon> : null,
            nodeData[prop.text]
          ]
          return createElement('v-btn', mergeAll({}, config || {}, data), children)
        }
        if (nodeData[prop.title] && nodeData[prop.title] !== '') {
          return <v-tooltip
            bottom={true}
            scopedSlots={{
              activator (config) {
                return rtnBtn(config)
              }
            }}
          >
            <span>{nodeData[prop.title]}</span>
          </v-tooltip>
        } else {
          return rtnBtn()
        }
      }
    }
    if (context.props.menuType === 'vertical') {
      return <VList
        dense={true}
      >
        { context.props.menuData.map(childNode => rtnMenuItem(childNode, 'top')) }
      </VList>
    } else {
      return <div>
        { context.props.menuData.map(childNode => rtnHorizontalMenuItem(childNode, 'top')) }
      </div>
    }
  }
}
</script>

<style scoped lang="scss">

</style>
