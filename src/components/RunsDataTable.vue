<template>
  <v-data-table
    :headers="headers"
    :items="runsData.runs"
    :items-per-page="perPage"
    :page="page"
    class="elevation-1"
    :server-items-length="runsData.totalCount"
    :footer-props="{
      showCurrentPage: true,
      itemsPerPageOptions: [ 5, 10, 15, 20 ]
    }"
    dense
    :loading="tableLoading"
    @update:options="changeOptions($event)"
  >
    <template v-slot:item.runName="config">
      <router-link :to="{ name: 'CicdRun', params: { 'runName': config.item.runName }}">{{ config.item.runName }}</router-link>
    </template>
    <template v-slot:item.projectName="{ item }">
      <router-link :to="{ name: 'CicdProject', params: { projectName: item.projectName }}">{{ item.projectName }}</router-link>/
      <router-link :to="{ name: 'CicdPipeline', params: { pipelineName: item.pipelineName }}">{{ item.pipelineName }}</router-link>
    </template>
    <template v-slot:item.tagName="{ item }">
      <a v-if="item.gitURL" :href="item.gitURL" target="_blank">{{ item.tagName }}</a>
      <div v-else>{{ item.tagName }}</div>
    </template>
    <template v-slot:item.triggerKind="{ item }">
      <v-chip v-if="item.triggerKind" small class="mb-1 white--text" style="text-transform:uppercase" color="teal">
        {{item.triggerKind}}
      </v-chip>
    </template>
    <template v-slot:item.startTime="{ item }">
      {{ item.status.startTime }}
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
  </v-data-table>
</template>

<script>
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'RunsDataTable',
  props: {
    page: Number,
    perPage: Number,
    runsData: Object,
    tableLoading: Boolean
  },
  data () {
    return {
      
    }
  },
  created () {
  },
  methods: {
    changeOptions(e) {
      this.$emit('getpage', {page: e.page, perPage: e.itemsPerPage})
    },
  },
  computed: {
    headers () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), sortable: false, value: 'runName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_project_pipeline_name'), value: 'projectName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tag_name'), value: 'tagName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_start_user'), value: 'startUser', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_trigger_kind'), value: 'triggerKind', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_start_time'), value: 'startTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_run_result'), value: 'result', sortable: false }
      ]
    }
  },
  watch: {
    runsData: function(n,o) {
      this.runsData = n
    }
  }
}
</script>

<style scoped>

</style>
