<template>
  <div class="project pa-4">
    <PageCard :name="targetProjectName + ' ' + $vuetify.lang.t('$vuetify.lang_view_project_artifact')">
      <v-card class="mb-4" :loading="cardLoading">
        <v-row>
          <v-col>
            <v-card-text>
              <template>
                <v-treeview
                  :active="activeArtifactIDs"
                  :items="trees"
                  activatable
                  rounded
                  item-key="artifactID"
                  item-text="name"
                  item-children="children"
                  open-on-click
                  @update:active="getActiveArtifactIDs"
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.ext">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                      {{ exts[item.ext] }}
                    </v-icon>
                  </template>
                </v-treeview>
              </template>
            </v-card-text>
          </v-col>
          <v-divider vertical v-if="activeArtifactIDs.length > 0"></v-divider>
          <v-col
            cols="12"
            md="6"
            v-if="activeArtifactIDs.length > 0"
          >
            <v-card
              class="mx-auto"
              max-width="450"
            >
              <v-toolbar
                color="primary"
                dark
              >
                <v-toolbar-title><small><b>{{ activeArtifact.fileName }}</b></small></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="downloadArtifact(activeArtifact.projectName, activeArtifact.artifactID, activeArtifact.fileName)">
                  <v-icon>mdi-download-circle-outline</v-icon>
                </v-btn>
                <v-btn icon @click="deleteArtifact(activeArtifact.projectName, activeArtifact.artifactID)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-toolbar>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_attribute') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_value') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}</v-chip></td>
                      <td>
                        <router-link :to="{ name: 'CicdProject', params: { projectName: activeArtifact.projectName }}">
                          {{ activeArtifact.projectName }}
                        </router-link>
                      </td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_pipeline_name') }}</v-chip></td>
                      <td>
                        <router-link :to="{ name: 'CicdPipeline', params: { pipelineName: activeArtifact.pipelineName }}">
                          {{ activeArtifact.pipelineName }}
                        </router-link>
                      </td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_run_name') }}</v-chip></td>
                      <td>
                        <router-link :to="{ name: 'CicdRun', params: { runName: activeArtifact.runName }}">
                          {{ activeArtifact.runName }}
                        </router-link>
                      </td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_namespace') }}</v-chip></td>
                      <td>
                        {{ activeArtifact.projectNamespace }}
                      </td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_path') }}</v-chip></td>
                      <td>{{ activeArtifact.filePath }}</td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_name') }}</v-chip></td>
                      <td><a @click="downloadArtifact(activeArtifact.projectName, activeArtifact.artifactID, activeArtifact.fileName)">{{ activeArtifact.fileName }}</a></td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_create_step') }}</v-chip></td>
                      <td>
                        <router-link :to="{ name: 'CicdStepsDetail', params: { stepID: activeArtifact.stepID }}">
                          {{ activeArtifact.stepAction }}
                        </router-link>
                      </td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_size') }}</v-chip></td>
                      <td>{{ activeArtifact.size }} / {{ activeArtifact.fileSize }}</td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_file_type') }}</v-chip></td>
                      <td>{{ activeArtifact.fileMimeType }}</td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_create_time') }}</v-chip></td>
                      <td>{{ activeArtifact.createTime }}</td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_md5_checksum') }}</v-chip></td>
                      <td>{{ activeArtifact.checksumMd5 }}</td>
                    </tr>
                    <tr>
                      <td><v-chip small>{{ $vuetify.lang.t('$vuetify.lang_view_project_artifact_sha1_checksum') }}</v-chip></td>
                      <td>{{ activeArtifact.checksumSha1 }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </PageCard>
  </div>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard'
import request from '@/utils/request'
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: "Project",
  components: {
    PageCard,
  },
  data: () => ({
    cardLoading: true,
    targetProjectName: '',
    targetArtifactID: '',
    userToken: '',
    activeArtifactIDs: [],
    activeArtifact: {
      artifactID: '',
    },
    artifacts: [],
    trees: [],
    exts: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
      zip: 'mdi-zip-box-outline',
      gz: 'mdi-zip-box-outline',
    },
  }),
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    vm.targetProjectName = vm.$route.params.projectName
    if (vm.$route.params.artifactID !== undefined) {
      vm.targetArtifactID = vm.$route.params.artifactID
    }
    vm.activeArtifactIDs = []
    if (vm.targetArtifactID !== '') {
      vm.activeArtifactIDs.push(vm.targetArtifactID)
    }
    vm.getArtifact()
  },
  methods: {
    getArtifact() {
      const vm = this
      request.get(`/cicd/artifact/${vm.targetProjectName}`).then(response => {
        vm.artifacts = response.data.artifacts
        vm.trees = response.data.trees
        vm.getActiveArtifact()
        vm.cardLoading = false
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    getActiveArtifactIDs(val) {
      const vm = this
      vm.activeArtifactIDs = val
      vm.getActiveArtifact()
    },
    getActiveArtifact() {
      const vm = this
      vm.activeArtifact = {
        artifactID: '',
      }
      if (vm.activeArtifactIDs.length > 0) {
        vm.artifacts.forEach(row => {
          if (row.artifactID === vm.activeArtifactIDs[0]) {
            vm.activeArtifact = row
          }
        })
      }
    },
    downloadArtifact(projectName, artifactID, fileName) {
      const vm = this
      vm.successTip(true, vuetify.preset.lang.t('$vuetify.lang_view_now_downloading'))
      request.get(`/cicd/artifact/${projectName}/${artifactID}`, {responseType: 'blob'}).then(response => {
        var blob = response
        var a = document.createElement('a')
        var url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    deleteArtifact(projectName, artifactID) {
      const vm = this
      request.delete(`/cicd/artifact/${projectName}/${artifactID}`).then(response => {
        vm.successTip(true, response.msg)
        vm.activeArtifactIDs = []
        vm.getArtifact()
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
  },
}
</script>
