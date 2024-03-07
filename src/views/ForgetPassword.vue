<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
        class="login-container"
        :style="{backgroundImage:`url(${frontendInfo.appBackGroundImage})`}"
      >
        <v-row class="align-center justify-center">
          <v-col xs="12" sm="8" md="6" lg="5" xl="3">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>{{$vuetify.lang.t('$vuetify.lang_view_forget_password')}}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step
                    :complete="e1 > 1"
                    step="1"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_view_input_account')}}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step
                    :complete="e1 > 2"
                    step="2"
                  >
                    {{$vuetify.lang.t('$vuetify.lang_view_send_reset_mail')}}
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-form style="height: 200px" ref="requestValidateCodeForm">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_account')"
                        name="username"
                        required
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="forgetPwdForm.username"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_mail')"
                        name="mail"
                        required
                        prepend-icon="mdi-email"
                        type="text"
                        v-model="forgetPwdForm.mail"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-form>
                    <v-row>
                      <v-col cols="12" class="d-flex">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          :loading="confirmRequestValidateCodeLoading"
                          v-stream:click="confirmRequestValidateCodeClick$"
                        >
                          {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
                        </v-btn>

                        <v-btn text @click="() => { $router.back() }">
                          {{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-form style="height: 200px" ref="validateCode_form">
                      <div class="d-flex justify-center">
                        <v-icon color="success" class="mb-2" style="font-size: 46px">
                          mdi-checkbox-marked-circle-outline
                        </v-icon>
                      </div>
                      <div class="d-flex justify-center">
                        {{$vuetify.lang.t('$vuetify.lang_tip_reset_mail_sent')}}
                      </div>
                    </v-form>
                    <v-row>
                      <v-col cols="12" class="d-flex">
                        <v-spacer></v-spacer>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
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
import { catchError, delay, filter, mergeMap, tap } from 'rxjs/operators'
import { rtnRetryWhenOperator } from '@/utils/request'
import { defer, of } from 'rxjs'
import USER_API from '@/api/user'
import {vuetify} from '@/plugins/vuetify'
import request from '@/utils/request'
export default {
  name: 'Login',
  data () {
    const vm = this
    return {
      passwordDisplay: false,
      loginLoading: false,
      forgetPwdForm: {
        username: '',
        mail: ''
      },
      rules: {
        required: value => !!value || vuetify.preset.lang.t('$vuetify.lang_form_required'),
        confirmPassword: value => {
          if (value === vm.forgetPwdForm.password) {
            return true
          } else {
            return vuetify.preset.lang.t('$vuetify.lang_tip_confirm_password_new_password_must_be_same')
          }
        }
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
      e1: 1,
      confirmRequestValidateCodeLoading: false,
      confirmValidateCodeLoading: false,
      confirmRequestValidateCodeLoading: false
    }
  },
  domStreams: ['confirmRequestValidateCodeClick$'],
  methods: {
    snackbarShow (text, color) {
      this.snackbar = {
        show: true,
        text,
        color
      }
    }
  },
  created () {
    const vm = this
    request.get('/public/about').then(response => {
      vm.frontendInfo = response.data.config.frontend
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    vm.confirmRequestValidateCodeClick$.pipe(
      filter(next => {
        return vm.$refs.requestValidateCodeForm.validate()
      }),
      tap(next => {
        vm.confirmRequestValidateCodeLoading = true
      }),
      mergeMap(next => {
        return defer(() => { return USER_API.forgetPassword(vm.forgetPwdForm) }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return of(next.response)
          })
        )
      }),
      filter(next => {
        vm.confirmRequestValidateCodeLoading = false
        if (next.status === 403) {
          vm.snackbarShow(next.data.msg, 'error')
          return false
        } else {
          vm.snackbarShow(vuetify.preset.lang.t('$vuetify.lang_tip_reset_mail_sent'), 'success')
          vm.e1 = 2
          return true
        }
      }),
    ).subscribe(next => {
    })
  }
}
</script>

<style scoped lang="scss">
.login-container {
  background-position: center;
  background-size: 100% auto;
  @media (max-aspect-ratio: 2732/1536){
    background-size: auto 100%;
  }
}
</style>
