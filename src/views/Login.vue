<template>
  <v-app>
    <v-main>
      <v-container
        class="login-container"
        :style="{backgroundImage:`url(${frontendInfo.appBackGroundImage})`}"
        fluid
        fill-height
      >
        <v-row class="align-center justify-center">
          <v-col xs="12" sm="8" md="6" lg="5" xl="3">
            <v-card class="elevation-12 pa-3">
              <v-card-title>
                <img style="height: 40px; margin-right: 10px" :src="frontendInfo.appLogo" />
                <span>{{ frontendInfo.appName }} ({{ version }})</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="login_form">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_account')"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="loginForm.username"
                    :rules="[rules.required]"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_login_account_tip')"
                    persistent-hint
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    :label="$vuetify.lang.t('$vuetify.lang_form_password')"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="passwordDisplay ? 'text' : 'password'"
                    v-model="loginForm.password"
                    :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="passwordDisplay = !passwordDisplay"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-form>
                <div class="d-flex">
                  <v-spacer />
                  <a style="color: rgba(0, 0, 0, 0.6)" @click="$router.push('/forget-password')">{{$vuetify.lang.t('$vuetify.lang_view_forget_password')}}?</a>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  :loading="loginLoading"
                  color="primary"
                  @click="userLogin"
                >{{$vuetify.lang.t('$vuetify.lang_menu_login')}}</v-btn
                >
              </v-card-actions>
              <div class="d-flex justify-center pa-3" style="font-size: 14px; font-weight: normal; color: rgba(0, 0, 0, 0.6)">
                {{ frontendInfo.appName }} - {{ frontendInfo.appDesc }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar top :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">{{$vuetify.lang.t('$vuetify.lang_menu_close')}}</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import USER_API from '@/api/user'
import {vuetify} from '@/plugins/vuetify'
import request from '@/utils/request'
export default {
  name: 'Login',
  data: () => ({
    passwordDisplay: false,
    loginLoading: false,
    loginForm: {
      username: '',
      password: ''
    },
    rules: {
      required: value => !!value || vuetify.preset.lang.t('$vuetify.lang_form_required')
    },
    snackbar: {
      show: false,
      text: '',
      color: 'primary'
    },
    frontendInfo: {
      appName: '',
      appDesc: '',
      appLogo: '',
      appFavIcon: '',
      appBackGroundImage: '',
    },
    version: '',
  }),
  created () {
    const vm = this
    request.get('/public/about').then(response => {
      vm.frontendInfo = response.data.config.frontend
      vm.version = response.data.version
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
  },
  methods: {
    userLogin () {
      const vm = this
      if (!vm.$refs.login_form.validate()) return
      vm.loginLoading = true
      /* new Promise(resolve => {
        resolve(vm.loginForm)
      }) */
      USER_API.login(vm.loginForm).then(response => {
      }).then(_ => {
        vm.loginLoading = false
        vm.$router.replace('/')
      }).catch((error) => {
        if (error && error.response.status === 403) {
          vm.snackbarShow(error.response.data.msg, 'error')
        } else {
          vm.snackbarShow(vuetify.preset.lang.t('$vuetify.lang_tip_login_exception'), 'error')
        }
      }).finally(() => {
        vm.loginLoading = false
      })
    },
    snackbarShow (text, color) {
      this.snackbar = {
        show: true,
        text,
        color
      }
    }
  }
}
</script>

<style lang="scss">
.login-container {
  background-position: center;
  background-size: 100% auto;
  @media (max-aspect-ratio: 2732/1536){
    background-size: auto 100%;
  }
}
</style>
