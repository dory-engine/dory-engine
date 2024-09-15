<template>
  <div>
    <div v-for="(item, i) in (steps || [])" :key="i">
      <br/>
      <v-card class="mb-4">
        <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_step_desc')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_step_action')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{item.stepName}}
                  </td>
                  <td>
                    {{item.stepAction}}
                  </td>
                  <td>
                    <v-btn small class="my-1" color="primary" @click="() => {
                      runLogs(item.runName, item.stepID)
                    }">{{$vuetify.lang.t('$vuetify.lang_menu_view_logs')}}</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_module_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_run_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_start_time')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_status')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div><router-link :to="{name: 'CicdModule', params: { projectName: item.projectName, moduleName: item.moduleName, moduleType: item.moduleType }}">{{item.moduleName}}</router-link></div>
                    <div>{{item.moduleType}}</div>
                  </td>
                  <td>
                    <router-link :to="{name: 'CicdRun', params: { 'runName': item.runName }}">
                      {{ item.runName }}
                    </router-link>
                  </td>
                  <td>
                    {{item.status.startTime}}
                  </td>
                  <td>
                    <div>{{ item.status.duration }}</div>,
                    <v-chip small class="mb-1 white--text" :color="getColor(item.status.result)">
                      {{ item.status.result }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table v-if="stepKind === 'build'">
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_branch_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_build_path')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_build_env')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{item.stepDetail.branchName }}
                  </td>
                  <td>
                    {{item.stepDetail.buildPath }}
                  </td>
                  <td>
                    {{item.stepDetail.buildEnv }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table v-if="stepKind === 'build'">
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_build_command')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_build_check')}}
                  </th>
                  <th v-show="item.stepDetail.architecture" class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_architecture')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_latest_commit')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div v-for="(row, i) in (item.stepDetail.buildCmds || [])" :key="i">
                      {{ row }}
                    </div>
                  </td>
                  <td>
                    <div v-for="(row, i) in (item.stepDetail.buildChecks || [])" :key="i">
                      {{ row }}
                    </div>
                  </td>
                  <td v-show="item.stepDetail.architecture">
                    <v-chip small class="mr-2" color="primary">{{ item.stepDetail.architecture }}</v-chip>
                  </td>
                  <td>
                    <a v-if="item.stepDetail.gitURL" :href="item.stepDetail.gitURL" target="_blank">{{item.stepDetail.latestCommit.substring(0, 8)}}</a>
                    <div v-else>{{ item.stepDetail.latestCommit.substring(0, 8) }}</div>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table v-if="stepKind === 'package'">
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_branch_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_architecture')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_tag_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_image_size')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_docker_file')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <v-chip small class="mr-2" color="primary">{{ item.stepDetail.branchName }}</v-chip>
                  </td>
                  <td>
                    <v-chip small class="mr-2" color="primary">{{ item.stepDetail.architecture }}</v-chip>
                  </td>
                  <td>
                    <a v-if="item.stepDetail.imageURL" :href="item.stepDetail.imageURL" target="_blank">{{item.stepDetail.tagName}}</a>
                    <span v-else>{{item.stepDetail.tagName}}</span>
                  </td>
                  <td>
                    {{item.stepDetail.size }}
                  </td>
                  <td>
                    <v-dialog width="800" delay= "3000">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}
                        </v-card-title>
                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            :monacoOptions="{
                              value: item.stepDetail.dockerFile,
                              automaticLayout: true,
                              readOnly: true,
                              theme: 'vs-dark',
                              language: 'dockerfile'
                            }"
                            :height="500"
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table v-if="stepKind === 'artifact'">
              <thead>
                <tr>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_branch_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_artifact_name')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_artifact_files')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_artifact_size')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ item.stepDetail.branchName }}
                  </td>
                  <td>
                    <a v-if="item.stepDetail.artifactURL" :href="item.stepDetail.artifactURL" target="_blank">{{item.stepDetail.tarName}}</a>
                    <span v-else>{{item.stepDetail.tarName}}</span>
                  </td>
                  <td>
                    <v-dialog width="800" delay= "3000">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {{$vuetify.lang.t('$vuetify.lang_menu_view_detail')}}
                        </v-card-title>
                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            :monacoOptions="{
                              value: getArtifactsYaml(item.stepDetail.artifacts),
                              automaticLayout: true,
                              readOnly: true,
                              theme: 'vs-dark',
                              language: 'yaml'
                            }"
                            :height="300"
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                  <td>
                    {{item.stepDetail.size }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
import Monaco from "@/lib/monaco/Monaco"
import YAML from "yamljs";
export default {
  name: 'DailogSteps',
  props: ['stepKind', 'ids', 'runLogs'],
  components: {
    Monaco,
  },
  inject: ['successTip', 'errorTip', 'warnTip'],
  data () {
    return {
      steps: [],
    }
  },
  created () {
    const vm = this
    let ids = {
      ids: vm.ids,
    }
    request.post('cicd/steps/'+ vm.stepKind, ids).then(response => {
      vm.steps = response.data.steps
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
  },
  methods: {
    getArtifactsYaml(artifacts) {
      return YAML.stringify(artifacts, 4)
    },
    getColor(status) {
      var chipColor = 'grey'
      switch (status) {
        case 'FAIL':
          chipColor = 'red'
          break
        case 'RUNNING':
          chipColor = 'blue'
          break
        case 'SUCCESS':
          chipColor = 'green'
          break
        case 'ABORT':
          chipColor = 'grey'
          break
        case 'INPUT':
          chipColor = 'orange'
          break
        case 'PAUSE':
          chipColor = 'blue-grey'
          break
      }
      return chipColor
    },
  },
  computed: {
  }
}
</script>
