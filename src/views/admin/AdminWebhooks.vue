<template>
  <div>
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_menu_admin_webhook_settings')">
      <v-card>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_menu_admin_webhook')}}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="openAdminWebhookAdd()">{{ $vuetify.lang.t('$vuetify.lang_menu_add_admin_webhook') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="adminWebhooksHeaders"
            :items="adminWebhooksData"
            item-key="index"
            :loading="tableLoading"
            hide-default-footer
          >
            <template v-slot:item.handle="{ item }">
              <Operations
                :operations="[
                  { text: $vuetify.lang.t('$vuetify.lang_menu_update_admin_webhook'), onClick: () => {openAdminWebhookUpdate(item)} },
                  { text: $vuetify.lang.t('$vuetify.lang_menu_copy_admin_webhook'), onClick: () => {openAdminWebhookCopy(item)} },
                  { text: $vuetify.lang.t('$vuetify.lang_menu_delete_admin_webhook'), onClick: () => {openAdminWebhookDelete(item.adminWebhookID)} }
                ]"
              />
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_menu_admin_webhook_logs')}}
        </v-card-title>
        <v-card-title>
          <v-form ref="form">
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="adminActions || []"
                :label="$vuetify.lang.t('$vuetify.lang_view_admin_webhook_admin_action')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="adminWebhookLogsForm.adminActions"
                @blur="getAdminWebhookLogs()"
              ></v-autocomplete>
              <v-autocomplete
                :items="[ 'SUCCESS', 'FAIL' ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="adminWebhookLogsForm.results"
                @blur="getAdminWebhookLogs()"
              ></v-autocomplete>
              <v-autocomplete
                :items="tenantCodes"
                :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
                dense
                small-chips
                multiple
                class="mr-8"
                v-model="adminWebhookLogsForm.tenantCodes"
                @change="getAdminWebhookLogs()"
              ></v-autocomplete>
              <template>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      :label="$vuetify.lang.t('$vuetify.lang_form_start_time')"
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
              <v-autocomplete
                :items="[
                  { value: 'createTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                  { value: 'createTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
                class="mr-8"
                clearable
                dense
                v-model="adminWebhookLogsForm.sortMode"
                @change="getAdminWebhookLogs()"
              ></v-autocomplete>
            </v-container>
          </v-form>
        </v-card-title>
        <v-card-text>
          <AdminWebhookLogs
            :adminWebhookLogs="adminWebhookLogsData.adminWebhookLogs"
            :server-items-length="adminWebhookLogsData.totalCount"
            :loading="tableLoading2"
            :footerProps="{
              showCurrentPage: true,
              itemsPerPageOptions: [ 5, 10, 15, 20 ]
            }"
            :expanded.sync="expanded"
            :options="{
              page: adminWebhookLogsForm.page,
              itemsPerPage: adminWebhookLogsForm.perPage
            }"
            @update:options="(value) => {
              adminWebhookLogsForm.page = value.page
              adminWebhookLogsForm.perPage = value.itemsPerPage
              getAdminWebhookLogs()
            }"
          />
        </v-card-text>
      </v-card>
      <v-dialog
        v-model="addAdminWebhookDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_add_admin_webhook')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="varsDialog = true">mdi-progress-question</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_variables_desc')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="adminWebhookAdd()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="primary" 
                  class="mr-4" 
                  v-bind="attrs" 
                  v-on="on" 
                  @click="() => {
                    addAdminWebhookDialog = false
                  }"
                >mdi-close</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}</div>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_prompt')}}</small>
            </v-alert>
            <v-form ref="addAdminWebhookRef">
              <v-container>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_admin_action')"
                        dense
                        :items="adminActions"
                        v-model="addAdminWebhookForm.adminAction"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_admin_action_tip_1')"
                        persistent-hint
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_enable')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addAdminWebhookForm.enable"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_enable_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                        v-model="addAdminWebhookForm.tenantCode"
                        :items="tenantCodes"
                        :required="userObj.isTenantAdmin && !userObj.isAdmin"
                        :clearable="userObj.isAdmin"
                        dense
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_url')}}</small>
                      <v-text-field
                        dense
                        v-model="addAdminWebhookForm.webhookUrl"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_url_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_insecure')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        v-model="addAdminWebhookForm.insecure"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_insecure_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_method')}}</small>
                      <v-autocomplete
                        dense
                        :items="httpMethods"
                        v-model="addAdminWebhookForm.webhookMethod"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_method_tip_1')"
                        persistent-hint
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookHeadersAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addAdminWebhookForm.webhookHeaders" :key="i" v-if="addAdminWebhookForm.webhookHeaders">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookHeadersAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookQueryParamsAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addAdminWebhookForm.webhookQueryParams" :key="i" v-if="addAdminWebhookForm.webhookQueryParams">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookQueryParamsAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookFormsAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addAdminWebhookForm.webhookForms" :key="i" v-if="addAdminWebhookForm.webhookForms">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookFormsAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_body')}}</small>
                      <v-textarea
                        v-model="addAdminWebhookForm.webhookBody"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_body_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
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
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateAdminWebhookDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_update_admin_webhook')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="varsDialog = true">mdi-progress-question</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_variables_desc')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="adminWebhookUpdate()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="primary" 
                  class="mr-4" 
                  v-bind="attrs" 
                  v-on="on" 
                  @click="() => {
                    updateAdminWebhookDialog = false
                  }"
                >mdi-close</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}</div>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_prompt')}}</small>
            </v-alert>
            <v-form ref="updateAdminWebhookRef">
              <v-container>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_admin_action')"
                        dense
                        :items="adminActions"
                        v-model="updateAdminWebhookForm.adminAction"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_admin_action_tip_1')"
                        persistent-hint
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_enable')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateAdminWebhookForm.enable"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_enable_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                        v-model="updateAdminWebhookForm.tenantCode"
                        :items="tenantCodes"
                        dense
                        clearable
                        disabled
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_url')}}</small>
                      <v-text-field
                        dense
                        v-model="updateAdminWebhookForm.webhookUrl"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_url_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_insecure')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        v-model="updateAdminWebhookForm.insecure"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_insecure_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_method')}}</small>
                      <v-autocomplete
                        dense
                        :items="httpMethods"
                        v-model="updateAdminWebhookForm.webhookMethod"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_method_tip_1')"
                        persistent-hint
                        required
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookHeadersUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateAdminWebhookForm.webhookHeaders" :key="i" v-if="updateAdminWebhookForm.webhookHeaders">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_headers_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookHeadersUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookQueryParamsUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateAdminWebhookForm.webhookQueryParams" :key="i" v-if="updateAdminWebhookForm.webhookQueryParams">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_query_params_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookQueryParamsUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookFormsUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateAdminWebhookForm.webhookForms" :key="i" v-if="updateAdminWebhookForm.webhookForms">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_forms_value')"
                            dense
                            v-model="item.value"
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
                          <v-icon color="error" class="mt-4" @click="deleteWebhookFormsUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_body')}}</small>
                      <v-textarea
                        v-model="updateAdminWebhookForm.webhookBody"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_admin_webhook_webhook_body_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
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
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteAdminWebhookDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_admin_webhook')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_admin_webhook_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_admin_webhook_tip_1')}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.deleteAdminWebhookDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="adminWebhookDelete()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="varsDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_admin_webhook_variables_desc')}}</span>
            <v-spacer></v-spacer>
            <v-icon class="ml-4" @click="() => {
              this.varsDialog = false
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <Monaco
              :monacoOptions="markdownMonacoOptions"
              :height="600"
            ></Monaco>
          </v-card-text>
        </v-card>
      </v-dialog>
    </PageCard>
  </div>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import Operations from '@/lib/ui-lib/components/Operations'
