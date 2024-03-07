<template>
  <page-card :name="$vuetify.lang.t('$vuetify.lang_menu_metrics_check_quota')">
    <v-card-text>
      <v-tabs v-model="tabValue">
        <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_count')}}</v-tab>
        <v-tab @change="change2()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_duration')}}</v-tab>
        <v-tab @change="change3()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_weekly')}}</v-tab>
        <v-tab @change="change4()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_status_rate')}}</v-tab>
        <v-tab @change="change5()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_memory_request_average')}}</v-tab>
        <v-tab @change="change6()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_memory_limit_average')}}</v-tab>
        <v-tab @change="change7()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_cpu_request_average')}}</v-tab>
        <v-tab @change="change8()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_cpu_limit_average')}}</v-tab>
        <v-tab @change="change9()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_pods_limit_average')}}</v-tab>
        <v-tab @change="change10()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_memory_request_rate')}}</v-tab>
        <v-tab @change="change11()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_memory_limit_rate')}}</v-tab>
        <v-tab @change="change12()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_cpu_request_rate')}}</v-tab>
        <v-tab @change="change13()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_cpu_limit_rate')}}</v-tab>
        <v-tab @change="change14()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_check_quotas_pods_limit_rate')}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabValue">
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams.dimension"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams.timeZoom"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams.timeRangeDays"
                @change="timeRangeDaysChange(chartParams.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus"
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
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.projectNames"
                @change="getEcharts()"
                @blur="projectNameBlur(chartParams)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.projectTeams"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.branchNames"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.pipelineNames"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.statusResults"
                @change="getEcharts()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.envNames"
                @change="getEcharts()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams2.dimension"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams2.timeZoom"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams2.timeRangeDays"
                @change="timeRangeDaysChange2(chartParams2.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText2"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus2"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates2"
                    range
                    no-title
                    @change="dateRangeSubmit2()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates2()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.projectNames"
                @change="getEcharts2()"
                @blur="projectNameBlur(chartParams2)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.projectTeams"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.branchNames"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.pipelineNames"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.statusResults"
                @change="getEcharts2()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.envNames"
                @change="getEcharts2()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading2">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="durationChart" id="durationChart"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="[
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_range_day'), value: 'day' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_range_hour'), value: 'hour' },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams3.timeZoom"
                @change="getEcharts3()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams3.timeRangeDays"
                @change="timeRangeDaysChange3(chartParams3.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu3"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText3"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus3"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates3"
                    range
                    no-title
                    @change="dateRangeSubmit3()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates3()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.projectNames"
                @change="getEcharts3()"
                @blur="projectNameBlur(chartParams3)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.projectTeams"
                @change="getEcharts3()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.branchNames"
                @change="getEcharts3()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.pipelineNames"
                @change="getEcharts3()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.statusResults"
                @change="getEcharts3()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.envNames"
                @change="getEcharts3()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading3">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart3"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="[
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_all'), value: 'all' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_project_name'), value: 'projectName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_project_team'), value: 'projectTeam' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_branch_name'), value: 'branchName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },  
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_env_name'), value: 'envName' },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams4.dimension"
                @change="getEcharts4()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams4.timeZoom"
                @change="getEcharts4()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams4.timeRangeDays"
                @change="timeRangeDaysChange4(chartParams4.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu4"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText4"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus4"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates4"
                    range
                    no-title
                    @change="dateRangeSubmit4()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates4()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.projectNames"
                @change="getEcharts4()"
                @blur="projectNameBlur(chartParams4)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.projectTeams"
                @change="getEcharts4()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.branchNames"
                @change="getEcharts4()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.pipelineNames"
                @change="getEcharts4()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.envNames"
                @change="getEcharts4()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading4">
            <div style="width: 100%; height: 400px; position: relative" v-for="(item,index) in statusResultsList">
              <canvas :ref="`statusChart${index}`" :id="`statusChart${index}`"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams5.dimension"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams5.timeZoom"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams5.timeRangeDays"
                @change="timeRangeDaysChange5(chartParams5.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu5"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText5"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus5"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates5"
                    range
                    no-title
                    @change="dateRangeSubmit5()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates5()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.projectNames"
                @change="getEcharts5()"
                @blur="projectNameBlur(chartParams5)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.projectTeams"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.branchNames"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.pipelineNames"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.statusResults"
                @change="getEcharts5()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.envNames"
                @change="getEcharts5()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading5">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart5"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams6.dimension"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams6.timeZoom"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams6.timeRangeDays"
                @change="timeRangeDaysChange6(chartParams6.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu6"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText6"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus6"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates6"
                    range
                    no-title
                    @change="dateRangeSubmit6()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates6()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.projectNames"
                @change="getEcharts6()"
                @blur="projectNameBlur(chartParams6)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.projectTeams"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.branchNames"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.pipelineNames"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.statusResults"
                @change="getEcharts6()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.envNames"
                @change="getEcharts6()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading6">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart6"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams7.dimension"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams7.timeZoom"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams7.timeRangeDays"
                @change="timeRangeDaysChange7(chartParams7.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu7"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText7"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus7"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates7"
                    range
                    no-title
                    @change="dateRangeSubmit7()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates7()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.projectNames"
                @change="getEcharts7()"
                @blur="projectNameBlur(chartParams7)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.projectTeams"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.branchNames"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.pipelineNames"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.statusResults"
                @change="getEcharts7()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams7.envNames"
                @change="getEcharts7()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading7">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart7"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams8.dimension"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams8.timeZoom"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams8.timeRangeDays"
                @change="timeRangeDaysChange8(chartParams8.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu8"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText8"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus8"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates8"
                    range
                    no-title
                    @change="dateRangeSubmit8()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates8()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.projectNames"
                @change="getEcharts8()"
                @blur="projectNameBlur(chartParams8)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.projectTeams"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.branchNames"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.pipelineNames"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.statusResults"
                @change="getEcharts8()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams8.envNames"
                @change="getEcharts8()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading8">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart8"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams9.dimension"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams9.timeZoom"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams9.timeRangeDays"
                @change="timeRangeDaysChange9(chartParams9.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu9"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText9"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus9"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates9"
                    range
                    no-title
                    @change="dateRangeSubmit9()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates9()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.projectNames"
                @change="getEcharts9()"
                @blur="projectNameBlur(chartParams9)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.projectTeams"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.branchNames"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.pipelineNames"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.statusResults"
                @change="getEcharts9()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams9.envNames"
                @change="getEcharts9()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading9">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart9"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams10.dimension"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams10.timeZoom"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams10.timeRangeDays"
                @change="timeRangeDaysChange10(chartParams10.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu10"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText10"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus10"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates10"
                    range
                    no-title
                    @change="dateRangeSubmit10()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates10()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.projectNames"
                @change="getEcharts10()"
                @blur="projectNameBlur(chartParams10)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.projectTeams"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.branchNames"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.pipelineNames"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.statusResults"
                @change="getEcharts10()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams10.envNames"
                @change="getEcharts10()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading10">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart10"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams11.dimension"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams11.timeZoom"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams11.timeRangeDays"
                @change="timeRangeDaysChange11(chartParams11.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu11"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText11"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus11"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates11"
                    range
                    no-title
                    @change="dateRangeSubmit11()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates11()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.projectNames"
                @change="getEcharts11()"
                @blur="projectNameBlur(chartParams11)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.projectTeams"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.branchNames"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.pipelineNames"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.statusResults"
                @change="getEcharts11()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams11.envNames"
                @change="getEcharts11()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading11">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart11"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams12.dimension"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams12.timeZoom"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams12.timeRangeDays"
                @change="timeRangeDaysChange12(chartParams12.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu12"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText12"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus12"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates12"
                    range
                    no-title
                    @change="dateRangeSubmit12()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates12()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.projectNames"
                @change="getEcharts12()"
                @blur="projectNameBlur(chartParams12)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.projectTeams"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.branchNames"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.pipelineNames"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.statusResults"
                @change="getEcharts12()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams12.envNames"
                @change="getEcharts12()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading12">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart12"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams13.dimension"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams13.timeZoom"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams13.timeRangeDays"
                @change="timeRangeDaysChange13(chartParams13.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu13"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText13"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus13"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates13"
                    range
                    no-title
                    @change="dateRangeSubmit13()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates13()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.projectNames"
                @change="getEcharts13()"
                @blur="projectNameBlur(chartParams13)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.projectTeams"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.branchNames"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.pipelineNames"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.statusResults"
                @change="getEcharts13()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams13.envNames"
                @change="getEcharts13()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading13">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart13"></canvas>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-select
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams14.dimension"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams14.timeZoom"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams14.timeRangeDays"
                @change="timeRangeDaysChange14(chartParams14.timeRangeDays)"
              ></v-select>
              <template>
                <v-menu
                  v-model="menu14"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText14"
                      :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range_custom')"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      :disabled="timeRangeStatus14"
                      class="mr-8"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates14"
                    range
                    no-title
                    @change="dateRangeSubmit14()"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      small
                      @click="clearDates14()"
                    >
                      {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
              <v-select
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.projectNames"
                @change="getEcharts14()"
                @blur="projectNameBlur(chartParams14)"
              ></v-select>
              <v-select
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.projectTeams"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.branchNames"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.pipelineNames"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.statusResults"
                @change="getEcharts14()"
              ></v-select>
              <v-select
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams14.envNames"
                @change="getEcharts14()"
              ></v-select>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading14">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart14"></canvas>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </page-card>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import request from '@/utils/request'
import { echartOption } from '@/services/echartOption'
import { colorList } from '@/services/colorList'
import {vuetify} from '@/plugins/vuetify'

Chart.register(...registerables)
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: 'checkQuotas',
  components: { PageCard },
  data () {
    return {
      tabValue: 0,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      menu7: false,
      menu8: false,
      menu9: false,
      menu10: false,
      menu11: false,
      menu12: false,
      menu13: false,
      menu14: false,
      cardLoading: true,
      cardLoading2: true,
      cardLoading3: true,
      cardLoading4: true,
      cardLoading5: true,
      cardLoading6: true,
      cardLoading7: true,
      cardLoading8: true,
      cardLoading9: true,
      cardLoading10: true,
      cardLoading11: true,
      cardLoading12: true,
      cardLoading13: true,
      cardLoading14: true,
      dates: [],
      dates2: [],
      dates3: [],
      dates4: [],
      dates5: [],
      dates6: [],
      dates7: [],
      dates8: [],
      dates9: [],
      dates10: [],
      dates11: [],
      dates12: [],
      dates13: [],
      dates14: [],
      timeRangeStatus: true,
      timeRangeStatus2: true,
      timeRangeStatus3: true,
      timeRangeStatus4: true,
      timeRangeStatus5: true,
      timeRangeStatus6: true,
      timeRangeStatus7: true,
      timeRangeStatus8: true,
      timeRangeStatus9: true,
      timeRangeStatus10: true,
      timeRangeStatus11: true,
      timeRangeStatus12: true,
      timeRangeStatus13: true,
      timeRangeStatus14: true,
      dimensionList: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_all'), value: 'all' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_name'), value: 'projectName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_team'), value: 'projectTeam' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_branch_name'), value: 'branchName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_status_result'), value: 'statusResult' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_env_name'), value: 'envName' },
      ],
      timeZoomList: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_range_year'), value: 'year' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_range_month'), value: 'month' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_range_week'), value: 'week' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_range_day'), value: 'day' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_range_hour'), value: 'hour' },
      ],
      timeRangeDaysList: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_7'), value: 7 },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_14'), value: 14 },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_30'), value: 30 },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_90'), value: 90 },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_365'), value: 365 },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_time_range_days_custom'), value: 0 },
      ],
      chartParams: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        // moduleNames: [],
        envNames: [],
        // moduleTypes: []
      },
      chartParams2: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        // moduleNames: [],
        envNames: [],
        // moduleTypes: []
      },
      chartParams3: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        // moduleNames: [],
        envNames: [],
        // moduleTypes: []
      },
      chartParams4: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        // moduleNames: [],
        envNames: [],
        // moduleTypes: []
      },
      chartParams5: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams6: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams7: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams8: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams9: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams10: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams11: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams12: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams13: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      chartParams14: {
        dimension: 'projectName',
        timeZoom: 'day',
        timeRangeDays: 7,
        timeRange: {
          startDate: '',
          endDate: ''
        },
        projectNames: [],
        projectTeams: [],
        pipelineNames: [],
        branchNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        envNames: [],
      },
      statusResultsList: [],
      projectNamesList: [],
      projectTeamsList: [],
      branchNamesList: [],
      pipelineNamesList: [],
      envNamesList: [],
      // moduleNamesList: [],
      // moduleTypesList: [],
      config: {},
      config2: {},
      config3: {},
      config4: [],
      config5: {},
      config6: {},
      config7: {},
      config8: {},
      config9: {},
      config10: {},
      config11: {},
      config12: {},
      config13: {},
      config14: {},
      myChart: '',
      myChart2: '',
      myChart3: '',
      myChart4: [],
      myChart5: '',
      myChart6: '',
      myChart7: '',
      myChart8: '',
      myChart9: '',
      myChart10: '',
      myChart11: '',
      myChart12: '',
      myChart13: '',
      myChart14: '',
      e2: '0',
      e3: '0',
      e4: '0',
      e5: '0',
      e6: '0',
      e7: '0',
      e8: '0',
      e9: '0',
      e10: '0',
      e11: '0',
      e12: '0',
      e13: '0',
      e14: '0',
    }
  },
  created () {
    const vm = this
    request.get('/metrics/checkQuotas/options').then(response => {
      vm.searchData = response.data
      vm.statusResultsList = response.data.statusResults
      vm.projectNamesList = response.data.projectNames
      vm.projectTeamsList = response.data.projectTeams
      vm.branchNamesList = response.data.branchNames
      vm.pipelineNamesList = response.data.pipelineNames
      vm.envNamesList = response.data.envNames
    })
  },
  mounted () {
    const vm = this
    var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
    request.post('/metrics/checkQuotas/count', vm.chartParams).then(response => {
      vm.config = {
        type: 'line',
        data: {
          labels: response.data.labels,
          datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
            i++
            return {
              label: key,
              data: value,
              backgroundColor: colorList2[i%(colorList2.length)],
              borderColor: colorList2[i%(colorList2.length)],
            }
          })
        },
        options: echartOption
      }
      vm.myChart = new Chart(
        vm.$refs.testChart,
        vm.config
      )
      vm.cardLoading = false
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
      vm.cardLoading = false
    })
  },
  methods: {
    change2 () {
      const vm = this
      if(vm.e2 === '0'){
        vm.getEcharts2()
      }
      vm.e2 = '1'
    },
    change3 () {
      const vm = this
      if(vm.e3 === '0'){
        vm.getEcharts3()
      }
      vm.e3 = '1'
    },
    change4 () {
      const vm = this
      if(vm.e4 === '0'){
        vm.getEcharts4()
      }
      vm.e4 = '1'
    },
    change5 () {
      const vm = this
      if(vm.e5 === '0'){
        vm.getEcharts5()
      }
      vm.e5 = '1'
    },
    change6 () {
      const vm = this
      if(vm.e6 === '0'){
        vm.getEcharts6()
      }
      vm.e6 = '1'
    },
    change7 () {
      const vm = this
      if(vm.e7 === '0'){
        vm.getEcharts7()
      }
      vm.e7 = '1'
    },
    change8 () {
      const vm = this
      if(vm.e8 === '0'){
        vm.getEcharts8()
      }
      vm.e8 = '1'
    },
    change9 () {
      const vm = this
      if(vm.e9 === '0'){
        vm.getEcharts9()
      }
      vm.e9 = '1'
    },
    change10 () {
      const vm = this
      if(vm.e10 === '0'){
        vm.getEcharts10()
      }
      vm.e10 = '1'
    },
    change11 () {
      const vm = this
      if(vm.e11 === '0'){
        vm.getEcharts11()
      }
      vm.e11 = '1'
    },
    change12 () {
      const vm = this
      if(vm.e12 === '0'){
        vm.getEcharts12()
      }
      vm.e12 = '1'
    },
    change13 () {
      const vm = this
      if(vm.e13 === '0'){
        vm.getEcharts13()
      }
      vm.e13 = '1'
    },
    change14 () {
      const vm = this
      if(vm.e14 === '0'){
        vm.getEcharts14()
      }
      vm.e14 = '1'
    },
    getEcharts () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams.timeRangeDays == 0 && vm.dates.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart){
          vm.myChart.destroy()
        }
        vm.cardLoading = true
        const dates = [...vm.dates].sort()
        vm.chartParams.timeRange.startDate = dates[0]
        vm.chartParams.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/count', vm.chartParams).then(response => {
          vm.config = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.myChart = new Chart(
            vm.$refs.testChart,
            vm.config
          )
          vm.cardLoading = false
          vm.successTip(true, response.msg)
        }).catch(error => {
          vm.cardLoading = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts2 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams2.timeRangeDays == 0 && vm.dates2.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart2){
          vm.myChart2.destroy()
        }
        vm.cardLoading2 = true
        const dates = [...vm.dates2].sort()
        vm.chartParams2.timeRange.startDate = dates[0]
        vm.chartParams2.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/duration', vm.chartParams2).then(response => {
          vm.config2 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config2.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.myChart2 = new Chart(
            vm.$refs.durationChart,
            vm.config2
          )
          vm.cardLoading2 = false
          vm.successTip(true, response.msg)
        }).catch(error => {
          vm.cardLoading2 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts3 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams3.timeRangeDays == 0 && vm.dates3.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart3){
          vm.myChart3.destroy()
        }
        vm.cardLoading3 = true
        const dates = [...vm.dates3].sort()
        vm.chartParams3.timeRange.startDate = dates[0]
        vm.chartParams3.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/countWeekly', vm.chartParams3).then(response => {
          vm.config3 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config3.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart3 = new Chart(
            vm.$refs.testChart3,
            vm.config3
          )
          vm.cardLoading3 = false
        }).catch(error => {
          vm.cardLoading3 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts4 () {
      const vm = this
      var colorList2 = [...colorList]
      var options = JSON.parse(JSON.stringify(echartOption))
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams4.timeRangeDays == 0 && vm.dates4.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        vm.statusResultsList.map((item,index) => {
          if(vm.myChart4[index]){
            vm.myChart4[index].destroy()
          }
          vm.cardLoading4 = true
          const dates = [...vm.dates4].sort()
          vm.chartParams4.timeRange.startDate = dates[0]
          vm.chartParams4.timeRange.endDate = dates[1]
          request.post(`/metrics/checkQuotas/status/${item}`, vm.chartParams4).then(response => {
            vm.config4[index] = {
              type: 'line',
              data: {
                labels: response.data.labels,
                datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                  i++
                  return {
                    label: key,
                    data: value,
                    backgroundColor: colorList2[i%(colorList2.length)],
                    borderColor: colorList2[i%(colorList2.length)],
                  }
                })
              },
              options: options
            }
            vm.successTip(true, response.msg)
            vm.config4[index].options.plugins.title = {
              display: true,
              text: item
            }
            var ctx = document.getElementById(`statusChart${index}`)
            vm.myChart4[index] = new Chart(
              ctx,
              vm.config4[index]
            )
            vm.cardLoading4 = false
          }).catch(error => {
            vm.cardLoading4 = false
            vm.errorTip(true, error.response.data.msg)
          })
        })
      }
    },
    getEcharts5 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams5.timeRangeDays == 0 && vm.dates5.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart5){
          vm.myChart5.destroy()
        }
        vm.cardLoading5 = true
        const dates = [...vm.dates5].sort()
        vm.chartParams5.timeRange.startDate = dates[0]
        vm.chartParams5.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedMemoryRequest', vm.chartParams5).then(response => {
          vm.config5 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config5.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart5 = new Chart(
            vm.$refs.testChart5,
            vm.config5
          )
          vm.cardLoading5 = false
        }).catch(error => {
          vm.cardLoading5 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts6 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams6.timeRangeDays == 0 && vm.dates6.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart6){
          vm.myChart6.destroy()
        }
        vm.cardLoading6 = true
        const dates = [...vm.dates6].sort()
        vm.chartParams6.timeRange.startDate = dates[0]
        vm.chartParams6.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedMemoryLimit', vm.chartParams6).then(response => {
          vm.config6 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config6.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart6 = new Chart(
            vm.$refs.testChart6,
            vm.config6
          )
          vm.cardLoading6 = false
        }).catch(error => {
          vm.cardLoading6 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts7 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams7.timeRangeDays == 0 && vm.dates7.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart7){
          vm.myChart7.destroy()
        }
        vm.cardLoading7 = true
        const dates = [...vm.dates7].sort()
        vm.chartParams7.timeRange.startDate = dates[0]
        vm.chartParams7.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedCpuRequest', vm.chartParams7).then(response => {
          vm.config7 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config7.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart7 = new Chart(
            vm.$refs.testChart7,
            vm.config7
          )
          vm.cardLoading7 = false
        }).catch(error => {
          vm.cardLoading7 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts8 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams8.timeRangeDays == 0 && vm.dates8.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart8){
          vm.myChart8.destroy()
        }
        vm.cardLoading8 = true
        const dates = [...vm.dates8].sort()
        vm.chartParams8.timeRange.startDate = dates[0]
        vm.chartParams8.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedCpuLimit', vm.chartParams8).then(response => {
          vm.config8 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config8.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart8 = new Chart(
            vm.$refs.testChart8,
            vm.config8
          )
          vm.cardLoading8 = false
        }).catch(error => {
          vm.cardLoading8 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts9 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams9.timeRangeDays == 0 && vm.dates9.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart9){
          vm.myChart9.destroy()
        }
        vm.cardLoading9 = true
        const dates = [...vm.dates9].sort()
        vm.chartParams9.timeRange.startDate = dates[0]
        vm.chartParams9.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedPods', vm.chartParams9).then(response => {
          vm.config9 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config9.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart9 = new Chart(
            vm.$refs.testChart9,
            vm.config9
          )
          vm.cardLoading9 = false
        }).catch(error => {
          vm.cardLoading9 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts10 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams10.timeRangeDays == 0 && vm.dates10.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart10){
          vm.myChart10.destroy()
        }
        vm.cardLoading10 = true
        const dates = [...vm.dates10].sort()
        vm.chartParams10.timeRange.startDate = dates[0]
        vm.chartParams10.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedMemoryRequestRate', vm.chartParams10).then(response => {
          vm.config10 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config10.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart10 = new Chart(
            vm.$refs.testChart10,
            vm.config10
          )
          vm.cardLoading10 = false
        }).catch(error => {
          vm.cardLoading10 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts11 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams11.timeRangeDays == 0 && vm.dates11.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart11){
          vm.myChart11.destroy()
        }
        vm.cardLoading11 = true
        const dates = [...vm.dates11].sort()
        vm.chartParams11.timeRange.startDate = dates[0]
        vm.chartParams11.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedMemoryLimitRate', vm.chartParams11).then(response => {
          vm.config11 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config11.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart11 = new Chart(
            vm.$refs.testChart11,
            vm.config11
          )
          vm.cardLoading11 = false
        }).catch(error => {
          vm.cardLoading11 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts12 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams12.timeRangeDays == 0 && vm.dates12.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart12){
          vm.myChart12.destroy()
        }
        vm.cardLoading12 = true
        const dates = [...vm.dates12].sort()
        vm.chartParams12.timeRange.startDate = dates[0]
        vm.chartParams12.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedCpuRequestRate', vm.chartParams12).then(response => {
          vm.config12 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config12.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart12 = new Chart(
            vm.$refs.testChart12,
            vm.config12
          )
          vm.cardLoading12 = false
        }).catch(error => {
          vm.cardLoading12 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts13 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams13.timeRangeDays == 0 && vm.dates13.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart13){
          vm.myChart13.destroy()
        }
        vm.cardLoading13 = true
        const dates = [...vm.dates13].sort()
        vm.chartParams13.timeRange.startDate = dates[0]
        vm.chartParams13.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedCpuLimitRate', vm.chartParams13).then(response => {
          vm.config13 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config13.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart13 = new Chart(
            vm.$refs.testChart13,
            vm.config13
          )
          vm.cardLoading13 = false
        }).catch(error => {
          vm.cardLoading13 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    getEcharts14 () {
      const vm = this
      var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
      if(vm.chartParams14.timeRangeDays == 0 && vm.dates14.length == 0){
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
      }else{
        if(vm.myChart14){
          vm.myChart14.destroy()
        }
        vm.cardLoading14 = true
        const dates = [...vm.dates14].sort()
        vm.chartParams14.timeRange.startDate = dates[0]
        vm.chartParams14.timeRange.endDate = dates[1]
        request.post('/metrics/checkQuotas/usedPodsRate', vm.chartParams14).then(response => {
          vm.config14 = {
            type: 'line',
            data: {
              labels: response.data.labels,
              datasets: Object.entries(response.data.datasets).map(([key, value],index) => {
                i++
                return {
                  label: key,
                  data: value,
                  backgroundColor: colorList2[i%(colorList2.length)],
                  borderColor: colorList2[i%(colorList2.length)],
                }
              })
            },
            options: echartOption
          }
          vm.config14.options.plugins.title = {
              display: false,
              text: ''
          }
          vm.successTip(true, response.msg)
          vm.myChart14 = new Chart(
            vm.$refs.testChart14,
            vm.config14
          )
          vm.cardLoading14 = false
        }).catch(error => {
          vm.cardLoading14 = false
          vm.errorTip(true, error.response.data.msg)
        })
      }
    },
    timeRangeDaysChange (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus = false
      }else{
        this.dates = []
        this.timeRangeStatus = true
        this.getEcharts()
      }
    },
    timeRangeDaysChange2 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus2 = false
      }else{
        this.dates = []
        this.timeRangeStatus2 = true
        this.getEcharts2()
      }
    },
    timeRangeDaysChange3 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus3 = false
      }else{
        this.dates = []
        this.timeRangeStatus3 = true
        this.getEcharts3()
      }
    },
    timeRangeDaysChange4 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus4 = false
      }else{
        this.dates = []
        this.timeRangeStatus4 = true
        this.getEcharts4()
      }
    },
    timeRangeDaysChange5 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus5 = false
      }else{
        this.dates = []
        this.timeRangeStatus5 = true
        this.getEcharts5()
      }
    },
    timeRangeDaysChange6 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus6 = false
      }else{
        this.dates = []
        this.timeRangeStatus6 = true
        this.getEcharts6()
      }
    },
    timeRangeDaysChange7 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus7 = false
      }else{
        this.dates = []
        this.timeRangeStatus7 = true
        this.getEcharts7()
      }
    },
    timeRangeDaysChange8 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus8 = false
      }else{
        this.dates = []
        this.timeRangeStatus8 = true
        this.getEcharts8()
      }
    },
    timeRangeDaysChange9 (value) {
      if(value == 0){
        this.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_select_time_range_days_custom'))
        this.timeRangeStatus9 = false
      }else{
        this.dates = []
        this.timeRangeStatus9 = true
        this.getEcharts9()
      }
    },
    projectNameBlur (chartParams) {
      const vm = this
      if(chartParams.projectNames.length >0){
        var newBranchNames = []
        var newPipelineNames = []
        // var newModuleNames = []
        var newEnvNames = []
        chartParams.projectNames.forEach(item => {
          vm.searchData.projects.map(i => {
            if(i.projectName == item){
              newBranchNames.push(...i.branchNames)
              newPipelineNames.push(...i.pipelineNames)
              // newModuleNames.push(...i.moduleNames)
              newEnvNames.push(...i.envNames)
              vm.branchNamesList = [... new Set(newBranchNames)]
              vm.pipelineNamesList = [... new Set(newPipelineNames)]
              // vm.moduleNamesList = [... new Set(newModuleNames)]
              vm.envNamesList = [... new Set(newEnvNames)]
            }
          })
        })
      }else{
        vm.branchNamesList = vm.searchData.branchNames
        vm.pipelineNamesList = vm.searchData.pipelineNames
        // vm.moduleNamesList = vm.searchData.moduleNames
        vm.envNamesList = vm.searchData.envNames
      }
    },
    dateRangeSubmit() {
      this.menu1 = false
      this.getEcharts()
    },
    dateRangeSubmit2() {
      this.menu2 = false
      this.getEcharts2()
    },
    dateRangeSubmit3() {
      this.menu3 = false
      this.getEcharts3()
    },
    dateRangeSubmit4() {
      this.menu4 = false
      this.getEcharts4()
    },
    dateRangeSubmit5() {
      this.menu5 = false
      this.getEcharts5()
    },
    dateRangeSubmit6() {
      this.menu6 = false
      this.getEcharts6()
    },
    dateRangeSubmit7() {
      this.menu7 = false
      this.getEcharts7()
    },
    dateRangeSubmit8() {
      this.menu8 = false
      this.getEcharts8()
    },
    dateRangeSubmit9() {
      this.menu9 = false
      this.getEcharts9()
    },
    dateRangeSubmit10() {
      this.menu10 = false
      this.getEcharts10()
    },
    dateRangeSubmit11() {
      this.menu11 = false
      this.getEcharts11()
    },
    dateRangeSubmit12() {
      this.menu12 = false
      this.getEcharts12()
    },
    dateRangeSubmit13() {
      this.menu13 = false
      this.getEcharts13()
    },
    dateRangeSubmit14() {
      this.menu14 = false
      this.getEcharts14()
    },
    clearDates() {
      this.dates = []
      this.menu1 = false
    },
    clearDates2() {
      this.dates2 = []
      this.menu2 = false
    },
    clearDates3() {
      this.dates3 = []
      this.menu3 = false
    },
    clearDates4() {
      this.dates4 = []
      this.menu4 = false
    },
    clearDates5() {
      this.dates5 = []
      this.menu5 = false
    },
    clearDates6() {
      this.dates6 = []
      this.menu6 = false
    },
    clearDates7() {
      this.dates7 = []
      this.menu7 = false
    },
    clearDates8() {
      this.dates8 = []
      this.menu8 = false
    },
    clearDates9() {
      this.dates9 = []
      this.menu9 = false
    },
    clearDates10() {
      this.dates10 = []
      this.menu10 = false
    },
    clearDates11() {
      this.dates11 = []
      this.menu11 = false
    },
    clearDates12() {
      this.dates12 = []
      this.menu12 = false
    },
    clearDates13() {
      this.dates13 = []
      this.menu13 = false
    },
    clearDates14() {
      this.dates14 = []
      this.menu14 = false
    },
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    dateRangeText2 () {
      return this.dates2.join(' ~ ')
    },
    dateRangeText3 () {
      return this.dates3.join(' ~ ')
    },
    dateRangeText4 () {
      return this.dates4.join(' ~ ')
    },
    dateRangeText5 () {
      return this.dates5.join(' ~ ')
    },
    dateRangeText6 () {
      return this.dates6.join(' ~ ')
    },
    dateRangeText7 () {
      return this.dates7.join(' ~ ')
    },
    dateRangeText8 () {
      return this.dates8.join(' ~ ')
    },
    dateRangeText9 () {
      return this.dates9.join(' ~ ')
    },
    dateRangeText10 () {
      return this.dates10.join(' ~ ')
    },
    dateRangeText11 () {
      return this.dates11.join(' ~ ')
    },
    dateRangeText12 () {
      return this.dates12.join(' ~ ')
    },
    dateRangeText13 () {
      return this.dates13.join(' ~ ')
    },
    dateRangeText14 () {
      return this.dates14.join(' ~ ')
    },
  }
}
</script>

<style scoped>

</style>
