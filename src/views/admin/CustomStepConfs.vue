<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_custom_steps')">
    <v-card>
      <v-card-title>
        <v-form style="width: 100%">
          <v-container class="d-flex flex-wrap" fluid>
            <v-autocomplete
              :items="customStepNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_name')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="pageRequest.customStepNames"
              @change="getList(true)"
            ></v-autocomplete>
            <v-autocomplete
              :items="tenantCodes"
              :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="pageRequest.tenantCodes"
              @change="getList(true)"
            ></v-autocomplete>
            <v-btn color="primary" @click="openAddCustomSteps()">{{ $vuetify.lang.t('$vuetify.lang_menu_new_custom_step') }}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pageHeaders"
          :items="pageData.customStepConfs"
          :page="pageRequest.page"
          :items-per-page="pageRequest.perPage"
          :server-items-length="pageData.totalCount"
          item-key="customStepName"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.handle="{item}">
            <Operations
                :operations="[
                  {
                    key: 'update',
                    text: $vuetify.lang.t('$vuetify.lang_menu_update_custom_step'),
                    onClick: () => {
                      openUpdateCustomSteps(item)
                    }
                  },
                  {
                    key: 'copy',
                    text: $vuetify.lang.t('$vuetify.lang_menu_copy_custom_step'),
                    onClick: () => {
                      openCopyCustomSteps(item)
                    }
                  },
                  {
                    key: 'delete',
                    text: $vuetify.lang.t('$vuetify.lang_menu_delete_custom_step'),
                    onClick: () => {
                      openDeleteCustomSteps(item.customStepName)
                    }
                  },
                ]"
              ></Operations>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="varsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</span>
          <v-spacer></v-spacer>
          <v-icon class="ml-4" @click="() => {
            this.varsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-card-text>
            <Monaco
              :monacoOptions="markdownMonacoOptions"
              :height="600"
            ></Monaco>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addCustomStepsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_custom_step')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">
                <v-icon color="primary">mdi-progress-question</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddCustomSteps()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addCustomSteps()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addCustomStepsDialog = false
            this.$refs.addCustomStepsRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addCustomStepsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_custom_step_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_name')"
                  dense
                  v-model="addCustomStepsForm.customStepName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_name_tip_1')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addCustomStepsForm.tenantCode"
                  :items="tenantCodes"
                  :required="userObj.isTenantAdmin && !userObj.isAdmin"
                  :clearable="userObj.isAdmin"
                  dense
                  small-chips
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                  persistent-hint
                >
                </v-autocomplete>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ true, false ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff')"
                  dense
                  v-model="addCustomStepsForm.isEnvDiff"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-60 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc')"
                  dense
                  v-model="addCustomStepsForm.customStepDesc"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc')"
                  dense
                  v-model="addCustomStepsForm.customStepActionDesc"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_3')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_usage')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="addCustomStepsForm.customStepUsage"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_usage_tip_1')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="params-item">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo')}}</small>
              <v-tooltip right max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                </template>
                <div style="font-size: 12px;">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_tip_1')}}</div>
                </div>
              </v-tooltip>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="gitRepoNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_name')"
                    dense
                    v-model="addCustomStepsForm.gitRepoName"
                    clearable
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_name_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_path')"
                    dense
                    v-model="addCustomStepsForm.gitRepoPath"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_path_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_branch')"
                    dense
                    v-model="addCustomStepsForm.gitRepoBranch"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_branch_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-60 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="addCustomStepsForm.paramInputYamlDef"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_3', hintConfig.dockerParamInputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_4')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_5')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_6')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_7')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_8')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_9')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ 'yaml', 'json' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format')"
                  dense
                  v-model="addCustomStepsForm.customStepDockerConf.paramInputFormat"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_2', hintConfig.dockerParamInputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_4')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-60 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="addCustomStepsForm.paramOutputYamlDef"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_2', hintConfig.dockerParamOutputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_4')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_5')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_6')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_7', hintConfig.dockerOutputFileDir)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_8')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_9')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_10')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_11')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_12')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ 'yaml', 'json' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format')"
                  dense
                  v-model="addCustomStepsForm.customStepDockerConf.paramOutputFormat"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_1', hintConfig.dockerParamOutputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_4')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="params-item">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_docker_conf')}}</small>
              <v-tooltip right max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                </template>
                <div style="font-size: 12px;">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_docker_conf_tip_1')}}</div>
                </div>
              </v-tooltip>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_image')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.dockerImage"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_image_tip_1', hintConfig.dockerRunAsUid)}}</div>
                    </div>
                  </v-tooltip>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_username')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.registryUsername"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_username_tip_1')"
                    persistent-hint
                  >
                  </v-text-field>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_password')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.registryPassword"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_password_tip_1')"
                    persistent-hint
                    type="password"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-100 d-flex align-center">
                  <v-textarea
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands')"
                    dense
                    auto-grow
                    rows="1"
                    style="white-space:nowrap;"
                    wrap="off"
                    row-height="12"
                    v-model="addCustomStepsForm.customStepDockerConf.dockerCommands"
                    background-color="yellow lighten-5"
                  >
                    <v-icon
                      slot="append"
                      color="blue"
                      @click="() => {varsDialog = true}"
                    >
                      mdi-help-circle
                    </v-icon>
                  </v-textarea>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_3')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_4')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_5')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_6')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_7')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_8')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_9')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_10')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_11')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_12')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_13')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="[ true, false ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_show_commands')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.dockerShowCommands"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="[ true, false ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_run_as_root')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.dockerRunAsRoot"
                  />
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_run_as_root_tip_1', hintConfig.dockerRunAsUid)}}</div>
                    </div>
                  </v-tooltip>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_work_dir')"
                    dense
                    v-model="addCustomStepsForm.customStepDockerConf.dockerWorkDir"
                    background-color="yellow lighten-5"
                  >
                    <v-icon
                      slot="append"
                      color="blue"
                      @click="() => {varsDialog = true}"
                    >
                      mdi-help-circle
                    </v-icon>
                  </v-text-field>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerVolumes('add')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in addCustomStepsForm.customStepDockerConf.dockerVolumes" :key="i" v-if="addCustomStepsForm.customStepDockerConf.dockerVolumes">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_local_path')"
                        dense
                        v-model="row[0]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_local_path_tip_1')"
                        persistent-hint
                        :rules="[v => !!v && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_docker_path')"
                        dense
                        v-model="row[1]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_docker_path_tip_1')"
                        persistent-hint
                        :rules="[v => !!v && v.slice(0,1) =='/' || $vuetify.lang.t('$vuetify.lang_form_required_must_start_with_slash')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerVolumes('add', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerEnvs('add')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_3')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_4')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_5')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_6')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_7')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_8')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_9')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_10')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_11')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_12')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_13')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in addCustomStepsForm.customStepDockerConf.dockerEnvs" :key="i" v-if="addCustomStepsForm.customStepDockerConf.dockerEnvs">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_name')"
                        dense
                        v-model="row[0]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_value')"
                        dense
                        v-model="row[1]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerEnvs('add', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerExtraHosts('add')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in addCustomStepsForm.customStepDockerConf.dockerExtraHosts" :key="i" v-if="addCustomStepsForm.customStepDockerConf.dockerExtraHosts">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_hostname')"
                        dense
                        v-model="row.hostname"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_ip')"
                        dense
                        v-model="row.ip"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerExtraHosts('add', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateCustomStepsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_custom_step')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">
                <v-icon color="primary">mdi-progress-question</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateCustomSteps()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateCustomSteps()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateCustomStepsDialog = false
            this.$refs.updateCustomStepsRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateCustomStepsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_custom_step_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_name')"
                  dense
                  disabled
                  v-model="updateCustomStepsForm.customStepName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_name_tip_1')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateCustomStepsForm.tenantCode"
                  :items="tenantCodes"
                  dense
                  clearable
                  disabled
                  small-chips
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                  persistent-hint
                >
                </v-autocomplete>
              </div>              
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ true, false ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff')"
                  dense
                  v-model="updateCustomStepsForm.isEnvDiff"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_is_env_diff_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-60 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc')"
                  dense
                  v-model="updateCustomStepsForm.customStepDesc"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_desc_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc')"
                  dense
                  v-model="updateCustomStepsForm.customStepActionDesc"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_action_desc_tip_3')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_usage')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="updateCustomStepsForm.customStepUsage"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_usage_tip_1')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="params-item">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo')}}</small>
              <v-tooltip right max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                </template>
                <div style="font-size: 12px;">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_tip_1')}}</div>
                </div>
              </v-tooltip>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="gitRepoNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_name')"
                    dense
                    v-model="updateCustomStepsForm.gitRepoName"
                    clearable
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_name_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_path')"
                    dense
                    v-model="updateCustomStepsForm.gitRepoPath"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_path_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_branch')"
                    dense
                    v-model="updateCustomStepsForm.gitRepoBranch"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_git_repo_branch_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-60 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="updateCustomStepsForm.paramInputYamlDef"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_3', hintConfig.dockerParamInputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_4')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_5')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_6')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_7')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_8')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_yaml_def_tip_9')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ 'yaml', 'json' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format')"
                  dense
                  v-model="updateCustomStepsForm.customStepDockerConf.paramInputFormat"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_2', hintConfig.dockerParamInputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_input_format_tip_4')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-60 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def')"
                  dense
                  auto-grow
                  rows="1"
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  v-model="updateCustomStepsForm.paramOutputYamlDef"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_2', hintConfig.dockerParamOutputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_4')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_5')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_6')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_7', hintConfig.dockerOutputFileDir)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_8')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_9')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_10')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_11')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_yaml_def_tip_12')}}</div>
                  </div>
                </v-tooltip>
              </div>
              <div class="form-item d-flex align-center">
                <v-autocomplete
                  :items="[ 'yaml', 'json' ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format')"
                  dense
                  v-model="updateCustomStepsForm.customStepDockerConf.paramOutputFormat"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_1', hintConfig.dockerParamOutputFileName)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_param_output_format_tip_4')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="params-item">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_docker_conf')}}</small>
              <v-tooltip right max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                </template>
                <div style="font-size: 12px;">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_custom_step_docker_conf_tip_1')}}</div>
                </div>
              </v-tooltip>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_image')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.dockerImage"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_image_tip_1', hintConfig.dockerRunAsUid)}}</div>
                    </div>
                  </v-tooltip>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_username')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.registryUsername"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_username_tip_1')"
                    persistent-hint
                  >
                  </v-text-field>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_password')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.registryPassword"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_registry_password_tip_1')"
                    persistent-hint
                    type="password"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-100 d-flex align-center">
                  <v-textarea
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands')"
                    dense
                    auto-grow
                    rows="1"
                    style="white-space:nowrap;"
                    wrap="off"
                    row-height="12"
                    v-model="updateCustomStepsForm.customStepDockerConf.dockerCommands"
                    background-color="yellow lighten-5"
                  >
                    <v-icon
                      slot="append"
                      color="blue"
                      @click="() => {varsDialog = true}"
                    >
                      mdi-help-circle
                    </v-icon>
                  </v-textarea>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_3')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_4')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_5')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_6')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_7')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_8')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_9')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_10')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_11')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_12')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_13')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="[ true, false ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_show_commands')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.dockerShowCommands"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :items="[ true, false ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_run_as_root')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.dockerRunAsRoot"
                  />
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_run_as_root_tip_1', hintConfig.dockerRunAsUid)}}</div>
                    </div>
                  </v-tooltip>
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_work_dir')"
                    dense
                    v-model="updateCustomStepsForm.customStepDockerConf.dockerWorkDir"
                    background-color="yellow lighten-5"
                  >
                    <v-icon
                      slot="append"
                      color="blue"
                      @click="() => {varsDialog = true}"
                    >
                      mdi-help-circle
                    </v-icon>
                  </v-text-field>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerVolumes('update')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in updateCustomStepsForm.customStepDockerConf.dockerVolumes" :key="i" v-if="updateCustomStepsForm.customStepDockerConf.dockerVolumes">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_local_path')"
                        dense
                        v-model="row[0]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_local_path_tip_1')"
                        persistent-hint
                        :rules="[v => !!v && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_must_start_with_slash')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_docker_path')"
                        dense
                        v-model="row[1]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_volumes_docker_path_tip_1')"
                        persistent-hint
                        :rules="[v => !!v && v.slice(0,1) =='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerVolumes('update', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerEnvs('update')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_3')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_4')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_5')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_6')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_7')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_8')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_9')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_10')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_11')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_12')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_commands_tip_13')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_pipeline_variables_tip_2')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in updateCustomStepsForm.customStepDockerConf.dockerEnvs" :key="i" v-if="updateCustomStepsForm.customStepDockerConf.dockerEnvs">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_name')"
                        dense
                        v-model="row[0]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_envs_value')"
                        dense
                        v-model="row[1]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerEnvs('update', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts')}}</small>
                  <v-icon color="success" class="ml-4" @click="addDockerExtraHosts('update')">mdi-table-plus</v-icon>
                  <v-tooltip right max-width="350px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="env-item d-flex justify-space-between" v-for="(row, i) in updateCustomStepsForm.customStepDockerConf.dockerExtraHosts" :key="i" v-if="updateCustomStepsForm.customStepDockerConf.dockerExtraHosts">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_hostname')"
                        dense
                        v-model="row.hostname"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-text-field>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_conf_docker_extra_hosts_ip')"
                        dense
                        v-model="row.ip"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-text-field>
                    </div>
                    <div>
                      <v-icon color="error" class="mt-4" @click="deleteDockerExtraHosts('update', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="YAMLDialog"
      max-width="1200px"
      persistent
      eager
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</span>
        </v-card-title>
        <v-card-text>
          <Monaco
            ref="monaco"
            :monacoOptions="singleMonacoOptions"
            :height="500"
          ></Monaco>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeYaml()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteCustomStepsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_custom_step', targetCustomStep)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteCustomStepsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_custom_step_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_custom_step_custom_step_name')"
                    required
                    dense
                    v-model="deleteCustomStepName"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_custom_step_custom_step_name_tip_1', targetCustomStep)"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.deleteCustomStepsDialog = false
              this.$refs.deleteCustomStepsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteCustomSteps()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageCard>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import Operations from '@/lib/ui-lib/components/Operations';
