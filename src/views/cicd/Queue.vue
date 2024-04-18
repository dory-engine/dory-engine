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
import User from '@/services/user'
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
    const vm = this
    vm.websocketInit()
  },
  destroyed() {
    const vm = this
		vm.websock.close()
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
    },
    websocketInit() {
      const vm = this
			vm.websock = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/runStatus?x-user-token=${User.getInstance().state.userObj.userToken}`)
			vm.websock.onmessage = vm.websocketOnMessage
			vm.websock.onopen = vm.websocketOnOpen
			vm.websock.onerror = vm.websocketOnError
			vm.websock.onclose = vm.websocketOnClose
      console.log("websocket init")
		},
		websocketOnOpen() {
		},
		websocketOnError() {
      const vm = this
			console.log("websocket error")
		},
		websocketOnMessage(e) {
      const vm = this
      let runStatusUpdate = JSON.parse(e.data)
      if (runStatusUpdate.status === 'PAUSE') {
        vm.refreshList()
      } else {
        vm.queuesData.runs.forEach(item => {
          if (item.runName === runStatusUpdate.runName) {
            if (runStatusUpdate.status !== 'PAUSE') {
              vm.refreshList()
            }
          }
        })
      }
			console.log(runStatusUpdate)
		},
		websocketOnClose(e) {
      const vm = this
			console.log("websocket closed")
		},
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>

</style>
