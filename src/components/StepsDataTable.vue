<script>
import { cloneDeep, get } from 'lodash/fp'
import { set } from 'lodash'
import DataTable from '@/lib/ui-lib/components/DataTable'
import DialogSteps from '@/components/DialogSteps'
import Monaco from "@/lib/monaco/Monaco"
import YAML from "yamljs";
import {vuetify} from '@/plugins/vuetify'

const stepsDetailMap = {
  gitPull: 'gitPull',
  gitPullCustomStep: 'gitPull',
  getRunSettings: 'getRunSettings',
  build: 'build',
  scanCode: 'scanCode',
  packageImage: 'package',
  scanImage: 'scanImage',
  deploy: 'deploy',
  undo: 'undo',
  syncImage: 'syncImage',
  applyIngress: 'applyIngress',
  checkQuota: 'checkQuota',
  checkDeploy: 'checkDeploy',
  artifact: 'artifact',
  deployArtifact: 'deployArtifact',
  testApi: 'test',
  testPerformance: 'test',
  testWebui: 'test',
  databaseExec: 'databaseScript',
  databaseRollback: 'databaseScript',
  applyMesh: 'applyMesh',
  changeMesh: 'changeMesh',
  input: 'input',
}

export default {
  name: 'StepsDataTable',
  functional: true,
  components: {
    DataTable,
    Monaco,
    EmbedTd: {
      functional: true,
      render (createElement, context) {
        return createElement('td', context.data, context.children)
      }
    },
    DialogSteps,
  },
  props: ['steps', 'console'],
  render (createElement, context) {
    const vm = this
    const stepsData = {
      gitPull: {
        headers: [
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_tag_name'), sortable: false },
          { value: 'stepDetail.latestCommit', text: vuetify.preset.lang.t('$vuetify.lang_view_latest_commit'), sortable: false },
          { value: 'stepDetail.tags', text: vuetify.preset.lang.t('$vuetify.lang_view_git_tags'), sortable: false },
          { value: 'stepDetail.refs', text: vuetify.preset.lang.t('$vuetify.lang_view_git_refs'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.latestCommit': (config) => {
            if(config.item.stepDetail.gitURL){
              return <a href={config.item.stepDetail.gitURL} target="_Blank">{config.item.stepDetail.latestCommit.substring(0, 8)}</a>
            } else {
              return <span>{config.item.stepDetail.latestCommit}</span>
            }
          },
          'item.stepDetail.tags': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.tags, 4)
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.refs': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.refs, 4)
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        },
        subTable: {
          headers: [
            { value: 'commitHash', text: vuetify.preset.lang.t('$vuetify.lang_view_commit_hash'), sortable: true },
            { value: 'commitMessage', text: vuetify.preset.lang.t('$vuetify.lang_view_commit_message'), sortable: true },
            { value: 'modifyLineCountTotal', text: vuetify.preset.lang.t('$vuetify.lang_view_commit_modify_line_count'), sortable: true },
            { value: 'committerName', text: vuetify.preset.lang.t('$vuetify.lang_view_committee'), sortable: true },
            { value: 'committerEmail', text: vuetify.preset.lang.t('$vuetify.lang_view_committee_mail'), sortable: true },
            { value: 'commitTime', text: vuetify.preset.lang.t('$vuetify.lang_view_create_time'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'commits'],
        }
      },
      getRunSettings: {
        headers: [
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.pipelineVariable', text: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_variable'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.pipelineVariable': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.pipelineVariable, 4)
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        }
      },
      build: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.buildPath', text: vuetify.preset.lang.t('$vuetify.lang_view_build_path'), sortable: false },
          { value: 'stepDetail.buildEnv', text: vuetify.preset.lang.t('$vuetify.lang_view_build_env'), sortable: false },
          { value: 'stepDetail.buildCmds', text: vuetify.preset.lang.t('$vuetify.lang_view_build_command'), sortable: false },
          { value: 'stepDetail.buildChecks', text: vuetify.preset.lang.t('$vuetify.lang_view_build_check'), sortable: false },
          { value: 'stepDetail.latestCommit', text: vuetify.preset.lang.t('$vuetify.lang_view_latest_commit'), sortable: false }
        ],
        scopedSlots: {
          'item.stepDetail.buildCmds': (config) => {
            return <div>{
              Object.keys(config.item.stepDetail.buildCmds).map(row => {
                return <div>{config.item.stepDetail.buildCmds[row]}</div>
              })
            }</div>
          },
          'item.stepDetail.buildChecks': (config) => {
            return <div>{
              Object.keys(config.item.stepDetail.buildChecks).map(row => {
                return <div>{config.item.stepDetail.buildChecks[row]}</div>
              })
            }</div>
          },
          'item.stepDetail.latestCommit': (config) => {
            if(config.item.stepDetail.gitURL){
              return <a href={config.item.stepDetail.gitURL} target="_Blank">{config.item.stepDetail.latestCommit.substring(0, 8)}</a>
            } else {
              return <span>{config.item.stepDetail.latestCommit}</span>
            }
          }
        }
      },
      package: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_tag_name'), sortable: false },
          { value: 'stepDetail.stepBuildIDs', text: vuetify.preset.lang.t('$vuetify.lang_view_related_build_records'), sortable: false },
          { value: 'stepDetail.size', text: vuetify.preset.lang.t('$vuetify.lang_view_image_size'), sortable: false },
          { value: 'stepDetail.dockerFile', text: vuetify.preset.lang.t('$vuetify.lang_view_docker_file'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.tagName': (config) => {
            if(config.item.stepDetail.imageURL){
              return <a href={config.item.stepDetail.imageURL} target="_Blank">{config.item.stepDetail.tagName}</a>
            } else {
              return <span>{config.item.stepDetail.tagName}</span>
            }
          },
          'item.stepDetail.dockerFile': (config) => {
            let codeValue = config.item.stepDetail.dockerFile
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.dockerFile,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "dockerfile"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.stepBuildIDs': (config) => {
            let codeValue = config.item.stepDetail.stepBuildIDs
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_build_records')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="build"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        },
        subTable: {
          headers: [
            { value: 'stepName', text: vuetify.preset.lang.t('$vuetify.lang_view_step_desc'), sortable: false },
            { value: 'stepAction', text: vuetify.preset.lang.t('$vuetify.lang_view_step_action'), sortable: true },
            { value: 'envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: true },
            { value: 'relatedStepRunName', text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), sortable: false },
            { value: 'status.startTime', text: vuetify.preset.lang.t('$vuetify.lang_view_start_time'), sortable: true },
            { value: 'relatedStepStatus', text: vuetify.preset.lang.t('$vuetify.lang_view_status'), sortable: false },
            { value: 'relatedStepHandle', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'relatedSteps']
        },
      },
      artifact: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.tarName', text: vuetify.preset.lang.t('$vuetify.lang_view_artifact_name'), sortable: false },
          { value: 'stepDetail.stepBuildIDs', text: vuetify.preset.lang.t('$vuetify.lang_view_related_build_records'), sortable: false },
          { value: 'stepDetail.artifacts', text: vuetify.preset.lang.t('$vuetify.lang_view_artifact_files'), sortable: false },
          { value: 'stepDetail.size', text: vuetify.preset.lang.t('$vuetify.lang_view_artifact_size'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.tarName': (config) => {
            if (config.item.stepDetail.artifactURL) {
              return <a href={config.item.stepDetail.artifactURL} target="_Blank">{config.item.stepDetail.tarName}</a>
            } else if (config.item.stepDetail.artifactRepoSetting.artifactRepoType === 'internal' && config.item.stepDetail.internalArtifactID) {
              return <router-link to={{name: 'CicdArtifactDetail', params: { projectName: config.item.projectName, artifactID: config.item.stepDetail.internalArtifactID }}}>{config.item.stepDetail.tarName}</router-link>
            } else {
              return <span>{config.item.stepDetail.tarName}</span>
            }
          },
          'item.stepDetail.stepBuildIDs': (config) => {
            let codeValue = config.item.stepDetail.stepBuildIDs
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_build_records')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="build"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.artifacts': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.artifacts, 4)
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={300}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        },
        subTable: {
          headers: [
            { value: 'stepName', text: vuetify.preset.lang.t('$vuetify.lang_view_step_desc'), sortable: false },
            { value: 'stepAction', text: vuetify.preset.lang.t('$vuetify.lang_view_step_action'), sortable: true },
            { value: 'envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: true },
            { value: 'relatedStepRunName', text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), sortable: false },
            { value: 'status.startTime', text: vuetify.preset.lang.t('$vuetify.lang_view_start_time'), sortable: true },
            { value: 'relatedStepStatus', text: vuetify.preset.lang.t('$vuetify.lang_view_status'), sortable: false },
            { value: 'relatedStepHandle', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'relatedSteps']
        },
      },
      deploy: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.isMeshEnable', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_enable'), sortable: false },
          { value: 'stepDetail.image.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_tag_name'), sortable: false },
          { value: 'stepDetail.image.stepPackageID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_package_record'), sortable: false },
          { value: 'stepDetail.createdDeployYaml', text: vuetify.preset.lang.t('$vuetify.lang_view_created_deployment_yaml'), sortable: false },
          { value: 'stepDetail.currentDeployYaml', text: vuetify.preset.lang.t('$vuetify.lang_view_current_deployment_yaml'), sortable: false },
          { value: 'stepDetail.archiveUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_archive_url'), sortable: false },
          { value: 'stepDetail.dashboardUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_dashboard_url'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.image.tagName': (config) => {
            if(config.item.stepDetail.image.imageURL){
              return <a href={config.item.stepDetail.image.imageURL} target="_Blank">{config.item.stepDetail.image.tagName}</a>
            } else {
              return <span>{config.item.stepDetail.image.tagName}</span>
            }
          },
          'item.stepDetail.image.stepPackageID': (config) => {
            let codeValue = [config.item.stepDetail.image.stepPackageID]
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="package"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.createdDeployYaml': (config) => {
            let codeValue = ''
            if (config.item.stepDetail.deployYaml !== '' || config.item.stepDetail.serviceYaml !== '' || config.item.stepDetail.hpaYaml !== '' || config.item.stepDetail.configMapYaml !== '' || config.item.stepDetail.secretYaml !== '') {
              codeValue = "---\n" + config.item.stepDetail.deployYaml + "\n\n\n" + "---\n" + config.item.stepDetail.serviceYaml + "\n\n\n" + "---\n" + config.item.stepDetail.hpaYaml + "\n\n\n" + "---\n" + config.item.stepDetail.configMapYaml + "\n\n\n" + "---\n" + config.item.stepDetail.secretYaml + "\n\n\n"
            }
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.currentDeployYaml': (config) => {
            let codeValue = ''
            if (config.item.stepDetail.k8sDeployYaml !== '' || config.item.stepDetail.k8sServiceYaml !== '' || config.item.stepDetail.k8sHpaYaml !== '' || config.item.stepDetail.k8sConfigMapYaml !== '' || config.item.stepDetail.k8sSecretYaml !== '') {
              codeValue = config.item.stepDetail.k8sDeployYaml + config.item.stepDetail.k8sServiceYaml + config.item.stepDetail.k8sHpaYaml + config.item.stepDetail.k8sConfigMapYaml + config.item.stepDetail.k8sSecretYaml 
            }
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.archiveUrl': (config) => {
            let codeValue = config.item.stepDetail.archiveUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_download')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
          'item.stepDetail.dashboardUrl': (config) => {
            let codeValue = config.item.stepDetail.dashboardUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        }
      },
      checkDeploy: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.deploymentStatus', text: vuetify.preset.lang.t('$vuetify.lang_view_deploy_status'), sortable: false },
          { value: 'stepDetail.checkResourceStatuses', text: vuetify.preset.lang.t('$vuetify.lang_view_pods_error_describe'), sortable: false },
          { value: 'stepDetail.eventsOutput', text: vuetify.preset.lang.t('$vuetify.lang_view_events'), sortable: false },
          { value: 'stepDetail.dashboardUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_dashboard_url'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.checkResourceStatuses': (config) => {
            let codeValue = ''
            config.item.stepDetail.checkResourceStatuses.forEach((row, index) => {
              let s = `# ${row.resourceType} ${row.resourceName}

\`\`\`yaml
${row.errorDescribe}
\`\`\`

#####################


`
              codeValue = codeValue + s
            })
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "markdown"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.eventsOutput': (config) => {
            let codeValue = config.item.stepDetail.eventsOutput
            if(codeValue){
              return <v-dialog
              width="1000"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "markdown"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.dashboardUrl': (config) => {
            let codeValue = config.item.stepDetail.dashboardUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        },
        subTable: {
          headers: [
            { value: 'podName', text: 'podName', sortable: true },
            { value: 'podSpec', text: vuetify.preset.lang.t('$vuetify.lang_view_pods_pod_spec'), sortable: false },
            { value: 'image.tagName', text: 'image', sortable: false },
            { value: 'image.stepPackageID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_package_record'), sortable: false },
            { value: 'ready', text: 'ready', sortable: false },
            { value: 'reason', text: 'reason', sortable: true },
            { value: 'restart', text: 'restart', sortable: false },
            { value: 'age', text: 'age', sortable: false },
            { value: 'errorDescribe', text: vuetify.preset.lang.t('$vuetify.lang_view_pods_error_describe'), sortable: false },
            { value: 'errorLog', text: vuetify.preset.lang.t('$vuetify.lang_view_pods_error_logs'), sortable: false },
            { value: 'dashboardUrlPod', text: vuetify.preset.lang.t('$vuetify.lang_view_dashboard_url'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'checkPodStatuses']
        }
      },
      deployArtifact: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.tar.tarName', text: vuetify.preset.lang.t('$vuetify.lang_view_artifact_name'), sortable: false },
          { value: 'stepDetail.tar.stepArtifactID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_artifact_record'), sortable: false },
          { value: 'stepDetail.hostsIni', text: vuetify.preset.lang.t('$vuetify.lang_view_hosts_ini'), sortable: false },
          { value: 'stepDetail.tasks', text: vuetify.preset.lang.t('$vuetify.lang_view_tasks'), sortable: false },
          { value: 'stepDetail.archiveUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_archive_url'), sortable: false },
          { value: 'stepDetail.try', text: vuetify.preset.lang.t('$vuetify.lang_view_is_try'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.tar.tarName': (config) => {
            if(config.item.stepDetail.tar.artifactURL){
              return <a href={config.item.stepDetail.tar.artifactURL} target="_Blank">{config.item.stepDetail.tar.tarName}</a>
            } else {
              return <span>{config.item.stepDetail.tar.tarName}</span>
            }
          },
          'item.stepDetail.tar.stepArtifactID': (config) => {
            let codeValue = [config.item.stepDetail.tar.stepArtifactID]
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_artifact_record')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="artifact"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.hostsIni': (config) => {
            let codeValue = config.item.stepDetail.hostsIni
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "ini"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.tasks': (config) => {
            let codeValue = config.item.stepDetail.tasks
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.archiveUrl': (config) => {
            let codeValue = config.item.stepDetail.archiveUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_download')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        },
      },
      test: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.testStat', text: vuetify.preset.lang.t('$vuetify.lang_view_test_stat'), sortable: false },
          { value: 'stepDetail.result', text: vuetify.preset.lang.t('$vuetify.lang_view_test_result'), sortable: false },
          { value: 'stepDetail.report', text: vuetify.preset.lang.t('$vuetify.lang_view_test_report'), sortable: false },
          { value: 'stepDetail.tar', text: vuetify.preset.lang.t('$vuetify.lang_view_test_report_archive'), sortable: false }
        ],
        scopedSlots: {
          'item.stepDetail.result': (config) => {
            let codeValue = config.item.stepDetail.result
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.result,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "plaintext"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.report': (config) => {
            let codeValue = config.item.stepDetail.filePath
            if(codeValue){
              return <v-btn
                small
                color="primary"
                vOn:click={() => {
                  window.open(process.env.VUE_APP_BASE+config.item.stepDetail.filePath)
                }}
                >
                {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                </v-btn>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.tar': (config) => {
            let codeValue = config.item.stepDetail.tarPath
            if(codeValue){
              return <v-btn
                small
                color="primary"
                vOn:click={() => {
                  window.open(process.env.VUE_APP_BASE+config.item.stepDetail.tarPath)
                }}
                >
                {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                </v-btn>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.testStat': (config) => {
            if (config.item.stepDetail.robotTestStat === undefined) {
              return <div></div>
            } else {
              let codeValue = config.item.stepDetail.robotTestStat.statistics.total.stat
              if ((codeValue.pass + codeValue.fail + codeValue.skip) > 0) {
                return <div>
                  <div>pass: {codeValue.pass}</div>
                  <div>fail: {codeValue.fail}</div>
                  <div>skip: {codeValue.skip}</div>
                </div>
              } else {
                return <div></div>
              }
            }
          },
        }
      },
      scanCode: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'status.result', text: vuetify.preset.lang.t('$vuetify.lang_view_scan_code_status'), sortable: false },
          { value: 'stepDetail.latestCommit', text: vuetify.preset.lang.t('$vuetify.lang_view_latest_commit'), sortable: false }
        ],
        scopedSlots: {
          'item.status.result': (config) => {
            if(config.item.stepDetail.scanCodeURL){
              return <a href={config.item.stepDetail.scanCodeURL} target="_Blank">{config.item.status.result}</a>
            } else {
              return <span>{config.item.status.result}</span>
            }
          },
          'item.stepDetail.latestCommit': (config) => {
            if(config.item.stepDetail.gitURL){
              return <a href={config.item.stepDetail.gitURL} target="_Blank">{config.item.stepDetail.latestCommit.substring(0, 8)}</a>
            } else {
              return <span>{config.item.stepDetail.latestCommit}</span>
            }
          }
        },
        subTable: {
          headers: [
            { value: 'metric.description', text: 'description', sortable: true },
            { value: 'metric.type', text: 'type', sortable: false },
            { value: 'metric.bestValue', text: 'bestValue', sortable: false },
            { value: 'metric.worstValue', text: 'worstValue', sortable: false },
            { value: 'value', text: 'value', sortable: false },
            { value: 'bestValue', text: 'isBestValue', sortable: true },
          ],
          itemsPath: ['stepDetail', 'scanMetrics']
        }
      },
      syncImage: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.isMeshEnable', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_enable'), sortable: false },
          { value: 'stepDetail.fromImages', text: vuetify.preset.lang.t('$vuetify.lang_view_image_tag_source'), sortable: false },
          { value: 'stepDetail.toImages', text: vuetify.preset.lang.t('$vuetify.lang_view_image_tag_target'), sortable: false },
          { value: 'stepDetail.dashboardUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_dashboard_url'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.fromImages': (config) => {
            return <div>{
              Object.keys(config.item.stepDetail.fromImages).map(row => {
                if(config.item.stepDetail.fromImages[row].imageURL){
                  return <div>
                    <a href={config.item.stepDetail.fromImages[row].imageURL} target="_Blank">{config.item.stepDetail.fromImages[row].tagName}</a>
                    <span> &nbsp; </span>
                    <v-dialog
                      width="800"
                      delay= "3000"
                      scopedSlots={{
                        activator: ({on, attrs}) => {
                          return <v-btn
                          small
                          color="primary"
                          {...{
                            props: attrs,
                            on
                          }}>
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                          </v-btn>
                        }
                      }}
                      vOn:input={() => {

                      }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                        </v-card-title>
                        <v-card-text>
                          <DialogSteps
                            stepKind="package"
                            ids={[config.item.stepDetail.fromImages[row].stepPackageID]}
                            runLogs={context.props.console}
                          ></DialogSteps>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </div>
                } else {
                  return <div>{config.item.stepDetail.fromImages[row].tagName}</div>
                }
              })
            }</div>
          },
          'item.stepDetail.toImages': (config) => {
            return <div>{
              Object.keys(config.item.stepDetail.toImages).map(row => {
                if(config.item.stepDetail.toImages[row].imageURL){
                  return <div>
                    <a href={config.item.stepDetail.toImages[row].imageURL} target="_Blank">{config.item.stepDetail.toImages[row].tagName}</a>
                    <span> &nbsp; </span>
                    <v-dialog
                      width="800"
                      delay= "3000"
                      scopedSlots={{
                        activator: ({on, attrs}) => {
                          return <v-btn
                          small
                          color="primary"
                          {...{
                            props: attrs,
                            on
                          }}>
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                          </v-btn>
                        }
                      }}
                      vOn:input={() => {

                      }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                        </v-card-title>
                        <v-card-text>
                          <DialogSteps
                            stepKind="package"
                            ids={[config.item.stepDetail.toImages[row].stepPackageID]}
                            runLogs={context.props.console}
                          ></DialogSteps>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </div>
                } else {
                  return <div>{config.item.stepDetail.toImages[row].tagName}</div>
                }
              })
            }</div>
          },
          'item.stepDetail.dashboardUrl': (config) => {
            let codeValue = config.item.stepDetail.dashboardUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        }
      },
      scanImage: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.image.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_tag_name'), sortable: false },
          { value: 'stepDetail.stepBuildIDs', text: vuetify.preset.lang.t('$vuetify.lang_view_related_build_records'), sortable: false },
          { value: 'stepDetail.image.stepPackageID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_package_record'), sortable: false },
          { value: 'stepDetail.imageMetadata.stat', text: vuetify.preset.lang.t('$vuetify.lang_view_scan_image_statistics'), sortable: false },
          { value: 'stepDetail.imageMetadata', text: vuetify.preset.lang.t('$vuetify.lang_view_scan_image_metadata'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.image.tagName': (config) => {
            if(config.item.stepDetail.image.imageURL){
              return <a href={config.item.stepDetail.image.imageURL} target="_Blank">{config.item.stepDetail.image.tagName}</a>
            } else {
              return <span>{config.item.stepDetail.image.tagName}</span>
            }
          },
          'item.stepDetail.stepBuildIDs': (config) => {
            let codeValue = config.item.stepDetail.stepBuildIDs
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_build_records')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="build"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.image.stepPackageID': (config) => {
            let codeValue = [config.item.stepDetail.image.stepPackageID]
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="package"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.imageMetadata.stat': (config) => {
            return <div>{
              Object.keys(config.item.stepDetail.imageMetadata.stat).map(row => {
                return <div>{row} : {config.item.stepDetail.imageMetadata.stat[row]}</div>
              })
            }</div>
          },
          'item.stepDetail.imageMetadata': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.imageMetadata, 4)
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        },
        subTable: {
          headers: [
            { value: 'Type', text: 'Type', sortable: true },
            { value: 'Severity', text: 'Severity', sortable: true },
            { value: 'PkgName', text: 'PkgName', sortable: true },
            { value: 'VulnerabilityID', text: 'VulnerabilityID', sortable: false },
            { value: 'Title', text: 'Title', sortable: false },
            { value: 'ScanImageDetail', text: 'Detail', sortable: false },
            { value: 'InstalledVersion', text: 'InstalledVersion', sortable: false },
            { value: 'FixedVersion', text: 'FixedVersion', sortable: false },
          ],
          itemsPath: ['stepDetail', 'vulnerabilities'],
        }
      },
      undo: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.isMeshEnable', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_enable'), sortable: false },
          { value: 'stepDetail.fromImage.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_image_tag_source'), sortable: false },
          { value: 'stepDetail.fromImage.stepPackageID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_package_record'), sortable: false },
          { value: 'stepDetail.toImage.tagName', text: vuetify.preset.lang.t('$vuetify.lang_view_image_tag_target'), sortable: false },
          { value: 'stepDetail.toImage.stepPackageID', text: vuetify.preset.lang.t('$vuetify.lang_view_related_package_record'), sortable: false },
          { value: 'stepDetail.dashboardUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_dashboard_url'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.fromImage.tagName': (config) => {
            if(config.item.stepDetail.fromImage.imageURL){
              return <a href={config.item.stepDetail.fromImage.imageURL} target="_Blank">{config.item.stepDetail.fromImage.tagName}</a>
            } else {
              return <span>{config.item.stepDetail.fromImage.tagName}</span>
            }
          },
          'item.stepDetail.fromImage.stepPackageID': (config) => {
            let codeValue = [config.item.stepDetail.fromImage.stepPackageID]
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="package"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.toImage.tagName': (config) => {
            if(config.item.stepDetail.toImage.imageURL){
              return <a href={config.item.stepDetail.toImage.imageURL} target="_Blank">{config.item.stepDetail.toImage.tagName}</a>
            } else {
              return <span>{config.item.stepDetail.toImage.tagName}</span>
            }
          },
          'item.stepDetail.toImage.stepPackageID': (config) => {
            let codeValue = [config.item.stepDetail.toImage.stepPackageID]
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                  </v-card-title>

                  <v-card-text>
                    <DialogSteps
                      stepKind="package"
                      ids={codeValue}
                      runLogs={context.props.console}
                    ></DialogSteps>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.dashboardUrl': (config) => {
            let codeValue = config.item.stepDetail.dashboardUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        }
      },
      applyIngress: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.ingressYaml', text: vuetify.preset.lang.t('$vuetify.lang_view_ingress_def'), sortable: false },
          { value: 'stepDetail.k8sIngressYaml', text: vuetify.preset.lang.t('$vuetify.lang_view_current_deployment_yaml'), sortable: false },
          { value: 'stepDetail.archiveUrl', text: vuetify.preset.lang.t('$vuetify.lang_view_archive_url'), sortable: false },
          { value: 'stepDetail.try', text: vuetify.preset.lang.t('$vuetify.lang_view_is_try'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.ingressYaml': (config) => {
            let codeValue = config.item.stepDetail.ingressYaml
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.ingressYaml,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.k8sIngressYaml': (config) => {
            let codeValue = config.item.stepDetail.k8sIngressYaml
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.k8sIngressYaml,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.archiveUrl': (config) => {
            let codeValue = config.item.stepDetail.archiveUrl
            if(codeValue){
              return <a target="_Blank" href={codeValue}>
                <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_download')}</v-btn>
              </a>
            } else {
              return <div></div>
            }
          },
        }
      },
      checkQuota: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.resourceQuotaDesc', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_detail'), sortable: false }
        ],
        scopedSlots: {
          'item.stepDetail.resourceQuotaDesc': (config) => {
            let codeValue = config.item.stepDetail.resourceQuotaDesc
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.resourceQuotaDesc,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "plaintext"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          }
        },
        subTable: {
          headers: [
            { value: 'memoryRequestRate', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_memory_request_percentage'), sortable: false },
            { value: 'memoryLimitRate', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_memory_limit_percentage'), sortable: false },
            { value: 'cpuRequestRate', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_cpu_request_percentage'), sortable: false },
            { value: 'cpuLimitRate', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_cpu_limit_percentage'), sortable: false },
            { value: 'podsRate', text: vuetify.preset.lang.t('$vuetify.lang_view_resource_quota_pods_limit_percentage'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'resourceRate']
        }
      },
      applyMesh: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.isMeshEnable', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_enable'), sortable: false },
          { value: 'stepDetail.istioInfoYaml', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_def'), sortable: false },
          { value: 'stepDetail.try', text: vuetify.preset.lang.t('$vuetify.lang_view_is_try'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.istioInfoYaml': (config) => {
            let codeValue = config.item.stepDetail.istioInfoYaml
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: config.item.stepDetail.istioInfoYaml,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          }
        },
        subTable: {
          headers: [
            { value: 'moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: true },
            { value: 'defaultBuildID', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_build_id_default'), sortable: false },
            { value: 'newBuildID', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_build_id_new'), sortable: false }
          ],
          itemsPath: ['stepDetail', 'meshSubsets']
        }
      },
      changeMesh: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.weight', text: vuetify.preset.lang.t('$vuetify.lang_view_mesh_weight'), sortable: false }
        ]
      },
      databaseScript: {
        headers: [
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.actionName', text: vuetify.preset.lang.t('$vuetify.lang_view_operation_type'), sortable: false }
        ],
        subTable: {
          headers: [
            { value: 'dbName', text: 'dbName', sortable: true },
            { value: 'config.update.tag', text: 'updateTag', sortable: false },
            { value: 'config.update.label', text: 'updateLabel', sortable: false },
            { value: 'config.update.context', text: 'updateContext', sortable: false },
            { value: 'config.rollback.kind', text: 'rollbackKind', sortable: false },
            { value: 'config.rollback.value', text: 'rollbackValue', sortable: false },
            { value: 'sqlContent', text: vuetify.preset.lang.t('$vuetify.lang_view_sql_content'), sortable: false },
          ],
          itemsPath: ['stepDetail', 'actionConfigs'],
        }
      },
      input: {
        headers: [
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.username', text: vuetify.preset.lang.t('$vuetify.lang_view_input_user'), sortable: false },
          { value: 'stepDetail.inputValue', text: vuetify.preset.lang.t('$vuetify.lang_view_input_value'), sortable: false },
          { value: 'stepDetail.paramStepInput', text: vuetify.preset.lang.t('$vuetify.lang_view_input_variables'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.paramStepInput': (config) => {
            let codeValue = YAML.stringify(config.item.stepDetail.paramStepInput, 4)
            if(codeValue !== "null"){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: codeValue,
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
        }
      },
      customStep: {
        headers: [
          { value: 'stepDetail.moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
          { value: 'stepDetail.branchName', text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), sortable: false },
          { value: 'stepDetail.envName', text: vuetify.preset.lang.t('$vuetify.lang_view_env'), sortable: false },
          { value: 'stepDetail.ignored', text: vuetify.preset.lang.t('$vuetify.lang_view_ignored'), sortable: false },
          { value: 'stepDetail.paramInput', text: vuetify.preset.lang.t('$vuetify.lang_view_param_input'), sortable: false },
          { value: 'stepDetail.paramOutput', text: vuetify.preset.lang.t('$vuetify.lang_view_param_output'), sortable: false },
          { value: 'stepDetail.outputFiles', text: vuetify.preset.lang.t('$vuetify.lang_view_output_file'), sortable: false },
          { value: 'stepDetail.tarFile', text: vuetify.preset.lang.t('$vuetify.lang_view_output_file_archive'), sortable: false },
        ],
        scopedSlots: {
          'item.stepDetail.paramInput': (config) => {
            let codeValue = config.item.stepDetail.paramInput
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: YAML.stringify(config.item.stepDetail.paramInput, 4),
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.paramOutput': (config) => {
            let codeValue = config.item.stepDetail.paramOutput
            if(codeValue){
              return <v-dialog
              width="800"
              delay= "3000"
              scopedSlots={{
                activator: ({on, attrs}) => {
                  return <v-btn
                  small
                  color="primary"
                  {...{
                    props: attrs,
                    on
                  }}>
                  {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-btn>
                }
              }}
              vOn:input={() => {

              }}
              >
                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                  </v-card-title>

                  <v-card-text>
                    <Monaco
                      ref="monaco"
                      monacoOptions={{
                        value: YAML.stringify(config.item.stepDetail.paramOutput, 4),
                        automaticLayout:true,
                        readOnly: true,
                        theme: "vs-dark",
                        language: "yaml"
                      }}
                      height={500}
                    ></Monaco>
                  </v-card-text>
                </v-card>
              </v-dialog>
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.outputFiles': (config) => {
            let codeValue = config.item.stepDetail.outputFiles
            if(codeValue.length > 0){
              return codeValue.map(row => {
                let file = row.split('/')
                return <div>
                  <a target="_blank" href={process.env.VUE_APP_BASE + row}>{file[file.length - 1]}</a>
                </div>
              })
            }else{
              return <div></div>
            }
          },
          'item.stepDetail.tarFile': (config) => {
            let codeValue = config.item.stepDetail.tarFile
            let file = codeValue.split('/')
            if(codeValue){
              return <a target="_blank" href={process.env.VUE_APP_BASE + codeValue}>{file[file.length - 1]}</a>
            }else{
              return <div></div>
            }
          }
        }
      },
    }
    const headers = [
      { value: 'data-table-expand' },
      { value: 'stepName', text: vuetify.preset.lang.t('$vuetify.lang_view_step_desc'), sortable: false },
      { value: 'stepAction', text: vuetify.preset.lang.t('$vuetify.lang_view_step_action'), sortable: false },
      { value: 'moduleName', text: vuetify.preset.lang.t('$vuetify.lang_view_module_name'), sortable: false },
      { value: 'runName', text: vuetify.preset.lang.t('$vuetify.lang_view_run_name'), sortable: false },
      { value: 'stepContainerStats', text: vuetify.preset.lang.t('$vuetify.lang_view_step_stats'), sortable: false },
      { value: 'status.result', text: vuetify.preset.lang.t('$vuetify.lang_view_status'), sortable: false },
      { value: 'handle', text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), sortable: false },
    ]
    const data = cloneDeep(context.data)
    set(data, ['attrs', 'headers'], get(['attrs', 'headers'], data) || headers)
    set(data, ['attrs', 'items'], get(['attrs', 'items'], data) || context.props.steps || [])
    set(data, ['scopedSlots', 'item.moduleName'], context.scopedSlots['item.moduleName'] || ((config) => {
      if(config.item.moduleType&&config.item.moduleName){
        return [
        <div class="mb-1 mt-1"><router-link to={{name: 'CicdModule', params: { projectName: config.item.projectName, moduleName: config.item.moduleName, moduleType: config.item.moduleType }}}>{config.item.moduleName}</router-link></div>,
        <div class="mb-1">{config.item.moduleType}</div>
      ]
      }else{
        return [
          <div class="mb-1 mt-1">{config.item.moduleName}</div>,
          <div class="mb-1">{config.item.moduleType}</div>
        ]
      }
    }))
    set(data, ['scopedSlots', 'item.runName'], context.scopedSlots['item.runName'] || ((config) => {
      return <div>
        <router-link to={{name: 'CicdRun', params: { 'runName': config.item.runName }}}>
          { config.item.runName }
        </router-link>
        <div>{ config.item.status.startTime }</div>
      </div>
    }))
    set(data, ['scopedSlots', 'item.stepAction'], context.scopedSlots['item.stepAction'] || ((config) => {
      return <div>
        <div>{ config.item.stepAction }</div>
        { config.item.architecture ? <div><v-chip small class="mr-2" color="primary">{config.item.architecture}</v-chip></div> : null}
      </div>
    }))
    set(data, ['scopedSlots', 'item.stepContainerStats'], context.scopedSlots['item.stepContainerStats'] || ((config) => {
      let codeValue = ''
      if (config.item.stepContainerStats !== undefined && config.item.stepContainerStats.duration !== '') {
        codeValue = YAML.stringify(config.item.stepContainerStats, 4)
      }
      if(codeValue){
        return <v-dialog
        width="800"
        delay= "3000"
        scopedSlots={{
          activator: ({on, attrs}) => {
            return <v-btn
            small
            color="primary"
            {...{
              props: attrs,
              on
            }}>
            {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
            </v-btn>
          }
        }}
        vOn:input={() => {

        }}
        >
          <v-card>
            <v-card-title class="headline grey lighten-2">
              {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
            </v-card-title>

            <v-card-text>
              <Monaco
                ref="monaco"
                monacoOptions={{
                  value: codeValue,
                  automaticLayout:true,
                  readOnly: true,
                  theme: "vs-dark",
                  language: "yaml"
                }}
                height={500}
              ></Monaco>
            </v-card-text>
          </v-card>
        </v-dialog>
      }else{
        return <div></div>
      }
    }))
    set(data, ['scopedSlots', 'item.status.result'], context.scopedSlots['item.status.result'] || ((config) => {
      let chipColor = ''
      switch (config.item.status.result) {
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
      return [
        <div>{ config.item.status.duration }</div>,
        <v-chip small class="mb-1 white--text" color={chipColor}>
          { config.item.status.result }
        </v-chip>
      ]
    }))
    set(data, ['scopedSlots', 'item.handle'], context.scopedSlots['item.handle'] || ((config) => {
      return <div>
        <v-btn small class="my-1" color="primary" vOn:click={() => {
          context.props.console(config.item.runName, config.item.stepID)
        }}>{vuetify.preset.lang.t('$vuetify.lang_menu_view_logs')}</v-btn>
      </div>
    }))
    if (get(['attrs', 'showExpand'], data) === undefined) {
      set(data, ['attrs', 'showExpand'], true)
    }
    if (get(['attrs', 'itemKey'], data) === undefined) {
      set(data, ['attrs', 'itemKey'], 'stepID')
    }
    if (get(['scopedSlots', 'item.data-table-expand'], data) === undefined) {
      set(data, ['scopedSlots', 'item.data-table-expand'], (config) => {
        const stepDetailType = stepsDetailMap[config.item.stepDetail] || config.item.stepDetail
        if (stepDetailType) {
          return createElement('v-icon', {
            staticClass: 'v-data-table__expand-icon',
            class: {
              'v-data-table__expand-icon--active': config.isExpanded
            },
            on: {
              click: (e) => {
                e.stopPropagation()
                config.expand(!config.isExpanded)
              }
            }
          }, ['$expand'])
        } else {
          return null
        }
      })
    }

    set(data, ['scopedSlots', 'expanded-item'], context.scopedSlots['expanded-item'] || ((config) => {
      let stepDetailType = ''
      if(config.item.isCustomStep){
        stepDetailType = 'customStep'
      }else{
        stepDetailType = stepsDetailMap[config.item.stepAction] || config.item.stepAction
      }
      const tableData = {
        attrs: {
          headers: get([stepDetailType, 'headers'], stepsData) || [],
          items: [config.item],
          disablePagination: true,
          hideDefaultFooter: true
        },
        scopedSlots: get([stepDetailType, 'scopedSlots'], stepsData) || {}
      }
      if (get([stepDetailType, 'subTable'], stepsData)) {
        tableData.attrs.headers = [{ value: 'data-table-expand' }].concat(tableData.attrs.headers)
        tableData.attrs.showExpand = true
        set(tableData, ['scopedSlots', 'expanded-item'], (subConfig) => {
          let subTableData
          if(subConfig.item.stepDetail.resourceRate) {
            subTableData = {
              attrs: {
                headers: get([stepDetailType, 'subTable', 'headers'], stepsData) || [],
                items: [subConfig.item.stepDetail.resourceRate] || [],
                disablePagination: true,
                hideDefaultFooter: true
              },
              scopedSlots: {
                'item.memoryRequestRate': (config) => {
                  return <div>
                    <v-progress-linear height={20} value={(config.item.memoryRequestRate * 100).toFixed(2)}>
                      <strong>{(config.item.memoryRequestRate * 100).toFixed(2)}%</strong>
                    </v-progress-linear>
                  </div>
                },
                'item.memoryLimitRate': (config) => {
                  return <div>
                    <v-progress-linear height={20} value={(config.item.memoryLimitRate * 100).toFixed(2)}>
                      <strong>{(config.item.memoryLimitRate * 100).toFixed(2)}%</strong>
                    </v-progress-linear>
                  </div>
                },
                'item.cpuRequestRate': (config) => {
                  return <div>
                    <v-progress-linear height={20} value={(config.item.cpuRequestRate * 100).toFixed(2)}>
                      <strong>{(config.item.cpuRequestRate * 100).toFixed(2)}%</strong>
                    </v-progress-linear>
                  </div>
                },
                'item.cpuLimitRate': (config) => {
                  return <div>
                    <v-progress-linear height={20} value={(config.item.cpuLimitRate * 100).toFixed(2)}>
                      <strong>{(config.item.cpuLimitRate * 100).toFixed(2)}%</strong>
                    </v-progress-linear>
                  </div>
                },
                'item.podsRate': (config) => {
                  return <div>
                    <v-progress-linear height={20} value={(config.item.podsRate * 100).toFixed(2)}>
                      <strong>{(config.item.podsRate * 100).toFixed(2)}%</strong>
                    </v-progress-linear>
                  </div>
                },
              }
            }
          } else {
            subTableData = {
              attrs: {
                headers: get([stepDetailType, 'subTable', 'headers'], stepsData) || [],
                items: get(get([stepDetailType, 'subTable', 'itemsPath'], stepsData), subConfig.item) || [],
                disablePagination: true,
                hideDefaultFooter: true
              },
              scopedSlots: {
                'item.commitMessage': (config) => {
                  let len = 40
                  let content = config.item.message
                  if (config.item.message.length > len) {
                    content = config.item.message.substring(0, len) + '...'
                  }
                  return <div>{ content }</div>
                },
                'item.commitHash': (config) => {
                  let codeValue = config.item.commit.substring(0, 8)
                  if(config.item.commit){
                    return <a href={config.item.commitUrl} target="_Blank">{codeValue}</a>
                  } else {
                    return <span>{codeValue}</span>
                  }
                },
                'item.image.tagName': (config) => {
                  if(config.item.image.imageURL){
                    return <a href={config.item.image.imageURL} target="_Blank">{config.item.image.tagName}</a>
                  } else {
                    return <span>{config.item.image.tagName}</span>
                  }
                },
                'item.image.stepPackageID': (config) => {
                  let codeValue = [config.item.image.stepPackageID]
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_view_related_package_record')}
                        </v-card-title>
                        <v-card-text>
                          <DialogSteps
                            stepKind="package"
                            ids={codeValue}
                            runLogs={context.props.console}
                          ></DialogSteps>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.ScanImageDetail': (config) => {
                  let codeValue = YAML.stringify(config.item, 4)
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-card-title>

                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            monacoOptions={{
                              value: codeValue,
                              automaticLayout:true,
                              readOnly: true,
                              theme: "vs-dark",
                              language: "yaml"
                            }}
                            height={500}
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.relatedStepRunName': (config) => {
                  return <router-link to={{name: 'CicdRun', params: { 'runName': config.item.runName }}}>
                    { config.item.runName }
                  </router-link>
                },
                'item.relatedStepStatus': (config) => {
                  let chipColor = ''
                  switch (config.item.status.result) {
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
                  return [
                    <div>{ config.item.status.duration }</div>,
                    <v-chip small class="mb-1 white--text" color={chipColor}>
                      { config.item.status.result }
                    </v-chip>
                  ]          
                },
                'item.relatedStepHandle': (config) => {
                  return <div>
                    <v-btn small class="my-1" color="primary" vOn:click={() => {
                      context.props.console(config.item.runName, config.item.stepID)
                    }}>{vuetify.preset.lang.t('$vuetify.lang_menu_view_logs')}</v-btn>
                  </div>
                },
                'item.sqlContent': (config) => {
                  let codeValue = config.item.sqlContent
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_view_sql_content')}
                        </v-card-title>

                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            monacoOptions={{
                              value: codeValue,
                              automaticLayout:true,
                              readOnly: true,
                              theme: "vs-dark",
                              language: "sql"
                            }}
                            height={500}
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.errorDescribe': (config) => {
                  let codeValue = config.item.errorDescribe
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-card-title>

                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            monacoOptions={{
                              value: codeValue,
                              automaticLayout:true,
                              readOnly: true,
                              theme: "vs-dark",
                              language: "yaml"
                            }}
                            height={500}
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.errorLog': (config) => {
                  let codeValue = config.item.errorLog
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-card-title>

                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            monacoOptions={{
                              value: codeValue,
                              automaticLayout:true,
                              readOnly: true,
                              theme: "vs-dark",
                              language: "log"
                            }}
                            height={500}
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.podSpec': (config) => {
                  let codeValue = config.item.podSpec
                  if(codeValue){
                    return <v-dialog
                    width="800"
                    delay= "3000"
                    scopedSlots={{
                      activator: ({on, attrs}) => {
                        return <v-btn
                        small
                        color="primary"
                        {...{
                          props: attrs,
                          on
                        }}>
                        {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-btn>
                      }
                    }}
                    vOn:input={() => {

                    }}
                    >
                      <v-card>
                        <v-card-title class="headline grey lighten-2">
                          {vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}
                        </v-card-title>

                        <v-card-text>
                          <Monaco
                            ref="monaco"
                            monacoOptions={{
                              value: codeValue,
                              automaticLayout:true,
                              readOnly: true,
                              theme: "vs-dark",
                              language: "yaml"
                            }}
                            height={500}
                          ></Monaco>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  }else{
                    return <div></div>
                  }
                },
                'item.dashboardUrlPod': (config) => {
                  let codeValue = config.item.dashboardUrlPod
                  if(codeValue){
                    return <a target="_Blank" href={codeValue}>
                      <v-btn small color="primary">{vuetify.preset.lang.t('$vuetify.lang_menu_view_detail')}</v-btn>
                    </a>
                  } else {
                    return <div></div>
                  }
                },
              }
            }
          }

          return <td colspan={subConfig.headers.length} class="pa-1">
            <div class="py-1 px-2">{get([stepDetailType, 'subTable', 'title'], stepsData)}</div>
            <v-data-table {...subTableData} />
          </td>
        })
      }
      return <td colspan={config.headers.length} class="pa-1">
        <v-data-table {...tableData}/>
      </td>
    }))
    return <DataTable class="steps-data-table" {...data}>
      {context.children}
    </DataTable>
  }
}
</script>

<style scoped>

</style>
