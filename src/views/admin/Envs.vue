<template>
  <div class="envs">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_envs_management')">
      <v-card>
        <v-card-title>
          <v-form style="width: 100%">
            <v-container class="d-flex flex-wrap" fluid>
              <v-row>
                <v-col cols="3">
                  <v-autocomplete
                    :items="envNamesResponse.data.envNames"
                    v-model="pageRequest.envNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_env')"
                    dense
                    small-chips
                    multiple
                    clearable
                    @change="$observables.queryPage$.next('envNameChange')"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                    :items="tenantCodes"
                    v-model="pageRequest.tenantCodes"
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
                    dense
                    small-chips
                    multiple
                    clearable
                    @change="$observables.queryPage$.next('envNameChange')"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                    :items="['yes', 'no']"
                    v-model="pageRequest.fromFile"
                    :label="$vuetify.lang.t('$vuetify.lang_form_from_file')"
                    dense
                    small-chips
                    clearable
                    @change="$observables.queryPage$.next('envNameChange')"
                  ></v-autocomplete>
                </v-col>

                <v-spacer></v-spacer>
                <v-btn color="primary" @click="$observables.addEnvClick$.next('add')">{{ $vuetify.lang.t('$vuetify.lang_menu_new_env') }}</v-btn>
              </v-row>
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="pageResponse.data.envK8ss"
            :server-items-length="pageRequest.perPage"
            class="elevation-1"
            dense
            item-key="envName"
            show-expand
          >
            <template v-slot:item.handle="{ item }">
              <Operations
                :operations="[
                  { text: $vuetify.lang.t('$vuetify.lang_form_update_env'), onClick: () => {$observables.modifyEnvClick$.next(item)} },
                  { text: $vuetify.lang.t('$vuetify.lang_form_copy_env'), onClick: () => {$observables.copyEnvClick$.next(item)} },
                  { text: $vuetify.lang.t('$vuetify.lang_form_delete_env'), onClick: () => {$observables.deleteEnvClick$.next(item)} }
                ]"
              ></Operations>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-1">
                <v-card class="rounded-0">
                  <v-card-title>
                    {{$vuetify.lang.t('$vuetify.lang_view_env_pvs_settings')}}
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="$observables.addPvClick$.next(item)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_pv') }}</v-btn>
                  </v-card-title>
                  <v-card-text>
                    <env-pvs-data-table
                      :pvs="item.pvs"
                      :env-item="item"
                      hideDefaultFooter
                      disablePagination
                      @modifyPv="(pvItem, envItem) => {$observables.modifyPvClick$.next({
                        pvItem, envItem
                      })}"
                      @deletePv="(pvItem) => {$observables.deletePvClick$.next(pvItem)}"
                    />
                  </v-card-text>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </PageCard>
    <v-dialog
      v-model="operationDialog"
      persistent
      :max-width="dialogWidth"
    >
      <OperationCard
        v-bind="operationCardConfig.attrs"
        v-on="Object.entries(operationCardConfig.listeners).reduce((acc, [key, value]) => {
          if(value) {
            acc[key] = value
          }
          return acc
        }, {})"
      >
        <template v-slot:addEnv v-if="operationCardConfig.attrs.formEls.includes('addEnv')">
          <v-form ref="envRef">
            <div class="env-wrap">
              <div class="d-flex justify-space-between">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_name')"
                    required
                    dense
                    v-model="formValue.envK8s.envName"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_name_tip_1')"
                    persistent-hint
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                  />
                </div>
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_desc')"
                    required
                    dense
                    v-model="formValue.envK8s.envDesc"
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_desc_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="form-item-45">
                  <v-autocomplete
                    v-model="formValue.envK8s.tenantCode"
                    :items="tenantCodes"
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                    :required="userObj.isTenantAdmin && !userObj.isAdmin"
                    :clearable="userObj.isAdmin"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_host')"
                      required
                      dense
                      v-model="formValue.envK8s.host"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_host_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_port')"
                      required
                      dense
                      v-model.number="formValue.envK8s.port"
                      type="number"
                      :rules="[intRule]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_port_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_token')"
                      required
                      dense
                      v-model="formValue.envK8s.token"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_token_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ca_crt_base64')"
                      required
                      dense
                      v-model="formValue.envK8s.caCrtBase64"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ca_crt_base64_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_view_host')"
                      required
                      dense
                      v-model="formValue.envK8s.viewHost"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_view_host_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url')"
                      required
                      dense
                      v-model="formValue.envK8s.dashboardUrl"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ingress_controller_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.ingressControllerNamespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_network_policy')"
                      required
                      dense
                      v-model="formValue.envK8s.dashboardUrlNetworkPolicy"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_network_policy_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_istio_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.istioNamespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_timezone')"
                      required
                      dense
                      v-model="formValue.envK8s.timezone"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_image_repo_use_external')"
                      v-model="formValue.envK8s.imageRepoUseExternal"
                      dense
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_artifact_repo_use_external')"
                      v-model="formValue.envK8s.artifactRepoUseExternal"
                      dense
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range_start')"
                      required
                      dense
                      v-model.number="formValue.envK8s.nodePortRange.nodePortRangeStart"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range_end')"
                      required
                      dense
                      v-model.number="formValue.envK8s.nodePortRange.nodePortRangeEnd"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.namespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_stateful_set_name')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.statefulSetName"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_path')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_path_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings_project_data_pod_image')"
                      required
                      dense
                      v-model="formValue.envK8s.podImageSettings.projectDataPodImage"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings_busybox_image')"
                      required
                      dense
                      v-model="formValue.envK8s.podImageSettings.busyboxImage"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <div class="form-item mt-4">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local'), value: 'pvConfigLocal'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs'), value: 'pvConfigCephfs'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs'), value: 'pvConfigNfs'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings')"
                    @change="chooseParams($event)"
                    required
                    :value="paramVolumeValue()"
                    dense
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                  />
                </div>
                <div v-if="formValue.envK8s.localFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-100 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local_local_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigLocal.localPath"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="formValue.envK8s.cephfsFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_user')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephUser"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_secret')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephSecret"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4 d-flex align-center">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_monitors')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephMonitors"
                        multiple
                        small-chips
                        hide-selected
                        append-icon=""
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_monitors_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephPath"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_path_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="formValue.envK8s.nfsFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_server')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigNfs.nfsServer"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_server_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigNfs.nfsPath"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_path_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addArchSetting()">mdi-table-plus</v-icon>
                <div class="justify-space-between params-item mt-4" v-for="(archSetting, i) in formValue.envK8s.archSettings" :key="i">
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45">
                      <v-autocomplete
                        :items="archNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_arch')"
                        v-model="archSetting.arch"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                        dense
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyArchSetting(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteArchSetting(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                  <div class="mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addArchSettingNodeSelector(i)">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, j) in archSetting.nodeSelector" :key="j">
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_label_name')"
                          dense
                          v-model="row[0]"
                          :rules="[
                            v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                          ]"
                        />
                      </div>
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_label_value')"
                          dense
                          v-model="row[1]"
                          :rules="[
                            v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                          ]"
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyArchSettingNodeSelector(i, j)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteArchSettingNodeSelector(i, j)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addProjectNodeSelector()">mdi-table-plus</v-icon>
                <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.projectNodeSelector" :key="i">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_label_name')"
                      dense
                      v-model="row[0]"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_label_value')"
                      dense
                      v-model="row[1]"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyProjectNodeSelector(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteProjectNodeSelector(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45">
                    <v-autocomplete
                      v-model="formValue.envK8s.disabledDefs"
                      :items="disabledDefNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs')"
                      dense
                      multiple
                      small-chips
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </div>
                  <div class="form-item-45">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="formValue.envK8s.disabledPatches"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches_tip_1')"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_quota_config')}}</small>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.memoryRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.cpuRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.memoryLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.cpuLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraRequest()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.defaultQuota.extraRequest" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraRequest(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraRequest(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraLimit()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.defaultQuota.extraLimit" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraLimit(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraLimit(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.memoryRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.cpuRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.memoryLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.cpuLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit')"
                        required
                        dense
                        type="number"
                        v-model.number="formValue.envK8s.quotaConfig.namespaceQuota.podsLimit"
                        :rules="[intRule]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraQuotas()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraQuotas(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraQuotas(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template v-slot:updateEnv v-if="operationCardConfig.attrs.formEls.includes('updateEnv')">
          <v-form ref="envRef">
            <div class="env-wrap">
              <div class="d-flex justify-space-between">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_desc')"
                    required
                    dense
                    v-model="formValue.envK8s.envDesc"
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_env_desc_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45">
                  <v-autocomplete
                    v-model="formValue.envK8s.tenantCode"
                    :items="tenantCodes"
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                    dense
                    clearable
                    disabled
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_host')"
                      required
                      dense
                      v-model="formValue.envK8s.host"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_host_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_port')"
                      required
                      dense
                      v-model.number="formValue.envK8s.port"
                      type="number"
                      :rules="[intRule]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_port_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-40 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_token')"
                      required
                      dense
                      v-model="formValue.envK8s.token"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_token_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ca_crt_base64')"
                      required
                      dense
                      v-model="formValue.envK8s.caCrtBase64"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ca_crt_base64_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_view_host')"
                      required
                      dense
                      v-model="formValue.envK8s.viewHost"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_view_host_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url')"
                      required
                      dense
                      v-model="formValue.envK8s.dashboardUrl"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_ingress_controller_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.ingressControllerNamespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_network_policy')"
                      required
                      dense
                      v-model="formValue.envK8s.dashboardUrlNetworkPolicy"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_dashboard_url_network_policy_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_istio_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.istioNamespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_timezone')"
                      required
                      dense
                      v-model="formValue.envK8s.timezone"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_image_repo_use_external')"
                      v-model="formValue.envK8s.imageRepoUseExternal"
                      dense
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_artifact_repo_use_external')"
                      v-model="formValue.envK8s.artifactRepoUseExternal"
                      dense
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range_start')"
                      required
                      dense
                      v-model.number="formValue.envK8s.nodePortRange.nodePortRangeStart"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_node_port_range_end')"
                      required
                      dense
                      v-model.number="formValue.envK8s.nodePortRange.nodePortRangeEnd"
                      :rules="[intRule]"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_namespace')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.namespace"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_stateful_set_name')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.statefulSetName"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_path')"
                      required
                      dense
                      v-model="formValue.envK8s.projectDataPod.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_project_data_pod_path_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings')}}</small>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings_project_data_pod_image')"
                      required
                      dense
                      v-model="formValue.envK8s.podImageSettings.projectDataPodImage"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pod_image_settings_busybox_image')"
                      required
                      dense
                      v-model="formValue.envK8s.podImageSettings.busyboxImage"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <div class="form-item mt-4">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local'), value: 'pvConfigLocal'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs'), value: 'pvConfigCephfs'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs'), value: 'pvConfigNfs'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings')"
                    @change="chooseParams($event)"
                    required
                    :value="paramVolumeValue()"
                    dense
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                  />
                </div>
                <div v-if="formValue.envK8s.localFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-100 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_local_local_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigLocal.localPath"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="formValue.envK8s.cephfsFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_user')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephUser"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_secret')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephSecret"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4 d-flex align-center">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_monitors')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephMonitors"
                        multiple
                        small-chips
                        hide-selected
                        append-icon=""
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_monitors_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigCephfs.cephPath"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_cephfs_ceph_path_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="formValue.envK8s.nfsFlag">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_server')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigNfs.nfsServer"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_server_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_path')"
                        required
                        dense
                        v-model="formValue.envK8s.pvConfigNfs.nfsPath"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_pv_config_nfs_nfs_path_tip_1')"
                        persistent-hint
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addArchSetting()">mdi-table-plus</v-icon>
                <div class="justify-space-between params-item mt-4" v-for="(archSetting, i) in formValue.envK8s.archSettings" :key="i">
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45">
                      <v-autocomplete
                        :items="archNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_arch')"
                        v-model="archSetting.arch"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                        dense
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyArchSetting(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteArchSetting(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                  <div class="mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addArchSettingNodeSelector(i)">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, j) in archSetting.nodeSelector" :key="j">
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_label_name')"
                          dense
                          v-model="row[0]"
                          :rules="[
                            v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                          ]"
                        />
                      </div>
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_connection_settings_arch_settings_node_selector_label_value')"
                          dense
                          v-model="row[1]"
                          :rules="[
                            v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                          ]"
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyArchSettingNodeSelector(i, j)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteArchSettingNodeSelector(i, j)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addProjectNodeSelector()">mdi-table-plus</v-icon>
                <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.projectNodeSelector" :key="i">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_label_name')"
                      dense
                      v-model="row[0]"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_env_k8s_pv_settings_project_node_selector_label_value')"
                      dense
                      v-model="row[1]"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyProjectNodeSelector(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteProjectNodeSelector(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-45">
                    <v-autocomplete
                      v-model="formValue.envK8s.disabledDefs"
                      :items="disabledDefNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs')"
                      dense
                      multiple
                      small-chips
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </div>
                  <div class="form-item-45">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="formValue.envK8s.disabledPatches"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches_tip_1')"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
                  </div>
                </div>
              </div>              
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_env_k8s_quota_config')}}</small>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.memoryRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.cpuRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.memoryLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.defaultQuota.cpuLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraRequest()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.defaultQuota.extraRequest" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraRequest(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraRequest(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraLimit()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.defaultQuota.extraLimit" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraLimit(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraLimit(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.memoryRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.cpuRequest"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.memoryLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit')"
                        required
                        dense
                        v-model="formValue.envK8s.quotaConfig.namespaceQuota.cpuLimit"
                        :rules="[
                          v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                        ]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit')"
                        required
                        dense
                        type="number"
                        v-model.number="formValue.envK8s.quotaConfig.namespaceQuota.podsLimit"
                        :rules="[intRule]"
                      />
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraQuotas()">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas" :key="i">
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                          dense
                          v-model="row.name"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                          dense
                          v-model="row.value"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraQuotas(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraQuotas(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template v-slot:addPV v-if="operationCardConfig.attrs.formEls.includes('addPV')">
          <v-form ref="pvRef">
            <div class="pv-wrap">
              <div class="d-flex justify-space-between">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_pv_pv_name')"
                    required
                    dense
                    v-model="formValue.pvName"
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                    ]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_pv_pv_name_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
            </div>
            <div class="form-item-100 mt-4">
              <v-autocomplete
                :items="[ true, false ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_pv_read_only')"
                v-model="formValue.pvDefYaml.readOnly"
                :hint="$vuetify.lang.t('$vuetify.lang_form_pv_read_only_tip_1')"
                persistent-hint
                dense
              />
            </div>
            <div class="params-item">
              <div class="form-item mt-4">
                <v-autocomplete
                  :items="[
                    { text: $vuetify.lang.t('$vuetify.lang_form_pv_host_path'), value: 'hostPath' },
                    { text: $vuetify.lang.t('$vuetify.lang_form_pv_cephfs'), value: 'cephfs' },
                    { text: $vuetify.lang.t('$vuetify.lang_form_pv_rbd'), value: 'rbd' },
                    { text: $vuetify.lang.t('$vuetify.lang_form_pv_glusterfs'), value: 'glusterfs' },
                    { text: $vuetify.lang.t('$vuetify.lang_form_pv_nfs'), value: 'nfs' },
                  ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_pv_type')"
                  persistent-hint
                  dense
                  :value="pvValue()"
                  @change="pvChange($event)"
                />
              </div>
              <div class="mt-4" v-if="formValue.pvDefYaml.hostPathFlag">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pv_host_path_tip_1')}}</small>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item-100">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_host_path_path')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.hostPath.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4" v-if="formValue.pvDefYaml.cephfsFlag">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_tip_1')}}</small>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item-100">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_monitors')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.cephfs.monitors"
                      multiple
                      small-chips
                      hide-selected
                      append-icon=""
                      :rules="[
                        v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_monitors_tip_1')"
                      persistent-hint
                    />
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_keyring')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.cephfs.keyring"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_user')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.cephfs.user"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_path')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.cephfs.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_cephfs_path_tip_1')"
                      persistent-hint
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4" v-if="formValue.pvDefYaml.rbdFlag">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pv_rbd_tip_1')}}</small>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item-100">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_monitors')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.monitors"
                      multiple
                      small-chips
                      hide-selected
                      append-icon=""
                      :rules="[
                        v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_monitors_tip_1')"
                      persistent-hint
                    />
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_keyring')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.keyring"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_user')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.user"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_image')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.image"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_pool')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.pool"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                  <div class="form-item">
                    <v-autocomplete
                      :items="[ 'ext4', 'xfs' ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_rbd_fs_type')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.rbd.fsType"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4" v-if="formValue.pvDefYaml.glusterfsFlag">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_tip_1')}}</small>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_endpoint_ips')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.glusterfs.endpointIPs"
                      multiple
                      small-chips
                      hide-selected
                      append-icon=""
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_endpoint_ips_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_endpoint_port')"
                      required
                      dense
                      type="number"
                      v-model.number="formValue.pvDefYaml.glusterfs.endpointPort"
                      :rules="[intRule]"
                    />
                  </div>
                  <div class="form-item">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_path')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.glusterfs.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_glusterfs_path_tip_1')"
                      persistent-hint
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4" v-if="formValue.pvDefYaml.nfsFlag">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pv_nfs_tip_1')}}</small>
                <div class="d-flex justify-space-between mt-2">
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_nfs_server')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.nfs.server"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_nfs_server_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_pv_nfs_path')"
                      required
                      dense
                      v-model="formValue.pvDefYaml.nfs.path"
                      :rules="[
                        v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      ]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_pv_nfs_path_tip_1')"
                      persistent-hint
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </template>
      </OperationCard>
    </v-dialog>
    <v-dialog
      v-model="logDialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</span>
        </v-card-title>
        <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 300px;">
            <pre
              v-for="(logMsg, i) in logCardConfig.attrs.logList"
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
            @click="(logCardConfig.listeners.confirm || (() => {}))"
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
    <v-dialog
      v-model="auditDialog"
      max-width="960px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</span>
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
              this.$observables.queryPage$.next('refresh')
            }"
            :disabled="disableBtn"
            :loading="disableBtn"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import ENV_API from '@/api/admin/env'
