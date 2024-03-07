<template>
  <router-view v-if="isRouterAlive" />
</template>

<script>
import {vuetify} from '@/plugins/vuetify'
import request from '@/utils/request';
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {},
  data: () => ({
    isRouterAlive: true,
    frontendInfo: {
      appName: '',
      appDesc: '',
      appLogo: '',
      appFavIcon: '',
      appBackGroundImage: '',
    },
  }),
  created () {
    const vm = this
    request.get('/public/about').then(response => {
      vm.frontendInfo = response.data.config.frontend
      document.title = vm.frontendInfo.appName + " - " + vm.frontendInfo.appDesc
      let favicon = document.querySelector('link[rel="icon"]')
      favicon.setAttribute('href', vm.frontendInfo.appFavIcon)
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>
table th,table td{
  padding: 0 8px !important;
}
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.repo-wrap a {
  text-decoration: none;
}
.repo-wrap a .v-chip {
  cursor: pointer;
}
</style>
