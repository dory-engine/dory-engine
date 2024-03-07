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
                <v-toolbar-title>{{$vuetify.lang.t('$vuetify.lang_view_reset_password')}}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-stepper v-model="e1">
                <v-stepper-items>
                  <v-stepper-content step="3">
                    <v-form style="height: 200px" ref="resetPasswordForm">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_input_new_password')"
                        name="newPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        v-model="resetForm.newPassword"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_repeat_new_password')"
                        name="confirmPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        v-model="resetForm.confirmPassword"
                        :rules="[rules.required, rules.confirmPassword]"
                      ></v-text-field>
                    </v-form>
                    <v-row>
                      <v-col cols="12" class="d-flex">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          :loading="resetPasswordLoading"
                          v-stream:click="resetPasswordClick$"
                        >
                          {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
                        </v-btn>
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
      resetForm: {
        resetToken: '',
        newPassword: '',
        confirmPassword: ''
      },
      resetToken: '',
      rules: {
        required: value => !!value || vuetify.preset.lang.t('$vuetify.lang_form_required'),
        confirmPassword: value => {
          if (value === vm.resetForm.newPassword) {
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
      e1: 3,
      confirmRequestValidateCodeLoading: false,
      confirmValidateCodeLoading: false,
      resetPasswordLoading: false
    }
  },
  domStreams: ['confirmRequestValidateCodeClick$', 'confirmValidateCodeClick$', 'resetPasswordClick$'],
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
    vm.resetForm.resetToken = vm.$route.params.resetToken
    vm.resetPasswordClick$.pipe(
      filter(next => {
        return vm.$refs.resetPasswordForm.validate()
      }),
      tap(next => {
        vm.resetPasswordLoading = true
      }),
      mergeMap(next => {
        return defer(() => { return USER_API.resetPassword(Object.assign({}, vm.resetForm)) }).pipe(
          rtnRetryWhenOperator(),
          catchError(next => {
            return of(next.response)
          })
        )
      }),
      filter(next => {
        vm.resetPasswordLoading = false
        if (next.status === 403) {
          vm.snackbarShow(next.data.msg, 'error')
          return false
        } else {
          vm.snackbarShow(vuetify.preset.lang.t('$vuetify.lang_tip_reset_password_success'), 'success')
          return true
        }
      }),
      delay(1000)
    ).subscribe(next => {
      vm.$router.push({ path: '/login' })
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
