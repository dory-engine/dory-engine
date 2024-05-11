<template>
  <v-app>
    <v-app-bar
      app
      color="#162942"
      dark
      clipped-left
    >
      <div class="d-flex align-center mr-8" style="background-color: rgba(256, 256, 256, 0.15); padding: 8px; border-radius: 200px">
        <img style="height: 40px" :src="frontendInfo.appLogo"/>
      </div>
      <div class="d-flex align-center mr-8">
          <span style="font-size: 24px">{{ frontendInfo.appName }} ({{ version }})</span>
      </div>
      <v-spacer />
      <NavMenu :menu-data="menuService.state.topMenu.filter(menu => {
        if (menu.key === 'admin' && (userService.state.userObj.isAdmin === null || userService.state.userObj.isTenantAdmin === null || (userService.state.userObj.isAdmin === false && userService.state.userObj.isTenantAdmin === false))) {
          return false
        } else if (menu.key === 'console' && (userService.state.userObj.isAdmin === null || userService.state.userObj.isConsole === null || (userService.state.userObj.isAdmin === false && userService.state.userObj.isConsole === false))) {
          return false
        } else {
          return true
        }
      })" :prop="{
        key: 'key',
        children: 'nodes',
        text: 'name'
      }" menu-type="horizontal"/>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" small>
            <v-icon>mdi-translate</v-icon>
            <v-icon small> mdi-chevron-down </v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group mandatory v-model="selectedItem" color="primary">
            <v-list-item :value="0" @click="changeLang('en')">
              <v-list-item-title>English</v-list-item-title>
            </v-list-item>
            <v-list-item :value="1" @click="changeLang('zh')">
              <v-list-item-title>简体中文</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
    >
      <v-list-item class="pa-2">
        <v-list-item-avatar>
          <v-img :src="userInformation.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{ userInformation.name }}</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <NavMenu :menu-data="menuService.state.leftMenu[leftNodesIndex].nodes.filter(item => {
        if (item.key === 'metricsAuditLogs' && (userService.state.userObj.isAdmin === null || userService.state.userObj.isTenantAdmin === null || (userService.state.userObj.isAdmin === false && userService.state.userObj.isTenantAdmin === false))) {
          return false
        } else if ((item.key === 'adminTenants' || item.key === 'adminSystemConfig' || item.key === 'adminMailLogs' || item.key === 'adminAuditLogs' || item.key === 'adminApplies') && (userService.state.userObj.isAdmin === null || userService.state.userObj.isAdmin === false)) {
          return false
        } else {
          return true
        }
      })" :prop="{
        key: 'key',
        children: 'nodes',
        text: 'name'
      }"/>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <v-snackbar :timeout="-1" top color="error" v-model="residentSnackbar.show">
          <v-row class="align-center">
            <v-col class="grow">{{$vuetify.lang.t('$vuetify.lang_tip_login_timout')}}</v-col>
            <v-btn text :to="'/login?redirect=' + $route.fullPath">{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</v-btn>
          </v-row>
        </v-snackbar>
        <v-slide-x-reverse-transition mode="out-in">
          <router-view :key="$route.fullPath" mode="out-in"/>
        </v-slide-x-reverse-transition>
      </v-container>
    </v-main>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_change_password')}}</span>
        </v-card-title>
        <v-card-text>
          <small>{{$vuetify.lang.t('$vuetify.lang_form_required_tip')}}</small>
          <v-form ref="passwordRef">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_change_password_old_password')"
                    :type="oldPasswordDisplay ? 'text' : 'password'"
                    v-model="passwordForm.oldPassword"
                    :append-icon="oldPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="oldPasswordDisplay = !oldPasswordDisplay"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    required
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_change_password_old_password_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_change_password_new_password')"
                    :type="newPasswordDisplay ? 'text' : 'password'"
                    v-model="passwordForm.newPassword"
                    :append-icon="newPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="newPasswordDisplay = !newPasswordDisplay"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    required
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_change_password_new_password_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_change_password_confirm_password')"
                    :type="confirmPasswordDisplay ? 'text' : 'password'"
                    v-model="passwordForm.confirmPassword"
                    :append-icon="confirmPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="confirmPasswordDisplay = !confirmPasswordDisplay"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    required
                    dense
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
            @click="cancelChange()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="changePassword()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="profileDialog"
      max-width="600px"
      @input="getProfile()"
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_form_edit_profile') }}</span>
        </v-card-title>
        <v-card-text>
          <v-alert icon="mdi-alert-circle" prominent text type="info">
            <small>{{ $vuetify.lang.t('$vuetify.lang_form_edit_profile_prompt') }}</small>
          </v-alert>
          <v-form ref="profileRef">
            <div class="img-wrap">
              <img :src="userInformation.avatar" alt="">
              <div class="edit-btn">
                <v-file-input
                  accept="image/png, image/jpeg, image/jpg"
                  solo
                  prepend-icon="mdi-image-edit"
                  @change="modifyAvatar($event)"
                >
                </v-file-input>
                <v-icon color="error" class="ml-2" @click="deleteAvatar()">mdi-trash-can</v-icon>
              </div>
            </div>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_name')"
                    required
                    dense
                    v-model="profileForm.name"
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
                    v-model="profileForm.mail"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_new_user_mail_tip_1')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_user_mobile')"
                    required
                    dense
                    v-model="profileForm.mobile"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
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
              this.getProfile()
              this.profileDialog = false
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
      v-model="tokenDialog"
      width="800"
    >
      <v-card :loading="dialogLoading">
        <v-card-title>
          <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_view_access_tokens') }}</span>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="addTokenDialog"
            max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                small
                v-bind="attrs"
                v-on="on"
              >
                {{ $vuetify.lang.t('$vuetify.lang_menu_new_access_token') }}
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline grey lighten-2">
                {{ $vuetify.lang.t('$vuetify.lang_form_new_access_token') }}
              </v-card-title>
              <v-form ref="accessTokenRef" v-model="valid">
                <v-card-text>
                  <v-alert icon="mdi-alert-circle" prominent text type="info">
                    <small>{{ $vuetify.lang.t('$vuetify.lang_form_new_access_token_prompt') }}</small>
                  </v-alert>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_new_access_token_access_token_name')"
                            required
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            dense
                            v-model="accessTokenForm.accessTokenName"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_new_access_token_access_token_name_tip_1')"
                            persistent-hint
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_new_access_token_expire_days')"
                            required
                            dense
                            type="number"
                            v-model.number="accessTokenForm.expireDays"
                            :rules="[intRule]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_new_access_token_expire_days_tip_1')"
                            persistent-hint
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="cancelAdd()"
                  >
                    {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="addAccessToken()"
                  >
                    {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="[
              { text: $vuetify.lang.t('$vuetify.lang_view_username'), value: 'username', sortable: false },
              { text: $vuetify.lang.t('$vuetify.lang_view_access_token_name'), value: 'accessTokenName', sortable: false },
              { text: $vuetify.lang.t('$vuetify.lang_view_access_tokens'), value: 'accessTokenCopy', sortable: false },
              { text: $vuetify.lang.t('$vuetify.lang_view_is_expires'), value: 'expired', sortable: false },
              { text: $vuetify.lang.t('$vuetify.lang_view_expire_time'), value: 'expireTime', sortable: false },
              { text: $vuetify.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false }
            ]"
            :items="accessTokens"
            class="elevation-1"
            :hide-default-footer="true"
          >
            <template v-slot:item.accessTokenCopy="{ item }">
              <div>
                <v-btn class="ml-1" rounded color="primary" small v-clipboard:copy="item.accessToken" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-btn>
              </div>
            </template>
            <template v-slot:item.handle="{ item }">
              <v-btn small color="error" @click="deleteToken(item.accessTokenName)">{{$vuetify.lang.t('$vuetify.lang_menu_revoke_access_token')}}</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="Ssnackbar.show"
      :timeout="2000"
      color="success"
      class="white--text"
    >
      {{ Ssnackbar.text }}
    </v-snackbar>
    <v-snackbar color="error" v-model="Esnackbar.show" timeout="-1" top>
      {{ Esnackbar.text }}
      <v-btn text @click="Esnackbar.show = false" outlined small class="float-right">{{$vuetify.lang.t('$vuetify.lang_menu_close')}}</v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="Wsnackbar.show"
      :timeout="2000"
      color="orange"
      class="white--text"
    >
      {{ Wsnackbar.text }}
    </v-snackbar>
    <v-dialog
      v-model="cropperDialog"
      max-width="1000px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_edit_profile_clip_image')}}</span>
        </v-card-title>
        <v-card-text>
          <div class="cropper-content">
          <div class="cropper" style="text-align:center">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :centerBox="option.centerBox"
              :infoTrue="option.infoTrue"
              :fixedBox="option.fixedBox"
            ></vueCropper>
          </div>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="() => {
              this.cropperDialog = false
            }"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateAvatar()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

