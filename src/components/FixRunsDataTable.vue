<template>
  <v-data-table
    :headers="headers"
    :items="fixRunsData.fixRuns"
    :items-per-page="perPage"
    :page="page"
    class="elevation-1"
    show-expand
    item-key="index"
    :server-items-length="fixRunsData.totalCount"
    :footer-props="{
      showCurrentPage: true,
      itemsPerPageOptions: [ 5, 10, 15, 20 ]
    }"
    dense
    :loading="tableLoading"
    @update:options="changeOptions($event)"
  >
    <template v-slot:item.projectName="{ item }">
      <router-link :to="{ name: 'CicdProject', params: { projectName: item.projectName }}">{{ item.projectName }}</router-link>
    </template>
    <template v-slot:item.pipelineName="{ item }">
      <router-link :to="{ name: 'CicdPipeline', params: { pipelineName: item.pipelineName }}">{{ item.pipelineName }}</router-link>
    </template>
    <template v-slot:item.triggerKind="{ item }">
      <v-chip v-if="item.triggerKind" small class="mb-1 white--text" style="text-transform:uppercase" color="teal">
        {{item.triggerKind}}
      </v-chip>
    </template>
    <template v-slot:item.successRunName="config">
      <router-link v-if="config.item.successRunName != ''" :to="{ name: 'CicdRun', params: { 'runName': config.item.successRunName }}">{{ config.item.successRunName }}</router-link>
    </template>
    <template v-slot:item.result="{ item }">
      <div class="mt-1">{{ item.status.duration }}</div>
      <v-chip v-if="item.status.result == 'FAIL'" small class="mb-1 white--text" color="red">
        {{ item.status.result }}
      </v-chip>
      <v-chip v-else-if="item.status.result == 'SUCCESS'" small class="mb-1 white--text" color="green">
        {{ item.status.result }}
      </v-chip>
      <v-chip v-else-if="item.status.result == 'INPUT'" small class="mb-1 white--text" color="orange">
        {{ item.status.result }}
      </v-chip>
      <v-chip v-else-if="item.status.result == 'RUNNING'" small class="mb-1 white--text" color="blue">
        {{ item.status.result }}
      </v-chip>
      <v-chip v-else-if="item.status.result == 'ABORT'" small class="mb-1 white--text" color="grey">
        {{ item.status.result }}
      </v-chip>
      <v-chip v-else-if="item.status.result == 'PAUSE'" small class="mb-1 white--text" color="blue-grey">
        {{ item.status.result }}
      </v-chip>
    </template>
    <template v-slot:expanded-item="{ item, headers }">
      <td :colspan="headers.length">
        <v-simple-table dense>
          <thead>
            <tr>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_run_name') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_project_pipeline_name') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_tag_name') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_start_user') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_trigger_kind') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_start_time') }}
              </th>
              <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_view_run_result') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="failRun in item.failRuns">
              <td>
                <router-link :to="{ name: 'CicdRun', params: { 'runName': failRun.runName }}">{{ failRun.runName }}</router-link>
              </td>
              <td>
                <router-link :to="{ name: 'CicdProject', params: { 'projectName': failRun.projectName }}">{{ failRun.projectName }}</router-link>/
                <router-link :to="{ name: 'CicdPipeline', params: { 'pipelineName': failRun.pipelineName }}">{{ failRun.pipelineName }}</router-link>
              </td>
              <td>{{ failRun.tagName }}</td>
              <td>{{ failRun.startUser }}</td>
              <td>{{ failRun.triggerKind }}</td>
              <td>{{ failRun.status.startTime }}</td>
              <td>
                <div class="mt-1">{{ failRun.status.duration }}</div>
                <v-chip v-if="failRun.status.result == 'FAIL'" small class="mb-1 white--text" color="red">
                  {{ failRun.status.result }}
                </v-chip>
                <v-chip v-else-if="failRun.status.result == 'SUCCESS'" small class="mb-1 white--text" color="green">
                  {{ failRun.status.result }}
                </v-chip>
                <v-chip v-else-if="failRun.status.result == 'INPUT'" small class="mb-1 white--text" color="orange">
                  {{ failRun.status.result }}
                </v-chip>
                <v-chip v-else-if="failRun.status.result == 'RUNNING'" small class="mb-1 white--text" color="blue">
                  {{ failRun.status.result }}
                </v-chip>
                <v-chip v-else-if="failRun.status.result == 'ABORT'" small class="mb-1 white--text" color="grey">
                  {{ failRun.status.result }}
                </v-chip>
                <v-chip v-else-if="failRun.status.result == 'PAUSE'" small class="mb-1 white--text" color="blue-grey">
                  {{ failRun.status.result }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'RunsDataTable',
  props: {
    page: Number,
    perPage: Number,
    fixRunsData: Object,
    tableLoading: Boolean
  },
  data () {
    return {
      
    }
  },
  created () {},
  methods: {
    changeOptions(e) {
      this.$emit('getpage', {page: e.page, perPage: e.itemsPerPage})
    }
  },
  computed: {
    headers () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_project_name'), value: 'projectName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name'), value: 'pipelineName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_error_start_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_success_run_name'), value: 'successRunName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_error_close_time'), value: 'closeTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_status'), value: 'result', sortable: false }
      ]
    }
  },
  watch: {
    fixRunsData: function(n,o) {
      this.fixRunsData = n
    }
  }
}
</script>

<style scoped>

</style>
