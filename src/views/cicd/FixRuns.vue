<template>
  <div class="fixRuns">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_runs_fixed')">
      <v-card>
        <v-card-title>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="[ 'yes', 'no' ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_is_closed')"
                class="mr-8"
                dense
                clearable
                v-model="fixRunsForm.closed"
                @change="getFixRuns()"
              ></v-select>
              <v-select
                :items="projectItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="fixRunsForm.projectNames"
                @blur="getFixRuns()"
              ></v-select>
              <v-select
                :items="pipelineItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="fixRunsForm.pipelineNames"
                @blur="getFixRuns()"
              ></v-select>
              <v-select
                :items="branchItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="fixRunsForm.branchNames"
                @blur="getFixRuns()"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      :label="$vuetify.lang.t('$vuetify.lang_form_error_start_time')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                    no-title
                    @change="dateRangeSubmit()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text>
          <fixRuns-data-table :page="fixRunsForm.page" :perPage="fixRunsForm.perPage" :fixRunsData="fixRunsData" @getpage="pageOptions" :tableLoading="tableLoading" />
        </v-card-text>
      </v-card>
    </PageCard>
  </div>
</template>

<script>
import request from '@/utils/request'
import FixRunsDataTable from "@/components/FixRunsDataTable";
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import FIXRUNS_API from '@/api/cicd/fixRuns';
import PROJECTS_API from '@/api/cicd/projects'
import MODULE_API from '@/api/cicd/module';
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'FixRuns',
  components: { FixRunsDataTable, PageCard },
  data () {
    return {
      dates: [],
      menu2: false,
      fixRunsForm:{
        projectNames: [],
        pipelineNames: [],
        branchNames: [],
        closed: "",
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        page: 1,
        perPage: 10
      },
      fixRunsData: {},
      tableLoading: true,
      projectItems: [],
      pipelineItems: [],
      branchItems: [],
      closedItems: ["yes", "no"],
    }
  },
  created () {
    const vm = this
    request.get('/cicd/projectNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.projectItems = response.data.projectNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/pipelineNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.pipelineItems = response.data.pipelineNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/cicd/branchNames').then(response => {
      if (response.data.statusResults !== null) {
        vm.branchItems = response.data.branchNames
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    clearDates() {
      this.dates = []
      this.menu2 = false
      this.getFixRuns()
    },
    dateRangeSubmit() {
      this.menu2 = false
      this.getFixRuns()
    },
    getFixRuns() {
      if(this.fixRunsForm.duration == null) {
        this.fixRunsForm.duration = 0
      }
      this.fixRunsForm.createTimeRange.startDate = this.dates[0]
      this.fixRunsForm.createTimeRange.endDate = this.dates[1]
      FIXRUNS_API.getFixRuns(this.fixRunsForm).then(response => {
        response.data.fixRuns.forEach((row, index) => {
          row.index = index
        })
        this.fixRunsData = response.data
        this.tableLoading = false
        this.successTip(true, response.msg)
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    pageOptions(data){
      this.fixRunsForm.page = data.page
      this.fixRunsForm.perPage = data.perPage
      if(this.fixRunsForm.duration == null) {
        this.fixRunsForm.duration = 0
      }
      this.fixRunsForm.createTimeRange.startDate = this.dates[0]
      this.fixRunsForm.createTimeRange.endDate = this.dates[1]
      FIXRUNS_API.getFixRuns(this.fixRunsForm).then(response => {
        response.data.fixRuns.forEach((row, index) => {
          row.index = index
        })
        this.fixRunsData = response.data
        this.tableLoading = false
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    }
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
