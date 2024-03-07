<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_docker_build_envs')">
    <v-card>
      <v-card-title>
        <v-form>
          <v-container class="d-flex flex-wrap" fluid>
            <v-select
              :items="buildEnvNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_build_env_names')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="pageRequest.buildEnvNames"
              @change="getList(true)"
            ></v-select>
            <v-select
              :items="tenantCodes"
              :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="pageRequest.tenantCodes"
              @change="getList(true)"
            ></v-select>
            <v-select
              :items="['yes', 'no']"
              :label="$vuetify.lang.t('$vuetify.lang_form_from_file')"
              dense
              small-chips
              class="mr-8"
              clearable
              v-model="pageRequest.fromFile"
              @change="getList(true)"
            ></v-select>
            <v-btn color="primary" @click="openAddDockerBuildEnvs()">{{ $vuetify.lang.t('$vuetify.lang_menu_new_docker_build_env') }}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pageHeaders"
          :items="pageData.dockerBuildEnvs"
          :page="pageRequest.page"
          :items-per-page="pageRequest.perPage"
          :server-items-length="pageData.totalCount"
          item-key="buildEnvName"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.buildArches="{item}">
            <div v-for="(buildArch, i) in item.buildArches" :key="i">
              <v-chip small class="mb-1 white--text" color="green">
                {{ buildArch }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.handle="{item}">
            <Operations
                :operations="[
                  {
                    key: 'update',
                    text: $vuetify.lang.t('$vuetify.lang_menu_update_docker_build_env'),
                    onClick: () => {
                      openUpdateDockerBuildEnvs(item)
                    }
                  },
                  {
                    key: 'delete',
                    text: $vuetify.lang.t('$vuetify.lang_menu_delete_docker_build_env'),
                    onClick: () => {
                      openDeleteDockerBuildEnvs(item.buildEnvName)
                    }
                  },
                ]"
              ></Operations>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
      v-model="addDockerBuildEnvsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_docker_build_env')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddDockerBuildEnvs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addDockerBuildEnvs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addDockerBuildEnvsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addDockerBuildEnvsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_docker_build_env_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_env_name')"
                  dense
                  v-model="addDockerBuildEnvsForm.buildEnvName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_env_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addDockerBuildEnvsForm.tenantCode"
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
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image')"
                  dense
                  v-model="addDockerBuildEnvsForm.image"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_1', hintConfig.dockerRunAsUid, hintConfig.dockerBuildHomeDir),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_3'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_1', hintConfig.dockerRunAsUid, hintConfig.dockerBuildHomeDir)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_3')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches')"
                  v-model="addDockerBuildEnvsForm.buildArches"
                  :items="archNames"
                  dense
                  multiple
                  small-chips
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_2')}}</div>
                  </template>
                </v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_username')"
                  dense
                  v-model="addDockerBuildEnvsForm.registryUsername"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_username_tip_1')"
                  persistent-hint
                >
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_password')"
                  dense
                  v-model="addDockerBuildEnvsForm.registryPassword"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_password_tip_1')"
                  persistent-hint
                  type="password"
                >
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_home_dir')"
                  v-model="addDockerBuildEnvsForm.mountHomeDir"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_home_dir_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_enable_proxy')"
                  v-model="addDockerBuildEnvsForm.enableProxy"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_enable_proxy_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-combobox
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs')"
                  v-model="addDockerBuildEnvsForm.mountExtraCacheDirs"
                  dense
                  multiple
                  small-chips
                  hide-selected
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_3'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_4'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_4')}}</div>
                  </template>
                </v-combobox>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_before_build')"
                  auto-grow
                  v-model="addDockerBuildEnvsForm.commandsBeforeBuild"
                  dense
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_before_build_tip_1')"
                  persistent-hint
                >
                </v-textarea>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_after_check')"
                  auto-grow
                  v-model="addDockerBuildEnvsForm.commandsAfterCheck"
                  dense
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_after_check_tip_1')"
                  persistent-hint
                >
                </v-textarea>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateDockerBuildEnvsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_docker_build_env', updateDockerBuildEnvsForm.buildEnvName)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateDockerBuildEnvs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateDockerBuildEnvs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateDockerBuildEnvsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateDockerBuildEnvsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_docker_build_env_prompt')}}</small>
              <div v-if="updateDockerBuildEnvsForm.isFromFile"><small>{{$vuetify.lang.t('$vuetify.lang_form_is_from_file_prompt')}}</small></div>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_env_name')"
                  dense
                  disabled
                  v-model="updateDockerBuildEnvsForm.buildEnvName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_env_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateDockerBuildEnvsForm.tenantCode"
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
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image')"
                  dense
                  v-model="updateDockerBuildEnvsForm.image"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_1', hintConfig.dockerRunAsUid, hintConfig.dockerBuildHomeDir),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_3'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_1', hintConfig.dockerRunAsUid, hintConfig.dockerBuildHomeDir)}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_image_tip_3')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches')"
                  v-model="updateDockerBuildEnvsForm.buildArches"
                  :items="archNames"
                  dense
                  multiple
                  small-chips
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_build_arches_tip_2')}}</div>
                  </template>
                </v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_username')"
                  dense
                  v-model="updateDockerBuildEnvsForm.registryUsername"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_username_tip_1')"
                  persistent-hint
                >
                </v-text-field>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_password')"
                  dense
                  v-model="updateDockerBuildEnvsForm.registryPassword"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_registry_password_tip_1')"
                  persistent-hint
                  type="password"
                >
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_home_dir')"
                  v-model="updateDockerBuildEnvsForm.mountHomeDir"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_home_dir_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_enable_proxy')"
                  v-model="updateDockerBuildEnvsForm.enableProxy"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_enable_proxy_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-combobox
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs')"
                  v-model="updateDockerBuildEnvsForm.mountExtraCacheDirs"
                  dense
                  multiple
                  small-chips
                  hide-selected
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_3'),
                    $vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_4'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_2')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_3')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_docker_build_env_mount_extra_cache_dirs_tip_4')}}</div>
                  </template>
                </v-combobox>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_before_build')"
                  auto-grow
                  v-model="updateDockerBuildEnvsForm.commandsBeforeBuild"
                  dense
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_before_build_tip_1')"
                  persistent-hint
                >
                </v-textarea>
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-textarea
                  :label="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_after_check')"
                  auto-grow
                  v-model="updateDockerBuildEnvsForm.commandsAfterCheck"
                  dense
                  style="white-space:nowrap;"
                  wrap="off"
                  row-height="12"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_docker_build_env_commands_after_check_tip_1')"
                  persistent-hint
                >
                </v-textarea>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteDockerBuildEnvsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_docker_build_env', targetBuildEnvName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteDockerBuildEnvsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_docker_build_env_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_docker_build_env_build_env_name')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_docker_build_env_build_env_name_tip_1', targetBuildEnvName)"
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
              this.deleteDockerBuildEnvsDialog = false
              this.$refs.deleteDockerBuildEnvsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteDockerBuildEnvs()"
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
  name: 'DockerBuildEnvs',
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
      confirmValue: '',
      pageRequest: {
        buildEnvNames: [],
        tenantCodes: [],
        fromFile: '',
        page: 1,
        perPage: 10
      },
      buildEnvNames: [],
      tenantCodes: [],
      archNames: [],
      addDockerBuildEnvsDialog: false,
      addDockerBuildEnvsForm: {
        buildEnvName: '',
        tenantCode: '',
        image: '',
        buildArches: ['amd64'],
        registryUsername: '',
        registryPassword: '',
        mountHomeDir: true,
        enableProxy: false,
        mountExtraCacheDirs: [],
        commandsBeforeBuild: '',
        commandsAfterCheck: '',
      },
      updateDockerBuildEnvsForm: {
        buildEnvName: '',
        tenantCode: '',
        image: '',
        buildArches: [],
        registryUsername: '',
        registryPassword: '',
        mountHomeDir: true,
        enableProxy: false,
        mountExtraCacheDirs: [],
        commandsBeforeBuild: '',
        commandsAfterCheck: '',
      },
      updateDockerBuildEnvsDialog: false,
      YAMLDialog: false,
      yamlText: "",
      pageData: {
        dockerBuildEnvs: [],
        totalCount: 0
      },
      tableLoading: false,
      targetBuildEnvName: '',
      deleteDockerBuildEnvsDialog: false,
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
    }
  },
  created () {
    const vm = this
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    vm.getList(false)
    request.get('/admin/tenantCodes').then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/buildEnvNames').then(response => {
      vm.buildEnvNames = response.data.buildEnvNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/archNames').then(response => {
      vm.archNames = response.data.archNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get('/public/about').then(response => {
      vm.hintConfig = response.data.config
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
  },
  methods: {
    getList(tipFlag) {
      const vm = this
      vm.tableLoading = true
      request.post('/admin/dockerBuildEnvs', vm.pageRequest).then(response => {
        vm.pageData.dockerBuildEnvs = response.data.dockerBuildEnvs
        vm.pageData.dockerBuildEnvs.forEach(item => {
          item.commandsBeforeBuild = vm.formateText(item.commandsBeforeBuild)
          item.commandsAfterCheck = vm.formateText(item.commandsAfterCheck)
        })
        vm.pageData.totalCount = response.data.totalCount
        vm.tableLoading = false
        if(tipFlag){
          vm.successTip(true,response.msg)
        }
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
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
    previewAddDockerBuildEnvs() {
      const vm = this
      if(vm.$refs.addDockerBuildEnvsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addDockerBuildEnvsForm))
        copyData.commandsBeforeBuild = vm.formateText(copyData.commandsBeforeBuild)
        copyData.commandsAfterCheck = vm.formateText(copyData.commandsAfterCheck)
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddDockerBuildEnvs() {
      const vm = this
      vm.addDockerBuildEnvsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addDockerBuildEnvsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addDockerBuildEnvs() {
      const vm = this
      if(vm.$refs.addDockerBuildEnvsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addDockerBuildEnvsForm))
        copyData.commandsBeforeBuild = vm.formateText(copyData.commandsBeforeBuild)
        copyData.commandsAfterCheck = vm.formateText(copyData.commandsAfterCheck)
        let dockerBuildEnvYaml = YAML.stringify(copyData, 4)
        request.post('/admin/dockerBuildEnv', {dockerBuildEnvYaml: dockerBuildEnvYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.addDockerBuildEnvsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewUpdateDockerBuildEnvs() {
      const vm = this
      if(vm.$refs.updateDockerBuildEnvsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateDockerBuildEnvsForm))
        copyData.commandsBeforeBuild = vm.formateText(copyData.commandsBeforeBuild)
        copyData.commandsAfterCheck = vm.formateText(copyData.commandsAfterCheck)
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateDockerBuildEnvs(dockerBuildEnv) {
      const vm = this
      vm.updateDockerBuildEnvsForm = dockerBuildEnv
      vm.updateDockerBuildEnvsForm.expiresDays = -1
      vm.updateDockerBuildEnvsDialog = true
    },
    updateDockerBuildEnvs() {
      const vm = this
      if(vm.$refs.updateDockerBuildEnvsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateDockerBuildEnvsForm))
        copyData.commandsBeforeBuild = vm.formateText(copyData.commandsBeforeBuild)
        copyData.commandsAfterCheck = vm.formateText(copyData.commandsAfterCheck)
        let dockerBuildEnvYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/dockerBuildEnv/${vm.updateDockerBuildEnvsForm.buildEnvName}`, {dockerBuildEnvYaml: dockerBuildEnvYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.updateDockerBuildEnvsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteDockerBuildEnvs(buildEnvName) {
      const vm = this
      vm.confirmValue = ''
      vm.targetBuildEnvName = buildEnvName
      vm.deleteDockerBuildEnvsDialog = true
    },
    deleteDockerBuildEnvs() {
      const vm = this
      if(vm.$refs.deleteDockerBuildEnvsRef.validate && vm.targetBuildEnvName === vm.confirmValue){
        request.delete(`/admin/dockerBuildEnv/${vm.targetBuildEnvName}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteDockerBuildEnvsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetBuildEnvName))
      }
    },
  },
  computed: {
    pageHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_build_env_name'), value: 'buildEnvName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_from_file'), value: 'isFromFile', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_build_env_image'), value: 'image', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_build_env_arches'), value: 'buildArches', sortable: false },
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