import NavMenu from '@/lib/ui-lib/components/NavMenu'
import MenuService, {rtnLeftMenu, rtnTopMenu} from '@/services/menu'
import User from '@/services/user'
import { pluck, mergeMap, repeat, combineLatest } from 'rxjs/operators'
import USER_API from '@/api/user'
import request from "@/utils/request";
import {vuetify} from '@/plugins/vuetify'

const menuService = MenuService.getInstance()
const userService = User.getInstance()
export default {
  name: 'Layout',
  provide () {
    return {
      successTip: this.successTip,
      errorTip: this.errorTip,
      warnTip: this.warnTip
    }
  },
  components: {
    NavMenu
  },
  domStreams: ['confirmUpdateProfile$'],
  data: () => ({
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
    menuService,
    userService,
    oldPasswordDisplay: false,
    newPasswordDisplay: false,
    confirmPasswordDisplay: false,
    drawer: true,
    mini: false,
    dialog: false,
    profileDialog: false,
    tokenDialog: false,
    addTokenDialog: false,
    dialogLoading: false,
    leftNodesIndex: 0,
    residentSnackbar: {
      show: false,
      text: '',
      color: 'primary'
    },
    Ssnackbar: {
      show: false,
      text: '',
    },
    Esnackbar: {
      show: false,
      text: '',
    },
    Wsnackbar: {
      show: false,
      text: '',
    },
    userInformation: '',
    accessTokens: [],
    accessTokenForm: {
      accessTokenName: '',
      expireDays: 30
    },
    valid: true,
    profileForm: {
      name: '',
      mail: '',
      mobile: ''
    },
    passwordForm: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    cropperDialog: false,
    fileName: '',
    option:{
      img: '',
      outputSize: 1,
      outputType: 'jpeg',
      info: true,
      canScale: true,
      autoCrop: true,
      autoCropWidth: 300,
      autoCropHeight: 300,
      fixed: true,
      fixedNumber: [1, 1],
      full: false,
      fixedBox: false,
      canMove: true,
      canMoveBox: true,
      original: false,
      centerBox: false,
      height: true,
      infoTrue: true,
      maxImgSize: 3000,
      enlarge: 1,
      mode: '300px 300px'
    },
    frontendInfo: {
      appName: '',
      appDesc: '',
      appLogo: '',
      appFavIcon: '',
      appBackGroundImage: '',
    },
    version: '',
    selectedItem: ''
  }),
  created () {
    const vm = this
    request.get('/public/about').then(response => {
      vm.frontendInfo = response.data.config.frontend
      vm.version = response.data.version
      if (response.data.freeTrial) {
        vm.version = `${vm.version}/freeTrail`
      }
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    vm.userInformation = JSON.parse(localStorage.getItem('userObj'))
    vm.$watchAsObservable('$route', { immediate: true }).pipe(
      pluck('newValue')
    ).subscribe(next => {
      if (next.fullPath.startsWith('/cicd')) {
        vm.leftNodesIndex = 0
      } else if (next.fullPath.startsWith('/admin')) {
        vm.leftNodesIndex = 1
      } else if (next.fullPath.startsWith('/console')) {
        vm.leftNodesIndex = 2
      } else if (next.fullPath.startsWith('/metrics')) {
        vm.leftNodesIndex = 3
      } else if (next.fullPath.startsWith('/announcements')) {
        vm.leftNodesIndex = 4
      }
    })
    vm.$subscribeTo(menuService.leftMenu$, (next) => {

    })
    vm.$subscribeTo(userService.userObj$, (next) => {
      if (!next || next.userStatus === 'invalid') {
        vm.residentSnackbar.show = true
      } else {
        vm.residentSnackbar.show = false
      }
    })
  },
  mounted () {
    if (window.sessionStorage.getItem('lang')) {
      if (window.sessionStorage.getItem('lang') === 'zh'){
        this.selectedItem = 1
      }
      if (window.sessionStorage.getItem('lang') === 'en'){
        this.selectedItem = 0
      }
    }
  },
  methods: {
    getAccessToken () {
      const vm = this
      vm.dialogLoading = true
      USER_API.getAccessToken().then(response => {
        vm.accessTokens = response.data.accessTokens
        vm.successTip(true,response.msg)
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
      vm.dialogLoading = false
    },
    getProfile () {
      const vm = this
      vm.dialogLoading = true
      USER_API.getProfile().then(response => {
        vm.profileForm.name = response.data.profile.name
        vm.profileForm.mail = response.data.profile.mail
        vm.profileForm.mobile = response.data.profile.mobile
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
      vm.dialogLoading = false
    },
    addAccessToken () {
      const vm = this
      if(vm.$refs.accessTokenRef.validate()){
        USER_API.postAccessToken(vm.accessTokenForm).then(response => {
          vm.getAccessToken()
          console.log(response)
          vm.addTokenDialog = false
          vm.accessTokenForm.accessTokenName = ''
          vm.accessTokenForm.expireDays = 30
          vm.$refs.accessTokenRef.resetValidation()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }
    },
    cancelAdd () {
      this.accessTokenForm.accessTokenName = ''
      this.$refs.accessTokenRef.resetValidation()
      this.addTokenDialog = false
    },
    onCopy () {
      const vm = this
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_success'))
    },
    onError () {
      const vm = this
      this.errorTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed'))
    },
    deleteToken (accessTokenName) {
      const vm = this
      USER_API.deleteAccessToken(accessTokenName).then(response => {
        vm.getAccessToken()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    updateProfile () {
      const vm = this
      if(vm.$refs.profileRef.validate()){
        USER_API.updateProfile(vm.profileForm).then(response => {
          vm.profileDialog = false
          vm.successTip(true,response.msg)
        }).catch(error => {
          vm.profileDialog = false
          vm.errorTip(true,error.response.data.msg)
        })
      }
    },
    changePassword () {
      const vm = this
      if(vm.$refs.passwordRef.validate()){
        USER_API.changePassword(vm.passwordForm).then(response => {
          vm.dialog = false
          vm.$refs.passwordRef.reset()
          vm.successTip(true,response.msg)
          vm.timer=setTimeout(() => {
            // vm.$router.push({ path: '/login' })
          },2000)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }
    },
    cancelChange () {
      this.dialog = false
      this.$refs.passwordRef.reset()
    },
    successTip (show, message) {
      this.Ssnackbar.show = show
      this.Ssnackbar.text = message
    },
    errorTip (show, message) {
      this.Esnackbar.show = show
      this.Esnackbar.text = message
    },
    warnTip (show, message) {
      this.Wsnackbar.show = show
      this.Wsnackbar.text = message
    },
    modifyAvatar(e) {
      const vm = this
      vm.fileName = e.name
      let reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        vm.option.img = data
      }
      reader.readAsDataURL(e)
      vm.cropperDialog = true
    },
    deleteAvatar() {
      const vm = this
      request.delete('/account/avatar').then(response => {
        vm.successTip(true, response.msg)
        vm.profileDialog = false
        vm.userInformation = JSON.parse(localStorage.getItem('userObj'))
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    updateAvatar() {
      const vm = this
      vm.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append('avatar', data, vm.fileName)
        request.post('/account/avatar', formData).then(response => {
          vm.successTip(true, response.msg)
          vm.cropperDialog = false
          vm.profileDialog = false
          vm.userInformation = JSON.parse(localStorage.getItem('userObj'))
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      })
      vm.$forceUpdate()
    },
    changeLang (lang) {
      const vm = this
      vm.$i18n.locale = lang
      window.sessionStorage.setItem('lang', lang)
      menuService.topMenu$.next(rtnTopMenu(userService))
      menuService.leftMenu$.next(rtnLeftMenu())
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang='scss'>
.v-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar{
  width: 6px;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  z-index: 10;
}
.v-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
.v-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius: 10px;
}
.img-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .edit-btn {
    margin-left: 16px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    button {
      margin: 0 !important;
      cursor: pointer;
    }
    .v-input__control {
      display: none;
    }
    .v-text-field.v-text-field--solo .v-input__prepend-outer, .v-text-field.v-text-field--solo .v-input__append-outer {
      margin: 0 !important;
      .v-icon {
        color: #1976d2 !important;
      }
    }
    .v-input {
      flex: none;
    }
  }
}
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
