<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_users_management')">
    <v-card class="mb-4">
      <v-card-title>
        <v-form>
          <v-container class="d-flex flex-wrap">
            <v-autocomplete
              :items="userNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_username')"
              class="mr-8"
              dense
              v-model="usersForm.usernames"
              small-chips
              multiple
              @blur="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="projectNames"
              :label="$vuetify.lang.t('$vuetify.lang_form_project_name')"
              class="mr-8"
              dense
              v-model="usersForm.projectNames"
              small-chips
              multiple
              @blur="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="tenantCodes"
              :label="$vuetify.lang.t('$vuetify.lang_form_tenant_codes')"
              class="mr-8"
              dense
              v-model="usersForm.tenantCodes"
              small-chips
              multiple
              @blur="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="tenantCodes"
              :label="$vuetify.lang.t('$vuetify.lang_form_tenant_admins')"
              class="mr-8"
              dense
              v-model="usersForm.tenantAdmins"
              small-chips
              multiple
              @blur="getUsers()"
            ></v-autocomplete>
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_user_name')"
              class="mr-8"
              dense
              v-model="usersForm.name"
              @keydown.enter="getUsers()"
            />
            <v-text-field
              :label="$vuetify.lang.t('$vuetify.lang_form_mail')"
              class="mr-8"
              dense
              v-model="usersForm.mail"
              @keydown.enter="getUsers()"
            />
            <v-autocomplete
              :items="isAdmin"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_admin')"
              class="mr-8"
              clearable
              dense
              v-model="usersForm.admin"
              @change="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="isAdmin"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_tenant_admin')"
              class="mr-8"
              clearable
              dense
              v-model="usersForm.tenantAdmin"
              @change="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="isActive"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_active')"
              class="mr-8"
              clearable
              dense
              v-model="usersForm.active"
              @change="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="isMember"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_member')"
              class="mr-8"
              clearable
              dense
              v-model="usersForm.isMember"
              @change="getUsers()"
            ></v-autocomplete>
            <v-autocomplete
              :items="[
                { value: 'username', text: $vuetify.lang.t('$vuetify.lang_form_sort_username_asc') },
                { value: 'name', text: $vuetify.lang.t('$vuetify.lang_form_sort_user_name_asc') },
                { value: 'createTimeDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_desc') },
                { value: 'createTimeAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_create_time_asc') },
                { value: 'lastLoginDesc', text: $vuetify.lang.t('$vuetify.lang_form_sort_login_time_desc') },
                { value: 'lastLoginAsc', text: $vuetify.lang.t('$vuetify.lang_form_sort_login_time_asc') },
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_sort_type')"
              class="mr-8"
              clearable
              dense
              v-model="usersForm.sortMode"
              @change="getUsers()"
              @click:clear="getUsers()"
            ></v-autocomplete>
            <template>
              <v-menu
                v-model="menuCreateTime"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeTextCreateTime"
                    :label="$vuetify.lang.t('$vuetify.lang_form_create_time')"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    class="mr-8"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datesCreateTime"
                  range
                  no-title
                  @change="dateRangeSubmitCreateTime()"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    small
                    @click="clearDatesCreateTime()"
                  >
                    {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
            <template>
              <v-menu
                v-model="menuLastLogin"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeTextLastLogin"
                    :label="$vuetify.lang.t('$vuetify.lang_form_last_login')"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    class="mr-8"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datesLastLogin"
                  range
                  no-title
                  @change="dateRangeSubmitLastLogin()"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    small
                    @click="clearDatesLastLogin()"
                  >
                    {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
            <v-btn color="primary" @click.stop="openAddUser()">{{ $vuetify.lang.t('$vuetify.lang_menu_new_user') }}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pipelineHeaders"
          :items="usersData.users"
          :single-expand="false"
          :page="usersForm.page"
          :items-per-page="usersForm.perPage"
          :server-items-length="usersData.totalCount"
          item-key="username"
          show-expand
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          >
          <template v-slot:item.userName="{ item }">
            <div class="d-flex align-center my-1">
              <v-avatar class="mr-2">
                <img
                  :src="item.avatarUrl"
                  alt=""
                >
              </v-avatar>
              <div>
                <div>{{ item.username }}</div>
                <div>{{ item.name }}</div>
              </div>
            </div>
          </template>
          <template v-slot:item.tenantAdmins="{item}">
            <div class="mt-1" v-for="(tenantCode, i) in item.tenantAdmins" :key="i"><div>{{tenantCode}}</div></div>
          </template>
          <template v-slot:item.mailMobile="{ item }">
            <div class="d-flex align-center my-1">
              <div>
                <div>{{ item.mail }}</div>
                <div>{{ item.mobile }}</div>
              </div>
            </div>
          </template>
          <template v-slot:item.isAdmin="{ item }">
            <v-switch
              v-model="item.isAdmin"
              dense
              inset
              :disabled="!userObj.isAdmin"
              @change="changeAdmin(item.username,item.isAdmin)"
            ></v-switch>
          </template>
          <template v-slot:item.isActive="{ item }">
            <v-switch
              v-model="item.isActive"
              dense
              inset
              @change="changeActive(item.username,item.isActive)"
            ></v-switch>
          </template>
          <template v-slot:item.createTime="{ item }">
            <div>{{item.createTime }}</div>
            <div>{{ item.lastLogin }}</div>
          </template>
          <template v-slot:item.handle="{ item }">
            <Operations
              :operations="[
                { text: $vuetify.lang.t('$vuetify.lang_menu_edit_profile'), onClick: () => {openUpdateProfile(item.username)} },
                { text: $vuetify.lang.t('$vuetify.lang_menu_change_password'), onClick: () => {openUpdatePassword(item.username)} },
                { text: $vuetify.lang.t('$vuetify.lang_menu_copy_user'), onClick: () => {openCopyUser(item)} },
                { text: $vuetify.lang.t('$vuetify.lang_menu_delete_user'), onClick: () => {openDeleteUser(item.username)} },
                { text: $vuetify.lang.t('$vuetify.lang_menu_update_user_tenant_admins'), onClick: () => {openUpdateTenantAdmins(item)} },
              ]"
            />
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="pa-1">
              <v-card class="rounded-0">
                <v-card-title>
                  {{$vuetify.lang.t('$vuetify.lang_view_user_project_permissions')}}
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="addProject(item.username, item.tenantCode)">{{ $vuetify.lang.t('$vuetify.lang_menu_assign_permissions') }}</v-btn>
                </v-card-title>
                <v-card-text v-if="item.projects">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">{{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_project_role')}}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_disable_project_defs')}}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_disable_repo_secrets')}}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_disable_pipelines')}}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_update_time')}}</th>
                          <th class="text-left">{{$vuetify.lang.t('$vuetify.lang_view_operations')}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(i,j) in item.projects"
                          :key="j"
                          v-if="item.projects.length > 0"
                        >
                          <td>{{ i.projectName }}</td>
                          <td>{{ i.accessLevel }}</td>
                          <td><v-chip small v-for="(str,j) in i.disableProjectDefs" :key="j">{{str}}</v-chip></td>
                          <td><v-chip small v-for="(str,j) in i.disableRepoSecrets" :key="j">{{str}}</v-chip></td>
                          <td><v-chip small v-for="(str,j) in i.disablePipelines" :key="j">{{str}}</v-chip></td>
                          <td>{{ i.updateTime }}</td>
                          <td>
                            <template>
                              <Operations
                                :operations="[
                                  { text: $vuetify.lang.t('$vuetify.lang_menu_change_permissions'), onClick: () => {modifyPower(i,item.username)} },
                                  { text: $vuetify.lang.t('$vuetify.lang_menu_delete_permissions'), onClick: () => {recyclingPower(i.projectName,item.username)} },
                                ]"
                              />
                            </template>
                          </td>
                        </tr>
                        <tr v-if="item.projects.length <= 0">
                          <td colspan="4" class="text-center">{{$vuetify.lang.t('$vuetify.lang_tip_no_data_available')}}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="addUserDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_form_new_user') }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addUserRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_user_prompt')}}</small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_username')"
                    required
                    dense
                    v-model="addUserForm.username"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_username_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_name')"
                    required
                    dense
                    v-model="addUserForm.name"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_name_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_mail')"
                    required
                    dense
                    v-model="addUserForm.mail"
                    :rules="[
                      v => !!v || $vuetify.lang.t('$vuetify.lang_form_required'),
                      v => /.+@.+\..+/.test(v) || $vuetify.lang.t('$vuetify.lang_tip_format_not_correct'),
                    ]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_mail_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_mobile')"
                    required
                    dense
                    v-model="addUserForm.mobile"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_mobile_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                    v-model="addUserForm.tenantCode"
                    :items="tenantCodes"
                    :required="userObj.isTenantAdmin && !userObj.isAdmin"
                    dense
                    :clearable="userObj.isAdmin"
                    small-chips
                    :hint="$vuetify.lang.t('$vuetify.lang_form_tenant_code_tip_1')"
                    persistent-hint
                  >
                  </v-autocomplete>
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
            @click="cancelAddUser()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addUser()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateProfileDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_edit_user_profile', targetUsername)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateProfileRef">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_name')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="updateProfileForm.name"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_name_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_mail')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="updateProfileForm.mail"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_mail_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_mobile')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="updateProfileForm.mobile"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_mobile_tip_1')"
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
              this.updateProfileDialog = false
              this.$refs.updateProfileRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateProfile()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updateTenantAdminsDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_edit_user_tenant_admins', targetUsername)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateTenantAdminsRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_tenant_prompt')}}</small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_tenant_code')"
                    v-model="updateTenantAdminsForm.tenantAdmins"
                    :items="tenantCodes"
                    dense
                    clearable
                    multiple
                    small-chips
                  >
                  </v-autocomplete>
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
              this.updateTenantAdminsDialog = false
              this.$refs.updateTenantAdminsRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateTenantAdmins()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="updatePasswordDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_change_user_password', targetUsername)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="updatePasswordRef">
            <small></small>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_change_password_new_password')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :type="newPasswordDisplay ? 'text' : 'password'"
                    v-model="passwordForm.newPassword"
                    :append-icon="newPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="newPasswordDisplay = !newPasswordDisplay"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_change_password_new_password_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_change_password_confirm_password')"
                    required
                    dense
                    :type="confirmPasswordDisplay ? 'text' : 'password'"
                    v-model="passwordForm.confirmPassword"
                    :append-icon="confirmPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="confirmPasswordDisplay = !confirmPasswordDisplay"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_change_password_confirm_password_tip_1')"
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
              this.updatePasswordDialog = false
              this.$refs.updatePasswordRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updatePassword()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteUserDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_user', targetUsername)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="deleteUserRef">
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_user_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_delete_user_username')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="deleteUsername"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_delete_user_username_tip_1', targetUsername)"
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
              this.deleteUserDialog = false
              this.$refs.deleteUserRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteUser()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="projectPowerDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions')}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="projectAddRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_prompt', targetUsername)}}</small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="memberProjectNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_project_project_name')"
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="projectAddForm.projectName"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[ 'runner', 'developer', 'maintainer' ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level')"
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="projectAddForm.accessLevel"
                    :messages="[
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1'), 
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2'),
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3'),
                    ]"
                  >
                    <template v-slot:message>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3')}}</div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_menu_pipeline_def'), value: 'pipelineDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_build_def'), value: 'buildDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_package_def'), value: 'packageDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_artifact_def'), value: 'artifactDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_docker_ignore_def'), value: 'dockerIgnoreDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_custom_step_def'), value: 'customStepDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_ops_def'), value: 'customOpsDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_ops_batch_def'), value: 'opsBatchDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_deploy_container_def'), value: 'deployContainerDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_deploy_artifact_def'), value: 'deployArtifactDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_istio_def'), value: 'istioDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_istio_gateway_def'), value: 'istioGatewayDef'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_project_defs')"
                    multiple
                    small-chips
                    dense
                    v-model="projectAddForm.disableProjectDefs"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_image'), value: 'image'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_artifact'), value: 'artifact'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_scan_code'), value: 'scanCode'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_k8s'), value: 'k8s'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets')"
                    multiple
                    small-chips
                    dense
                    v-model="projectAddForm.disableRepoSecrets"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-combobox
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines')"
                    dense
                    multiple
                    small-chips
                    hide-selected
                    v-model="projectAddForm.disablePipelines"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines_tip_1')"
                    persistent-hint
                    append-icon=""
                  >
                  </v-combobox>
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
              this.projectPowerDialog = false
              this.$refs.projectAddRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="projectAdd()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="modifyPowerDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_change_permissions')}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="accessLevelRef">
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_change_permissions_prompt', targetUsername, targetProjectName)}}</small>
            </v-alert>
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[ 'runner', 'developer', 'maintainer' ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level')"
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="projectUpdateForm.accessLevel"
                    :messages="[
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1'), 
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2'),
                      $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3'),
                    ]"
                  >
                    <template v-slot:message>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2')}}</div>
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3')}}</div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_menu_pipeline_def'), value: 'pipelineDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_build_def'), value: 'buildDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_package_def'), value: 'packageDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_artifact_def'), value: 'artifactDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_docker_ignore_def'), value: 'dockerIgnoreDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_custom_step_def'), value: 'customStepDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_ops_def'), value: 'customOpsDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_ops_batch_def'), value: 'opsBatchDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_deploy_container_def'), value: 'deployContainerDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_deploy_artifact_def'), value: 'deployArtifactDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_istio_def'), value: 'istioDef'},
                      {text: $vuetify.lang.t('$vuetify.lang_view_istio_gateway_def'), value: 'istioGatewayDef'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_project_defs')"
                    multiple
                    small-chips
                    dense
                    v-model="projectUpdateForm.disableProjectDefs"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="[
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_image'), value: 'image'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_artifact'), value: 'artifact'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_scan_code'), value: 'scanCode'},
                      {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_k8s'), value: 'k8s'},
                    ]"
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets')"
                    multiple
                    small-chips
                    dense
                    v-model="projectUpdateForm.disableRepoSecrets"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-combobox
                    :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines')"
                    dense
                    multiple
                    small-chips
                    hide-selected
                    v-model="projectUpdateForm.disablePipelines"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines_tip_1')"
                    persistent-hint
                    append-icon=""
                  >
                  </v-combobox>
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
              this.modifyPowerDialog = false
              this.$refs.accessLevelRef.reset()
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateAccessLevel()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="recyclingPowerDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_permissions')}}</span>
        </v-card-title>
        <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_permissions_prompt', targetUsername, targetProjectName)}}</small>
            </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="recyclingPowerDialog = false"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteProject()"
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
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}</span>
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
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageCard>
</template>

