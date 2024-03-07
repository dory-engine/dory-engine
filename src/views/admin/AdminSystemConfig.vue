<template>
  <div>
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_system_config')">
      <v-card>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            dark
            @click="() => {
              this.reloadSystemConfig()
            }"
          >
            {{$vuetify.lang.t('$vuetify.lang_menu_reload_system_config')}}
          </v-btn>
        </v-card-actions>
        <v-card-text class="commits-table">
          <SystemConfigDataTable
            :appConfigs="appConfigs"
            class="elevation-1"
            dense
          />
        </v-card-text>
      </v-card>
    </PageCard>
  </div>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import SystemConfigDataTable from "@/components/SystemConfigDataTable";
import request from "@/utils/request";
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'AdminSystemConfig',
  components: {
    PageCard,
    SystemConfigDataTable,
  },
  data () {
    return {
      appConfigs: [],
    }
  },
  created () {
    const vm = this
    vm.getSystemConfig()
  },
  methods: {
    getSystemConfig() {
      const vm = this
      request.get('/admin/appConfig').then((response) => {
        vm.appConfigs = [
          {"appConfig": response.data.appConfig},
        ]
      }).catch((error) => {
        vm.errorTip(true, error.response.data.msg);
      });      
    },
    reloadSystemConfig() {
      const vm = this
      request.post('/admin/reload', {}).then((response) => {
        vm.successTip(true, response.msg)
      }).catch((error) => {
        vm.errorTip(true, error.response.data.msg);
      });      
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
