<template>
  <page-card :name="$vuetify.lang.t('$vuetify.lang_menu_metrics_custom_steps')">
    <v-card-text>
      <v-tabs v-model="tabValue">
        <v-tab>{{$vuetify.lang.t('$vuetify.lang_view_metrics_custom_steps_count')}}</v-tab>
        <v-tab @change="change2()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_custom_steps_duration')}}</v-tab>
        <v-tab @change="change3()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_custom_steps_weekly')}}</v-tab>
        <v-tab @change="change4()">{{$vuetify.lang.t('$vuetify.lang_view_metrics_custom_steps_status_rate')}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabValue">
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams.dimension"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams.timeZoom"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams.timeRangeDays"
                @change="timeRangeDaysChange(chartParams.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.projectNames"
                @change="getEcharts()"
                @blur="projectNameBlur(chartParams)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.projectTeams"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.branchNames"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.pipelineNames"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.statusResults"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.envNames"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.moduleNames"
                @change="getEcharts()"
              ></v-autocomplete>
              <v-autocomplete
                :items="customStepNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_custom_step_type')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.customStepNames"
                @change="getEcharts()"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams2.dimension"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams2.timeZoom"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams2.timeRangeDays"
                @change="timeRangeDaysChange2(chartParams2.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.projectNames"
                @change="getEcharts2()"
                @blur="projectNameBlur(chartParams2)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.projectTeams"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.branchNames"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.pipelineNames"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.statusResults"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.envNames"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.moduleNames"
                @change="getEcharts2()"
              ></v-autocomplete>
              <v-autocomplete
                :items="customStepNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_custom_step_type')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.customStepNames"
                @change="getEcharts2()"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="[
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_range_day'), value: 'day' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_range_hour'), value: 'hour' },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams3.timeZoom"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams3.timeRangeDays"
                @change="timeRangeDaysChange3(chartParams3.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.projectNames"
                @change="getEcharts3()"
                @blur="projectNameBlur(chartParams3)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.projectTeams"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.branchNames"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.pipelineNames"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.statusResults"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.envNames"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.moduleNames"
                @change="getEcharts3()"
              ></v-autocomplete>
              <v-autocomplete
                :items="customStepNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_custom_step_type')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.customStepNames"
                @change="getEcharts3()"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="[
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_all'), value: 'all' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_project_name'), value: 'projectName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_project_team'), value: 'projectTeam' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_branch_name'), value: 'branchName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_env_name'), value: 'envName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_module_name'), value: 'moduleName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_custom_step_type'), value: 'customStepName' },
                ]"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams4.dimension"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams4.timeZoom"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams4.timeRangeDays"
                @change="timeRangeDaysChange4(chartParams4.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.projectNames"
                @change="getEcharts4()"
                @blur="projectNameBlur(chartParams4)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.projectTeams"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.branchNames"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.pipelineNames"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="envNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_env_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.envNames"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.moduleNames"
                @change="getEcharts4()"
              ></v-autocomplete>
              <v-autocomplete
                :items="customStepNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_custom_step_type')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.customStepNames"
                @change="getEcharts4()"
              ></v-autocomplete>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading4">
            <div style="width: 100%; height: 400px; position: relative" v-for="(item,index) in statusResultsList">
              <canvas :ref="`statusChart${index}`" :id="`statusChart${index}`"></canvas>
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
  name: 'customSteps',
  components: { PageCard },
  data () {
    return {
      tabValue: 0,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      cardLoading: true,
      cardLoading2: true,
      cardLoading3: true,
      cardLoading4: true,
      dates: [],
      dates2: [],
      dates3: [],
      dates4: [],
      timeRangeStatus: true,
      timeRangeStatus2: true,
      timeRangeStatus3: true,
      timeRangeStatus4: true,
      dimensionList: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_all'), value: 'all' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_name'), value: 'projectName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_team'), value: 'projectTeam' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_branch_name'), value: 'branchName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_status_result'), value: 'statusResult' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_env_name'), value: 'envName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_module_name'), value: 'moduleName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_custom_step_type'), value: 'customStepName' },
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
        envNames: [],
        moduleNames: [],
        customStepNames: []
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
        envNames: [],
        moduleNames: [],
        customStepNames: []
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
        envNames: [],
        moduleNames: [],
        customStepNames: []
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
        envNames: [],
        moduleNames: [],
        customStepNames: []
      },
      statusResultsList: [],
      projectNamesList: [],
      projectTeamsList: [],
      branchNamesList: [],
      pipelineNamesList: [],
      envNamesList: [],
      moduleNamesList: [],
      customStepNamesList: [],
      config: {},
      config2: {},
      config3: {},
      config4: [],
      myChart: '',
      myChart2: '',
      myChart3: '',
      myChart4: [],
      e2: '0',
      e3: '0',
      e4: '0',
    }
  },
  created () {
    const vm = this
    request.get('/metrics/customSteps/options').then(response => {
      vm.searchData = response.data
      vm.statusResultsList = response.data.statusResults
      vm.projectNamesList = response.data.projectNames
      vm.projectTeamsList = response.data.projectTeams
      vm.branchNamesList = response.data.branchNames
      vm.pipelineNamesList = response.data.pipelineNames
      vm.envNamesList = response.data.envNames
      vm.moduleNamesList = response.data.moduleNames
      vm.customStepNamesList = response.data.customStepNames
    })
  },
  mounted () {
    const vm = this
    var colorList2 = [...colorList]
      var i = Math.floor(Math.random() * colorList2.length);
    request.post('/metrics/customSteps/count', vm.chartParams).then(response => {
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
        request.post('/metrics/customSteps/count', vm.chartParams).then(response => {
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
        request.post('/metrics/customSteps/duration', vm.chartParams2).then(response => {
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
        request.post('/metrics/customSteps/countWeekly', vm.chartParams3).then(response => {
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
          request.post(`/metrics/customSteps/status/${item}`, vm.chartParams4).then(response => {
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
    projectNameBlur (chartParams) {
      const vm = this
      if(chartParams.projectNames.length >0){
        var newBranchNames = []
        var newPipelineNames = []
        var newModuleNames = []
        var newEnvNames = []
        chartParams.projectNames.forEach(item => {
          vm.searchData.projects.map(i => {
            if(i.projectName == item){
              newBranchNames.push(...i.branchNames)
              newPipelineNames.push(...i.pipelineNames)
              newModuleNames.push(...i.moduleNames)
              newEnvNames.push(...i.envNames)
              vm.branchNamesList = [... new Set(newBranchNames)]
              vm.pipelineNamesList = [... new Set(newPipelineNames)]
              vm.moduleNamesList = [... new Set(newModuleNames)]
              vm.envNamesList = [... new Set(newEnvNames)]
            }
          })
        })
      }else{
        vm.branchNamesList = vm.searchData.branchNames
        vm.pipelineNamesList = vm.searchData.pipelineNames
        vm.moduleNamesList = vm.searchData.moduleNames
        vm.envNamesList = vm.searchData.envNamesList
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
  }
}
</script>

<style scoped>

</style>