import request from '@/utils/request';
import YAML from "yamljs";
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'CustomStepConfs',
  components: {
    PageCard,
    Operations,
    Monaco
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  data () {
    return {
      userObj: {},
      pageRequest: {
        tenantCodes: [],
        customStepNames: [],
        page: 1,
        perPage: 10
      },
      customStepNames: [],
      tenantCodes: [],
      addCustomStepsDialog: false,
      addCustomStepsForm: {
        customStepName: '',
        tenantCode: '',
        customStepActionDesc: '',
        customStepDesc: '',
        customStepUsage: '',
        gitRepoName: '',
        gitRepoPath: '',
        gitRepoBranch: '',
        isEnvDiff: false,
        customStepDockerConf: {
          dockerImage: '',
          registryUsername: '',
          registryPassword: '',
          dockerCommands: '',
          dockerShowCommands: false,
          dockerRunAsRoot: false,
          dockerVolumes: [],
          dockerEnvs: [],
          dockerExtraHosts: [],
          dockerWorkDir: '',
          paramInputFormat: '',
          paramOutputFormat: ''
        },
        paramInputYamlDef: '',
        paramOutputYamlDef: '',
      },
      updateCustomStepsForm: {
        customStepName: '',
        tenantCode: '',
        customStepActionDesc: '',
        customStepDesc: '',
        customStepUsage: '',
        gitRepoName: '',
        gitRepoPath: '',
        gitRepoBranch: '',
        isEnvDiff: false,
        customStepDockerConf: {
          dockerImage: '',
          registryUsername: '',
          registryPassword: '',
          dockerCommands: '',
          dockerShowCommands: false,
          dockerRunAsRoot: false,
          dockerVolumes: [],
          dockerEnvs: [],
          dockerExtraHosts: [],
          dockerWorkDir: '',
          paramInputFormat: '',
          paramOutputFormat: ''
        },
        paramInputYamlDef: '',
        paramOutputYamlDef: '',
      },
      updateCustomStepsDialog: false,
      YAMLDialog: false,
      yamlText: "",
      pageData: {
        customStepConfs: [],
        totalCount: 0
      },
      tableLoading: false,
      targetCustomStep: '',
      deleteCustomStepsDialog: false,
      deleteCustomStepName: '',
      vars: '',
      varsDialog: false,
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
      markdownMonacoOptions: {
        value: '',
        automaticLayout: true,
        readOnly: true,
        theme: "vs-dark",
        language: "markdown"
      },
      hintConfig: {},
      gitRepoNames: [],
    }
  },
  created () {
    const vm = this
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    vm.getList(false)
    request.get('/cicd/customStepConf/vars').then(response => {
      vm.vars = response.data.content
      vm.markdownMonacoOptions.value = vm.vars
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/public/about').then(response => {
      vm.hintConfig = response.data.config
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/admin/tenantCodes').then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/repoNames').then(response => {
      vm.gitRepoNames = response.data.gitRepoNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    getList(tipFlag) {
      const vm = this
      vm.tableLoading = true
      request.post('/admin/customStepConfs', vm.pageRequest).then(response => {
        vm.pageData.customStepConfs = response.data.customStepConfs
        vm.pageData.customStepConfs.forEach(item => {
          item.customStepDockerConf.dockerCommands = vm.formateText(item.customStepDockerConf.dockerCommands)
          // item.customStepDockerConf.dockerVolumes = vm.formateText(item.customStepDockerConf.dockerVolumes)
          if (item.customStepDockerConf.dockerVolumes !== null) {
            item.customStepDockerConf.dockerVolumes.forEach((row, rowIndex) => {
              row = row.split(":");
              item.customStepDockerConf.dockerVolumes[rowIndex] = row;
            });
          }
          if (item.customStepDockerConf.dockerEnvs !== null) {
            item.customStepDockerConf.dockerEnvs.forEach((row, rowIndex) => {
              row = row.split("=");
              item.customStepDockerConf.dockerEnvs[rowIndex] = row;
            });
          }
          // item.customStepDockerConf.dockerEnvs = vm.formateText(item.customStepDockerConf.dockerEnvs)
        })
        vm.pageData.totalCount = response.data.totalCount
        vm.customStepNames = response.data.customStepNames
        vm.tableLoading = false
        if(tipFlag){
          vm.successTip(true,response.msg)
        }
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    formateText(value) {
      if (typeof value === "object" && value !== null) {
        return value.join(";").replaceAll(";", "\n");
      } else if (typeof value === "string") {
        var newValue = value.replaceAll("\n", ";").split(";");
        newValue.forEach((item, index) => {
          if (!item) {
            newValue.splice(index, 1);
          }
        });
        return newValue;
      } else {
        return value;
      }
    },
    closeYaml() {
      const vm = this;
      vm.$refs.monaco.monacoEditor.setValue('')
      vm.YAMLDialog = false;
    },
    changeOptions(data) {
      const vm = this
      vm.pageRequest.page = data.page
      vm.pageRequest.perPage = data.itemsPerPage
      vm.getList(false)
    },
    openAddCustomSteps() {
      const vm = this
      vm.addCustomStepsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addCustomStepsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addDockerVolumes(mode) {
      const vm = this;
      let addItem = ["", ""];
      if (mode === 'add') {
        if (vm.addCustomStepsForm.customStepDockerConf.dockerVolumes === null) {
          vm.addCustomStepsForm.customStepDockerConf.dockerVolumes = [];
          vm.addCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
        } else {
          vm.addCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
        }
      } else if (mode === 'update') {
        if (vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes === null) {
          vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes = [];
          vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
        } else {
          vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
        }
      }
    },
    deleteDockerVolumes(mode, j) {
      const vm = this;
      if (mode === 'add') {
        vm.addCustomStepsForm.customStepDockerConf.dockerVolumes.splice(j, 1);
      } else if (mode === 'update') {
        vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.splice(j, 1);
      }
    },
    addDockerEnvs(mode) {
      const vm = this;
      let addItem = ["", ""];
      if (mode === 'add') {
        if (vm.addCustomStepsForm.customStepDockerConf.dockerEnvs === null) {
          vm.addCustomStepsForm.customStepDockerConf.dockerEnvs = [];
          vm.addCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
        } else {
          vm.addCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
        }
      } else if (mode === 'update') {
        if (vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs === null) {
          vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs = [];
          vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
        } else {
          vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
        }
      }
    },
    deleteDockerEnvs(mode, j) {
      const vm = this;
      if (mode === 'add') {
        vm.addCustomStepsForm.customStepDockerConf.dockerEnvs.splice(j, 1);
      } else if (mode === 'update') {
        vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.splice(j, 1);
      }
    },
    addDockerExtraHosts(mode) {
      const vm = this;
      let addItem = {"hostname": "", "ip": ""}
      if (mode === 'add') {
        if (vm.addCustomStepsForm.customStepDockerConf.dockerExtraHosts === null) {
        vm.addCustomStepsForm.customStepDockerConf.dockerExtraHosts = [];
        vm.addCustomStepsForm.customStepDockerConf.dockerExtraHosts.push(addItem);
        } else {
        vm.addCustomStepsForm.customStepDockerConf.dockerExtraHosts.push(addItem);
        }
      } else if (mode === 'update') {
        if (vm.updateCustomStepsForm.customStepDockerConf.dockerExtraHosts === null) {
        vm.updateCustomStepsForm.customStepDockerConf.dockerExtraHosts = [];
        vm.updateCustomStepsForm.customStepDockerConf.dockerExtraHosts.push(addItem);
        } else {
        vm.updateCustomStepsForm.customStepDockerConf.dockerExtraHosts.push(addItem);
        }
      }
    },
    deleteDockerExtraHosts(mode, j) {
      const vm = this;
      if (mode === 'add') {
        vm.addCustomStepsForm.customStepDockerConf.dockerExtraHosts.splice(j, 1);
      } else if (mode === 'update') {
        vm.updateCustomStepsForm.customStepDockerConf.dockerExtraHosts.splice(j, 1);
      }
    },
    previewAddCustomSteps() {
      const vm = this
      if(vm.$refs.addCustomStepsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addCustomStepsForm))
        if (copyData.customStepDockerConf.dockerVolumes !== null && copyData.customStepDockerConf.dockerVolumes.length > 0) {
          copyData.customStepDockerConf.dockerVolumes.map((row, rowIndex) => {
            row = row.join(":");
            copyData.customStepDockerConf.dockerVolumes[rowIndex] = row;
          });
        }
        if (copyData.customStepDockerConf.dockerEnvs !== null && copyData.customStepDockerConf.dockerEnvs.length > 0) {
          copyData.customStepDockerConf.dockerEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.customStepDockerConf.dockerEnvs[rowIndex] = row;
          });
        }
        copyData.customStepDockerConf.dockerCommands = vm.formateText(copyData.customStepDockerConf.dockerCommands)
        // copyData.customStepDockerConf.dockerVolumes = vm.formateText(copyData.customStepDockerConf.dockerVolumes)
        // copyData.customStepDockerConf.dockerEnvs = vm.formateText(copyData.customStepDockerConf.dockerEnvs)
        vm.sortData(copyData)
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    addCustomSteps() {
      const vm = this
      if(vm.$refs.addCustomStepsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addCustomStepsForm))
        if (copyData.customStepDockerConf.dockerVolumes !== null && copyData.customStepDockerConf.dockerVolumes.length > 0) {
          copyData.customStepDockerConf.dockerVolumes.map((row, rowIndex) => {
            row = row.join(":");
            copyData.customStepDockerConf.dockerVolumes[rowIndex] = row;
          });
        }
        if (copyData.customStepDockerConf.dockerEnvs !== null && copyData.customStepDockerConf.dockerEnvs.length > 0) {
          copyData.customStepDockerConf.dockerEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.customStepDockerConf.dockerEnvs[rowIndex] = row;
          });
        }
        copyData.customStepDockerConf.dockerCommands = vm.formateText(copyData.customStepDockerConf.dockerCommands)
        // copyData.customStepDockerConf.dockerVolumes = vm.formateText(copyData.customStepDockerConf.dockerVolumes)
        // copyData.customStepDockerConf.dockerEnvs = vm.formateText(copyData.customStepDockerConf.dockerEnvs)
        vm.sortData(copyData)
        let customStepConfYaml = YAML.stringify(copyData, 4)
        request.post('/admin/customStepConf', {
          customStepConfYaml: customStepConfYaml
        }).then(response => {
          vm.successTip(true,response.msg)
          vm.addCustomStepsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCopyCustomSteps(customStep) {
      const vm = this
      vm.addCustomStepsDialog = true
      vm.addCustomStepsForm = { ... customStep }
      if (!vm.userObj.isAdmin) {
        vm.addCustomStepsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    openUpdateCustomSteps(customStepConf) {
      const vm = this
      vm.updateCustomStepsForm = JSON.parse(JSON.stringify(customStepConf))
      vm.updateCustomStepsDialog = true
    },
    addUpdateDockerVolumes() {
      const vm = this;
      let addItem = ["", ""];
      if (vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes === null) {
        vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes = [];
        vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
      } else {
        vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.push(addItem);
      }
    },
    deleteUpdateDockerVolumes(j) {
      const vm = this;
      vm.updateCustomStepsForm.customStepDockerConf.dockerVolumes.splice(j, 1);
    },
    addUpdateDockerEnvs() {
      const vm = this;
      let addItem = ["", ""];
      if (vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs === null) {
        vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs = [];
        vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
      } else {
        vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.push(addItem);
      }
    },
    deleteUpdateDockerEnvs(j) {
      const vm = this;
      vm.updateCustomStepsForm.customStepDockerConf.dockerEnvs.splice(j, 1);
    },
    previewUpdateCustomSteps() {
      const vm = this
      if(vm.$refs.updateCustomStepsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateCustomStepsForm))
        if (copyData.customStepDockerConf.dockerVolumes !== null && copyData.customStepDockerConf.dockerVolumes.length > 0) {
          copyData.customStepDockerConf.dockerVolumes.map((row, rowIndex) => {
            row = row.join(":");
            copyData.customStepDockerConf.dockerVolumes[rowIndex] = row;
          });
        }
        if (copyData.customStepDockerConf.dockerEnvs !== null && copyData.customStepDockerConf.dockerEnvs.length > 0) {
          copyData.customStepDockerConf.dockerEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.customStepDockerConf.dockerEnvs[rowIndex] = row;
          });
        }
        copyData.customStepDockerConf.dockerCommands = vm.formateText(copyData.customStepDockerConf.dockerCommands)
        // copyData.customStepDockerConf.dockerVolumes = vm.formateText(copyData.customStepDockerConf.dockerVolumes)
        // copyData.customStepDockerConf.dockerEnvs = vm.formateText(copyData.customStepDockerConf.dockerEnvs)
        vm.sortData(copyData)
        delete copyData.customStepID
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateCustomSteps() {
      const vm = this
      if(vm.$refs.updateCustomStepsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateCustomStepsForm))
        if (copyData.customStepDockerConf.dockerVolumes !== null && copyData.customStepDockerConf.dockerVolumes.length > 0) {
          copyData.customStepDockerConf.dockerVolumes.map((row, rowIndex) => {
            row = row.join(":");
            copyData.customStepDockerConf.dockerVolumes[rowIndex] = row;
          });
        }
        if (copyData.customStepDockerConf.dockerEnvs !== null && copyData.customStepDockerConf.dockerEnvs.length > 0) {
          copyData.customStepDockerConf.dockerEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.customStepDockerConf.dockerEnvs[rowIndex] = row;
          });
        }
        copyData.customStepDockerConf.dockerCommands = vm.formateText(copyData.customStepDockerConf.dockerCommands)
        // copyData.customStepDockerConf.dockerVolumes = vm.formateText(copyData.customStepDockerConf.dockerVolumes)
        // copyData.customStepDockerConf.dockerEnvs = vm.formateText(copyData.customStepDockerConf.dockerEnvs)
        delete copyData.customStepID
        vm.sortData(copyData)
        let customStepConfYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/customStepConf/${copyData.customStepName}`, {
          customStepConfYaml: customStepConfYaml
        }).then(response => {
          vm.successTip(true,response.msg)
          vm.updateCustomStepsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteCustomSteps(customStepName) {
      const vm = this
      vm.targetCustomStep = customStepName
      vm.deleteCustomStepsDialog = true
    },
    deleteCustomSteps() {
      const vm = this
      if(vm.$refs.deleteCustomStepsRef.validate && vm.targetCustomStep === vm.deleteCustomStepName){
        request.delete(`/admin/customStepConf/${vm.targetCustomStep}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteCustomStepsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetCustomStep))
      }
    },
    sortData(data) {
      Object.keys(data).forEach(item => {
        if(data[item] !== null){
          if(data[item] instanceof Array && data[item].length <= 0){
            delete data[item]
          }else if(data[item] instanceof Object && JSON.stringify(data[item]) == "{}"){
            delete data[item]
          }else if( typeof data[item] === 'number' && data[item] === 0){
            delete data[item]
          }else if(data[item] === ''){
            delete data[item]
          }else if(data[item] === false){
            delete data[item]
          }
        }else{
          delete data[item]
        }
      })
    }
  },
  computed: {
    pageHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_custom_step_name'), value: 'customStepName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_custom_step_desc'), value: 'customStepDesc', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_custom_step_is_env_diff'), value: 'isEnvDiff', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
  }
}
</script>

<style lang="scss" scoped>
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
