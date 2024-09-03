<template>
  <div>
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_commits')">
      <v-card flat>
        <v-card-title>
          <v-form ref="form">
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="projectItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="commitsForm.projectNames"
                @blur="commitsSearch()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="commitsForm.pipelineNames"
                @blur="commitsSearch()"
              ></v-autocomplete>
              <v-combobox
                :label="$vuetify.lang.t('$vuetify.lang_form_run_name')"
                class="mr-8"
                dense
                multiple
                small-chips
                hide-selected
                v-model="commitsForm.runNames"
                @blur="commitsSearch()"
              >
              </v-combobox>
              <v-autocomplete
                :items="branchItems"
                :label="$vuetify.lang.t('$vuetify.lang_form_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="commitsForm.branchNames"
                @blur="commitsSearch()"
              ></v-autocomplete>
              <v-combobox
                :label="$vuetify.lang.t('$vuetify.lang_form_commit_hash')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="commitsForm.commitHashes"
                @blur="commitsSearch()"
              ></v-combobox>
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
                      :label="$vuetify.lang.t('$vuetify.lang_form_commit_time')"
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
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_committee')"
                class="mr-8"
                dense
                v-model="commitsForm.committerName"
                @keydown.enter="commitsSearch()"
              />
              <v-text-field
                :label="$vuetify.lang.t('$vuetify.lang_form_committee_mail')"
                class="mr-8"
                dense
                v-model="commitsForm.committerEmail"
                @keydown.enter="commitsSearch()"
              />
              <v-autocomplete
                :items="[
                  { value: 'commitTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_commit_time_desc') },
                  { value: 'commitTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_commit_time_asc') },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
                class="mr-8"
                clearable
                dense
                v-model="commitsForm.sortMode"
                @change="commitsSearch()"
              ></v-autocomplete>
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text class="commits-table">
          <CommitsDataTable
            :commits="commitsData.commits"
            :items-per-page="commitsForm.perPage"
            :page="commitsForm.page"
            :server-items-length="commitsData.totalCount"
            class="elevation-1"
            dense
            :footer-props="{
              showCurrentPage: true,
              itemsPerPageOptions: [ 5, 10, 15, 20 ]
            }"
            show-expand
            :loading="tableLoading"
            :loading-text="$vuetify.lang.t('$vuetify.lang_tip_loading_data')"
            @update:options="changeOptions($event)"
          />
        </v-card-text>
      </v-card>
    </PageCard>
  </div>
</template>

<script>
import request from '@/utils/request'
import Commit from '@/views/cicd/Commit'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import COMMITS_API from '@/api/cicd/commits'
import PROJECTS_API from '@/api/cicd/projects'
import MODULE_API from '@/api/cicd/module';
import CommitsDataTable from "@/components/CommitsDataTable";
export default {
    inject: ['successTip', 'errorTip', 'warnTip'],
    props: [],
    components: {CommitsDataTable, Commit, PageCard },
    data() {
        return {
          projectItems: [],
          pipelineItems: [],
          branchItems: [],
          tableLoading: true,
          commitsForm: {
            projectNames: [],
            pipelineNames: [],
            runNames: [],
            branchNames: [],
            commitHashes: [],
            committerName: '',
            committerEmail: '',
            createTimeRange: {
              startDate: '',
              endDate: ''
            },
            runNames: [],
            sortMode: '',
            page: 1,
            perPage: 10
          },
          dates:[],
          menu2: false,
          commitsData: {}
        }
    },
    created() {
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
        this.commitsSearch()
      },
      commitsSearch() {
        this.commitsForm.createTimeRange.startDate = this.dates[0]
        this.commitsForm.createTimeRange.endDate = this.dates[1]
        COMMITS_API.getCommits(this.commitsForm).then(response => {
          this.successTip(true, response.msg)
          response.data.commits.forEach((row, index) => {
            row.index = index
          })
          this.commitsData = response.data
          this.tableLoading = false
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      },
      dateRangeSubmit() {
        this.menu2 = false
        this.commitsSearch()
      },
      changeOptions(e) {
        this.commitsForm.PageCard = e.itemsPerPage
        this.commitsForm.page = e.page
        this.commitsForm.createTimeRange.startDate = this.dates[0]
        this.commitsForm.createTimeRange.endDate = this.dates[1]
        COMMITS_API.getCommits(this.commitsForm).then(response => {
          response.data.commits.forEach((row, index) => {
            row.index = index
          })
          this.commitsData = response.data
          this.tableLoading = false
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      }
    },
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      }
    }
}
</script>

<style>
.commits-table .CodeMirror {
  height: auto;
}
.commits-table .CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