import { catchError, mergeMap, tap, withLatestFrom, filter, map, pluck, finalize, scan, switchMap, take, exhaustMap, takeUntil } from 'rxjs/operators'
import { defer, of, race, Subject } from 'rxjs'
import { rtnRetryWhenOperator } from '@/utils/request'
import OperationCard from '@/lib/ui-lib/components/OperationCard'
import { webSocket } from 'rxjs/webSocket'
import User from '@/services/user'
import EnvPvsDataTable from '@/components/EnvPvsDataTable'
import YAML from "yamljs";
import request from "@/utils/request";
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'Envs',
  components: {
    EnvPvsDataTable,
    OperationCard,
    PageCard,
    Operations,
    Monaco
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  subscriptions () {
    return {
      queryPage$: new Subject(),
      queryEnvNames$: new Subject(),
      queryPvs$: new Subject(),
      addPvClick$: new Subject(),
      deletePvClick$: new Subject(),
      modifyPvClick$: new Subject(),
      addEnvClick$: new Subject(),
      deleteEnvClick$: new Subject(),
      modifyEnvClick$: new Subject(),
      copyEnvClick$: new Subject(),
    }
  },
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
      pageRequest: {
        tenantCodes: [],
        envNames: [],
        fromFile: '',
        page: 1,
        perPage: 10
      },
      pageResponse: {
        data: {
          envK8ss: []
        }
      },
      envNamesResponse: {
        data: {
          envNames: []
        }
      },
      operationDialog: false,
      operationCardConfig: {
        attrs: {
          title: null,
          formEls: [],
          formRef: null,
          formInfo: null,
          confirmLoading: false
        },
        listeners: {
          cancel: null,
          confirm: null
        }
      },
      archNames: [],
      formValue: {},
      logDialog: false,
      logCardConfig: {
        attrs: {
          logList: []
        },
        listeners: {
          confirm: null
        }
      },
      YAMLDialog: false,
      yamlText: "",
      userToken: '',
      auditDialog: false,
      logList: [],
      disableBtn: false,
      dialogWidth: '1200px',
      targetEnvName: '',
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
      tenantCodes: [],
      disabledDefNames: [],
    }
  },
  methods: {
    addArchSetting() {
      const vm = this;
      var addItem = {
        arch: '',
        nodeSelector: [],
      };
      if (vm.formValue.envK8s.archSettings === null) {
        vm.formValue.envK8s.archSettings = [];
        vm.formValue.envK8s.archSettings.push(addItem);
      } else {
        vm.formValue.envK8s.archSettings.push(addItem);
      }
    },
    copyArchSetting(i) {
      const vm = this
      let copyItem = JSON.parse(JSON.stringify(vm.formValue.envK8s.archSettings[i]));
      vm.formValue.envK8s.archSettings.push(copyItem);
    },
    deleteArchSetting(i) {
      const vm = this
      vm.formValue.envK8s.archSettings.splice(i, 1)
    },
    addArchSettingNodeSelector(i) {
      const vm = this;
      var addItem = [];
      if (vm.formValue.envK8s.archSettings[i].nodeSelector === null) {
        vm.formValue.envK8s.archSettings[i].nodeSelector = [];
        vm.formValue.envK8s.archSettings[i].nodeSelector.push(addItem);
      } else {
        vm.formValue.envK8s.archSettings[i].nodeSelector.push(addItem);
      }
    },
    copyArchSettingNodeSelector(i, j) {
      const vm = this
      let copyItem = JSON.parse(JSON.stringify(vm.formValue.envK8s.archSettings[i].nodeSelector[j]));
      vm.formValue.envK8s.archSettings[i].nodeSelector.push(copyItem);
    },
    deleteArchSettingNodeSelector(i, j) {
      const vm = this
      vm.formValue.envK8s.archSettings[i].nodeSelector.splice(j, 1)
    },
    addProjectNodeSelector() {
      const vm = this;
      var addItem = [];
      if (vm.formValue.envK8s.projectNodeSelector === null) {
        vm.formValue.envK8s.projectNodeSelector = [];
        vm.formValue.envK8s.projectNodeSelector.push(addItem);
      } else {
        vm.formValue.envK8s.projectNodeSelector.push(addItem);
      }
    },
    copyProjectNodeSelector(i) {
      const vm = this
      let copyItem = JSON.parse(JSON.stringify(vm.formValue.envK8s.projectNodeSelector[i]));
      vm.formValue.envK8s.projectNodeSelector.push(copyItem);
    },
    deleteProjectNodeSelector(i) {
      const vm = this
      vm.formValue.envK8s.projectNodeSelector.splice(i, 1)
    },
    addExtraQuotas() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas === null) {
        vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas = [];
        vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas.push(addItem);
      } else {
        vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas.push(addItem);
      }
    },
    copyExtraQuotas(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas[i]
        )
      );
      vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas.push(copyItem);
    },
    deleteExtraQuotas(i) {
      const vm = this;
      vm.formValue.envK8s.quotaConfig.namespaceQuota.extraQuotas.splice(i,1);
    },
    addExtraRequest() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest === null) {
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest = [];
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest.push(addItem);
      } else {
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest.push(addItem);
      }
    },
    copyExtraRequest(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest[i]
        )
      );
      vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest.push(copyItem);
    },
    deleteExtraRequest(i) {
      const vm = this;
      vm.formValue.envK8s.quotaConfig.defaultQuota.extraRequest.splice(i,1);
    },
    addExtraLimit() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit === null) {
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit = [];
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit.push(addItem);
      } else {
        vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit.push(addItem);
      }
    },
    copyExtraLimit(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit[i]
        )
      );
      vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit.push(copyItem);
    },
    deleteExtraLimit(i) {
      const vm = this;
      vm.formValue.envK8s.quotaConfig.defaultQuota.extraLimit.splice(i,1);
    },
    chooseParams(e) {
      console.log(e)
      const vm = this
      if(e === 'pvConfigLocal'){
        vm.formValue.envK8s.localFlag = true
        vm.formValue.envK8s.cephfsFlag = false
        vm.formValue.envK8s.glusterfsFlag = false
        vm.formValue.envK8s.nfsFlag = false
      }else if(e === 'pvConfigCephfs'){
        vm.formValue.envK8s.localFlag = false
        vm.formValue.envK8s.cephfsFlag = true
        vm.formValue.envK8s.glusterfsFlag = false
        vm.formValue.envK8s.nfsFlag = false
      }else if(e === 'pvConfigNfs'){
        vm.formValue.envK8s.localFlag = false
        vm.formValue.envK8s.cephfsFlag = false
        vm.formValue.envK8s.glusterfsFlag = false
        vm.formValue.envK8s.nfsFlag = true
      }
      vm.$forceUpdate()
    },
    paramVolumeValue() {
      const vm = this
      if(vm.formValue.envK8s.localFlag){
        return 'pvConfigLocal'
      }else if(vm.formValue.envK8s.cephfsFlag){
        return 'pvConfigCephfs'
      }else if(vm.formValue.envK8s.nfsFlag){
        return 'pvConfigNfs'
      }
    },
    previewEnv() {
      const vm = this
      if(vm.$refs.envRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.formValue.envK8s))
        if(!copyData.localFlag){
          delete copyData.pvConfigLocal
        }
        if(!copyData.cephfsFlag){
          delete copyData.pvConfigCephfs
        }
        // if(!copyData.glusterfsFlag){
        //   delete copyData.pvConfigGlusterfs
        // }
        if(!copyData.nfsFlag){
          delete copyData.pvConfigNfs
        }
        delete copyData.localFlag
        delete copyData.cephfsFlag
        delete copyData.glusterfsFlag
        delete copyData.nfsFlag
        if (copyData.projectNodeSelector !== null) {
          var newObj = {}
          copyData.projectNodeSelector.map(item => {
            newObj[item[0]] = item[1]
          })
          copyData.projectNodeSelector = newObj
        }
        if (copyData.archSettings !== null) {
          copyData.archSettings.map(item => {
            var newSelector = {}
            item.nodeSelector.map(selector => {
              newSelector[selector[0]] = selector[1]
            })
            item.nodeSelector = newSelector
            return item
          })
        }
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    addEnv() {
      const vm = this
      if(vm.$refs.envRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.formValue.envK8s))
        if(!copyData.localFlag){
          delete copyData.pvConfigLocal
        }
        if(!copyData.cephfsFlag){
          delete copyData.pvConfigCephfs
        }
        // if(!copyData.glusterfsFlag){
        //   delete copyData.pvConfigGlusterfs
        // }
        if(!copyData.nfsFlag){
          delete copyData.pvConfigNfs
        }
        delete copyData.localFlag
        delete copyData.cephfsFlag
        delete copyData.glusterfsFlag
        delete copyData.nfsFlag
        if (copyData.projectNodeSelector !== null) {
          var newObj = {}
          copyData.projectNodeSelector.map(item => {
            newObj[item[0]] = item[1]
          })
          copyData.projectNodeSelector = newObj
        }
        if (copyData.archSettings !== null) {
          copyData.archSettings.map(item => {
            var newSelector = {}
            item.nodeSelector.map(selector => {
              newSelector[selector[0]] = selector[1]
            })
            item.nodeSelector = newSelector
            return item
          })
        }
        let envK8sYaml = YAML.stringify(copyData, 4)
        request.post('/admin/env', {
          envK8sYaml: envK8sYaml
        }).then(response => {
          vm.operationDialog = false
          vm.showLog(response)
          vm.successTip(true, response.msg);
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateEnv() {
      const vm = this
      if(vm.$refs.envRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.formValue.envK8s))
        if(!copyData.localFlag){
          delete copyData.pvConfigLocal
        }
        if(!copyData.cephfsFlag){
          delete copyData.pvConfigCephfs
        }
        // if(!copyData.glusterfsFlag){
        //   delete copyData.pvConfigGlusterfs
        // }
        if(!copyData.nfsFlag){
          delete copyData.pvConfigNfs
        }
        delete copyData.localFlag
        delete copyData.cephfsFlag
        delete copyData.glusterfsFlag
        delete copyData.nfsFlag
        if (copyData.projectNodeSelector !== null) {
          var newObj = {}
          copyData.projectNodeSelector.map(item => {
            newObj[item[0]] = item[1]
          })
          copyData.projectNodeSelector = newObj
        }
        if (copyData.archSettings !== null) {
          copyData.archSettings.map(item => {
            var newSelector = {}
            item.nodeSelector.map(selector => {
              newSelector[selector[0]] = selector[1]
            })
            item.nodeSelector = newSelector
            return item
          })
        }
        let envK8sYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/env/${vm.targetEnvName}`, {
          envK8sYaml: envK8sYaml
        }).then(response => {
          vm.operationDialog = false
          vm.showLog(response)
          vm.successTip(true, response.msg);
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    pvValue() {
      const vm = this
      if(vm.formValue.pvDefYaml.hostPathFlag){
        return 'hostPath'
      }else if(vm.formValue.pvDefYaml.cephfsFlag){
        return 'cephfs'
      }else if(vm.formValue.pvDefYaml.glusterfsFlag){
        return 'glusterfs'
      }else if(vm.formValue.pvDefYaml.nfsFlag){
        return 'nfs'
      }else if(vm.formValue.pvDefYaml.rbdFlag) {
        return 'rbd'
      }else{
        vm.formValue.pvDefYaml.hostPathFlag = true
        return 'hostPath'
      }
    },
    pvChange(e) {
      const vm = this
      if(e === 'hostPath'){
        vm.formValue.pvDefYaml.hostPathFlag = true
        vm.formValue.pvDefYaml.cephfsFlag = false
        vm.formValue.pvDefYaml.glusterfsFlag = false
        vm.formValue.pvDefYaml.nfsFlag = false
        vm.formValue.pvDefYaml.rbdFlag = false
      }else if(e === 'cephfs'){
        vm.formValue.pvDefYaml.hostPathFlag = false
        vm.formValue.pvDefYaml.cephfsFlag = true
        vm.formValue.pvDefYaml.glusterfsFlag = false
        vm.formValue.pvDefYaml.nfsFlag = false
        vm.formValue.pvDefYaml.rbdFlag = false
      }else if(e === 'glusterfs'){
        vm.formValue.pvDefYaml.hostPathFlag = false
        vm.formValue.pvDefYaml.cephfsFlag = false
        vm.formValue.pvDefYaml.glusterfsFlag = true
        vm.formValue.pvDefYaml.nfsFlag = false
        vm.formValue.pvDefYaml.rbdFlag = false
      }else if(e === 'nfs'){
        vm.formValue.pvDefYaml.hostPathFlag = false
        vm.formValue.pvDefYaml.cephfsFlag = false
        vm.formValue.pvDefYaml.glusterfsFlag = false
        vm.formValue.pvDefYaml.nfsFlag = true
        vm.formValue.pvDefYaml.rbdFlag = false
      }else if(e === 'rbd'){
        vm.formValue.pvDefYaml.hostPathFlag = false
        vm.formValue.pvDefYaml.cephfsFlag = false
        vm.formValue.pvDefYaml.glusterfsFlag = false
        vm.formValue.pvDefYaml.nfsFlag = false
        vm.formValue.pvDefYaml.rbdFlag = true
      }
      vm.$forceUpdate()
    },
    previewPV() {
      const vm = this
      if(vm.$refs.pvRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.formValue.pvDefYaml))
        if(!copyData.hostPathFlag){
          delete copyData.hostPath
        }
        if(!copyData.cephfsFlag){
          delete copyData.cephfs
        }
        if(!copyData.glusterfsFlag){
          delete copyData.glusterfs
        }
        if(!copyData.nfsFlag){
          delete copyData.nfs
        }
        if(!copyData.rbdFlag){
          delete copyData.rbd
        }
        delete copyData.hostPathFlag
        delete copyData.cephfsFlag
        delete copyData.glusterfsFlag
        delete copyData.nfsFlag
        delete copyData.rbdFlag
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    addPV(envName) {
      const vm = this
      if(vm.$refs.pvRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.formValue.pvDefYaml))
        if(!copyData.hostPathFlag){
          delete copyData.hostPath
        }
        if(!copyData.cephfsFlag){
          delete copyData.cephfs
        }
        if(!copyData.glusterfsFlag){
          delete copyData.glusterfs
        }
        if(!copyData.nfsFlag){
          delete copyData.nfs
        }
        if(!copyData.rbdFlag){
          delete copyData.rbd
        }
        delete copyData.hostPathFlag
        delete copyData.cephfsFlag
        delete copyData.glusterfsFlag
        delete copyData.nfsFlag
        delete copyData.rbdFlag
        var pvDefYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/env/${envName}/pvAdd`, {
          pvName: vm.formValue.pvName,
          pvDefYaml: pvDefYaml
        }).then(response => {
          vm.operationDialog = false
          vm.$observables.queryPage$.next('refresh')
          vm.successTip(true, response.msg);
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    closeYaml() {
      const vm = this;
      vm.$refs.monaco.monacoEditor.setValue('')
      vm.YAMLDialog = false;
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
        vm.ws.onclose = (e) => {
          vm.disableBtn = false
          vm.logList.push({logType: 'END'})
        }
      }
    },
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    request.get('/public/about').then(response => {
      vm.disabledDefNames = response.data.config.disabledDefNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get(`/admin/archNames`).then(response => {
      vm.archNames = response.data.archNames
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get(`/admin/tenantCodes`).then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    vm.$observables.queryPvs$.pipe(
      mergeMap(next => {
        const index = next.index
        const envName = next.envName
        return defer(() => { return ENV_API.getEnvPvs(envName) }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return of(null)
          }),
          withLatestFrom(of(index))
        )
      }),
      filter(next => next[0])
    ).subscribe(next => {
      vm.pageResponse.data.envK8ss[next[1]].pvs = next[0].data.pvs
    })
    vm.$observables.queryPage$.pipe(
      mergeMap(next => {
        return defer(() => {
          return ENV_API.getEnvs(vm.pageRequest)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return of(null)
          })
        )
      }),
      filter(next => next),
      withLatestFrom(vm.$observables.queryPage$),
      tap(next => {
        next[0].data.envK8ss.forEach((row, index) => {
          row.pvs = []
          row.index = index
        })
        vm.pageResponse = next[0]
        if (next[1] !== 'init') {
          vm.successTip(true, next[0].msg)
        }
      }),
      mergeMap(next => {
        return next[0].data.envK8ss
      }),
      tap(next => {
        vm.$observables.queryPvs$.next(next)
      })
    ).subscribe(next => {
    })
    vm.$observables.queryEnvNames$.pipe(
      mergeMap(next => {
        return defer(() => {
          return ENV_API.getEnvNames()
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return of(null)
          })
        )
      }),
      filter(next => next)
    ).subscribe(next => {
      vm.envNamesResponse = next
    })
    function clearOperationCard () {
      vm.operationCardConfig.attrs.confirmLoading = false
      vm.operationCardConfig.attrs.title = ''
      vm.operationCardConfig.attrs.formRef = null
      vm.operationCardConfig.attrs.formInfo = ''
      vm.operationCardConfig.attrs.formEls = []
      vm.operationCardConfig.listeners.cancel = null
      vm.operationCardConfig.listeners.confirm = null
    }

    vm.$watchAsObservable('operationDialog').pipe(
      pluck('newValue'),
      filter(next => !next),
      tap(next => {
        clearOperationCard()
      })
    ).subscribe(() => {})
    vm.$observables.addEnvClick$.pipe(
      map(next => {
        return [next, new Subject(), Vue.observable({
          envK8s: {}
        })]
      }),
      tap(next => {
        const formValue = next[2]
        vm.formValue = formValue
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_new_env')
        vm.operationCardConfig.attrs.formRef = 'addEnvForm'
        vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="info">
          <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_env_prompt')}</small>
        </v-alert>
        ENV_API.getDefaultEnv().then(response => {
          vm.formValue.envK8s = response.data.envK8s
          if (!vm.userObj.isAdmin) {
            vm.formValue.envK8s.tenantCode = vm.tenantCodes[0]
          }
          if(vm.formValue.envK8s.pvConfigLocal.localPath === ''){
            vm.formValue.envK8s.localFlag = false
          }else{
            vm.formValue.envK8s.localFlag = true
          }
          if(vm.formValue.envK8s.pvConfigCephfs.cephMonitors === null && vm.formValue.envK8s.pvConfigCephfs.cephPath === '' && vm.formValue.envK8s.pvConfigCephfs.cephSecret === '' && vm.formValue.envK8s.pvConfigCephfs.cephUser === ''){
            vm.formValue.envK8s.cephfsFlag = false
          }else{
            vm.formValue.envK8s.cephfsFlag = true
          }
          // if(vm.formValue.envK8s.pvConfigGlusterfs.endpointIPs === null && vm.formValue.envK8s.pvConfigGlusterfs.endpointPort === 0 && vm.formValue.envK8s.pvConfigGlusterfs.path === ''){
          //   vm.formValue.envK8s.glusterfsFlag = false
          // }else{
          //   vm.formValue.envK8s.glusterfsFlag = true
          // }
          if(vm.formValue.envK8s.pvConfigNfs.nfsPath === '' && vm.formValue.envK8s.pvConfigNfs.nfsServer === ''){
            vm.formValue.envK8s.nfsFlag = false
          }else{
            vm.formValue.envK8s.nfsFlag = true
          }
          if(vm.formValue.envK8s.projectNodeSelector !== null){
            var projectNodeSelectorList = []
            Object.keys(vm.formValue.envK8s.projectNodeSelector).map(item => {
              let obj = []
              obj[0] = item
              obj[1] = vm.formValue.envK8s.projectNodeSelector[item]
              projectNodeSelectorList.push(obj)
            })
            vm.formValue.envK8s.projectNodeSelector = projectNodeSelectorList
          }
          if(vm.formValue.envK8s.archSettings !== null){
            var archSettingsList = []
            vm.formValue.envK8s.archSettings.map(archSetting => {
              var nodeSelectorList = []
              Object.keys(archSetting.nodeSelector).map(item => {
                let obj = []
                obj[0] = item
                obj[1] = archSetting.nodeSelector[item]
                nodeSelectorList.push(obj)
              })
              archSetting.nodeSelector = nodeSelectorList
              archSettingsList.push(archSetting)
            })
            vm.formValue.envK8s.archSettings = archSettingsList
          }
          vm.operationCardConfig.attrs.formEls = ['addEnv']
        })
        vm.operationCardConfig.listeners.top = true
        vm.operationCardConfig.listeners.close = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.preview = () => { vm.previewEnv() }
        vm.operationCardConfig.listeners.update = () => { vm.addEnv() }
        // vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
        // vm.operationCardConfig.listeners.confirm = () => { next[1].next(true) }
        vm.dialogWidth = '1200px'
        vm.operationDialog = true
      }),
      mergeMap(next => {
        return race([
          next[1],
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      mergeMap(next => {
        const envConfig = next[2]
        // const envConfig = next[1]
        return defer(() => {
          return ENV_API.createEnv(envConfig)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.successTip(true, next.msg)
      }),
      tap(next => {
        vm.logDialog = true
        vm.logCardConfig.listeners.confirm = () => { vm.logDialog = false }
      }),
      switchMap(next => {
        return webSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${next.data.auditID}?x-user-token=${User.getInstance().state.userObj.userToken}`).pipe(
          catchError(error => {
            console.log(error)
            return of(null)
          }),
          finalize(() => {
            console.log('final')
          }),
          filter(next => next),
          takeUntil(vm.$watchAsObservable('logDialog').pipe(
            pluck('newValue'),
            filter(next => next === false),
            take(1)
          )),
          scan((acc, next) => {
            acc.push(next)
            return acc
          }, []),
          tap(next => {
            vm.logCardConfig.attrs.logList = next
          })
        )
      }),
      switchMap(next => {
        return vm.$watchAsObservable('logDialog').pipe(
          pluck('newValue'),
          filter(next => next === false),
          take(1)
        )
      }),
      tap(next => {
        vm.logCardConfig.attrs.logList = []
        vm.$observables.queryPage$.next('envAdd')
      })
    ).subscribe(next => {})

    vm.$observables.copyEnvClick$.pipe(
      map(next => {
        return [next, new Subject(), Vue.observable({
          envK8s: next,
        })]
      }),
      tap(next => {
        const formValue = next[2]
        vm.formValue = { ...formValue }
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_new_env')
        vm.operationCardConfig.attrs.formRef = 'addEnvForm'
        vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="info">
          <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_env_prompt')}</small>
        </v-alert>
        if (!vm.userObj.isAdmin) {
          vm.formValue.envK8s.tenantCode = vm.tenantCodes[0]
        }
        if(vm.formValue.envK8s.pvConfigLocal.localPath === ''){
          vm.formValue.envK8s.localFlag = false
        }else{
          vm.formValue.envK8s.localFlag = true
        }
        if(vm.formValue.envK8s.pvConfigCephfs.cephMonitors === null && vm.formValue.envK8s.pvConfigCephfs.cephPath === '' && vm.formValue.envK8s.pvConfigCephfs.cephSecret === '' && vm.formValue.envK8s.pvConfigCephfs.cephUser === ''){
          vm.formValue.envK8s.cephfsFlag = false
        }else{
          vm.formValue.envK8s.cephfsFlag = true
        }
        // if(vm.formValue.envK8s.pvConfigGlusterfs.endpointIPs === null && vm.formValue.envK8s.pvConfigGlusterfs.endpointPort === 0 && vm.formValue.envK8s.pvConfigGlusterfs.path === ''){
        //   vm.formValue.envK8s.glusterfsFlag = false
        // }else{
        //   vm.formValue.envK8s.glusterfsFlag = true
        // }
        if(vm.formValue.envK8s.pvConfigNfs.nfsPath === '' && vm.formValue.envK8s.pvConfigNfs.nfsServer === ''){
          vm.formValue.envK8s.nfsFlag = false
        }else{
          vm.formValue.envK8s.nfsFlag = true
        }
        if(vm.formValue.envK8s.projectNodeSelector !== null){
          var projectNodeSelectorList = []
          Object.keys(vm.formValue.envK8s.projectNodeSelector).map(item => {
            let obj = []
            obj[0] = item
            obj[1] = vm.formValue.envK8s.projectNodeSelector[item]
            projectNodeSelectorList.push(obj)
          })
          vm.formValue.envK8s.projectNodeSelector = projectNodeSelectorList
        }
        if(vm.formValue.envK8s.archSettings !== null){
          var archSettingsList = []
          vm.formValue.envK8s.archSettings.map(archSetting => {
            var nodeSelectorList = []
            Object.keys(archSetting.nodeSelector).map(item => {
              let obj = []
              obj[0] = item
              obj[1] = archSetting.nodeSelector[item]
              nodeSelectorList.push(obj)
            })
            archSetting.nodeSelector = nodeSelectorList
            archSettingsList.push(archSetting)
          })
          vm.formValue.envK8s.archSettings = archSettingsList
        }
        vm.operationCardConfig.attrs.formEls = ['addEnv']
        vm.operationCardConfig.listeners.top = true
        vm.operationCardConfig.listeners.close = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.preview = () => { vm.previewEnv() }
        vm.operationCardConfig.listeners.update = () => { vm.addEnv() }
        // vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
        // vm.operationCardConfig.listeners.confirm = () => { next[1].next(true) }
        vm.dialogWidth = '1200px'
        vm.operationDialog = true
      }),
      mergeMap(next => {
        return race([
          next[1],
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      mergeMap(next => {
        const envConfig = next[2]
        // const envConfig = next[1]
        return defer(() => {
          return ENV_API.createEnv(envConfig)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.successTip(true, next.msg)
      }),
      tap(next => {
        vm.logDialog = true
        vm.logCardConfig.listeners.confirm = () => { vm.logDialog = false }
      }),
      switchMap(next => {
        return webSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${next.data.auditID}?x-user-token=${User.getInstance().state.userObj.userToken}`).pipe(
          catchError(error => {
            console.log(error)
            return of(null)
          }),
          finalize(() => {
            console.log('final')
          }),
          filter(next => next),
          takeUntil(vm.$watchAsObservable('logDialog').pipe(
            pluck('newValue'),
            filter(next => next === false),
            take(1)
          )),
          scan((acc, next) => {
            acc.push(next)
            return acc
          }, []),
          tap(next => {
            vm.logCardConfig.attrs.logList = next
          })
        )
      }),
      switchMap(next => {
        return vm.$watchAsObservable('logDialog').pipe(
          pluck('newValue'),
          filter(next => next === false),
          take(1)
        )
      }),
      tap(next => {
        vm.logCardConfig.attrs.logList = []
        vm.$observables.queryPage$.next('envAdd')
      })
    ).subscribe(next => {})

    vm.$observables.deleteEnvClick$.pipe(
      map(next => {
        return [next, new Subject(), Vue.observable({
          envName: ''
        })]
      }),
      tap(next => {
        const formValue = next[2]
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_delete_env')
        vm.operationCardConfig.attrs.formRef = 'deleteEnvForm'
        vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="error">
          <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_env_prompt')}<v-chip small color="red">{vuetify.preset.lang.t('$vuetify.lang_form_dangerous_operation')}</v-chip></small>
        </v-alert>
        vm.operationCardConfig.attrs.formEls = [
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_env_name')}
            required
            dense
            vModel={formValue.envName}
            rules={[
              v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required'),
              v => v === next[0].envName || vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', next[0].envName)
            ]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_delete_env_name_tip_1', next[0].envName)}
            persistent-hint
          />
        ]
        vm.operationCardConfig.listeners.top = false
        vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.confirm = () => { next[1].next(true) }
        vm.dialogWidth = '600px'
        vm.operationDialog = true
      }),
      mergeMap(next => {
        return race([
          next[1].pipe(
            map(confirm => {
              return vm.$refs.deleteEnvForm.validate()
            })
          ),
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      exhaustMap(next => {
        return defer(() => {
          return ENV_API.deleteEnv(next[1].envName)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.successTip(true, next.msg)
        vm.$observables.queryPage$.next('envDelete')
      })
    ).subscribe(next => {})

    vm.$observables.modifyEnvClick$.pipe(
      map(next => {
        vm.targetEnvName = next.envName
        return [next, new Subject(), Vue.observable({
          envK8s: next
        })]
      }),
      tap(next => {
        const formValue = next[2]
        vm.formValue = formValue
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_update_env') + '(' +vm.formValue.envK8s.envName + ')'
        vm.operationCardConfig.attrs.formRef = 'modifyEnvForm'
        if (formValue.envK8s.isFromFile) {
          vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="info">
            <small>{vuetify.preset.lang.t('$vuetify.lang_form_update_env_prompt')}</small>
            <div><small>{vuetify.preset.lang.t('$vuetify.lang_form_is_from_file_prompt')}</small></div>
          </v-alert>
        } else {
          vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="info">
            <small>{vuetify.preset.lang.t('$vuetify.lang_form_update_env_prompt')}</small>
          </v-alert>
        }
        if(vm.formValue.envK8s.pvConfigLocal.localPath === ''){
          vm.formValue.envK8s.localFlag = false
        }else{
          vm.formValue.envK8s.localFlag = true
        }
        if(vm.formValue.envK8s.pvConfigCephfs.cephMonitors instanceof Array){
          if(vm.formValue.envK8s.pvConfigCephfs.cephMonitors.length === 0 && vm.formValue.envK8s.pvConfigCephfs.cephPath === '' && vm.formValue.envK8s.pvConfigCephfs.cephSecret === '' && vm.formValue.envK8s.pvConfigCephfs.cephUser === ''){
            vm.formValue.envK8s.cephfsFlag = false
          }else{
            vm.formValue.envK8s.cephfsFlag = true
          }
        }else{
          if(vm.formValue.envK8s.pvConfigCephfs.cephMonitors === null && vm.formValue.envK8s.pvConfigCephfs.cephPath === '' && vm.formValue.envK8s.pvConfigCephfs.cephSecret === '' && vm.formValue.envK8s.pvConfigCephfs.cephUser === ''){
            vm.formValue.envK8s.cephfsFlag = false
          }else{
            vm.formValue.envK8s.cephfsFlag = true
          }
        }
        // if(vm.formValue.envK8s.pvConfigGlusterfs.endpointIPs === null && vm.formValue.envK8s.pvConfigGlusterfs.endpointPort === 0 && vm.formValue.envK8s.pvConfigGlusterfs.path === ''){
        //   vm.formValue.envK8s.glusterfsFlag = false
        // }else{
        //   vm.formValue.envK8s.glusterfsFlag = true
        // }
        if(vm.formValue.envK8s.pvConfigNfs.nfsPath === '' && vm.formValue.envK8s.pvConfigNfs.nfsServer === ''){
          vm.formValue.envK8s.nfsFlag = false
        }else{
          vm.formValue.envK8s.nfsFlag = true
        }
        if(vm.formValue.envK8s.projectNodeSelector !== null){
          var projectNodeSelectorList = []
          Object.keys(vm.formValue.envK8s.projectNodeSelector).map(item => {
            let obj = []
            obj[0] = item
            obj[1] = vm.formValue.envK8s.projectNodeSelector[item]
            projectNodeSelectorList.push(obj)
          })
          vm.formValue.envK8s.projectNodeSelector = projectNodeSelectorList
        }
        if(vm.formValue.envK8s.archSettings !== null){
          var archSettingsList = []
          vm.formValue.envK8s.archSettings.map(archSetting => {
            var nodeSelectorList = []
            Object.keys(archSetting.nodeSelector).map(item => {
              let obj = []
              obj[0] = item
              obj[1] = archSetting.nodeSelector[item]
              nodeSelectorList.push(obj)
            })
            archSetting.nodeSelector = nodeSelectorList
            archSettingsList.push(archSetting)
          })
          vm.formValue.envK8s.archSettings = archSettingsList
        }
        vm.operationCardConfig.attrs.formEls = ['updateEnv']
        vm.operationCardConfig.listeners.top = true
        vm.operationCardConfig.listeners.close = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.preview = () => { vm.previewEnv() }
        vm.operationCardConfig.listeners.update = () => { vm.updateEnv() }
        vm.dialogWidth = '1200px'
        vm.operationDialog = true
      }),
      mergeMap(next => {
        return race([
          next[1],
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      mergeMap(next => {
        const envConfig = next[2]
        // const envConfig = next[1]
        return defer(() => {
          return ENV_API.modifyEnv(next[1].envName, envConfig)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.successTip(true, next.msg)
      }),
      tap(next => {
        vm.logDialog = true
        vm.logCardConfig.listeners.confirm = () => { vm.logDialog = false }
      }),
      switchMap(next => {
        return webSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${next.data.auditID}?x-user-token=${User.getInstance().state.userObj.userToken}`).pipe(
          catchError(error => {
            console.log(error)
            return of(null)
          }),
          finalize(() => {
            console.log('final')
          }),
          filter(next => next),
          takeUntil(vm.$watchAsObservable('logDialog').pipe(
            pluck('newValue'),
            filter(next => next === false),
            take(1)
          )),
          scan((acc, next) => {
            acc.push(next)
            return acc
          }, []),
          tap(next => {
            vm.logCardConfig.attrs.logList = next
          })
        )
      }),
      switchMap(next => {
        return vm.$watchAsObservable('logDialog').pipe(
          pluck('newValue'),
          filter(next => next === false),
          take(1)
        )
      }),
      tap(next => {
        vm.logCardConfig.attrs.logList = []
        vm.$observables.queryPage$.next('envModify')
      })
    ).subscribe(() => {})

    vm.$observables.addPvClick$.pipe(
      map(next => {
        return [next, new Subject(), Vue.observable({
          pvName: '',
          pvDefYaml: {
            readOnly: false,
            hostPath: {
              path: ''
            },
            cephfs: {
              monitors: [],
              keyring: '',
              user: '',
              path: '/'
            },
            rbd: {
              monitors: [],
              keyring: '',
              user: '',
              pool: '',
              image: '',
              fsType: 'ext4',
            },
            glusterfs: {
              endpointIPs: [],
              endpointPort: 0,
              path: ''
            },
            nfs: {
              server: '',
              path: ''
            }
          }
        })]
      }),
      tap(next => {
        const envName = next[0].envName
        const formValue = next[2]
        vm.formValue = formValue
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_new_pv', envName)
        vm.operationCardConfig.attrs.formRef = 'addPvForm'
        vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="info">
          <small>{vuetify.preset.lang.t('$vuetify.lang_form_new_pv_prompt')}</small>
        </v-alert>
        vm.operationCardConfig.attrs.formEls = ['addPV']
        vm.operationCardConfig.listeners.top = true
        vm.operationCardConfig.listeners.close = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.preview = () => { vm.previewPV() }
        vm.operationCardConfig.listeners.update = () => { vm.addPV(envName) }
        vm.dialogWidth = '1200px'
        vm.operationDialog = true
      }),
      mergeMap(next => {
        return race([
          next[1],
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      mergeMap(next => {
        const pvConfig = next[2]
        const envConfig = next[1]
        return defer(() => {
          return ENV_API.createPv(envConfig.envName, pvConfig)
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          }),
          withLatestFrom(of(envConfig))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.$observables.queryPvs$.next(next[1])
        vm.successTip(true, next[0].msg)
      })
    ).subscribe(next => {})
    vm.$observables.deletePvClick$.pipe(
      map(next => {
        return [next, new Subject(), Vue.observable({
          pvName: ''
        })]
      }),
      tap(next => {
        const formValue = next[2]
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.operationCardConfig.attrs.title = vuetify.preset.lang.t('$vuetify.lang_form_delete_pv', next[0].envName, next[0].pvName)
        vm.operationCardConfig.attrs.formRef = 'deletePvForm'
        vm.operationCardConfig.attrs.formInfo = <v-alert icon="mdi-alert-circle" prominent text type="error">
          <small>{vuetify.preset.lang.t('$vuetify.lang_form_delete_pv_prompt')}<v-chip small color="red">{vuetify.preset.lang.t('$vuetify.lang_form_dangerous_operation')}</v-chip></small>
        </v-alert>
        vm.operationCardConfig.attrs.formEls = [
          <v-text-field
            label={vuetify.preset.lang.t('$vuetify.lang_form_delete_pv_pv_name')}
            required
            dense
            vModel={formValue.pvName}
            rules={[
              v => !!v || vuetify.preset.lang.t('$vuetify.lang_form_required'),
              v => v === next[0].pvName || vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', next[0].pvName)
            ]}
            hint={vuetify.preset.lang.t('$vuetify.lang_form_delete_pv_pv_name_tip_1', next[0].pvName)}
            persistent-hint
          />
        ]
        vm.operationCardConfig.listeners.top = false
        vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
        vm.operationCardConfig.listeners.confirm = () => { next[1].next(true) }
        vm.operationDialog = true
        vm.dialogWidth = '600px'
      }),
      mergeMap(next => {
        return race([
          next[1].pipe(
            map(confirm => {
              return vm.$refs.deletePvForm.validate()
            })
          ),
          vm.$watchAsObservable('operationDialog').pipe(
            pluck('newValue'),
            filter(next => !next)
          )
        ]).pipe(
          withLatestFrom(of(next[0]), of(next[2]))
        )
      }),
      filter(next => next[0]),
      tap(next => {
        vm.operationCardConfig.listeners.cancel = null
        vm.operationCardConfig.attrs.confirmLoading = true
      }),
      exhaustMap(next => {
        return defer(() => {
          return ENV_API.deletePv(next[1].envName, { pvName: next[1].pvName })
        }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            vm.operationCardConfig.listeners.cancel = () => { vm.operationDialog = false }
            vm.operationCardConfig.attrs.confirmLoading = false
            vm.errorTip(true, next.response.data.msg)
            return of(null)
          })
        )
      }),
      filter(next => next),
      tap(next => {
        vm.operationDialog = false
        vm.operationCardConfig.attrs.confirmLoading = false
        vm.successTip(true, next.msg)

        vm.$observables.queryPage$.next('pvDelete')
      })
    ).subscribe(next => {})
    vm.$observables.queryPage$.next('init')
    vm.$observables.queryEnvNames$.next('init')
  },
  filters: {
    changeColor: function (value) {
      if (value === 'FAIL') {
        return { color: 'red' }
      } else if (value === 'INFO') {
        return { color: 'green' }
      } else {
        return null
      }
    }
  },
  computed: {
    headers () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_env'), value: 'envName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_env_desc'), value: 'envDesc', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_from_file'), value: 'isFromFile', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false }
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
.form-item-40 {
  width: 40%;
}
.form-item-45 {
  width: 45%;
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
