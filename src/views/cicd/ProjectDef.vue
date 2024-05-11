<template>
  <div class="project pa-4">
    <PageCard>
      <v-card class="mb-4" :loading="cardLoading">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_info')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project" class="mb-4">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_namespace')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_repo')}}
                  </th>
                  <th class="text-left" v-for="(item,index) in project.projectNodePorts" :key="index">
                    <v-icon v-if="item.privileged">mdi-security</v-icon>
                    {{$vuetify.lang.t('$vuetify.lang_view_env')}}({{item.envName}})
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <template>
                      <router-link :to="
                        { 
                          name: 'CicdProject', 
                          params: { projectName: project.projectInfo.projectName },
                        }
                      ">
                        <span>{{ project.projectInfo.projectName }}</span><span>({{ project.projectInfo.projectShortName}})</span>
                        <div>{{ project.projectInfo.projectDesc }}</div>
                      </router-link>
                    </template>
                  </td>
                  <td>
                    <div>{{ project.projectInfo.projectNamespace }}({{ project.projectInfo.shortName }})</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_team')}}: {{ project.projectInfo.projectTeam }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_arch')}}: {{ project.projectInfo.projectArch }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_tenant_code')}}: {{ project.tenantCode }}</div>
                  </td>
                  <td>
                    <div class="repo-wrap">
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.gitRepo">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip outlined v-bind="attrs" v-on="on" small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_git_repo')}}</v-chip>
                            </template>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_build_settings_dir') }}: {{ project.projectRepo.gitRepoDir.buildSettingsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_database_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.databaseScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_demo_codes_dir') }}: {{ project.projectRepo.gitRepoDir.demoCodesDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_deploy_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.deployScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_documents_dir') }}: {{ project.projectRepo.gitRepoDir.documentsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_test_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.testScriptsDir }}</div>
                          </v-tooltip>
                        </a>
                      </div>
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.imageRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_image_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepo">
                        <a target="_Blank" :href="project.projectRepo.artifactRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepoType === 'internal'">
                        <router-link :to="{ name: 'CicdArtifact', params: { projectName: project.projectInfo.projectName }}">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </router-link>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.scanCodeRepo">
                        <a target="_Blank" :href="project.projectRepo.scanCodeRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_scan_code_repo')}}</v-chip>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td v-for="(item,index) in project.projectNodePorts" :key="index" style="vertical-align: top;">
                    <template>
                      <div class="my-1" v-for="(envNodePort,i) in item.envNodePorts" :key="i">
                        <v-chip :color="envNodePort.isDefault ? 'success' : 'primary'" small>
                          {{ envNodePort.nodePortStart }}-{{ envNodePort.nodePortEnd }}
                        </v-chip>
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_build_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_package_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_artifact_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_docker_ignore_def')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <template>
                      <v-btn small class="my-1" color="primary" @click="openBuildDef()">{{$vuetify.lang.t('$vuetify.lang_menu_build_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="project.projectDef.errMsgPackageDefs === '' ? 'primary' : 'error'" @click="openPackageDef()">{{$vuetify.lang.t('$vuetify.lang_menu_package_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="project.projectDef.errMsgArtifactDefs === '' ? 'primary' : 'error'" @click="openArtifactDef()">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" color="primary" @click="openDockerIgnoreDef()">{{$vuetify.lang.t('$vuetify.lang_menu_docker_ignore_def')}}</v-btn>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_custom_step_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_ops_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_ops_batch_def')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <template>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            small
                          >
                            {{$vuetify.lang.t('$vuetify.lang_menu_custom_step_def')}}
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in project.customStepAvailables"
                            :key="index"
                            link
                          >
                            <v-list-item-title :class="customStepColor(item)" @click="openCustomStepDef(item)">{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" color="primary" @click="openOpsDef()">{{$vuetify.lang.t('$vuetify.lang_menu_ops_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" color="primary" @click="openOpsBatchDef()">{{$vuetify.lang.t('$vuetify.lang_menu_ops_batch_def')}}</v-btn>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_pipelines_settings')}}
        </v-card-title>
        <v-card-text>
          <DefsPipelinesTable
            :pipelines="project.pipelines"
            hideDefaultFooter
            disablePagination
            :goRun="goRun"
            :openPipelineDef="openPipelineDef"
          />
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_envs_settings')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_env')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_deploy_container_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_deploy_artifact_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_istio_gateway_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_istio_def')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_env_custom_step_def')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in project.projectAvailableEnvs" :key="item.envName">
                  <td>
                    <template>
                      {{ item.envName }}
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="item.errMsgDeployContainerDefs === '' ? 'primary' : 'error'" @click="openDeployContainerDef(item.envName)">{{$vuetify.lang.t('$vuetify.lang_menu_deploy_container_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="item.errMsgDeployArtifactDefs === '' ? 'primary' : 'error'" @click="openDeployArtifactDef(item.envName)">{{$vuetify.lang.t('$vuetify.lang_menu_deploy_artifact_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="item.errMsgIstioGatewayDef === '' ? 'primary' : 'error'" @click="openIstioGatewayDef(item.envName)">{{$vuetify.lang.t('$vuetify.lang_menu_istio_gateway_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-btn small class="my-1" :color="item.errMsgIstioDefs === '' ? 'primary' : 'error'" @click="openIstioDef(item.envName)">{{$vuetify.lang.t('$vuetify.lang_menu_istio_def')}}</v-btn>
                    </template>
                  </td>
                  <td>
                    <template>
                      <v-menu offset-y v-if="project.customStepAvailableEnvs.length > 0">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            small
                          >
                            {{$vuetify.lang.t('$vuetify.lang_menu_env_custom_step_def')}}
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(row, index) in project.customStepAvailableEnvs"
                            :key="index"
                            link
                          >
                            <v-list-item-title :class="customStepEnvColor(item, row)" @click="openCustomStepEnvDef(item.envName, row)">{{ row }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </PageCard>
    <DialogDefs
      :projectName="targetProjectName"
      ref="DialogDefs"
      @projectDef="project = $event"
    />
  </div>
</template>

<script>
import PageCard from "@/lib/ui-lib/page-templates/PageCard";
import DefsPipelinesTable from "@/components/DefsPipelinesTable";
import DialogDefs from "@/components/DialogDefs";
import request from "@/utils/request";
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ["successTip", "errorTip", "warnTip"],
  name: "Project",
  components: {
    PageCard,
    DefsPipelinesTable,
    DialogDefs,
  },
  data() {
    return {
      project: {
        projectInfo: {
          projectName: this.$route.params.projectName,
        },
        projectDef: {},
        projectRepo: {
          gitRepoType: '',
          gitRepoDir: {
            buildSettingsDir: '',
            databaseScriptsDir: '',
            demoCodesDir: '',
            deployScriptsDir: '',
            documentsDir: '',
            testScriptsDir: '',
          },
        }
      },
      targetProjectName: "",
      cardLoading: true,
    };
  },
  created() {
    const vm = this;
    vm.targetProjectName = vm.$route.params.projectName;
    request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
      vm.project = response.data.project;
      vm.cardLoading = false;
    }).catch((error) => {
      vm.cardLoading = false;
      vm.errorTip(true, error.response.data.msg);
    });
  },
  methods: {
    openBuildDef() {
      this.$refs.DialogDefs.openBuildDef()
    },
    openPackageDef() {
      this.$refs.DialogDefs.openPackageDef()
    },
    openArtifactDef() {
      this.$refs.DialogDefs.openArtifactDef()
    },
    openDockerIgnoreDef() {
      this.$refs.DialogDefs.openDockerIgnoreDef()
    },
    openCustomStepDef(stepName) {
      this.$refs.DialogDefs.openCustomStepDef(stepName)
    },
    openOpsDef() {
      this.$refs.DialogDefs.openOpsDef()
    },
    openOpsBatchDef() {
      this.$refs.DialogDefs.openOpsBatchDef()
    },
    openDeployContainerDef(envName) {
      this.$refs.DialogDefs.openDeployContainerDef(envName)
    },
    openDeployArtifactDef(envName) {
      this.$refs.DialogDefs.openDeployArtifactDef(envName)
    },
    openIstioDef(envName) {
      this.$refs.DialogDefs.openIstioDef(envName)
    },
    openIstioGatewayDef(envName) {
      this.$refs.DialogDefs.openIstioGatewayDef(envName)
    },
    openCustomStepEnvDef(envName, stepName) {
      this.$refs.DialogDefs.openCustomStepEnvDef(envName, stepName)
    },
    openPipelineDef(projectName, branchName) {
      this.$refs.DialogDefs.openPipelineDef(projectName, branchName)
    },
    goRun(runName) {
      this.$router.push({
        name: "CicdRun",
        params: {
          runName: runName,
        },
      });
    },
    customStepColor(item) {
      const vm = this
      if(vm.project.projectDef.errMsgCustomStepDefs !== null){
        if(vm.project.projectDef.errMsgCustomStepDefs[item] !== '' && vm.project.projectDef.errMsgCustomStepDefs[item] !== undefined){
          return 'red--text'
        }else{
          if(vm.project.projectDef.customStepDefs !== null && vm.project.projectDef.customStepDefs[item] !== undefined){
            if(vm.project.projectDef.customStepDefs[item].customStepModuleDefs !== null){
              return 'blue--text'
            }else{
              return 'green--text'
            }
          }else{
            return 'green--text'
          }
        }
      }else{
        if(vm.project.projectDef.customStepDefs !== null){
          if(vm.project.projectDef.customStepDefs[item].customStepModuleDefs !== null){
            return 'blue--text'
          }else{
            return 'green--text'
          }
        }else{
          return 'green--text'
        }
      }
    },
    customStepEnvColor(item, row) {
      const vm = this
      if(item.errMsgCustomStepDefs !== null){
        if(item.errMsgCustomStepDefs[row] !== '' && item.errMsgCustomStepDefs[row] !== undefined){
          return 'red--text'
        }else{
          if(item.customStepDefs !== null){
            if(item.customStepDefs[row] && item.customStepDefs[row].customStepModuleDefs !== null){
              return 'blue--text'
            }else{
              return 'green--text'
            }
          }else{
            return 'green--text'
          }
        }
      }else{
        if(item.customStepDefs !== null){
          if(item.customStepDefs[row] && item.customStepDefs[row].customStepModuleDefs !== null){
            return 'blue--text'
          }else{
            return 'green--text'
          }
        }else{
          return 'green--text'
        }
      }
    },
  },
};
</script>

<style>
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
.buildDef-panel .v-expansion-panel-header {
  padding-left: 0;
  padding-right: 0;
}
.buildDef-panel .v-expansion-panel::before {
  box-shadow: none;
}
.buildDef-panel .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
}
.v-expansion-panel--active
  > .v-expansion-panel-header--active
  .v-expansion-panel-header__icon:not(.v-expansion-panel-header__icon--disable-rotate)
  .v-icon.diy-icon {
  transform: none;
}
.v-expansion-panel--active
  > .v-expansion-panel-header--active
  .v-expansion-panel-header__icon:not(.v-expansion-panel-header__icon--disable-rotate)
  .diy-icon
  .v-icon {
  transform: none;
}
.buildDef-panel :nth-child(2n + 1).v-expansion-panel {
  background-color: #eee;
}
.hidden-input .v-text-field > .v-input__control > .v-input__slot:before{
  border: none;
}
</style>
<style scoped lang="scss">
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
.modules-item {
  cursor: pointer;
}
.v-text-field {
  font-size: 14px;
}
.v-autocomplete {
  font-size: 14px;
}
.steps-switch {
  width: 50%;
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
