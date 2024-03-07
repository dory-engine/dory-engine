<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_repo_configs')">
    <v-card>
      <v-card-title>
        <v-form>
          <v-container class="d-flex flex-wrap" fluid>
            <v-select
              :items="repoNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_repo_names')"
              dense
              small-chips
              multiple
              class="mr-8"
              v-model="pageRequest.repoNames"
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
            <Operations
              :operations="[
                {
                  key: 'gitRepo',
                  text: $vuetify.lang.t('$vuetify.lang_menu_new_git_repo_config'),
                  onClick: () => {
                    openAddGitRepoConfigs()
                  }
                },
                {
                  key: 'imageRepo',
                  text: $vuetify.lang.t('$vuetify.lang_menu_new_image_repo_config'),
                  onClick: () => {
                    openAddImageRepoConfigs()
                  }
                },
                {
                  key: 'artifactRepo',
                  text: $vuetify.lang.t('$vuetify.lang_menu_new_artifact_repo_config'),
                  onClick: () => {
                    openAddArtifactRepoConfigs()
                  }
                },
                {
                  key: 'scanCodeRepo',
                  text: $vuetify.lang.t('$vuetify.lang_menu_new_scan_code_repo_config'),
                  onClick: () => {
                    openAddScanCodeRepoConfigs()
                  }
                },
              ]"
            ></Operations>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pageHeaders"
          :items="pageData.repoConfigs"
          :page="pageRequest.page"
          :items-per-page="pageRequest.perPage"
          :server-items-length="pageData.totalCount"
          item-key="repoName"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.handle="{item}">
            <Operations v-if="item.type === 'gitRepoConfig'"
              :operations="[
                {
                  key: 'update',
                  text: $vuetify.lang.t('$vuetify.lang_menu_update_git_repo_config'),
                  onClick: () => {
                    openUpdateGitRepoConfigs(item)
                  }
                },
                {
                  key: 'delete',
                  text: $vuetify.lang.t('$vuetify.lang_menu_delete_git_repo_config'),
                  onClick: () => {
                    openDeleteGitRepoConfigs(item.repoName)
                  }
                },
              ]"
            />
            <Operations v-if="item.type === 'imageRepoConfig'"
              :operations="[
                {
                  key: 'update',
                  text: $vuetify.lang.t('$vuetify.lang_menu_update_image_repo_config'),
                  onClick: () => {
                    openUpdateImageRepoConfigs(item)
                  }
                },
                {
                  key: 'delete',
                  text: $vuetify.lang.t('$vuetify.lang_menu_delete_image_repo_config'),
                  onClick: () => {
                    openDeleteImageRepoConfigs(item.repoName)
                  }
                },
              ]"
            />
            <Operations v-if="item.type === 'artifactRepoConfig'"
              :operations="[
                {
                  key: 'update',
                  text: $vuetify.lang.t('$vuetify.lang_menu_update_artifact_repo_config'),
                  onClick: () => {
                    openUpdateArtifactRepoConfigs(item)
                  }
                },
                {
                  key: 'delete',
                  text: $vuetify.lang.t('$vuetify.lang_menu_delete_artifact_repo_config'),
                  onClick: () => {
                    openDeleteArtifactRepoConfigs(item.repoName)
                  }
                },
              ]"
            />
            <Operations v-if="item.type === 'scanCodeRepoConfig'"
              :operations="[
                {
                  key: 'update',
                  text: $vuetify.lang.t('$vuetify.lang_menu_update_scan_code_repo_config'),
                  onClick: () => {
                    openUpdateScanCodeRepoConfigs(item)
                  }
                },
                {
                  key: 'delete',
                  text: $vuetify.lang.t('$vuetify.lang_menu_delete_scan_code_repo_config'),
                  onClick: () => {
                    openDeleteScanCodeRepoConfigs(item.repoName)
                  }
                },
              ]"
            />
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
      v-model="addGitRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_git_repo_config')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddGitRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addGitRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addGitRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addGitRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_git_repo_config_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_kind')"
                  v-model="addGitRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['gitlab', 'gitea']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_repo_name')"
                  dense
                  v-model="addGitRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addGitRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_view_url')"
                  dense
                  v-model="addGitRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url')"
                  dense
                  v-model="addGitRepoConfigsForm.url"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_insecure')"
                  v-model="addGitRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_username')"
                  dense
                  v-model="addGitRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_name')"
                  dense
                  v-model="addGitRepoConfigsForm.name"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_mail')"
                  dense
                  v-model="addGitRepoConfigsForm.mail"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_mail_tip_1')"
                  persistent-hint
                />
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_password')"
                  dense
                  v-model="addGitRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_token')"
                  dense
                  v-model="addGitRepoConfigsForm.token"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateGitRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_git_repo_config', updateGitRepoConfigsForm.repoName)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateGitRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateGitRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateGitRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateGitRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_git_repo_config_prompt')}}</small>
              <div v-if="updateGitRepoConfigsForm.isFromFile"><small>{{$vuetify.lang.t('$vuetify.lang_form_is_from_file_prompt')}}</small></div>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_kind')"
                  v-model="updateGitRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['gitlab', 'gitea']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_repo_name')"
                  dense
                  disabled
                  v-model="updateGitRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateGitRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_view_url')"
                  dense
                  v-model="updateGitRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url')"
                  dense
                  v-model="updateGitRepoConfigsForm.url"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_git_repo_config_url_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_insecure')"
                  v-model="updateGitRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_username')"
                  dense
                  v-model="updateGitRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_name')"
                  dense
                  v-model="updateGitRepoConfigsForm.name"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_mail')"
                  dense
                  v-model="updateGitRepoConfigsForm.mail"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_mail_tip_1')"
                  persistent-hint
                />
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_password')"
                  dense
                  v-model="updateGitRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_git_repo_config_token')"
                  dense
                  v-model="updateGitRepoConfigsForm.token"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteGitRepoConfigsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_git_repo_config', targetRepoName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteGitRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_git_repo_config_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_git_repo_config_repo_name')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_git_repo_config_repo_name_tip_1', targetRepoName)"
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
              this.deleteGitRepoConfigsDialog = false
              this.$refs.deleteGitRepoConfigsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteGitRepoConfigs()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addImageRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_image_repo_config')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddImageRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addImageRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addImageRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addImageRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_image_repo_config_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_kind')"
                  v-model="addImageRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['harbor']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_repo_name')"
                  dense
                  v-model="addImageRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addImageRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname')"
                  dense
                  v-model="addImageRepoConfigsForm.hostname"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_internal')"
                  dense
                  v-model="addImageRepoConfigsForm.ipInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_internal_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_external')"
                  dense
                  v-model="addImageRepoConfigsForm.ipExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_external_tip_1')"
                  persistent-hint
                />
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_username')"
                  dense
                  v-model="addImageRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_password')"
                  dense
                  v-model="addImageRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_insecure')"
                  v-model="addImageRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateImageRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_image_repo_config', updateImageRepoConfigsForm.repoName)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateImageRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateImageRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateImageRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateImageRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_image_repo_config_prompt')}}</small>
              <div v-if="updateImageRepoConfigsForm.isFromFile"><small>{{$vuetify.lang.t('$vuetify.lang_form_is_from_file_prompt')}}</small></div>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_kind')"
                  v-model="updateImageRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['harbor']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_repo_name')"
                  dense
                  disabled
                  v-model="updateImageRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateImageRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname')"
                  dense
                  v-model="updateImageRepoConfigsForm.hostname"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_image_repo_config_hostname_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_internal')"
                  dense
                  v-model="updateImageRepoConfigsForm.ipInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_internal_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_external')"
                  dense
                  v-model="updateImageRepoConfigsForm.ipExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_ip_external_tip_1')"
                  persistent-hint
                />
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_username')"
                  dense
                  v-model="updateImageRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_password')"
                  dense
                  v-model="updateImageRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_insecure')"
                  v-model="updateImageRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_image_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteImageRepoConfigsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_image_repo_config', targetRepoName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteImageRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_image_repo_config_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_image_repo_config_repo_name')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_image_repo_config_repo_name_tip_1', targetRepoName)"
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
              this.deleteImageRepoConfigsDialog = false
              this.$refs.deleteImageRepoConfigsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteImageRepoConfigs()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addArtifactRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_artifact_repo_config')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddArtifactRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addArtifactRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addArtifactRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addArtifactRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_artifact_repo_config_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_kind')"
                  v-model="addArtifactRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['nexus']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_repo_name')"
                  dense
                  v-model="addArtifactRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addArtifactRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_view_url')"
                  dense
                  v-model="addArtifactRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_internal')"
                  v-model="addArtifactRepoConfigsForm.schemaInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['http', 'https']"
                  dense
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_external')"
                  v-model="addArtifactRepoConfigsForm.schemaExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['http', 'https']"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_external_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_insecure')"
                  v-model="addArtifactRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_internal')"
                  dense
                  v-model="addArtifactRepoConfigsForm.hostnameInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_internal_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external')"
                  dense
                  v-model="addArtifactRepoConfigsForm.hostnameExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_username')"
                  dense
                  v-model="addArtifactRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_username_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_password')"
                  dense
                  v-model="addArtifactRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port')"
                  dense
                  v-model.number="addArtifactRepoConfigsForm.port"
                  type="number"
                  :rules="[intRule]"
                />
              </div>
            </div>
            <div class="params-item mt-4">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo')}}</small>
              <v-icon color="error" class="ml-4" @click="updateProxyRepo(false, 'add')">mdi-minus-circle-outline</v-icon>
              <v-icon color="green" class="ml-4" @click="updateProxyRepo(true, 'add')">mdi-plus-circle-outline</v-icon>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_role')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.publicRole"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_role_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_user')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.publicUser"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_user_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_password')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.publicPassword"
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_docker')"
                    dense
                    v-model.number="addArtifactRepoConfigsForm.proxyRepo.portDocker"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_gcr')"
                    dense
                    v-model.number="addArtifactRepoConfigsForm.proxyRepo.portGcr"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_quay')"
                    dense
                    v-model.number="addArtifactRepoConfigsForm.proxyRepo.portQuay"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_maven')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.maven"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_maven_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_npm')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.npm"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_npm_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_pip')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.pip"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_pip_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_gradle')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.gradle"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_gradle_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_go')"
                    dense
                    v-model="addArtifactRepoConfigsForm.proxyRepo.go"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_go_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt')}}</small>
                <div class="d-flex mt-4 justify-space-between">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_amd64')"
                      dense
                      v-model="addArtifactRepoConfigsForm.proxyRepo.apt.amd64"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_amd64_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_arm64v8')"
                      dense
                      v-model="addArtifactRepoConfigsForm.proxyRepo.apt.arm64v8"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_arm64v8_tip_1')"
                      persistent-hint
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
      v-model="updateArtifactRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_artifact_repo_config', updateArtifactRepoConfigsForm.repoName)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateArtifactRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateArtifactRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateArtifactRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateArtifactRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_artifact_repo_config_prompt')}}</small>
              <div v-if="updateArtifactRepoConfigsForm.isFromFile"><small>{{$vuetify.lang.t('$vuetify.lang_form_is_from_file_prompt')}}</small></div>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_kind')"
                  v-model="updateArtifactRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['nexus']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_repo_name')"
                  dense
                  disabled
                  v-model="updateArtifactRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateArtifactRepoConfigsForm.tenantCode"
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
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_view_url')"
                  dense
                  v-model="updateArtifactRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_internal')"
                  v-model="updateArtifactRepoConfigsForm.schemaInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['http', 'https']"
                  dense
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_external')"
                  v-model="updateArtifactRepoConfigsForm.schemaExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['http', 'https']"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_schema_external_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_insecure')"
                  v-model="updateArtifactRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_internal')"
                  dense
                  v-model="updateArtifactRepoConfigsForm.hostnameInternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_internal_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external')"
                  dense
                  v-model="updateArtifactRepoConfigsForm.hostnameExternal"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_hostname_external_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_username')"
                  dense
                  v-model="updateArtifactRepoConfigsForm.username"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_username_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_password')"
                  dense
                  v-model="updateArtifactRepoConfigsForm.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port')"
                  dense
                  v-model.number="updateArtifactRepoConfigsForm.port"
                  type="number"
                  :rules="[intRule]"
                />
              </div>
            </div>
            <div class="params-item mt-4">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo')}}</small>
              <v-icon color="error" class="ml-4" @click="updateProxyRepo(false, 'update')">mdi-minus-circle-outline</v-icon>
              <v-icon color="green" class="ml-4" @click="updateProxyRepo(true, 'update')">mdi-plus-circle-outline</v-icon>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_role')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.publicRole"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_role_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_user')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.publicUser"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_user_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_public_password')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.publicPassword"
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_docker')"
                    dense
                    v-model.number="updateArtifactRepoConfigsForm.proxyRepo.portDocker"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_gcr')"
                    dense
                    v-model.number="updateArtifactRepoConfigsForm.proxyRepo.portGcr"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_port_quay')"
                    dense
                    v-model.number="updateArtifactRepoConfigsForm.proxyRepo.portQuay"
                    type="number"
                    :rules="[intRuleZero]"
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_maven')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.maven"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_maven_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_npm')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.npm"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_npm_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_pip')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.pip"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_pip_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="d-flex mt-4 justify-space-between">
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_gradle')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.gradle"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_gradle_tip_1')"
                    persistent-hint
                  />
                </div>
                <div class="form-item-45 d-flex align-center">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_go')"
                    dense
                    v-model="updateArtifactRepoConfigsForm.proxyRepo.go"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_go_tip_1')"
                    persistent-hint
                  />
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt')}}</small>
                <div class="d-flex mt-4 justify-space-between">
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_amd64')"
                      dense
                      v-model="updateArtifactRepoConfigsForm.proxyRepo.apt.amd64"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_amd64_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_arm64v8')"
                      dense
                      v-model="updateArtifactRepoConfigsForm.proxyRepo.apt.arm64v8"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_repo_config_proxy_repo_apt_arm64v8_tip_1')"
                      persistent-hint
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
      v-model="deleteArtifactRepoConfigsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_artifact_repo_config', targetRepoName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteArtifactRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_artifact_repo_config_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_artifact_repo_config_repo_name')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_artifact_repo_config_repo_name_tip_1', targetRepoName)"
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
              this.deleteArtifactRepoConfigsDialog = false
              this.$refs.deleteArtifactRepoConfigsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteArtifactRepoConfigs()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addScanCodeRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_scan_code_repo_config')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewAddScanCodeRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="addScanCodeRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.addScanCodeRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="addScanCodeRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_scan_code_repo_config_prompt')}}</small>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_kind')"
                  v-model="addScanCodeRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['sonarqube']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_repo_name')"
                  dense
                  v-model="addScanCodeRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="addScanCodeRepoConfigsForm.tenantCode"
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
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_view_url')"
                  dense
                  v-model="addScanCodeRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url')"
                  dense
                  v-model="addScanCodeRepoConfigsForm.url"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_token')"
                  dense
                  v-model="addScanCodeRepoConfigsForm.token"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_insecure')"
                  v-model="addScanCodeRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateScanCodeRepoConfigsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_scan_code_repo_config', updateScanCodeRepoConfigsForm.repoName)}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="previewUpdateScanCodeRepoConfigs()">
                <v-icon color="primary">mdi-cube-scan</v-icon>
              </v-btn>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="ml-2" v-bind="attrs" v-on="on" @click="updateScanCodeRepoConfigs()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.updateScanCodeRepoConfigsDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateScanCodeRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_scan_code_repo_config_prompt')}}</small>
              <div v-if="updateScanCodeRepoConfigsForm.isFromFile"><small>{{$vuetify.lang.t('$vuetify.lang_form_is_from_file_prompt')}}</small></div>
            </v-alert>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_kind')"
                  v-model="updateScanCodeRepoConfigsForm.kind"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :items="['sonarqube']"
                  dense
                  small-chips
                >
                </v-select>
              </div>
              <div class="form-item d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_repo_name')"
                  dense
                  disabled
                  v-model="updateScanCodeRepoConfigsForm.repoName"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_repo_name_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                  v-model="updateScanCodeRepoConfigsForm.tenantCode"
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
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_view_url')"
                  dense
                  v-model="updateScanCodeRepoConfigsForm.viewUrl"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_view_url_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url')"
                  dense
                  v-model="updateScanCodeRepoConfigsForm.url"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_2'),
                  ]"
                >
                  <template v-slot:message>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_url_tip_2')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="d-flex mt-4 justify-space-between">
              <div class="form-item-45 d-flex align-center">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_token')"
                  dense
                  v-model="updateScanCodeRepoConfigsForm.token"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-select
                  :label="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_insecure')"
                  v-model="updateScanCodeRepoConfigsForm.insecure"
                  :items="[
                    {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                    {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                  ]"
                  dense
                  :hint="$vuetify.lang.t('$vuetify.lang_form_scan_code_repo_config_insecure_tip_1')"
                  persistent-hint
                ></v-select>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteScanCodeRepoConfigsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_scan_code_repo_config', targetRepoName)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteScanCodeRepoConfigsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_scan_code_repo_config_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_scan_code_repo_config_repo_name')"
                    required
                    dense
                    v-model="confirmValue"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_scan_code_repo_config_repo_name_tip_1', targetRepoName)"
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
              this.deleteScanCodeRepoConfigsDialog = false
              this.$refs.deleteScanCodeRepoConfigsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteScanCodeRepoConfigs()"
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
  name: 'RepoConfigs',
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
        repoNames: [],
        tenantCodes: [],
        fromFile: '',
        page: 1,
        perPage: 10
      },
      repoNames: [],
      tenantCodes: [],
      targetRepoName: '',
      addGitRepoConfigsDialog: false,
      addGitRepoConfigsForm: {
        kind: '',
        repoName: '',
        viewUrl: '',
        url: '',
        insecure: false,
        username: '',
        name: '',
        mail: '',
        password: '',
        token: '',
      },
      updateGitRepoConfigsDialog: false,
      updateGitRepoConfigsForm: {
        kind: '',
        repoName: '',
        viewUrl: '',
        url: '',
        insecure: false,
        username: '',
        name: '',
        mail: '',
        password: '',
        token: '',
      },
      deleteGitRepoConfigsDialog: false,
      addImageRepoConfigsDialog: false,
      addImageRepoConfigsForm: {
        kind: 'harbor',
        repoName: '',
        hostname: '',
        insecure: false,
        username: '',
        password: '',
        ipInternal: '',
        ipExternal: '',
      },
      updateImageRepoConfigsDialog: false,
      updateImageRepoConfigsForm: {
        kind: 'harbor',
        repoName: '',
        hostname: '',
        insecure: false,
        username: '',
        password: '',
        ipInternal: '',
        ipExternal: '',
      },
      deleteImageRepoConfigsDialog: false,
      addArtifactRepoConfigsDialog: false,
      addArtifactRepoConfigsForm: {
        kind: 'nexus',
        repoName: '',
        viewUrl: '',
        schemaInternal: '',
        schemaExternal: '',
        hostnameInternal: '',
        hostnameExternal: '',
        insecure: false,
        username: 'admin',
        password: '',
        port: 30003,
        proxyRepo: {
          publicRole: 'public-role',
          publicUser: 'public-user',
          publicPassword: 'public-user',
          portDocker: 30004,
          portGcr: 30005,
          portQuay: 30006,
          maven: 'repository/maven-group-public/',
          npm: 'repository/npm-group-public/',
          pip: 'repository/pypi-group-public/simple',
          gradle: 'repository/maven-group-public/',
          go: 'repository/go-group-public',
          apt: {
            amd64: 'repository/apt-aliyun-focal/',
            arm64v8: 'repository/apt-aliyun-focal-arm64/',
          }
        }
      },
      updateArtifactRepoConfigsDialog: false,
      updateArtifactRepoConfigsForm: {
        kind: 'nexus',
        repoName: '',
        viewUrl: '',
        schemaInternal: '',
        schemaExternal: '',
        hostnameInternal: '',
        hostnameExternal: '',
        insecure: false,
        username: '',
        password: '',
        port: 0,
        proxyRepo: {
          publicRole: '',
          publicUser: '',
          publicPassword: '',
          portDocker: 0,
          portGcr: 0,
          portQuay: 0,
          maven: '',
          npm: '',
          pip: '',
          gradle: '',
          go: '',
          apt: {
            amd64: '',
            arm64v8: '',
          }
        }
      },
      deleteArtifactRepoConfigsDialog: false,
      addScanCodeRepoConfigsDialog: false,
      addScanCodeRepoConfigsForm: {
        kind: 'sonarqube',
        repoName: '',
        viewUrl: '',
        url: '',
        insecure: false,
        token: '',
      },
      updateScanCodeRepoConfigsDialog: false,
      updateScanCodeRepoConfigsForm: {
        kind: 'sonarqube',
        repoName: '',
        viewUrl: '',
        url: '',
        insecure: false,
        token: '',
      },
      deleteScanCodeRepoConfigsDialog: false,
      YAMLDialog: false,
      yamlText: "",
      pageData: {
        repoConfigs: [],
        totalCount: 0
      },
      tableLoading: false,
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
    request.get('/admin/repoNames/search').then(response => {
      response.data.gitRepoNames.forEach(item => {
        vm.repoNames.push(item)
      })
      response.data.imageRepoNames.forEach(item => {
        vm.repoNames.push(item)
      })
      response.data.artifactRepoNames.forEach(item => {
        vm.repoNames.push(item)
      })
      response.data.scanCodeRepoNames.forEach(item => {
        vm.repoNames.push(item)
      })
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    getList(tipFlag) {
      const vm = this
      vm.tableLoading = true
      request.post('/admin/repoConfigs', vm.pageRequest).then(response => {
        vm.pageData.repoConfigs = response.data.repoConfigs
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
    previewAddGitRepoConfigs() {
      const vm = this
      if(vm.$refs.addGitRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addGitRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddGitRepoConfigs() {
      const vm = this
      vm.addGitRepoConfigsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addGitRepoConfigsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addGitRepoConfigs() {
      const vm = this
      if(vm.$refs.addGitRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addGitRepoConfigsForm))
        let gitRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post('/admin/gitRepoConfig', {gitRepoConfigYaml: gitRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.addGitRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewUpdateGitRepoConfigs() {
      const vm = this
      if(vm.$refs.updateGitRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateGitRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateGitRepoConfigs(gitRepoConfig) {
      const vm = this
      vm.updateGitRepoConfigsForm = gitRepoConfig
      vm.updateGitRepoConfigsDialog = true
    },
    updateGitRepoConfigs() {
      const vm = this
      if(vm.$refs.updateGitRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateGitRepoConfigsForm))
        let gitRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/gitRepoConfig/${vm.updateGitRepoConfigsForm.repoName}`, {gitRepoConfigYaml: gitRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.updateGitRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteGitRepoConfigs(repoName) {
      const vm = this
      vm.confirmValue = ''
      vm.targetRepoName = repoName
      vm.deleteGitRepoConfigsDialog = true
    },
    deleteGitRepoConfigs() {
      const vm = this
      if(vm.$refs.deleteGitRepoConfigsRef.validate && vm.targetRepoName === vm.confirmValue){
        request.delete(`/admin/gitRepoConfig/${vm.targetRepoName}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteGitRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetRepoName))
      }
    },
    previewAddImageRepoConfigs() {
      const vm = this
      if(vm.$refs.addImageRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addImageRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddImageRepoConfigs() {
      const vm = this
      vm.addImageRepoConfigsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addImageRepoConfigsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addImageRepoConfigs() {
      const vm = this
      if(vm.$refs.addImageRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addImageRepoConfigsForm))
        let imageRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post('/admin/imageRepoConfig', {imageRepoConfigYaml: imageRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.addImageRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewUpdateImageRepoConfigs() {
      const vm = this
      if(vm.$refs.updateImageRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateImageRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateImageRepoConfigs(imageRepoConfig) {
      const vm = this
      vm.updateImageRepoConfigsForm = imageRepoConfig
      vm.updateImageRepoConfigsDialog = true
    },
    updateImageRepoConfigs() {
      const vm = this
      if(vm.$refs.updateImageRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateImageRepoConfigsForm))
        let imageRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/imageRepoConfig/${vm.updateImageRepoConfigsForm.repoName}`, {imageRepoConfigYaml: imageRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.updateImageRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteImageRepoConfigs(repoName) {
      const vm = this
      vm.confirmValue = ''
      vm.targetRepoName = repoName
      vm.deleteImageRepoConfigsDialog = true
    },
    deleteImageRepoConfigs() {
      const vm = this
      if(vm.$refs.deleteImageRepoConfigsRef.validate && vm.targetRepoName === vm.confirmValue){
        request.delete(`/admin/imageRepoConfig/${vm.targetRepoName}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteImageRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetRepoName))
      }
    },
    previewAddArtifactRepoConfigs() {
      const vm = this
      if(vm.$refs.addArtifactRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addArtifactRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddArtifactRepoConfigs() {
      const vm = this
      vm.addArtifactRepoConfigsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addArtifactRepoConfigsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addArtifactRepoConfigs() {
      const vm = this
      if(vm.$refs.addArtifactRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addArtifactRepoConfigsForm))
        let artifactRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post('/admin/artifactRepoConfig', {artifactRepoConfigYaml: artifactRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.addArtifactRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewUpdateArtifactRepoConfigs() {
      const vm = this
      if(vm.$refs.updateArtifactRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateArtifactRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateArtifactRepoConfigs(artifactRepoConfig) {
      const vm = this
      vm.updateArtifactRepoConfigsForm = artifactRepoConfig
      vm.updateArtifactRepoConfigsDialog = true
    },
    updateArtifactRepoConfigs() {
      const vm = this
      if(vm.$refs.updateArtifactRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateArtifactRepoConfigsForm))
        let artifactRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/artifactRepoConfig/${vm.updateArtifactRepoConfigsForm.repoName}`, {artifactRepoConfigYaml: artifactRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.updateArtifactRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteArtifactRepoConfigs(repoName) {
      const vm = this
      vm.confirmValue = ''
      vm.targetRepoName = repoName
      vm.deleteArtifactRepoConfigsDialog = true
    },
    deleteArtifactRepoConfigs() {
      const vm = this
      if(vm.$refs.deleteArtifactRepoConfigsRef.validate && vm.targetRepoName === vm.confirmValue){
        request.delete(`/admin/artifactRepoConfig/${vm.targetRepoName}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteArtifactRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetRepoName))
      }
    },
    updateProxyRepo(isSet, mode) {
      const vm = this
      if (mode === 'add') {
        if (isSet) {
          vm.addArtifactRepoConfigsForm.proxyRepo = {
            publicRole: 'public-role',
            publicUser: 'public-user',
            publicPassword: 'public-user',
            portDocker: 30004,
            portGcr: 30005,
            portQuay: 30006,
            maven: 'repository/maven-group-public/',
            npm: 'repository/npm-group-public/',
            pip: 'repository/pypi-group-public/simple',
            gradle: 'repository/maven-group-public/',
            go: 'repository/go-group-public',
            apt: {
              amd64: 'repository/apt-aliyun-focal/',
              arm64v8: 'repository/apt-aliyun-focal-arm64/',
            }
          }
        } else {
          vm.addArtifactRepoConfigsForm.proxyRepo = {
            publicRole: '',
            publicUser: '',
            publicPassword: '',
            portDocker: 0,
            portGcr: 0,
            portQuay: 0,
            maven: '',
            npm: '',
            pip: '',
            gradle: '',
            go: '',
            apt: {
              amd64: '',
              arm64v8: '',
            }
          }
        }
      } else if (mode === 'update') {
        if (isSet) {
          vm.updateArtifactRepoConfigsForm.proxyRepo = {
            publicRole: 'public-role',
            publicUser: 'public-user',
            publicPassword: 'public-user',
            portDocker: 30004,
            portGcr: 30005,
            portQuay: 30006,
            maven: 'repository/maven-group-public/',
            npm: 'repository/npm-group-public/',
            pip: 'repository/pypi-group-public/simple',
            gradle: 'repository/maven-group-public/',
            go: 'repository/go-group-public',
            apt: {
              amd64: 'repository/apt-aliyun-focal/',
              arm64v8: 'repository/apt-aliyun-focal-arm64/',
            }
          }
        } else {
          vm.updateArtifactRepoConfigsForm.proxyRepo = {
            publicRole: '',
            publicUser: '',
            publicPassword: '',
            portDocker: 0,
            portGcr: 0,
            portQuay: 0,
            maven: '',
            npm: '',
            pip: '',
            gradle: '',
            go: '',
            apt: {
              amd64: '',
              arm64v8: '',
            }
          }
        }
      }
    },
    previewAddScanCodeRepoConfigs() {
      const vm = this
      if(vm.$refs.addScanCodeRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addScanCodeRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddScanCodeRepoConfigs() {
      const vm = this
      vm.addScanCodeRepoConfigsDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addScanCodeRepoConfigsForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addScanCodeRepoConfigs() {
      const vm = this
      if(vm.$refs.addScanCodeRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.addScanCodeRepoConfigsForm))
        let scanCodeRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post('/admin/scanCodeRepoConfig', {scanCodeRepoConfigYaml: scanCodeRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.addScanCodeRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewUpdateScanCodeRepoConfigs() {
      const vm = this
      if(vm.$refs.updateScanCodeRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateScanCodeRepoConfigsForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog =true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateScanCodeRepoConfigs(scanCodeRepoConfig) {
      const vm = this
      vm.updateScanCodeRepoConfigsForm = scanCodeRepoConfig
      vm.updateScanCodeRepoConfigsDialog = true
    },
    updateScanCodeRepoConfigs() {
      const vm = this
      if(vm.$refs.updateScanCodeRepoConfigsRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.updateScanCodeRepoConfigsForm))
        let scanCodeRepoConfigYaml = YAML.stringify(copyData, 4)
        request.post(`/admin/scanCodeRepoConfig/${vm.updateScanCodeRepoConfigsForm.repoName}`, {scanCodeRepoConfigYaml: scanCodeRepoConfigYaml}).then(response => {
          vm.successTip(true,response.msg)
          vm.updateScanCodeRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeleteScanCodeRepoConfigs(repoName) {
      const vm = this
      vm.confirmValue = ''
      vm.targetRepoName = repoName
      vm.deleteScanCodeRepoConfigsDialog = true
    },
    deleteScanCodeRepoConfigs() {
      const vm = this
      if(vm.$refs.deleteScanCodeRepoConfigsRef.validate && vm.targetRepoName === vm.confirmValue){
        request.delete(`/admin/scanCodeRepoConfig/${vm.targetRepoName}`).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteScanCodeRepoConfigsDialog = false
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetRepoName))
      }
    },
  },
  computed: {
    pageHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_repo_name'), value: 'repoName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_repo_type'), value: 'kind', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_from_file'), value: 'isFromFile', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_repo_type'), value: 'type', sortable: false },
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
