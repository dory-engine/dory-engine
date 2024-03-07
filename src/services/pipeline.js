import Vue from 'vue'
import {vuetify} from '@/plugins/vuetify'
export default class Pipeline {
  state = Vue.observable({
    pipelineTypeMap: { 
      pipelineName: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name'), 
      successCount: vuetify.preset.lang.t('$vuetify.lang_view_succes_count'), 
      failCount: vuetify.preset.lang.t('$vuetify.lang_view_fail_count'), 
      abortCount: vuetify.preset.lang.t('$vuetify.lang_view_abort_count'), 
      lastRunTime: vuetify.preset.lang.t('$vuetify.lang_view_latest_run_time'), 
      lastRunDuration: vuetify.preset.lang.t('$vuetify.lang_view_duration'), 
      subType: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_type'),
    }
  })

  // eslint-disable-next-line no-useless-constructor
  constructor () {

  }

  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
}
