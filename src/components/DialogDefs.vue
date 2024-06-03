<template>
  <div>
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
      v-model="commentDefDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_update_def_comment')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="updateDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.commentDefDialog = false
            this.comment = ''
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="commentDefRef">
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_update_def_comment')"
              dense
              v-model="comment"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="selectDemoDefDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_create_def_item_from_template')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="addDef()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.selectDemoDefDialog = false
            this.$refs.selectDemoDefRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="selectDemoDefRef">
            <v-autocomplete
              :items="demoDefs"
              :label="$vuetify.lang.t('$vuetify.lang_form_create_def_item_from_template')"
              dense
              v-model="demoDef"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="customOpsDefsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_ops_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="customOpsDefsHistory('customOpsDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="addOps()">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="mx-4" v-bind="attrs" v-on="on" @click="previewOpsDef()" color="primary">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.customOpsDefsDialog = false
            this.$refs.opsDefRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgCustomOpsDefs"
          >
            {{ errMsgCustomOpsDefs }}
          </v-alert>
          <v-form ref="opsDefRef">
            <v-expansion-panels accordion class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in opsDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_name')"
                        dense
                        v-model="item.customOpsName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_desc')"
                        dense
                        v-model="item.customOpsDesc"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_desc_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_desc_tip_2')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_desc_tip_3')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyOps(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteOps(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row d-flex justify-space-between pr-20 mt-4" @click.stop="() => {}">
                    <div class="form-item-100 d-flex align-center">
                      <v-autocomplete
                        :items="customOpsSteps"
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_steps')"
                        dense
                        small-chips
                        multiple
                        v-model="item.customOpsSteps"
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_ops_def_custom_ops_steps_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="opsBatchDefsDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_ops_batch_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="opsBatchDefsHistory('opsBatchDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="addOpsBatch()">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="mx-4" v-bind="attrs" v-on="on" @click="previewOpsBatchDef()" color="primary">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.opsBatchDefsDialog = false
            this.$refs.opsBatchDefRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgOpsBatchDefs"
          >
            {{ errMsgOpsBatchDefs }}
          </v-alert>
          <v-form ref="opsBatchDefRef">
            <v-expansion-panels accordion class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in opsBatchDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_ops_batch_name')"
                        dense
                        v-model="item.opsBatchName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_ops_batch_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_ops_batch_desc')"
                        dense
                        v-model="item.opsBatchDesc"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_ops_batch_desc_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyOpsBatch(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteOpsBatch(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row d-flex justify-space-between pr-20 mt-4" @click.stop="() => {}">
                    <div class="form-item-100 d-flex align-center">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_batches')"
                        v-model="item.batches"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_ops_batch_def_batches_tip_1')"
                        persistent-hint
                      />
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="customStepDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="customStepDefsHistory('customStepDefs', targetCustomStepName)">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewCustomStepDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.customStepDefDialog = false
            this.$refs.customStepDefRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgCustomStepDefs"
          >
            {{ errMsgCustomStepDefs }}
          </v-alert>
          <v-alert
            prominent
            type="info"
            v-if="customStepUsage"
          >
            <pre>{{ customStepUsage }}</pre>
          </v-alert>
          <v-form ref="customStepDefRef">
            <div class="form-row d-flex justify-space-between">
              <div class="form-item-45">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_name')"
                  dense
                  v-model="customStepDefForm.customStepName"
                  disabled
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :items="project.customStepEnableModes"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode')"
                  dense
                  v-model="customStepDefForm.customStepDef.enableMode"
                  @change="enableModeChange($event)"
                ></v-autocomplete>
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="form-row mt-4">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs')}}</small>
              <v-icon color="success" class="ml-2" @click="addCustomStepModuleDefs()">mdi-table-plus</v-icon>
              <div class="params-item" v-for="(item, index) in customStepDefForm.customStepDef.customStepModuleDefs" :key="index">
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-15">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_module_name')"
                      dense
                      v-model="item.moduleName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_module_name_tip_1', project.projectInfo.projectShortName)"
                      persistent-hint
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-30">
                    <v-autocomplete
                      v-if="manualEnableFlag"
                      :items="[ true, false ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_manual_enable')"
                      dense
                      :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_manual_enable_tip_1')"
                      persistent-hint
                      v-model="item.manualEnable"
                    />
                    <div class="d-flex align-center" v-if="relatedStepModulesFlag">
                      <v-autocomplete
                        :items="relatedStepModules"
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_related_step_modules')"
                        dense
                        small-chips
                        multiple
                        v-model="item.relatedStepModules"
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_related_step_modules_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-textarea
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml')"
                      dense
                      auto-grow
                      rows="1"
                      style="white-space:nowrap;"
                      wrap="off"
                      row-height="12"
                      v-model="item.paramInputYaml"
                    />
                    <v-tooltip right max-width="350px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_3')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyCustomStepModuleDefs(index)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteCustomStepModuleDefs(index)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-70 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore')"
                      v-model="item.checkVarToIgnore"
                      dense
                      :messages="[
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_1'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_2'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_3'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_4'),
                      ]"
                      background-color="yellow lighten-5"
                    >
                      <v-icon
                        slot="append"
                        color="blue"
                        @click="() => {varsDialog = true}"
                      >
                        mdi-help-circle
                      </v-icon>
                      <template v-slot:message>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_1')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_2')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_3')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_4')}}</div>
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="customStepEnvDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def')}} ({{ targetEnvName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="customStepDefsEnvHistory('customStepDefs', targetCustomStepName)">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="openCustomStepDefToEnv()">mdi-arrow-left-bold-hexagon-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="previewCustomStepDefEnv()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.customStepEnvDefDialog = false
            this.$refs.customStepEnvDefRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgCustomStepDefs"
          >
            {{ errMsgCustomStepDefs }}
          </v-alert>
          <v-alert
            prominent
            type="info"
            v-if="customStepUsage"
          >
            <pre>{{ customStepUsage }}</pre>
          </v-alert>
          <v-form ref="customStepEnvDefRef">
            <div class="form-row d-flex justify-space-between">
              <div class="form-item-45">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_name')"
                  dense
                  v-model="customStepEnvDefForm.customStepName"
                  disabled
                />
              </div>
              <div class="form-item-45 d-flex align-center">
                <v-autocomplete
                  :items="project.customStepEnableModeEnvs"
                  :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode')"
                  dense
                  v-model="customStepEnvDefForm.customStepDef.enableMode"
                  @change="enableModeChangeEnv($event)"
                ></v-autocomplete>
                <v-tooltip right max-width="350px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode_tip_1')}}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_enable_mode_tip_2')}}</div>
                  </div>
                </v-tooltip>
              </div>
            </div>
            <div class="form-row mt-4">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs')}}</small>
              <v-icon color="success" class="ml-2" @click="addCustomStepModuleDefsEnv()">mdi-table-plus</v-icon>
              <div class="params-item" v-for="(item, index) in customStepEnvDefForm.customStepDef.customStepModuleDefs" :key="index">
                <div class="d-flex justify-space-between mt-4">
                  <v-checkbox class="diy-icon" @change="checkcustomStepModuleDef($event, index)"></v-checkbox>
                  <div class="form-item-15">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_module_name')"
                      dense
                      v-model="item.moduleName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_module_name_tip_1', project.projectInfo.projectShortName)"
                      persistent-hint
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    />
                  </div>
                  <div class="form-item-20">
                    <v-autocomplete
                      v-if="manualEnableFlag"
                      :items="[ true, false ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_manual_enable')"
                      dense
                      :hint="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_manual_enable_tip_1')"
                      persistent-hint
                      v-model="item.manualEnable"
                    />
                    <div class="d-flex align-center" v-if="relatedStepModulesFlag">
                      <v-autocomplete
                        :items="relatedStepModules"
                        :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_related_step_modules')"
                        dense
                        small-chips
                        multiple
                        v-model="item.relatedStepModules"
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_related_step_modules_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="form-item-50 d-flex align-center">
                    <v-textarea
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml')"
                      dense
                      auto-grow
                      rows="1"
                      style="white-space:nowrap;"
                      wrap="off"
                      row-height="12"
                      v-model="item.paramInputYaml"
                    />
                    <v-tooltip right max-width="350px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_param_input_yaml_tip_3')}}</div>
                      </div>
                    </v-tooltip>
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyCustomStepModuleDefsEnv(index)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteCustomStepModuleDefsEnv(index)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4">
                  <div class="form-item-70 d-flex align-center">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore')"
                      v-model="item.checkVarToIgnore"
                      dense
                      :messages="[
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_1'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_2'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_3'),
                        $vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_4'),
                      ]"
                      background-color="yellow lighten-5"
                    >
                      <v-icon
                        slot="append"
                        color="blue"
                        @click="() => {varsDialog = true}"
                      >
                        mdi-help-circle
                      </v-icon>
                      <template v-slot:message>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_1')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_2')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_3')}}</div>
                        <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_custom_step_def_custom_step_module_defs_check_var_to_ignore_tip_4')}}</div>
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="pipelineDefDialog"
        max-width="1200px"
        persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def')}} ({{ targetBranchName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="pipelineDefHistory('pipelineDef', targetBranchName)">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="openPipelineDefToBranch()">mdi-arrow-left-bold-hexagon-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_branches')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openYaml()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="mx-4" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon @click="() => {
            this.pipelineDefDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgPipelineDef"
          >
            {{ errMsgPipelineDef }}
          </v-alert>
          <v-form ref="pipelineDefRef">
            <v-container>
              <div class="pipeline-switch">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_is_auto_detect_build')}}</small>
                <v-switch
                  v-model="pipelineDefForm.isAutoDetectBuild"
                  dense
                  inset
                  :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_is_auto_detect_build_tip_1')"
                  persistent-hint
                ></v-switch>
                <div class="mb-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_is_auto_detect_build_tip_2')}}</small>
                </div>
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_is_queue')}}</small>
                <v-switch
                  v-model="pipelineDefForm.isQueue"
                  dense
                  inset
                  :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_is_queue_tip_1')"
                  persistent-hint
                ></v-switch>
              </div>
              <div class="pipelineBuilds">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_builds')}}</small>
                <div class="my-2" v-if="!pipelineDefForm.isAutoDetectBuild">
                  <v-chip v-for="item in pipelineDefForm.builds" :key="item.name" class="mr-2 mb-2" :color="item.run ? 'success': ''" @click="() => {
                    item.run = !item.run
                  }">{{item.name}}</v-chip>
                </div>
                <div class="my-2" v-else>
                  <v-chip v-for="item in pipelineDefForm.builds" :key="item.name" :class="item.run ? 'mr-2 mb-2 white--text': 'mr-2 mb-2'" :color="item.run ? 'orange': ''" @click="() => {
                    warnTip(true, $vuetify.lang.t('$vuetify.lang_form_pipeline_def_builds_tip_2'))
                  }">{{item.name}}</v-chip>
                </div>
                <small>{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_builds_tip_1')}}</small>
              </div>
              <small class="mt-4">{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step')}}</small>
              <v-card>
                <v-simple-table dense v-if="stepInformation">
                  <template slot='default'>
                    <thead>
                      <tr>
                        <th class="text-left">
                          {{$vuetify.lang.t('$vuetify.lang_view_step')}}
                        </th>
                        <th class="text-left" v-if="textName === 'build' || textName === 'scanCode' || textName === 'packageImage' || textName === 'scanImage' || textName === 'artifact' || project.customStepAvailables.includes(textName)">
                          {{$vuetify.lang.t('$vuetify.lang_view_related_def')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.enable !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_enable')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.ignoreError !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_ignore_error')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.timeout !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_timeout')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.retry !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_retry')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.extraPush !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_extra_push')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.passingRate !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_passing_rate')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.gateMedium !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_medium')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.gateHigh !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_high')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.gateCritical !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_critical')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.repeat !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_repeat')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.repeatInterval !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_repeat_interval')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.enableInput !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_enable_input')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.isApiOnly !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_is_api_only')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.enableInputFinish !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_enable_input_finish')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.isApiOnlyFinish !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_is_api_only_finish')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.forceReplace !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_force_replace')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.archive !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_archive')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.try !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_try')}}
                        </th>
                        <th class="text-left" v-if="stepInformation.selectTag !== undefined">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_select_tag')}}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{textName}}</td>
                        <td v-if="textName === 'build' || textName === 'scanCode' || textName === 'packageImage' || textName === 'scanImage' || textName === 'artifact' || project.customStepAvailables.includes(textName)">
                          <span v-if="textName === 'build' || textName === 'scanCode'">
                            <v-btn small class="my-1" color="primary" @click="openBuildDef()">{{$vuetify.lang.t('$vuetify.lang_menu_build_def')}}</v-btn>
                          </span>
                          <span v-if="textName === 'packageImage' || textName === 'scanImage'">
                            <v-btn small class="my-1" :color="project.projectDef.errMsgPackageDefs === '' ? 'primary' : 'error'" @click="openPackageDef()">{{$vuetify.lang.t('$vuetify.lang_menu_package_def')}}</v-btn>
                            <br>
                            <v-btn small class="my-1" color="primary" @click="openDockerIgnoreDef()">{{$vuetify.lang.t('$vuetify.lang_menu_docker_ignore_def')}}</v-btn>
                          </span>
                          <span v-if="textName === 'artifact'">
                            <v-btn small class="my-1" :color="project.projectDef.errMsgArtifactDefs === '' ? 'primary' : 'error'" @click="openArtifactDef()">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_def')}}</v-btn>
                          </span>
                          <span v-if="project.customStepAvailables.includes(textName)">
                            <v-btn small class="my-1" color="primary" @click="openCustomStepDef(textName)">{{ $vuetify.lang.t('$vuetify.lang_view_related_def') }}</v-btn>
                          </span>
                        </td>
                        <td v-if="stepInformation.enable !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.enable"
                              dense
                              inset
                              small
                              persistent-hint
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.ignoreError !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.ignoreError"
                              dense
                              inset
                              small
                              persistent-hint
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.timeout !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_timeout_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.timeout"
                          />
                        </td>
                        <td v-if="stepInformation.retry !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_retry_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.retry"
                          />
                        </td>
                        <td v-if="stepInformation.extraPush !== undefined">
                          <v-switch
                            v-model="stepInformation.extraPush"
                            dense
                            inset
                            small
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_extra_push_tip_1')"
                            persistent-hint
                          ></v-switch>
                        </td>
                        <td v-if="stepInformation.passingRate !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_passing_rate_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.passingRate"
                          />
                        </td>
                        <td v-if="stepInformation.gateMedium !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_medium_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.gateMedium"
                          />
                        </td>
                        <td v-if="stepInformation.gateHigh !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_high_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.gateHigh"
                          />
                        </td>
                        <td v-if="stepInformation.gateCritical !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_gate_critical_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.gateCritical"
                          />
                        </td>
                        <td v-if="stepInformation.repeat !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_repeat_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.repeat"
                          />
                        </td>
                        <td v-if="stepInformation.repeatInterval !== undefined">
                          <v-text-field
                            dense
                            persistent-hint
                            :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_repeat_interval_tip_1')"
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="stepInformation.repeatInterval"
                          />
                        </td>
                        <td v-if="stepInformation.enableInput !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.enableInput"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_enable_input_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.isApiOnly !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.isApiOnly"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_is_api_only_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.enableInputFinish !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.enableInputFinish"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_enable_input_finish_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.isApiOnlyFinish !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.isApiOnlyFinish"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_is_api_only_finish_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.forceReplace !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.forceReplace"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_force_replace_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.archive !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.archive"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_archive_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.try !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.try"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_try_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                        <td v-if="stepInformation.selectTag !== undefined">
                          <span>
                            <v-switch
                              v-model="stepInformation.selectTag"
                              dense
                              inset
                              small
                              persistent-hint
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_select_tag_tip_1')"
                            ></v-switch>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-simple-table dense v-if="stepInformation && stepInformation.ignoreExecuteModuleNames !== undefined">
                  <template slot='default'>
                    <thead>
                      <tr>
                        <th class="text-left">
                          {{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_ignore_execute_module_names')}}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span>
                            <v-combobox
                              v-model="stepInformation.ignoreExecuteModuleNames"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              :hint="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_ignore_execute_module_names_tip_1')"
                              persistent-hint
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-simple-table dense v-if="textName === 'syncImage' || textName === 'deploy' || textName === 'applyIngress' || textName === 'checkDeploy' || textName === 'deployArtifact' || textName === 'applyMesh' || (project && project.customStepAvailableEnvs.includes(textName))">
                  <template slot='default'>
                    <thead>
                      <tr>
                        <th class="text-left" v-for="(pipelineEnv, index) in pipelineEnvs" :key="index">
                          {{$vuetify.lang.t('$vuetify.lang_view_related_def')}}({{ pipelineEnv }})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td v-for="(pipelineEnv, index) in pipelineEnvs" :key="index">
                          <span v-if="textName === 'syncImage' || textName === 'deploy' || textName === 'applyIngress' || textName === 'checkDeploy'">
                            <v-btn small class="my-1" color="primary" @click="openDeployContainerDef(pipelineEnv)">{{$vuetify.lang.t('$vuetify.lang_menu_deploy_container_def')}}</v-btn>
                          </span>
                          <span v-if="textName === 'applyMesh'">
                            <v-btn small class="my-1" color="primary" @click="openIstioGatewayDef(pipelineEnv)">{{$vuetify.lang.t('$vuetify.lang_menu_istio_gateway_def')}}</v-btn>
                            <br>
                            <v-btn small class="my-1" color="primary" @click="openIstioDef(pipelineEnv)">{{$vuetify.lang.t('$vuetify.lang_menu_istio_def')}}</v-btn>
                          </span>
                          <span v-if="textName === 'deployArtifact'">
                            <v-btn small class="my-1" color="primary" @click="openDeployArtifactDef(pipelineEnv)">{{$vuetify.lang.t('$vuetify.lang_menu_deploy_artifact_def')}}</v-btn>
                          </span>
                          <span v-if="project.customStepAvailableEnvs.includes(textName)">
                            <v-btn small class="my-1" color="primary" @click="openCustomStepEnvDef(pipelineEnv, textName)">{{ $vuetify.lang.t('$vuetify.lang_view_related_def') }}</v-btn>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
              <div class="pipeline-wrap" style="height: 120px">
                <v-breadcrumbs :items="pipelineList">
                  <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                  </template>
                  <template v-slot:item="{item}">
                    <div :class="selectedStepIndex === item.index ? 'step-item avtive' : 'step-item'" >
                      <div v-if="item.type === 'original'" :class="item.data !== null && item.data.enable === false ? 'step-icon original-icon off' : 'step-icon original-icon'" @click.stop="openAddStep(item)">
                        {{item.isPush ? '+' : ''}}
                      </div>
                      <div v-else :class="item.data.enable === false ? 'step-icon custom-icon off' : 'step-icon custom-icon'" @click.stop="deleteStep(item)">-</div>
                      <v-chip @click="() => {
                        stepInformation = item.data
                        textName = item.name
                        selectedStepIndex = item.index
                      }">
                        <div class="text-center">
                          <span>{{item.name}}</span>
                          <br />
                          <small style="height: 22px;">{{item.hint}}</small>
                        </div>
                      </v-chip>
                    </div>
                  </template>
                </v-breadcrumbs>
              </div>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="copyToBranchPipelineDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_branches')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.copyToBranchPipelineDialog = false
            this.$refs.copyToBranchPipelineRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="copyToBranchPipelineRef">
            <v-autocomplete
              :items="copyBranchList"
              :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_branch_name')"
              dense
              v-model="branchNames"
              multiple
              small-chips
              required
              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="customDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_pipeline_def_insert_custom_steps')}}</span>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="customList"
            :label="$vuetify.lang.t('$vuetify.lang_form_pipeline_def_select_custom_steps')"
            dense
            multiple
            small-chips
            v-model="customStepNames"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="addStep()"
          >
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="yamlDialog"
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
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="buildDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_build_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="buildDefsHistory('buildDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openSelectDemoDef('buildDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewBuildDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.buildDefDialog = false
            this.$refs.buildDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="buildDefRef">
            <v-expansion-panels accordion class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in buildDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_name')"
                        dense
                        v-model="item.buildName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item">
                      <v-autocomplete
                        :items="[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_phase_id')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_phase_id_tip_1')"
                        persistent-hint
                        v-model="item.buildPhaseID"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_path')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_path_tip_1')"
                        persistent-hint
                        v-model="item.buildPath"
                        :rules="[v => !!v && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                      >
                      </v-text-field>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row d-flex justify-space-between pr-20 mt-4" @click.stop="() => {}">
                    <div class="form-item-15">
                      <v-autocomplete
                        :items="project.buildEnvs"
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_env')"
                        dense
                        v-model="item.buildEnv"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item-40">
                      <v-textarea
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_cmds')"
                        auto-grow
                        v-model="item.buildCmds"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_cmds_tip_1')"
                        persistent-hint
                        dense
                        style="white-space:nowrap;"
                        wrap="off"
                        row-height="12"
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
                      </v-textarea>
                    </div>
                    <div class="form-item-40">
                      <v-textarea
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_checks')"
                        auto-grow
                        v-model="item.buildChecks"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_checks_tip_1')"
                        persistent-hint
                        rows="1"
                        dense
                        style="white-space:nowrap;"
                        wrap="off"
                        row-height="12"
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
                      </v-textarea>
                    </div>
                  </div>
                  <div class="form-row d-flex justify-space-between pr-20 mt-4" @click.stop="() => {}">
                    <div class="form-item-40">
                      <v-textarea
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_build_caches')"
                        auto-grow
                        v-model="item.buildCaches"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_build_def_build_caches_tip_1')"
                        persistent-hint
                        rows="1"
                        dense
                        style="white-space:nowrap;"
                        wrap="off"
                        row-height="12"
                      >
                      </v-textarea>
                    </div>
                    <div class="form-item-50">
                      <v-textarea
                        :label="$vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings')"
                        auto-grow
                        v-model="item.sonarExtraSettings"
                        rows="1"
                        dense
                        style="white-space:nowrap;"
                        wrap="off"
                        row-height="12"
                        :messages="[$vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_1'), $vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_2'), $vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_3')]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_build_def_sonar_extra_settings_tip_3')}}</div>
                        </template>
                      </v-textarea>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="packageDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_package_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="packageDefsHistory('packageDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openSelectDemoDef('packageDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewPackageDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.packageDefDialog = false
            this.$refs.packageDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgPackageDefs"
          >
            {{ errMsgPackageDefs }}
          </v-alert>
          <v-form ref="packageDefRef">
            <v-expansion-panels accordion class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in packageDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_package_def_package_name')"
                        dense
                        v-model="item.packageName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_package_def_package_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-autocomplete
                        :items="project.buildNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_package_def_related_builds')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_package_def_related_builds_tip_1')"
                        persistent-hint
                        multiple
                        small-chips
                        v-model="item.relatedBuilds"
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyPackageDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deletePackageDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="form-row d-flex justify-space-between pr-20 mt-4">
                    <div class="form-item-100">
                      <v-textarea
                        :label="$vuetify.lang.t('$vuetify.lang_form_package_def_docker_file')"
                        auto-grow
                        v-model="item.dockerFile"
                        :messages="[$vuetify.lang.t('$vuetify.lang_form_package_def_docker_file_tip_1'), $vuetify.lang.t('$vuetify.lang_form_package_def_docker_file_tip_2')]"
                        rows="1"
                        dense
                        style="white-space:nowrap;"
                        wrap="off"
                        row-height="12"
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
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_package_def_docker_file_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_package_def_docker_file_tip_2')}}</div>
                        </template>
                      </v-textarea>
                    </div>
                  </div>
                  <div class="params-item mt-4">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images')}}</small>
                    <v-tooltip right max-width="300px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_tip_1')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addExtraPushImages(index)">mdi-table-plus</v-icon>
                    <div class="d-flex justify-space-between mt-4" v-for="(row, i) in item.extraPushImages" :key="i">
                      <div class="form-item-30 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_image_path')"
                          dense
                          v-model="row.imagePath"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_image_path_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-30 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_username')"
                          dense
                          v-model="row.username"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_username_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-30 mt-4">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_password')"
                          dense
                          v-model="row.password"
                          type="password"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_package_def_extra_push_images_password_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyExtraPushImages(index, i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteExtraPushImages(index, i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="artifactDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_artifact_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="artifactDefsHistory('artifactDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openSelectDemoDef('artifactDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewArtifactDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.artifactDefDialog = false
            this.$refs.artifactDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgArtifactDefs"
          >
            {{ errMsgArtifactDefs }}
          </v-alert>
          <v-form ref="artifactDefRef">
            <v-expansion-panels accordion class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in artifactDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifact_name')"
                        dense
                        v-model="item.artifactName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifact_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-autocomplete
                        :items="project.buildNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_artifact_def_related_builds')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_artifact_def_related_builds_tip_1')"
                        persistent-hint
                        multiple
                        small-chips
                        v-model="item.relatedBuilds"
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyArtifactDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteArtifactDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row pr-20 mt-4" @click.stop="() => {}">
                    <div class="form-item-100">
                      <div class="de-flex align-center hidden-input">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifacts')}}</small>
                        <v-icon color="success" class="ml-4" @click="addArtifact(index)">mdi-table-plus</v-icon>
                        <v-text-field
                          dense
                          type="hidden"
                          class="form-item-20"
                          v-model="item.artifacts"
                          :rules="[v => v.length>0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        ></v-text-field>
                      </div>
                      <div v-for="(i, j) in item.artifacts" :key="j" class="d-flex justify-space-between">
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifacts_src')"
                            dense
                            v-model="i[0]"
                            :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
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
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifacts_dst')"
                            dense
                            v-model="i[1]"
                            :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
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
                        <v-icon color="error" @click="deleteArtifact(index, j)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifacts_tip_1')}}</small>
                      </div>
                      <div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_artifact_def_artifacts_tip_2')}}</small>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dockerIgnoreDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="dockerIgnoreDefsHistory('dockerIgnoreDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewDockerIgnoreDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.dockerIgnoreDefDialog = false
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="dockerIgnoreDefRef">
            <div class="form-item-100">
              <v-textarea
                :label="$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def')"
                dense
                :messages="[$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_1'), $vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_2'), $vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_3'), $vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_4'), $vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_5'), $vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_6')]"
                v-model="dockerIgnoreDefForm"
                row="1"
                auto-grow
                style="white-space:nowrap;"
                wrap="off"
                row-height="12"
              >
                <template v-slot:message>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_1')}}</div>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_2')}}</div>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_3')}}</div>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_4')}}</div>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_5')}}</div>
                  <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_docker_ignore_def_tip_6')}}</div>
                </template>
              </v-textarea>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="istioGatewayDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def')}} ({{ targetEnvName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="istioGatewayDefHistory('istioGatewayDef')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewIstioGatewayDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.istioGatewayDefDialog = false
            this.$refs.istioGatewayDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgIstioGatewayDef"
          >
            {{ errMsgIstioGatewayDef }}
          </v-alert>
          <v-form ref="istioGatewayDefRef">
            <div class="form-row d-flex justify-space-between">
              <div class="form-item-20">
                <v-autocomplete
                  :items="[ true, false ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_enable')"
                  dense
                  v-model="istioGatewayDefForm.enable"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_enable_tip_1')"
                  persistent-hint
                />
              </div>
            </div>
            <div class="form-row d-flex justify-space-between mt-4">
              <div class="form-item">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_host_default')"
                  dense
                  v-model="istioGatewayDefForm.hostDefault"
                  :rules="istioGatewayDefForm.enable ? [v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')] : []"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_host_default_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_host_new')"
                  dense
                  v-model="istioGatewayDefForm.hostNew"
                  :rules="istioGatewayDefForm.enable ? [v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')] : []"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_host_new_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item d-flex">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header')"
                  dense
                  v-model="istioGatewayDefForm.sourceSubsetHeader"
                  :rules="istioGatewayDefForm.enable ? [v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')] : []"
                  :messages="[$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_1'), $vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_2'), $vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_3')]"
                >
                  <template v-slot:message>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_1')}}</div>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_2')}}</div>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_istio_gateway_def_source_subset_header_tip_3')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="form-row d-flex mt-4">
              <div class="form-item-45 mt-4">
                <v-autocomplete
                  :items="[
                    { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                    { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                  ]"
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed')"
                  dense
                  v-model="istioGatewayDefForm.certSelfSigned"
                  :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_1')"
                  persistent-hint
                />
              </div>
              <div class="form-item-45 mt-4">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path')"
                  dense
                  v-model="istioGatewayDefForm.certPath"
                  :messages="[
                    $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1'),
                    $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2'),
                    $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3'),
                    $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4'),
                  ]"
                >
                  <template v-slot:message>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1')}}</div>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2')}}</div>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3')}}</div>
                    <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4')}}</div>
                  </template>
                </v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deployContainerDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def')}} ({{ targetEnvName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="deployContainerDefsHistory('deployContainerDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">mdi-progress-question</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="openDeployContainerDefToEnv()">mdi-arrow-left-bold-hexagon-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="openSelectDemoDef('deployContainerDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="previewDeployContainerDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="previewDeployContainerDefYaml()">mdi-motion-play-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_deployment_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" class="mr-4" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.deployContainerDefDialog = false
            this.$refs.deployContainerDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgDeployContainerDefs"
          >
            {{ errMsgDeployContainerDefs }}
          </v-alert>
          <v-form ref="deployContainerDefRef">
            <v-expansion-panels accordion multiple class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in deployContainerDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="v-expansion-panel-header__icon">
                    <v-checkbox class="diy-icon" @change="checkDeployContainerDef($event, index)" @click.stop="()=>{}"></v-checkbox>
                  </div>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name')"
                        dense
                        v-model="item.deployName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item">
                      <v-autocomplete
                        :items="project.packageNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_related_package')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_related_package_tip_1')"
                        persistent-hint
                        v-model="item.relatedPackage"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item">
                      <v-autocomplete
                        :items="['deployment', 'statefulset', 'job', 'cronjob']"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type_tip_1')"
                        persistent-hint
                        v-model="item.deployType"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        @change="chooseDeployType($event, index)"
                      >
                      </v-autocomplete>
                    </div>
                    <div class="form-item">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_replicas')"
                        dense
                        type="number"
                        v-model.number="item.deployReplicas"
                        :rules="[intRule]"
                      >
                      </v-text-field>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyDeployContainerDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteDeployContainerDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row pr-20 pl-2" @click.stop="() => {}">
                    <div class="form-item">
                      <v-spacer></v-spacer>
                      <v-autocomplete
                        :items="deployContainerDefOpts"
                        dense
                        :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                        @change="chooseParams($event, index)"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.deployResources.cpuLimit !== '' ||
                      item.deployResources.cpuRequest !== '' ||
                      item.deployResources.memoryLimit !== '' ||
                      item.deployResources.memoryRequest !== '' ||
                      item.deployResources.extraRequest !== null ||
                      item.deployResources.extraLimit !== null
                      " :id="'deployResources-' + index"
                    >
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployResources')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div v-if="item.deployResources">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-20 d-flex">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request')"
                              dense
                              v-model="item.deployResources.memoryRequest"
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
                              v-model="item.deployResources.memoryLimit"
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
                              v-model="item.deployResources.cpuRequest"
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
                              v-model="item.deployResources.cpuLimit"
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
                          <v-icon color="success" class="ml-4" @click="addExtraRequest(index)">mdi-table-plus</v-icon>
                          <div class="d-flex justify-space-between mt-4" v-for="(row, i) in item.deployResources.extraRequest" :key="i">
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
                              <v-icon color="success" class="mr-4" @click="copyExtraRequest(index, i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteExtraRequest(index, i)">mdi-trash-can-outline</v-icon>
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
                          <v-icon color="success" class="ml-4" @click="addExtraLimit(index)">mdi-table-plus</v-icon>
                          <div class="d-flex justify-space-between mt-4" v-for="(row, i) in item.deployResources.extraLimit" :key="i">
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
                              <v-icon color="success" class="mr-4" @click="copyExtraLimit(index, i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteExtraLimit(index, i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.deployCommand !== '' ||
                      item.deployEnvs !== null ||
                      item.deployArgs !== null ||
                      item.workingDir !== '' ||
                      item.nodeSelector !== null ||
                      item.nodeName !== '' ||
                      item.terminationGracePeriodSeconds !== 0 ||
                      item.subdomain !== '' ||
                      item.enableDownwardApi ||
                      item.restartPolicy !== '' ||
                      item.deploySessionAffinityTimeoutSeconds !== 0 ||
                      item.deployHeadless !== false ||
                      item.podManagementPolicy !== ''
                      " :id="'deployOther-' + index"
                    >
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other')}} <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployOther')">mdi-minus-circle-outline</v-icon></div>
                      <div class="form-item-100 params-item">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-50 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command')"
                              dense
                              v-model="item.deployCommand"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command_tip_1')"
                              persistent-hint
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
                          <div class="form-item-50 d-flex align-center">
                            <v-combobox
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args')"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              v-model="item.deployArgs"
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
                            <v-icon color="success" class="ml-4" @click="addDeployEnvs(index)">mdi-table-plus</v-icon>
                            <div class="env-item d-flex justify-space-between" v-for="(row, i) in item.deployEnvs" :key="i" v-if="item.deployEnvs">
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
                              <v-icon color="error" class="mt-4" @click="deleteDeployEnvs(index, i)">mdi-trash-can-outline</v-icon>
                            </div>
                            <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_tip_1')}}</small></div>
                          </div>
                          <div class="form-item-50 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir')"
                              dense
                              v-model="item.workingDir"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir_tip_1')"
                              persistent-hint
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-item-100 params-item" v-if="!nodeSelectorDisable || !nodeNameDisable">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-45" v-if="!nodeSelectorDisable">
                            <v-autocomplete
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector')"
                              dense
                              multiple
                              chips
                              :items="nodeLabels"
                              item-text="text"
                              item-value="text"
                              return-object
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector_tip_1')"
                              persistent-hint
                              v-model="item.nodeSelector"
                            ></v-autocomplete>
                          </div>
                          <div class="form-item-45 d-flex align-center" v-if="!nodeNameDisable">
                            <v-autocomplete
                              :items="nodeNames"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name')"
                              dense
                              clearable
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name_tip_1')"
                              persistent-hint
                              v-model="item.nodeName"
                            ></v-autocomplete>
                          </div>
                        </div>
                      </div>
                      <div class="form-item-100 params-item">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-45 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds')"
                              dense
                              type="number"
                              v-model.number="item.terminationGracePeriodSeconds"
                              :rules="[intRuleZero]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds')"
                              dense
                              type="number"
                              v-model.number="item.deploySessionAffinityTimeoutSeconds"
                              :rules="[intRuleZero]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds_tip_1')"
                              persistent-hint
                            />
                          </div>
                        </div>
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-45 d-flex align-center" v-if="!subdomainDisable">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain')"
                              dense
                              v-model="item.subdomain"
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
                          <div class="form-item-45 d-flex align-center" v-if="!enableDownwardApiDisable">
                            <v-autocomplete
                              :items="[
                                { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                                { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api')"
                              dense
                              v-model="item.enableDownwardApi"
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
                            </v-autocomplete>
                          </div>
                        </div>
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-45 d-flex align-center">
                            <v-autocomplete
                              v-if="item.deployType === 'deployment' || item.deployType === 'statefulset'"
                              :items="[
                                { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy_always'), value: 'Always' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy_on_failure'), value: 'OnFailure' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy_never'), value: 'Never' },
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy')"
                              dense
                              clearable
                              v-model="item.restartPolicy"
                            >
                            </v-autocomplete>
                            <v-autocomplete
                              v-else-if="item.deployType === 'job' || item.deployType === 'cronjob'"
                              :items="[
                                { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy_on_failure'), value: 'OnFailure' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy_never'), value: 'Never' },
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_restart_policy')"
                              dense
                              clearable
                              v-model="item.restartPolicy"
                            >
                            </v-autocomplete>
                          </div>
                          <div class="form-item-45 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path')"
                              dense
                              v-model="item.deployImagePath"
                              :messages="[
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_1'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_2'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_3'),
                              ]"
                            >
                              <template v-slot:message>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_1')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_2')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_path_tip_3')}}</div>
                              </template>
                            </v-text-field>
                          </div>                          
                        </div>
                      </div>
                      <div class="form-item-100 params-item" v-if="item.deployType === 'statefulset'">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-45 d-flex align-center">
                            <v-autocomplete
                              :items="[
                                { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                                { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless')"
                              dense
                              v-model="item.deployHeadless"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45 d-flex align-center">
                            <v-autocomplete
                              :items="['OrderedReady', 'Parallel']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy')"
                              dense
                              v-model="item.podManagementPolicy"
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
                            </v-autocomplete>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.job.completions !== 0 ||
                      item.job.parallelism !== 0 ||
                      item.job.completionMode !== '' ||
                      item.job.backoffLimit !== 0 ||
                      item.job.activeDeadlineSeconds !== 0 ||
                      item.job.ttlSecondsAfterFinished !== 0
                      " :id="'job-' + index"
                    >
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="error" @click="clearParams(index, 'job')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_completions')"
                            dense
                            v-model.number="item.job.completions"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_completions_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_parallelism')"
                            dense
                            v-model.number="item.job.parallelism"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_parallelism_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-autocomplete
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_completion_mode')"
                            dense
                            chips
                            clearable
                            :items="['NonIndexed', 'Indexed']"
                            v-model="item.job.completionMode"
                          >
                          </v-autocomplete>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_completion_mode_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_completion_mode_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_backoff_limit')"
                            dense
                            v-model.number="item.job.backoffLimit"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_backoff_limit_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_active_deadline_seconds')"
                            dense
                            v-model.number="item.job.activeDeadlineSeconds"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_active_deadline_seconds_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_active_deadline_seconds_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_ttl_seconds_after_finished')"
                            dense
                            v-model.number="item.job.ttlSecondsAfterFinished"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_ttl_seconds_after_finished_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_job_ttl_seconds_after_finished_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.cronJob.schedule !== '' ||
                      item.cronJob.concurrencyPolicy !== '' ||
                      item.cronJob.startingDeadlineSeconds !== 0 ||
                      item.cronJob.successfulJobsHistoryLimit !== 0 ||
                      item.cronJob.failedJobsHistoryLimit !== 0
                      " :id="'cronJob-' + index"
                    >
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="error" @click="clearParams(index, 'cronJob')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_schedule')"
                            dense
                            v-model="item.cronJob.schedule"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_schedule_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_schedule_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-50 d-flex align-center">
                          <v-autocomplete
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_concurrency_policy')"
                            dense
                            chips
                            clearable
                            :items="['Allow', 'Forbid', 'Replace']"
                            v-model="item.cronJob.concurrencyPolicy"
                          >
                          </v-autocomplete>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_concurrency_policy_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_concurrency_policy_tip_2')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_concurrency_policy_tip_3')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_starting_deadline_seconds')"
                            dense
                            v-model.number="item.cronJob.startingDeadlineSeconds"
                            :rules="[intRuleZero]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_starting_deadline_seconds_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_successful_jobs_history_limit')"
                            dense
                            v-model.number="item.cronJob.successfulJobsHistoryLimit"
                            :rules="[intRuleZero]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_successful_jobs_history_limit_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_failed_jobs_history_limit')"
                            dense
                            v-model.number="item.cronJob.failedJobsHistoryLimit"
                            :rules="[intRule]"
                            type="number"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_cron_job_failed_jobs_history_limit_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="item.deployMeta.labels !== null || item.deployMeta.annotations !== null" :id="'deployMeta-' + index">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta')}} <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployMeta')">mdi-minus-circle-outline</v-icon></div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels')}}</small>
                          <v-icon color="success" class="ml-4" @click="addDeployMetaLabels(index)">mdi-table-plus</v-icon>
                          <div class="env-item d-flex justify-space-between" v-for="(row, i) in item.deployMeta.labels" :key="i" v-if="item.deployMeta.labels">
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
                            <v-icon color="error" class="mt-4" @click="deleteDeployMetaLabels(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                          <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_tip_1')}}</small></div>
                        </div>
                        <div class="form-item-50">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations')}}</small>
                          <v-icon color="success" class="ml-4" @click="addDeployMetaAnnotations(index)">mdi-table-plus</v-icon>
                          <div class="env-item d-flex justify-space-between" v-for="(row, i) in item.deployMeta.annotations" :key="i" v-if="item.deployMeta.annotations">
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
                            <v-icon color="error" class="mt-4" @click="deleteDeployMetaAnnotations(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                          <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_tip_1')}}</small></div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" :id="'deployPorts-' + index" v-if="item.deployNodePorts !== null || item.deployLocalPorts !== null">
                      <div class="form-item-45 mt-4 d-flex align-center">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports'), value: 'deployLocalPorts' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports'), value: 'deployNodePorts' },
                          ]"
                          dense
                          :value="item.deployLocalPorts === null ? 'deployNodePorts' : 'deployLocalPorts'"
                          :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                          @change="changePortSet($event, index)"
                        ></v-autocomplete>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployPorts')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="form-item-100" v-if="item.deployLocalPorts !== null" :id="'deployLocalPorts-' + index">
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
                          <v-icon color="success" class="mx-4" @click="addDeployLocalPort(index)">mdi-table-plus</v-icon>
                        </div>
                        <div class="params-content params-item justify-space-between mt-4" v-for="(row, i) in item.deployLocalPorts">
                          <div class="form-item-100 d-flex">
                            <div class="form-item-40 mt-4 d-flex">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_port')"
                                dense
                                type="number"
                                v-model.number="row.port"
                                :rules="[intRule]"
                              />
                            </div>
                            <div class="form-item-40 mt-4 d-flex">
                              <v-autocomplete
                                :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_protocol')"
                                dense
                                v-model="row.protocol"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                          </div>
                          <div class="form-item-100 d-flex">
                            <div class="form-item-45 mt-4 d-flex">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name')"
                                dense
                                v-model="row.ingress.domainName"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name_tip_1')"
                                persistent-hint
                              />
                              <v-tooltip right max-width="250px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="form-item-45 mt-4 d-flex">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix')"
                                dense
                                v-model="row.ingress.pathPrefix"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix_tip_1')"
                                persistent-hint
                              />
                              <v-tooltip right max-width="250px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                          </div>
                          <div class="form-item-100 d-flex">
                            <div class="form-item-45 mt-4 d-flex">
                              <v-autocomplete
                                :items="[
                                  { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                                  { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                                ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed')"
                                dense
                                v-model="row.ingress.certSelfSigned"
                              />
                              <v-tooltip right max-width="250px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_1')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_2')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="form-item-45 mt-4 d-flex">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path')"
                                dense
                                v-model="row.ingress.certPath"
                              />
                              <v-tooltip right max-width="250px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_5')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="mt-4 d-flex">
                              <v-icon color="success" class="mr-4" @click="copyDeployLocalPort(index, i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteDeployLocalPort(index, i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-item-100" v-if="item.deployNodePorts !== null" :id="'deployNodePorts-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="mx-4" @click="addDeployNodePort(index)">mdi-table-plus</v-icon>
                        </div>
                        <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in item.deployNodePorts">
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_port')"
                              dense
                              type="number"
                              v-model.number="row.port"
                              :rules="[intRule]"
                            />
                          </div>
                          <div class="form-item">
                            <v-autocomplete
                              :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_protocol')"
                              dense
                              v-model="row.protocol"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item d-flex">
                            <v-autocomplete
                              :items="nodePorts"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port')"
                              dense
                              v-model="row.nodePort"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              persistent-hint
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <v-icon color="success" class="mr-4" @click="copyDeployNodePort(index, i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteDeployNodePort(index, i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="item.deployVolumes !== null" :id="'deployVolumes-' + index">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addDeployVolumes(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployVolumes')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in item.deployVolumes">
                        <div class="form-item">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pod')"
                            dense
                            v-model="row.pathInPod"
                            :rules="[v => !!v && v.slice(0,1) =='/' || $vuetify.lang.t('$vuetify.lang_form_required_must_start_with_slash')]"
                          />
                        </div>
                        <div class="form-item">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pv')"
                            dense
                            v-model="row.pathInPv"
                            :rules="[v => !!v && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                          />
                        </div>
                        <div class="form-item d-flex">
                          <v-autocomplete
                            :items="pvcNames || []"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc')"
                            dense
                            clearable
                            v-model="row.pvc"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <v-icon color="success" class="mr-4" @click="copyDeployVolumes(index, i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployVolumes(index, i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.deployHealthCheck.livenessDelaySeconds !== 0 ||
                      item.deployHealthCheck.livenessPeriodSeconds !== 0 ||
                      item.deployHealthCheck.readinessDelaySeconds !== 0 ||
                      item.deployHealthCheck.readinessPeriodSeconds !== 0 ||
                      item.deployHealthCheck.startupDelaySeconds !== 0 ||
                      item.deployHealthCheck.startupPeriodSeconds !== 0 ||
                      item.deployHealthCheck.checkPort !== 0 ||
                      item.deployHealthCheck.exec !== '' ||
                      item.deployHealthCheck.httpGet.port !== 0 ||
                      item.deployHealthCheck.httpGet.path !== '' ||
                      item.deployHealthCheck.httpGet.scheme !== '' ||
                      item.deployHealthCheck.httpGet.httpHeaders !== null
                      " :id="'deployHealthCheck-' + index"
                    >
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="error" @click="clearParams(index, 'deployHealthCheck')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4">
                        <div class="form-item-50 d-flex align-center">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds')"
                            dense
                            v-model.number="item.deployHealthCheck.startupDelaySeconds"
                            :rules="[intRuleZero]"
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
                            v-model.number="item.deployHealthCheck.startupPeriodSeconds"
                            :rules="[intRuleZero]"
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
                            v-model.number="item.deployHealthCheck.readinessDelaySeconds"
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
                            v-model.number="item.deployHealthCheck.readinessPeriodSeconds"
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
                            v-model.number="item.deployHealthCheck.livenessDelaySeconds"
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
                            v-model.number="item.deployHealthCheck.livenessPeriodSeconds"
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
                            <v-autocomplete
                              :items="[
                                {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port'), value: 'checkPort'},
                                {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec'), value: 'exec'},
                                {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get'), value: 'httpGet'},
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_select_method')"
                              @change="healthCheckChange($event, index)"
                              :value="healthCheckInit(index)"
                            ></v-autocomplete>
                          </div>
                          <div class="mt-4" v-if="deployContainerDefForm[index].deployHealthCheck.checkPort !== 0">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port')"
                              dense
                              v-model.number="item.deployHealthCheck.checkPort"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="mt-4" v-if="deployContainerDefForm[index].deployHealthCheck.exec !== ''">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec')"
                              dense
                              v-model="item.deployHealthCheck.exec"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec_tip_1')"
                              persistent-hint
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
                          <div v-if="deployContainerDefForm[index].deployHealthCheck.httpGet.port !== 0">
                            <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get')}}</small>
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item-40">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_port')"
                                  dense
                                  v-model.number="item.deployHealthCheck.httpGet.port"
                                  :rules="[intRule]"
                                  type="number"
                                />
                              </div>
                              <div class="form-item-40">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_path')"
                                  dense
                                  v-model="item.deployHealthCheck.httpGet.path"
                                />
                              </div>
                              <div class="form-item-40">
                                <v-autocomplete
                                  :items="['HTTP', 'HTTPS']"
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_scheme')"
                                  dense
                                  v-model="item.deployHealthCheck.httpGet.scheme"
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
                            <v-icon color="success" class="ml-4" @click="addHealthCheckHttpHeaders(index)">mdi-table-plus</v-icon>
                            <div v-for="(row, i) in item.deployHealthCheck.httpGet.httpHeaders" :key="i">
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
                                <v-icon color="success" class="mr-4" @click="copyHealthCheckHttpHeaders(index, i)">mdi-content-copy</v-icon>
                                <v-icon color="error" @click="deleteHealthCheckHttpHeaders(index, i)">mdi-trash-can-outline</v-icon>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      item.lifecycle.postStart.exec !== '' ||
                      item.lifecycle.postStart.httpGet.port !== 0 ||
                      item.lifecycle.postStart.httpGet.path !== '' ||
                      item.lifecycle.postStart.httpGet.scheme !== '' ||
                      item.lifecycle.postStart.httpGet.httpHeaders !== null ||
                      item.lifecycle.preStop.exec !== '' ||
                      item.lifecycle.preStop.httpGet.port !== 0 ||
                      item.lifecycle.preStop.httpGet.path !== '' ||
                      item.lifecycle.preStop.httpGet.scheme !== '' ||
                      item.lifecycle.preStop.httpGet.httpHeaders !== null
                      " :id="'lifecycle-' + index"
                    >
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_tip_1')}}</span>
                        </v-tooltip>
                        <v-icon color="error" @click="clearParams(index, 'lifecycle')">mdi-minus-circle-outline</v-icon>
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
                              <v-autocomplete
                                :items="[
                                  {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                                  {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                                ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_select_method')"
                                @change="lifecyclePostStartChange($event, index)"
                                :value="lifecyclePostStartInit(index)"
                              ></v-autocomplete>
                            </div>
                            <div class="mt-4" v-if="deployContainerDefForm[index].lifecycle.postStart.exec !== ''">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                                dense
                                v-model="item.lifecycle.postStart.exec"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                                persistent-hint
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
                            <div v-if="deployContainerDefForm[index].lifecycle.postStart.httpGet.port !== 0">
                              <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                              <div class="d-flex justify-space-between mt-4">
                                <div class="form-item-40">
                                  <v-text-field
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                    dense
                                    v-model.number="item.lifecycle.postStart.httpGet.port"
                                    :rules="[intRule]"
                                    type="number"
                                  />
                                </div>
                                <div class="form-item-40">
                                  <v-text-field
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                    dense
                                    v-model="item.lifecycle.postStart.httpGet.path"
                                  />
                                </div>
                                <div class="form-item-40">
                                  <v-autocomplete
                                    :items="['HTTP', 'HTTPS']"
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                    dense
                                    v-model="item.lifecycle.postStart.httpGet.scheme"
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
                              <v-icon color="success" class="ml-4" @click="addLifecyclePostStartHttpHeaders(index)">mdi-table-plus</v-icon>
                              <div v-for="(row, i) in item.lifecycle.postStart.httpGet.httpHeaders" :key="i">
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
                                  <v-icon color="success" class="mr-4" @click="copyLifecyclePostStartHttpHeaders(index, i)">mdi-content-copy</v-icon>
                                  <v-icon color="error" @click="deleteLifecyclePostStartHttpHeaders(index, i)">mdi-trash-can-outline</v-icon>
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
                              <v-autocomplete
                                :items="[
                                  {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                                  {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                                ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_select_method')"
                                @change="lifecyclePreStopChange($event, index)"
                                :value="lifecyclePreStopInit(index)"
                              ></v-autocomplete>
                            </div>
                            <div class="mt-4" v-if="deployContainerDefForm[index].lifecycle.preStop.exec !== ''">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                                dense
                                v-model="item.lifecycle.preStop.exec"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                                persistent-hint
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
                            <div v-if="deployContainerDefForm[index].lifecycle.preStop.httpGet.port !== 0">
                              <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                              <div class="d-flex justify-space-between mt-4">
                                <div class="form-item-40">
                                  <v-text-field
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                    dense
                                    v-model.number="item.lifecycle.preStop.httpGet.port"
                                    :rules="[intRule]"
                                    type="number"
                                  />
                                </div>
                                <div class="form-item-40">
                                  <v-text-field
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                    dense
                                    v-model="item.lifecycle.preStop.httpGet.path"
                                  />
                                </div>
                                <div class="form-item-40">
                                  <v-autocomplete
                                    :items="['HTTP', 'HTTPS']"
                                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                    dense
                                    v-model="item.lifecycle.preStop.httpGet.scheme"
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
                              <v-icon color="success" class="ml-4" @click="addLifecyclePreStopHttpHeaders(index)">mdi-table-plus</v-icon>
                              <div v-for="(row, i) in item.lifecycle.preStop.httpGet.httpHeaders" :key="i">
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
                                  <v-icon color="success" class="mr-4" @click="copyLifecyclePreStopHttpHeaders(index, i)">mdi-content-copy</v-icon>
                                  <v-icon color="error" @click="deleteLifecyclePreStopHttpHeaders(index, i)">mdi-trash-can-outline</v-icon>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="
                      !hpaConfigDisable &&
                      (item.hpaConfig.cpuAverageRequestPercent !== 0 ||
                      item.hpaConfig.maxReplicas !== 0 ||
                      item.hpaConfig.memoryAverageRequestPercent !== 0 ||
                      item.hpaConfig.cpuAverageValue !== '' ||
                      item.hpaConfig.memoryAverageValue !== '')
                      " :id="'hpaConfig-' + index">
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
                        <v-icon color="error" @click="clearParams(index, 'hpaConfig')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div v-if="item.hpaConfig">
                        <div class="params-content d-flex justify-space-between mt-4">
                          <div class="form-item-100">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_max_replicas')"
                              dense
                              v-model.number="item.hpaConfig.maxReplicas"
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
                              v-model="item.hpaConfig.memoryAverageValue"
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
                              v-model.number="item.hpaConfig.memoryAverageRequestPercent"
                              :rules="[intRuleZero]"
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
                              v-model="item.hpaConfig.cpuAverageValue"
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
                              v-model.number="item.hpaConfig.cpuAverageRequestPercent"
                              :rules="[intRuleZero]"
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
                    <div class="form-item-100 params-item" v-if="item.dependServices !== null" :id="'dependServices-' + index">
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
                        <v-icon color="success" class="ml-4" @click="addDependServices(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'dependServices')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content" v-for="(row, i) in item.dependServices">
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name')"
                              dense
                              v-model="row.dependName"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_port')"
                              dense
                              v-model.number="row.dependPort"
                              type="number"
                            />
                          </div>
                          <div class="form-item">
                            <v-autocomplete
                              :items="[ 'TCP', 'UDP' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_type')"
                              dense
                              clearable
                              v-model="row.dependType"
                            />
                          </div>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-100">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url')"
                              dense
                              v-model="row.httpGetUrl"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <v-icon color="success" class="mr-4" @click="copyDependServices(index, i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteDependServices(index, i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="!hostAliasesDisable && item.hostAliases !== null" :id="'hostAliases-' + index">
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
                        <v-icon color="success" class="ml-4" @click="addHostAliases(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'hostAliases')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4 align-center" v-for="(row, i) in item.hostAliases">
                        <div class="form-item">
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
                        <v-icon color="success" class="mr-4" @click="copyHostAliases(index, i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteHostAliases(index, i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="!securityContextDisable && (item.securityContext.runAsUser !== 0 || item.securityContext.runAsGroup !== 0)" :id="'securityContext-' + index">
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
                        <v-icon color="error" @click="clearParams(index, 'securityContext')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content d-flex justify-space-between mt-4" v-if="item.securityContext">
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_user')"
                            dense
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="item.securityContext.runAsUser"
                          />
                        </div>
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_group')"
                            dense
                            type="number"
                            :rules="[intRuleZero]"
                            v-model.number="item.securityContext.runAsGroup"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="item.deployConfigSettings !== null" :id="'deployConfigSettings-' + index">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_2')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addDeployConfigSettings(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployConfigSettings')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content" v-for="(row, i) in item.deployConfigSettings">
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path')"
                              dense
                              v-model="row.localPath"
                              :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path')"
                              dense
                              v-model="row.podPath"
                              :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path_tip_1')"
                              persistent-hint
                            />
                          </div>
                        </div>
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45">
                            <v-autocomplete
                              :items="pvcNames || []"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name')"
                              dense
                              clearable
                              v-model="row.pvcName"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div>
                            <v-icon color="success" class="mr-4" @click="copyDeployConfigSettings(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteDeployConfigSettings(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="item.deployConfigMaps !== null" :id="'deployConfigMaps-' + index">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_free_trial_not_supported')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addDeployConfigMaps(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deployConfigMaps')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content" v-for="(row, i) in item.deployConfigMaps">
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_name')"
                              dense
                              v-model="row.name"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_name_tip_1', project.projectInfo.projectShortName)"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45">
                            <v-autocomplete
                              :items="['from-file', 'from-env-file']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_from_file_type')"
                              dense
                              v-model="row.fromFileType"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :messages="[
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_from_file_type_tip_1'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_from_file_type_tip_2'),
                              ]"
                            >
                              <template v-slot:message>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_from_file_type_tip_1')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_from_file_type_tip_2')}}</div>
                              </template>
                            </v-autocomplete>
                          </div>
                        </div>
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45">
                            <v-combobox
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_paths')"
                              v-model="row.paths"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps_paths_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div>
                            <v-icon color="success" class="mr-4" @click="copyDeployConfigMaps(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteDeployConfigMaps(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="item.deploySecrets !== null" :id="'deploySecrets-' + index">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_free_trial_not_supported')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addDeploySecrets(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'deploySecrets')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="params-content" v-for="(row, i) in item.deploySecrets">
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_name')"
                              dense
                              v-model="row.name"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_name_tip_1', project.projectInfo.projectShortName)"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45">
                            <v-autocomplete
                              :items="['generic', 'docker-registry', 'tls']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type')"
                              dense
                              v-model="row.secretType"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :messages="[
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_1'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_2'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_3'),
                              ]"
                              @change="selectDeployContainerDefDeploySecretType($event, index, i)"
                            >
                              <template v-slot:message>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_1')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_2')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_secret_type_tip_3')}}</div>
                              </template>
                            </v-autocomplete>
                          </div>
                        </div>
                        <div class="d-flex justify-space-between align-center mt-4" >
                          <div class="form-item-45" v-if="row.secretType === 'generic'">
                            <v-autocomplete
                              :items="['from-file', 'from-env-file']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_from_file_type')"
                              dense
                              v-model="row.fromFileType"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :messages="[
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_from_file_type_tip_1'),
                                $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_from_file_type_tip_2'),
                              ]"
                            >
                              <template v-slot:message>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_from_file_type_tip_1')}}</div>
                                <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_from_file_type_tip_2')}}</div>
                              </template>
                            </v-autocomplete>
                          </div>
                          <div class="form-item-45" v-if="row.secretType === 'generic'">
                            <v-combobox
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_paths')"
                              v-model="row.paths"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_paths_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item-45" v-if="row.secretType === 'docker-registry'">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_docker_config')"
                              dense
                              v-model="row.dockerConfig"
                              :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                            />
                          </div>
                          <div class="form-item-45" v-if="row.secretType === 'tls'">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_cert')"
                              dense
                              v-model="row.cert"
                              :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                            />
                          </div>
                          <div class="form-item-45" v-if="row.secretType === 'tls'">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets_key')"
                              dense
                              v-model="row.key"
                              :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                            />
                          </div>
                          <div>
                            <v-icon color="success" class="mr-4" @click="copyDeploySecrets(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteDeploySecrets(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100 params-item" v-if="!patchesDisable && item.patches !== null" :id="'patches-' + index">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches')}}
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_free_trial_not_supported')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addPatches(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" class="ml-4" @click="clearParams(index, 'patches')">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div v-for="(patch, i) in item.patches">
                        <div class="params-content d-flex justify-space-between align-center mt-4">
                          <div class="form-item d-flex align-center">
                            <v-autocomplete
                              :items="[ 'deployment', 'service', 'hpa' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind')"
                              dense
                              v-model="patch.resourceKind"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind_tip_1')"
                              persistent-hint
                            />
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path')"
                              dense
                              v-model="patch.path"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                            <v-tooltip right max-width="350px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_2')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_3')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_4')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div>
                            <v-icon color="success" class="mr-4" @click="copyPatches(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deletePatches(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                        <div class="params-content d-flex justify-space-between align-center mt-4">
                          <div class="form-item-100 d-flex align-center">
                            <v-textarea
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content')"
                              dense
                              auto-grow
                              rows="1"
                              style="white-space:nowrap;"
                              wrap="off"
                              row-height="12"
                              v-model="patch.content"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                            <v-tooltip right max-width="350px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_2')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_3')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_4')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_5')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_6')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_7')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deployContainerDefYamlDialog"
      max-width="1200px"
      persistent
      eager
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_view_deployment_yaml')}}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="deployContainerDefModules"
                :label="$vuetify.lang.t('$vuetify.lang_view_module_name')"
                dense
                small-chips
                v-model="deployContainerDefModuleName"
                @change="selectDeployContainerDefYaml()"
              />
            </v-container>
          </v-form>
          <Monaco
            ref="deployContainerDefYaml"
            :monacoOptions="singleMonacoOptions"
            :height="500"
          ></Monaco>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDeployContainerDefYaml()"
          >
            {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="copyToEnvDeployContainerDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.copyToEnvDeployContainerDialog = false
            this.$refs.copyToEnvDeployContainerRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="copyToEnvDeployContainerRef">
            <v-autocomplete
              :items="copyEnvList"
              :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name')"
              dense
              v-model="envNames"
              multiple
              small-chips
              required
              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deployArtifactDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def')}} ({{ targetEnvName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="deployArtifactDefsHistory('deployArtifactDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="openDeployArtifactDefToEnv()">mdi-arrow-left-bold-hexagon-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openSelectDemoDef('deployArtifactDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewDeployArtifactDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.deployArtifactDefDialog = false
            this.$refs.deployArtifactDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgDeployArtifactDefs"
          >
            {{ errMsgDeployArtifactDefs }}
          </v-alert>
          <v-form ref="deployArtifactDefRef">
            <v-expansion-panels accordion multiple class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in deployArtifactDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="v-expansion-panel-header__icon">
                    <v-checkbox class="diy-icon copy-check" ref="checkBoxRef" @change="checkDeployArtifactDef($event, index)" @click.stop="()=>{}"></v-checkbox>
                  </div>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_deploy_artifact_name')"
                        dense
                        v-model="item.deployArtifactName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_deploy_artifact_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item">
                      <v-autocomplete
                        :items="project.artifactNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_related_artifact')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_related_artifact_tip_1')"
                        persistent-hint
                        v-model="item.relatedArtifact"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item">
                      <v-autocomplete
                        :items="hostnames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_hosts')"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_hosts_tip_1')"
                        persistent-hint
                        v-model="item.hosts"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyDeployArtifactDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteDeployArtifactDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="form-row pr-20 pl-2" @click.stop="() => {}">
                    <div class="params-item">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables')}}
                        <v-tooltip right max-width="450px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_4')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_5')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_6')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_7')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_8')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_9')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_10')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_11')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_12')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="mx-4" @click="addVariables(index)">mdi-table-plus</v-icon>
                        <v-icon color="error" @click="clearVariables(index)">mdi-minus-circle-outline</v-icon>
                      </div>
                      <div class="d-flex justify-space-between mt-4" v-for="(row, i) in item.variables" :key="i" v-if="item.variables !== null">
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_name')"
                            dense
                            v-model="row[0]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_value')"
                            dense
                            v-model="row[1]"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" @click="deleteVariables(index, i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                    <div class="params-item">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_tasks')}}
                        <v-tooltip right max-width="450px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_tasks_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_tasks_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_4')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_5')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_6')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_7')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_8')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_9')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_10')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_11')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_variables_tip_12')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                      <div class="d-flex justify-space-between mt-4">
                        <div class="form-item-100">
                          <v-textarea
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_artifact_def_tasks')"
                            dense
                            auto-grow
                            row-height="15"
                            v-model="item.tasks"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="copyToEnvDeployArtifactDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.copyToEnvDeployArtifactDialog = false
            this.$refs.copyToEnvDeployArtifactRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="copyToEnvDeployArtifactRef">
            <v-autocomplete
              :items="copyEnvList"
              :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name')"
              dense
              v-model="envNames"
              multiple
              small-chips
              required
              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="istioDefDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_istio_def')}} ({{ targetEnvName }})</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="istioDefsHistory('istioDefs')">mdi-history</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="openIstioDefToEnv()">mdi-arrow-left-bold-hexagon-outline</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="openSelectDemoDef('istioDefs')">mdi-table-plus</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_new_item')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" class="mx-4" v-bind="attrs" v-on="on" @click="previewIstioDefDef()">mdi-cube-scan</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.istioDefDialog = false
            this.$refs.istioDefRef.resetValidation()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-alert
            prominent
            type="error"
            v-if="errMsgIstioDefs"
          >
            {{ errMsgIstioDefs }}
          </v-alert>
          <v-form ref="istioDefRef">
            <v-expansion-panels accordion multiple class="buildDef-panel">
              <v-expansion-panel v-for="(item, index) in istioDefDefForm" :key="index">
                <v-expansion-panel-header>
                  <div class="v-expansion-panel-header__icon">
                    <v-checkbox class="diy-icon copy-check" ref="checkBoxRef" @change="checkIstioDefDef($event, index)" @click.stop="()=>{}"></v-checkbox>
                  </div>
                  <div class="form-row d-flex justify-space-between" @click.stop="() => {}">
                    <div class="form-item">
                      <v-autocomplete
                        :items="deployContainerNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_deploy_name')"
                        dense
                        v-model="item.deployName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_deploy_name_tip_1', project.projectInfo.projectShortName)"
                        persistent-hint
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_port')"
                        dense
                        v-model.number="item.port"
                        type="number"
                        :rules="[intRule]"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_port_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_port_tip_2')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item d-flex align-center">
                      <v-autocomplete
                        :items="[ 'http', 'tcp' ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_protocol')"
                        dense
                        v-model="item.protocol"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      ></v-autocomplete>
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_protocol_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="v-expansion-panel-header__icon ml-2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="diy-icon" v-bind="attrs" v-on="on" @click.stop="copyIstioDefDef(index)">mdi-content-copy</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" class="ml-2 diy-icon" v-bind="attrs" v-on="on" @click.stop="deleteIstioDefDef(index)">mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{$vuetify.lang.t('$vuetify.lang_menu_delete')}}</span>
                    </v-tooltip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <div class="form-row pr-20 pl-2" @click.stop="() => {}">
                    <div class="form-item-100" v-if="item.protocol === 'http'">
                      <div class="mb-4">{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings')}}</div>
                      <div class="form-item-45 mt-4">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers'), value: 'matchHeaders' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway'), value: 'gateway' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_timeout'), value: 'timeout' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries'), value: 'retries' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror'), value: 'mirror' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy'), value:'corsPolicy' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer'), value: 'loadBalancer' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool'), value: 'connectionPool' },
                            { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection'), value: 'outlierDetection' }
                          ]"
                          dense
                          :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                          @change="chooseHttpSettings($event, index)"
                        ></v-autocomplete>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.matchHeaders !== null" :id="'matchHeaders-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="mx-4" @click="addMatchHeaders(index)">mdi-table-plus</v-icon>
                          <v-icon color="error" @click="claerHttpSettings(index, 'matchHeaders')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="d-flex justify-space-between mt-4" v-for="(row, i) in item.httpSettings.matchHeaders" :key="i">
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers_header')"
                              dense
                              v-model="row.header"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item">
                            <v-autocomplete
                              :items="[ 'exact', 'prefix', 'regex' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers_match_type')"
                              dense
                              v-model="row.matchType"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            ></v-autocomplete>
                          </div>
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_match_headers_match_value')"
                              dense
                              v-model="row.matchValue"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <v-icon color="success" class="mr-4" @click="copyMatchHeaders(index, i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteMatchHeaders(index, i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                      <div class="params-item" :id="'gateway-' + index" v-if="item.httpSettings.gatewayFlag">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'gateway')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="form-item mt-4">
                          <v-autocomplete
                            :items="[
                              { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_rewriteUri'), value: 'rewriteUri' },
                              { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris'), value: 'matchUris' },
                              { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_default'), value: 'matchDefault' },
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway')"
                            dense
                            :value="chooseGateway(index)"
                            @change="switchGateway($event, index)"
                          ></v-autocomplete>
                        </div>
                        <div class="form-item-100 mt-4" v-if="item.httpSettings.gateway.rewriteUri !== ''">
                          <div class="mt-4 d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_rewriteUri')"
                              dense
                              v-model="item.httpSettings.gateway.rewriteUri"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_rewriteUri_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_rewriteUri_tip_2')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                        <div class="form-item-100 mt-4" v-if="item.httpSettings.gateway.matchUris !== null">
                          <div>
                            {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris')}}
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris_tip_2')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris_tip_3')}}</div>
                              </div>
                            </v-tooltip>
                            <v-icon color="success" class="mx-4" @click="addMatchUris(index)">mdi-table-plus</v-icon>
                            <!-- <v-icon color="error">mdi-minus-circle-outline</v-icon> -->
                          </div>
                          <div class="form-item-100 d-flex justify-space-between mt-4" v-for="(row, i) in item.httpSettings.gateway.matchUris" :key="i">
                            <div class="form-item-45">
                              <v-autocomplete
                                :items="[ 'exact', 'prefix', 'regex' ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris_match_type')"
                                dense
                                v-model="row.matchType"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              ></v-autocomplete>
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_uris_match_value')"
                                dense
                                v-model="row.matchValue"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyMatchUris(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteMatchUris(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                        <div class="form-item-100 mt-4" v-if="item.httpSettings.gateway.rewriteUri === '' && item.httpSettings.gateway.matchUris === null">
                          <div class="mt-4 d-flex align-center">
                            <v-autocomplete
                              :items="[ true, false ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_default')"
                              dense
                              v-model="item.httpSettings.gateway.matchDefault"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_default_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_default_tip_2')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_gateway_match_default_tip_3')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.timeout !== ''" :id="'timeout-' + index">
                        {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_timeout')}}
                        <v-icon color="error" @click="claerHttpSettings(index, 'timeout')">mdi-minus-circle-outline</v-icon>
                        <div class="form-item-100 d-flex align-center mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_timeout')"
                            dense
                            v-model="item.httpSettings.timeout"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_timeout_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_timeout_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.retries.attempts !== 0 || item.httpSettings.retries.perTryTimeout !== '' || item.httpSettings.retries.retryOn.length > 0 " :id="'retries-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'retries')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_attempts')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.retries.attempts"
                              :rules="[intRule]"
                            />
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-autocomplete
                              :items="[ '5xx', 'gateway-error', 'reset', 'connect-failure', 'refused-stream' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on')"
                              dense
                              multiple
                              v-model="item.httpSettings.retries.retryOn"
                            ></v-autocomplete>
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_2')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_3')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_4')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_5')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_retry_on_tip_6')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_per_try_timeout')"
                              dense
                              v-model="item.httpSettings.retries.perTryTimeout"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_retries_per_try_timeout_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.mirror.host !== '' || item.httpSettings.mirror.port !== 0 || item.httpSettings.mirror.subset !== '' || item.httpSettings.mirror.mirrorPercent !== 0" :id="'mirror-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'mirror')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-20">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_host')"
                              dense
                              v-model="item.httpSettings.mirror.host"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item-20">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_port')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.mirror.port"
                              :rules="[intRule]"
                            />
                          </div>
                          <div class="form-item-20">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_subset')"
                              dense
                              v-model="item.httpSettings.mirror.subset"
                            />
                          </div>
                          <div class="form-item-20">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_mirror_percent')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.mirror.mirrorPercent"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_mirror_mirror_percent_tip_1')"
                              persistent-hint
                              :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="params-item" :id="'corsPolicy-' + index" v-if="item.httpSettings.corsPolicyFlag">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy')}}
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'corsPolicy')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-45">
                            <v-autocomplete
                              :items="[ true, false ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_credentials')"
                              dense
                              v-model="item.httpSettings.corsPolicy.allowCredentials"
                            />
                          </div>
                          <div class="form-item-45">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_max_age')"
                              dense
                              v-model="item.httpSettings.corsPolicy.maxAge"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_max_age_tip_1')"
                              persistent-hint
                            />
                          </div>
                        </div>
                        <div class="mt-4">
                          <div>
                            {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins')}}
                            <v-icon color="success" class="mx-4" @click="addAllowOrigins(index)">mdi-table-plus</v-icon>
                            <!-- <v-icon color="error">mdi-minus-circle-outline</v-icon> -->
                          </div>
                          <div class="form-item-100 d-flex justify-space-between mt-4" v-for="(row, i) in item.httpSettings.corsPolicy.allowOrigins" :key="i">
                            <div class="form-item-45 d-flex">
                              <v-autocomplete
                                :items="[ 'exact', 'prefix', 'regex' ]"
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins_match_type')"
                                dense
                                v-model="row[0]"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                              <v-tooltip right max-width="350px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins_tip_1')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins_tip_2')}}</div>
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins_tip_3')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_origins_match_value')"
                                dense
                                v-model="row[1]"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyAllowOrigins(index, i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteAllowOrigins(index, i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                        <div class="mt-4">
                          <div class="form-item-100">
                            <v-autocomplete
                              :items="[ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS' ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_methods')"
                              dense
                              multiple
                              small-chips
                              v-model="item.httpSettings.corsPolicy.allowMethods"
                            />
                          </div>
                        </div>
                        <div class="mt-4 d-flex justify-space-between">
                          <div class="form-item-45">
                            <v-combobox
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_headers')"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              v-model="item.httpSettings.corsPolicy.allowHeaders"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_allow_headers_tip_1')"
                              persistent-hint
                              append-icon=""
                            >
                            </v-combobox>
                          </div>
                          <div class="form-item-45">
                            <v-combobox
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_expose_headers')"
                              dense
                              multiple
                              small-chips
                              hide-selected
                              v-model="item.httpSettings.corsPolicy.exposeHeaders"
                              :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_cors_policy_expose_headers_tip_1')"
                              persistent-hint
                              append-icon=""
                            >
                            </v-combobox>
                          </div>
                        </div>
                      </div>
                      <div class="params-item" :id="'loadBalancer-' + index" v-if="item.httpSettings.loadBalancerFlag">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer')}}
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'loadBalancer')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-autocomplete
                            :items="[
                              { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_simple'), value: 'simple' },
                              { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash'), value: 'consistentHash' },
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer')"
                            dense
                            :value="item.httpSettings.loadBalancer.simple === '' ? 'consistentHash' : 'simple'"
                            @change="switchLoadBalancer($event, index)"
                          ></v-autocomplete>
                        </div>
                        <div class="mt-4 d-flex align-center" v-if="item.httpSettings.loadBalancer.simple !== ''">
                          <v-autocomplete
                            :items="[ 'ROUND_ROBIN', 'LEAST_CONN', 'RANDOM' ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_simple')"
                            dense
                            v-model="item.httpSettings.loadBalancer.simple"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_simple_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_simple_tip_2')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_simple_tip_3')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="mt-4" v-if="item.httpSettings.loadBalancer.consistentHash.httpHeaderName !== '' || item.httpSettings.loadBalancer.consistentHash.useSourceIp !== '' || item.httpSettings.loadBalancer.consistentHash.httpQueryParameterName !== '' || item.httpSettings.loadBalancer.consistentHash.httpCookie.name !== '' || item.httpSettings.loadBalancer.consistentHash.httpCookie.path !== '' || item.httpSettings.loadBalancer.consistentHash.httpCookie.ttl !== ''">
                          <div>
                            {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash')}}
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item mt-4 d-flex">
                            <v-autocomplete
                              :items="[
                                { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_header_name'), value: 'httpHeaderName' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie'), value: 'httpCookie' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_use_source_ip'), value: 'useSourceIp' },
                                { text: $vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_query_parameter_name'), value: 'httpQueryParameterName' },
                              ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash')"
                              dense
                              :value="consistentHashValue(index)"
                              @change="switchConsistentHash($event, index)"
                            ></v-autocomplete>
                            <v-tooltip right max-width="350px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item-100 d-flex align-center mt-4" v-if="item.httpSettings.loadBalancer.consistentHash.httpHeaderName !== ''">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_header_name')"
                              dense
                              v-model="item.httpSettings.loadBalancer.consistentHash.httpHeaderName"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_header_name_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item-100 d-flex align-center mt-4" v-if="item.httpSettings.loadBalancer.consistentHash.useSourceIp !== ''">
                            <v-autocomplete
                              :items="[ true, false ]"
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_use_source_ip')"
                              dense
                              v-model="item.httpSettings.loadBalancer.consistentHash.useSourceIp"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_use_source_ip_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item-100 d-flex align-center mt-4" v-if="item.httpSettings.loadBalancer.consistentHash.httpQueryParameterName !== ''">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_query_parameter_name')"
                              dense
                              v-model="item.httpSettings.loadBalancer.consistentHash.httpQueryParameterName"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_query_parameter_name_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item-100 mt-4" v-if="item.httpSettings.loadBalancer.consistentHash.httpCookie.name !== '' || item.httpSettings.loadBalancer.consistentHash.httpCookie.path !== '' || item.httpSettings.loadBalancer.consistentHash.httpCookie.ttl !== ''">
                            <div>
                              {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie')}}
                              <v-tooltip right max-width="250px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                                </template>
                                <div style="font-size: 12px;">
                                  <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie_tip_1')}}</div>
                                </div>
                              </v-tooltip>
                            </div>
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie_name')"
                                  dense
                                  v-model="item.httpSettings.loadBalancer.consistentHash.httpCookie.name"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <div class="form-item">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie_path')"
                                  dense
                                  v-model="item.httpSettings.loadBalancer.consistentHash.httpCookie.path"
                                />
                              </div>
                              <div class="form-item">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie_ttl')"
                                  dense
                                  v-model="item.httpSettings.loadBalancer.consistentHash.httpCookie.ttl"
                                  :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_load_balancer_consistent_hash_http_cookie_ttl_tip_1')"
                                  peristent-hint
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.connectionPool.http.http1MaxPendingRequests !== 0 || item.httpSettings.connectionPool.http.http2MaxRequests !== 0 || item.httpSettings.connectionPool.http.maxRequestsPerConnection !== 0 || item.httpSettings.connectionPool.http.maxRetries !== 0 || item.httpSettings.connectionPool.http.idleTimeout !== '' || item.httpSettings.connectionPool.tcp.maxConnections !== 0 || item.httpSettings.connectionPool.tcp.connectTimeout !== ''" :id="'connectionPool-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool')}}
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'connectionPool')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="form-item-100 mt-4">
                          <div>
                            {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http')}}
                          </div>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_http1_max_pending_requests')"
                                dense
                                type="number"
                                v-model.number="item.httpSettings.connectionPool.http.http1MaxPendingRequests"
                                :rules="[intRuleZero]"
                              />
                            </div>
                            <div class="form-item">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_http2_max_requests')"
                                dense
                                type="number"
                                v-model.number="item.httpSettings.connectionPool.http.http2MaxRequests"
                                :rules="[intRuleZero]"
                              />
                            </div>
                            <div class="form-item">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_max_requests_per_connection')"
                                dense
                                type="number"
                                v-model.number="item.httpSettings.connectionPool.http.maxRequestsPerConnection"
                                :rules="[intRuleZero]"
                              />
                            </div>
                          </div>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_max_retries')"
                                dense
                                v-model.number="item.httpSettings.connectionPool.http.maxRetries"
                                :rules="[intRuleZero]"
                                type="number"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_idle_timeout')"
                                dense
                                v-model="item.httpSettings.connectionPool.http.idleTimeout"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_http_idle_timeout_tip_1')"
                                persistent-hint
                              />
                            </div>
                          </div>
                        </div>
                        <div class="form-item-100 mt-4">
                          <div>
                            {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_tcp')}}
                          </div>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_tcp_max_connections')"
                                dense
                                type="number"
                                v-model.number="item.httpSettings.connectionPool.tcp.maxConnections"
                                :rules="[intRuleZero]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_tcp_connect_timeout')"
                                dense
                                v-model="item.httpSettings.connectionPool.tcp.connectTimeout"
                                :hint="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_connection_pool_tcp_connect_timeout_tip_1')"
                                persistent-hint
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="params-item" v-if="item.httpSettings.outlierDetection.consecutiveGatewayErrors !== 0 || item.httpSettings.outlierDetection.consecutive5xxErrors !== 0 || item.httpSettings.outlierDetection.maxEjectionPercent !== 0 || item.httpSettings.outlierDetection.minHealthPercent !== 0 || item.httpSettings.outlierDetection.interval !== '' || item.httpSettings.outlierDetection.baseEjectionTime !== ''" :id="'outlierDetection-' + index">
                        <div>
                          {{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection')}}
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="error" class="ml-4" @click="claerHttpSettings(index, 'outlierDetection')">mdi-minus-circle-outline</v-icon>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_consecutive_gateway_errors')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.outlierDetection.consecutiveGatewayErrors"
                              :rules="[intRuleZero]"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_consecutive_gateway_errors_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_consecutive_5xx_errors')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.outlierDetection.consecutive5xxErrors"
                              :rules="[intRuleZero]"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_consecutive_5xx_errors_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_interval')"
                              dense
                              v-model="item.httpSettings.outlierDetection.interval"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_interval_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_interval_tip_2')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_base_ejection_time')"
                              dense
                              v-model="item.httpSettings.outlierDetection.baseEjectionTime"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_base_ejection_time_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_base_ejection_time_tip_2')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_max_ejection_percent')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.outlierDetection.maxEjectionPercent"
                              :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_max_ejection_percent_tip_1')}}</div>
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_max_ejection_percent_tip_2')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                          <div class="form-item d-flex align-center">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_min_health_percent')"
                              dense
                              type="number"
                              v-model.number="item.httpSettings.outlierDetection.minHealthPercent"
                              :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                            />
                            <v-tooltip right max-width="250px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                              </template>
                              <div style="font-size: 12px;">
                                <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_http_settings_outlier_detection_min_health_percent_tip_1')}}</div>
                              </div>
                            </v-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-100" v-if="item.protocol === 'tcp'">
                      <div>
                        {{$vuetify.lang.t('$vuetify.lang_form_istio_def_tcp_settings')}}
                      </div>
                      <div class="form-item-100 d-flex align-center mt-4">
                        <v-autocomplete
                          :items="deployContainerNames"
                          :label="$vuetify.lang.t('$vuetify.lang_form_istio_def_tcp_settings_source_service_names')"
                          dense
                          multiple
                          small-chips
                          v-model="item.tcpSettings.sourceServiceNames"
                          :rules="item.tcpSettings.sourceServiceNames === null ? [v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')] : [v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        ></v-autocomplete>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_istio_def_tcp_settings_source_service_names_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="copyToEnvIstioDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.copyToEnvIstioDialog = false
            this.$refs.copyToEnvIstioRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="copyToEnvIstioRef">
            <v-autocomplete
              :items="copyEnvList"
              :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name')"
              dense
              v-model="envNames"
              multiple
              small-chips
              required
              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="copyToEnvCustomStepDialog"
      max-width="600px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_copy_to_envs')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="openDefComment()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="() => {
            this.copyToEnvCustomStepDialog = false
            this.$refs.copyToEnvCustomStepRef.reset()
          }">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="copyToEnvCustomStepRef">
            <v-autocomplete
              :items="copyEnvList"
              :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name')"
              dense
              v-model="envNames"
              multiple
              small-chips
              required
              :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="historyDialog"
      max-width="1200px"
      persistent
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_history_version')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" v-bind="attrs" v-on="on" @click="updateDef()">mdi-progress-check</v-icon>
            </template>
            <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_history_roll_back')}}</div>
          </v-tooltip>
          <v-icon class="ml-4" @click="historyClose()">
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form class="d-flex" ref="historyRef">
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
                    :label="$vuetify.lang.t('$vuetify.lang_form_select_time')"
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
                  @change="getHistory()"
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
            <v-autocomplete
              :items="commitHashList"
              :label="$vuetify.lang.t('$vuetify.lang_menu_def_history_version')"
              class="mr-8"
              dense
              item-text="message"
              item-value="commitHash"
              item-disabled="disabled"
              v-model="contentForm.commitHash"
              @change="getHistoryContent()"
            ></v-autocomplete>
          </v-form>
          <MonacoDiff
            ref="monacoDiff"
            :monacoOptions="monacoOptions"
            :original="original"
            :modified="modified"
            :height="500"
          ></MonacoDiff>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import YAML from "yamljs";