import AdminWebhookLogs from '@/components/AdminWebhookLogs'
import request from '@/utils/request'
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  name: 'AdminWebhooks',
  components: {
    PageCard,
    Operations,
    AdminWebhookLogs,
    Monaco,
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  data () {
    return {
      userObj: {},
      userToken: '',
      addAdminWebhookDialog: false,
      updateAdminWebhookDialog: false,
      deleteAdminWebhookDialog: false,
      adminWebhookID: '',
      varsDialog: false,
      adminActions: [],
      httpMethods: [],
      markdownMonacoOptions: {
        value: '',
        automaticLayout: true,
        readOnly: true,
        theme: "vs-dark",
        language: "markdown"
      },
      addAdminWebhookForm: {
        adminAction: '',
        enable: true,
        tenantCode: '',
        webhookUrl: '',
        insecure: false,
        webhookMethod: '',
        webhookHeaders: [],
        webhookQueryParams: [],
        webhookForms: [],
        webhookBody: '',
      },
      updateAdminWebhookForm: {
        adminAction: '',
        enable: true,
        tenantCode: '',
        webhookUrl: '',
        insecure: false,
        webhookMethod: '',
        webhookHeaders: [],
        webhookQueryParams: [],
        webhookForms: [],
        webhookBody: '',
      },
      adminWebhooksData: [],
      adminWebhookLogsForm: {
        adminActions: [],
        results: [],
        tenantCodes: [],
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        sortMode: '',
        page: 1,
        perPage: 10
      },
      tenantCodes: [],
      adminWebhookLogsData: {},
      searchData: {},
      tableLoading: true,
      tableLoading2: true,
      expanded: [],
      dates: [],
      menu: false
    }
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    vm.userObj = JSON.parse(localStorage.getItem('userObj'))
    request.get('/admin/tenantCodes').then(response => {
      vm.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    vm.getAdminWebhooks()
    request.get('/public/about').then(response => {
      vm.httpMethods = response.data.httpMethods
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/admin/adminWebhookOptions').then(response => {
      vm.adminActions = response.data.adminActions
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/admin/adminWebhookVars').then(response => {
      vm.markdownMonacoOptions.value = response.data.content
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
  },
  methods: {
    getAdminWebhooks () {
      const vm = this
      vm.tableLoading = true
      request.get('admin/adminWebhooks').then(response => {
        vm.adminWebhooksData = response.data.adminWebhooks
        vm.tableLoading = false
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    getAdminWebhookLogs () {
      const vm = this
      vm.tableLoading2 = true
      var dates = vm.dates.sort()
      vm.adminWebhookLogsForm.createTimeRange.startDate = dates[0]
      vm.adminWebhookLogsForm.createTimeRange.endDate = dates[1]
      request.post('admin/adminWebhookLogs', vm.adminWebhookLogsForm).then(response => {
        vm.adminWebhookLogsData = response.data
        vm.tableLoading2 = false
      }).catch(error => {
        vm.tableLoading2 = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    addWebhookHeadersAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addAdminWebhookForm.webhookHeaders === null) {
        vm.addAdminWebhookForm.webhookHeaders = []
      }
      vm.addAdminWebhookForm.webhookHeaders.push(addItem)
    },
    deleteWebhookHeadersAddForm(j) {
      const vm = this;
      vm.addAdminWebhookForm.webhookHeaders.splice(j)
    },
    addWebhookQueryParamsAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addAdminWebhookForm.webhookQueryParams === null) {
        vm.addAdminWebhookForm.webhookQueryParams = []
      }
      vm.addAdminWebhookForm.webhookQueryParams.push(addItem)
    },
    deleteWebhookQueryParamsAddForm(j) {
      const vm = this;
      vm.addAdminWebhookForm.webhookQueryParams.splice(j)
    },
    addWebhookFormsAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addAdminWebhookForm.webhookForms === null) {
        vm.addAdminWebhookForm.webhookForms = []
      }
      vm.addAdminWebhookForm.webhookForms.push(addItem)
    },
    deleteWebhookFormsAddForm(j) {
      const vm = this;
      vm.addAdminWebhookForm.webhookForms.splice(j)
    },
    openAdminWebhookAdd() {
      const vm = this
      vm.addAdminWebhookDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addAdminWebhookForm.tenantCode = vm.tenantCodes[0]
      }
    },
    adminWebhookAdd () {
      const vm = this
      if(vm.$refs.addAdminWebhookRef.validate()){
        request.post(`/admin/adminWebhook`, vm.addAdminWebhookForm).then(response => {
          vm.successTip(true,response.msg)
          vm.getAdminWebhooks()
          vm.addAdminWebhookDialog = false
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAdminWebhookCopy(adminWebhook) {
      console.log(JSON.stringify(adminWebhook))
      const vm = this
      vm.addAdminWebhookDialog = true
      vm.addAdminWebhookForm = { ...adminWebhook }
      if (!vm.userObj.isAdmin) {
        vm.addAdminWebhookForm.tenantCode = vm.tenantCodes[0]
      }
    },
    openAdminWebhookUpdate(adminWebhook) {
      console.log(JSON.stringify(adminWebhook))
      const vm = this
      vm.adminWebhookID = adminWebhook.adminWebhookID
      vm.updateAdminWebhookDialog = true
      vm.updateAdminWebhookForm = { ...adminWebhook }
    },
    addWebhookHeadersUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateAdminWebhookForm.webhookHeaders === null) {
        vm.updateAdminWebhookForm.webhookHeaders = []
      }
      vm.updateAdminWebhookForm.webhookHeaders.push(addItem)
    },
    deleteWebhookHeadersUpdateForm(j) {
      const vm = this;
      vm.updateAdminWebhookForm.webhookHeaders.splice(j)
    },
    addWebhookQueryParamsUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateAdminWebhookForm.webhookQueryParams === null) {
        vm.updateAdminWebhookForm.webhookQueryParams = []
      }
      vm.updateAdminWebhookForm.webhookQueryParams.push(addItem)
    },
    deleteWebhookQueryParamsUpdateForm(j) {
      const vm = this;
      vm.updateAdminWebhookForm.webhookQueryParams.splice(j)
    },
    addWebhookFormsUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateAdminWebhookForm.webhookForms === null) {
        vm.updateAdminWebhookForm.webhookForms = []
      }
      vm.updateAdminWebhookForm.webhookForms.push(addItem)
    },
    deleteWebhookFormsUpdateForm(j) {
      const vm = this;
      vm.updateAdminWebhookForm.webhookForms.splice(j)
    },
    adminWebhookUpdate () {
      const vm = this
      if(vm.$refs.updateAdminWebhookRef.validate()){
        request.post(`/admin/adminWebhook/${vm.adminWebhookID}`, vm.updateAdminWebhookForm).then(response => {
          vm.successTip(true,response.msg)
          vm.getAdminWebhooks()
          vm.updateAdminWebhookDialog = false
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAdminWebhookDelete(adminWebhookID) {
      const vm = this
      vm.adminWebhookID = adminWebhookID
      vm.deleteAdminWebhookDialog = true
    },
    adminWebhookDelete () {
      const vm = this
      request.delete(`/admin/adminWebhook/${vm.adminWebhookID}`).then(response => {
        vm.successTip(true,response.msg)
        vm.getAdminWebhooks()
        vm.deleteAdminWebhookDialog = false
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    clearDates () {
      this.dates = []
      this.menu = false
      this.getAdminWebhookLogs()
    },
    dateRangeSubmit () {
      this.menu = false
      this.getAdminWebhookLogs()
    },
  },
  filters: {
    changeColor: function (value) {
      if(value == 'FAIL'){
        return {color: 'red'}
      }else if(value == 'INFO'){
        return {color: 'green'}
      }else{
        return null
      }
    },
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    adminWebhooksHeaders() {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_admin_action'), value: 'adminAction', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_enable'), value: 'enable', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_webhook_url'), value: 'webhookUrl', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_webhook_method'), value: 'webhookMethod', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_admin_webhook_username'), value: 'username', sortable: true },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
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
.form-item-15 {
  width: 15%;
}
.form-item-20 {
  width: 20%;
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

</style>
<style lang="scss" scoped>

</style>
