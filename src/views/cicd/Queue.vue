<template>
  <div class="runs">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_runs_queue')">
      <v-card>
        <v-card-title>
          
        </v-card-title>
        <v-card-text>
          <queues-data-table :page="queuesForm.page" :perPage="queuesForm.perPage" :queuesData="queuesData" @getpage="pageOptions" :tableLoading="tableLoading" @runTop="runTop" />
        </v-card-text>
      </v-card>
    </PageCard>
  </div>
</template>

<script>
import QueuesDataTable from "@/components/QueuesDataTable";
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import request from "@/utils/request";
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Runs',
  components: { QueuesDataTable, PageCard },
  data () {
    return {
      queuesForm: {
        page: 1,
        perPage: 10
      },
      tableLoading: true,
      queuesData: {}
    }
  },
  created () {
  },
  methods: {
    pageOptions(data){
      const vm = this
      vm.queuesForm.page = data.page
      vm.queuesForm.perPage = data.perPage
      vm.tableLoading = true
      request.post('/cicd/queues', vm.queuesForm).then((response) => {
        vm.queuesData = response.data;
        console.log(response.data);
        vm.tableLoading = false;
      }).catch((error) => {
        vm.tableLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
    },
    refreshList() {
      const vm = this
      vm.tableLoading = true
      request.post('/cicd/queues', vm.queuesForm).then((response) => {
        vm.queuesData = response.data;
        console.log(response.data);
        vm.tableLoading = false;
      }).catch((error) => {
        vm.tableLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
    },
    runTop(data) {
      const vm = this
      request.post(`/cicd/queue/${data.runName}/top`).then(response => {
        vm.successTip(true, response.msg)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>

</style>
