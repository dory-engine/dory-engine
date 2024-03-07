
<script>
import { cloneDeep, get, mergeAll } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'CommitsDataTable',
  components: { 
    DataTable, 
    Monaco, 
  },
  functional: true,
  props: ['commits', 'runLink'],
  render (createElement, context) {
    const headers = [
      { text: vuetify.preset.lang.t('$vuetify.lang_view_project_name'), value: 'projectName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), value: 'branchName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_commit_hash'), value: 'commit', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_commit_message'), value: 'message', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_committee'), value: 'commitUser', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), value: 'runName', sortable: false },
      { text: vuetify.preset.lang.t('$vuetify.lang_view_run_result'), value: 'status', sortable: false }
    ]
    const data = cloneDeep(context.data)
    const commits = (context.props.commits || []).map((row, index) => {
      return mergeAll([row, { index }])
    })
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || commits)
    set(data, ['attrs', 'itemKey'], get(['attrs', 'itemKey'], data) || 'index')
    if (get(['attrs', 'showExpand'], data) === undefined) {
      set(data, ['attrs', 'showExpand'], true)
    }
    set(data, ['scopedSlots', 'item.runName'], context.scopedSlots['item.runName'] || ((config) => {
      if (context.props.runLink === false) {
        return config.item.runName
      }
      return [
        <router-link to={{ name: 'CicdRun', params: { runName: config.item.runName } }}>
          { config.item.runName }
        </router-link>,
        <div>{ config.item.createTime }</div>
      ]
    }))
    set(data, ['scopedSlots', 'item.message'], context.scopedSlots['item.message'] || ((config) => {
      let len = 40
      let content = config.item.message
      if (config.item.message.length > len) {
        content = config.item.message.substring(0, len) + '...'
      }
      return <div>{ content }</div>
    }))
    set(data, ['scopedSlots', 'item.commit'], context.scopedSlots['item.commit'] || ((config) => {
      const shortCommit = config.item.commit.slice(0, 8)
      return createElement('div', {
        style: 'cursor: pointer;',
        directives: [
          {
            name: 'clipboard',
            rawName: 'v-clipboard:success',
            value: () => {
              return <v-snackbar
                timeout="2000"
                color="success"
                class="white--text"
              >
                {vuetify.preset.lang.t('$vuetify.lang_tip_copy_success')}
              </v-snackbar>
            },
            arg: 'success'
          },
          {
            name: 'clipboard',
            rawName: 'v-clipboard:copy',
            value: config.item.commit,
            arg: 'copy'
          },
          {
            name: 'clipboard',
            rawName: 'v-clipboard:error',
            value: () => {
              return <v-snackbar
                timeout="2000"
                color="error"
                class="white--text"
              >
                {vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed')}
              </v-snackbar>
            },
            arg: 'error'
          }
        ]
      }, [<v-tooltip
        bottom={true}
        scopedSlots={{
          activator: ({on, attrs}) => {
            return <span
              {...{
                props: attrs,
                on
              }}
            >{shortCommit}...</span>
          }
        }}
      >
        <div>{config.item.commit}</div>
      </v-tooltip>])
    }))
    set(data, ['scopedSlots', 'item.commitUser'], context.scopedSlots['item.commitUser'] || ((config) => {
      return [
        <div>{ config.item.committerName }</div>,
        <div>{ config.item.commitTime }</div>
      ]
    }))
    set(data, ['scopedSlots', 'item.projectName'], context.scopedSlots['item.projectName'] || ((config) => {
      return <router-link to={{ name: 'CicdProject', params: { projectName: config.item.projectName } }}>{ config.item.projectName }</router-link>
    }))
    set(data, ['scopedSlots', 'item.status'], context.scopedSlots['item.status'] || ((config) => {
      let chipColor = ''
      switch (config.item.status.result) {
        case 'FAIL':
          chipColor = 'red'
          break
        case 'RUNNING':
          chipColor = 'blue'
          break
        case 'SUCCESS':
          chipColor = 'green'
          break
        case 'ABORT':
          chipColor = 'grey'
          break
        case 'INPUT':
          chipColor = 'orange'
          break
        case 'PAUSE':
          chipColor = 'blue-grey'
          break
      }
      return [
        <div>{ config.item.status.duration }</div>,
        <v-chip small class="mb-1 white--text" color={chipColor}>
          { config.item.status.result }
        </v-chip>
      ]
    }))
    set(data, ['scopedSlots', 'expanded-item'], context.scopedSlots['expanded-item'] || ((config) => {
      const item = config.item
      item.fullMessageEditor = {
        value: item.fullMessage,
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "plaintext",
        wordWrap: "on",
      }
      return <td colspan={config.headers.length} class="pa-1">
        <v-card class="rounded-0">
          <v-card-title>
            <a target="_Blank" href={item.viewURL}>
              {vuetify.preset.lang.t('$vuetify.lang_view_commit_detail')}
            </a>
          </v-card-title>
          <v-card-text>
            <Monaco
              ref="monaco"
              monacoOptions={item.fullMessageEditor}
              style="height: 20vh; overflow: hidden;"
            ></Monaco>
          </v-card-text>
          <v-card-title>
          <a target="_Blank" href={item.viewURL}>
            {vuetify.preset.lang.t('$vuetify.lang_view_commit_changes_detail')}
          </a>
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_commit_changes_type')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_commit_changes_file')}
                  </th>
                  <th class="text-left">
                  {vuetify.preset.lang.t('$vuetify.lang_view_commit_changes_status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                { (item.diffs || []).map((diffsItem, index) => {
                  return <tr key={index}>
                    <td>{ diffsItem.action }</td>
                    <td>{ diffsItem.fileName }</td>
                    <td>{ diffsItem.stats }</td>
                  </tr>
                })}
              </tbody>

            </v-simple-table>
          </v-card-text>
        </v-card>
      </td>
    }))
    return <DataTable {...data} >
      { context.children }
    </DataTable>
  }
}
</script>

<style scoped>

</style>