<script>
import Operations from '@/lib/ui-lib/components/Operations'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'Users',
  components: {
    Operations,
    PageCard
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
    }
  },
  data () {
    return {
      userObj: {},
      usersForm: {
        usernames: [],
        projectNames: [],
        tenantCodes: [],
        tenantAdmins: [],
        name: '',
        mail: '',
        active: '',
        admin: '',
        tenantAdmin: '',
        isMember: '',
        sortMode: 'username',
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        lastLoginRange: {
          startDate: '',
          endDate: ''
        },
        page: 1,
        perPage: 10
      },
      datesCreateTime: [],
      datesLastLogin: [],
      menuCreateTime: false,
      menuLastLogin: false,
      usersData: {},
      tableLoading: true,
      addUserForm: {
        username: '',
        name: '',
        mail: '',
        mobile: '',
        tenantCode: '',
      },
      isAdmin: [ 'yes', 'no' ],
      isActive: [ 'yes', 'no' ],
      isMember: [ 'yes', 'no' ],
      userNames: [],
      addUserDialog: false,
      updateProfileDialog: false,
      updatePasswordDialog: false,
      updateTenantAdminsDialog: false,
      projectForm: '',
      deleteUserDialog: false,
      projectPowerDialog: false,
      modifyPowerDialog: false,
      recyclingPowerDialog: false,
      targetUsername: '',
      targetProjectName: '',
      auditDialog: false,
      logList: [],
      userToken: '',
      deleteUsername: '',
      updateProfileForm: {
        name: '',
        mail: '',
        mobile: ''
      },
      updateTenantAdminsForm: {
        tenantAdmins: [],
      },
      passwordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      newPasswordDisplay: false,
      confirmPasswordDisplay: false,
      projectNames: [],
      memberProjectNames: [],
      tenantCodes: [],
      projectAddForm: {
        projectName: '',
        accessLevel: '',
        disableProjectDefs: [],
        disableRepoSecrets: [],
        disablePipelines: [],
      },
      projectUpdateForm: {
        projectName: '',
        accessLevel: '',
        disableProjectDefs: [],
        disableRepoSecrets: [],
        disablePipelines: [],
      },
    }
  },
  created () {
    this.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    this.userObj = JSON.parse(localStorage.getItem('userObj'))
    request.post('/admin/users', this.usersForm).then(response => {
      this.usersData = response.data
      this.tableLoading = false
    }).catch(error => {
      this.tableLoading = false
      this.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/userNames').then(response => {
      this.userNames = response.data.userNames
    }).catch(error => {
      this.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/projectNames').then(response => {
      this.projectNames = response.data.projectNames
    }).catch(error => {
      this.errorTip(true, error.response.data.msg)
    })
    request.get('/admin/tenantCodes').then(response => {
      this.tenantCodes = response.data.tenantCodes
    }).catch(error => {
      this.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    showLog (response) {
      const vm =this
      vm.logList = []
      vm.auditDialog = response.data.withAdminLog
      if(response.data.withAdminLog){
        vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${response.data.auditID}?x-user-token=${vm.userToken}`)
        vm.ws.onmessage = (event) => {
          vm.logList.push(JSON.parse(event.data))
        }
        vm.ws.onclose = () => {
          vm.logList.push({logType: 'END'})
        }
      }
    },
    getUsers() {
      const vm = this
      vm.tableLoading = true
      var datesCreateTime = vm.datesCreateTime.sort()
      vm.usersForm.createTimeRange.startDate = datesCreateTime[0]
      vm.usersForm.createTimeRange.endDate = datesCreateTime[1]
      var datesLastLogin = vm.datesLastLogin.sort()
      vm.usersForm.lastLoginRange.startDate = datesLastLogin[0]
      vm.usersForm.lastLoginRange.endDate = datesLastLogin[1]
      request.post('/admin/users', vm.usersForm).then(response => {
        vm.usersData = response.data
        vm.tableLoading = false
        vm.successTip(true, response.msg)
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true, error.response.data.msg)
      })
    },
    clearDatesCreateTime () {
      this.datesCreateTime = []
      this.menuCreateTime = false
      this.getUsers()
    },
    dateRangeSubmitCreateTime () {
      this.menuCreateTime = false
      this.getUsers()
    },
    clearDatesLastLogin () {
      this.datesLastLogin = []
      this.menuLastLogin = false
      this.getUsers()
    },
    dateRangeSubmitLastLogin () {
      this.menuLastLogin = false
      this.getUsers()
    },
    changeOptions (data) {
      this.tableLoading  = true
      this.usersForm.page = data.page
      this.usersForm.perPage = data.itemsPerPage
      request.post('/admin/users', this.usersForm).then(response => {
        this.usersData = response.data
        this.tableLoading = false
      }).catch(error => {
        this.tableLoading = false
        this.errorTip(true, error.response.data.msg)
      })
    },
    refreshList () {
      this.tableLoading = true
      request.post('/admin/users', this.usersForm).then(response => {
        this.usersData = response.data
        this.tableLoading = false
      }).catch(error => {
        this.tableLoading = false
        this.errorTip(true, error.response.data.msg)
      })
    },
    cancelAddUser () {
      this.addUserDialog = false
      this.$refs.addUserRef.reset()
    },
    openAddUser() {
      const vm = this
      vm.addUserDialog = true
      if (!vm.userObj.isAdmin) {
        vm.addUserForm.tenantCode = vm.tenantCodes[0]
      }
    },
    addUser () {
      const vm = this
      if(vm.$refs.addUserRef.validate()){
        request.post('/admin/user', vm.addUserForm).then(response => {
          vm.addUserDialog = false
          vm.$refs.addUserRef.reset()
          vm.showLog(response)
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    addProject (username, tenantCode) {
      request.post('/admin/projectNames/tenantCode', {tenantCode: tenantCode}).then(response => {
        this.memberProjectNames = response.data.projectNames
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
      this.targetUsername = username
      this.projectPowerDialog = true
    },
    projectAdd () {
      const vm = this
      if(vm.$refs.projectAddRef.validate()){
        request.post(`/admin/user/${vm.targetUsername}/projectAdd`, vm.projectAddForm).then(response => {
          vm.projectPowerDialog = false
          vm.successTip(true, response.msg)
          vm.$refs.projectAddRef.reset()
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    openUpdateProfile (data) {
      this.targetUsername = data
      request.get(`/admin/user/${this.targetUsername}/profile`).then(response => {
        this.updateProfileDialog = true
        this.updateProfileForm.name = response.data.user.name
        this.updateProfileForm.mail = response.data.user.mail
        this.updateProfileForm.mobile = response.data.user.mobile
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    updateProfile () {
      if(this.$refs.updateProfileRef.validate()){
        request.post(`/admin/user/${this.targetUsername}/profileUpdate`, this.updateProfileForm).then(response => {
          this.updateProfileDialog = false
          this.successTip(true, response.msg)
          this.refreshList()
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      }
    },
    openUpdateTenantAdmins (data) {
      this.targetUsername = data.username
      this.updateTenantAdminsDialog = true
      this.updateTenantAdminsForm.tenantAdmins = data.tenantAdmins
    },
    updateTenantAdmins () {
      if(this.$refs.updateTenantAdminsRef.validate()){
        request.post(`/admin/user/${this.targetUsername}/tenantAdminsUpdate`, this.updateTenantAdminsForm).then(response => {
          this.updateTenantAdminsDialog = false
          this.successTip(true, response.msg)
          this.refreshList()
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      }
    },
    openUpdatePassword(data) {
      this.updatePasswordDialog = true
      this.targetUsername = data
    },
    updatePassword () {
      if(this.$refs.updatePasswordRef.validate()){
        if(this.passwordForm.newPassword === this.passwordForm.confirmPassword){
          request.post(`/admin/user/${this.targetUsername}/passwordUpdate`, this.passwordForm).then(response => {
            this.successTip(true, response.msg)
            this.updatePasswordDialog = false
          }).catch(error => {
            this.errorTip(true, error.response.data.msg)
          })
        }else{
          this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_confirm_password_new_password_must_be_same'))
        }
      }
    },
    openCopyUser(user) {
      const vm = this
      vm.addUserDialog = true
      vm.addUserForm = { ...user }
      if (!vm.userObj.isAdmin) {
        vm.addUserForm.tenantCode = vm.tenantCodes[0]
      }
    },
    openDeleteUser (data) {
      this.deleteUserDialog = true
      this.targetUsername = data
    },
    deleteUser () {
      const vm = this
      if(vm.$refs.deleteUserRef.validate() && (vm.targetUsername === vm.deleteUsername)){
        request.delete(`/admin/user/${vm.targetUsername}`).then(response => {
          vm.successTip(true, response.msg)
          vm.deleteUserDialog = false
          vm.$refs.deleteUserRef.reset()
          vm.showLog(response)
          vm.refreshList()
        }).catch(error => {
          this.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetUsername))
      }
    },
    changeAdmin (data,status) {
      request.post(`/admin/user/${data}/adminUpdate`, {isAdmin: status}).then(response => {
        this.successTip(true, response.msg)
        this.refreshList()
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
        this.refreshList()
      })
    },
    changeActive (data,status) {
      request.post(`/admin/user/${data}/activeUpdate `, {isActive: status}).then(response => {
        this.successTip(true, response.msg)
        this.refreshList()
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
        this.refreshList()
      })
    },
    recyclingPower (projectName,username) {
      this.recyclingPowerDialog = true
      this.targetUsername = username
      this.targetProjectName = projectName
    },
    deleteProject () {
      request.post(`/admin/user/${this.targetUsername}/projectDelete`,{projectName: this.targetProjectName}).then(response => {
        this.successTip(true, response.msg)
        this.refreshList()
        this.recyclingPowerDialog = false
      }).catch(error => {
        this.errorTip(true, error.response.data.msg)
      })
    },
    modifyPower (userProject, username) {
      const vm =this
      vm.modifyPowerDialog = true
      vm.targetUsername = username
      vm.projectUpdateForm = {
        projectName: userProject.projectName,
        accessLevel: userProject.accessLevel,
        disableProjectDefs: userProject.disableProjectDefs,
        disableRepoSecrets: userProject.disableRepoSecrets,
        disablePipelines: userProject.disablePipelines,
      }
    },
    updateAccessLevel () {
      const vm =this
      if(vm.$refs.accessLevelRef.validate()){
        request.post(`/admin/user/${vm.targetUsername}/projectUpdate`, vm.projectUpdateForm).then(response => {
          vm.successTip(true, response.msg)
          vm.modifyPowerDialog = false
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
  },
  computed: {
    dateRangeTextCreateTime () {
      return this.datesCreateTime.join(' ~ ')
    },
    dateRangeTextLastLogin () {
      return this.datesLastLogin.join(' ~ ')
    },
    pipelineHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_username'), value: 'userName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_user_mail_mobile'), value: 'mailMobile', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_tenant_code'), value: 'tenantCode', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_user_tenant_admins'), value: 'tenantAdmins', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_user_create_login_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_admin'), value: 'isAdmin', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_active'), value: 'isActive', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
  }
}
</script>

<style scoped>
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
</style>
