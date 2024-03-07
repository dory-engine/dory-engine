<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_component_templates_management')">
    <v-card>
      <v-card-title>
        <v-form style="width: 100%">
          <v-container class="d-flex flex-wrap" fluid>
            <v-select
              :items="tenantCodes"
              :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="componentsForm.tenantCodes"
              @change="refreshList()"
            ></v-select>
            <v-btn color="primary" style="margin-left: auto" @click="openAddComponent('add')">{{ $vuetify.lang.t('$vuetify.lang_menu_new_component_template') }}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="componentsHeaders"
          :items="componentsData.componentTemplates"
          :page="componentsForm.page"
          :items-per-page="componentsForm.perPage"
          :server-items-length="componentsData.totalCount"
          item-key="componentTemplateName"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.componentTemplateYaml="{ item }">
            <v-btn small color="primary" @click="detailHandle(item.deploySpecStatic)">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
          </template>
          <template v-slot:item.handle="{ item }">
            <Operations
              :operations="[
                { text: $vuetify.lang.t('$vuetify.lang_menu_update_component_template'), onClick: () => {openUpdateComponent(item)} },
                { text: $vuetify.lang.t('$vuetify.lang_menu_delete_component_template'), onClick: () => {openDeleteComponent(item)} }
              ]"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="yamlDialog"
      max-width="800px"
      persistent
      eager
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</span>
        </v-card-title>
        <v-card-text>
          <Monaco
            ref="monaco2"
            :monacoOptions="singleMonacoOptions"
            :height="500"
          ></Monaco>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.yamlDialog = false
              this.$refs.monaco2.monacoEditor.setValue('')
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addComponentDialog"
      max-width="1100px"
      persistent
    >
      <v-card :loading="defaultLoading">
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_form_new_component_template') }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-4 yaml-btn" small v-bind="attrs" v-on="on">
                <v-icon color="primary" @click="previewComponent()">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="addComponent()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addComponentDialog = false
            this.$refs.addComponentRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addComponentRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_component_template_prompt')}}</small>
            </v-alert>
            <div class="d-flex justify-space-between mt-4">
              <div class="form-item">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_component_template_component_name')"
                  required
                  dense
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  v-model="addComponentForm.componentTemplateName"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_component_template_component_name_tip_1')"
                  persistent-hint
                ></v-text-field>
              </div>
              <div class="form-item">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_component_template_component_desc')"
                  required
                  dense
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  v-model="addComponentForm.componentTemplateDesc"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_component_template_component_desc_tip_1')"
                  persistent-hint
                ></v-text-field>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addComponentForm.tenantCode"
                  :items="tenantCodes"
                  :required="userObj.isTenantAdmin && !userObj.isAdmin"
                  :clearable="userObj.isAdmin"
                  dense
                  small-chips
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                  persistent-hint
                >
                </v-select>
              </div>
            </div>
            <div class="d-flex justify-space-between mt-4">
              <div class="form-item-30">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image')"
                  dense
                  v-model="addComponentForm.deploySpecStatic.deployImage"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_tip_1')"
                  persistent-hint
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-30">
                <v-select
                  :items="['deployment', 'statefulset']"
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type')"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type_tip_1')"
                  persistent-hint
                  v-model="addComponentForm.deploySpecStatic.deployType"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                >
                </v-select>
              </div>
              <div class="form-item-30">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_replicas')"
                  dense
                  type="number"
                  v-model.number="addComponentForm.deploySpecStatic.deployReplicas"
                  :rules="[intRule]"
                >
                </v-text-field>
              </div>
            </div>
            <div class="form-row mt-4">
              <div class="form-item-50">
                <v-spacer></v-spacer>
                <v-select
                  :items="componentOpts"
                  dense
                  :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                  @change="chooseParams($event)"
                ></v-select>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployResources.cpuLimit !== '' ||
                addComponentForm.deploySpecStatic.deployResources.cpuRequest !== '' ||
                addComponentForm.deploySpecStatic.deployResources.memoryLimit !== '' ||
                addComponentForm.deploySpecStatic.deployResources.memoryRequest !== ''
                " :id="'deployResources-add'"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" class="ml-4" @click="clearParams('deployResources')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.deployResources">
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.memoryRequest"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.memoryLimit"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.cpuRequest"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.cpuLimit"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployCommand !== '' ||
                addComponentForm.deploySpecStatic.deployEnvs !== null ||
                addComponentForm.deploySpecStatic.deployArgs !== null ||
                addComponentForm.deploySpecStatic.workingDir !== '' ||
                addComponentForm.deploySpecStatic.terminationGracePeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.subdomain !== '' ||
                addComponentForm.deploySpecStatic.enableDownwardApi ||
                addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHeadless !== false ||
                addComponentForm.deploySpecStatic.podManagementPolicy !== ''
                " :id="'deployOther-add'"
              >
                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other')}} <v-icon color="error" class="ml-4" @click="clearParams('deployOther')">mdi-minus-circle-outline</v-icon></div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployCommand"
                      />
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="addComponentForm.deploySpecStatic.deployArgs"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args_tip_1')"
                        persistent-hint
                        append-icon=""
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployEnvs()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployEnvs" :key="i" v-if="addComponentForm.deploySpecStatic.deployEnvs">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_name')"
                            dense
                            v-model="row[0]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_value')"
                            dense
                            v-model="row[1]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployEnvs(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_tip_1')}}</small></div>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.workingDir"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.terminationGracePeriodSeconds"
                        :rules="[intRuleZero]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds"
                        :rules="[intRuleZero]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.subdomain"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2')}}</div>
                        </template>
                      </v-text-field>
                    </div>
                    <div class="form-item-40 d-flex align-center">
                      <v-select
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.enableDownwardApi"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3')}}</div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployType === 'statefulset'">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-select
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployHeadless"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-select
                        :items="['OrderedReady', 'Parallel']"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.podManagementPolicy"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3')}}</div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployMeta.labels !== null ||
                addComponentForm.deploySpecStatic.deployMeta.annotations !== null
                " :id="'deployMeta-add'"
              >
                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta')}} <v-icon color="error" class="ml-4" @click="clearParams('deployMeta')">mdi-minus-circle-outline</v-icon></div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels')}}</small>
                    <v-icon color="success" class="ml-4" @click="addDeployMetaLabels()">mdi-table-plus</v-icon>
                    <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.labels" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.labels">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <v-icon color="error" class="mt-4" @click="deleteDeployMetaLabels(i)">mdi-trash-can-outline</v-icon>
                    </div>
                    <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_tip_1')}}</small></div>
                  </div>
                  <div class="form-item-50">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations')}}</small>
                    <v-icon color="success" class="ml-4" @click="addDeployMetaAnnotations()">mdi-table-plus</v-icon>
                    <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.annotations" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.annotations">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <v-icon color="error" class="mt-4" @click="deleteDeployMetaAnnotations(i)">mdi-trash-can-outline</v-icon>
                    </div>
                    <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_tip_1')}}</small></div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" :id="'deployLocalPorts-add'" v-if="addComponentForm.deploySpecStatic.deployLocalPorts !== null">
                <div class="form-item-100" :id="'deployLocalPorts-'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="mx-4" @click="addDeployLocalPort()">mdi-table-plus</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployLocalPorts">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_port')"
                        dense
                        type="number"
                        v-model.number="row.port"
                        :rules="[intRule]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-select
                        :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_protocol')"
                        dense
                        v-model="row.protocol"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployLocalPort(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployLocalPort(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployVolumes !== null" :id="'deployVolumes-add'">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addDeployVolumes()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('deployVolumes')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployVolumes">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pod')"
                      dense
                      v-model="row.pathInPod"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pv')"
                      dense
                      v-model="row.pathInPv"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyDeployVolumes(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteDeployVolumes(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders !== null
                " :id="'deployHealthCheck-add'"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('deployHealthCheck')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between">
                  <div class="form-item-100">
                    <div class="form-item-50 d-flex">
                      <v-select
                        :items="[
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port'), value: 'checkPort'},
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec'), value: 'exec'},
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get'), value: 'httpGet'},
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_select_method')"
                        @change="healthCheckChange($event)"
                        :value="healthCheckInit()"
                      ></v-select>
                    </div>
                    <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort"
                        :rules="[intRule]"
                        type="number"
                      />
                    </div>
                    <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.exec !== ''">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployHealthCheck.exec"
                        :rules="[intRule]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec_tip_1')"
                        persistent-hint
                      >
                      </v-text-field>
                    </div>
                    <div v-if="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get')}}</small>
                      <div class="d-flex justify-space-between mt-4">
                        <div class="form-item-40">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_port')"
                            dense
                            v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port"
                            :rules="[intRule]"
                            type="number"
                          />
                        </div>
                        <div class="form-item-40">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_path')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path"
                          />
                        </div>
                        <div class="form-item-40">
                          <v-select
                            :items="['HTTP', 'HTTPS']"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_scheme')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme"
                          />
                        </div>
                      </div>
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers')}}</small>
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_2')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addHealthCheckHttpHeaders()">mdi-table-plus</v-icon>
                      <div v-for="(row, i) in addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders" :key="i">
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_name')"
                              dense
                              v-model="row.name"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_value')"
                              dense
                              v-model="row.value"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <v-icon color="success" class="mr-4" @click="copyHealthCheckHttpHeaders(i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteHealthCheckHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders !== null ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders !== null
                " :id="'lifecycle-add'"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('lifecycle')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="form-item-100 params-item">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-select
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_select_method')"
                          @change="lifecyclePostStartChange($event)"
                          :value="lifecyclePostStartInit()"
                        ></v-select>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-select
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addLifecyclePostStartHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyLifecyclePostStartHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteLifecyclePostStartHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-select
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_select_method')"
                          @change="lifecyclePreStopChange($event)"
                          :value="lifecyclePreStopInit()"
                        ></v-select>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-select
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addLifecyclePreStopHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyLifecyclePreStopHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteLifecyclePreStopHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.maxReplicas !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue !== '' ||
                addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue !== ''
                " :id="'hpaConfig-add'">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config')}}
                  <v-tooltip right max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_3')}}</div>
                    </div>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('hpaConfig')">mdi-minus-circle-outline</v-icon>
                </div>
                <div v-if="addComponentForm.deploySpecStatic.hpaConfig">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-100">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_max_replicas')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.maxReplicas"
                        :rules="[intRule]"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent"
                        :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent"
                        :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.dependServices !== null" :id="'dependServices-add'">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addDependServices()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('dependServices')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.dependServices">
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name')"
                      dense
                      v-model="row.dependName"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_port')"
                      dense
                      v-model.number="row.dependPort"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                  <div class="form-item-30">
                    <v-select
                      :items="[ 'TCP', 'UDP' ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_type')"
                      dense
                      v-model="row.dependType"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyDependServices(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteDependServices(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.hostAliases !== null" :id="'hostAliases-add'">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addHostAliases()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('hostAliases')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4 align-center" v-for="(row, i) in addComponentForm.deploySpecStatic.hostAliases">
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_ip')"
                      dense
                      v-model="row.ip"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="row.hostnames"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames_tip_1')"
                      persistent-hint
                      append-icon=""
                      :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyHostAliases(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteHostAliases(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.securityContext.runAsUser !== 0 || addComponentForm.deploySpecStatic.securityContext.runAsGroup !== 0" :id="'securityContext-add'">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('securityContext')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.securityContext">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_user')"
                      dense
                      type="number"
                      :rules="[intRuleZero]"
                      v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsUser"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_group')"
                      dense
                      type="number"
                      :rules="[intRuleZero]"
                      v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsGroup"
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateComponentDialog"
      max-width="1100px"
      persistent
    >
      <v-card :loading="defaultLoading">
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_form_update_component_template', targetComponentName) }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-4 yaml-btn" small v-bind="attrs" v-on="on">
                <v-icon color="primary" @click="previewComponent()">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="updateComponent()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateComponentDialog = false
            this.$refs.addComponentRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addComponentRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_component_template_prompt', targetComponentName)}}</small>
            </v-alert>
            <div class="d-flex justify-space-between mt-4">
              <div class="form-item-45">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_component_template_component_desc')"
                  required
                  dense
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  v-model="addComponentForm.componentTemplateDesc"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_component_template_component_desc_tip_1')"
                  persistent-hint
                ></v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addComponentForm.tenantCode"
                  :items="tenantCodes"
                  dense
                  clearable
                  disabled
                  small-chips
                  :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                  persistent-hint
                >
                </v-select>
              </div>
            </div>
            <div class="d-flex justify-space-between mt-4">
              <div class="form-item-30">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image')"
                  dense
                  v-model="addComponentForm.deploySpecStatic.deployImage"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_tip_1')"
                  persistent-hint
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-30">
                <v-select
                  :items="['deployment', 'statefulset']"
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type')"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type_tip_1')"
                  persistent-hint
                  v-model="addComponentForm.deploySpecStatic.deployType"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                >
                </v-select>
              </div>
              <div class="form-item-30">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_replicas')"
                  dense
                  type="number"
                  v-model.number="addComponentForm.deploySpecStatic.deployReplicas"
                  :rules="[intRule]"
                >
                </v-text-field>
              </div>
            </div>
            <div class="form-row mt-4">
              <div class="form-item-50">
                <v-spacer></v-spacer>
                <v-select
                  :items="componentOpts"
                  dense
                  :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                  @change="chooseParams($event)"
                ></v-select>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployResources.cpuLimit !== '' ||
                addComponentForm.deploySpecStatic.deployResources.cpuRequest !== '' ||
                addComponentForm.deploySpecStatic.deployResources.memoryLimit !== '' ||
                addComponentForm.deploySpecStatic.deployResources.memoryRequest !== ''
                " :id="'deployResources-'+targetIndex"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" class="ml-4" @click="clearParams('deployResources')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.deployResources">
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.memoryRequest"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.memoryLimit"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.cpuRequest"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="form-item-20 d-flex">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployResources.cpuLimit"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployCommand !== '' ||
                addComponentForm.deploySpecStatic.deployEnvs !== null ||
                addComponentForm.deploySpecStatic.deployArgs !== null ||
                addComponentForm.deploySpecStatic.workingDir !== '' ||
                addComponentForm.deploySpecStatic.terminationGracePeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.subdomain !== '' ||
                addComponentForm.deploySpecStatic.enableDownwardApi ||
                addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHeadless !== false ||
                addComponentForm.deploySpecStatic.podManagementPolicy !== ''
                " :id="'deployOther-'+targetIndex"
              >
                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other')}} <v-icon color="error" class="ml-4" @click="clearParams('deployOther')">mdi-minus-circle-outline</v-icon></div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployCommand"
                      />
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="addComponentForm.deploySpecStatic.deployArgs"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args_tip_1')"
                        persistent-hint
                        append-icon=""
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployEnvs()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployEnvs" :key="i" v-if="addComponentForm.deploySpecStatic.deployEnvs">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_name')"
                            dense
                            v-model="row[0]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_value')"
                            dense
                            v-model="row[1]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployEnvs(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_tip_1')}}</small></div>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.workingDir"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.terminationGracePeriodSeconds"
                        :rules="[intRuleZero]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds"
                        :rules="[intRuleZero]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-40 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.subdomain"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2')}}</div>
                        </template>
                      </v-text-field>
                    </div>
                    <div class="form-item-40 d-flex align-center">
                      <v-select
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.enableDownwardApi"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3')}}</div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployType === 'statefulset'">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-select
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployHeadless"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-select
                        :items="['OrderedReady', 'Parallel']"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.podManagementPolicy"
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2'),
                          $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3'),
                        ]"
                      >
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3')}}</div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployMeta.labels !== null ||
                addComponentForm.deploySpecStatic.deployMeta.annotations !== null
                " :id="'deployMeta-'+targetIndex"
              >
                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta')}} <v-icon color="error" class="ml-4" @click="clearParams('deployMeta')">mdi-minus-circle-outline</v-icon></div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels')}}</small>
                    <v-icon color="success" class="ml-4" @click="addDeployMetaLabels()">mdi-table-plus</v-icon>
                    <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.labels" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.labels">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <v-icon color="error" class="mt-4" @click="deleteDeployMetaLabels(i)">mdi-trash-can-outline</v-icon>
                    </div>
                    <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_tip_1')}}</small></div>
                  </div>
                  <div class="form-item-50">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations')}}</small>
                    <v-icon color="success" class="ml-4" @click="addDeployMetaAnnotations()">mdi-table-plus</v-icon>
                    <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.annotations" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.annotations">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <v-icon color="error" class="mt-4" @click="deleteDeployMetaAnnotations(i)">mdi-trash-can-outline</v-icon>
                    </div>
                    <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_tip_1')}}</small></div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" :id="'deployLocalPorts-'+targetIndex" v-if="addComponentForm.deploySpecStatic.deployLocalPorts !== null">
                <div class="form-item-100" :id="'deployLocalPorts-'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="mx-4" @click="addDeployLocalPort()">mdi-table-plus</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployLocalPorts">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_port')"
                        dense
                        type="number"
                        v-model.number="row.port"
                        :rules="[intRule]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-select
                        :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_protocol')"
                        dense
                        v-model="row.protocol"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployLocalPort(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployLocalPort(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployVolumes !== null" :id="'deployVolumes-'+targetIndex">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addDeployVolumes()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('deployVolumes')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployVolumes">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pod')"
                      dense
                      v-model="row.pathInPod"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pv')"
                      dense
                      v-model="row.pathInPv"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyDeployVolumes(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteDeployVolumes(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders !== null
                " :id="'deployHealthCheck-'+targetIndex"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('deployHealthCheck')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between mt-4">
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds')"
                      dense
                      v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds"
                      :rules="[intRule]"
                      type="number"
                    />
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="params-content d-flex justify-space-between">
                  <div class="form-item-100">
                    <div class="form-item-50 d-flex">
                      <v-select
                        :items="[
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port'), value: 'checkPort'},
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec'), value: 'exec'},
                          {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get'), value: 'httpGet'},
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_select_method')"
                        @change="healthCheckChange($event)"
                        :value="healthCheckInit()"
                      ></v-select>
                    </div>
                    <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort"
                        :rules="[intRule]"
                        type="number"
                      />
                    </div>
                    <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.exec !== ''">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.deployHealthCheck.exec"
                        :rules="[intRule]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec_tip_1')"
                        persistent-hint
                      >
                      </v-text-field>
                    </div>
                    <div v-if="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get')}}</small>
                      <div class="d-flex justify-space-between mt-4">
                        <div class="form-item-40">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_port')"
                            dense
                            v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port"
                            :rules="[intRule]"
                            type="number"
                          />
                        </div>
                        <div class="form-item-40">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_path')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path"
                          />
                        </div>
                        <div class="form-item-40">
                          <v-select
                            :items="['HTTP', 'HTTPS']"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_scheme')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme"
                          />
                        </div>
                      </div>
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers')}}</small>
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_2')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addHealthCheckHttpHeaders()">mdi-table-plus</v-icon>
                      <div v-for="(row, i) in addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders" :key="i">
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_name')"
                              dense
                              v-model="row.name"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_value')"
                              dense
                              v-model="row.value"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <v-icon color="success" class="mr-4" @click="copyHealthCheckHttpHeaders(i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteHealthCheckHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders !== null ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0 ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme !== '' ||
                addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders !== null
                " :id="'lifecycle-'+targetIndex"
              >
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_tip_1')}}</span>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('lifecycle')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="form-item-100 params-item">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-select
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_select_method')"
                          @change="lifecyclePostStartChange($event)"
                          :value="lifecyclePostStartInit()"
                        ></v-select>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-select
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addLifecyclePostStartHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyLifecyclePostStartHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteLifecyclePostStartHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_tip_1')}}</span>
                    </v-tooltip>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-select
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_select_method')"
                          @change="lifecyclePreStopChange($event)"
                          :value="lifecyclePreStopInit()"
                        ></v-select>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-select
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addLifecyclePreStopHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyLifecyclePreStopHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteLifecyclePreStopHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="
                addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.maxReplicas !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent !== 0 ||
                addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue !== '' ||
                addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue !== ''
                " :id="'hpaConfig-'+targetIndex">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config')}}
                  <v-tooltip right max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_3')}}</div>
                    </div>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('hpaConfig')">mdi-minus-circle-outline</v-icon>
                </div>
                <div v-if="addComponentForm.deploySpecStatic.hpaConfig">
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-100">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_max_replicas')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.maxReplicas"
                        :rules="[intRule]"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent"
                        :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value')"
                        dense
                        v-model="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent"
                        :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.dependServices !== null" :id="'dependServices-'+targetIndex">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addDependServices()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('dependServices')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.dependServices">
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name')"
                      dense
                      v-model="row.dependName"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_port')"
                      dense
                      v-model.number="row.dependPort"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                  <div class="form-item-30">
                    <v-select
                      :items="[ 'TCP', 'UDP' ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_type')"
                      dense
                      v-model="row.dependType"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyDependServices(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteDependServices(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.hostAliases !== null" :id="'hostAliases-'+targetIndex">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addHostAliases()">mdi-table-plus</v-icon>
                  <v-icon color="error" class="ml-4" @click="clearParams('hostAliases')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4 align-center" v-for="(row, i) in addComponentForm.deploySpecStatic.hostAliases">
                  <div class="form-item-30">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_ip')"
                      dense
                      v-model="row.ip"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="row.hostnames"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames_tip_1')"
                      persistent-hint
                      append-icon=""
                      :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyHostAliases(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteHostAliases(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.securityContext.runAsUser !== 0 || addComponentForm.deploySpecStatic.securityContext.runAsGroup !== 0" :id="'securityContext-'+targetIndex">
                <div>
                  {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context')}}
                  <v-tooltip right max-width="250px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_tip_1')}}
                    </div>
                  </v-tooltip>
                  <v-icon color="error" @click="clearParams('securityContext')">mdi-minus-circle-outline</v-icon>
                </div>
                <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.securityContext">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_user')"
                      dense
                      type="number"
                      :rules="[intRuleZero]"
                      v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsUser"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_group')"
                      dense
                      type="number"
                      :rules="[intRuleZero]"
                      v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsGroup"
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteComponentDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_component_template', targetComponentName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_component_template_prompt', targetComponentName)}}</small>
            </v-alert>
            <v-container>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_component_template_tip_1', targetComponentName)}}
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.deleteComponentDialog = false
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteComponent()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="auditDialog"
      max-width="960px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_menu_view_logs') }}</span>
        </v-card-title>
        <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
          <pre
            v-for="(logMsg, i) in logList"
            :key="i"
            :id="'log' + i"
            :style="logMsg.logType | changeColor"
          >[{{ logMsg.logType }}] {{ logMsg.endTime }}  {{ logMsg.content }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.auditDialog = false
              this.refreshList()
            }"
            :disabled="disableBtn"
            :loading="disableBtn"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
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
  </PageCard>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import request from '@/utils/request'
import YAML from "yamljs";
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'ComponentTemplates',
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
      userObj: {},
      tableLoading: true,
      defaultLoading: false,
      auditDialog: false,
      defaultComponentDialog: false,
      defaultComponentTemplateYaml: '',
      updateComponentDialog: false,
      logList: [],
      userToken: '',
      componentsData: {},
      componentsForm: {
        tenantCodes: [],
        page: 1,
        perPage: 10
      },
      tenantCodes: [],
      targetYaml: '',
      yamlDialog: false,
      componentOpts: [],
      addComponentDialog: false,
      addComponentForm: {
        componentTemplateName: '',
        componentTemplateDesc: '',
        tenantCode: '',
        deploySpecStatic: {
          deployImage: "",
          deployType: "",
          deployReplicas: 1,
          deployHeadless: false,
          podManagementPolicy: "",
          deployMeta: {
            labels: null,
            annotations: null,
          },
          deployResources: {
            cpuLimit: '',
            cpuRequest: '',
            memoryLimit: '',
            memoryRequest: ''
          },
          deployVolumes: null,
          deployHealthCheck: {
            exec: "",
            checkPort: 0,
            httpGet: {
              httpHeaders: null,
              path: "",
              port: 0,
              scheme: "",
            },
            livenessDelaySeconds: 0,
            livenessPeriodSeconds: 0,
            readinessDelaySeconds: 0,
            readinessPeriodSeconds: 0,
            startupDelaySeconds: 0,
            startupPeriodSeconds: 0,
          },
          lifecycle: {
            postStart: {
              exec: "",
              httpGet: {
                httpHeaders: null,
                path: "",
                port: 0,
                scheme: "",
              },
            },
            preStop: {
              exec: "",
              httpGet: {
                httpHeaders: null,
                path: "",
                port: 0,
                scheme: "",
              },
            },
          },
          deployLocalPorts: null,
          hpaConfig: {
            cpuAverageRequestPercent: 0,
            maxReplicas: 0,
            memoryAverageRequestPercent: 0,
            cpuAverageValue: "",
            memoryAverageValue: "",
          },
          dependServices: null,
          hostAliases: null,
          securityContext: {
            runAsUser: 0,
            runAsGroup: 0,
          },
          deployEnvs: null,
          deployCommand: "",
          deployArgs: null,
          deploySessionAffinityTimeoutSeconds: 0,
          workingDir: "",
          nodeSelector: null,
          nodeName: "",
          terminationGracePeriodSeconds: 0,
          subdomain: "",
          enableDownwardApi: false,
        }
      },
      targetComponentName: '',
      deleteComponentDialog: false,
      disableBtn: false,
      YAMLDialog: false,
      yamlText: '',
      targetIndex: '',
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
    }
  },
  methods: {
    showLog (response) {
      const vm =this
      vm.logList = []
      vm.auditDialog = response.data.withAdminLog
      if(response.data.withAdminLog){
        vm.disableBtn = true
        vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${response.data.auditID}?x-user-token=${vm.userToken}`)
        vm.ws.onmessage = (event) => {
          vm.logList.push(JSON.parse(event.data))
        }
        vm.ws.onclose = () => {
          vm.logList.push({logType: 'END'})
          vm.disableBtn = false
        }
      }
    },
    changeOptions (data) {
      const vm = this
      vm.componentsForm.page = data.page
      vm.componentsForm.perPage = data.itemsPerPage
      vm.refreshList()
    },
    refreshList () {
      const vm = this
      vm.tableLoading = true
      request.post('admin/componentTemplates', vm.componentsForm).then(response => {
        vm.componentsData = response.data
        vm.tableLoading = false
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    detailHandle (item) {
      const vm = this
      let yaml = JSON.parse(JSON.stringify(item))
      if (yaml.deploySessionAffinityTimeoutSeconds !== null && yaml.deploySessionAffinityTimeoutSeconds !== 0) {
      }else{
        delete yaml.deploySessionAffinityTimeoutSeconds
      }
      Object.keys(yaml).forEach(item => {
        if(yaml[item] !== null){
          if(yaml[item] instanceof Array && yaml[item].length <= 0){
            delete yaml[item]
          }else if(yaml[item] instanceof Object && JSON.stringify(yaml[item]) == "{}"){
            delete yaml[item]
          }else if(yaml[item] === ''){
            delete yaml[item]
          }else if(yaml[item] instanceof Object){
            if(item === 'hpaConfig'){
                if (
                    yaml.hpaConfig.cpuAverageRequestPercent === 0 &&
                    yaml.hpaConfig.maxReplicas === 0 &&
                    yaml.hpaConfig.memoryAverageRequestPercent === 0 &&
                    yaml.hpaConfig.cpuAverageValue === '' &&
                    yaml.hpaConfig.memoryAverageValue === ''
                  ) {
                  delete yaml.hpaConfig
                } else {
                  vm.sortData(yaml.hpaConfig)
                }
              } else if(item === 'deployResources'){
              if (
                  yaml.deployResources.cpuLimit === '' &&
                  yaml.deployResources.cpuRequest === '' &&
                  yaml.deployResources.memoryLimit === '' &&
                  yaml.deployResources.memoryRequest === ''
                ) {
                delete yaml.deployResources
              } else {
                vm.sortData(yaml.deployResources)
              }
            } else if (item === 'deployHealthCheck') {
              if (
                  yaml.deployHealthCheck.livenessDelaySeconds === 0 &&
                  yaml.deployHealthCheck.livenessPeriodSeconds === 0 &&
                  yaml.deployHealthCheck.readinessDelaySeconds === 0 &&
                  yaml.deployHealthCheck.readinessPeriodSeconds === 0 &&
                  yaml.deployHealthCheck.startupDelaySeconds === 0 &&
                  yaml.deployHealthCheck.startupPeriodSeconds === 0 &&
                  yaml.deployHealthCheck.checkPort === 0 &&
                  yaml.deployHealthCheck.exec === '' &&
                  yaml.deployHealthCheck.httpGet.port === 0 &&
                  yaml.deployHealthCheck.httpGet.httpHeaders === null &&
                  yaml.deployHealthCheck.httpGet.path === '' &&
                  yaml.deployHealthCheck.httpGet.scheme === ''
                ) {
                delete yaml.deployHealthCheck
              } else {
                vm.sortData(yaml.deployHealthCheck.httpGet)
                vm.sortData(yaml.deployHealthCheck)
              }
            } else if(item === 'lifecycle'){
              if (
                  yaml.lifecycle.postStart.exec === '' &&
                  yaml.lifecycle.postStart.httpGet.port === 0 &&
                  yaml.lifecycle.postStart.httpGet.httpHeaders === null &&
                  yaml.lifecycle.postStart.httpGet.path === '' &&
                  yaml.lifecycle.postStart.httpGet.scheme === '' &&
                  yaml.lifecycle.preStop.exec === '' &&
                  yaml.lifecycle.preStop.httpGet.port === 0 &&
                  yaml.lifecycle.preStop.httpGet.httpHeaders === null &&
                  yaml.lifecycle.preStop.httpGet.path === '' &&
                  yaml.lifecycle.preStop.httpGet.scheme === ''
                ) {
                delete yaml.lifecycle
              } else {
                vm.sortData(yaml.lifecycle.postStart.httpGet)
                vm.sortData(yaml.lifecycle.postStart)
                vm.sortData(yaml.lifecycle.preStop.httpGet)
                vm.sortData(yaml.lifecycle.preStop)
              }
            } else if (item === 'securityContext') {
              if(yaml.securityContext.runAsGroup === 0 && yaml.securityContext.runAsUser === 0){
                delete yaml.securityContext
              }else{
                vm.sortData(yaml.securityContext)
              }
            } else if (item === 'deployVolumes') {
              if(yaml.deployVolumes && yaml.deployVolumes !== null && yaml.deployVolumes.length > 0){
                yaml.deployVolumes.forEach(row => {
                  vm.sortData(row)
                })
              }
            } else if (item === 'deployLocalPorts') {
              if(yaml.deployLocalPorts && yaml.deployLocalPorts !== null && yaml.deployLocalPorts.length > 0){
                yaml.deployLocalPorts.forEach(row => {
                  vm.sortData(row)
                })
              }
            }
          }
        }else{
          delete yaml[item]
        }
      })
      vm.targetYaml = YAML.stringify(yaml, 4)
      vm.$refs.monaco2.monacoEditor.setValue(vm.targetYaml)
      vm.yamlDialog = true
    },
    openAddComponent (flag) {
      const vm = this
      vm.addComponentDialog = true
      vm.targetIndex = flag
      vm.defaultLoading = true
      if (!vm.userObj.isAdmin) {
        vm.addComponentForm.tenantCode = vm.tenantCodes[0]
      }
      request.get('/admin/componentTemplate').then(response => {
        vm.defaultLoading = false
        Object.keys(response.data.deploySpecStatic).forEach(item => {
          if(response.data.deploySpecStatic[item] !== null){
            if(response.data.deploySpecStatic[item] instanceof Array && response.data.deploySpecStatic[item].length <= 0){
              response.data.deploySpecStatic[item] = null
            }else if(response.data.deploySpecStatic[item] instanceof Object && JSON.stringify(response.data.deploySpecStatic[item]) == "{}"){
              response.data.deploySpecStatic[item] = null
            }
          }
        })
        if (response.data.deploySpecStatic.deployEnvs !== null) {
          response.data.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
            row = row.split("=");
            response.data.deploySpecStatic.deployEnvs[rowIndex] = row;
          });
        }
        vm.addComponentForm.deploySpecStatic = response.data.deploySpecStatic
        vm.addComponentForm.componentTemplateName = ''
        vm.addComponentForm.componentTemplateDesc = ''
      }).catch(error => {
        vm.defaultLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    previewComponent() {
      const vm = this;
      if (vm.$refs.addComponentRef.validate()) {
        var copyData = JSON.parse(JSON.stringify(vm.addComponentForm.deploySpecStatic))
        if (copyData.deploySessionAffinityTimeoutSeconds !== null && copyData.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete copyData.deploySessionAffinityTimeoutSeconds
        }
        if (copyData.deployEnvs !== null && copyData.deployEnvs.length > 0) {
          copyData.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(copyData).forEach(item => {
          if(copyData[item] !== null){
            if(copyData[item] instanceof Array && copyData[item].length <= 0){
              delete copyData[item]
            }else if(copyData[item] instanceof Object && JSON.stringify(copyData[item]) == "{}"){
              delete copyData[item]
            }else if(copyData[item] === ''){
              delete copyData[item]
            }else if(copyData[item] instanceof Object){
              if (item === 'hpaConfig'){
                if(
                  copyData.hpaConfig.cpuAverageRequestPercent === 0 &&
                  copyData.hpaConfig.maxReplicas === 0 &&
                  copyData.hpaConfig.memoryAverageRequestPercent === 0 &&
                  copyData.hpaConfig.cpuAverageValue === '' &&
                  copyData.hpaConfig.memoryAverageValue === '' )
                {
                  delete copyData.hpaConfig
                }else{
                  vm.sortData(copyData.hpaConfig)
                }
              } else if(item === 'deployResources'){
                if(copyData.deployResources.cpuLimit === '' && copyData.deployResources.cpuRequest === '' && copyData.deployResources.memoryLimit === '' && copyData.deployResources.memoryRequest === ''){
                  delete copyData.deployResources
                }else{
                  vm.sortData(copyData.deployResources)
                }
              }else if(item === 'deployHealthCheck'){
                if(copyData.deployHealthCheck.checkPort === 0 && copyData.deployHealthCheck.livenessDelaySeconds === 0 && copyData.deployHealthCheck.livenessPeriodSeconds === 0 && copyData.deployHealthCheck.readinessDelaySeconds === 0 && copyData.deployHealthCheck.readinessPeriodSeconds === 0 && copyData.deployHealthCheck.httpGet.port === 0 && copyData.deployHealthCheck.httpGet.httpHeaders === null && copyData.deployHealthCheck.httpGet.path === ''){
                  delete copyData.deployHealthCheck
                }else{
                  vm.sortData(copyData.deployHealthCheck.httpGet)
                  vm.sortData(copyData.deployHealthCheck)
                }
              }else if(item === 'securityContext'){
                if(copyData.securityContext.runAsGroup === 0 && copyData.securityContext.runAsUser === 0){
                  delete copyData.securityContext
                }else{
                  vm.sortData(copyData.securityContext)
                }
              }else if(item === 'deployVolumes'){
                if(copyData.deployVolumes && copyData.deployVolumes !== null && copyData.deployVolumes.length > 0){
                  copyData.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }else if(item === 'deployLocalPorts'){
                if(copyData.deployLocalPorts && copyData.deployLocalPorts !== null && copyData.deployLocalPorts.length > 0){
                  copyData.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete copyData[item]
          }
        })
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog = true;
      }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    clearParams(name) {
      const vm = this;
      if (name === "deployOther") {
        vm.addComponentForm.deploySpecStatic.deployCommand = '';
        vm.addComponentForm.deploySpecStatic.deployEnvs = null;
        vm.addComponentForm.deploySpecStatic.deployArgs = null;
        vm.addComponentForm.deploySpecStatic.workingDir = '';
        vm.addComponentForm.deploySpecStatic.nodeSelector = null;
        vm.addComponentForm.deploySpecStatic.nodeName = '';
        vm.addComponentForm.deploySpecStatic.terminationGracePeriodSeconds = 0;
        vm.addComponentForm.deploySpecStatic.subdomain = '';
        vm.addComponentForm.deploySpecStatic.enableDownwardApi = false;
        vm.addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds = 0;
        vm.addComponentForm.deploySpecStatic.deployHeadless = false;
        vm.addComponentForm.deploySpecStatic.podManagementPolicy = '';
      } else if (name === "deployMeta") {
        vm.addComponentForm.deploySpecStatic.deployMeta = {
          labels: null,
          annotations: null,
        };
      } else if (name === "securityContext") {
        vm.addComponentForm.deploySpecStatic.securityContext = {
          runAsUser: 0,
          runAsGroup: 0,
        };
      } else if (name === "deployHealthCheck") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck = {
          checkPort: 0,
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
          livenessDelaySeconds: 0,
          livenessPeriodSeconds: 0,
          readinessDelaySeconds: 0,
          readinessPeriodSeconds: 0,
          startupDelaySeconds: 0,
          startupPeriodSeconds: 0,
        };
      } else if (name === "lifecycle") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
      } else if (name === "hpaConfig") {
        vm.addComponentForm.deploySpecStatic.hpaConfig = {
          cpuAverageRequestPercent: 0,
          maxReplicas: 0,
          memoryAverageRequestPercent: 0,
          cpuAverageValue: "",
          memoryAverageValue: "",
        };
      } else if (name === 'deployResources') {
        vm.addComponentForm.deploySpecStatic.deployResources = {
          cpuLimit: '',
          cpuRequest: '',
          memoryLimit: '',
          memoryRequest: ''
        };
      } else if (name === 'deployLocalPorts') {
        vm.addComponentForm.deploySpecStatic.deployNodePorts = null
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = null
      } else {
        vm.addComponentForm.deploySpecStatic[name] = null;
      }
    },
    chooseParams(e) {
      const vm = this;
      if (e === "deployOther") {
        if (
          vm.addComponentForm.deploySpecStatic.deployCommand === '' &&
          vm.addComponentForm.deploySpecStatic.deployEnvs === null &&
          vm.addComponentForm.deploySpecStatic.deployArgs === null &&
          vm.addComponentForm.deploySpecStatic.workingDir === '' &&
          vm.addComponentForm.deploySpecStatic.nodeSelector === null &&
          vm.addComponentForm.deploySpecStatic.nodeName === '' &&
          vm.addComponentForm.deploySpecStatic.terminationGracePeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.subdomain === '' &&
          vm.addComponentForm.deploySpecStatic.enableDownwardApi === false &&
          vm.addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHeadless === false &&
          vm.addComponentForm.deploySpecStatic.podManagementPolicy === ''
          ) {
          vm.addComponentForm.deploySpecStatic.deployEnvs = [["", ""]];
        }
      } else if (e === "deployMeta") {
        if (
          vm.addComponentForm.deploySpecStatic.deployMeta.labels === null &&
          vm.addComponentForm.deploySpecStatic.deployMeta.annotations === null
        ) {
          vm.addComponentForm.deploySpecStatic.deployMeta.labels = [{name: '', value: ''}];
          vm.addComponentForm.deploySpecStatic.deployMeta.annotations = [{name: '', value: ''}];
        }
      } else if (e === "deployLocalPorts") {
        if (vm.addComponentForm.deploySpecStatic.deployLocalPorts === null) {
          vm.addComponentForm.deploySpecStatic[e] = [];
        }
      } else if (e === 'deployNodePorts'){
        if (vm.addComponentForm.deploySpecStatic.deployNodePorts === null) {
          vm.addComponentForm.deploySpecStatic.deployNodePorts = []
        }
      } else if (e === "securityContext") {
        if (
          vm.addComponentForm.deploySpecStatic.securityContext.runAsUser == 0 &&
          vm.addComponentForm.deploySpecStatic.securityContext.runAsGroup == 0
        ) {
          vm.addComponentForm.deploySpecStatic.securityContext = {
            runAsUser: 1000,
            runAsGroup: 0,
          };
        }
      } else if (e === "deployHealthCheck") {
        if (
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders === null
        ) {
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds = 15;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds = 5;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds = 60;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds = 30;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds = 0;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds = 0;
        }
      } else if (e === "lifecycle") {
        if (
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port === 0 &&
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders === null &&
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port === 0 &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders === null &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme === ''
        ) {
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = "cat /etc/hosts";
        }
      } else if (e === "hpaConfig") {
        if (
          vm.addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.maxReplicas === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue === "" ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue === ""
        ) {
          vm.addComponentForm.deploySpecStatic.hpaConfig.maxReplicas = 1;
        }
      } else if (e === "deployResources") {
        if (
          vm.addComponentForm.deploySpecStatic.deployResources.cpuLimit === '' &&
          vm.addComponentForm.deploySpecStatic.deployResources.cpuRequest === '' &&
          vm.addComponentForm.deploySpecStatic.deployResources.memoryLimit === '' &&
          vm.addComponentForm.deploySpecStatic.deployResources.memoryRequest === ''
          ) {
          vm.addComponentForm.deploySpecStatic.deployResources = {
            memoryRequest: "10Mi",
            memoryLimit: "100Mi",
            cpuRequest: "10m",
            cpuLimit: "100m",
          };
        }
      } else {
        if (vm.addComponentForm.deploySpecStatic[e] === null) {
          if (
            e === "deployVolumes" ||
            e === "dependServices" ||
            e === "hostAliases"
          ) {
            vm.addComponentForm.deploySpecStatic[e] = [];
          } else {
            vm.addComponentForm.deploySpecStatic[e] = {};
          }
        }
      }
      vm.timer = setTimeout(() => {
        document.querySelector("#" + e + '-' + vm.targetIndex).scrollIntoView(true);
      }, 500);
    },
    healthCheckChange(e) {
      const vm = this;
      if (e === "checkPort") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 8080
      } else if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = "cat /etc/hosts"
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      } else {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      }
    },
    healthCheckInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0) {
        return 'checkPort'
      } else if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    lifecyclePostStartChange(e) {
      const vm = this;
      if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = ""
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = ""
      }
    },
    lifecyclePostStartInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    lifecyclePreStopChange(e) {
      const vm = this;
      if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = ""
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = ""
      }
    },
    lifecyclePreStopInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    changePortSet(e) {
      const vm = this;
      if(e === 'deployNodePorts'){
        vm.addComponentForm.deploySpecStatic.deployNodePorts = []
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = null
      }else{
        vm.addComponentForm.deploySpecStatic.deployNodePorts = null
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = []
      }
    },
    addDeployEnvs() {
      const vm = this;
      let addItem = ["", ""];
      if (vm.addComponentForm.deploySpecStatic.deployEnvs === null) {
        vm.addComponentForm.deploySpecStatic.deployEnvs = [];
        vm.addComponentForm.deploySpecStatic.deployEnvs.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployEnvs.push(addItem);
      }
    },
    addDeployMetaLabels() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.addComponentForm.deploySpecStatic.deployMeta.labels === null) {
        vm.addComponentForm.deploySpecStatic.deployMeta.labels = [];
        vm.addComponentForm.deploySpecStatic.deployMeta.labels.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployMeta.labels.push(addItem);
      }
    },
    addDeployMetaAnnotations() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.addComponentForm.deploySpecStatic.deployMeta.annotations === null) {
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations = [];
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations.push(addItem);
      }
    },
    addDeployLocalPort() {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "TCP",
      };
      if (vm.addComponentForm.deploySpecStatic.deployLocalPorts === null) {
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = [];
        vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(addItem);
      }
    },
    copyDeployLocalPort(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployLocalPorts[j])
      );
      vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(copyItem);
    },
    deleteDeployLocalPort(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployLocalPorts.splice(j, 1);
    },
    deleteDeployEnvs(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployEnvs.splice(j, 1);
    },
    deleteDeployMetaLabels(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployMeta.labels.splice(j, 1);
    },
    deleteDeployMetaAnnotations(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployMeta.annotations.splice(j, 1);
    },
    addDeployNodePort() {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "TCP",
        nodePort: null,
      };
      if (vm.addComponentForm.deploySpecStatic.deployNodePorts === null) {
        vm.addComponentForm.deploySpecStatic.deployNodePorts = [];
        vm.addComponentForm.deploySpecStatic.deployNodePorts.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployNodePorts.push(addItem);
      }
    },
    copyDeployNodePort(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployNodePorts[j])
      );
      vm.addComponentForm.deploySpecStatic.deployNodePorts.push(copyItem);
    },
    deleteDeployNodePort(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployNodePorts.splice(j, 1);
    },
    addDeployVolumes() {
      const vm = this;
      let addItem = {
        pathInPod: "",
        pathInPv: "",
      };
      if (vm.addComponentForm.deploySpecStatic.deployVolumes === null) {
        vm.addComponentForm.deploySpecStatic.deployVolumes = [];
        vm.addComponentForm.deploySpecStatic.deployVolumes.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployVolumes.push(addItem);
      }
    },
    copyDeployVolumes(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployVolumes[j])
      );
      vm.addComponentForm.deploySpecStatic.deployVolumes.push(copyItem);
    },
    deleteDeployVolumes(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployVolumes.splice(j, 1);
    },
    addHealthCheckHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(addItem);
      }
    },
    copyHealthCheckHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(copyItem);
    },
    deleteHealthCheckHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePostStartHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePostStartHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePostStartHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePreStopHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePreStopHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePreStopHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.splice(j,1);
    },
    addDependServices() {
      const vm = this;
      let addItem = {
        dependName: "",
        dependPort: null,
        dependType: "TCP",
      };
      if (vm.addComponentForm.deploySpecStatic.dependServices === null) {
        vm.addComponentForm.deploySpecStatic.dependServices = [];
        vm.addComponentForm.deploySpecStatic.dependServices.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.dependServices.push(addItem);
      }
    },
    copyDependServices(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.dependServices[j])
      );
      vm.addComponentForm.deploySpecStatic.dependServices.push(copyItem);
    },
    deleteDependServices(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.dependServices.splice(j, 1);
    },
    addHostAliases() {
      const vm = this;
      let addItem = {
        ip: "",
        hostnames: [],
      };
      if (vm.addComponentForm.deploySpecStatic.hostAliases === null) {
        vm.addComponentForm.deploySpecStatic.hostAliases = [];
        vm.addComponentForm.deploySpecStatic.hostAliases.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.hostAliases.push(addItem);
      }
    },
    copyHostAliases(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.hostAliases[j])
      );
      vm.addComponentForm.deploySpecStatic.hostAliases.push(copyItem);
    },
    deleteHostAliases(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.hostAliases.splice(j, 1);
    },
    addComponent () {
      const vm = this
      if(vm.$refs.addComponentRef.validate()){
        var copyData = JSON.parse(JSON.stringify(vm.addComponentForm.deploySpecStatic))
        if (copyData.deploySessionAffinityTimeoutSeconds !== null && copyData.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete copyData.deploySessionAffinityTimeoutSeconds
        }
        if (copyData.deployEnvs !== null && copyData.deployEnvs.length > 0) {
          copyData.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(copyData).forEach(item => {
          if(copyData[item] !== null){
            if(copyData[item] instanceof Array && copyData[item].length <= 0){
              delete copyData[item]
            }else if(copyData[item] instanceof Object && JSON.stringify(copyData[item]) == "{}"){
              delete copyData[item]
            }else if(copyData[item] === ''){
              delete copyData[item]
            }else if(copyData[item] instanceof Object){
              if (item === 'hpaConfig'){
                if(
                  copyData.hpaConfig.cpuAverageRequestPercent === 0 &&
                  copyData.hpaConfig.maxReplicas === 0 &&
                  copyData.hpaConfig.memoryAverageRequestPercent === 0 &&
                  copyData.hpaConfig.cpuAverageValue === '' &&
                  copyData.hpaConfig.memoryAverageValue === '' )
                {
                  delete copyData.hpaConfig
                }else{
                  vm.sortData(copyData.hpaConfig)
                }
              } else if (item === 'deployResources') {
                if (
                  copyData.deployResources.cpuLimit === '' &&
                  copyData.deployResources.cpuRequest === '' &&
                  copyData.deployResources.memoryLimit === '' &&
                  copyData.deployResources.memoryRequest === ''
                  ) {
                  delete copyData.deployResources
                } else {
                  vm.sortData(copyData.deployResources)
                }
              } else if (item === 'deployHealthCheck') {
                if (
                  copyData.deployHealthCheck.checkPort === 0 &&
                  copyData.deployHealthCheck.exec === '' &&
                  copyData.deployHealthCheck.livenessDelaySeconds === 0 &&
                  copyData.deployHealthCheck.livenessPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.readinessDelaySeconds === 0 &&
                  copyData.deployHealthCheck.readinessPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.startupDelaySeconds === 0 &&
                  copyData.deployHealthCheck.startupPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.httpGet.port === 0 &&
                  copyData.deployHealthCheck.httpGet.httpHeaders === null &&
                  copyData.deployHealthCheck.httpGet.path === '' &&
                  copyData.deployHealthCheck.httpGet.scheme === ''
                  ) {
                  delete copyData.deployHealthCheck
                } else {
                  vm.sortData(copyData.deployHealthCheck.httpGet)
                  vm.sortData(copyData.deployHealthCheck)
                }
              } else if (item === 'lifecycle') {
                if (
                    copyData.lifecycle.postStart.exec === '' &&
                    copyData.lifecycle.postStart.httpGet.port === 0 &&
                    copyData.lifecycle.postStart.httpGet.httpHeaders === null &&
                    copyData.lifecycle.postStart.httpGet.path === '' &&
                    copyData.lifecycle.postStart.httpGet.scheme === '' &&
                    copyData.lifecycle.preStop.exec === '' &&
                    copyData.lifecycle.preStop.httpGet.port === 0 &&
                    copyData.lifecycle.preStop.httpGet.httpHeaders === null &&
                    copyData.lifecycle.preStop.httpGet.path === '' &&
                    copyData.lifecycle.preStop.httpGet.scheme === ''
                  ) {
                  delete copyData.lifecycle
                } else {
                  vm.sortData(copyData.lifecycle.postStart.httpGet)
                  vm.sortData(copyData.lifecycle.postStart)
                  vm.sortData(copyData.lifecycle.preStop.httpGet)
                  vm.sortData(copyData.lifecycle.preStop)
                }
              } else if (item === 'securityContext') {
                if (copyData.securityContext.runAsGroup === 0 && copyData.securityContext.runAsUser === 0) {
                  delete copyData.securityContext
                } else {
                  vm.sortData(copyData.securityContext)
                }
              } else if (item === 'deployVolumes') {
                if(copyData.deployVolumes && copyData.deployVolumes !== null && copyData.deployVolumes.length > 0){
                  copyData.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployLocalPorts') {
                if(copyData.deployLocalPorts && copyData.deployLocalPorts !== null && copyData.deployLocalPorts.length > 0){
                  copyData.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete copyData[item]
          }
        })
        var componentTemplateYaml = YAML.stringify(copyData, 4);
        request.post('/admin/componentTemplate', {
          componentTemplateName: vm.addComponentForm.componentTemplateName,
          componentTemplateDesc: vm.addComponentForm.componentTemplateDesc,
          tenantCode: vm.addComponentForm.tenantCode,
          componentTemplateYaml: componentTemplateYaml
        }).then(response => {
          vm.addComponentDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateComponent (item) {
      const vm = this
      vm.targetIndex = item.componentTemplateName
      vm.targetComponentName = item.componentTemplateName
      request.post('/admin/componentTemplates', vm.componentsForm).then(response => {
        response.data.componentTemplates.forEach(next => {
          if(next.componentTemplateName === item.componentTemplateName){
            vm.addComponentForm = next
          }
        })
        Object.keys(vm.addComponentForm.deploySpecStatic).forEach(item => {
          if(vm.addComponentForm.deploySpecStatic[item] !== null){
            if(vm.addComponentForm.deploySpecStatic[item] instanceof Array && vm.addComponentForm.deploySpecStatic[item].length <= 0){
              vm.addComponentForm.deploySpecStatic[item] = null
            }else if(vm.addComponentForm.deploySpecStatic[item] instanceof Object && JSON.stringify(vm.addComponentForm.deploySpecStatic[item]) == "{}"){
              vm.addComponentForm.deploySpecStatic[item] = null
            }
          }
        })
        if (vm.addComponentForm.deploySpecStatic.deployEnvs !== null) {
          vm.addComponentForm.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
            row = row.split("=");
            vm.addComponentForm.deploySpecStatic.deployEnvs[rowIndex] = row;
          });
        }
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
      vm.updateComponentDialog = true
    },
    updateComponent () {
      const vm = this
      if(vm.$refs.addComponentRef.validate()){
        var copyData = JSON.parse(JSON.stringify(vm.addComponentForm.deploySpecStatic))
        if (copyData.deploySessionAffinityTimeoutSeconds !== null && copyData.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete copyData.deploySessionAffinityTimeoutSeconds
        }
        if (copyData.deployEnvs !== null && copyData.deployEnvs.length > 0) {
          copyData.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(copyData).forEach(item => {
          if(copyData[item] !== null){
            if(copyData[item] instanceof Array && copyData[item].length <= 0){
              delete copyData[item]
            }else if(copyData[item] instanceof Object && JSON.stringify(copyData[item]) == "{}"){
              delete copyData[item]
            }else if(copyData[item] === ''){
              delete copyData[item]
            }else if(copyData[item] instanceof Object){
              if (item === 'hpaConfig'){
                if(
                  copyData.hpaConfig.cpuAverageRequestPercent === 0 &&
                  copyData.hpaConfig.maxReplicas === 0 &&
                  copyData.hpaConfig.memoryAverageRequestPercent === 0 &&
                  copyData.hpaConfig.cpuAverageValue === '' &&
                  copyData.hpaConfig.memoryAverageValue === '' )
                {
                  delete copyData.hpaConfig
                }else{
                  vm.sortData(copyData.hpaConfig)
                }
              } else if (item === 'deployResources') {
                if (
                  copyData.deployResources.cpuLimit === '' &&
                  copyData.deployResources.cpuRequest === '' &&
                  copyData.deployResources.memoryLimit === '' &&
                  copyData.deployResources.memoryRequest === ''
                  ) {
                  delete copyData.deployResources
                } else {
                  vm.sortData(copyData.deployResources)
                }
              } else if (item === 'deployHealthCheck') {
                if (
                  copyData.deployHealthCheck.checkPort === 0 &&
                  copyData.deployHealthCheck.exec === '' &&
                  copyData.deployHealthCheck.livenessDelaySeconds === 0 &&
                  copyData.deployHealthCheck.livenessPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.readinessDelaySeconds === 0 &&
                  copyData.deployHealthCheck.readinessPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.startupDelaySeconds === 0 &&
                  copyData.deployHealthCheck.startupPeriodSeconds === 0 &&
                  copyData.deployHealthCheck.httpGet.port === 0 &&
                  copyData.deployHealthCheck.httpGet.httpHeaders === null &&
                  copyData.deployHealthCheck.httpGet.path === '' &&
                  copyData.deployHealthCheck.httpGet.scheme === ''
                  ) {
                  delete copyData.deployHealthCheck
                } else {
                  vm.sortData(copyData.deployHealthCheck.httpGet)
                  vm.sortData(copyData.deployHealthCheck)
                }
              } else if (item === 'lifecycle') {
                if (
                    copyData.lifecycle.postStart.exec === '' &&
                    copyData.lifecycle.postStart.httpGet.port === 0 &&
                    copyData.lifecycle.postStart.httpGet.httpHeaders === null &&
                    copyData.lifecycle.postStart.httpGet.path === '' &&
                    copyData.lifecycle.postStart.httpGet.scheme === '' &&
                    copyData.lifecycle.preStop.exec === '' &&
                    copyData.lifecycle.preStop.httpGet.port === 0 &&
                    copyData.lifecycle.preStop.httpGet.httpHeaders === null &&
                    copyData.lifecycle.preStop.httpGet.path === '' &&
                    copyData.lifecycle.preStop.httpGet.scheme === ''
                  ) {
                  delete copyData.lifecycle
                } else {
                  vm.sortData(copyData.lifecycle.postStart.httpGet)
                  vm.sortData(copyData.lifecycle.postStart)
                  vm.sortData(copyData.lifecycle.preStop.httpGet)
                  vm.sortData(copyData.lifecycle.preStop)
                }
              } else if (item === 'securityContext') {
                if (copyData.securityContext.runAsGroup === 0 && copyData.securityContext.runAsUser === 0) {
                  delete copyData.securityContext
                } else {
                  vm.sortData(copyData.securityContext)
                }
              } else if (item === 'deployVolumes') {
                if(copyData.deployVolumes && copyData.deployVolumes !== null && copyData.deployVolumes.length > 0){
                  copyData.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployLocalPorts') {
                if(copyData.deployLocalPorts && copyData.deployLocalPorts !== null && copyData.deployLocalPorts.length > 0){
                  copyData.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete copyData[item]
          }
        })
        var componentTemplateYaml = YAML.stringify(copyData, 4);
        request.post(`/admin/componentTemplate/${vm.targetComponentName}`, {
          componentTemplateName: vm.targetComponentName,
          componentTemplateDesc: vm.addComponentForm.componentTemplateDesc,
          componentTemplateYaml: componentTemplateYaml
        }).then(response => {
          vm.updateComponentDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteComponent (item) {
      const vm = this
      vm.targetComponentName = item.componentTemplateName
      vm.deleteComponentDialog = true
    },
    deleteComponent () {
      const vm = this
      request.delete(`/admin/componentTemplate/${vm.targetComponentName}`).then(response => {
        vm.deleteComponentDialog = false
        vm.successTip(true, response.msg)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
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
    },
    closeYaml() {
      const vm = this;
      vm.$refs.monaco.monacoEditor.setValue('')
      vm.YAMLDialog = false;
    },
  },
  created () {
    const vm = this
    vm.componentOpts = [
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources'), value: 'deployResources' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other'), value: 'deployOther' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta'), value: 'deployMeta' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports'), value: 'deployLocalPorts' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes'), value: 'deployVolumes' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check'), value: 'deployHealthCheck' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle'), value: 'lifecycle' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config'), value: 'hpaConfig' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_depend_services'), value:'dependServices' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases'), value: 'hostAliases' },
      { text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_security_context'), value: 'securityContext' },
    ]
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    request.get('/admin/tenantCodes').then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    vm.refreshList()
  },
  computed: {
    componentsHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_template_name'), value: 'componentTemplateName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_template_desc'), value: 'componentTemplateDesc', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_template_yaml'), value: 'componentTemplateYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_create_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
  }
}
</script>

<style lang="scss" scoped>
.form-item-15 {
  width: 15%;
}
.form-item-20 {
  width: 20%;
}
.form-item {
  width: 30%;
}
.form-item-30 {
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