import MonacoDiff from "@/lib/monaco/MonacoDiff";
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'DialogDefs',
  inject: ["successTip", "errorTip", "warnTip"],
  components: {
    MonacoDiff,
    Monaco
  },
  props: {
    projectName: String,
  },
  data() {
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
      monacoOptions: {
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
      },
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
      original: '',
      modified: '',
      commitHashList: [],
      project: {
        customStepAvailableEnvs: [],
      },
      selectDemoDefDialog: false,
      projectDefDemo: {},
      demoDefs: [],
      demoDef: '',
      demoDefType: '',
      cardLoading: true,
      tableLoading: true,
      targetProjectName: "",
      targetEnvName: "",
      buildDefForm: [],
      pipelineDefForm: {
        builds: [],
        pipelineStep: {},
        customStepInsertDefs: {},
      },
      pipelineEnvs: [],
      pipelineDefDialog: false,
      targetBranchName: "",
      nodeNames: [],
      nodeLabels: [],
      yamlDialog: false,
      yamlText: "",
      buildDefDialog: false,
      dialogLoading: false,
      packageDefDialog: false,
      packageDefForm: [],
      artifactDefDialog: false,
      artifactDefForm: [],
      dockerIgnoreDefDialog: false,
      dockerIgnoreDefForm: [],
      istioGatewayDefDialog: false,
      istioGatewayDefForm: {},
      deployContainerDefDialog: false,
      deployContainerDefForm: [],
      deployContainerDefOpts: [],
      deployContainerDefYamlDialog: false,
      deployContainerDefYamls: [],
      deployContainerDefModules: [],
      deployContainerDefModuleName: '',
      nodePorts: [],
      pvcNames: [],
      errMsgArtifactDefs: "",
      errMsgPackageDefs: "",
      deployArtifactDefDialog: false,
      deployArtifactDefForm: [],
      hostnames: [],
      copyDeployContainerDefForm: [],
      copyDeployContainerDefIndex: [],
      copyToEnvDeployContainerDialog: false,
      copyEnvList: [],
      envNames: [],
      copyDeployArtifactDefIndex: [],
      copyDeployArtifactDefForm: [],
      copyToEnvDeployArtifactDialog: false,
      errMsgDeployArtifactDefs: "",
      errMsgDeployContainerDefs: "",
      errMsgIstioDefs: "",
      errMsgIstioGatewayDef: "",
      istioDefDialog: false,
      istioDefDefForm: [],
      deployContainerNames: [],
      copyIstioDefDefIndex: [],
      copyIstioDefDefForm: [],
      copyToEnvIstioDialog: false,
      customStepDefDialog: false,
      customStepDefForm: {
        customStepName: '',
        customStepDef: {}
      },
      manualEnableFlag: false,
      relatedStepModulesFlag: false,
      relatedStepModules: [],
      customStepEnvDefForm: {
        customStepName: '',
        customStepDef: {}
      },
      customStepEnvDefDialog: false,
      targetEnvDef: {},
      copyToEnvCustomStepDialog: false,
      errMsgCustomStepDefs: '',
      copyToBranchPipelineDialog: false,
      copyBranchList: [],
      branchNames: [],
      opsDefForm: [],
      customOpsDefsDialog: false,
      opsBatchDefForm: [],
      opsBatchDefsDialog: false,
      errMsgCustomOpsDefs: '',
      errMsgOpsBatchDefs: '',
      errMsgPipelineDef: '',
      InsertDefNames: [],
      copyInsertDefNames: [],
      customStepUsage: '',
      vars: '',
      varsDialog: false,
      commentDefDialog: false,
      comment: '',
      markdownMonacoOptions: {
        value: '',
        automaticLayout: true,
        readOnly: true,
        theme: "vs-dark",
        language: "markdown"
      },
      indexList: [],
      copyCustomStepModuleDefsForm: [],
      historyForm: {
        defName: '',
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      },
      historyDialog: false,
      dates:[],
      menu2: false,
      contentForm: {
        defName: '',
        branchName: '',
        envName: '',
        customStepName: '',
        commitHash: ''
      },
      targetDefName: '',
      targetCustomStepName: '',
      pipelineList: [],
      stepDesc: {
        gitPull: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_git_pull'),
        getRunSettings: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_get_run_settings'),
        build: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_build'),
        scanCode: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_scan_code'),
        packageImage: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_package_image'),
        scanImage: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_scan_image'),
        artifact: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_artifact'),
        syncImage: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_sync_image'),
        deploy: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_deploy'),
        applyIngress: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_apply_ingress'),
        applyMesh: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_apply_mesh'),
        checkDeploy: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_check_deploy'),
        checkQuota: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_check_quota'),
        deployArtifact: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_deploy_artifact'),
        testApi: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_test_api'),
        testPerformance: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_test_performance'),
        testWebui: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_test_webui'),
        input: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_input'),
      },
      customDialog: false,
      customList: [],
      customSteps: [],
      customStepNames: [],
      targetName: '',
      stepInformation: null,
      textName: '',
      selectedStepIndex: -1,
      community: false,
      hostAliasesDisable: false,
      hpaConfigDisable: false,
      securityContextDisable: false,
      patchesDisable: false,
      enableDownwardApiDisable: false,
      nodeNameDisable: false,
      nodeSelectorDisable: false,
      subdomainDisable: false,
    };
  },
  created() {
    const vm = this;
    vm.targetProjectName = vm.projectName;
    request.get('/public/about').then(response => {
      vm.community = response.data.community
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
      vm.project = response.data.project;
      vm.cardLoading = false;
      vm.project.pipelines.map((item, index) => {
        if (item.branchName !== '') {
          vm.copyBranchList.push(item.branchName);
        }
      });
    }).catch((error) => {
      vm.cardLoading = false;
      vm.errorTip(true, error.response.data.msg);
    });
    request.get(`/cicd/projectDef/${vm.targetProjectName}/demo`).then((response) => {
      vm.projectDefDemo = response.data;
    }).catch((error) => {
      vm.errorTip(true, error.response.data.msg);
    });
    request.get('/cicd/customStepConf/vars').then(response => {
      vm.vars = response.data.content
      vm.markdownMonacoOptions.value = vm.vars
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
  },
  methods: {
    openSelectDemoDef(defName) {
      const vm = this
      vm.demoDef = ''
      vm.demoDefs = [
        {
          text: vuetify.preset.lang.t('$vuetify.lang_form_create_def_item_from_empty'),
          value: '',
        },
      ]
      switch(defName) {
        case 'buildDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.buildDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.buildName,
            })
          })
          break
        case 'packageDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.packageDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.packageName,
            })
          })
          break
        case 'artifactDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.artifactDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.artifactName,
            })
          })
          break
        case 'deployContainerDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.deployContainerDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.deployName,
            })
          })
          break
        case 'deployArtifactDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.deployArtifactDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.deployArtifactName,
            })
          })
          break
        case 'istioDefs':
          vm.demoDefType = defName
          vm.projectDefDemo.istioDefs.forEach(item => {
            vm.demoDefs.push({
              text: item.desc,
              value: item.deployName,
            })
          })
          break
      }
      vm.selectDemoDefDialog = true
    },
    addDef() {
      const vm = this;
      switch(vm.demoDefType) {
        case 'buildDefs':
          var addItem = {
            buildChecks: "",
            buildCmds: "",
            buildEnv: "",
            buildName: "",
            buildPath: "",
            buildPhaseID: 1,
            sonarExtraSettings: null,
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.buildDefs.forEach(item => {
              if (item.buildName === vm.demoDef) {
                addItem = item
                addItem.buildCmds = vm.formateText(item.buildCmds)
                addItem.buildChecks = vm.formateText(item.buildChecks)
                addItem.buildCaches = vm.formateText(item.buildCaches)
                addItem.sonarExtraSettings = vm.formateText(item.sonarExtraSettings)
              }
            })
          }
          vm.buildDefForm.unshift(addItem)
          break
        case 'packageDefs':
          var addItem = {
            packageFrom: "",
            packageName: "",
            dockerFile: "",
            relatedBuilds: [],
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.packageDefs.forEach(item => {
              if (item.packageName === vm.demoDef) {
                addItem = item
              }
            })
          }
          vm.packageDefForm.unshift(addItem)
          break
        case 'artifactDefs':
          var addItem = {
            artifactName: "",
            artifacts: [["", ""]],
            relatedBuilds: [],
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.artifactDefs.forEach(item => {
              if (item.artifactName === vm.demoDef) {
                addItem = item
                item.artifacts.forEach((row, index) => {
                  row = row.split(":")
                  item.artifacts[index] = row
                })
              }
            })
          }
          vm.artifactDefForm.unshift(addItem)
          break
        case 'deployContainerDefs':
          var addItem = {
            deployName: "",
            relatedPackage: "",
            deployType: "",
            deployReplicas: 1,
            deployHeadless: false,
            podManagementPolicy: "",
            deployMeta: {
              labels: null,
              annotations: null,
            },
            deployResources: {
              memoryRequest: "10Mi",
              memoryLimit: "100Mi",
              cpuRequest: "10m",
              cpuLimit: "100m",
            },
            deployVolumes: null,
            deployHealthCheck: {
              checkPort: 0,
              exec: "",
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
            deployNodePorts: null,
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
            deployConfigSettings: null,
            deployConfigMaps: null,
            deploySecrets: null,
            patches: null,
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
            restartPolicy: "",
            job: {
              completions: 0,
              parallelism: 0,
              completionMode: '',
              backoffLimit: 0,
              activeDeadlineSeconds: 0,
              ttlSecondsAfterFinished: 0,
            },
            cronJob: {
              schedule: '',
              concurrencyPolicy: '',
              startingDeadlineSeconds: 0,
              successfulJobsHistoryLimit: 0,
              failedJobsHistoryLimit: 0,
            }
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.deployContainerDefs.forEach(item => {
              if (item.deployName === vm.demoDef) {
                addItem = item
                if (addItem.deployEnvs !== null) {
                  addItem.deployEnvs.forEach((row, rowIndex) => {
                    row = row.split("=")
                    addItem.deployEnvs[rowIndex] = row
                  })
                }
                if (addItem.nodeSelector !== null) {
                  addItem.nodeSelector.forEach((row, rowIndex) => {
                    row.text = row.name+"="+row.value
                    addItem.nodeSelector[rowIndex] = row
                  })
                }
              }
            })
          }
          vm.deployContainerDefForm.unshift(addItem)
          break
        case 'deployArtifactDefs':
          var addItem = {
            deployArtifactName: "",
            hosts: "",
            relatedArtifact: "",
            tasks: "",
            variables: null,
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.deployArtifactDefs.forEach(item => {
              if (item.deployArtifactName === vm.demoDef) {
                addItem = item
                if (addItem.variables !== null) {
                  var variablesList = []
                  Object.keys(addItem.variables).map(item => {
                    let obj = []
                    obj[0] = item
                    obj[1] = addItem.variables[item]
                    variablesList.push(obj)
                  })
                  addItem.variables = variablesList
                }
              }
            })
          }
          vm.deployArtifactDefForm.unshift(addItem)
          break
        case 'istioDefs':
          var addItem = {
            deployName: '',
            httpSettings: {
              timeout: '',
              // sourceServiceNames: null,
              matchHeaders: null,
              gateway: {
                matchUris: null,
                rewriteUri: '',
                matchDefault: true
              },
              connectionPool: {
                http: {
                  http1MaxPendingRequests: 0,
                  http2MaxRequests: 0,
                  maxRequestsPerConnection: 0,
                  maxRetries: 0,
                  idleTimeout: '',
                },
                tcp: {
                  maxConnections: 0,
                  connectTimeout: '',
                }
              },
              corsPolicy: {
                allowCredentials: false,
                allowHeaders: null,
                allowMethods: null,
                allowOrigins: null,
                exposeHeaders: null,
                maxAge: '',
              },
              loadBalancer: {
                consistentHash: {
                  httpHeaderName: '',
                  httpQueryParameterName: '',
                  useSourceIp: false,
                  httpCookie: {
                    name: '',
                    path: '',
                    ttl: ''
                  }
                },
                simple: ''
              },
              mirror: {
                host: '',
                subset: '',
                mirrorPercent: 0,
                port: 0,
              },
              retries: {
                attempts: 0,
                perTryTimeout: '',
                retryOn: []
              },
              outlierDetection: {
                consecutive5xxErrors: 0,
                consecutiveGatewayErrors: 0,
                maxEjectionPercent: 0,
                minHealthPercent: 0,
                baseEjectionTime: '',
                interval: '',
              }
            },
            port: 0,
            protocol: 'http',
            tcpSettings: {
              sourceServiceNames: null
            }
          }
          if (vm.demoDef !== '') {
            vm.projectDefDemo.istioDefs.forEach(item => {
              if (item.deployName === vm.demoDef) {
                addItem = item
                if (addItem.httpSettings.corsPolicy.allowOrigins !== null) {
                  var newAllowOrigins = []
                  addItem.httpSettings.corsPolicy.allowOrigins.map(item => {
                    var arrItem = []
                    arrItem[0] = Object.keys(item)[0]
                    arrItem[1] = Object.values(item)[0]
                    newAllowOrigins.push(arrItem)
                  })
                  addItem.httpSettings.corsPolicy.allowOrigins = newAllowOrigins
                }
                if (addItem.httpSettings.retries.retryOn === '') {
                  addItem.httpSettings.retries.retryOn = []
                } else {
                  addItem.httpSettings.retries.retryOn = addItem.httpSettings.retries.retryOn.split(',')
                }
                if (addItem.httpSettings.gateway.matchDefault === false && addItem.httpSettings.gateway.matchUris === null && addItem.httpSettings.gateway.rewriteUri === '') {
                  addItem.httpSettings.gatewayFlag = false
                } else {
                  addItem.httpSettings.gatewayFlag = true
                }
                if (addItem.httpSettings.corsPolicy.allowCredentials === false && addItem.httpSettings.corsPolicy.allowHeaders === null && addItem.httpSettings.corsPolicy.allowMethods === null && addItem.httpSettings.corsPolicy.allowOrigins === null && addItem.httpSettings.corsPolicy.exposeHeaders === null && addItem.httpSettings.corsPolicy.maxAge === '') {
                  addItem.httpSettings.corsPolicyFlag = false
                } else {
                  addItem.httpSettings.corsPolicyFlag = true
                }
                if (addItem.httpSettings.loadBalancer.simple === '' && addItem.httpSettings.loadBalancer.consistentHash.httpHeaderName === '' && addItem.httpSettings.loadBalancer.consistentHash.httpQueryParameterName === '' && addItem.httpSettings.loadBalancer.consistentHash.useSourceIp === false && addItem.httpSettings.loadBalancer.consistentHash.httpCookie.name === '' && addItem.httpSettings.loadBalancer.consistentHash.httpCookie.path === '' && addItem.httpSettings.loadBalancer.consistentHash.httpCookie.ttl === '') {
                  addItem.httpSettings.loadBalancerFlag = false
                } else {
                  addItem.httpSettings.loadBalancerFlag = true
                }
              }
            })
          }
          vm.istioDefDefForm.unshift(addItem)
          break
      }
      vm.selectDemoDefDialog = false
    },
    openOpsDef() {
      const vm = this
      vm.opsDefForm = JSON.parse(JSON.stringify(vm.project.projectDef.customOpsDefs))
      vm.errMsgCustomOpsDefs = vm.project.projectDef.errMsgCustomOpsDefs
      vm.customOpsSteps = vm.project.customOpsStepNames
      vm.customOpsDefsDialog = true
    },
    addOps() {
      const vm = this
      var addItem = {
        customOpsName: '',
        customOpsDesc: '',
        customOpsSteps: []
      };
      vm.opsDefForm.unshift(addItem);
    },
    previewOpsDef() {
      const vm = this
      if(vm.$refs.opsDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.opsDefForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateOpsDef() {
      const vm = this
      if(vm.$refs.opsDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.opsDefForm))
        let customOpsDefsYaml = YAML.stringify(copyData, 4)
        request.post(`/cicd/projectDef/${vm.targetProjectName}/customOpsDefs`,{
          customOpsDefsYaml: customOpsDefsYaml,
          comment: vm.comment,
        }).then(response => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.customOpsDefsDialog = false
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg);
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyOps(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.opsDefForm[i]));
      copyItem.customOpsName = vm.opsDefForm[i].customOpsName + "-copy";
      vm.opsDefForm.push(copyItem);
    },
    deleteOps(i) {
      const vm = this;
      vm.opsDefForm.splice(i, 1);
    },
    openOpsBatchDef() {
      const vm = this
      vm.opsBatchDefForm = JSON.parse(JSON.stringify(vm.project.projectDef.opsBatchDefs))
      vm.errMsgOpsBatchDefs = vm.project.projectDef.errMsgOpsBatchDefs
      vm.opsBatchDefsDialog = true
    },
    addOpsBatch() {
      const vm = this
      var addItem = {
        opsBatchName: '',
        opsBatchDesc: '',
        batches: []
      };
      vm.opsBatchDefForm.unshift(addItem);
    },
    previewOpsBatchDef() {
      const vm = this
      if(vm.$refs.opsBatchDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.opsBatchDefForm))
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateOpsBatchDef() {
      const vm = this
      if(vm.$refs.opsBatchDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.opsBatchDefForm))
        let opsBatchDefsYaml = YAML.stringify(copyData, 4)
        request.post(`/cicd/projectDef/${vm.targetProjectName}/opsBatchDefs`,{
          opsBatchDefsYaml: opsBatchDefsYaml,
          comment: vm.comment,
        }).then(response => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.opsBatchDefsDialog = false
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg);
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyOpsBatch(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.opsBatchDefForm[i]));
      copyItem.opsBatchName = vm.opsBatchDefForm[i].opsBatchName + "-copy";
      vm.opsBatchDefForm.push(copyItem);
    },
    deleteOpsBatch(i) {
      const vm = this;
      vm.opsBatchDefForm.splice(i, 1);
    },
    enableModeChange(e) {
      const vm = this
      if(vm.customStepDefForm.customStepDef.enableMode === ''){
        vm.manualEnableFlag = true
        vm.relatedStepModulesFlag = false
      }else{
        vm.customStepDefForm.customStepDef.customStepModuleDefs.map(item => {
          item.relatedStepModules = []
        })
        vm.relatedStepModulesFlag = true
        vm.manualEnableFlag = false
        if(e === 'build'){
          vm.relatedStepModules = vm.project.buildNames
        }else if(e === 'package'){
          vm.relatedStepModules = vm.project.packageNames
        }else if(e === 'artifact'){
          vm.relatedStepModules = vm.project.artifactNames
        }
      }
    },
    openCustomStepDef(stepName) {
      const vm = this
      vm.errMsgCustomStepDefs = vm.project.projectDef.errMsgCustomStepDefs[stepName]
      vm.customStepDefDialog = true
      vm.targetCustomStepName = stepName
      var defaultYaml = ''
      vm.project.customStepConfs.map(row => {
        if(row.customStepName === stepName){
          defaultYaml = row.paramInputYamlDef
          vm.customStepUsage = row.customStepUsage
        }
      })
      if(vm.project.projectDef.customStepDefs !== null && vm.project.projectDef.customStepDefs[stepName] !== undefined){
        vm.customStepDefForm.customStepDef = JSON.parse(JSON.stringify(vm.project.projectDef.customStepDefs[stepName]))
        vm.customStepDefForm.customStepName = stepName
      }else{
        vm.customStepDefForm.customStepDef = {
          enableMode: '',
          customStepModuleDefs: [
            {
              moduleName: '',
              manualEnable: false,
              paramInputYaml: defaultYaml,
              checkVarToIgnore: '',
            }
          ]
        }
        vm.customStepDefForm.customStepName = stepName
      }
      if(vm.customStepDefForm.customStepDef.enableMode === ''){
        vm.manualEnableFlag = true
        vm.relatedStepModulesFlag = false
      }else{
        vm.relatedStepModulesFlag = true
        vm.manualEnableFlag = false
        if(vm.customStepDefForm.customStepDef.enableMode === 'build'){
          vm.relatedStepModules = vm.project.buildNames
        }else if(vm.customStepDefForm.customStepDef.enableMode === 'package'){
          vm.relatedStepModules = vm.project.packageNames
        }else if(vm.customStepDefForm.customStepDef.enableMode === 'artifact'){
          vm.relatedStepModules = vm.project.artifactNames
        }
      }
    },
    addCustomStepModuleDefs() {
      const vm = this
      var defaultYaml = ''
      vm.project.customStepConfs.map(row => {
        if(row.customStepName === vm.customStepDefForm.customStepName){
          defaultYaml = row.paramInputYamlDef
        }
      })
      if(vm.customStepDefForm.customStepDef.enableMode === ''){
        var addItem = {
          moduleName: '',
          manualEnable: false,
          paramInputYaml: defaultYaml,
          checkVarToIgnore: '',
        }
        vm.customStepDefForm.customStepDef.customStepModuleDefs.push(addItem)
      }else{
        var addItem = {
          moduleName: '',
          relatedStepModules: [],
          paramInputYaml: defaultYaml,
          checkVarToIgnore: '',
        }
        vm.customStepDefForm.customStepDef.customStepModuleDefs.push(addItem)
      }
    },
    copyCustomStepModuleDefs(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.customStepDefForm.customStepDef.customStepModuleDefs[i])
      );
      vm.customStepDefForm.customStepDef.customStepModuleDefs.push(copyItem);
    },
    deleteCustomStepModuleDefs(i) {
      const vm = this;
      vm.customStepDefForm.customStepDef.customStepModuleDefs.splice(i, 1);
    },
    previewCustomStepDef() {
      const vm = this
      if(vm.$refs.customStepDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.customStepDefForm.customStepDef))
        if(!vm.manualEnableFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.manualEnable
          })
        }
        if(!vm.relatedStepModulesFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.relatedStepModules
          })
        }
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateCustomStepDef() {
      const vm = this
      if(vm.$refs.customStepDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.customStepDefForm.customStepDef))
        if(!vm.manualEnableFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.manualEnable
          })
        }
        if(!vm.relatedStepModulesFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.relatedStepModules
          })
        }
        var customStepDefYaml = YAML.stringify(copyData, 4)
        request.post(`/cicd/projectDef/${vm.targetProjectName}/customStepDef`, {
          customStepName: vm.customStepDefForm.customStepName,
          customStepDefYaml: customStepDefYaml,
          comment: vm.comment,
        }).then(response => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.customStepDefDialog = false
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg);
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    enableModeChangeEnv(e) {
      const vm = this
      if(vm.customStepEnvDefForm.customStepDef.enableMode === ''){
        vm.manualEnableFlag = true
        vm.relatedStepModulesFlag = false
      }else{
        vm.customStepEnvDefForm.customStepDef.customStepModuleDefs.map(item => {
          item.relatedStepModules = []
        })
        vm.relatedStepModulesFlag = true
        vm.manualEnableFlag = false
        if(e === 'build'){
          vm.relatedStepModules = vm.project.buildNames
        }else if(e === 'package'){
          vm.relatedStepModules = vm.project.packageNames
        }else if(e === 'artifact'){
          vm.relatedStepModules = vm.project.artifactNames
        }else if(e === 'deploy'){
          vm.relatedStepModules = vm.targetEnvDef.deployContainerNames
        }else if(e === 'deployArtifact'){
          vm.relatedStepModules = vm.targetEnvDef.deployArtifactNames
        }
      }
    },
    openCustomStepEnvDef(envName, stepName) {
      const vm = this
      var item = {}
      vm.project.projectAvailableEnvs.forEach(pae => {
        if (pae.envName === envName) {
          item = pae
        }
      })
      vm.targetCustomStepName = stepName
      vm.targetEnvName = item.envName
      vm.customStepEnvDefDialog = true
      vm.targetEnvDef = item
      vm.copyCustomStepModuleDefsForm = []
      var defaultYaml = ''
      vm.project.customStepConfs.map(i => {
        if(i.customStepName === stepName){
          defaultYaml = i.paramInputYamlDef
          vm.customStepUsage = i.customStepUsage
        }
      })
      if(item.errMsgCustomStepDefs !== null){
        vm.errMsgCustomStepDefs = item.errMsgCustomStepDefs[stepName]
      }
      if(item.customStepDefs !== null && item.customStepDefs[stepName] !== undefined){
        vm.customStepEnvDefForm.customStepDef = JSON.parse(JSON.stringify(item.customStepDefs[stepName]))
        vm.customStepEnvDefForm.customStepName = stepName
      }else{
        vm.customStepEnvDefForm.customStepDef = {
          enableMode: '',
          customStepModuleDefs: [
            {
              moduleName: '',
              manualEnable: false,
              paramInputYaml: defaultYaml,
              checkVarToIgnore: '',
            }
          ]
        }
        vm.customStepEnvDefForm.customStepName = stepName
      }
      if(vm.customStepEnvDefForm.customStepDef.enableMode === ''){
        vm.manualEnableFlag = true
        vm.relatedStepModulesFlag = false
      }else{
        vm.relatedStepModulesFlag = true
        vm.manualEnableFlag = false
        if(vm.customStepEnvDefForm.customStepDef.enableMode === 'build'){
          vm.relatedStepModules = vm.project.buildNames
        }else if(vm.customStepEnvDefForm.customStepDef.enableMode === 'package'){
          vm.relatedStepModules = vm.project.packageNames
        }else if(vm.customStepEnvDefForm.customStepDef.enableMode === 'artifact'){
          vm.relatedStepModules = vm.project.artifactNames
        }else if(vm.customStepEnvDefForm.customStepDef.enableMode === 'deploy'){
          vm.relatedStepModules = vm.targetEnvDef.deployContainerNames
        }else if(vm.customStepEnvDefForm.customStepDef.enableMode === 'deployArtifact'){
          vm.relatedStepModules = vm.targetEnvDef.deployArtifactNames
        }
      }
    },
    addCustomStepModuleDefsEnv() {
      const vm = this
      var defaultYaml = ''
      vm.project.customStepConfs.map(row => {
        if(row.customStepName === vm.customStepEnvDefForm.customStepName){
          defaultYaml = row.paramInputYamlDef
        }
      })
      if(vm.customStepEnvDefForm.customStepDef.enableMode === ''){
        var addItem = {
          moduleName: '',
          manualEnable: false,
          paramInputYaml: defaultYaml,
          checkVarToIgnore: '',
        }
        vm.customStepEnvDefForm.customStepDef.customStepModuleDefs.push(addItem)
      }else{
        var addItem = {
          moduleName: '',
          relatedStepModules: [],
          paramInputYaml: defaultYaml,
          checkVarToIgnore: '',
        }
        vm.customStepEnvDefForm.customStepDef.customStepModuleDefs.push(addItem)
      }
    },
    copyCustomStepModuleDefsEnv(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.customStepEnvDefForm.customStepDef.customStepModuleDefs[i])
      );
      vm.customStepEnvDefForm.customStepDef.customStepModuleDefs.push(copyItem);
    },
    deleteCustomStepModuleDefsEnv(i) {
      const vm = this;
      vm.customStepEnvDefForm.customStepDef.customStepModuleDefs.splice(i, 1);
    },
    previewCustomStepDefEnv() {
      const vm = this
      if(vm.$refs.customStepEnvDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.customStepEnvDefForm.customStepDef))
        if(!vm.manualEnableFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.manualEnable
          })
        }
        if(!vm.relatedStepModulesFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.relatedStepModules
          })
        }
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateCustomStepDefEnv() {
      const vm = this
      if(vm.$refs.customStepEnvDefRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.customStepEnvDefForm.customStepDef))
        if(!vm.manualEnableFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.manualEnable
          })
        }
        if(!vm.relatedStepModulesFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.relatedStepModules
          })
        }
        var customStepDefYaml = YAML.stringify(copyData, 4)
        request.post(`/cicd/projectDef/${vm.targetProjectName}/customStepDef/env`, {
          customStepName: vm.customStepEnvDefForm.customStepName,
          envName: vm.targetEnvName,
          customStepDefYaml: customStepDefYaml,
          comment: vm.comment,
        }).then(response => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.customStepEnvDefDialog = false
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg);
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    checkcustomStepModuleDef(e, i) {
      const vm = this;
      if (e) {
        vm.indexList.push(i);
        vm.indexList = Array.from(
          new Set(vm.indexList)
        );
      } else {
        vm.indexList = Array.from(
          new Set(vm.indexList)
        );
        vm.indexList.forEach((item, index) => {
          if (item === i) {
            vm.indexList.splice(index, 1);
          }
        });
      }
    },
    openCustomStepDefToEnv() {
      const vm = this
      if(vm.$refs.customStepEnvDefRef.validate()){
        if(vm.indexList.length > 0 ){
          vm.envNames = []
          vm.copyToEnvCustomStepDialog = true
          vm.project.projectAvailableEnvs.map((item, index) => {
            vm.copyEnvList.push(item.envName);
          });
          vm.copyEnvList.forEach((row, i) => {
            if (row === vm.targetEnvName) {
              vm.copyEnvList.splice(i, 1);
            }
          });
          vm.indexList.map((item) => {
            vm.copyCustomStepModuleDefsForm.push(vm.customStepEnvDefForm.customStepDef.customStepModuleDefs[item]);
          });
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_items_to_copy'));
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    customStepDefToEnv() {
      const vm = this
      if(vm.$refs.copyToEnvCustomStepRef.validate()){
        let copyData = JSON.parse(JSON.stringify(vm.customStepEnvDefForm.customStepDef))
        if(!vm.manualEnableFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.manualEnable
          })
        }
        if(!vm.relatedStepModulesFlag){
          copyData.customStepModuleDefs.forEach(item => {
            delete item.relatedStepModules
          })
        }
        copyData.customStepModuleDefs = vm.copyCustomStepModuleDefsForm
        var customStepDefYaml = YAML.stringify(copyData, 4)
        request.put(`/cicd/projectDef/${vm.targetProjectName}/customStepDef/env`, {
          customStepName: vm.customStepEnvDefForm.customStepName,
          customStepDefYaml: customStepDefYaml,
          envNames: vm.envNames,
          comment: vm.comment,
        }).then(response => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.copyToEnvCustomStepDialog = false;
          vm.customStepEnvDefDialog = true;
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg);
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
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
    refresh() {
      const vm = this;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.project = response.data.project;
        vm.cardLoading = false;
        this.$emit("projectDef", vm.project);
      }).catch((error) => {
        vm.cardLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
    },
    openBuildDef() {
      const vm = this;
      vm.buildDefDialog = true;
      vm.dialogLoading = true;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.buildDefForm = response.data.project.projectDef.buildDefs;
        vm.buildDefForm.map((item) => {
          item.buildCmds = vm.formateText(item.buildCmds);
          item.buildChecks = vm.formateText(item.buildChecks);
          item.buildCaches = vm.formateText(item.buildCaches);
          item.sonarExtraSettings = vm.formateText(item.sonarExtraSettings);
        });
        vm.dialogLoading = false;
      });
    },
    copyDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.buildDefForm[i]));
      copyItem.buildName = vm.buildDefForm[i].buildName + "-copy";
      vm.buildDefForm.push(copyItem);
    },
    deleteDef(i) {
      const vm = this;
      vm.buildDefForm.splice(i, 1);
    },
    previewBuildDef() {
      const vm = this;
      if (vm.$refs.buildDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.buildDefForm))
        copyData.map((item) => {
          item.buildCmds = vm.formateText(item.buildCmds);
          item.buildChecks = vm.formateText(item.buildChecks);
          item.buildCaches = vm.formateText(item.buildCaches);
          item.sonarExtraSettings = vm.formateText(item.sonarExtraSettings);
        });
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateBuildDef() {
      const vm = this;
      vm.buildDefForm.map((item) => {
        item.buildCmds = vm.formateText(item.buildCmds);
        item.buildChecks = vm.formateText(item.buildChecks);
        item.buildCaches = vm.formateText(item.buildCaches);
        item.sonarExtraSettings = vm.formateText(item.sonarExtraSettings);
      });
      var buildDefsYaml = YAML.stringify(vm.buildDefForm, 4);
      if (vm.$refs.buildDefRef.validate()) {
        request
          .post(`/cicd/projectDef/${vm.targetProjectName}/buildDefs`, {
            buildDefsYaml: buildDefsYaml,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.buildDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
            vm.buildDefForm.map((item) => {
              item.buildCmds = vm.formateText(item.buildCmds);
              item.buildChecks = vm.formateText(item.buildChecks);
              item.buildCaches = vm.formateText(item.buildCaches);
              item.sonarExtraSettings = vm.formateText(item.sonarExtraSettings);
            });
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openPackageDef() {
      const vm = this;
      vm.packageDefDialog = true;
      vm.dialogLoading = true;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.errMsgPackageDefs = response.data.project.projectDef.errMsgPackageDefs;
        vm.packageDefForm = response.data.project.projectDef.packageDefs;
        vm.packageDefForm.map((item) => {
          let newRelatedBuilds = [];
          newRelatedBuilds = item.relatedBuilds.filter((e) => {
            return vm.project.buildNames.indexOf(e) !== -1;
          });
          item.relatedBuilds = newRelatedBuilds;
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
      vm.timer2 = setTimeout(() => {
        vm.$refs.packageDefRef.validate();
      }, 500);
    },
    addExtraPushImages(i) {
      const vm = this;
      let addItem = {
        imagePath: '',
        username: '',
        password: '',
      };
      if (vm.packageDefForm[i].extraPushImages === null) {
        vm.packageDefForm[i].extraPushImages = [];
        vm.packageDefForm[i].extraPushImages.push(addItem);
      } else {
        vm.packageDefForm[i].extraPushImages.push(addItem);
      }
    },
    copyExtraPushImages(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.packageDefForm[i].extraPushImages[j]
        )
      );
      vm.packageDefForm[i].extraPushImages.push(copyItem);
    },
    deleteExtraPushImages(i, j) {
      const vm = this;
      vm.packageDefForm[i].extraPushImages.splice(j,1);
    },
    previewPackageDef() {
      const vm = this;
      if (vm.$refs.packageDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.packageDefForm))
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyPackageDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.packageDefForm[i]));
      copyItem.packageName = vm.packageDefForm[i].packageName + "-copy";
      vm.packageDefForm.push(copyItem);
    },
    deletePackageDef(i) {
      const vm = this;
      vm.packageDefForm.splice(i, 1);
    },
    updatePackageDef() {
      const vm = this;
      if (vm.$refs.packageDefRef.validate()) {
        var packageDefsYaml = YAML.stringify(vm.packageDefForm, 4);
        request
          .post(`/cicd/projectDef/${vm.targetProjectName}/packageDefs`, {
            packageDefsYaml: packageDefsYaml,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.packageDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openArtifactDef() {
      const vm = this;
      vm.artifactDefDialog = true;
      vm.dialogLoading = true;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.errMsgArtifactDefs = response.data.project.projectDef.errMsgArtifactDefs;
        vm.artifactDefForm = response.data.project.projectDef.artifactDefs;
        vm.artifactDefForm.map((item) => {
          let newRelatedBuilds = [];
          newRelatedBuilds = item.relatedBuilds.filter((e) => {
            return vm.project.buildNames.indexOf(e) !== -1;
          });
          item.relatedBuilds = newRelatedBuilds;
          item.artifacts.forEach((row, index, arr) => {
            row = row.split(":");
            item.artifacts[index] = row;
          });
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
      vm.timer2 = setTimeout(() => {
        vm.$refs.artifactDefRef.validate();
      }, 500);
    },
    addArtifact(i) {
      const vm = this;
      var newArtifact = ["", ""];
      vm.artifactDefForm[i].artifacts.push(newArtifact);
    },
    deleteArtifact(i, j) {
      const vm = this;
      vm.artifactDefForm[i].artifacts.splice(j, 1);
    },
    previewArtifactDef() {
      const vm = this;
      if (vm.$refs.artifactDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.artifactDefForm))
        copyData.map((item) => {
          item.artifacts.map((row, index) => {
            row = row.join(":");
            item.artifacts[index] = row;
          });
        });
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyArtifactDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.artifactDefForm[i]));
      copyItem.artifactName = vm.artifactDefForm[i].artifactName + "-copy";
      vm.artifactDefForm.push(copyItem);
    },
    deleteArtifactDef(i) {
      const vm = this;
      vm.artifactDefForm.splice(i, 1);
    },
    updateArtifactDef() {
      const vm = this;
      if (vm.$refs.artifactDefRef.validate()) {
        vm.artifactDefForm.map((item) => {
          item.artifacts.forEach((row, index) => {
            row = row.join(":");
            item.artifacts[index] = row;
          });
        });
        var artifactDefsYaml = YAML.stringify(vm.artifactDefForm, 4);
        request.post(`/cicd/projectDef/${vm.targetProjectName}/artifactDefs`, {
          artifactDefsYaml: artifactDefsYaml,
          comment: vm.comment,
        }).then((response) => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.artifactDefDialog = false;
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch((error) => {
          vm.artifactDefForm.map((item) => {
            item.artifacts.forEach((row, index) => {
              row = row.split(":");
              item.artifacts[index] = row;
            });
          });
          vm.errorTip(true, error.response.data.msg);
        });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDockerIgnoreDef() {
      const vm = this;
      vm.dockerIgnoreDefDialog = true;
      vm.dialogLoading = true;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.dockerIgnoreDefForm =  response.data.project.projectDef.dockerIgnoreDefs;
        vm.dockerIgnoreDefForm = vm.formateText(vm.dockerIgnoreDefForm);
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
    },
    previewDockerIgnoreDef() {
      const vm = this;
      let copyData = vm.dockerIgnoreDefForm
      copyData = vm.formateText(copyData);
      vm.yamlText = YAML.stringify(copyData, 4);
      vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
      vm.yamlDialog = true;
    },
    updateDockerIgnoreDef() {
      const vm = this;
      let copyData = vm.dockerIgnoreDefForm
      copyData = vm.formateText(copyData);
      var dockerIgnoreDefsYaml = YAML.stringify(copyData, 4);
      request
        .post(`/cicd/projectDef/${vm.targetProjectName}/dockerIgnoreDefs`, {
          dockerIgnoreDefsYaml: dockerIgnoreDefsYaml,
          comment: vm.comment,
        })
        .then((response) => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.dockerIgnoreDefDialog = false;
          vm.successTip(true, response.msg);
          vm.refresh();
        })
        .catch((error) => {
          vm.errorTip(true, error.response.data.msg);
        });
    },
    organizeData() {
      const vm = this
      var pipelineList = []
      Object.keys(vm.pipelineDefForm.pipelineStep).map((item, i) => {
        let obj = {
          name: '',
          hint: '',
          data: '',
          type: '',
          insertStepIndex: 0,
          isPush: true
        }
        if (item === 'gitPull' || item === 'syncImage') {
          obj.isPush = false
        } else {
          obj.isPush = true
        }
        obj.name = item
        obj.hint = vm.stepDesc[item]
        obj.type = 'original'
        obj.data = vm.pipelineDefForm.pipelineStep[item]
        pipelineList.push(obj)
      })
      pipelineList.splice(1, 0, {
        name: 'getRunSettings',
        hint: vuetify.preset.lang.t('$vuetify.lang_form_pipeline_def_pipeline_step_get_run_settings'),
        data: null,
        type: 'original',
        insertStepIndex: 0,
        isPush: true
      })
      vm.pipelineList = pipelineList
      vm.pipelineList.forEach((row, i) => {
        if (vm.pipelineDefForm.customStepInsertDefs[row.name] !== undefined) {
          vm.pipelineDefForm.customStepInsertDefs[row.name].forEach((c, idx) => {
            vm.pipelineList.splice(i + 1 + idx, 0, {
              name: c.customStepName,
              hint: '',
              type: 'custom',
              higher: row.name,
              data: c,
              insertStepIndex: idx,
            })
          })
        }
      })
      vm.pipelineList = vm.pipelineList.map((row, i) => {
        row.index = i
        return row
      })
    },
    addStep() {
      const vm = this
      if (vm.customStepNames !== undefined) {
        var customSteps = vm.customStepNames.map(csn => {
          var csd = {
            "customStepName": csn,
            "enable": true,
            "ignoreError": true,
            "timeout": 0,
            "retry": 0,
            "enableInput": false,
            "isApiOnly": false,
          }
          return csd
        })
        vm.pipelineDefForm.customStepInsertDefs[vm.targetName] = customSteps
        vm.customDialog = false
        if (vm.pipelineDefForm.customStepInsertDefs[vm.targetName] === undefined || vm.pipelineDefForm.customStepInsertDefs[vm.targetName].length <= 0) {
          delete vm.pipelineDefForm.customStepInsertDefs[vm.targetName]
        }
        vm.organizeData()
      } else {
        vm.customStepNames = []
      }
    },
    openAddStep(item) {
      const vm = this
      if (item.isPush) {
        vm.targetName = item.name
        vm.customList = vm.project.cicdCustomStepInserts[vm.targetName]
        vm.customDialog = true
        if (vm.pipelineDefForm.customStepInsertDefs[vm.targetName] !== undefined) {
          vm.customStepNames = vm.pipelineDefForm.customStepInsertDefs[vm.targetName].map(csd => csd.customStepName)
        } else {
          vm.customStepNames = []
        }
      }
    },
    deleteStep(item) {
      const vm = this
      vm.pipelineDefForm.customStepInsertDefs[item.higher].forEach((row, i) => {
        if (i === item.insertStepIndex) {
          vm.pipelineDefForm.customStepInsertDefs[item.higher].splice(i, 1)
        }
      })
      if (vm.pipelineDefForm.customStepInsertDefs[item.higher].length <= 0) {
        delete vm.pipelineDefForm.customStepInsertDefs[item.higher]
      }
      vm.organizeData()
    },
    addInsertDef() {
      const vm = this
      var addItem = [ '', [] ]
      vm.pipelineDefForm.customStepInsertDefs.unshift(addItem)
    },
    deleteInsertDef(i) {
      const vm = this
      vm.pipelineDefForm.customStepInsertDefs.splice(i, 1)
    },
    // InsertDefChange() {
    //   const vm = this
    //   vm.pipelineDefForm.customStepInsertDefs.map(i => {
    //     vm.InsertDefNames.map((row, index) => {
    //       if(i[0] === row.text){
    //         row.disabled = true
    //       }else{
    //         row.disabled = false
    //       }
    //     })
    //   })
    // },
    openYaml() {
      const vm = this;
      let copyData = JSON.parse(JSON.stringify(vm.pipelineDefForm))
      vm.yamlText = YAML.stringify(copyData, 4);
      vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
      vm.yamlDialog = true;
    },
    openDefComment() {
      const vm = this;
      if (vm.customOpsDefsDialog) {
        if (vm.$refs.opsDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.opsBatchDefsDialog) {
        if (vm.$refs.opsBatchDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.customStepDefDialog) {
        if (vm.$refs.customStepDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.customStepEnvDefDialog && !vm.copyToEnvCustomStepDialog) {
        if (vm.$refs.customStepEnvDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.buildDefDialog) {
        if (vm.$refs.buildDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.packageDefDialog) {
        if (vm.$refs.packageDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.artifactDefDialog) {
        if (vm.$refs.artifactDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.dockerIgnoreDefDialog) {
        vm.commentDefDialog = true;
        vm.comment = '';
      } else if (vm.istioGatewayDefDialog) {
        if (vm.$refs.istioGatewayDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.deployContainerDefDialog && !vm.copyToEnvDeployContainerDialog) {
        if (vm.$refs.deployContainerDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.deployArtifactDefDialog && !vm.copyToEnvDeployArtifactDialog) {
        if (vm.$refs.deployArtifactDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.istioDefDialog && !vm.copyToEnvIstioDialog) {
        if (vm.$refs.istioDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.copyToEnvDeployContainerDialog) {
        if (vm.$refs.deployContainerDefRef.validate() && vm.$refs.copyToEnvDeployContainerRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.copyToEnvDeployArtifactDialog) {
        if (vm.$refs.deployArtifactDefRef.validate() && vm.$refs.copyToEnvDeployArtifactRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.copyToEnvIstioDialog) {
        if (vm.$refs.istioDefRef.validate() && vm.$refs.copyToEnvIstioRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.copyToEnvCustomStepDialog) {
        if (vm.$refs.customStepEnvDefRef.validate() && vm.$refs.copyToEnvCustomStepRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.pipelineDefDialog && !vm.copyToBranchPipelineDialog) {
        if (vm.$refs.pipelineDefRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      } else if (vm.copyToBranchPipelineDialog) {
        if (vm.$refs.pipelineDefRef.validate() && vm.$refs.copyToBranchPipelineRef.validate()) {
          vm.commentDefDialog = true;
          vm.comment = '';
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'));
        }
      }
    },
    updateDefComment() {
      const vm = this;
      if (vm.customOpsDefsDialog) {
        vm.updateOpsDef()
      } else if (vm.opsBatchDefsDialog) {
        vm.updateOpsBatchDef()
      } else if (vm.customStepDefDialog) {
        vm.updateCustomStepDef()
      } else if (vm.customStepEnvDefDialog && !vm.copyToEnvCustomStepDialog) {
        vm.updateCustomStepDefEnv()
      } else if (vm.buildDefDialog) {
        vm.updateBuildDef()
      } else if (vm.packageDefDialog) {
        vm.updatePackageDef()
      } else if (vm.artifactDefDialog) {
        vm.updateArtifactDef()
      } else if (vm.dockerIgnoreDefDialog) {
        vm.updateDockerIgnoreDef()
      } else if (vm.istioGatewayDefDialog) {
        vm.updateIstioGatewayDef()
      } else if (vm.deployContainerDefDialog && !vm.copyToEnvDeployContainerDialog) {
        vm.updateDeployContainerDef()
      } else if (vm.deployArtifactDefDialog && !vm.copyToEnvDeployArtifactDialog) {
        vm.updateDeployArtifactDef()
      } else if (vm.istioDefDialog && !vm.copyToEnvIstioDialog) {
        vm.updateIstioDefDef()
      } else if (vm.copyToEnvCustomStepDialog) {
        vm.customStepDefToEnv()
      } else if (vm.copyToEnvDeployContainerDialog) {
        vm.deployContainerDefToEnv()
      } else if (vm.copyToEnvDeployArtifactDialog) {
        vm.deployArtifactDefToEnv()
      } else if (vm.copyToEnvIstioDialog) {
        vm.istioDefToEnv()
      } else if (vm.pipelineDefDialog && !vm.copyToBranchPipelineDialog) {
        vm.updatePipelineDef()
      } else if (vm.copyToBranchPipelineDialog) {
        vm.pipelineDefToBranch()
      }
    },
    openPipelineDef(projectName, branchName) {
      const vm = this;
      if (projectName === "") {
        projectName = vm.targetProjectName;
      }
      vm.targetBranchName = branchName;
      vm.copyInsertDefNames = JSON.parse(JSON.stringify(vm.InsertDefNames))
      request.get(`/cicd/projectDef/${projectName}/${branchName}/pipelineDef`).then((response) => {
        vm.pipelineDefForm = response.data.pipelineDef
        vm.project.pipelines.forEach(row => {
          if (row.branchName === branchName) {
            vm.pipelineEnvs = [...new Set([...row.envs, ...row.envProductions])]
          }
        })
        vm.errMsgPipelineDef = response.data.errMsgPipelineDef
        vm.organizeData()
        vm.textName = ''
        vm.stepInformation = null
        vm.pipelineDefDialog = true
      }).catch((error) => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    updatePipelineDef() {
      const vm = this;
      let copyData = JSON.parse(JSON.stringify(vm.pipelineDefForm))
      var YAMLstring = YAML.stringify(copyData, 4);
      request.post(`/cicd/projectDef/${vm.targetProjectName}/pipelineDef`, {
        pipelineDefYaml: YAMLstring,
        branchName: vm.targetBranchName,
        comment: vm.comment,
      }).then((response) => {
        vm.successTip(true, response.msg);
        vm.commentDefDialog = false;
        vm.comment = '';
        vm.pipelineDefDialog = false;
        vm.refresh();
      }).catch((error) => {
        vm.errorTip(true, error.response.data.msg);
      });
    },
    openPipelineDefToBranch() {
      const vm = this;
      if (vm.$refs.pipelineDefRef.validate()) {
        vm.copyToBranchPipelineDialog = true;
        vm.branchNames = [];
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    pipelineDefToBranch() {
      const vm = this;
      if (vm.$refs.copyToBranchPipelineRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.pipelineDefForm))
        var pipelineDefYaml = YAML.stringify(copyData,4)
        request
          .put(`/cicd/projectDef/${vm.targetProjectName}/pipelineDef`, {
            pipelineDefYaml: pipelineDefYaml,
            branchNames: vm.branchNames,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.copyToBranchPipelineDialog = false;
            vm.pipelineDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openIstioGatewayDef(envName) {
      const vm = this;
      vm.istioGatewayDefDialog = true;
      vm.dialogLoading = true;
      vm.targetEnvName = envName;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        response.data.project.projectAvailableEnvs.map((item) => {
          if (item.envName === envName) {
            delete item.istioGatewayDef.weightDefault
            delete item.istioGatewayDef.weightNew
            vm.istioGatewayDefForm = item.istioGatewayDef;
            vm.errMsgIstioGatewayDef = item.errMsgIstioGatewayDef;
          }
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
    },
    previewIstioGatewayDef() {
      const vm = this;
      if (vm.$refs.istioGatewayDefRef.validate()) {
        vm.yamlText = YAML.stringify(vm.istioGatewayDefForm, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateIstioGatewayDef() {
      const vm = this;
      if (vm.$refs.istioGatewayDefRef.validate()) {
        var istioGatewayDefYaml = YAML.stringify(vm.istioGatewayDefForm, 4);
        request
          .post(`/cicd/projectDef/${vm.targetProjectName}/istioGatewayDef`, {
            istioGatewayDefYaml: istioGatewayDefYaml,
            envName: vm.targetEnvName,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.istioGatewayDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeployContainerDef(envName) {
      const vm = this;
      vm.deployContainerDefOpts = []
      vm.hostAliasesDisable = false
      vm.hpaConfigDisable = false
      vm.securityContextDisable = false
      vm.patchesDisable = false
      vm.enableDownwardApiDisable = false
      vm.nodeNameDisable = false
      vm.nodeSelectorDisable = false
      vm.subdomainDisable = false

      vm.deployContainerDefDialog = true;
      vm.dialogLoading = true;
      vm.targetEnvName = envName;
      vm.copyDeployContainerDefForm = [];
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        vm.nodePorts = []
        response.data.project.projectNodePorts.map((item) => {
          if (item.envName === envName) {
            vm.nodePorts = item.nodePorts
          }
        })
        response.data.project.projectAvailableEnvs.map((item) => {
          if (item.envName === envName) {
            if (item.disabledDefs !== null) {
              item.disabledDefs.forEach(disabledDef => {
                switch (disabledDef) {
                  case 'hostAliases':
                    vm.hostAliasesDisable = true
                    break
                  case 'hpaConfig':
                    vm.hpaConfigDisable = true
                    break
                  case 'securityContext':
                    vm.securityContextDisable = true
                    break
                  case 'patches':
                    vm.patchesDisable = true
                    break
                  case 'enableDownwardApi':
                    vm.enableDownwardApiDisable = true
                    break
                  case 'nodeName':
                    vm.nodeNameDisable = true
                    break
                  case 'nodeSelector':
                    vm.nodeSelectorDisable = true
                    break
                  case 'subdomain':
                    vm.subdomainDisable = true
                    break
                }
              })
            }
            if (vm.community) {
              vm.patchesDisable = true
            }
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources'), value: 'deployResources' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other'), value: 'deployOther' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_job'), value: 'job' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_cron_job'), value: 'cronJob' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta'), value: 'deployMeta' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_ports'), value: 'deployPorts' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes'), value: 'deployVolumes' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check'), value: 'deployHealthCheck' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle'), value: 'lifecycle' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_depend_services'), value:'dependServices' })
            if (!vm.hpaConfigDisable) {
              vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config'), value: 'hpaConfig' })
            }
            if (!vm.hostAliasesDisable) {
              vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases'), value: 'hostAliases' })
            }
            if (!vm.securityContextDisable) {
              vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_security_context'), value: 'securityContext' })
            }
            if (!vm.patchesDisable) {
              vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_patches'), value: 'patches' })
            }
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings'), value: 'deployConfigSettings' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_maps'), value: 'deployConfigMaps' })
            vm.deployContainerDefOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_secrets'), value: 'deploySecrets' })
            vm.deployContainerDefForm = item.deployContainerDefs;
            vm.errMsgDeployContainerDefs = item.errMsgDeployContainerDefs;
            vm.pvcNames = item.pvcNames;
            vm.nodeNames = item.nodeNames;
            vm.nodeLabels = item.nodeLabels;
            vm.deployContainerDefForm.map((e, i) => {
              Object.keys(e).forEach(item => {
                if(e[item] !== null){
                  if(e[item] instanceof Array && e[item].length <= 0){
                    e[item] = null
                  }else if(e[item] instanceof Object && JSON.stringify(e[item]) == "{}"){
                    e[item] = null
                  }
                }
              })
              let newRelatedPackage = "";
              newRelatedPackage = vm.project.packageNames.indexOf(e.relatedPackage);
              if (newRelatedPackage === -1) {
                e.relatedPackage = "";
              }
              if (e.deployEnvs !== null) {
                e.deployEnvs.forEach((row, rowIndex) => {
                  row = row.split("=");
                  e.deployEnvs[rowIndex] = row;
                });
              }
              if (e.nodeSelector !== null) {
                e.nodeSelector.forEach((row, rowIndex) => {
                  row.text = row.name+"="+row.value;
                  e.nodeSelector[rowIndex] = row;
                });
              }
            });
          }
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
      vm.timer2 = setTimeout(() => {
        vm.$refs.deployContainerDefRef.validate();
      }, 500);
    },
    parseDeployContainerDef() {
      const vm = this
      var copyData = JSON.parse(JSON.stringify(vm.deployContainerDefForm))
      copyData.map((e, i) => {
        if (
            e.deploySessionAffinityTimeoutSeconds !== null &&
            e.deploySessionAffinityTimeoutSeconds !== 0
          ) {
        } else {
          delete e.deploySessionAffinityTimeoutSeconds
        }
        if (e.deployEnvs !== null && e.deployEnvs.length > 0) {
          e.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            e.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(e).forEach(item => {
          if (e[item] !== null) {
            if (e[item] instanceof Array && e[item].length <= 0) {
              delete e[item]
            } else if (e[item] instanceof Object && JSON.stringify(e[item]) == "{}") {
              delete e[item]
            } else if (e[item] === '') {
              delete e[item]
            } else if (e[item] instanceof Object) {
              if(item === 'hpaConfig'){
                if (
                    e.hpaConfig.cpuAverageRequestPercent === 0 &&
                    e.hpaConfig.maxReplicas === 0 &&
                    e.hpaConfig.memoryAverageRequestPercent === 0 &&
                    e.hpaConfig.cpuAverageValue === '' &&
                    e.hpaConfig.memoryAverageValue === ''
                  ) {
                  delete e.hpaConfig
                } else {
                  vm.sortData(e.hpaConfig)
                }
              } else if (item === 'deployResources') {
                if (
                    e.deployResources.cpuLimit === '' &&
                    e.deployResources.cpuRequest === '' &&
                    e.deployResources.memoryLimit === '' &&
                    e.deployResources.memoryRequest === '' &&
                    e.deployResources.extraRequest === null &&
                    e.deployResources.extraLimit === null
                  ) {
                  delete e.deployResources
                } else {
                  vm.sortData(e.deployResources)
                }
              } else if (item === 'deployHealthCheck') {
                if (
                    e.deployHealthCheck.livenessDelaySeconds === 0 &&
                    e.deployHealthCheck.livenessPeriodSeconds === 0 &&
                    e.deployHealthCheck.readinessDelaySeconds === 0 &&
                    e.deployHealthCheck.readinessPeriodSeconds === 0 &&
                    e.deployHealthCheck.startupDelaySeconds === 0 &&
                    e.deployHealthCheck.startupPeriodSeconds === 0 &&
                    e.deployHealthCheck.checkPort === 0 &&
                    e.deployHealthCheck.exec === '' &&
                    e.deployHealthCheck.httpGet.port === 0 &&
                    e.deployHealthCheck.httpGet.httpHeaders === null &&
                    e.deployHealthCheck.httpGet.path === '' &&
                    e.deployHealthCheck.httpGet.scheme === ''
                  ) {
                  delete e.deployHealthCheck
                } else {
                  vm.sortData(e.deployHealthCheck.httpGet)
                  vm.sortData(e.deployHealthCheck)
                }
              } else if (item === 'lifecycle') {
                if (
                    e.lifecycle.postStart.exec === '' &&
                    e.lifecycle.postStart.httpGet.port === 0 &&
                    e.lifecycle.postStart.httpGet.httpHeaders === null &&
                    e.lifecycle.postStart.httpGet.path === '' &&
                    e.lifecycle.postStart.httpGet.scheme === '' &&
                    e.lifecycle.preStop.exec === '' &&
                    e.lifecycle.preStop.httpGet.port === 0 &&
                    e.lifecycle.preStop.httpGet.httpHeaders === null &&
                    e.lifecycle.preStop.httpGet.path === '' &&
                    e.lifecycle.preStop.httpGet.scheme === ''
                  ) {
                  delete e.lifecycle
                } else {
                  vm.sortData(e.lifecycle.postStart.httpGet)
                  vm.sortData(e.lifecycle.postStart)
                  vm.sortData(e.lifecycle.preStop.httpGet)
                  vm.sortData(e.lifecycle.preStop)
                }
              } else if (item === 'securityContext') {
                if (
                    e.securityContext.runAsGroup === 0 &&
                    e.securityContext.runAsUser === 0
                  ) {
                  delete e.securityContext
                } else {
                  vm.sortData(e.securityContext)
                }
              } else if (item === 'deployVolumes'){
                if (
                    e.deployVolumes && e.deployVolumes !== null &&
                    e.deployVolumes.length > 0
                  ) {
                  e.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployLocalPorts'){
                if (
                    e.deployLocalPorts &&
                    e.deployLocalPorts !== null &&
                    e.deployLocalPorts.length > 0
                  ) {
                  e.deployLocalPorts.forEach(row => {
                    vm.sortData(row.ingress)
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployNodePorts'){
                if (
                    e.deployNodePorts &&
                    e.deployNodePorts !== null &&
                    e.deployNodePorts.length > 0
                  ) {
                  e.deployNodePorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          } else {
            delete e[item]
          }
        })
      });
      return copyData
    },
    previewDeployContainerDef() {
      const vm = this
      if (vm.$refs.deployContainerDefRef.validate()) {
        var copyData = vm.parseDeployContainerDef()
        vm.yamlText = YAML.stringify(copyData, 4)
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyDeployContainerDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.deployContainerDefForm[i]));
      copyItem.deployName = vm.deployContainerDefForm[i].deployName + "-copy";
      vm.deployContainerDefForm.push(copyItem);
    },
    deleteDeployContainerDef(i) {
      const vm = this;
      vm.deployContainerDefForm.splice(i, 1);
    },
    clearParams(i, name) {
      const vm = this;
      if (name === "deployOther") {
        vm.deployContainerDefForm[i].deployCommand = '';
        vm.deployContainerDefForm[i].deployEnvs = null;
        vm.deployContainerDefForm[i].deployArgs = null;
        vm.deployContainerDefForm[i].workingDir = '';
        vm.deployContainerDefForm[i].nodeSelector = null;
        vm.deployContainerDefForm[i].nodeName = '';
        vm.deployContainerDefForm[i].terminationGracePeriodSeconds = 0;
        vm.deployContainerDefForm[i].subdomain = '';
        vm.deployContainerDefForm[i].enableDownwardApi = false;
        vm.deployContainerDefForm[i].restartPolicy = '';
        vm.deployContainerDefForm[i].deploySessionAffinityTimeoutSeconds = 0;
        vm.deployContainerDefForm[i].deployHeadless = false;
        vm.deployContainerDefForm[i].podManagementPolicy = '';
      } else if (name === "job") {
        vm.deployContainerDefForm[i].job.completions = 0;
        vm.deployContainerDefForm[i].job.parallelism = 0;
        vm.deployContainerDefForm[i].job.completionMode = '';
        vm.deployContainerDefForm[i].job.backoffLimit = 0;
        vm.deployContainerDefForm[i].job.activeDeadlineSeconds = 0;
        vm.deployContainerDefForm[i].job.ttlSecondsAfterFinished = 0;
      } else if (name === "cronJob") {
        vm.deployContainerDefForm[i].cronJob.schedule = '';
        vm.deployContainerDefForm[i].cronJob.concurrencyPolicy = '';
        vm.deployContainerDefForm[i].cronJob.startingDeadlineSeconds = 0;
        vm.deployContainerDefForm[i].cronJob.successfulJobsHistoryLimit = 0;
        vm.deployContainerDefForm[i].cronJob.failedJobsHistoryLimit = 0;
      } else if (name === "deployMeta") {
        vm.deployContainerDefForm[i].deployMeta = {
          labels: null,
          annotations: null,
        };
      } else if (name === "patches") {
        vm.deployContainerDefForm[i].patches = null;
      } else if (name === "securityContext") {
        vm.deployContainerDefForm[i].securityContext = {
          runAsUser: 0,
          runAsGroup: 0,
        };
      } else if (name === "deployHealthCheck") {
        vm.deployContainerDefForm[i].deployHealthCheck = {
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
        vm.deployContainerDefForm[i].lifecycle.postStart = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
        vm.deployContainerDefForm[i].lifecycle.preStop = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
      } else if (name === "hpaConfig") {
        vm.deployContainerDefForm[i].hpaConfig = {
          cpuAverageRequestPercent: 0,
          maxReplicas: 0,
          memoryAverageRequestPercent: 0,
          cpuAverageValue: "",
          memoryAverageValue: "",
        };
      } else if (name === 'deployResources'){
        vm.deployContainerDefForm[i].deployResources = {
          cpuLimit: '',
          cpuRequest: '',
          memoryLimit: '',
          memoryRequest: ''
        };
      } else if (name === 'deployPorts') {
        vm.deployContainerDefForm[i].deployNodePorts = null
        vm.deployContainerDefForm[i].deployLocalPorts = null
      } else {
        vm.deployContainerDefForm[i][name] = null;
      }
    },
    addDeployEnvs(i) {
      const vm = this;
      let addItem = ["", ""];
      if (vm.deployContainerDefForm[i].deployEnvs === null) {
        vm.deployContainerDefForm[i].deployEnvs = [];
        vm.deployContainerDefForm[i].deployEnvs.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployEnvs.push(addItem);
      }
    },
    addDeployMetaLabels(i) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.deployContainerDefForm[i].deployMeta.labels === null) {
        vm.deployContainerDefForm[i].deployMeta.labels = [];
        vm.deployContainerDefForm[i].deployMeta.labels.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployMeta.labels.push(addItem);
      }
    },
    addDeployMetaAnnotations(i) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.deployContainerDefForm[i].deployMeta.annotations === null) {
        vm.deployContainerDefForm[i].deployMeta.annotations = [];
        vm.deployContainerDefForm[i].deployMeta.annotations.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployMeta.annotations.push(addItem);
      }
    },
    addPatches(i) {
      const vm = this;
      let addItem = {
        resourceKind: '',
        path: '',
        content: '',
      };
      if (vm.deployContainerDefForm[i].patches === null) {
        vm.deployContainerDefForm[i].patches = [];
        vm.deployContainerDefForm[i].patches.push(addItem);
      } else {
        vm.deployContainerDefForm[i].patches.push(addItem);
      }
    },
    addDeployLocalPort(i) {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "http",
        ingress: {
          domainName: "",
          pathPrefix: "",
          certSelfSigned: false,
          certPath: "",
        },
      };
      if (vm.deployContainerDefForm[i].deployLocalPorts === null) {
        vm.deployContainerDefForm[i].deployLocalPorts = [];
        vm.deployContainerDefForm[i].deployLocalPorts.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployLocalPorts.push(addItem);
      }
    },
    copyDeployLocalPort(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deployLocalPorts[j])
      );
      vm.deployContainerDefForm[i].deployLocalPorts.push(copyItem);
    },
    deleteDeployLocalPort(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployLocalPorts.splice(j, 1);
    },
    deleteDeployEnvs(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployEnvs.splice(j, 1);
    },
    deleteDeployMetaLabels(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployMeta.labels.splice(j, 1);
    },
    deleteDeployMetaAnnotations(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployMeta.annotations.splice(j, 1);
    },
    deletePatches(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].patches.splice(j, 1);
    },
    addExtraRequest(i) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.deployContainerDefForm[i].deployResources.extraRequest === null) {
        vm.deployContainerDefForm[i].deployResources.extraRequest = [];
        vm.deployContainerDefForm[i].deployResources.extraRequest.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployResources.extraRequest.push(addItem);
      }
    },
    copyExtraRequest(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.deployContainerDefForm[i].deployResources.extraRequest[j]
        )
      );
      vm.deployContainerDefForm[i].deployResources.extraRequest.push(copyItem);
    },
    deleteExtraRequest(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployResources.extraRequest.splice(j,1);
    },
    addExtraLimit(i) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.deployContainerDefForm[i].deployResources.extraLimit === null) {
        vm.deployContainerDefForm[i].deployResources.extraLimit = [];
        vm.deployContainerDefForm[i].deployResources.extraLimit.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployResources.extraLimit.push(addItem);
      }
    },
    copyExtraLimit(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.deployContainerDefForm[i].deployResources.extraLimit[j]
        )
      );
      vm.deployContainerDefForm[i].deployResources.extraLimit.push(copyItem);
    },
    deleteExtraLimit(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployResources.extraLimit.splice(j,1);
    },
    addDeployNodePort(i) {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "http",
        nodePort: null,
      };
      if (vm.deployContainerDefForm[i].deployNodePorts === null) {
        vm.deployContainerDefForm[i].deployNodePorts = [];
        vm.deployContainerDefForm[i].deployNodePorts.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployNodePorts.push(addItem);
      }
    },
    copyDeployNodePort(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deployNodePorts[j])
      );
      vm.deployContainerDefForm[i].deployNodePorts.push(copyItem);
    },
    deleteDeployNodePort(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployNodePorts.splice(j, 1);
    },
    addDeployVolumes(i) {
      const vm = this;
      let addItem = {
        pathInPod: "",
        pathInPv: "",
        pvc: "",
      };
      if (vm.deployContainerDefForm[i].deployVolumes === null) {
        vm.deployContainerDefForm[i].deployVolumes = [];
        vm.deployContainerDefForm[i].deployVolumes.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployVolumes.push(addItem);
      }
    },
    copyDeployVolumes(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deployVolumes[j])
      );
      vm.deployContainerDefForm[i].deployVolumes.push(copyItem);
    },
    deleteDeployVolumes(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployVolumes.splice(j, 1);
    },
    addHealthCheckHttpHeaders(i) {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders === null) {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders = [];
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders.push(addItem);
      }
    },
    copyHealthCheckHttpHeaders(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders[j]
        )
      );
      vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders.push(copyItem);
    },
    deleteHealthCheckHttpHeaders(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePostStartHttpHeaders(i) {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders === null) {
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders = [];
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      } else {
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePostStartHttpHeaders(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders[j]
        )
      );
      vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePostStartHttpHeaders(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePreStopHttpHeaders(i) {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders === null) {
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders = [];
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      } else {
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePreStopHttpHeaders(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders[j]
        )
      );
      vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePreStopHttpHeaders(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders.splice(j,1);
    },
    addDependServices(i) {
      const vm = this;
      let addItem = {
        dependName: "",
        dependPort: null,
        dependType: "",
        httpGetUrl: "",
      };
      if (vm.deployContainerDefForm[i].dependServices === null) {
        vm.deployContainerDefForm[i].dependServices = [];
        vm.deployContainerDefForm[i].dependServices.push(addItem);
      } else {
        vm.deployContainerDefForm[i].dependServices.push(addItem);
      }
    },
    copyDependServices(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].dependServices[j])
      );
      vm.deployContainerDefForm[i].dependServices.push(copyItem);
    },
    deleteDependServices(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].dependServices.splice(j, 1);
    },
    addHostAliases(i) {
      const vm = this;
      let addItem = {
        ip: "",
        hostnames: [],
      };
      if (vm.deployContainerDefForm[i].hostAliases === null) {
        vm.deployContainerDefForm[i].hostAliases = [];
        vm.deployContainerDefForm[i].hostAliases.push(addItem);
      } else {
        vm.deployContainerDefForm[i].hostAliases.push(addItem);
      }
    },
    copyHostAliases(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].hostAliases[j])
      );
      vm.deployContainerDefForm[i].hostAliases.push(copyItem);
    },
    deleteHostAliases(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].hostAliases.splice(j, 1);
    },
    addDeployConfigSettings(i) {
      const vm = this;
      let addItem = {
        localPath: '',
        pvcName: '',
        podPath: '',
      };
      if (vm.deployContainerDefForm[i].deployConfigSettings === null) {
        vm.deployContainerDefForm[i].deployConfigSettings = [];
        vm.deployContainerDefForm[i].deployConfigSettings.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployConfigSettings.push(addItem);
      }
    },
    copyDeployConfigSettings(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deployConfigSettings[j])
      );
      vm.deployContainerDefForm[i].deployConfigSettings.push(copyItem);
    },
    deleteDeployConfigSettings(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployConfigSettings.splice(j, 1);
    },
    addDeployConfigMaps(i) {
      const vm = this;
      let addItem = {
        name: '',
        fromFileType: 'from-file',
        paths: [],
      };
      if (vm.deployContainerDefForm[i].deployConfigMaps === null) {
        vm.deployContainerDefForm[i].deployConfigMaps = [];
        vm.deployContainerDefForm[i].deployConfigMaps.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deployConfigMaps.push(addItem);
      }
    },
    copyDeployConfigMaps(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deployConfigMaps[j])
      );
      vm.deployContainerDefForm[i].deployConfigMaps.push(copyItem);
    },
    deleteDeployConfigMaps(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deployConfigMaps.splice(j, 1);
    },
    addDeploySecrets(i) {
      const vm = this;
      let addItem = {
        name: '',
        secretType: 'generic',
        fromFileType: 'from-file',
        paths: [],
        dockerConfig: '',
        cert: '',
        key: '',
      };
      if (vm.deployContainerDefForm[i].deploySecrets === null) {
        vm.deployContainerDefForm[i].deploySecrets = [];
        vm.deployContainerDefForm[i].deploySecrets.push(addItem);
      } else {
        vm.deployContainerDefForm[i].deploySecrets.push(addItem);
      }
    },
    copyDeploySecrets(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].deploySecrets[j])
      );
      vm.deployContainerDefForm[i].deploySecrets.push(copyItem);
    },
    deleteDeploySecrets(i, j) {
      const vm = this;
      vm.deployContainerDefForm[i].deploySecrets.splice(j, 1);
    },
    selectDeployContainerDefDeploySecretType(e, i, j) {
      const vm = this;
      if (e === 'generic') {
        vm.deployContainerDefForm[i].deploySecrets[j].dockerConfig = '';
        vm.deployContainerDefForm[i].deploySecrets[j].cert = '';
        vm.deployContainerDefForm[i].deploySecrets[j].key = '';
      } else if (e === 'docker-registry') {
        vm.deployContainerDefForm[i].deploySecrets[j].fromFileType = '';
        vm.deployContainerDefForm[i].deploySecrets[j].paths = [];
        vm.deployContainerDefForm[i].deploySecrets[j].cert = '';
        vm.deployContainerDefForm[i].deploySecrets[j].key = '';
      } else if (e === 'tls') {
        vm.deployContainerDefForm[i].deploySecrets[j].fromFileType = '';
        vm.deployContainerDefForm[i].deploySecrets[j].paths = [];
        vm.deployContainerDefForm[i].deploySecrets[j].dockerConfig = '';
      }
    },
    copyPatches(i, j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.deployContainerDefForm[i].patches[j])
      );
      vm.deployContainerDefForm[i].patches.push(copyItem);
    },
    updateDeployContainerDef() {
      const vm = this;
      if (vm.$refs.deployContainerDefRef.validate()) {
        var copyData = vm.parseDeployContainerDef()
        var deployContainerDefsYaml = YAML.stringify(copyData, 4);
        request.post(`/cicd/projectDef/${vm.targetProjectName}/deployContainerDefs`,
          {
            deployContainerDefsYaml: deployContainerDefsYaml,
            envName: vm.targetEnvName,
            comment: vm.comment,
          }
        ).then((response) => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.deployContainerDefDialog = false;
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch((error) => {
          vm.errorTip(true, error.response.data.msg);
        });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    previewDeployContainerDefYaml() {
      const vm = this;
      if (vm.$refs.deployContainerDefRef.validate()) {
        var copyData = vm.parseDeployContainerDef()
        var deployContainerDefsYaml = YAML.stringify(copyData, 4)
        vm.dialogLoading = true
        vm.deployContainerDefYamlDialog = true
        vm.deployContainerDefModules = []
        vm.deployContainerDefModuleName = ''
        request.post(`/cicd/projectDef/${vm.targetProjectName}/deployContainerDefs/view`,
          {
            deployContainerDefsYaml: deployContainerDefsYaml,
            envName: vm.targetEnvName,
          }
        ).then((response) => {
          vm.dialogLoading = false
          vm.deployContainerDefYamls = response.data.deployments
          var str = ''
          vm.deployContainerDefYamls.forEach((row, i) => {
            str = str + '# moduleName: ' + row.moduleName + '\n'
            str = str + '\n' + row.deployYaml + '\n' + row.serviceYaml + '\n' + row.hpaYaml + '\n' + row.ingressYaml + '\n\n'
            var module = {
              text: row.moduleName,
              value: row.moduleName,
            }
            if (row.moduleName === '') {
              module.text = 'ALL'
            }
            vm.deployContainerDefModules.push(module)
          })
          vm.$refs.deployContainerDefYaml.monacoEditor.setValue(str)
          vm.successTip(true, response.msg)
        }).catch((error) => {
          vm.dialogLoading = false
          vm.errorTip(true, error.response.data.msg)
        });
      } else {
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    selectDeployContainerDefYaml() {
      const vm = this
      var str = ''
      vm.deployContainerDefYamls.forEach((row, i) => {
        var ok = false
        if (vm.deployContainerDefModuleName === '') {
          ok = true
        } else if (vm.deployContainerDefModuleName === row.moduleName) {
          ok = true
        }
        if (ok) {
          str = str + '# moduleName: ' + row.moduleName + '\n'
          str = str + '\n' + row.deployYaml + '\n' + row.serviceYaml + '\n' + row.hpaYaml + '\n' + row.ingressYaml + '\n\n'
        }
      })
      vm.$refs.deployContainerDefYaml.monacoEditor.setValue(str)
    },
    closeDeployContainerDefYaml() {
      const vm = this
      vm.$refs.deployContainerDefYaml.monacoEditor.setValue('')
      vm.deployContainerDefYamlDialog = false
      vm.deployContainerDefYamls = []
      vm.deployContainerDefModules = []
      vm.deployContainerDefModuleName = ''
    },
    checkDeployContainerDef(e, i) {
      const vm = this;
      if (e) {
        vm.copyDeployContainerDefIndex.push(i);
        vm.copyDeployContainerDefIndex = Array.from(
          new Set(vm.copyDeployContainerDefIndex)
        );
      } else {
        vm.copyDeployContainerDefIndex = Array.from(
          new Set(vm.copyDeployContainerDefIndex)
        );
        vm.copyDeployContainerDefIndex.forEach((item, index) => {
          if (item === i) {
            vm.copyDeployContainerDefIndex.splice(index, 1);
          }
        });
      }
    },
    openDeployContainerDefToEnv() {
      const vm = this;
      if (vm.$refs.deployContainerDefRef.validate()) {
        if (vm.copyDeployContainerDefIndex.length !== 0) {
          vm.copyToEnvDeployContainerDialog = true;
          vm.project.projectAvailableEnvs.map((item, index) => {
            vm.copyEnvList.push(item.envName);
          });
          vm.copyEnvList.forEach((row, i) => {
            if (row === vm.targetEnvName) {
              vm.copyEnvList.splice(i, 1);
            }
          });
          vm.copyDeployContainerDefIndex.map((item) => {
            vm.copyDeployContainerDefForm.push(vm.deployContainerDefForm[item]);
          });
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_items_to_copy'));
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    deployContainerDefToEnv() {
      const vm = this;
      if (vm.$refs.copyToEnvDeployContainerRef.validate()) {
        vm.copyDeployContainerDefForm.map((e, i) => {
          if (e.deployEnvs !== null) {
            e.deployEnvs.forEach((row, rowIndex) => {
              row = row.join("=");
              e.deployEnvs[rowIndex] = row;
            });
          }
        });
        var deployContainerDefsYaml = YAML.stringify(
          vm.copyDeployContainerDefForm,
          4
        );
        request
          .put(`/cicd/projectDef/${vm.targetProjectName}/deployContainerDefs`, {
            deployContainerDefsYaml: deployContainerDefsYaml,
            envNames: vm.envNames,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.copyToEnvDeployContainerDialog = false;
            vm.deployContainerDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
            vm.copyDeployContainerDefForm.map((e, i) => {
              if (e.deployEnvs !== null) {
                e.deployEnvs.forEach((row, rowIndex) => {
                  row = row.split("=");
                  e.deployEnvs[rowIndex] = row;
                });
              }
            });
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeployArtifactDef(envName) {
      const vm = this;
      vm.deployArtifactDefDialog = true;
      vm.dialogLoading = true;
      vm.targetEnvName = envName;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        response.data.project.projectAvailableEnvs.map((item) => {
          if (item.envName === envName) {
            vm.deployArtifactDefForm = item.deployArtifactDefs;
            vm.hostnames = item.hostnames;
            vm.errMsgDeployArtifactDefs = item.errMsgDeployArtifactDefs;
            vm.deployArtifactDefForm.map((e, i) => {
              let newRelatedPackage = "";
              newRelatedPackage = vm.hostnames.indexOf(e.hosts);
              if (newRelatedPackage === -1) {
                e.hosts = "";
              }
              let newArtifact = ''
              newArtifact = vm.project.artifactNames.indexOf(e.relatedArtifact);
              if (newArtifact === -1) {
                e.relatedArtifact = "";
              }
              if(e.variables !== null){
                var variablesList = []
                Object.keys(e.variables).map(item => {
                  let obj = []
                  obj[0] = item
                  obj[1] = e.variables[item]
                  variablesList.push(obj)
                })
                e.variables = variablesList
              }
            });
          }
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
      vm.timer2 = setTimeout(() => {
        vm.$refs.deployArtifactDefRef.validate();
      }, 500);
    },
    addVariables(i) {
      const vm = this;
      if (vm.deployArtifactDefForm[i].variables === null) {
        vm.deployArtifactDefForm[i].variables = [['', '']];
      } else {
        vm.deployArtifactDefForm[i].variables.push([])
      }
    },
    clearVariables(i) {
      const vm = this;
      vm.deployArtifactDefForm[i].variables = null;
    },
    deleteVariables(i, j) {
      const vm = this;
      vm.deployArtifactDefForm[i].variables.splice(j, 1);
    },
    previewDeployArtifactDef() {
      const vm = this;
      if (vm.$refs.deployArtifactDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.deployArtifactDefForm))
        copyData.map((e, i) => {
          if(e.variables !== null){
            let variablesObj = {}
            e.variables.map(item => {
              variablesObj[item[0]] = item[1]
            })
            e.variables = variablesObj
          }else{
            delete e.variables
          }
        })
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateDeployArtifactDef() {
      const vm = this;
      if (vm.$refs.deployArtifactDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.deployArtifactDefForm))
        copyData.map((e, i) => {
          if(e.variables !== null){
            let variablesObj = {}
            e.variables.map(item => {
              variablesObj[item[0]] = item[1]
            })
            e.variables = variablesObj
          }else{
            delete e.variables
          }
        })
        var deployArtifactDefsYaml = YAML.stringify(copyData, 4);
        request.post(`/cicd/projectDef/${vm.targetProjectName}/deployArtifactDefs`, {
          deployArtifactDefsYaml: deployArtifactDefsYaml,
          envName: vm.targetEnvName,
          comment: vm.comment,
        }).then((response) => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.deployArtifactDefDialog = false;
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch((error) => {
          vm.errorTip(true, error.response.data.msg);
        });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    checkDeployArtifactDef(e, i) {
      const vm = this;
      if (e) {
        vm.copyDeployArtifactDefIndex.push(i);
        vm.copyDeployArtifactDefIndex = Array.from(
          new Set(vm.copyDeployArtifactDefIndex)
        );
      } else {
        vm.copyDeployArtifactDefIndex = Array.from(
          new Set(vm.copyDeployArtifactDefIndex)
        );
        vm.copyDeployArtifactDefIndex.forEach((item, index) => {
          if (item === i) {
            vm.copyDeployArtifactDefIndex.splice(index, 1);
          }
        });
      }
    },
    openDeployArtifactDefToEnv() {
      const vm = this;
      if (vm.$refs.deployArtifactDefRef.validate()) {
        if (vm.copyDeployArtifactDefIndex.length !== 0) {
          vm.copyToEnvDeployArtifactDialog = true;
          vm.project.projectAvailableEnvs.map((item, index) => {
            vm.copyEnvList.push(item.envName);
          });
          vm.copyEnvList.forEach((row, i) => {
            if (row === vm.targetEnvName) {
              vm.copyEnvList.splice(i, 1);
            }
          });
          vm.copyDeployArtifactDefIndex.map((item) => {
            vm.copyDeployArtifactDefForm.push(vm.deployArtifactDefForm[item]);
          });
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_items_to_copy'));
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    deployArtifactDefToEnv() {
      const vm = this;
      if (vm.$refs.copyToEnvDeployArtifactRef.validate()) {
        var deployArtifactDefsYaml = YAML.stringify(
          vm.copyDeployArtifactDefForm,
          4
        );
        request
          .put(`/cicd/projectDef/${vm.targetProjectName}/deployArtifactDefs`, {
            deployArtifactDefsYaml: deployArtifactDefsYaml,
            envNames: vm.envNames,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.copyToEnvDeployArtifactDialog = false;
            vm.deployArtifactDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    copyDeployArtifactDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.deployArtifactDefForm[i]));
      copyItem.deployArtifactName =
        vm.deployArtifactDefForm[i].deployArtifactName + "-copy";
      vm.deployArtifactDefForm.push(copyItem);
    },
    deleteDeployArtifactDef(i) {
      const vm = this;
      vm.deployArtifactDefForm.splice(i, 1);
    },
    openIstioDef(envName) {
      const vm = this;
      vm.istioDefDialog = true;
      vm.dialogLoading = true;
      vm.targetEnvName = envName;
      request.get(`/cicd/projectDef/${vm.targetProjectName}`).then((response) => {
        response.data.project.projectAvailableEnvs.map((item) => {
          if (item.envName === envName) {
            vm.istioDefDefForm = item.istioDefs;
            vm.errMsgIstioDefs = item.errMsgIstioDefs;
            vm.deployContainerNames = item.deployContainerNames;
            vm.istioDefDefForm.map((e, i) => {
              let newRelatedPackage = "";
              newRelatedPackage = vm.deployContainerNames.indexOf(e.deployName);
              if (newRelatedPackage === -1) {
                e.deployName = "";
              }
              if(e.httpSettings.corsPolicy.allowOrigins !== null){
                var newAllowOrigins = []
                e.httpSettings.corsPolicy.allowOrigins.map(item => {
                  var arrItem = []
                  arrItem[0] = Object.keys(item)[0]
                  arrItem[1] = Object.values(item)[0]
                  newAllowOrigins.push(arrItem)
                })
                e.httpSettings.corsPolicy.allowOrigins = newAllowOrigins
              }
              if(e.httpSettings.retries.retryOn === ''){
                e.httpSettings.retries.retryOn = []
              }else{
                e.httpSettings.retries.retryOn = e.httpSettings.retries.retryOn.split(',')
              }
              if(e.httpSettings.gateway.matchDefault === false && e.httpSettings.gateway.matchUris === null && e.httpSettings.gateway.rewriteUri === ''){
                e.httpSettings.gatewayFlag = false
              }else{
                e.httpSettings.gatewayFlag = true
              }
              if(e.httpSettings.corsPolicy.allowCredentials === false && e.httpSettings.corsPolicy.allowHeaders === null && e.httpSettings.corsPolicy.allowMethods === null && e.httpSettings.corsPolicy.allowOrigins === null && e.httpSettings.corsPolicy.exposeHeaders === null && e.httpSettings.corsPolicy.maxAge === ''){
                e.httpSettings.corsPolicyFlag = false
              }else{
                e.httpSettings.corsPolicyFlag = true
              }
              if(e.httpSettings.loadBalancer.simple === '' && e.httpSettings.loadBalancer.consistentHash.httpHeaderName === '' && e.httpSettings.loadBalancer.consistentHash.httpQueryParameterName === '' && e.httpSettings.loadBalancer.consistentHash.useSourceIp === false && e.httpSettings.loadBalancer.consistentHash.httpCookie.name === '' && e.httpSettings.loadBalancer.consistentHash.httpCookie.path === '' && e.httpSettings.loadBalancer.consistentHash.httpCookie.ttl === ''){
                e.httpSettings.loadBalancerFlag = false
              }else{
                e.httpSettings.loadBalancerFlag = true
              }
            });
          }
        });
        vm.dialogLoading = false;
      }).catch((error) => {
        vm.dialogLoading = false;
        vm.errorTip(true, error.response.data.msg);
      });
      vm.timer2 = setTimeout(() => {
        vm.$refs.istioDefRef.validate();
      }, 500);
    },
    copyIstioDefDef(i) {
      const vm = this;
      var copyItem = JSON.parse(JSON.stringify(vm.istioDefDefForm[i]));
      vm.istioDefDefForm.push(copyItem);
    },
    deleteIstioDefDef(i) {
      const vm = this;
      vm.istioDefDefForm.splice(i, 1);
    },
    previewIstioDefDef() {
      const vm = this;
      if (vm.$refs.istioDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.istioDefDefForm))
        copyData.map((e, i) => {
          delete e.labelName
          delete e.localLabelConfig
          if( e.httpSettings.retries.retryOn.length > 0){
            e.httpSettings.retries.retryOn = e.httpSettings.retries.retryOn.join(',')
          }else{
            e.httpSettings.retries.retryOn = ''
          }
          if(e.httpSettings.corsPolicy.allowOrigins !== null){
            var newAllowOrigins = []
            e.httpSettings.corsPolicy.allowOrigins.map(item => {
              var arrItem = {}
              arrItem[item[0]] = item[1]
              newAllowOrigins.push(arrItem)
            })
            e.httpSettings.corsPolicy.allowOrigins = newAllowOrigins
          }
          Object.keys(e.httpSettings).forEach(item => {
            if(e.httpSettings[item] !== null){
              if(e.httpSettings[item] instanceof Array && e.httpSettings[item].length <= 0){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] instanceof Object && JSON.stringify(e.httpSettings[item]) == "{}"){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] === ''){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] instanceof Object){
                if(item === 'gateway'){
                  if(e.httpSettings.gatewayFlag === false){
                    delete e.httpSettings.gateway
                  }else{
                    vm.sortData(e.httpSettings.gateway)
                  }
                  delete e.httpSettings.gatewayFlag
                }else if(item === 'corsPolicy'){
                  if(e.httpSettings.corsPolicyFlag === false){
                    delete e.httpSettings.corsPolicy
                  }else{
                    vm.sortData(e.httpSettings.corsPolicy)
                  }
                  delete e.httpSettings.corsPolicyFlag
                }else if(item === 'loadBalancer'){
                  if(e.httpSettings.loadBalancerFlag === false){
                    delete e.httpSettings.loadBalancer
                  }else{
                    vm.sortData(e.httpSettings.loadBalancer.consistentHash.httpCookie)
                    vm.sortData(e.httpSettings.loadBalancer.consistentHash)
                    vm.sortData(e.httpSettings.loadBalancer)
                  }
                  delete e.httpSettings.loadBalancerFlag
                }else if(item === 'connectionPool'){
                  vm.sortData(e.httpSettings.connectionPool.tcp)
                  vm.sortData(e.httpSettings.connectionPool.http)
                  vm.sortData(e.httpSettings.connectionPool)
                }else{
                  vm.sortData(e.httpSettings[item])
                }
              }else if(e.httpSettings[item] === false){
                delete e.httpSettings[item]
              }
            }else{
              delete e.httpSettings[item]
            }
          })
          vm.sortData(e.httpSettings)
          if(e.protocol === 'http'){
            delete e.tcpSettings
          }else{
            delete e.httpSettings
          }
        });
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.yamlDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    updateIstioDefDef() {
      const vm = this;
      if (vm.$refs.istioDefRef.validate()) {
        let copyData = JSON.parse(JSON.stringify(vm.istioDefDefForm))
        copyData.map((e, i) => {
          delete e.labelName
          delete e.localLabelConfig
          if( e.httpSettings.retries.retryOn.length > 0){
            e.httpSettings.retries.retryOn = e.httpSettings.retries.retryOn.join(',')
          }else{
            e.httpSettings.retries.retryOn = ''
          }
          if(e.httpSettings.corsPolicy.allowOrigins !== null){
            var newAllowOrigins = []
            e.httpSettings.corsPolicy.allowOrigins.map(item => {
              var arrItem = {}
              arrItem[item[0]] = item[1]
              newAllowOrigins.push(arrItem)
            })
            e.httpSettings.corsPolicy.allowOrigins = newAllowOrigins
          }
          Object.keys(e.httpSettings).forEach(item => {
            if(e.httpSettings[item] !== null){
              if(e.httpSettings[item] instanceof Array && e.httpSettings[item].length <= 0){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] instanceof Object && JSON.stringify(e.httpSettings[item]) == "{}"){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] === ''){
                delete e.httpSettings[item]
              }else if(e.httpSettings[item] instanceof Object){
                if(item === 'gateway'){
                  if(e.httpSettings.gatewayFlag === false){
                    delete e.httpSettings.gateway
                  }else{
                    vm.sortData(e.httpSettings.gateway)
                  }
                  delete e.httpSettings.gatewayFlag
                }else if(item === 'corsPolicy'){
                  if(e.httpSettings.corsPolicyFlag === false){
                    delete e.httpSettings.corsPolicy
                  }else{
                    vm.sortData(e.httpSettings.corsPolicy)
                  }
                  delete e.httpSettings.corsPolicyFlag
                }else if(item === 'loadBalancer'){
                  if(e.httpSettings.loadBalancerFlag === false){
                    delete e.httpSettings.loadBalancer
                  }else{
                    vm.sortData(e.httpSettings.loadBalancer.consistentHash.httpCookie)
                    vm.sortData(e.httpSettings.loadBalancer.consistentHash)
                    vm.sortData(e.httpSettings.loadBalancer)
                  }
                  delete e.httpSettings.loadBalancerFlag
                }else if(item === 'connectionPool'){
                  vm.sortData(e.httpSettings.connectionPool.tcp)
                  vm.sortData(e.httpSettings.connectionPool.http)
                  vm.sortData(e.httpSettings.connectionPool)
                }else{
                  vm.sortData(e.httpSettings[item])
                }
              }else if(e.httpSettings[item] === false){
                delete e.httpSettings[item]
              }
            }else{
              delete e.httpSettings[item]
            }
          })
          vm.sortData(e.httpSettings)
          if(e.protocol === 'http'){
            delete e.tcpSettings
          }else{
            delete e.httpSettings
          }
        });
        var istioDefsYaml = YAML.stringify(copyData,4);
        request.post(`/cicd/projectDef/${vm.targetProjectName}/istioDefs`, {
          istioDefsYaml: istioDefsYaml,
          envName: vm.targetEnvName,
          comment: vm.comment,
        }).then((response) => {
          vm.commentDefDialog = false;
          vm.comment = '';
          vm.istioDefDialog = false;
          vm.successTip(true, response.msg);
          vm.refresh();
        }).catch((error) => {
          vm.errorTip(true, error.response.data.msg);
        });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openIstioDefToEnv() {
      const vm = this;
      if (vm.$refs.istioDefRef.validate()) {
        if (vm.copyIstioDefDefIndex.length !== 0) {
          vm.copyToEnvIstioDialog = true;
          vm.project.projectAvailableEnvs.map((item, index) => {
            vm.copyEnvList.push(item.envName);
          });
          vm.copyEnvList.forEach((row, i) => {
            if (row === vm.targetEnvName) {
              vm.copyEnvList.splice(i, 1);
            }
          });
          vm.copyIstioDefDefIndex.map((item) => {
            vm.copyIstioDefDefForm.push(vm.istioDefDefForm[item]);
          });
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_items_to_copy'));
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    checkIstioDefDef(e, i) {
      const vm = this;
      if (e) {
        vm.copyIstioDefDefIndex.push(i);
        vm.copyIstioDefDefIndex = Array.from(
          new Set(vm.copyIstioDefDefIndex)
        );
      } else {
        vm.copyIstioDefDefIndex = Array.from(
          new Set(vm.copyIstioDefDefIndex)
        );
        vm.copyIstioDefDefIndex.forEach((item, index) => {
          if (item === i) {
            vm.copyIstioDefDefIndex.splice(index, 1);
          }
        });
      }
    },
    istioDefToEnv() {
      const vm = this;
      if (vm.$refs.copyToEnvIstioRef.validate()) {
        vm.copyIstioDefDefForm.map((e, i) => {
          if( typeof e.httpSettings.retries.retryOn !== 'string' && e.httpSettings.retries.retryOn.length > 0){
            e.httpSettings.retries.retryOn = e.httpSettings.retries.retryOn.join(',')
          }else{
            e.httpSettings.retries.retryOn = ''
          }
        });
        var istioDefsYaml = YAML.stringify(vm.copyIstioDefDefForm, 4);
        request
          .put(`/cicd/projectDef/${vm.targetProjectName}/istioDefs`, {
            istioDefsYaml: istioDefsYaml,
            envNames: vm.envNames,
            comment: vm.comment,
          })
          .then((response) => {
            vm.commentDefDialog = false;
            vm.comment = '';
            vm.copyToEnvIstioDialog = false;
            vm.istioDefDialog = false;
            vm.successTip(true, response.msg);
            vm.refresh();
          })
          .catch((error) => {
            vm.errorTip(true, error.response.data.msg);
          });
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    addMatchUris(i){
      const vm = this;
      var addItem = {
        matchType: '',
        matchValue: '',
      };
      if (vm.istioDefDefForm[i].httpSettings.gateway.matchUris === null) {
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris = [];
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris.push(addItem);
      } else {
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris.push(addItem);
      }
    },
    copyMatchUris(i, j) {
      const vm = this;
      let copyItem = JSON.parse(JSON.stringify(vm.istioDefDefForm[i].httpSettings.gateway.matchUris[j]));
      vm.istioDefDefForm[i].httpSettings.gateway.matchUris.push(copyItem);
    },
    deleteMatchUris(i, j) {
      const vm = this;
      vm.istioDefDefForm[i].httpSettings.gateway.matchUris.splice(j, 1);
    },
    addMatchHeaders(i) {
      const vm = this;
      var addItem = {
        header: '',
        matchType: '',
        matchValue: ''
      };
      if (vm.istioDefDefForm[i].httpSettings.matchHeaders === null) {
        vm.istioDefDefForm[i].httpSettings.matchHeaders = [];
        vm.istioDefDefForm[i].httpSettings.matchHeaders.push(addItem);
      } else {
        vm.istioDefDefForm[i].httpSettings.matchHeaders.push(addItem);
      }
    },
    copyMatchHeaders(i, j) {
      const vm = this;
      let copyItem = JSON.parse(JSON.stringify(vm.istioDefDefForm[i].httpSettings.matchHeaders[j]));
      vm.istioDefDefForm[i].httpSettings.matchHeaders.push(copyItem);
    },
    deleteMatchHeaders(i, j) {
      const vm = this;
      vm.istioDefDefForm[i].httpSettings.matchHeaders.splice(j, 1);
    },
    addAllowOrigins(i){
      const vm = this;
      var addItem = [];
      if (vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins === null) {
        vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins = [];
        vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins.push(addItem);
      } else {
        vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins.push(addItem);
      }
    },
    copyAllowOrigins(i, j){
      const vm = this;
      let copyItem = JSON.parse(JSON.stringify(vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins[j]));
      vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins.push(copyItem);
    },
    deleteAllowOrigins(i, j){
      const vm = this;
      vm.istioDefDefForm[i].httpSettings.corsPolicy.allowOrigins.splice(j, 1);
    },
    closeYaml() {
      const vm = this;
      vm.$refs.monaco.monacoEditor.setValue('')
      vm.yamlDialog = false;
    },
    onCopy() {
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_success'))
    },
    onError() {
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed'))
    },
    chooseParams(e, i) {
      const vm = this;
      if (e === "deployOther") {
        if (
          vm.deployContainerDefForm[i].deployCommand === '' &&
          vm.deployContainerDefForm[i].deployEnvs === null &&
          vm.deployContainerDefForm[i].deployArgs === null &&
          vm.deployContainerDefForm[i].workingDir === '' &&
          vm.deployContainerDefForm[i].nodeSelector === null &&
          vm.deployContainerDefForm[i].nodeName === '' &&
          vm.deployContainerDefForm[i].terminationGracePeriodSeconds === 0 &&
          vm.deployContainerDefForm[i].subdomain === '' &&
          vm.deployContainerDefForm[i].enableDownwardApi === false &&
          vm.deployContainerDefForm[i].restartPolicy === '' &&
          vm.deployContainerDefForm[i].deploySessionAffinityTimeoutSeconds === 0 &&
          vm.deployContainerDefForm[i].deployHeadless === false &&
          vm.deployContainerDefForm[i].podManagementPolicy === ''
        ) {
          vm.deployContainerDefForm[i].deployEnvs = [["", ""]];
        }
      } else if (e === "job") {
        if (
          vm.deployContainerDefForm[i].job.completions === 0 &&
          vm.deployContainerDefForm[i].job.parallelism === 0 &&
          vm.deployContainerDefForm[i].job.completionMode === '' &&
          vm.deployContainerDefForm[i].job.backoffLimit === 0 &&
          vm.deployContainerDefForm[i].job.activeDeadlineSeconds === 0 &&
          vm.deployContainerDefForm[i].job.ttlSecondsAfterFinished === 0
        ) {
          vm.deployContainerDefForm[i].job.completions = 1
          vm.deployContainerDefForm[i].job.parallelism = 1
          vm.deployContainerDefForm[i].job.completionMode = 'NonIndexed'
          vm.deployContainerDefForm[i].restartPolicy = 'Never'
        }
      } else if (e === "cronJob") {
        if (
          vm.deployContainerDefForm[i].job.completions === 0 &&
          vm.deployContainerDefForm[i].job.parallelism === 0 &&
          vm.deployContainerDefForm[i].job.completionMode === '' &&
          vm.deployContainerDefForm[i].job.backoffLimit === 0 &&
          vm.deployContainerDefForm[i].job.activeDeadlineSeconds === 0 &&
          vm.deployContainerDefForm[i].job.ttlSecondsAfterFinished === 0
        ) {
          vm.deployContainerDefForm[i].job.completions = 1
          vm.deployContainerDefForm[i].job.parallelism = 1
          vm.deployContainerDefForm[i].job.completionMode = 'NonIndexed'
          vm.deployContainerDefForm[i].restartPolicy = 'Never'
        }
        if (
          vm.deployContainerDefForm[i].cronJob.schedule === '' &&
          vm.deployContainerDefForm[i].cronJob.concurrencyPolicy === '' &&
          vm.deployContainerDefForm[i].cronJob.startingDeadlineSeconds === 0 &&
          vm.deployContainerDefForm[i].cronJob.successfulJobsHistoryLimit === 0 &&
          vm.deployContainerDefForm[i].cronJob.failedJobsHistoryLimit === 0
        ) {
          vm.deployContainerDefForm[i].cronJob.schedule = '30 5 15 1 *'
          vm.deployContainerDefForm[i].cronJob.concurrencyPolicy = 'Allow'
        }
      } else if (e === "deployMeta") {
        if (
          vm.deployContainerDefForm[i].deployMeta.labels === null &&
          vm.deployContainerDefForm[i].deployMeta.annotations === null
        ) {
          vm.deployContainerDefForm[i].deployMeta.labels = [{name: '', value: ''}];
          vm.deployContainerDefForm[i].deployMeta.annotations = [{name: '', value: ''}];
        }
      } else if (e === "patches") {
        if (
          vm.deployContainerDefForm[i].patches === null
        ) {
          vm.deployContainerDefForm[i].patches = [{resourceKind: '', path: '', content: ''}];
        }
      } else if (e === "deployLocalPorts" || e === "deployNodePorts") {
        if (
          vm.deployContainerDefForm[i].deployNodePorts === null &&
          vm.deployContainerDefForm[i].deployLocalPorts === null
        ) {
          vm.deployContainerDefForm[i][e] = [];
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_conflict'));
        }
      } else if (e === "securityContext") {
        if (
          vm.deployContainerDefForm[i].securityContext.runAsUser == 0 &&
          vm.deployContainerDefForm[i].securityContext.runAsGroup == 0
        ) {
          vm.deployContainerDefForm[i].securityContext = {
            runAsUser: 1000,
            runAsGroup: 0,
          };
        }
      } else if (e === "deployHealthCheck") {
        if (
          vm.deployContainerDefForm[i].deployHealthCheck.livenessDelaySeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.livenessPeriodSeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.readinessDelaySeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.readinessPeriodSeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.startupDelaySeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.startupPeriodSeconds === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.checkPort === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.exec === "" &&
          vm.deployContainerDefForm[i].deployHealthCheck.httpGet.port === 0 &&
          vm.deployContainerDefForm[i].deployHealthCheck.httpGet.path === "" &&
          vm.deployContainerDefForm[i].deployHealthCheck.httpGet.scheme === "" &&
          vm.deployContainerDefForm[i].deployHealthCheck.httpGet.httpHeaders === null
        ) {
          vm.deployContainerDefForm[i].deployHealthCheck.readinessDelaySeconds = 15;
          vm.deployContainerDefForm[i].deployHealthCheck.readinessPeriodSeconds = 5;
          vm.deployContainerDefForm[i].deployHealthCheck.livenessDelaySeconds = 60;
          vm.deployContainerDefForm[i].deployHealthCheck.livenessPeriodSeconds = 30;
          vm.deployContainerDefForm[i].deployHealthCheck.startupDelaySeconds = 0;
          vm.deployContainerDefForm[i].deployHealthCheck.startupPeriodSeconds = 0;
        }
      } else if (e === "lifecycle") {
        if (
          vm.deployContainerDefForm[i].lifecycle.postStart.exec === '' &&
          vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.port === 0 &&
          vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.httpHeaders === null &&
          vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.path === '' &&
          vm.deployContainerDefForm[i].lifecycle.postStart.httpGet.scheme === '' &&
          vm.deployContainerDefForm[i].lifecycle.preStop.exec === '' &&
          vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.port === 0 &&
          vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.httpHeaders === null &&
          vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.path === '' &&
          vm.deployContainerDefForm[i].lifecycle.preStop.httpGet.scheme === ''
        ) {
          vm.deployContainerDefForm[i].lifecycle.postStart.exec = "cat /etc/hosts";
        }
      } else if (e === "hpaConfig") {
        if (
          vm.deployContainerDefForm[i].hpaConfig.cpuAverageRequestPercent === 0 ||
          vm.deployContainerDefForm[i].hpaConfig.maxReplicas === 0 ||
          vm.deployContainerDefForm[i].hpaConfig.memoryAverageRequestPercent === 0 ||
          vm.deployContainerDefForm[i].hpaConfig.cpuAverageValue === "" ||
          vm.deployContainerDefForm[i].hpaConfig.memoryAverageValue === ""
        ) {
          vm.deployContainerDefForm[i].hpaConfig.maxReplicas = 1;
        }
      } else if (e === "deployResources") {
        if (
            vm.deployContainerDefForm[i].deployResources.cpuLimit === '' &&
            vm.deployContainerDefForm[i].deployResources.cpuRequest === '' &&
            vm.deployContainerDefForm[i].deployResources.memoryLimit === '' &&
            vm.deployContainerDefForm[i].deployResources.memoryRequest === '' &&
            vm.deployContainerDefForm[i].deployResources.extraRequest === null &&
            vm.deployContainerDefForm[i].deployResources.extraLimit === null
          ) {
          vm.deployContainerDefForm[i].deployResources = {
            memoryRequest: "10Mi",
            memoryLimit: "100Mi",
            cpuRequest: "10m",
            cpuLimit: "100m",
          };
        }
      }else if(e === 'deployPorts'){
        if (
            vm.deployContainerDefForm[i].deployNodePorts === null &&
            vm.deployContainerDefForm[i].deployLocalPorts === null
          ) {
          vm.deployContainerDefForm[i].deployNodePorts = []
        }
      } else {
        if (vm.deployContainerDefForm[i][e] === null) {
          if (
            e === "deployVolumes" ||
            e === "dependServices" ||
            e === "hostAliases" ||
            e === "deployConfigSettings" ||
            e === "deployConfigMaps" ||
            e === "deploySecrets"
          ) {
            vm.deployContainerDefForm[i][e] = [];
          } else {
            vm.deployContainerDefForm[i][e] = {};
          }
        }
      }
      vm.timer = setTimeout(() => {
        document.querySelector("#" + e + "-" + i).scrollIntoView(true);
      }, 500);
    },
    chooseDeployType(e, i) {
      const vm = this
      if (e === 'job') {
        vm.chooseParams('job', i)
        vm.clearParams(i, 'cronJob')
      } else if (e === 'cronjob') {
        vm.chooseParams('job', i)
        vm.chooseParams('cronJob', i)
      } else if (e === 'deployment' || e === 'statefulset') {
        vm.clearParams(i, 'job')
        vm.clearParams(i, 'cronJob')
        vm.deployContainerDefForm[i].restartPolicy = ''
      }
    },
    healthCheckChange(e, i) {
      const vm = this;
      if (e === "checkPort") {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].deployHealthCheck.exec = ""
        vm.deployContainerDefForm[i].deployHealthCheck.checkPort = 8080
      } else if (e === "exec") {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].deployHealthCheck.exec = "cat /etc/hosts"
        vm.deployContainerDefForm[i].deployHealthCheck.checkPort = 0
      } else if (e === "httpGet") {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].deployHealthCheck.exec = ""
        vm.deployContainerDefForm[i].deployHealthCheck.checkPort = 0
      } else {
        vm.deployContainerDefForm[i].deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].deployHealthCheck.exec = ""
        vm.deployContainerDefForm[i].deployHealthCheck.checkPort = 0
      }
    },
    healthCheckInit(index) {
      const vm = this
      if (vm.deployContainerDefForm[index].deployHealthCheck.checkPort !== 0) {
        return 'checkPort'
      } else if (vm.deployContainerDefForm[index].deployHealthCheck.exec !== '') {
        return 'exec'
      } else if (vm.deployContainerDefForm[index].deployHealthCheck.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    lifecyclePostStartChange(e, i) {
      const vm = this;
      if (e === "exec") {
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.postStart.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.postStart.exec = ""
      } else {
        vm.deployContainerDefForm[i].lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.postStart.exec = ""
      }
    },
    lifecyclePostStartInit(index) {
      const vm = this
      if (vm.deployContainerDefForm[index].lifecycle.postStart.exec !== '') {
        return 'exec'
      } else if (vm.deployContainerDefForm[index].lifecycle.postStart.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    lifecyclePreStopChange(e, i) {
      const vm = this;
      if (e === "exec") {
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.preStop.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.preStop.exec = ""
      } else {
        vm.deployContainerDefForm[i].lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.deployContainerDefForm[i].lifecycle.preStop.exec = ""
      }
    },
    lifecyclePreStopInit(index) {
      const vm = this
      if (vm.deployContainerDefForm[index].lifecycle.preStop.exec !== '') {
        return 'exec'
      } else if (vm.deployContainerDefForm[index].lifecycle.preStop.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''
    },
    changePortSet(e, i) {
      const vm = this;
      if(e === 'deployNodePorts'){
        vm.deployContainerDefForm[i].deployNodePorts = []
        vm.deployContainerDefForm[i].deployLocalPorts = null
      }else{
        vm.deployContainerDefForm[i].deployNodePorts = null
        vm.deployContainerDefForm[i].deployLocalPorts = []
      }
    },
    chooseGateway(i) {
      const vm = this
      if(vm.istioDefDefForm[i].httpSettings.gateway.rewriteUri !== ''){
        return 'rewriteUri'
      }else if(vm.istioDefDefForm[i].httpSettings.gateway.matchUris !== null){
        return 'matchUris'
      }else{
        return 'matchDefault'
      }
    },
    switchGateway(e, i) {
      const vm = this
      if(e === 'rewriteUri'){
        vm.istioDefDefForm[i].httpSettings.gateway.rewriteUri = null
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris = null
        vm.istioDefDefForm[i].httpSettings.gateway.matchDefault = false
      }else if(e === 'matchUris'){
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris = []
        vm.istioDefDefForm[i].httpSettings.gateway.rewriteUri = ''
        vm.istioDefDefForm[i].httpSettings.gateway.matchDefault = false
      }else {
        vm.istioDefDefForm[i].httpSettings.gateway.rewriteUri = ''
        vm.istioDefDefForm[i].httpSettings.gateway.matchUris = null
        vm.istioDefDefForm[i].httpSettings.gateway.matchDefault = true
      }
    },
    switchLoadBalancer(e, i) {
      const vm = this
      if(e === 'simple'){
        vm.istioDefDefForm[i].httpSettings.loadBalancer.simple = 'ROUND_ROBIN'
        vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash = {
          httpCookie: {
            name: '',
            path: '',
            ttl: ''
          },
          httpHeaderName: '',
          httpQueryParameterName: '',
          useSourceIp: ''
        }
      }else{
        vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.useSourceIp = false
        vm.istioDefDefForm[i].httpSettings.loadBalancer.simple = ''
      }
    },
    consistentHashValue(i) {
      const vm = this
      if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpHeaderName !== ''){
        return 'httpHeaderName'
      }else if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.useSourceIp !== ''){
        return 'useSourceIp'
      }else if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpQueryParameterName !== ''){
        return 'httpQueryParameterName'
      }else{
        return 'httpCookie'
      }
    },
    switchConsistentHash(e, i) {
      const vm = this
      if(e === 'httpCookie'){
        if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie.name === '' && vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie.path === '' && vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie.ttl === ''){
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie = {
            name: null,
            path: null,
            ttl: null
          }
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpHeaderName = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.useSourceIp = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpQueryParameterName = ''
        }
      }else if(e === 'httpHeaderName'){
        if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] === ''){
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] = null
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.useSourceIp = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpQueryParameterName = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie = {
            name: '',
            path: '',
            ttl: ''
          }
        }
      }else if(e === 'useSourceIp'){
        if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] === ''){
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] = true
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpHeaderName = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpQueryParameterName = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie = {
            name: '',
            path: '',
            ttl: ''
          }
        }
      }else if(e === 'httpQueryParameterName'){
        if(vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] === ''){
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash[e] = null
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpHeaderName = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.useSourceIp = ''
          vm.istioDefDefForm[i].httpSettings.loadBalancer.consistentHash.httpCookie = {
            name: '',
            path: '',
            ttl: ''
          }
        }
      }
    },
    chooseHttpSettings(e, i) {
      const vm = this
      if(e === 'matchHeaders'){
        if(vm.istioDefDefForm[i].httpSettings[e] === null){
          vm.istioDefDefForm[i].httpSettings[e] = []
        }
      }else if(e === 'timeout'){
        if(vm.istioDefDefForm[i].httpSettings.timeout === ''){
          vm.istioDefDefForm[i].httpSettings.timeout = null
        }
      }else if(e === 'retries'){
        if(vm.istioDefDefForm[i].httpSettings.retries.attempts === 0 && vm.istioDefDefForm[i].httpSettings.retries.perTryTimeout === '' && vm.istioDefDefForm[i].httpSettings.retries.retryOn.length === 0){
          vm.istioDefDefForm[i].httpSettings.retries.attempts = ''
          vm.istioDefDefForm[i].httpSettings.retries.perTryTimeout = null
        }
      }else if(e === 'mirror'){
        if(vm.istioDefDefForm[i].httpSettings.mirror.host === '' && vm.istioDefDefForm[i].httpSettings.mirror.port === 0 && vm.istioDefDefForm[i].httpSettings.mirror.subset === '' && vm.istioDefDefForm[i].httpSettings.mirror.mirrorPercent === 0){
          vm.istioDefDefForm[i].httpSettings.mirror.host = null
          vm.istioDefDefForm[i].httpSettings.mirror.port = null
        }
      }else if(e == 'connectionPool'){
        if(vm.istioDefDefForm[i].httpSettings.connectionPool.http.http1MaxPendingRequests === 0 && vm.istioDefDefForm[i].httpSettings.connectionPool.http.http2MaxRequests === 0 && vm.istioDefDefForm[i].httpSettings.connectionPool.http.maxRequestsPerConnection === 0 && vm.istioDefDefForm[i].httpSettings.connectionPool.http.maxRetries === 0 && vm.istioDefDefForm[i].httpSettings.connectionPool.http.idleTimeout === '' && vm.istioDefDefForm[i].httpSettings.connectionPool.tcp.maxConnections === 0 && vm.istioDefDefForm[i].httpSettings.connectionPool.tcp.connectTimeout === ''){
          vm.istioDefDefForm[i].httpSettings.connectionPool.http.http1MaxPendingRequests = 1
        }
      }else if(e === 'outlierDetection'){
        if(vm.istioDefDefForm[i].httpSettings.outlierDetection.consecutiveGatewayErrors === 0 && vm.istioDefDefForm[i].httpSettings.outlierDetection.consecutive5xxErrors === 0 && vm.istioDefDefForm[i].httpSettings.outlierDetection.maxEjectionPercent === 0 && vm.istioDefDefForm[i].httpSettings.outlierDetection.minHealthPercent === 0 && vm.istioDefDefForm[i].httpSettings.outlierDetection.interval === '' && vm.istioDefDefForm[i].httpSettings.outlierDetection.baseEjectionTime === ''){
          vm.istioDefDefForm[i].httpSettings.outlierDetection.interval = '10s'
          vm.istioDefDefForm[i].httpSettings.outlierDetection.baseEjectionTime = '30s'
          vm.istioDefDefForm[i].httpSettings.outlierDetection.maxEjectionPercent = 10
        }
      }else if(e === 'gateway'){
        if(vm.istioDefDefForm[i].httpSettings.gatewayFlag === false){
          vm.istioDefDefForm[i].httpSettings.gatewayFlag = true
        }
      }else if(e === 'corsPolicy'){
        if(vm.istioDefDefForm[i].httpSettings.corsPolicyFlag === false){
          vm.istioDefDefForm[i].httpSettings.corsPolicyFlag = true
        }
      }else if(e === 'loadBalancer'){
        if(vm.istioDefDefForm[i].httpSettings.loadBalancerFlag === false){
          vm.istioDefDefForm[i].httpSettings.loadBalancerFlag = true
        }
      }
      vm.$forceUpdate()
      vm.timer = setTimeout(() => {
        document.querySelector("#" + e + "-" + i).scrollIntoView(true);
      }, 500);
    },
    claerHttpSettings(i, name){
      const vm = this
      if(name === 'matchHeaders'){
        vm.istioDefDefForm[i].httpSettings.matchHeaders = null
      }else if(name === 'timeout'){
        vm.istioDefDefForm[i].httpSettings.timeout = ''
      }else if(name === 'retries'){
        vm.istioDefDefForm[i].httpSettings.retries = {
          attempts: 0,
          perTryTimeout: '',
          retryOn: []
        }
      }else if(name === 'mirror'){
        vm.istioDefDefForm[i].httpSettings.mirror = {
          host: '',
          mirrorPercent: 0,
          port: 0,
          subset: ''
        }
      }else if(name === 'connectionPool'){
        vm.istioDefDefForm[i].httpSettings.connectionPool = {
          http: {
            http1MaxPendingRequests: 0,
            http2MaxRequests: 0,
            idleTimeout: '',
            maxRequestsPerConnection: 0,
            maxRetries: 0
          },
          tcp: {
            maxConnections: 0,
            connectTimeout: ''
          }
        }
      }else if(name === 'outlierDetection'){
        vm.istioDefDefForm[i].httpSettings.outlierDetection = {
          consecutive5xxErrors: 0,
          consecutiveGatewayErrors: 0,
          maxEjectionPercent: 0,
          minHealthPercent: 0,
          baseEjectionTime: '',
          interval: '',
        }
      }else if(name === 'gateway'){
        vm.istioDefDefForm[i].httpSettings.gatewayFlag = false
      }else if(name === 'corsPolicy'){
        vm.istioDefDefForm[i].httpSettings.corsPolicyFlag = false
      }else if(name === 'loadBalancer'){
        vm.istioDefDefForm[i].httpSettings.loadBalancerFlag = false
      }
      vm.$forceUpdate()
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
    customOpsDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    opsBatchDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    buildDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    packageDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    artifactDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
      // let copyData = JSON.parse(JSON.stringify(vm.artifactDefForm))
      // copyData.map((item) => {
      //   item.artifacts.map((row, index) => {
      //     row = row.join(":");
      //     item.artifacts[index] = row;
      //   });
      // });
      // vm.original = YAML.stringify(copyData, 4)
      // vm.modified = YAML.stringify(copyData, 4)
      // if(vm.$refs.monacoDiff){
      //   vm.$refs.monacoDiff.originalModel.setValue(vm.original)
      //   vm.$refs.monacoDiff.modifiedModel.setValue(vm.modified)
      // }
    },
    dockerIgnoreDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
      // let copyData = JSON.parse(JSON.stringify(vm.dockerIgnoreDefForm))
      // copyData = vm.formateText(copyData);
      // vm.original = YAML.stringify(copyData, 4)
      // vm.modified = YAML.stringify(copyData, 4)
      // if(vm.$refs.monacoDiff){
      //   vm.$refs.monacoDiff.originalModel.setValue(vm.original)
      //   vm.$refs.monacoDiff.modifiedModel.setValue(vm.modified)
      // }
    },
    customStepDefsHistory(defName, customStepName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: '',
        customStepName: customStepName,
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
      // let copyData = JSON.parse(JSON.stringify(vm.customStepDefForm.customStepDef))
      // if(!vm.manualEnableFlag){
      //   copyData.customStepModuleDefs.forEach(item => {
      //     delete item.manualEnable
      //   })
      // }
      // if(!vm.relatedStepModulesFlag){
      //   copyData.customStepModuleDefs.forEach(item => {
      //     delete item.relatedStepModules
      //   })
      // }
      // vm.original = YAML.stringify(copyData, 4)
      // vm.modified = YAML.stringify(copyData, 4)
      // if(vm.$refs.monacoDiff){
      //   vm.$refs.monacoDiff.originalModel.setValue(vm.original)
      //   vm.$refs.monacoDiff.modifiedModel.setValue(vm.modified)
      // }
    },
    deployContainerDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: vm.targetEnvName,
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    deployArtifactDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: vm.targetEnvName,
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    istioDefsHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: vm.targetEnvName,
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    istioGatewayDefHistory(defName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: vm.targetEnvName,
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    customStepDefsEnvHistory(defName, customStepName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: '',
        envName: vm.targetEnvName,
        customStepName: customStepName,
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    pipelineDefHistory(defName, branchName) {
      const vm = this
      vm.targetDefName = defName
      vm.historyForm = {
        defName: defName,
        branchName: branchName,
        envName: '',
        customStepName: '',
        createTimeRange: {
          startDate: '',
          endDate: ''
        }
      }
      vm.dates = []
      vm.getHistory()
      vm.historyDialog = true
    },
    updateDef() {
      const vm = this
      if(vm.modified !== ''){
        if(vm.targetDefName === 'customOpsDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/customOpsDefs`,{
            customOpsDefsYaml: vm.modified
          }).then(response => {
            vm.historyDialog = false
            vm.customOpsDefsDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'buildDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/buildDefs`,{
            buildDefsYaml: vm.modified
          }).then(response => {
            vm.historyDialog = false
            vm.buildDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'packageDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/packageDefs`,{
            packageDefsYaml: vm.modified
          }).then(response => {
            vm.historyDialog = false
            vm.packageDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'artifactDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/artifactDefs`,{
            artifactDefsYaml: vm.modified
          }).then(response => {
            vm.historyDialog = false
            vm.artifactDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'dockerIgnoreDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/dockerIgnoreDefs`,{
            dockerIgnoreDefsYaml: vm.modified
          }).then(response => {
            vm.historyDialog = false
            vm.dockerIgnoreDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'customStepDefs'){
          if(vm.historyForm.envName === ''){
            request.post(`/cicd/projectDef/${vm.targetProjectName}/customStepDef`,{
              customStepName: vm.targetCustomStepName,
              customStepDefYaml: vm.modified
            }).then(response => {
              vm.historyDialog = false
              vm.customStepDefDialog = false
              vm.successTip(true, response.msg);
              vm.refresh();
            }).catch(error => {
              vm.errorTip(true, error.response.data.msg);
            })
          }else{
            request.post(`/cicd/projectDef/${vm.targetProjectName}/customStepDef/env`,{
              customStepName: vm.targetCustomStepName,
              envName: vm.targetEnvName,
              customStepDefYaml: vm.modified
            }).then(response => {
              vm.historyDialog = false
              vm.customStepEnvDefDialog = false
              vm.successTip(true, response.msg);
              vm.refresh();
            }).catch(error => {
              vm.errorTip(true, error.response.data.msg);
            })
          }
        }
        if(vm.targetDefName === 'deployContainerDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/deployContainerDefs`,{
            deployContainerDefsYaml: vm.modified,
            envName: vm.targetEnvName
          }).then(response => {
            vm.historyDialog = false
            vm.deployContainerDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'deployArtifactDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/deployArtifactDefs`,{
            deployArtifactDefsYaml: vm.modified,
            envName: vm.targetEnvName
          }).then(response => {
            vm.historyDialog = false
            vm.deployArtifactDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'istioDefs'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/istioDefs`,{
            istioDefsYaml: vm.modified,
            envName: vm.targetEnvName
          }).then(response => {
            vm.historyDialog = false
            vm.istioDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'istioGatewayDef'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/istioGatewayDef`,{
            istioGatewayDefYaml: vm.modified,
            envName: vm.targetEnvName
          }).then(response => {
            vm.historyDialog = false
            vm.istioGatewayDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
        if(vm.targetDefName === 'pipelineDef'){
          request.post(`/cicd/projectDef/${vm.targetProjectName}/pipelineDef`,{
            pipelineDefYaml: vm.modified,
            branchName: vm.targetBranchName
          }).then(response => {
            vm.historyDialog = false
            vm.pipelineDefDialog = false
            vm.successTip(true, response.msg);
            vm.refresh();
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg);
          })
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_no_history_records'))
      }
    },
    historyClose() {
      const vm = this
      vm.historyDialog = false
      vm.dates = []
      vm.contentForm.commitHash = ''
      vm.original = ''
      vm.modified = ''
      vm.$refs.monacoDiff.originalModel.setValue('')
      vm.$refs.monacoDiff.modifiedModel.setValue('')
    },
    getHistory() {
      const vm = this
      var dates = vm.dates.sort()
      vm.historyForm.createTimeRange.startDate = dates[0]
      vm.historyForm.createTimeRange.endDate = dates[1]
      vm.menu2 = false
      request.post(`/cicd/projectDef/${vm.targetProjectName}/history`, vm.historyForm).then(response => {
        vm.commitHashList = response.data.logs
        if(vm.commitHashList.length > 0){
          vm.getOriginal()
          vm.getModified()
        }else{
          vm.original = ''
          vm.modified = ''
          vm.$refs.monacoDiff.originalModel.setValue('')
          vm.$refs.monacoDiff.modifiedModel.setValue('')
        }
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg);
      })
    },
    getOriginal() {
      const vm = this
      vm.contentForm.defName = vm.historyForm.defName
      vm.contentForm.branchName = vm.historyForm.branchName
      vm.contentForm.envName = vm.historyForm.envName
      vm.contentForm.customStepName = vm.historyForm.customStepName
      if(vm.commitHashList.length > 0){
        vm.contentForm.commitHash = vm.commitHashList[0].commitHash
        vm.commitHashList[0].disabled = true
      }
      vm.dialogLoading = true
      request.post(`/cicd/projectDef/${vm.targetProjectName}/content`, vm.contentForm).then(response => {
        vm.original = response.data.content
        vm.dialogLoading = false
        vm.$refs.monacoDiff.originalModel.setValue(vm.original)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg);
      })
    },
    getModified() {
      const vm = this
      vm.contentForm.defName = vm.historyForm.defName
      vm.contentForm.branchName = vm.historyForm.branchName
      vm.contentForm.envName = vm.historyForm.envName
      vm.contentForm.customStepName = vm.historyForm.customStepName
      if(vm.commitHashList.length > 1){
        vm.contentForm.commitHash = vm.commitHashList[1].commitHash
      }
      vm.dialogLoading = true
      request.post(`/cicd/projectDef/${vm.targetProjectName}/content`, vm.contentForm).then(response => {
        vm.modified = response.data.content
        vm.dialogLoading = false
        vm.$refs.monacoDiff.modifiedModel.setValue(vm.modified)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg);
      })
    },
    getHistoryContent() {
      const vm = this
      vm.contentForm.defName = vm.historyForm.defName
      vm.contentForm.branchName = vm.historyForm.branchName
      vm.contentForm.envName = vm.historyForm.envName
      vm.contentForm.customStepName = vm.historyForm.customStepName
      vm.dialogLoading = true
      request.post(`/cicd/projectDef/${vm.targetProjectName}/content`, vm.contentForm).then(response => {
        vm.modified = response.data.content
        vm.dialogLoading = false
        vm.$refs.monacoDiff.originalModel.setValue(vm.original)
        vm.$refs.monacoDiff.modifiedModel.setValue(vm.modified)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg);
      })
    },
    clearDates() {
      this.dates = []
      this.menu2 = false
      this.getHistory()
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
  }
}
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
