<script>
import InfoCard from '@/lib/ui-lib/components/InfoCard'
import InfoSingleTable from '@/lib/ui-lib/components/InfoSingleTable'
import SearchForm from '@/lib/ui-lib/components/SearchForm'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import ModuleInfos from '@/components/ModuleInfos'
import PROJECTS_API from '@/api/cicd/projects'
import { Subject, of, defer, BehaviorSubject } from 'rxjs'
import { mergeMap, tap, filter, catchError, debounce, retry } from 'rxjs/operators'
import PipelinesDataTable from '@/components/PipelinesDataTable'
import DataTable from '@/lib/ui-lib/components/DataTable'
import DialogDefs from "@/components/DialogDefs";
import { rtnRetryWhenOperator } from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Projects',
  components: { DataTable, PipelinesDataTable, ModuleInfos, PageCard, SearchForm, InfoSingleTable, InfoCard, DialogDefs },
  subscriptions () {
    return {
      queryPage$: new BehaviorSubject(''),
      projectNamesChange$: new Subject(),
      projectNamesBlur$: new Subject()
    }
  },
  data () {
    return {
      searchForm: {
        projectNames: [],
        projectTeam: ''
      },
      projectNames: [],
      pageData: {
        loading: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        rows: [],
        displayRows: [],
        expanded: []
      },
    }
  },
  computed: {
  },
  created () {
    const vm = this
    vm.$observables.queryPage$.pipe(
      tap(next => {
        vm.pageData.loading = true
      }),
      mergeMap(next => {
        const param = Object.assign({}, vm.searchForm, {
          page: vm.pageData.currentPage,
          perPage: vm.pageData.pageSize
        })
        return defer(() => PROJECTS_API.getProjects(param)).pipe(
          rtnRetryWhenOperator(),
          catchError((err, caught) => {
            console.log(err)
            vm.pageData.loading = false
            vm.errorTip(true, err.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => {
        return next
      })
    ).subscribe(response => {
      vm.successTip(true, response.msg)
      vm.pageData.loading = false
      vm.pageData.rows = response.data.projects
      vm.pageData.displayRows = vm.pageData.rows.map((row, index) => {
        return Object.assign({}, row, {
          pipelinesInfoCard: rtnPipelinesInfoCard(row, index)
        })
      })
      vm.pageData.expanded = [vm.pageData.displayRows[0]]
      vm.pageData.total = response.data.totalCount
    })
    // vm.$observables.queryPage$.next('init')
    PROJECTS_API.getProjectName().then(response => {
      vm.projectNames = response.data.projectNames
    }).catch((_) => {
      vm.errorTip(true, _.response.data.msg)
    })
    vm.$observables.projectNamesChange$.pipe(
      debounce(next => {
        return vm.$observables.projectNamesBlur$
      })
    ).subscribe(next => {
      vm.pageData.currentPage = 1
      vm.$observables.queryPage$.next('')
    })
    function rtnPipelinesInfoCard (row, index) {
      return {
        title: '',
        content (h) {
          const dataTable = <div>
            <PipelinesDataTable
              projectName={row.projectInfo.projectName}
              pipelines={row.pipelines}
              opsBatchDefs={row.opsBatchDefs}
              hideDefaultFooter
              disablePagination
              goRun={(runName) => {
                vm.$router.push({
                  name: 'CicdRun',
                  params: {
                    runName: runName
                  }
                })
              }}
              openPipelineDef={vm.openPipelineDef}
            />
          </div>
          return dataTable
        }
      }
    }
  },
  methods: {
    openPipelineDef(projectName, branchName) {
      const vm = this
      let refs = []
      let refName = 'DialogDefs-' + projectName
      for (let [key, value] of Object.entries(vm.$refs)) {
        if (key == refName) {
          refs.push(value)
        }
      }
      if (refs.length > 0) {
        refs[0].openPipelineDef(projectName, branchName)
      } else {
        console.log("ref", refName, "not found")
      }
    },
  },
  render (createElement, context) {
    const vm = this
    // vm.$observables.queryPage$.next('')
    return <PageCard
      name={vuetify.preset.lang.t('$vuetify.lang_view_cicd')}
    >
      <DataTable
        loading={vm.pageData.loading}
        headers={[
          { value: 'data-table-expand' },
          { value: 'projectName', text: vuetify.preset.lang.t('$vuetify.lang_view_project_name'), sortable: false },
          { value: 'projectNamespace', text: vuetify.preset.lang.t('$vuetify.lang_view_project_namespace'),sortable: false },
          { value: 'projectRepo', text: vuetify.preset.lang.t('$vuetify.lang_view_project_repo'), sortable: false },
          { value: 'env', text: vuetify.preset.lang.t('$vuetify.lang_view_project_available_envs'), sortable: false },
          { value: 'handle', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false }
        ]}
        items={vm.pageData.displayRows}
        itemKey='projectInfo.projectName'
        footerProps={{
          showCurrentPage: true
        }}
        scopedSlots={{
          /* 'footer.page-text': (config) => {
            return <VPagination
              value={1}
              length={6}
            />
          }, */
          'item.projectName': (config) => {
            return <router-link to={{ name: 'CicdProject', params: { projectName: config.item.projectInfo.projectName } }}>
              <div>
                {config.item.projectInfo.projectName}({ config.item.projectInfo.projectShortName })
              </div>
              <div>{config.item.projectInfo.projectDesc}</div>
            </router-link>
          },
          'item.projectNamespace': (config) => {
            return <span>
              <div>
                {config.item.projectInfo.projectNamespace} (<span>{config.item.projectInfo.shortName}</span>)
              </div>
              <div>{vuetify.preset.lang.t('$vuetify.lang_view_project_team')}: {config.item.projectInfo.projectTeam}</div>
              <div>{vuetify.preset.lang.t('$vuetify.lang_view_tenant_code')}: {config.item.tenantCode}</div>
            </span>
          },
          'item.projectRepo': (config) => {
            return <div class="repo-wrap">
              <div class="mb-1">
                <a target="_Blank" href={config.item.projectRepo.gitRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_git_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1">
                <a target="_Blank" href={config.item.projectRepo.imageRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_image_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1" v-show={config.item.projectRepo.artifactRepo !== ''}>
                <a target="_Blank" href={config.item.projectRepo.artifactRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_artifact_repo')}</v-chip>
                </a>
              </div>
              <div class="mb-1" v-show={config.item.projectRepo.artifactRepoType === 'internal'}>
                <router-link to={{name: 'CicdArtifact', params: { projectName: config.item.projectInfo.projectName }}}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_artifact_repo')}</v-chip>
                </router-link>
              </div>
              <div class="mb-1" v-show={config.item.projectRepo.scanCodeRepo !== ''}>
                <a target="_Blank" href={config.item.projectRepo.scanCodeRepo}>
                  <v-chip outlined small color="success">{vuetify.preset.lang.t('$vuetify.lang_menu_scan_code_repo')}</v-chip>
                </a>
              </div>
            </div>
          },
          'item.env': (config) => {
            return <div class="d-flex justify-space-between" style="vertical-align: top;">
              {
                config.item.projectNodePorts.map(item => {
                  let envNodePorts = item.envNodePorts.map(envNodePort => {
                    return <div class="my-1">
                        <v-chip color={envNodePort.isDefault ? 'success' : 'primary'} small>
                          {envNodePort.nodePortStart}-{envNodePort.nodePortEnd}
                        </v-chip>
                      </div>
                  })
                  return <div class="mt-4">
                    <v-chip small>{(item.privileged ? <v-icon>mdi-security</v-icon> : null)}{item.envName}</v-chip>
                    { envNodePorts }
                  </div>
                })
              }
            </div>
          },
          'item.handle': (config) => {
            return <div>
              <v-btn small color="primary" vOn:click={() => {
                vm.$router.push({
                  name: 'CicdProjectDef',
                  params: {
                    projectName: config.item.projectInfo.projectName
                  }
                })
              }}>{vuetify.preset.lang.t('$vuetify.lang_menu_project_def')}</v-btn> 
            </div>
          },
          'expanded-item': (config) => {
            return <td colspan={config.headers.length} class="pa-1">
              <VCard class="rounded-0 pipeline-card elevation-8">
                <VCardTitle>
                  <h5>{vuetify.preset.lang.t('$vuetify.lang_view_pipelines_list')}</h5>
                </VCardTitle>
                <InfoCard
                  props={ config.item.pipelinesInfoCard }
                />
              </VCard>
              <InfoCard>
                <ModuleInfos
                  modules={config.item.modules}
                  projectName={config.item.projectInfo.projectName}
                />
              </InfoCard>
              <DialogDefs
                projectName={config.item.projectInfo.projectName}
                ref={"DialogDefs-"+config.item.projectInfo.projectName}
              />
            </td>
          }
        }}
        showExpand
        expanded={vm.pageData.expanded}
        serverItemsLength={vm.pageData.total}
        options={{
          page: vm.pageData.currentPage,
          itemsPerPage: vm.pageData.pageSize
        }}
        on={{
          'update:expanded': (value) => {
            vm.pageData.expanded = value
          },
          'update:options': (value) => {
            vm.pageData.currentPage = value.page
            vm.pageData.pageSize = value.itemsPerPage
            vm.$observables.queryPage$.next('dataOptionChange')
          }
        }}
      >
        <SearchForm
          slot="top"
          formEls={[
            <VAutocomplete
              v-model={vm.searchForm.projectNames}
              items={vm.projectNames}
              menu-props="{ maxHeight: '400' }"
              label={vuetify.preset.lang.t('$vuetify.lang_form_project_name')}
              multiple
              dense
              small-chips
              clearable
              vOn:change={(value) => {
                vm.pageData.currentPage = 1
                vm.$observables.queryPage$.next('projectNamesChange')
                // vm.$observables.projectNamesChange$.next('')
              }}
              vOn:blur={(value) => {
                // vm.pageData.currentPage = 1
                // vm.$observables.queryPage$.next('projectNamesChange')
                // vm.$observables.projectNamesBlur$.next('')
              }}
              on={{
                'click:clear': (value) => {}
              }}
            >
            </VAutocomplete>,
            <VTextField
              label={vuetify.preset.lang.t('$vuetify.lang_form_project_team')}
              v-model={vm.searchForm.projectTeam}
              dense
              vOn:keyup_enter={(ev) => {
                vm.pageData.currentPage = 1
                vm.$observables.queryPage$.next('projectTeamEnterUp')
              }}
            />
          ]}
        />
      </DataTable>
    </PageCard>
  }
}
</script>

<style scoped>
.pipeline-card .no-shadow {
  box-shadow: none !important;
}
.pipeline-card .v-card__title {
  padding-bottom: 0;
}
.pipeline-wrap .v-chip.v-size--default {
  height: 42px;
  margin-top: 8px;
}
.pipeline-switch .v-input--selection-controls {
  margin-top: 0px;
}
.pipeline-wrap {
  overflow-y: auto;
}
.pipeline-wrap .v-breadcrumbs{
  flex-wrap: nowrap;
  padding: 18px 0;
}
.step-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}
.step-item.avtive {
  background-color: #D1D1D1;
}
.step-icon {
  width: 24px;
  height: 24px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 24px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  user-select: none;
}
.step-icon.off {
  background-color: #607D8B;
}
.original-icon {
  background-color: #2196F3;
}
.custom-icon {
  background-color: #4CAF50;
}
.pipeline-wrap .v-stepper__header .v-stepper__step {
  flex-shrink: 0;
  justify-content: center;
}
.steps-switch {
  width: 50%;
}
.yaml-btn {
  background-color: #fff !important;
  box-shadow: none !important;
}
.yaml-btn:hover::before {
  opacity: 0 !important;
}
.form-item-15 {
  width: 15%;
}
.form-item-20 {
  width: 20%;
}
.form-item {
  width: 30%;
}
.form-item-40 {
  width: 40%;
}
.form-item-45 {
  width: 45%;
}
.form-item-50 {
  width: 50%;
}
.form-item-60 {
  width: 60%;
}
.form-item-70 {
  width: 70%;
}
.form-item-100 {
  width: 100%;
}
.yaml-btn {
  background-color: #fff !important;
  box-shadow: none !important;
}
.yaml-btn:hover::before {
  opacity: 0 !important;
}
.pr-20 {
  padding-right: 80px;
}
.tip-color {
  color: rgba(0, 0, 0, 0.6);
}
.error-text {
  font-size: 16px;
  font-weight: 400;
  color: #ff5252;
}
.params-item {
  padding: 8px;
  border: 1px solid #d2c7c7;
  border-radius: 5px;
  margin-bottom: 16px;
}
</style>
