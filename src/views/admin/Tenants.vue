<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_tenants')">
    <v-card>
      <v-card-title>
        <v-form>
          <v-container class="d-flex flex-wrap" fluid>
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
            <v-btn color="primary" @click="openAddTenants()">{{ $vuetify.lang.t('$vuetify.lang_menu_new_tenant') }}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pageHeaders"
          :items="pageData.tenants"
          :page="pageRequest.page"
          :items-per-page="pageRequest.perPage"
          :server-items-length="pageData.totalCount"
          item-key="tenantCode"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.projectNames="{item}">
            <div class="mt-1" v-for="(projectName, i) in item.projectNames" :key="i"><v-chip outlined small color="primary" :to="{name: 'AdminProject', params: {projectName: projectName || ''}}">{{projectName}}</v-chip></div>
          </template>
          <template v-slot:item.handle="{item}">
            <Operations
                :operations="[
                  {
                    key: 'update',
                    text: $vuetify.lang.t('$vuetify.lang_menu_update_tenant'),
                    onClick: () => {
                      openUpdateTenants(item)
                    }
                  },
                  {
                    key: 'copy',
                    text: $vuetify.lang.t('$vuetify.lang_menu_copy_tenant'),
                    onClick: () => {
                      openCopyTenants(item)
                    }
                  },
                  {
                    key: 'delete',
                    text: $vuetify.lang.t('$vuetify.lang_menu_delete_tenant'),
                    onClick: () => {
                      openDeleteTenants(item.tenantCode)
                    }
                  },
                ]"
              ></Operations>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="addTenantsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_tenant')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addTenants()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addTenantsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addTenantsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_tenant_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_tenant_code')"
                  dense
                  v-model="addTenantsForm.tenantCode"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_tenant_code_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_mesh_available')"
                  v-model="addTenantsForm.meshAvailable"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_mesh_available_tip_1')"
                  persistent-hint
                ></v-autocomplete>
              </div>
            </div>
            <div class="params-item">
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_project_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.projectNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_project_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_build_def_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.buildDefNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_build_def_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_env_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.envNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_env_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_env_default_enable')"
                    v-model="addTenantsForm.envDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_env_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_custom_step_default_enable')"
                    v-model="addTenantsForm.customStepDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_custom_step_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_component_template_default_enable')"
                    v-model="addTenantsForm.componentTemplateDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_component_template_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
            </div>
            <div class="params-item">
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.gitRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.imageRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.artifactRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_number')"
                    dense
                    type="number"
                    v-model.number="addTenantsForm.scanCodeRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_default_enable')"
                    v-model="addTenantsForm.gitRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_default_enable')"
                    v-model="addTenantsForm.imageRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_default_enable')"
                    v-model="addTenantsForm.artifactRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_default_enable')"
                    v-model="addTenantsForm.scanCodeRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days')"
                  dense
                  type="number"
                  v-model.number="addTenantsForm.expiresDays"
                  :rules="[intRuleZero]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_is_active')"
                  v-model="addTenantsForm.isActive"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_is_active_tip_1')"
                  persistent-hint
                ></v-autocomplete>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateTenantsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_tenant', updateTenantsForm.tenantCode)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateTenants()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateTenantsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateTenantsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_tenant_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_tenant_code')"
                  dense
                  disabled
                  v-model="updateTenantsForm.tenantCode"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_tenant_code_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_mesh_available')"
                  v-model="updateTenantsForm.meshAvailable"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_mesh_available_tip_1')"
                  persistent-hint
                ></v-autocomplete>
              </div>
            </div>
            <div class="params-item">
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_project_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.projectNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_project_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_build_def_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.buildDefNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_build_def_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_env_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.envNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_env_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_env_default_enable')"
                    v-model="updateTenantsForm.envDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_env_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_custom_step_default_enable')"
                    v-model="updateTenantsForm.customStepDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_custom_step_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_component_template_default_enable')"
                    v-model="updateTenantsForm.componentTemplateDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_component_template_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
            </div>
            <div class="params-item">
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.gitRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.imageRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.artifactRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_number')"
                    dense
                    type="number"
                    v-model.number="updateTenantsForm.scanCodeRepoNumber"
                    :rules="[intRuleZero]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_number_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_default_enable')"
                    v-model="updateTenantsForm.gitRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_git_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_default_enable')"
                    v-model="updateTenantsForm.imageRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_image_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_default_enable')"
                    v-model="updateTenantsForm.artifactRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_artifact_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_default_enable')"
                    v-model="updateTenantsForm.scanCodeRepoDefaultEnable"
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                      {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                    ]"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_scan_code_repo_default_enable_tip_1')"
                    persistent-hint
                  ></v-autocomplete>
                </div>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days')"
                  dense
                  type="number"
                  v-model.number="updateTenantsForm.expiresDays"
                  :rules="[intRuleMinusOne]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_3'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_tenant_expires_days_tip_3')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_is_active')"
                  v-model="updateTenantsForm.isActive"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_is_active_tip_1')"
                  persistent-hint
                ></v-autocomplete>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteTenantsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_tenant', targetTenantCode)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteTenantsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_tenant_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_tenant_code')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_tenant_code_tip_1', targetTenantCode)"
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
              this.deleteTenantsDialog = false
              this.$refs.deleteTenantsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteTenants()"
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
  name: 'Tenants',
  components: {
    PageCard,
    Operations,
    Monaco
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  data () {
    return {
      intRule: v => {
        if (v === '') {
          return vuetify.preset.lang.t('$vuetify.lang_form_required')
        } else {
          if (isNaN(parseInt(v))) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v.toString().includes('.')) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v < 1) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_greater_than_0')
          }
          return true
        }
      },
      intRuleZero: v => {
        if (v === '') {
          return vuetify.preset.lang.t('$vuetify.lang_form_required')
        } else {
          if (isNaN(parseInt(v))) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v.toString().includes('.')) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v < 0) {
            return vuetify.preset.lang.t('$vuetify.lang_form_can_not_less_than_0')
          }
          return true
        }
      },
      intRuleMinusOne: v => {
        if (v === '') {
          return vuetify.preset.lang.t('$vuetify.lang_form_required')
        } else {
          if (isNaN(parseInt(v))) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v.toString().includes('.')) {
            return vuetify.preset.lang.t('$vuetify.lang_form_must_be_integer')
          } else if (v < -1) {
            return vuetify.preset.lang.t('$vuetify.lang_form_can_not_less_than__1')
          }
          return true
        }
      },
      confirmValue: '',
      pageRequest: {
        tenantCodes: [],
        page: 1,
        perPage: 10
      },
      tenantCodes: [],
      addTenantsDialog: false,
      addTenantsForm: {
        tenantCode: '',
        meshAvailable: true,
        projectNumber: 0,
        buildDefNumber: 0,
        envNumber: 0,
        gitRepoNumber: 0,
        imageRepoNumber: 0,
        artifactRepoNumber: 0,
        scanCodeRepoNumber: 0,
        envDefaultEnable: true,
        gitRepoDefaultEnable: true,
        imageRepoDefaultEnable: true,
        artifactRepoDefaultEnable: true,
        scanCodeRepoDefaultEnable: true,
        customStepDefaultEnable: true,
        componentTemplateDefaultEnable: true,
        expiresDays: 0,
        isActive: true,
      },
      updateTenantsForm: {
        tenantCode: '',
        meshAvailable: false,
        projectNumber: 0,
        buildDefNumber: 0,
        envNumber: 0,
        gitRepoNumber: 0,
        imageRepoNumber: 0,
        artifactRepoNumber: 0,
        scanCodeRepoNumber: 0,
        envDefaultEnable: false,
        gitRepoDefaultEnable: false,
        imageRepoDefaultEnable: false,
        artifactRepoDefaultEnable: false,
        scanCodeRepoDefaultEnable: false,
        customStepDefaultEnable: false,
        componentTemplateDefaultEnable: false,
        expiresDays: 0,
        isActive: true,
      },
      updateTenantsDialog: false,
      pageData: {
        tenants: [],
        totalCount: 0
      },
      tableLoading: false,
      targetTenantCode: '',
      deleteTenantsDialog: false,
    }
  },
  created () {
    const vm = this
    vm.getList(false)
    request.get('/admin/tenantCodes').then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    getList(tipFlag) {
      const vm = this
      vm.tableLoading = true
      request.post('/admin/tenants', vm.pageRequest).then(response => {
        vm.pageData.tenants = response.data.tenants
        vm.pageData.totalCount = response.data.totalCount
        vm.tableLoading = false
        if(tipFlag){
          vm.successTip(true,response.msg)
        }
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    changeOptions(data) {
      const vm = this
      vm.pageRequest.page = data.page
      vm.pageRequest.perPage = data.itemsPerPage
      vm.getList(false)
    },
    openAddTenants() {
      const vm = this
      vm.addTenantsDialog = true
    },
    addTenants() {
      const vm = this
      if(vm.$refs.addTenantsRef.validate()){
        request.post('/admin/tenant', vm.addTenantsForm).then(response => {
          vm.successTip(true,response.msg)
          vm.addTenantsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCopyTenants(tenant) {
      const vm = this
      vm.addTenantsForm = { ...tenant }
      vm.addTenantsForm.expiresDays = 0
      vm.addTenantsDialog = true
    },
    openUpdateTenants(tenant) {
      const vm = this
      vm.updateTenantsForm = tenant
      vm.updateTenantsForm.expiresDays = -1
      vm.updateTenantsDialog = true
    },
    updateTenants() {
      const vm = this
      if(vm.$refs.updateTenantsRef.validate()){
        request.post(`/admin/tenant/${vm.updateTenantsForm.tenantCode}`, vm.updateTenantsForm).then(response => {
          vm.successTip(true,response.msg)
          vm.updateTenantsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteTenants(tenantCode) {
      const vm = this
      vm.confirmValue = ''
      vm.targetTenantCode = tenantCode
      vm.deleteTenantsDialog = true
    },
    deleteTenants() {
      const vm = this
      if(vm.$refs.deleteTenantsRef.validate && vm.targetTenantCode === vm.confirmValue){
        request.delete(`/admin/tenant/${vm.targetTenantCode}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteTenantsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetTenantCode))
      }
    },
  },
  computed: {
    pageHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_active'), value: 'isActive', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_expire_time'), value: 'expiresTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_create_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_projects'), value: 'projectNames', sortable: false },
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
