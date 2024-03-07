import Vue from 'vue'
import {vuetify} from '@/plugins/vuetify'
export default class Module {
  state = Vue.observable({
    moduleTypeMap: {
      build: vuetify.preset.lang.t('$vuetify.lang_view_module_type_build'),
      package: vuetify.preset.lang.t('$vuetify.lang_view_module_type_package'),
      deploy: vuetify.preset.lang.t('$vuetify.lang_view_module_type_deploy'),
      artifact: vuetify.preset.lang.t('$vuetify.lang_view_module_type_artifact'),
      deployArtifact: vuetify.preset.lang.t('$vuetify.lang_view_module_type_deploy_artifact'),
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
