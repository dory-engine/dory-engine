<template>
  <v-data-table
    :headers="headers"
    :items="queuesData.runs"
    :items-per-page="perPage"
    :page="page"
    class="elevation-1"
    :server-items-length="queuesData.totalCount"
    :footer-props="{
      showCurrentPage: true,
      itemsPerPageOptions: [ 5, 10, 15, 20 ]
    }"
    dense
    :loading="tableLoading"
    @update:options="changeOptions($event)"
  >
    <template v-slot:item.runName="config">
      <router-link v-if="config.item.runName !== '-'" :to="{ name: 'CicdRun', params: { 'runName': config.item.runName }}">{{ config.item.runName }}</router-link>
      <div v-else>{{ config.item.runName }}</div>
    </template>
    <template v-slot:item.projectName="{ item }">
      <div v-if="item.runName !== '-'">
        <router-link :to="{ name: 'CicdProject', params: { projectName: item.projectName }}">{{ item.projectName }}</router-link>/
        <router-link :to="{ name: 'CicdPipeline', params: { pipelineName: item.pipelineName }}">{{ item.pipelineName }}</router-link>
      </div>
      <div v-else>
        <span>{{ item.projectName }}</span>/
        <span>{{ item.pipelineName }}</span>
      </div>
    </template>
    <template v-slot:item.triggerKind="{ item }">
      <v-chip v-if="item.triggerKind" small class="mb-1 white--text" style="text-transform:uppercase" color="teal">
        {{item.triggerKind}}
      </v-chip>
    </template>
    <template v-slot:item.startTime="{ item }">
      {{ item.status.startTime }}
    </template>
    <template v-slot:item.handle="{ item }">
      <v-btn class="my-2" color="primary" small v-if="item.runName !== '-'" @click="runTop(item.runName)">{{$vuetify.lang.t('$vuetify.lang_menu_run_queue_top')}}</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'QueuesDataTable',
  props: {
    page: Number,
    perPage: Number,
    queuesData: Object,
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
    },
    runTop(runName) {
      this.$emit('runTop', {runName: runName})
    }
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
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false }
      ]
    }
  },
  watch: {
   queuesData: function(n,o) {
     this.queuesData = n
   }
  }
}
</script>

<style scoped>

</style>
