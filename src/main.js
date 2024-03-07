import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {vuetify, i18n} from './plugins/vuetify'
import VueRx from 'vue-rx'
// eslint-disable-next-line no-unused-vars
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'
import VuePipeline from '@/lib/ui-lib/vue-pipeline'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import VueClipboard from 'vue-clipboard2'
import JsonViewer from 'vue-json-viewer'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)
Vue.use(mavonEditor)
Vue.config.productionTip = false
Vue.component('vChart', ECharts)
Vue.use(VueRx)
Vue.use(VuePipeline)
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(JsonViewer)
Vue.use(VueCodemirror/*,  {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)
if (process.env.VUE_APP_BASE_WS_API.indexOf('ws') === 0 || process.env.VUE_APP_BASE_WS_API.indexOf('wss') === 0) {
  Vue.prototype.GLOBAL_WS_API = process.env.VUE_APP_BASE_WS_API
} else {
  var baseUrl = window.location.origin
  if (baseUrl.indexOf('https') === 0) {
    Vue.prototype.GLOBAL_WS_API = baseUrl.replace('https', 'wss') + process.env.VUE_APP_BASE_WS_API
  } else if (baseUrl.indexOf('http') === 0) {
    Vue.prototype.GLOBAL_WS_API = baseUrl.replace('http', 'ws') + process.env.VUE_APP_BASE_WS_API
  }
}

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
