<template>
  <page-card :name="$vuetify.lang.t('$vuetify.lang_menu_metrics_artifacts')">
    <v-card-text>
      <v-tabs v-model="tabValue">
        <v-tab>{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_count') }}</v-tab>
        <v-tab @change="change2()">{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_duration') }}</v-tab>
        <v-tab @change="change3()">{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_weekly') }}</v-tab>
        <v-tab @change="change4()">{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_status_rate') }}</v-tab>
        <v-tab @change="change5()">{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_average_size') }}</v-tab>
        <v-tab @change="change6()">{{ $vuetify.lang.t('$vuetify.lang_view_metrics_artifacts_total_size') }}</v-tab>
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
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.archNames"
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
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams.moduleNames"
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
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.archNames"
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
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams2.moduleNames"
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
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.archNames"
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
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams3.moduleNames"
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
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_arch_name'), value: 'archName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },
                  { text: $vuetify.lang.t('$vuetify.lang_form_metrics_dimension_module_name'), value: 'moduleName' },
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
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.archNames"
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
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams4.moduleNames"
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
        <v-tab-item>
          <v-form>
            <v-container class="d-flex flex-wrap">
              <v-autocomplete
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams5.dimension"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams5.timeZoom"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams5.timeRangeDays"
                @change="timeRangeDaysChange5(chartParams5.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.projectNames"
                @change="getEcharts5()"
                @blur="projectNameBlur(chartParams5)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.projectTeams"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.branchNames"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.archNames"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.pipelineNames"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.statusResults"
                @change="getEcharts5()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams5.moduleNames"
                @change="getEcharts5()"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="dimensionList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_dimension')"
                class="mr-8"
                dense
                v-model="chartParams6.dimension"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeZoomList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_range')"
                class="mr-8"
                dense
                v-model="chartParams6.timeZoom"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="timeRangeDaysList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_time_range')"
                class="mr-8"
                dense
                v-model="chartParams6.timeRangeDays"
                @change="timeRangeDaysChange6(chartParams6.timeRangeDays)"
              ></v-autocomplete>
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
              <v-autocomplete
                :items="projectNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.projectNames"
                @change="getEcharts6()"
                @blur="projectNameBlur(chartParams6)"
              ></v-autocomplete>
              <v-autocomplete
                :items="projectTeamsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_project_team')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.projectTeams"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="branchNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_branch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.branchNames"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="archNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_arch_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.archNames"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="pipelineNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_pipeline_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.pipelineNames"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="statusResultsList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_status')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.statusResults"
                @change="getEcharts6()"
              ></v-autocomplete>
              <v-autocomplete
                :items="moduleNamesList"
                :label="$vuetify.lang.t('$vuetify.lang_form_metrics_filter_by_module_name')"
                class="mr-8"
                dense
                small-chips
                multiple
                v-model="chartParams6.moduleNames"
                @change="getEcharts6()"
              ></v-autocomplete>
            </v-container>
          </v-form>
          <v-card :loading="cardLoading6">
            <div style="width: 100%; height: 450px; position: relative">
              <canvas ref="testChart6"></canvas>
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
  name: 'artifacts',
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
      cardLoading: true,
      cardLoading2: true,
      cardLoading3: true,
      cardLoading4: true,
      cardLoading5: true,
      cardLoading6: true,
      dates: [],
      dates2: [],
      dates3: [],
      dates4: [],
      dates5: [],
      dates6: [],
      timeRangeStatus: true,
      timeRangeStatus2: true,
      timeRangeStatus3: true,
      timeRangeStatus4: true,
      timeRangeStatus5: true,
      timeRangeStatus6: true,
      dimensionList: [
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_all'), value: 'all' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_name'), value: 'projectName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_project_team'), value: 'projectTeam' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_branch_name'), value: 'branchName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_arch_name'), value: 'archName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_pipeline_name'), value: 'pipelineName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_status_result'), value: 'statusResult' },
        { text: vuetify.preset.lang.t('$vuetify.lang_form_metrics_dimension_module_name'), value: 'moduleName' },
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
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
        archNames: [],
        statusResults: ['SUCCESS', 'FAIL'],
        moduleNames: [],
      },
      statusResultsList: [],
      projectNamesList: [],
      projectTeamsList: [],
      branchNamesList: [],
      archNamesList: [],
      pipelineNamesList: [],
      moduleNamesList: [],
      config: {},
      config2: {},
      config3: {},
      config4: [],
      configF: {},
      config6: {},
      myChart: '',
      myChart2: '',
      myChart3: '',
      myChart4: [],
      myChartf: '',
      myChart6: '',
      e2: '0',
      e3: '0',
      e4: '0',
      e5: '0',
      e6: '0',
    }
  },
  created () {
    const vm = this
    request.get('/metrics/artifacts/options').then(response => {
      vm.searchData = response.data
      vm.statusResultsList = response.data.statusResults
      vm.projectNamesList = response.data.projectNames
      vm.projectTeamsList = response.data.projectTeams
      vm.branchNamesList = response.data.branchNames
      vm.archNamesList = response.data.archNames
      vm.pipelineNamesList = response.data.pipelineNames
      vm.moduleNamesList = response.data.moduleNames
    })
  },
  mounted () {
    const vm = this
    var colorList2 = [...colorList]
    var i = Math.floor(Math.random() * colorList2.length);
    request.post('/metrics/artifacts/count', vm.chartParams).then(response => {
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
        request.post('/metrics/artifacts/count', vm.chartParams).then(response => {
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
        request.post('/metrics/artifacts/duration', vm.chartParams2).then(response => {
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
        request.post('/metrics/artifacts/countWeekly', vm.chartParams3).then(response => {
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
          request.post(`/metrics/artifacts/status/${item}`, vm.chartParams4).then(response => {
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
        if(vm.myChartf){
          vm.myChartf.destroy()
        }
        vm.cardLoading5 = true
        const dates = [...vm.dates5].sort()
        vm.chartParams5.timeRange.startDate = dates[0]
        vm.chartParams5.timeRange.endDate = dates[1]
        request.post('/metrics/artifacts/size', vm.chartParams5).then(response => {
          vm.configF = {
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
          vm.myChartf = new Chart(
            vm.$refs.testChart5,
            vm.configF
          )
          vm.cardLoading5 = false
          vm.successTip(true, response.msg)
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
        request.post('/metrics/artifacts/sizeTotal', vm.chartParams6).then(response => {
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
          vm.myChart6 = new Chart(
            vm.$refs.testChart6,
            vm.config6
          )
          vm.cardLoading6 = false
          vm.successTip(true, response.msg)
        }).catch(error => {
          vm.cardLoading6 = false
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
    projectNameBlur (chartParams) {
      const vm = this
      if(chartParams.projectNames.length >0){
        var newBranchNames = []
        var newPipelineNames = []
        var newModuleNames = []
        chartParams.projectNames.forEach(item => {
          vm.searchData.projects.map(i => {
            if(i.projectName == item){
              newBranchNames.push(...i.branchNames)
              newPipelineNames.push(...i.pipelineNames)
              newModuleNames.push(...i.moduleNames)
              vm.branchNamesList = [... new Set(newBranchNames)]
              vm.pipelineNamesList = [... new Set(newPipelineNames)]
              vm.moduleNamesList = [... new Set(newModuleNames)]
            }
          })
        })
      }else{
        vm.branchNamesList = vm.searchData.branchNames
        vm.pipelineNamesList = vm.searchData.pipelineNames
        vm.moduleNamesList = vm.searchData.moduleNames
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
    }
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
    }
  }
}
</script>

<style scoped>

</style>
