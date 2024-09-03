<template>
  <div class="project pa-4">
    <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_project_detail')">
      <v-card class="mb-4" :loading="cardLoading">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_info')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    {{ $vuetify.lang.t('$vuetify.lang_view_project_name') }}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_namespace')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_repo')}}
                  </th>
                  <th class="text-left" v-for="(item,index) in project.projectNodePorts" :key="index">
                    {{$vuetify.lang.t('$vuetify.lang_view_env')}}({{item.envName}})
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <template>
                      <span>{{ targetProjectName }}</span><span>({{ project.projectInfo.projectShortName }})</span>
                      <div>{{ project.projectInfo.projectDesc }}</div>
                    </template>
                  </td>
                  <td>
                    <div>{{ project.projectInfo.projectNamespace }}({{ project.projectInfo.shortName }})</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_team')}}: {{ project.projectInfo.projectTeam }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_project_arch')}}: {{ project.projectInfo.projectArch }}</div>
                    <div>{{$vuetify.lang.t('$vuetify.lang_view_tenant_code')}}: {{ project.tenantCode }}</div>
                  </td>
                  <td>
                    <div class="repo-wrap">
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.gitRepo">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip outlined v-bind="attrs" v-on="on" small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_git_repo')}}</v-chip>
                            </template>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_build_settings_dir') }}: {{ project.projectRepo.gitRepoDir.buildSettingsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_database_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.databaseScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_demo_codes_dir') }}: {{ project.projectRepo.gitRepoDir.demoCodesDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_deploy_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.deployScriptsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_documents_dir') }}: {{ project.projectRepo.gitRepoDir.documentsDir }}</div>
                            <div>{{ $vuetify.lang.t('$vuetify.lang_view_git_repo_dir_test_scripts_dir') }}: {{ project.projectRepo.gitRepoDir.testScriptsDir }}</div>
                          </v-tooltip>
                        </a>
                      </div>
                      <div class="mb-1">
                        <a target="_Blank" :href="project.projectRepo.imageRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_image_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepo">
                        <a target="_Blank" :href="project.projectRepo.artifactRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </a>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.artifactRepoType === 'internal'">
                        <router-link :to="{ name: 'CicdArtifact', params: { projectName: project.projectInfo.projectName }}">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_artifact_repo')}}</v-chip>
                        </router-link>
                      </div>
                      <div class="mb-1" v-show="project.projectRepo.scanCodeRepo">
                        <a target="_Blank" :href="project.projectRepo.scanCodeRepo">
                          <v-chip outlined small color="success">{{$vuetify.lang.t('$vuetify.lang_menu_scan_code_repo')}}</v-chip>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td v-for="(item,index) in project.projectNodePorts" :key="index" style="vertical-align: top;">
                    <template>
                      <div class="my-1">
                        <Operations
                          :operations="[
                            { text: $vuetify.lang.t('$vuetify.lang_menu_new_project_node_ports'), onClick: () => {openNewNodeport(item.envName)} },
                            { text: $vuetify.lang.t('$vuetify.lang_menu_update_project_env'), onClick: () => {openUpdateProjectEnv(item.envName)} },
                            { text: $vuetify.lang.t('$vuetify.lang_form_delete_project_envs'), onClick: () => {openRecycleEnv(item.envName)} },
                          ]"
                          :opt-button-text="item.envName"
                          :opt-button-icon="(item.privileged ? 'mdi-security' : '')"
                        />
                      </div>
                      <div class="my-1" v-for="(envNodePort,i) in item.envNodePorts" :key="i">
                        <v-chip :outlined="!envNodePort.isDefault" :color="envNodePort.isDefault ? 'success' : 'primary'" small @click="envNodePort.isDefault ? '' : openRecycleNodeport(item.envName, envNodePort.nodePortStart)">
                          {{ envNodePort.nodePortStart }}-{{ envNodePort.nodePortEnd }}
                        </v-chip>
                      </div>
                    </template>
                  </td>
                  <td>
                    <template>
                      <Operations
                        :operations="[
                          { text: $vuetify.lang.t('$vuetify.lang_menu_new_project_envs'), onClick: () => {openNewEnv(project.tenantCode)} },
                          { text: $vuetify.lang.t('$vuetify.lang_menu_update_project'), onClick: openUpdateProject },
                          { text: $vuetify.lang.t('$vuetify.lang_menu_delete_project'), onClick: () => {confirmValue = ''; deleteProjectDialog = true} },
                        ]"
                      />
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_token')}}
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" v-if="project.projectSecret.harborPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_image_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.nexusPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_artifact_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.sonarPassword">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_scan_code_repo_password')}}
                  </th>
                  <th class="text-left" v-if="project.projectSecret.sonarToken">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_scan_code_repo_token')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_project_kubernetes_token')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_update_time')}}
                  </th>
                  <th class="text-left">
                    {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-if="project.projectSecret.harborPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.imageRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.harborPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectNamespace }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.nexusPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.artifactRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.nexusPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectNamespace }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.sonarPassword">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.scanCodeRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip outlined v-bind="attrs" v-on="on" small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.sonarPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                        </template>
                        <div>{{ $vuetify.lang.t('$vuetify.lang_view_account') }}: {{ project.projectInfo.projectName }}</div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td v-if="project.projectSecret.sonarToken">
                    <div class="repo-wrap">
                      <a target="_Blank" :href="project.projectRepo.scanCodeRepo"><v-chip outlined small color="success" class="mr-1 my-1">{{$vuetify.lang.t('$vuetify.lang_menu_open')}}</v-chip></a>
                      <v-chip outlined small color="primary" class="ml-1" v-clipboard:copy="project.projectSecret.sonarToken" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                    </div>
                  </td>
                  <td>
                    <template>
                      <div v-for="(item,index) in project.projectAvailableEnvs" :key="index" class="repo-wrap">
                        <a target="_Blank" :href="item.dashboardUrl"><v-chip outlined small color="success" class="mr-1 my-1">{{ item.envName }}</v-chip></a>
                        <v-chip outlined small color="primary" class="ml-1 my-1" v-clipboard:copy="item.k8sToken" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip>
                      </div>
                    </template>
                  </td>
                  <td>{{ project.projectSecret.refreshTime }}</td>
                  <td>
                    <template>
                      <Operations
                        :operations="[
                          { text: $vuetify.lang.t('$vuetify.lang_menu_refresh_all_token'), onClick: () => {updateSecretKeyDialog = true} },
                          { text: $vuetify.lang.t('$vuetify.lang_menu_re_apply_kubernetes'), onClick: () => {reApplyKubernetesDialog = true} },
                          { text: $vuetify.lang.t('$vuetify.lang_menu_clean_temp_git_repos'), onClick: () => {cleanGitRepoDialog = true} },
                        ]"
                      />
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_project_users_permissions')}}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openMemberAdd(project.tenantCode)">{{ $vuetify.lang.t('$vuetify.lang_menu_assign_permissions') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense v-if="project">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">
                    {{$vuetify.lang.t('$vuetify.lang_view_avatar')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_username')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_project_role')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_disable_project_defs')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_disable_repo_secrets')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_disable_pipelines')}}
                  </th>
                  <th>
                    {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in project.projectMembers" :key="index">
                  <td class="avatar-wrap">
                    <img :src="item.avatarUrl" alt="" class="user-avatar">
                  </td>
                  <td>{{ item.username }}</td>
                  <td>{{ item.accessLevel }}</td>
                  <td><v-chip small v-for="(str,j) in item.disableProjectDefs" :key="j">{{str}}</v-chip></td>
                  <td><v-chip small v-for="(str,j) in item.disableRepoSecrets" :key="j">{{str}}</v-chip></td>
                  <td><v-chip small v-for="(str,j) in item.disablePipelines" :key="j">{{str}}</v-chip></td>
                  <td>
                    <Operations
                      :operations="[
                        { text: $vuetify.lang.t('$vuetify.lang_menu_change_permissions'), onClick: () => {openUpdateMember(item, project.tenantCode)} },
                        { text: $vuetify.lang.t('$vuetify.lang_menu_delete_permissions'), onClick: () => {deletePermissions(item.username)} },
                      ]"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{ $vuetify.lang.t('$vuetify.lang_view_pipelines_settings') }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addPipelineDialog = true">{{ $vuetify.lang.t('$vuetify.lang_menu_new_pipeline') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-if="project"
            :headers="pipelineHeaders"
            :items="project.pipelines"
            :single-expand="false"
            item-key="pipelineName"
            show-expand
            hide-default-footer
            >
            <template v-slot:item.pipelineName="{ item }">
              <router-link :to="{ name: 'CicdPipeline', params: { pipelineName: item.pipelineName }}">
                {{ item.pipelineName }}
              </router-link>
            </template>
            <template v-slot:item.envs="{ item }">
              <div class="my-1" v-for="(i,index) in item.envs" :key="index">
                <v-chip outlined color="primary" small @click="handleEnv(item.branchName,i,false)">{{ i }}</v-chip>
              </div>
            </template>
            <template v-slot:item.envProductions="{ item }">
              <div class="my-1" v-for="(i,index) in item.envProductions" :key="index">
                <v-chip outlined color="primary" small @click="handleEnv(item.branchName,i,true)">{{ i }}</v-chip>
              </div>
            </template>
            <template v-slot:item.webhookPushEvent="{ item }">
              <div class="my-1 text-center">
                <v-switch
                  v-model="item.webhookPushEvent"
                  dense
                  inset
                  :disabled="project.projectRepo.gitRepoType === 'externalExist'"
                  @change="changeSwitch(item.branchName,item.webhookPushEvent)"
                ></v-switch>
              </div>
            </template>
            <template v-slot:item.handle="{ item }">
              <Operations
                :operations="[
                  { text: $vuetify.lang.t('$vuetify.lang_menu_delete_pipeline'), onClick: () => {openDeletePipeline(item.branchName)} },
                  { text: $vuetify.lang.t('$vuetify.lang_menu_assign_pipeline_envs'), onClick: () => {openAddPipelineEnv(item.branchName,item.pipelineName)} },
                  { text: $vuetify.lang.t('$vuetify.lang_menu_refresh_pipeline_token'), onClick: () => {openRefreshToken(item.branchName)} },
                  { text: $vuetify.lang.t('$vuetify.lang_menu_copy_pipeline_token_url'), onClick: () => {doCopy(item.url)} },
                ]"
              />
            </template>
            <template v-slot:expanded-item="{ headers,item }">
              <td :colspan="headers.length" class="pa-1">
                <v-card class="rounded-0">
                  <v-card-title>
                    {{ $vuetify.lang.t('$vuetify.lang_view_crontab_settings') }}
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" @click="openCronAdd(item.branchName)">{{ $vuetify.lang.t('$vuetify.lang_menu_add_pipeline_crontab') }}</v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_crontab_execute_minute')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_crontab_execute_hour')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_crontab_execute_day')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_crontab_execute_month')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_crontab_execute_week_day')}}
                            </th>
                            <th class="text-left">
                              {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(i,index) in item.pipelineCrons" :key="index" v-if="item.pipelineCrons.length > 0">
                            <td>{{ translateMinute(i.crontabMinute) }}</td>
                            <td>{{ translateHour(i.crontabHour) }}</td>
                            <td>{{ translateDay(i.crontabDay) }}</td>
                            <td>{{ translateMonth(i.crontabMonth) }}</td>
                            <td>{{ translateWeek(i.crontabWeek) }}</td>
                            <td>
                              <template>
                                <Operations
                                  :operations="[
                                  { text: $vuetify.lang.t('$vuetify.lang_menu_copy_pipeline_crontab'), onClick: () => {openCronCopy(item.branchName, i)} },
                                    { text: $vuetify.lang.t('$vuetify.lang_menu_delete_pipeline_crontab'), onClick: () => {openCronDelete(item.branchName, i.crontabMinute+' '+i.crontabHour+' '+i.crontabDay+' '+i.crontabMonth+' '+i.crontabWeek)} },
                                  ]"
                                  :opt-button-text="item.envName"
                                  :opt-button-icon="(item.privileged ? 'mdi-security' : '')"
                                />
                              </template>
                            </td>
                          </tr>
                          <tr v-if="item.pipelineCrons.length <= 0">
                            <td colspan="7" class="text-center">{{$vuetify.lang.t('$vuetify.lang_tip_no_data_available')}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
                <v-card class="rounded-0">
                  <v-card-title>
                    {{ $vuetify.lang.t('$vuetify.lang_view_trigger_settings') }}
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" @click="openTriggerAdd(item.branchName)">{{ $vuetify.lang.t('$vuetify.lang_menu_add_pipeline_trigger') }}</v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="[
                        { text: $vuetify.lang.t('$vuetify.lang_view_trigger_before_execute'), value: 'beforeExecute', sortable: true },
                        { text: $vuetify.lang.t('$vuetify.lang_view_trigger_type'), value: 'stepAction', sortable: true },
                        { text: $vuetify.lang.t('$vuetify.lang_view_trigger_statuses'), value: 'statusResults', sortable: false },
                        { text: $vuetify.lang.t('$vuetify.lang_view_is_active'), value: 'enable', sortable: false },
                        { text: $vuetify.lang.t('$vuetify.lang_view_trigger_mail_committee'), value: 'mailCommittees', sortable: false },
                        { text: $vuetify.lang.t('$vuetify.lang_view_trigger_notice_committee'), value: 'noticeCommittees', sortable: false },
                        { text: $vuetify.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
                      ]"
                      ref="triggerRef"
                      :items="item.pipelineTriggers"
                      disable-pagination
                      class="elevation-1"
                      dense
                      :branchName="item.branchName"
                      item-key="index"
                      show-expand
                      hide-default-footer
                    >
                      <template v-slot:item.beforeExecute="{ item }">
                        {{ item.beforeExecute | translateYesNo }}
                      </template>
                      <template v-slot:item.stepAction="{ item }">
                        {{ item.stepAction }}
                      </template>
                      <template v-slot:item.enable="{ item }">
                        {{ item.enable | translateYesNo }}
                      </template>
                      <template v-slot:item.mailCommittees="{ item }">
                        {{ item.mailCommittees | translateYesNo }}
                      </template>
                      <template v-slot:item.noticeCommittees="{ item }">
                        {{ item.noticeCommittees | translateYesNo }}
                      </template>
                      <template v-slot:item.handle="{ item }">
                        <Operations
                          :operations="[
                            { text: $vuetify.lang.t('$vuetify.lang_menu_update_pipeline_trigger'), onClick: () => {openTriggerUpdate($refs.triggerRef.$attrs.branchName, item.stepAction, item.beforeExecute)} },
                            { text: $vuetify.lang.t('$vuetify.lang_menu_copy_pipeline_trigger'), onClick: () => {openTriggerCopy($refs.triggerRef.$attrs.branchName, item)} },
                            { text: $vuetify.lang.t('$vuetify.lang_menu_delete_pipeline_trigger'), onClick: () => {openTriggerDelete($refs.triggerRef.$attrs.branchName, item.stepAction, item.beforeExecute)} }
                          ]"
                        />
                      </template>
                      <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="pa-1">
                          <v-simple-table dense>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">
                                    {{$vuetify.lang.t('$vuetify.lang_view_webhook_request_url')}}
                                  </th>
                                  <th class="text-left">
                                    {{$vuetify.lang.t('$vuetify.lang_view_webhook_request_method')}}
                                  </th>
                                  <th class="text-left">
                                    {{$vuetify.lang.t('$vuetify.lang_view_mail_receivers')}}
                                  </th>
                                  <th class="text-left">
                                    {{$vuetify.lang.t('$vuetify.lang_view_notifications_users')}}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{{ item.webhookUrl }}</td>
                                  <td>{{ item.webhookMethod }}</td>
                                  <td>{{ item.mailReceivers ? item.mailReceivers.toString() : ''  }}</td>
                                  <td>{{ item.noticeUsernames ? item.noticeUsernames.toString() : '' }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.lang_view_envs_settings')}}
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-if="project"
            :headers="[{ text: $vuetify.lang.t('$vuetify.lang_view_env'), sortable: false, value: 'envName' }]"
            :items="project.projectAvailableEnvs"
            single-expand
            item-key="envName"
            show-expand
            hide-default-footer
            >
            <template v-slot:expanded-item="{ headers,item }">
              <td :colspan="headers.length" class="pa-1">
                <v-card class="rounded-0">
                  <v-card class="rounded-0">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_resource_quotas_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1" @click="openQuotaConfig(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_update_resource_quota') }}</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-simple-table dense class="limit-config">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-center" colspan="5">
                                {{$vuetify.lang.t('$vuetify.lang_view_project_namespace_quota')}}
                              </th>
                              <th class="text-center" v-if="item.quotaConfig.usedQuota.extraQuotas" :colspan="item.quotaConfig.usedQuota.extraQuotas.length">
                                {{$vuetify.lang.t('$vuetify.lang_view_project_namespace_quota_extra_quotas')}}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_memory_request')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_cpu_request')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_memory_limit')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_cpu_limit')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_pods_limit')}}</td>
                              <td v-for="(item, i) in item.quotaConfig.usedQuota.extraQuotas" :key="i">
                                {{ item.name }}
                              </td>
                            </tr>
                            <tr>
                              <td>{{ item.quotaConfig.usedQuota.memoryRequest }} / {{ item.quotaConfig.namespaceQuota.memoryRequest }} <br/> <v-chip small color="blue" text-color="white">{{ (item.quotaConfig.resourceRate.memoryRequestRate * 100).toFixed(2) }}%</v-chip></td>
                              <td>{{ item.quotaConfig.usedQuota.cpuRequest }} / {{ item.quotaConfig.namespaceQuota.cpuRequest }} <br/> <v-chip small color="blue" text-color="white">{{ (item.quotaConfig.resourceRate.cpuRequestRate * 100).toFixed(2) }}%</v-chip></td>
                              <td>{{ item.quotaConfig.usedQuota.memoryLimit }} / {{ item.quotaConfig.namespaceQuota.memoryLimit }} <br/> <v-chip small color="blue" text-color="white">{{ (item.quotaConfig.resourceRate.memoryLimitRate * 100).toFixed(2) }}%</v-chip></td>
                              <td>{{ item.quotaConfig.usedQuota.cpuLimit }} / {{ item.quotaConfig.namespaceQuota.cpuLimit }} <br/> <v-chip small color="blue" text-color="white">{{ (item.quotaConfig.resourceRate.cpuLimitRate * 100).toFixed(2) }}%</v-chip></td>
                              <td>{{ item.quotaConfig.usedQuota.podsLimit }} / {{ item.quotaConfig.namespaceQuota.podsLimit }} <br/> <v-chip small color="blue" text-color="white">{{ (item.quotaConfig.resourceRate.podsRate * 100).toFixed(2) }}%</v-chip></td>
                              <td v-for="(item, i) in item.quotaConfig.usedQuota.extraQuotas" :key="i">
                                {{ item.value }} / {{ item.hard }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <v-simple-table dense class="limit-config">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-center" :colspan="4">
                                {{$vuetify.lang.t('$vuetify.lang_view_project_default_quota')}}
                              </th>
                              <th class="text-center" v-if="item.quotaConfig.defaultQuota.extraRequest" :colspan="item.quotaConfig.defaultQuota.extraRequest.length">
                                {{$vuetify.lang.t('$vuetify.lang_view_project_default_quota_extra_request')}}
                              </th>
                              <th class="text-center" v-if="item.quotaConfig.defaultQuota.extraLimit" :colspan="item.quotaConfig.defaultQuota.extraLimit.length">
                                {{$vuetify.lang.t('$vuetify.lang_view_project_default_quota_extra_limit')}}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_memory_request')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_cpu_request') }}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_memory_limit')}}</td>
                              <td>{{$vuetify.lang.t('$vuetify.lang_view_cpu_limit')}}</td>
                              <td v-for="(item, i) in item.quotaConfig.defaultQuota.extraRequest" :key="'extraRequest'+i">
                                {{ item.name }}
                              </td>
                              <td v-for="(item, i) in item.quotaConfig.defaultQuota.extraLimit" :key="'extraLimit'+i">
                                {{ item.name }}
                              </td>
                            </tr>
                            <tr>
                              <td>{{ item.quotaConfig.defaultQuota.memoryRequest }}</td>
                              <td>{{ item.quotaConfig.defaultQuota.cpuRequest }}</td>
                              <td>{{ item.quotaConfig.defaultQuota.memoryLimit }}</td>
                              <td>{{ item.quotaConfig.defaultQuota.cpuLimit }}</td>
                              <td v-for="(item, i) in item.quotaConfig.defaultQuota.extraRequest" :key="'extraRequest'+i">
                                {{ item.value }}
                              </td>
                              <td v-for="(item, i) in item.quotaConfig.defaultQuota.extraLimit" :key="'extraLimit'+i">
                                {{ item.value }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_pvs_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAllotPV(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_assign_pv') }}</v-btn>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAllotSC(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_assign_storage_class_pv') }}</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_pv_name')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_pv_type')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_pv_bind_project')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_pv_pvc_name')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(i,index) in item.pvs" :key="index" v-if="item.pvs.length > 0">
                              <td>{{ i.pvName }}</td>
                              <td>{{ i.pvType }}</td>
                              <td>{{ targetProjectName }}</td>
                              <td>{{ i.pvcName }}</td>
                              <td>
                                <template>
                                  <v-btn color="primary" small class="my-1 mr-1" @click="openDeletePV(item.envName,i.pvcName)">{{ $vuetify.lang.t('$vuetify.lang_menu_remove_pv') }}</v-btn>
                                </template>
                              </td>
                            </tr>
                            <tr v-if="item.pvs.length <= 0">
                              <td colspan="7" class="text-center">{{$vuetify.lang.t('$vuetify.lang_tip_no_data_available')}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_network_policy_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAddNetworkPolicy(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_network_policy') }}</v-btn>
                      <v-btn color="primary" small class="my-1 mr-1" :href="item.dashboardUrlNetworkPolicy" target="_blank">{{ $vuetify.lang.t('$vuetify.lang_menu_network_policy_dashboard') }}</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_network_policy_name')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_network_policy_type')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_network_policy_yaml')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(i,index) in item.networkPolicies" :key="index" v-if="item.networkPolicies.length > 0">
                              <td>{{ i.name }}</td>
                              <td>{{ i.policyTypes }}</td>
                              <td>
                                <template>
                                  <v-btn small color="primary" @click="showYaml(i.networkPolicyYaml, $vuetify.lang.t('$vuetify.lang_view_network_policy_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                                </template>
                              </td>
                              <td>
                                <template>
                                  <Operations
                                    :operations="[
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_delete_network_policy'), onClick: () => {openNetworkPolicyDelete($refs.hostRef.$attrs.envname, i.name)} }
                                    ]"
                                  />
                                </template>
                              </td>
                            </tr>
                            <tr v-if="item.networkPolicies.length <= 0">
                              <td colspan="7" class="text-center">{{$vuetify.lang.t('$vuetify.lang_tip_no_data_available')}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_hosts_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAllotHost(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_host') }}</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="[
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_name'), sortable: false, value: 'hostName' },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_group'), value: 'groups', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_address'), value: 'hostAddr', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_port'), value: 'hostPort', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_remote_user'), value: 'hostUser', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_remote_password'), value: 'hostPassword', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_is_sudo'), value: 'hostBecome', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_sudo_user'), value: 'hostBecomeUser', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_host_sudo_password'), value: 'hostBecomePassword', sortable: false },
                          { text: $vuetify.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
                        ]"
                        :items="item.hosts"
                        disable-pagination
                        class="elevation-1"
                        dense
                        ref="hostRef"
                        :envname="item.envName"
                        item-key="hostName"
                        show-expand
                        hide-default-footer
                      >
                        <template v-slot:item.groups="{ item }">
                          <v-chip v-for="(i,index) in item.groups" :key="index" small color="primary">{{i}}</v-chip>
                        </template>
                        <template v-slot:item.hostPassword="{ item }">
                          <td><v-chip outlined color="primary" small v-clipboard:copy="item.hostPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip></td>
                        </template>
                        <template v-slot:item.hostBecomeUser="{ item }">
                          <td v-if="item.hostBecomeUser">{{ item.hostBecomeUser }}</td>
                        </template>
                        <template v-slot:item.hostBecomePassword="{ item }">
                          <td v-if="item.hostBecomePassword"> <v-chip outlined color="primary" small v-clipboard:copy="item.hostBecomePassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip></td>
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                          <td :colspan="headers.length" class="pa-1" v-if="Object.keys(item.variables).length > 0">
                            <div class="pl-2">{{$vuetify.lang.t('$vuetify.lang_view_host_variables')}}</div>
                            <v-simple-table dense>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left" v-for="(p,index) in Object.entries(item.variables)" :key="index">
                                      {{p[0]}}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td v-for="(p,index) in Object.entries(item.variables)" :key="index">
                                      {{p[1]}}
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </td>
                        </template>
                        <template v-slot:item.handle="{item}">
                          <Operations
                            :operations="[
                              { text: $vuetify.lang.t('$vuetify.lang_menu_update_host'), onClick: () => {openHostUpdate($refs.hostRef.$attrs.envname, item.hostName)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_copy_host'), onClick: () => {openHostCopy($refs.hostRef.$attrs.envname, item)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_add_host_to_other_project'), onClick: () => {openHostJoin(item.hostName,$refs.hostRef.$attrs.envname)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_remove_host_from_env'), onClick: () => {openHostLeave($refs.hostRef.$attrs.envname, item.hostName)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_delete_host'), onClick: () => {openHostDelete($refs.hostRef.$attrs.envname, item.hostName)} }
                            ]"
                          />
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_databases_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAllotDb(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_database') }}</v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_database_name')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_database_jdbc')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_database_username')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_database_password')}}
                              </th>
                              <th class="text-left">
                                {{$vuetify.lang.t('$vuetify.lang_view_operations')}}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(i,index) in item.databases" :key="index" v-if="item.databases.length > 0">
                              <td>{{ i.dbName }}</td>
                              <td>{{ i.dbUrl }}</td>
                              <td>{{ i.dbUser }}</td>
                              <td><v-chip outlined color="primary" small v-clipboard:copy="i.dbPassword" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$vuetify.lang.t('$vuetify.lang_menu_copy')}}</v-chip></td>
                              <td>
                                <template>
                                  <Operations
                                    :operations="[
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_update_database'), onClick: () => {openDbUpdate(item.envName, i.dbName)} },
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_copy_database'), onClick: () => {openDbCopy(item.envName, i)} },
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_add_database_to_other_project'), onClick: () => {openDbJoin(i.dbName)} },
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_remove_database_from_env'), onClick: () => {openDbLeave(item.envName, i.dbName)} },
                                      { text: $vuetify.lang.t('$vuetify.lang_menu_delete_database'), onClick: () => {openDeleteDB(item.envName, i.dbName)} }
                                    ]"
                                  />
                                </template>
                              </td>
                            </tr>
                            <tr v-if="item.databases.length <= 0">
                              <td colspan="5" class="text-center">{{$vuetify.lang.t('$vuetify.lang_tip_no_data_available')}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_debug_components_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAddDebug(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_debug_component') }}</v-btn>
                    </v-card-title>
                    <v-card-text class="info-table">
                      <v-data-table
                        :headers="debugComponentHeaders"
                        :items="Object.keys(item.componentDebug).length > 0 ? [item.componentDebug] : []"
                        disable-pagination
                        class="elevation-1"
                        dense
                        ref="debugRef"
                        :envname="item.envName"
                        item-key="componentDebugYaml"
                        show-expand
                        hide-default-footer
                      >
                        <template v-slot:item.componentDebugYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.deploySpecDebug, $vuetify.lang.t('$vuetify.lang_view_debug_component_def_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.componentYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.deploymentYaml+item.serviceYaml+item.ingressYaml, $vuetify.lang.t('$vuetify.lang_view_debug_component_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.componentK8sYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.k8sDeploymentYaml+item.k8sServiceYaml+item.k8sIngressYaml, $vuetify.lang.t('$vuetify.lang_view_debug_component_current_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.readmeYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.readmeYaml, $vuetify.lang.t('$vuetify.lang_view_debug_component_connect_desc'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.time="{ item }">
                          {{item.createTime}}<br>{{item.updateTime}}
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                          <td :colspan="headers.length" class="pa-1">
                            <v-simple-table dense>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left">
                                      podName
                                    </th>
                                    <th class="text-left">
                                      imageName
                                    </th>
                                    <th class="text-left">
                                      ready
                                    </th>
                                    <th class="text-left">
                                      reason
                                    </th>
                                    <th class="text-left">
                                      restart
                                    </th>
                                    <th class="text-left">
                                      age
                                    </th>
                                    <th class="text-left">
                                      {{ $vuetify.lang.t('$vuetify.lang_view_pods_pod_spec') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="i in item.podStatuses" :key="i.podName">
                                    <td>{{ i.podName }}</td>
                                    <td>{{ i.imageName }}</td>
                                    <td>{{ i.ready }}</td>
                                    <td>{{ i.reason }}</td>
                                    <td>{{ i.restart }}</td>
                                    <td>{{ i.age }}</td>
                                    <td>
                                      <v-btn small color="primary" @click="showYaml(i.podSpec, $vuetify.lang.t('$vuetify.lang_view_pods_pod_spec'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </td>
                        </template>
                        <template v-slot:item.handle="{item}">
                          <Operations
                            :operations="[
                              { text: $vuetify.lang.t('$vuetify.lang_menu_update_debug_component'), onClick: () => {openUpdateDebug($refs.debugRef.$attrs.envname)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_delete_debug_component'), onClick: () => {openDeleteDebug($refs.debugRef.$attrs.envname)} },
                            ]"
                          />
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                  <v-card class="rounded-0 mt-1">
                    <v-card-title>
                      {{$vuetify.lang.t('$vuetify.lang_view_env_components_settings')}}
                      <v-spacer></v-spacer>
                      <v-btn color="primary" small class="my-1 mr-1" @click="openAddComponent(item.envName)">{{ $vuetify.lang.t('$vuetify.lang_menu_new_component') }}</v-btn>
                    </v-card-title>
                    <v-card-text class="info-table">
                      <v-data-table
                        :headers="componentHeaders"
                        :items="item.components"
                        disable-pagination
                        class="elevation-1"
                        dense
                        ref="componentRef"
                        :envname="item.envName"
                        item-key="componentName"
                        show-expand
                        hide-default-footer
                      >
                        <template v-slot:item.componentName="{ item }">
                          <div>
                            <div>{{ item.componentName }}</div>
                            <div>{{ item.componentDesc }}</div>
                          </div>
                        </template>
                        <template v-slot:item.componentYaml="{ item }">
                          <v-btn v-if="item.deploySpecStatic" small color="primary" @click="showYaml(item.deploySpecStatic, $vuetify.lang.t('$vuetify.lang_view_component_def_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.componentDeploymentYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.deploymentYaml+item.serviceYaml+item.hpaYaml+item.ingressYaml, $vuetify.lang.t('$vuetify.lang_view_component_deployment_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.componentK8sDeploymentYaml="{ item }">
                          <v-btn small color="primary" @click="showYaml(item.k8sDeploymentYaml+item.k8sServiceYaml+item.k8sHpaYaml+item.k8sIngressYaml, $vuetify.lang.t('$vuetify.lang_view_current_deployment_yaml'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                        </template>
                        <template v-slot:item.time="{ item }">
                          {{item.createTime}}<br>{{item.updateTime}}
                        </template>
                        <template v-slot:item.handle="{ item }">
                          <Operations
                            :operations="[
                              { text: $vuetify.lang.t('$vuetify.lang_menu_update_component'), onClick: () => {openUpdateComponent($refs.componentRef.$attrs.envname,item.componentName)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_copy_component'), onClick: () => {openCopyComponent($refs.componentRef.$attrs.envname,item)} },
                              { text: $vuetify.lang.t('$vuetify.lang_menu_delete_component'), onClick: () => {openDeleteComponent($refs.componentRef.$attrs.envname,item.componentName)} },
                            ]"
                          />
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                          <td :colspan="headers.length" class="pa-1">
                            <v-simple-table dense>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left">
                                      podName
                                    </th>
                                    <th class="text-left">
                                      imageName
                                    </th>
                                    <th class="text-left">
                                      ready
                                    </th>
                                    <th class="text-left">
                                      reason
                                    </th>
                                    <th class="text-left">
                                      restart
                                    </th>
                                    <th class="text-left">
                                      age
                                    </th>
                                    <th class="text-left">
                                      {{ $vuetify.lang.t('$vuetify.lang_view_pods_pod_spec') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="i in item.podStatuses" :key="i.podName">
                                    <td>{{ i.podName }}</td>
                                    <td>{{ i.imageName }}</td>
                                    <td>{{ i.ready }}</td>
                                    <td>{{ i.reason }}</td>
                                    <td>{{ i.restart }}</td>
                                    <td>{{ i.age }}</td>
                                    <td>
                                      <v-btn small color="primary" @click="showYaml(i.podSpec, $vuetify.lang.t('$vuetify.lang_view_pods_pod_spec'))">{{ $vuetify.lang.t('$vuetify.lang_menu_view_detail') }}</v-btn>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </td>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </PageCard>
    <div class="dialog-box">
      <v-dialog
        v-model="varsDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_pipeline_variables_desc')}}</span>
            <v-spacer></v-spacer>
            <v-icon class="ml-4" @click="() => {
              this.varsDialog = false
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <Monaco
              :monacoOptions="markdownMonacoOptions"
              :height="600"
            ></Monaco>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="newEnvDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_project_envs')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_project_envs_prompt')}}</small>
            </v-alert>
            <v-form ref="chooseEnvRef">
              <v-autocomplete
                v-model="newEnvSelect"
                :items="newEnvSelectList"
                :label="$vuetify.lang.t('$vuetify.lang_form_new_project_envs_env_names')"
                multiple
                dense
                small-chips
                :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
              ></v-autocomplete>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.newEnvDialog = false
                this.$refs.chooseEnvRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="newEnv()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteNodePortDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_project_node_ports')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_project_node_ports_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_project_node_ports_tip_1', targetProjectName, targetEnvName, targetNodeport)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteNodePortDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="recycleNodeport()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteEnvDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{handleEnvType == 0 ? $vuetify.lang.t('$vuetify.lang_form_delete_project_envs') : $vuetify.lang.t('$vuetify.lang_form_delete_project_envs_all')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info" v-if="handleEnvType == 0">
              <small>
                {{$vuetify.lang.t('$vuetify.lang_form_delete_project_envs_prompt')}}
              </small>
            </v-alert>
            <v-alert icon="mdi-alert-circle" prominent text type="error" v-else>
              <small>
                {{$vuetify.lang.t('$vuetify.lang_form_delete_project_envs_all_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip>
              </small>
            </v-alert>
            <small>{{$vuetify.lang.t('$vuetify.lang_form_required_tip')}}</small>
            <v-container>
              <v-form ref="deleteEnvRef">
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="handleEnvType"
                      :items="[{text: $vuetify.lang.t('$vuetify.lang_form_delete_project_envs'), value: '0'}, {text: $vuetify.lang.t('$vuetify.lang_form_delete_project_envs_all'), value: '1'}]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_envs_select')"
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" v-if="handleEnvType == 0">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_delete_project_envs_tip_1', targetProjectName, deleteEnvName)}}</div>
                  </v-col>
                  <v-col cols="12" v-else>
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_env_name')"
                      required
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="confirmValue"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_project_envs_all_tip_1', targetProjectName, deleteEnvName)"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteEnvDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="recycleEnv()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addNodePortDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_project_node_ports')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_project_node_ports_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_new_project_node_ports_tip_1', targetProjectName, targetEnvName)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="addNodePortDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="newNodePort()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateProjectDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_project')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="updateProjectRef">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_required_tip')}}</small>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_project_desc')"
                      v-model="updateProjectForm.projectDesc"
                      required
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_project_desc_tip_1')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_project_team')"
                      v-model="updateProjectForm.projectTeam"
                      required
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_project_team_tip_1')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="updateProjectForm.projectArch"
                      :items="archNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_project_arch')"
                      required
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_project_arch_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.gitRepoType === 'githubCreate' || project.projectRepo.gitRepoType === 'githubExist' || project.projectRepo.gitRepoType === 'giteeCreate' || project.projectRepo.gitRepoType === 'giteeExist' || project.projectRepo.gitRepoType === 'externalExist'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_user')"
                      dense
                      v-model="updateProjectForm.gitRepoUser"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_user_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.gitRepoType === 'githubCreate' || project.projectRepo.gitRepoType === 'githubExist' || project.projectRepo.gitRepoType === 'giteeCreate' || project.projectRepo.gitRepoType === 'giteeExist'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_token')"
                      dense
                      v-model="updateProjectForm.gitRepoToken"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_token_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.gitRepoType === 'externalExist'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_password')"
                      dense
                      v-model="updateProjectForm.gitRepoPassword"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_password_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_build_settings_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.buildSettingsDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_database_scripts_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.databaseScriptsDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_demo_codes_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.demoCodesDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_deploy_scripts_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.deployScriptsDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_documents_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.documentsDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_git_repo_dir_test_scripts_dir')"
                      dense
                      v-model="updateProjectForm.gitRepoDir.testScriptsDir"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.imageRepoName === ''"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_host_name')"
                      dense
                      v-model="updateProjectForm.imageRepoHostName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_host_name_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.imageRepoName === ''"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_group_name')"
                      dense
                      v-model="updateProjectForm.imageRepoGroupName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_group_name_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.imageRepoName === ''"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_user_name')"
                      dense
                      v-model="updateProjectForm.imageRepoUserName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_user_name_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.imageRepoName === ''"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_password')"
                      dense
                      v-model="updateProjectForm.imageRepoPassword"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_image_repo_password_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'ftp' || project.projectRepo.artifactRepoType === 'sftp'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name')"
                      dense
                      v-model="updateProjectForm.artifactRepoHostName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_host_name_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'ftp' || project.projectRepo.artifactRepoType === 'sftp'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_port')"
                      dense
                      v-model.number="updateProjectForm.artifactRepoPort"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'ftp' || project.projectRepo.artifactRepoType === 'sftp'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_path')"
                      dense
                      v-model="updateProjectForm.artifactRepoPath"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_path_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'ftp' || project.projectRepo.artifactRepoType === 'sftp' || project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_user_name')"
                      dense
                      v-model="updateProjectForm.artifactRepoUserName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'ftp' || project.projectRepo.artifactRepoType === 'sftp' || project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_password')"
                      dense
                      v-model="updateProjectForm.artifactRepoPassword"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_url')"
                      dense
                      v-model="updateProjectForm.artifactRepoHttpUpload.url"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-autocomplete
                      v-model="updateProjectForm.artifactRepoHttpUpload.method"
                      :items="['PUT', 'POST']"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_method')"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-autocomplete
                      v-model="updateProjectForm.artifactRepoHttpUpload.insecure"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_upload_insecure')"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_url')"
                      dense
                      v-model="updateProjectForm.artifactRepoHttpDownload.url"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_url_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.artifactRepoType === 'http'"
                  >
                    <v-autocomplete
                      v-model="updateProjectForm.artifactRepoHttpDownload.insecure"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_artifact_repo_http_download_insecure')"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="project.projectRepo.scanCodeRepoName === ''"
                  >
                    <v-autocomplete
                      v-model="updateProjectForm.scanCodeRepoName"
                      :items="repoNames.scanCodeRepoNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name')"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_project_scan_code_repo_name_tip_1') + $vuetify.lang.t('$vuetify.lang_form_update_project_leave_it_empty')"
                      persistent-hint
                      dense
                    ></v-autocomplete>
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
                this,$refs.updateProjectRef.resetValidation()
                this.updateProjectDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateProject()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateProjectEnvDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_project_env', updateProjectEnvForm.envName)}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="updateProjectEnvRef">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_required_tip')}}</small>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="updateProjectEnvForm.privileged"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_privileged')"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_privileged_tip_1')"
                      persistent-hint
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="updateProjectEnvForm.disabledDefs"
                      :items="disabledDefNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs')"
                      dense
                      multiple
                      small-chips
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_defs_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="updateProjectEnvForm.disabledPatches"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_update_project_env_disabled_patches_tip_1')"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
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
                this,$refs.updateProjectEnvRef.resetValidation()
                this.updateProjectEnvDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateProjectEnv()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteProjectDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_project')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="deleteProjectRef">
              <v-alert icon="mdi-alert-circle" prominent text type="error">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_project_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
              </v-alert>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="deleteProjectForm.gitRepoDelete"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_git_repo_delete')"
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="deleteProjectForm.scanCodeRepoDelete"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_scan_code_repo_delete')"
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="deleteProjectForm.imageRepoDelete"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_image_repo_delete')"
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="deleteProjectForm.artifactRepoDelete"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_artifact_repo_delete')"
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="deleteProjectForm.namespaceDelete"
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true},
                        {text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_project_namespace_delete')"
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_project_project_name')"
                      required
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="confirmValue"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_project_tip_1', targetProjectName)"
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
                this.deleteProjectDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteProject()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateSecretKeyDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_refresh_all_token')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_tip_1', targetProjectName)}}
            </div>
            <v-form ref="updateSecretKeyRef">
              <v-container>
                <v-row>
                  <v-col cols="12" v-if="project.projectSecret.harborPassword">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_harbor_password')"
                      :type="harborPasswordDisplay ? 'text' : 'password'"
                      v-model="updateSecretKeyForm.harborPassword"
                      :append-icon="harborPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="harborPasswordDisplay = !harborPasswordDisplay"
                      dense
                      :hint="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_password_tip_1')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="project.projectRepo.artifactRepo">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_nexus_password')"
                      :type="nexusPasswordDisplay ? 'text' : 'password'"
                      v-model="updateSecretKeyForm.nexusPassword"
                      :append-icon="nexusPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="nexusPasswordDisplay = !nexusPasswordDisplay"
                      dense
                      :hint="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_password_tip_1')"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="project.projectRepo.scanCodeRepo">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_sonar_password')"
                      :type="sonarPasswordDisplay ? 'text' : 'password'"
                      v-model="updateSecretKeyForm.sonarPassword"
                      :append-icon="sonarPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="sonarPasswordDisplay = !sonarPasswordDisplay"
                      dense
                      :hint="$vuetify.lang.t('$vuetify.lang_form_refresh_all_token_password_tip_1')"
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
              @click="updateSecretKeyDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateToken()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="reApplyKubernetesDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_re_apply_kubernetes')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_re_apply_kubernetes_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_re_apply_kubernetes_tip_1', targetProjectName)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="reApplyKubernetesDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="reApplyKubernetes()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="cleanGitRepoDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_clean_temp_git_repos')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_clean_temp_git_repos_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_clean_temp_git_repos_tip_1', targetProjectName)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="cleanGitRepoDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="cleanGitRepo()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="assignPermissionDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_form_assign_permissions') }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="memberAddRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_prompt')}}</small>
              </v-alert>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="memberAddForm.username"
                      :items="userNames"
                      dense
                      required
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_user_username')"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="accessLevel"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level')"
                      dense
                      required
                      v-model="memberAddForm.accessLevel"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :messages="[
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1'), 
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2'),
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3'),
                      ]"
                    >
                      <template v-slot:message>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3')}}</div>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_menu_pipeline_def'), value: 'pipelineDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_build_def'), value: 'buildDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_package_def'), value: 'packageDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_artifact_def'), value: 'artifactDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_docker_ignore_def'), value: 'dockerIgnoreDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_custom_step_def'), value: 'customStepDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_ops_def'), value: 'customOpsDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_ops_batch_def'), value: 'opsBatchDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_deploy_container_def'), value: 'deployContainerDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_deploy_artifact_def'), value: 'deployArtifactDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_istio_def'), value: 'istioDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_istio_gateway_def'), value: 'istioGatewayDef'},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_project_defs')"
                      multiple
                      small-chips
                      dense
                      v-model="memberAddForm.disableProjectDefs"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_image'), value: 'image'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_artifact'), value: 'artifact'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_scan_code'), value: 'scanCode'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_k8s'), value: 'k8s'},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets')"
                      multiple
                      small-chips
                      dense
                      v-model="memberAddForm.disableRepoSecrets"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="memberAddForm.disablePipelines"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines_tip_1')"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
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
                this.$refs.memberAddRef.reset()
                this.assignPermissionDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="memberAdd()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updatePermissionDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_change_permissions')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="updateMemberRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_change_permissions_prompt', memberAddForm.username, targetProjectName)}}</small>
              </v-alert>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="accessLevel"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level')"
                      dense
                      v-model="memberAddForm.accessLevel"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :messages="[
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1'), 
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2'),
                        $vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3'),
                      ]"
                    >
                      <template v-slot:message>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_assign_permissions_access_level_tip_3')}}</div>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_menu_pipeline_def'), value: 'pipelineDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_build_def'), value: 'buildDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_package_def'), value: 'packageDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_artifact_def'), value: 'artifactDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_docker_ignore_def'), value: 'dockerIgnoreDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_custom_step_def'), value: 'customStepDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_ops_def'), value: 'customOpsDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_ops_batch_def'), value: 'opsBatchDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_deploy_container_def'), value: 'deployContainerDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_deploy_artifact_def'), value: 'deployArtifactDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_istio_def'), value: 'istioDef'},
                        {text: $vuetify.lang.t('$vuetify.lang_view_istio_gateway_def'), value: 'istioGatewayDef'},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_project_defs')"
                      multiple
                      small-chips
                      dense
                      v-model="memberAddForm.disableProjectDefs"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="[
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_image'), value: 'image'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_artifact'), value: 'artifact'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_scan_code'), value: 'scanCode'},
                        {text: $vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets_k8s'), value: 'k8s'},
                      ]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_repo_secrets')"
                      multiple
                      small-chips
                      dense
                      v-model="memberAddForm.disableRepoSecrets"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="memberAddForm.disablePipelines"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_assign_permissions_disable_pipelines_tip_1')"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
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
                this.$refs.updateMemberRef.reset()
                this.updatePermissionDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateMember()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deletePermissionsDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_permissions')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_permissions_prompt', targetUsername, targetProjectName)}}</small>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deletePermissionsDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteMember()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addPipelineDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_pipeline')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_pipeline_prompt', targetProjectName)}}</small>
            </v-alert>
            <v-form ref="addPipelineRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_branch_name')"
                      dense
                      v-model="addPipelineForm.branchName"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_branch_name_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="sourceBranchNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_source_branch')"
                      dense
                      v-model="addPipelineForm.sourceBranch"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_source_branch_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="envList"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_envs')"
                      multiple
                      dense
                      small-chips
                      v-model="addPipelineForm.envs"
                      :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_envs_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="envList"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_env_productions')"
                      multiple
                      dense
                      small-chips
                      v-model="addPipelineForm.envProductions"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_env_productions_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row v-if="project.projectRepo.gitRepoType !== 'externalExist'">
                  <v-col cols="12">
                    <v-autocomplete
                      :items="gitPush"
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_webhook_push_event')"
                      dense
                      v-model="addPipelineForm.webhookPushEvent"
                      :rules="[v => (project.projectRepo.gitRepoType === 'externalExist' || typeof(v) == 'boolean') || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_webhook_push_event_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
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
                this.$refs.addPipelineRef.reset()
                this.addPipelineDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="addPipeline()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deletePipelineDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="deleteBranchNameRef">
              <v-alert icon="mdi-alert-circle" prominent text type="error">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
              </v-alert>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_branch_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_branch_name_tip_1', targetBranchName)"
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
              @click="() =>{
                this.$refs.deleteBranchNameRef.reset()
                this.deletePipelineDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deletePipeline()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addPipelineEnvDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="addPipelineEnvRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_prompt', targetPipelineName)}}</small>
              </v-alert>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="envList"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name')"
                      dense
                      v-model="addPipelineEnvForm.envName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_env_name_tip_1')"
                      persistent-hint
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="[{ text: $vuetify.lang.t('$vuetify.lang_view_production_envs'), value: true }, { text: $vuetify.lang.t('$vuetify.lang_view_ci_envs'), value: false }]"
                      :label="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_is_production_env')"
                      dense
                      v-model="addPipelineEnvForm.isProductionEnv"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_assign_pipeline_envs_is_production_env_tip_1')"
                      persistent-hint
                      :rules="[v => typeof(v)== 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    ></v-autocomplete>
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
                this.$refs.addPipelineEnvRef.reset()
                this.addPipelineEnvDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="addPipelineEnv()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deletePipelineEnvDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_envs')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_envs_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_envs_tip_1', deletePipelineEnvForm.envName, deletePipelineEnvForm.branchName)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deletePipelineEnvDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deletePipelineEnv()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="refreshTokenDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_pipeline_token')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_pipeline_token_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_update_pipeline_token_tip_1', targetBranchName)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="refreshTokenDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="refreshToken()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addCrontabDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {openCopyToBranchCrontab()}">mdi-arrow-left-bold-hexagon-outline</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cron_copy_to_branches')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="cronAdd()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="primary" 
                  class="mr-4" 
                  v-bind="attrs" 
                  v-on="on" 
                  @click="() => {
                    $refs.cronAddRef.reset()
                    addCrontabDialog = false
                  }"
                >mdi-close</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}</div>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_prompt', targetPipelineName)}}</small>
            </v-alert>
            <v-form ref="cronAddRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_minute')"
                      dense
                      :items="[
                        {text: translateMinute(0) ,  value: 0},
                        {text: translateMinute(1) ,  value: 1},
                        {text: translateMinute(2) ,  value: 2},
                        {text: translateMinute(3) ,  value: 3},
                        {text: translateMinute(4) ,  value: 4},
                        {text: translateMinute(5) ,  value: 5},
                        {text: translateMinute(6) ,  value: 6},
                        {text: translateMinute(7) ,  value: 7},
                        {text: translateMinute(8) ,  value: 8},
                        {text: translateMinute(9) ,  value: 9},
                        {text: translateMinute(10) , value: 10},
                        {text: translateMinute(11) , value: 11},
                        {text: translateMinute(12) , value: 12},
                        {text: translateMinute(13) , value: 13},
                        {text: translateMinute(14) , value: 14},
                        {text: translateMinute(15) , value: 15},
                        {text: translateMinute(16) , value: 16},
                        {text: translateMinute(17) , value: 17},
                        {text: translateMinute(18) , value: 18},
                        {text: translateMinute(19) , value: 19},
                        {text: translateMinute(20) , value: 20},
                        {text: translateMinute(21) , value: 21},
                        {text: translateMinute(22) , value: 22},
                        {text: translateMinute(23) , value: 23},
                        {text: translateMinute(24) , value: 24},
                        {text: translateMinute(25) , value: 25},
                        {text: translateMinute(26) , value: 26},
                        {text: translateMinute(27) , value: 27},
                        {text: translateMinute(28) , value: 28},
                        {text: translateMinute(29) , value: 29},
                        {text: translateMinute(30) , value: 30},
                        {text: translateMinute(31) , value: 31},
                        {text: translateMinute(32) , value: 32},
                        {text: translateMinute(33) , value: 33},
                        {text: translateMinute(34) , value: 34},
                        {text: translateMinute(35) , value: 35},
                        {text: translateMinute(36) , value: 36},
                        {text: translateMinute(37) , value: 37},
                        {text: translateMinute(38) , value: 38},
                        {text: translateMinute(39) , value: 39},
                        {text: translateMinute(40) , value: 40},
                        {text: translateMinute(41) , value: 41},
                        {text: translateMinute(42) , value: 42},
                        {text: translateMinute(43) , value: 43},
                        {text: translateMinute(44) , value: 44},
                        {text: translateMinute(45) , value: 45},
                        {text: translateMinute(46) , value: 46},
                        {text: translateMinute(47) , value: 47},
                        {text: translateMinute(48) , value: 48},
                        {text: translateMinute(49) , value: 49},
                        {text: translateMinute(50) , value: 50},
                        {text: translateMinute(51) , value: 51},
                        {text: translateMinute(52) , value: 52},
                        {text: translateMinute(53) , value: 53},
                        {text: translateMinute(54) , value: 54},
                        {text: translateMinute(55) , value: 55},
                        {text: translateMinute(56) , value: 56},
                        {text: translateMinute(57) , value: 57},
                        {text: translateMinute(58) , value: 58},
                        {text: translateMinute(59) , value: 59},
                      ]"
                      :rules="[v => typeof v === 'number' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="addCrontabForm.crontabMinute"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_minute_tip_1')"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_hour')"
                      dense
                      :items="[
                        {text: translateHour(-1),  value: -1},
                        {text: translateHour(0) ,  value: 0},
                        {text: translateHour(1) ,  value: 1},
                        {text: translateHour(2) ,  value: 2},
                        {text: translateHour(3) ,  value: 3},
                        {text: translateHour(4) ,  value: 4},
                        {text: translateHour(5) ,  value: 5},
                        {text: translateHour(6) ,  value: 6},
                        {text: translateHour(7) ,  value: 7},
                        {text: translateHour(8) ,  value: 8},
                        {text: translateHour(9) ,  value: 9},
                        {text: translateHour(10) , value: 10},
                        {text: translateHour(11) , value: 11},
                        {text: translateHour(12) , value: 12},
                        {text: translateHour(13) , value: 13},
                        {text: translateHour(14) , value: 14},
                        {text: translateHour(15) , value: 15},
                        {text: translateHour(16) , value: 16},
                        {text: translateHour(17) , value: 17},
                        {text: translateHour(18) , value: 18},
                        {text: translateHour(19) , value: 19},
                        {text: translateHour(20) , value: 20},
                        {text: translateHour(21) , value: 21},
                        {text: translateHour(22) , value: 22},
                        {text: translateHour(23) , value: 23},
                      ]"
                      :rules="[v => typeof v === 'number' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="addCrontabForm.crontabHour"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_hour_tip_1')"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_day')"
                      dense
                      :items="[
                        {text: translateDay(-1),  value: -1},
                        {text: translateDay(1) ,  value: 1},
                        {text: translateDay(2) ,  value: 2},
                        {text: translateDay(3) ,  value: 3},
                        {text: translateDay(4) ,  value: 4},
                        {text: translateDay(5) ,  value: 5},
                        {text: translateDay(6) ,  value: 6},
                        {text: translateDay(7) ,  value: 7},
                        {text: translateDay(8) ,  value: 8},
                        {text: translateDay(9) ,  value: 9},
                        {text: translateDay(10) , value: 10},
                        {text: translateDay(11) , value: 11},
                        {text: translateDay(12) , value: 12},
                        {text: translateDay(13) , value: 13},
                        {text: translateDay(14) , value: 14},
                        {text: translateDay(15) , value: 15},
                        {text: translateDay(16) , value: 16},
                        {text: translateDay(17) , value: 17},
                        {text: translateDay(18) , value: 18},
                        {text: translateDay(19) , value: 19},
                        {text: translateDay(20) , value: 20},
                        {text: translateDay(21) , value: 21},
                        {text: translateDay(22) , value: 22},
                        {text: translateDay(23) , value: 23},
                        {text: translateDay(24) , value: 24},
                        {text: translateDay(25) , value: 25},
                        {text: translateDay(26) , value: 26},
                        {text: translateDay(27) , value: 27},
                        {text: translateDay(28) , value: 28},
                        {text: translateDay(29) , value: 29},
                        {text: translateDay(30) , value: 30},
                        {text: translateDay(31) , value: 31},
                      ]"
                      :rules="[v => typeof v === 'number' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="addCrontabForm.crontabDay"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_day_tip_1')"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_month')"
                      dense
                      :items="[
                        {text: translateMonth(-1),  value: -1},
                        {text: translateMonth(1) ,  value: 1},
                        {text: translateMonth(2) ,  value: 2},
                        {text: translateMonth(3) ,  value: 3},
                        {text: translateMonth(4) ,  value: 4},
                        {text: translateMonth(5) ,  value: 5},
                        {text: translateMonth(6) ,  value: 6},
                        {text: translateMonth(7) ,  value: 7},
                        {text: translateMonth(8) ,  value: 8},
                        {text: translateMonth(9) ,  value: 9},
                        {text: translateMonth(10) , value: 10},
                        {text: translateMonth(11) , value: 11},
                        {text: translateMonth(12) , value: 12},
                      ]"
                      :rules="[v => typeof v === 'number' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="addCrontabForm.crontabMonth"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_month_tip_1')"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_week')"
                      dense
                      :items="[
                        {text: translateWeek(-1), value: -1},
                        {text: translateWeek(0) , value: 0},
                        {text: translateWeek(1) , value: 1},
                        {text: translateWeek(2) , value: 2},
                        {text: translateWeek(3) , value: 3},
                        {text: translateWeek(4) , value: 4},
                        {text: translateWeek(5) , value: 5},
                        {text: translateWeek(6) , value: 6},
                      ]"
                      :rules="[v => typeof v === 'number' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="addCrontabForm.crontabWeek"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_week_tip_1')"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="copyToBranchCrontabDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_cron_copy_to_branches')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on" @click="copyToBranchCrontab()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
            </v-tooltip>
            <v-icon class="ml-4" @click="() => {
              this.copyToBranchCrontabDialog = false
              this.$refs.copyToBranchCrontabRef.reset()
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <v-form ref="copyToBranchCrontabRef">
              <v-autocomplete
                :items="branchNames"
                :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_branch_name')"
                dense
                v-model="copyBranchNames"
                multiple
                small-chips
                required
                :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
              />
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addTriggerDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">
                  <v-icon color="primary">mdi-progress-question</v-icon>
                </v-btn>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_pipeline_variables_desc')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {openCopyToBranchTrigger('add')}">mdi-arrow-left-bold-hexagon-outline</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_trigger_copy_to_branches')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="triggerAdd()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="primary" 
                  class="mr-4" 
                  v-bind="attrs" 
                  v-on="on" 
                  @click="() => {
                    $refs.triggerAddRef.reset()
                    addTriggerDialog = false
                  }"
                >mdi-close</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}</div>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_prompt')}}</small>
            </v-alert>
            <v-form ref="triggerAddRef">
              <v-container>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_before_execute')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        v-model="addTriggerForm.beforeExecute"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_before_execute_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_step_action')"
                        dense
                        :items="stepActionList"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addTriggerForm.stepActions"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_step_action_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" v-if="!addTriggerForm.beforeExecute">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_success'), value: 'SUCCESS' },
                          { text: $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_fail'), value: 'FAIL' },
                        ]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addTriggerForm.statusResults"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_enable')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addTriggerForm.enable"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_enable_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore')"
                        v-model="addTriggerForm.checkVarToIgnore"
                        dense
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_1'), 
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_2'), 
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_3'),
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_4'),
                        ]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_3')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_4')}}</div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_url')}}</small>
                      <v-text-field
                        dense
                        v-model="addTriggerForm.webhookUrl"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_url_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_insecure')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        v-model="addTriggerForm.insecure"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_insecure_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_method')}}</small>
                      <v-autocomplete
                        dense
                        :items="httpMethods"
                        v-model="addTriggerForm.webhookMethod"
                        clearable
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_method_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookHeadersAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addTriggerForm.webhookHeaders" :key="i" v-if="addTriggerForm.webhookHeaders">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookHeadersAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookQueryParamsAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addTriggerForm.webhookQueryParams" :key="i" v-if="addTriggerForm.webhookQueryParams">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookQueryParamsAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookFormsAddForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in addTriggerForm.webhookForms" :key="i" v-if="addTriggerForm.webhookForms">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookFormsAddForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_body')}}</small>
                      <v-textarea
                        v-model="addTriggerForm.webhookBody"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_body_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-textarea>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item" v-if="!addTriggerForm.beforeExecute">
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_committees')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addTriggerForm.mailCommittees"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_committees_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_receivers')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="addTriggerForm.mailReceivers"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_receivers_tip_1')"
                        persistent-hint
                        append-icon=""
                      >
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_title')}}</small>
                      <v-text-field
                        v-model="addTriggerForm.mailTitle"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_title_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_attachment_format')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: 'yaml', value: 'yaml' },
                          { text: 'json', value: 'json' },
                        ]"
                        v-model="addTriggerForm.mailAttachmentFormat"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_attachment_format_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_content')}}</small>
                      <v-textarea
                        v-model="addTriggerForm.mailContent"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_content_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-textarea>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item" v-if="!addTriggerForm.beforeExecute">
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_committees')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="addTriggerForm.noticeCommittees"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_committees_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_usernames')"
                        dense
                        :items="project.projectMembers"
                        v-model="addTriggerForm.noticeUsernames"
                        item-value="username"
                        item-text="username"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_usernames_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateTriggerDialog"
        max-width="960px"
        persistent
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_pipeline_trigger')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="yaml-btn" small v-bind="attrs" v-on="on" @click="() => {varsDialog = true}">
                  <v-icon color="primary">mdi-progress-question</v-icon>
                </v-btn>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_pipeline_variables_desc')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="() => {openCopyToBranchTrigger('update')}">mdi-arrow-left-bold-hexagon-outline</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_trigger_copy_to_branches')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" class="mr-4" v-bind="attrs" v-on="on" @click="triggerUpdate()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon 
                  color="primary" 
                  class="mr-4" 
                  v-bind="attrs" 
                  v-on="on" 
                  @click="() => {
                    $refs.triggerUpdateRef.reset()
                    updateTriggerDialog = false
                  }"
                >mdi-close</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}</div>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_prompt')}}</small>
            </v-alert>
            <v-form ref="triggerUpdateRef">
              <v-container>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_before_execute')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        disabled
                        v-model="updateTriggerForm.beforeExecute"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_before_execute_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_step_action')"
                        dense
                        :items="stepActionList"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateTriggerForm.stepActions"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_step_action_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" v-if="!updateTriggerForm.beforeExecute">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_success'), value: 'SUCCESS' },
                          { text: $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_fail'), value: 'FAIL' },
                        ]"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateTriggerForm.statusResults"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_status_results_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_enable')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateTriggerForm.enable"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_enable_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore')"
                        v-model="updateTriggerForm.checkVarToIgnore"
                        dense
                        :messages="[
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_1'), 
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_2'), 
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_3'),
                          $vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_4'),
                        ]"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                        <template v-slot:message>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_1')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_2')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_3')}}</div>
                          <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_check_var_to_ignore_tip_4')}}</div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item">
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_url')}}</small>
                      <v-text-field
                        dense
                        v-model="updateTriggerForm.webhookUrl"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_url_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_insecure')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        v-model="updateTriggerForm.insecure"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_insecure_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_method')}}</small>
                      <v-autocomplete
                        dense
                        :items="httpMethods"
                        v-model="updateTriggerForm.webhookMethod"
                        clearable
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_method_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookHeadersUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateTriggerForm.webhookHeaders" :key="i" v-if="updateTriggerForm.webhookHeaders">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_headers_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookHeadersUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookQueryParamsUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateTriggerForm.webhookQueryParams" :key="i" v-if="updateTriggerForm.webhookQueryParams">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_query_params_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookQueryParamsUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms')}}</small>
                      <v-icon color="success" class="ml-4" @click="addWebhookFormsUpdateForm()">mdi-table-plus</v-icon>
                      <v-tooltip right max-width="350px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <div class="env-item d-flex justify-space-between" v-for="(item, i) in updateTriggerForm.webhookForms" :key="i" v-if="updateTriggerForm.webhookForms">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_name')"
                            dense
                            v-model="item.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_forms_value')"
                            dense
                            v-model="item.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            background-color="yellow lighten-5"
                          >
                            <v-icon
                              slot="append"
                              color="blue"
                              @click="() => {varsDialog = true}"
                            >
                              mdi-help-circle
                            </v-icon>
                          </v-text-field>
                        </div>
                        <div>
                          <v-icon color="error" class="mt-4" @click="deleteWebhookFormsUpdateForm(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_body')}}</small>
                      <v-textarea
                        v-model="updateTriggerForm.webhookBody"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_webhook_body_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-textarea>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item" v-if="!updateTriggerForm.beforeExecute">
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_committees')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateTriggerForm.mailCommittees"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_committees_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_receivers')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="updateTriggerForm.mailReceivers"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_receivers_tip_1')"
                        persistent-hint
                        append-icon=""
                      >
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_title')}}</small>
                      <v-text-field
                        v-model="updateTriggerForm.mailTitle"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_title_tip_1')"
                        persistent-hint
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_attachment_format')}}</small>
                      <v-autocomplete
                        dense
                        :items="[
                          { text: 'yaml', value: 'yaml' },
                          { text: 'json', value: 'json' },
                        ]"
                        v-model="updateTriggerForm.mailAttachmentFormat"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_attachment_format_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_content')}}</small>
                      <v-textarea
                        v-model="updateTriggerForm.mailContent"
                        dense
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_mail_content_tip_1')"
                        persistent-hint
                        clearable
                        clear-icon="mdi-close-circle"
                        background-color="yellow lighten-5"
                      >
                        <v-icon
                          slot="append"
                          color="blue"
                          @click="() => {varsDialog = true}"
                        >
                          mdi-help-circle
                        </v-icon>
                      </v-textarea>
                    </v-col>
                  </v-row>
                </div>
                <div class="form-item-100 params-item" v-if="!updateTriggerForm.beforeExecute">
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_committees')"
                        dense
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :rules="[v => typeof v === 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        v-model="updateTriggerForm.noticeCommittees"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_committees_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :label="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_usernames')"
                        dense
                        :items="project.projectMembers"
                        v-model="updateTriggerForm.noticeUsernames"
                        item-value="username"
                        item-text="username"
                        multiple
                        small-chips
                        :hint="$vuetify.lang.t('$vuetify.lang_form_add_pipeline_trigger_notice_usernames_tip_1')"
                        persistent-hint
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="copyToBranchTriggerDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_trigger_copy_to_branches')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on" @click="copyToBranchTrigger()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
            </v-tooltip>
            <v-icon class="ml-4" @click="() => {
              this.copyToBranchTriggerDialog = false
              this.$refs.copyToBranchTriggerRef.reset()
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <v-form ref="copyToBranchTriggerRef">
              <v-autocomplete
                :items="branchNames"
                :label="$vuetify.lang.t('$vuetify.lang_form_new_pipeline_branch_name')"
                dense
                v-model="copyBranchNames"
                multiple
                small-chips
                required
                :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
              />
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteTriggerDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_trigger')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_trigger_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_trigger_tip_1', deleteTriggerForm.branchName, deleteTriggerForm.stepAction)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.deleteTriggerDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="triggerDelete()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteCrontabDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_crontab')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_crontab_prompt')}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_pipeline_crontab_tip_1', targetBranchName, targetCrontabStr)}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteCrontabDialog = false"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="cronDelete()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateQuotaConfigDialog"
        max-width="800px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_resource_quota')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_resource_quota_prompt', targetProjectName, quotaConfigForm.envName)}}</small>
            </v-alert>
            <v-form ref="quotaConfigRef">
              <div class="d-flex justify-space-between">
                <div class="form-item-45">
                  <div><strong>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota')}}</strong></div>
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_tip_1')}}</small>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request')"
                          dense
                          v-model="quotaConfigForm.namespaceQuota.memoryRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_request_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request')"
                          dense
                          v-model="quotaConfigForm.namespaceQuota.cpuRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_request_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit')"
                          dense
                          v-model="quotaConfigForm.namespaceQuota.memoryLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_memory_limit_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit')"
                          dense
                          v-model="quotaConfigForm.namespaceQuota.cpuLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_cpu_limit_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit')"
                          dense
                          type="number"
                          v-model.number="quotaConfigForm.namespaceQuota.podsLimit"
                          :rules="[intRule]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_pods_limit_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
                <div class="form-item-45">
                  <div><strong>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota')}}</strong></div>
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_tip_1')}}</small>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request')"
                          dense
                          v-model="quotaConfigForm.defaultQuota.memoryRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_request_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request')"
                          dense
                          v-model="quotaConfigForm.defaultQuota.cpuRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_request_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit')"
                          dense
                          v-model="quotaConfigForm.defaultQuota.memoryLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_memory_limit_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit')"
                          dense
                          v-model="quotaConfigForm.defaultQuota.cpuLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_cpu_limit_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_namespace_quota_extra_quotas_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addExtraQuotas()">mdi-table-plus</v-icon>
                <div class="d-flex justify-space-between mt-4" v-for="(row, i) in quotaConfigForm.namespaceQuota.extraQuotas" :key="i">
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                      dense
                      v-model="row.name"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                      dense
                      v-model="row.value"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyExtraQuotas(i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteExtraQuotas(i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addExtraRequest('quotaConfig')">mdi-table-plus</v-icon>
                <div class="d-flex justify-space-between mt-4" v-for="(row, i) in quotaConfigForm.defaultQuota.extraRequest" :key="i">
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                      dense
                      v-model="row.name"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                      dense
                      v-model="row.value"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyExtraRequest('quotaConfig', i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteExtraRequest('quotaConfig', i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
              <div class="params-item mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                <v-tooltip right max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                  </template>
                  <div style="font-size: 12px;">
                    <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                  </div>
                </v-tooltip>
                <v-icon color="success" class="ml-4" @click="addExtraLimit('quotaConfig')">mdi-table-plus</v-icon>
                <div class="d-flex justify-space-between mt-4" v-for="(row, i) in quotaConfigForm.defaultQuota.extraLimit" :key="i">
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                      dense
                      v-model="row.name"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                      persistent-hint
                    />
                  </div>
                  <div class="form-item-45 mt-4">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                      dense
                      v-model="row.value"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                      persistent-hint
                    />
                  </div>
                  <div>
                    <v-icon color="success" class="mr-4" @click="copyExtraLimit('quotaConfig', i)">mdi-content-copy</v-icon>
                    <v-icon color="error" @click="deleteExtraLimit('quotaConfig', i)">mdi-trash-can-outline</v-icon>
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.$refs.quotaConfigRef.resetValidation()
                this.updateQuotaConfigDialog = false
                this.getEnvQuotaConfig()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="quotaConfig()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addPVDialog"
        max-width="600"
        @input="() => {this.$refs.allotPVRef.reset()}"
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            {{$vuetify.lang.t('$vuetify.lang_form_assign_pv')}}
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_assign_pv_prompt', targetProjectName, targetEnvName)}}</small>
            </v-alert>
            <v-form ref="allotPVRef">
              <v-autocomplete
                v-model="pvNames"
                :items="pvList"
                multiple
                dense
                small-chips
                :label="$vuetify.lang.t('$vuetify.lang_form_assign_pv_pv_names')"
                :rules="[v => v.length>0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                :hint="$vuetify.lang.t('$vuetify.lang_form_assign_pv_pv_names_tip_1')"
                persistent-hint
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.addPVDialog = false
                this.$refs.allotPVRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="allotPV()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addSCDialog"
        max-width="600"
        @input="() => {this.$refs.allotSCRef.reset()}"
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            {{$vuetify.lang.t('$vuetify.lang_form_assign_storage_class_pv')}}
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_assign_storage_class_pv_prompt', targetProjectName, targetEnvName)}}</small>
            </v-alert>
            <v-form ref="allotSCRef">
              <v-autocomplete
                v-model="addSCForm.scNames"
                :items="scNames"
                multiple
                dense
                small-chips
                :label="$vuetify.lang.t('$vuetify.lang_form_assign_storage_class_pv_pv_names')"
                :rules="[v => v.length>0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                :hint="$vuetify.lang.t('$vuetify.lang_form_assign_storage_class_pv_pv_names_tip_1')"
                persistent-hint
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.addSCDialog = false
                this.$refs.allotSCRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="allotSC()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deletePVDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_remove_pv')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_remove_pv_prompt', targetProjectName, deletePVForm.envName, deletePVForm.pvcName)}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_remove_pv_tip_1', targetProjectName, deletePVForm.envName, deletePVForm.pvcName)}}
            </div>
            <v-form ref="deletePVRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_pv_pv_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_pv_pv_name_tip_1', deletePVForm.pvcName)"
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
                this.deletePVDialog = false
                this.$refs.deletePVRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deletePV()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addNetworkPolicyDialog"
        max-width="600"
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            {{$vuetify.lang.t('$vuetify.lang_form_new_network_policy')}}
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_network_policy_prompt', targetProjectName, targetEnvName)}}</small>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.addNetworkPolicyDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="addNetworkPolicy()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteNetworkPolicyDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_network_policy')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_network_policy_prompt', targetProjectName, deleteNetworkPolicyForm.envName, deleteNetworkPolicyForm.name)}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_network_policy_tip_1', targetProjectName, deleteNetworkPolicyForm.envName, deleteNetworkPolicyForm.name)}}
            </div>
            <v-form ref="deleteNetworkPolicyRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_network_policy_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_network_policy_name_tip_1', deleteNetworkPolicyForm.name)"
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
                this.deleteNetworkPolicyDialog = false
                this.$refs.deleteNetworkPolicyRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteNetworkPolicy()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addHostDialog"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_host')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_prompt', addHostForm.envName)}}</small>
            </v-alert>
            <v-form ref="addHostRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_name')"
                      dense
                      v-model="addHostForm.hostName"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_name_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mb-2">
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_groups')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="addHostForm.groups"
                      append-icon=""
                    >
                    </v-combobox>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_1')}}</small></div>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_2')}}</small></div>
                  </v-col>
                </v-row>
                <small class="my-3">{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes')}}</small>
                <v-icon color="success" class="input-btn" @click="addInputBox()">mdi-plus-box</v-icon>
                <div class="host-variables">
                  <div class="d-flex align-center" v-for="(item, index) in variableList">
                    <v-row class="mr-1">
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_name')"
                          dense
                          v-model="item[0]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_value')"
                          dense
                          v-model="item[1]"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-icon color="error" class="input-btn" @click="deleteInputBox(index)">mdi-trash-can</v-icon>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_1')}}</small>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_2')}}</small>
                  </div>
                </div>
                <v-row class="mt-2">
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_addr')"
                      dense
                      v-model="addHostForm.hostAddr"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_addr_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_port')"
                      dense
                      type="number"
                      v-model.number="addHostForm.hostPort"
                      :rules="[intRule]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_user')"
                      dense
                      v-model="addHostForm.hostUser"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_password')"
                      dense
                      type="password"
                      v-model="addHostForm.hostPassword"
                      :type="hostPasswordDisplay ? 'text' : 'password'"
                      :append-icon="hostPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hostPasswordDisplay = !hostPasswordDisplay"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become')"
                      :items="[ { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true }, { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false } ]"
                      dense
                      v-model="addHostForm.hostBecome"
                      :rules="[v => typeof(v)== 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_user')"
                      dense
                      v-model="addHostForm.hostBecomeUser"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_user_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_password')"
                      dense
                      type="password"
                      v-model="addHostForm.hostBecomePassword"
                      :type="hostBecomePasswordDisplay ? 'text' : 'password'"
                      :append-icon="hostBecomePasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hostBecomePasswordDisplay = !hostBecomePasswordDisplay"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_password_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
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
                this.addHostDialog = false
                this.$refs.addHostRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="allotHost()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateHostDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_host')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_host_prompt', updateHostForm.hostName)}}</small>
            </v-alert>
            <v-form ref="updateHostRef">
              <v-container>
                <v-row class="mb-2">
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_groups')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="updateHostForm.groups"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_1')}}</small></div>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_2')}}</small></div>
                  </v-col>
                </v-row>
                <small class="my-3">{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes')}}</small>
                <v-icon color="success" class="input-btn" @click="addInputBox()">mdi-plus-box</v-icon>
                <div class="host-variables">
                  <div class="d-flex align-center" v-for="(item, index) in variableList">
                    <v-row class="mr-1">
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_name')"
                          dense
                          v-model="item[0]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_value')"
                          dense
                          v-model="item[1]"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-icon color="error" class="input-btn" @click="deleteInputBox(index)">mdi-trash-can</v-icon>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_1')}}</small>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_2')}}</small>
                  </div>
                </div>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_addr')"
                      dense
                      v-model="updateHostForm.hostAddr"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_addr_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-2">
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_port')"
                      dense
                      type="number"
                      v-model.number="updateHostForm.hostPort"
                      :rules="[intRule]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_user')"
                      dense
                      v-model="updateHostForm.hostUser"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_password')"
                      dense
                      type="password"
                      v-model="updateHostForm.hostPassword"
                      :type="hostPasswordDisplay2 ? 'text' : 'password'"
                      :append-icon="hostPasswordDisplay2 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hostPasswordDisplay2 = !hostPasswordDisplay2"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become')"
                      :items="[ { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true }, { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false } ]"
                      dense
                      v-model="updateHostForm.hostBecome"
                      :rules="[v => typeof(v)== 'boolean' || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      persistent-hint
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_user')"
                      dense
                      v-model="updateHostForm.hostBecomeUser"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_user_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_password')"
                      dense
                      type="password"
                      v-model="updateHostForm.hostBecomePassword"
                      :type="hostBecomePasswordDisplay2 ? 'text' : 'password'"
                      :append-icon="hostBecomePasswordDisplay2 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="hostBecomePasswordDisplay2 = !hostBecomePasswordDisplay2"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_host_host_become_password_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
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
                this.updateHostDialog = false
                this.$refs.updateHostRef.resetValidation()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateHost()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="joinHostDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project_prompt', joinHostForm.hostName)}}</small>
            </v-alert>
            <v-form ref="hostJoinRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="projectEnvList"
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project_project_name')"
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="joinHostForm.projectName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project_project_name_tip_1')"
                      persistent-hint
                      @change="projectChange(joinHostForm.projectName)"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="projectEnvListChildren"
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project_env_name')"
                      dense
                      :disabled="joinHostForm.projectName ? false: true"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="joinHostForm.envName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_host_to_other_project_env_name_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mb-2">
                  <v-col cols="12">
                    <v-combobox
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_host_groups')"
                      dense
                      multiple
                      small-chips
                      hide-selected
                      v-model="joinHostForm.groups"
                      persistent-hint
                      append-icon=""
                    >
                    </v-combobox>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_1')}}</small></div>
                    <div><small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_groups_tip_2')}}</small></div>
                  </v-col>
                </v-row>
                <small class="my-3">{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes')}}</small>
                <v-icon color="success" class="input-btn" @click="addInputBox()">mdi-plus-box</v-icon>
                <div class="host-variables">
                  <div class="d-flex align-center" v-for="(item, index) in variableList">
                    <v-row class="mr-1">
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_name')"
                          dense
                          v-model="item[0]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_value')"
                          dense
                          v-model="item[1]"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-icon color="error" class="input-btn" @click="deleteInputBox(index)">mdi-trash-can</v-icon>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_1')}}</small>
                  </div>
                  <div class="mb-2">
                    <small>{{$vuetify.lang.t('$vuetify.lang_form_new_host_varialbes_tip_2')}}</small>
                  </div>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.joinHostDialog = false
                this.$refs.hostJoinRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="hostJoin()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="leaveHostDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_remove_host_from_env')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_remove_host_from_env_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_remove_host_from_env_tip_1', targetProjectName, leaveHostForm.envName, leaveHostForm.hostName)}}
            </div>
            <v-form ref="hostLeaveRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_remove_host_from_env_host_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_remove_host_from_env_host_name_tip_1', leaveHostForm.hostName)"
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
                this.leaveHostDialog = false
                this.$refs.hostLeaveRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="hostLeave()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteHostDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_host')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="deleteHostRef">
              <v-alert icon="mdi-alert-circle" prominent text type="error">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_host_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
              </v-alert>
              <div>
                {{$vuetify.lang.t('$vuetify.lang_form_delete_host_tip_1', deleteHostForm.hostName)}}
              </div>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_host_host_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_host_host_name_tip_1', deleteHostForm.hostName)"
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
                this.deleteHostDialog = false
                this.$refs.deleteHostRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="envHostDelete()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addDbDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_database')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_new_database_prompt', targetProjectName, addDbForm.envName)}}</small>
            </v-alert>
            <v-form ref="addDbRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_name')"
                      dense
                      v-model="addDbForm.dbName"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_database_db_name_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_url')"
                      dense
                      v-model="addDbForm.dbUrl"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_database_db_url_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_user')"
                      dense
                      v-model="addDbForm.dbUser"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_password')"
                      dense
                      :type="dbPasswordDisplay ? 'text' : 'password'"
                      :append-icon="dbPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="dbPasswordDisplay = !dbPasswordDisplay"
                      v-model="addDbForm.dbPassword"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    >
                    </v-text-field>
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
                this.addDbDialog = false
                this.$refs.addDbRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="dbAdd()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateDbDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_database')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_update_database_prompt', updateDbForm.dbName)}}</small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_update_database_tip_1', updateDbForm.dbName)}}
            </div>
            <v-form ref="updateDbRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_url')"
                      dense
                      v-model="updateDbForm.dbUrl"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_new_database_db_url_tip_1')"
                      persistent-hint
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_user')"
                      dense
                      v-model="updateDbForm.dbUser"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_new_database_db_password')"
                      dense
                      :type="updateDbPasswordDisplay ? 'text' : 'password'"
                      :append-icon="updateDbPasswordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="updateDbPasswordDisplay = !updateDbPasswordDisplay"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="updateDbForm.dbPassword"
                    >
                    </v-text-field>
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
                this.$refs.updateDbRef.resetValidation()
                this.updateDbDialog = false
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateDb()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="joinDbDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="info">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project_prompt', joinDbForm.dbName)}}</small>
            </v-alert>
            <v-form ref="joinDbRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="projectEnvList"
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project_project_name')"
                      dense
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="joinDbForm.projectName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project_project_name_tip_1')"
                      persistent-hint
                      @change="projectChange(joinDbForm.projectName)"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="projectEnvListChildren"
                      :label="$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project_env_name')"
                      dense
                      :disabled="joinDbForm.projectName ? false: true"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      v-model="joinDbForm.envName"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_add_database_to_other_project_env_name_tip_1')"
                      persistent-hint
                    ></v-autocomplete>
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
                this.joinDbDialog = false
                this.$refs.joinDbRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="dbJoin()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="leaveDbDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_remove_database_from_env')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_remove_database_from_env_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_remove_database_from_env_tip_1', targetProjectName, leaveDbForm.envName, leaveDbForm.dbName)}}
            </div>
            <v-form ref="leaveDbRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_remove_database_from_env_db_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_remove_database_from_env_db_name_tip_1', leaveDbForm.dbName)"
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
                this.leaveDbDialog = false
                this.$refs.leaveDbRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="dbLeave()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteDbDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_database')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_database_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_database_tip_1', deleteDbForm.dbName)}}
            </div>
            <v-form ref="deleteDbRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_database_db_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_database_db_name_tip_1', deleteDbForm.dbName)"
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
                this.deleteDbDialog = false
                this.$refs.deleteDbRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteDb()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="auditDialog"
        max-width="960px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ $vuetify.lang.t('$vuetify.lang_menu_view_logs') }}</span>
          </v-card-title>
          <v-card-text id='log-container' style="overflow-x: scroll; background: #151515; color: #e0e0e0; position: relative; height: 480px;">
            <pre
              v-for="(logMsg, i) in logList"
              :key="i"
              :id="'log' + i"
              :style="logMsg.logType | changeColor"
            >[{{ logMsg.logType }}] {{ logMsg.endTime }}  {{ logMsg.content }}</pre>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.auditDialog = false
                this.refreshList()
              }"
              :disabled="disableBtn"
              :loading="disableBtn"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addComponentDebugDialog"
        max-width="1100px"
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">
              {{ actionType === 'add' ? $vuetify.lang.t('$vuetify.lang_form_new_debug_component') : $vuetify.lang.t('$vuetify.lang_form_update_debug_component') }}
            </span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-4 yaml-btn" small v-bind="attrs" v-on="on">
                  <v-icon color="primary" @click="previewDebugYaml()">mdi-cube-scan</v-icon>
                </v-btn>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on" @click="addDebug()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
            </v-tooltip>
            <v-icon class="ml-4" @click="() => {
              this.addComponentDebugDialog = false
              this.$refs.addDebugRef.resetValidation()
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <v-form ref="addDebugRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_prompt', targetProjectName)}}</small>
              </v-alert>
              <v-container>
                <div class="form-item-100">
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-autocomplete
                        :items="['amd64', 'arm64v8']"
                        :label="$vuetify.lang.t('$vuetify.lang_form_component_arch')"
                        dense
                        v-model="addComponentDebugForm.arch"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>  
                  </div>
                </div>
                <div class="form-item-100">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_debug_quota')}}</div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_memory_request')"
                        dense
                        v-model="addComponentDebugForm.debugQuota.memoryRequest"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_memory_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_memory_limit')"
                        dense
                        v-model="addComponentDebugForm.debugQuota.memoryLimit"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_memory_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_cpu_request')"
                        dense
                        v-model="addComponentDebugForm.debugQuota.cpuRequest"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_cpu_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-20 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_cpu_limit')"
                        dense
                        v-model="addComponentDebugForm.debugQuota.cpuLimit"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_cpu_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addExtraRequest('debugComponent')">mdi-table-plus</v-icon>
                  <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentDebugForm.debugQuota.extraRequest" :key="i">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                        dense
                        v-model="row.name"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                        dense
                        v-model="row.value"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyExtraRequest('debugComponent', i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteExtraRequest('debugComponent', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="params-item mt-4">
                  <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                  <v-tooltip right max-width="300px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                    </template>
                    <div style="font-size: 12px;">
                      <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                    </div>
                  </v-tooltip>
                  <v-icon color="success" class="ml-4" @click="addExtraLimit('debugComponent')">mdi-table-plus</v-icon>
                  <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentDebugForm.debugQuota.extraLimit" :key="i">
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                        dense
                        v-model="row.name"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-45 mt-4">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                        dense
                        v-model="row.value"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyExtraLimit('debugComponent', i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteExtraLimit('debugComponent', i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_debug_component_ingress')}}</div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name')"
                        dense
                        v-model="addComponentDebugForm.ingress.domainName"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name_tip_1')"
                        persistent-hint
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix')"
                        dense
                        v-model="addComponentDebugForm.ingress.pathPrefix"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix_tip_1')"
                        persistent-hint
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <div class="form-item-100">
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-autocomplete
                        :items="[
                          { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                          { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                        ]"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed')"
                        dense
                        v-model="addComponentDebugForm.ingress.certSelfSigned"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div class="form-item-45 d-flex align-center">
                      <v-autocomplete
                        :items="sourceBranchNames"
                        :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_ingress_cert_branch')"
                        dense
                        v-model="addComponentDebugForm.ingress.certBranch"
                      ></v-autocomplete>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mt-4">
                    <div class="form-item-45 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path')"
                        dense
                        v-model="addComponentDebugForm.ingress.certPath"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3')}}</div>
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="componentDebugYamlDialog"
        max-width="800px"
        eager
        persistent
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{defaultDialogTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="addComponentRef">
              <Monaco
              ref="monaco2"
              :monacoOptions="singleMonacoOptions"
              :height="500"
            ></Monaco>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="() => {
                this.componentDebugYamlDialog = false
                this.$refs.monaco2.monacoEditor.setValue('')
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteComponentDebugDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_debug_component')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_debug_component_prompt')}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_debug_component_tip_1', targetProjectName, deleteComponentDebugForm.envName)}}
            </div>
            <v-form ref="deleteDebugRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_debug_component_env_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_debug_component_env_name_tip_1', deleteComponentDebugForm.envName)"
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
                this.deleteComponentDebugDialog = false
                this.$refs.deleteDebugRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteDebug()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="addComponentDialog"
        max-width="1100px"
        persistent
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_new_component')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-4 yaml-btn" small v-bind="attrs" v-on="on">
                  <v-icon color="primary" @click="previewComponent()">mdi-cube-scan</v-icon>
                </v-btn>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on" @click="addComponent()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
            </v-tooltip>
            <v-icon class="ml-4" @click="() => {
              this.addComponentDialog = false
              this.$refs.addComponentRef.resetValidation()
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <v-form ref="addComponentRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_component_prompt')}}</small>
              </v-alert>
              <div class="form-item-100 d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-autocomplete
                    :label="$vuetify.lang.t('$vuetify.lang_form_new_component_template_name')"
                    required
                    :items="componentList"
                    dense
                    v-model="addComponentForm"
                  ></v-autocomplete>
                </div>
              </div>
              <div class="form-item-100 d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_component_component_desc')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="addComponentForm.componentTemplateDesc"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_component_component_desc_tip_1', targetProjectShortName)"
                    persistent-hint
                  ></v-text-field>
                </div>
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name')"
                    dense
                    v-model="addComponentForm.deploySpecStatic.deployName"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name_tip_1', targetProjectShortName)"
                    persistent-hint
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
              </div>
              <div class="form-item-100 d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image')"
                    dense
                    v-model="addComponentForm.deploySpecStatic.deployImage"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_tip_1')"
                    persistent-hint
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
                <div class="form-item-45">
                  <v-autocomplete
                    :items="archNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_component_arch')"
                    dense
                    v-model="addComponentForm.arch"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
              </div>
              <div class="form-row d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-autocomplete
                    :items="['deployment', 'statefulset']"
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type')"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type_tip_1')"
                    persistent-hint
                    v-model="addComponentForm.deploySpecStatic.deployType"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  >
                  </v-autocomplete>
                </div>
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_replicas')"
                    dense
                    type="number"
                    v-model.number="addComponentForm.deploySpecStatic.deployReplicas"
                    :rules="[intRule]"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="form-row mt-4">
                <div class="form-item-30">
                  <v-spacer></v-spacer>
                  <v-autocomplete
                    :items="componentOpts"
                    dense
                    :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                    @change="chooseParams($event)"
                  ></v-autocomplete>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployResources.cpuLimit !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.cpuRequest !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.memoryLimit !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.memoryRequest !== '' ||
                  addComponentForm.deploySpecStatic.deployResources.extraRequest !== null ||
                  addComponentForm.deploySpecStatic.deployResources.extraLimit !== null
                  " :id="'deployResources-add'"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployResources')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-if="addComponentForm.deploySpecStatic.deployResources">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.memoryRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.memoryLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.cpuRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.cpuLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="params-item mt-4">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addExtraRequest('component')">mdi-table-plus</v-icon>
                      <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployResources.extraRequest" :key="i">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div>
                          <v-icon color="success" class="mr-4" @click="copyExtraRequest('component', i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteExtraRequest('component', i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                    <div class="params-item mt-4">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addExtraLimit('component')">mdi-table-plus</v-icon>
                      <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployResources.extraLimit" :key="i">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div>
                          <v-icon color="success" class="mr-4" @click="copyExtraLimit('component', i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteExtraLimit('component', i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployCommand !== '' || 
                  addComponentForm.deploySpecStatic.deployEnvs !== null || 
                  addComponentForm.deploySpecStatic.deployArgs !== null || 
                  addComponentForm.deploySpecStatic.workingDir !== '' || 
                  addComponentForm.deploySpecStatic.nodeSelector !== null || 
                  addComponentForm.deploySpecStatic.nodeName !== '' || 
                  addComponentForm.deploySpecStatic.terminationGracePeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.subdomain !== '' || 
                  addComponentForm.deploySpecStatic.enableDownwardApi || 
                  addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds !== 0 ||
                  addComponentForm.deploySpecStatic.deployHeadless !== false ||
                  addComponentForm.deploySpecStatic.podManagementPolicy !== ''
                  " :id="'deployOther-add'"
                >
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other')}} <v-icon color="error" class="ml-4" @click="clearParams('deployOther')">mdi-minus-circle-outline</v-icon></div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployCommand"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-combobox
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args')"
                          dense
                          multiple
                          small-chips
                          hide-selected
                          v-model="addComponentForm.deploySpecStatic.deployArgs"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args_tip_1')"
                          persistent-hint
                          append-icon=""
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs')}}</small>
                        <v-icon color="success" class="ml-4" @click="addDeployEnvs()">mdi-table-plus</v-icon>
                        <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployEnvs" :key="i" v-if="addComponentForm.deploySpecStatic.deployEnvs">
                          <div class="form-item-45 mt-4">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_name')"
                              dense
                              v-model="row[0]"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item-45 mt-4">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_value')"
                              dense
                              v-model="row[1]"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <v-icon color="error" class="mt-4" @click="deleteDeployEnvs(i)">mdi-trash-can-outline</v-icon>
                        </div>
                        <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_tip_1')}}</small></div>
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.workingDir"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item" v-if="!nodeSelectorDisable || !nodeNameDisable">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45" v-if="!nodeSelectorDisable">
                        <v-autocomplete
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector')"
                          dense
                          multiple
                          chips
                          :items="nodeLabels"
                          item-text="text"
                          item-value="text"
                          return-object
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector_tip_1')"
                          persistent-hint
                          v-model="addComponentForm.deploySpecStatic.nodeSelector"
                        ></v-autocomplete>
                      </div>
                      <div class="form-item-45 d-flex align-center" v-if="!nodeNameDisable">
                        <v-autocomplete
                          :items="nodeNames"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name')"
                          dense
                          clearable
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name_tip_1')"
                          persistent-hint
                          v-model="addComponentForm.deploySpecStatic.nodeName"
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds')"
                          dense
                          type="number"
                          v-model.number="addComponentForm.deploySpecStatic.terminationGracePeriodSeconds"
                          :rules="[intRuleZero]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds')"
                          dense
                          type="number"
                          v-model.number="addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds"
                          :rules="[intRuleZero]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45 d-flex align-center" v-if="!subdomainDisable">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.subdomain"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2'), 
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2')}}</div>
                          </template>
                        </v-text-field>
                      </div>
                      <div class="form-item-45 d-flex align-center" v-if="!enableDownwardApiDisable">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                            { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.enableDownwardApi"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3'), 
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3')}}</div>
                          </template>
                        </v-autocomplete>
                      </div>                    
                    </div>
                  </div>
                  <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployType === 'statefulset'">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50 d-flex align-center">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                            { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployHeadless"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-autocomplete
                          :items="['OrderedReady', 'Parallel']"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.podManagementPolicy"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3'),
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3')}}</div>
                          </template>
                        </v-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployMeta.labels !== null || addComponentForm.deploySpecStatic.deployMeta.annotations !== null" :id="'deployMeta-add'">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta')}} <v-icon color="error" class="ml-4" @click="clearParams('deployMeta')">mdi-minus-circle-outline</v-icon></div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployMetaLabels()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.labels" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.labels">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployMetaLabels(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_tip_1')}}</small></div>
                    </div>
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployMetaAnnotations()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.annotations" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.annotations">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployMetaAnnotations(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_tip_1')}}</small></div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployNodePorts !== null || 
                  addComponentForm.deploySpecStatic.deployLocalPorts !== null
                  " :id="'deployPorts-add'"
                >
                  <div class="form-item-45 mt-4 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports'), value: 'deployLocalPorts' },
                        { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports'), value: 'deployNodePorts' },
                      ]"
                      dense
                      :value="addComponentForm.deploySpecStatic.deployLocalPorts === null ? 'deployNodePorts' : 'deployLocalPorts'"
                      :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                      @change="changePortSet($event)"
                    ></v-autocomplete>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployPorts')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-100" v-if="addComponentForm.deploySpecStatic.deployLocalPorts !== null" :id="'deployLocalPorts-add'">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="mx-4" @click="addDeployLocalPort()">mdi-table-plus</v-icon>
                    </div>
                    <div class="params-content params-item justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployLocalPorts">
                      <div class="form-item-100 d-flex">
                        <div class="form-item-40 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_port')"
                            dense
                            type="number"
                            v-model.number="row.port"
                            :rules="[intRule]"
                          />
                        </div>
                        <div class="form-item-40 mt-4 d-flex">
                          <v-autocomplete
                            :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_protocol')"
                            dense
                            v-model="row.protocol"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="mt-4 d-flex">
                          <v-icon color="success" class="mr-4" @click="copyDeployLocalPort(i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteDeployLocalPort(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name')"
                            dense
                            v-model="row.ingress.domainName"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name_tip_1')"
                            persistent-hint
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix')"
                            dense
                            v-model="row.ingress.pathPrefix"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix_tip_1')"
                            persistent-hint
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-autocomplete
                            :items="[
                              { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                              { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed')"
                            dense
                            v-model="row.ingress.certSelfSigned"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4 d-flex">
                          <v-autocomplete
                            :items="sourceBranchNames"
                            :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_ingress_cert_branch')"
                            dense
                            v-model="row.ingress.certBranch"
                          ></v-autocomplete>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path')"
                            dense
                            v-model="row.ingress.certPath"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100" v-if="addComponentForm.deploySpecStatic.deployNodePorts !== null" :id="'deployNodePorts-add'">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="mx-4" @click="addDeployNodePort()">mdi-table-plus</v-icon>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployNodePorts">
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_port')"
                          dense
                          type="number"
                          v-model.number="row.port"
                          :rules="[intRule]"
                        />
                      </div>
                      <div class="form-item-30">
                        <v-autocomplete
                          :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_protocol')"
                          dense
                          v-model="row.protocol"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-30 d-flex">
                        <v-autocomplete
                          :items="nodePorts"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port')"
                          dense
                          v-model="row.nodePort"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          persistent-hint
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployNodePort(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployNodePort(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployVolumes !== null" :id="'deployVolumes-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDeployVolumes()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployVolumes')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployVolumes">
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pod')"
                        dense
                        v-model="row.pathInPod"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pv')"
                        dense
                        v-model="row.pathInPv"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-30 d-flex">
                      <v-autocomplete
                        :items="pvcNames || []"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc')"
                        dense
                        clearable
                        v-model="row.pvc"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyDeployVolumes(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteDeployVolumes(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders !== null
                  " :id="'deployHealthCheck-add'"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('deployHealthCheck')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-autocomplete
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port'), value: 'checkPort'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_select_method')"
                          @change="healthCheckChange($event)"
                          :value="healthCheckInit()"
                        ></v-autocomplete>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort"
                          :rules="[intRule]"
                          type="number"
                        />
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployHealthCheck.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-autocomplete
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_2')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addHealthCheckHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyHealthCheckHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteHealthCheckHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders !== null ||
                  addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders !== null
                  " :id="'lifecycle-add'"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('lifecycle')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-100 params-item">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="params-content d-flex justify-space-between">
                      <div class="form-item-100">
                        <div class="form-item-50 d-flex">
                          <v-autocomplete
                            :items="[
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_select_method')"
                            @change="lifecyclePostStartChange($event)"
                            :value="lifecyclePostStartInit()"
                          ></v-autocomplete>
                        </div>
                        <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== ''">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.exec"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                            persistent-hint
                          >
                          </v-text-field>
                        </div>
                        <div v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                dense
                                v-model.number="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port"
                                :rules="[intRule]"
                                type="number"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-autocomplete
                                :items="['HTTP', 'HTTPS']"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme"
                              />
                            </div>
                          </div>
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="ml-4" @click="addLifecyclePostStartHttpHeaders()">mdi-table-plus</v-icon>
                          <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders" :key="i">
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                  dense
                                  v-model="row.name"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                  dense
                                  v-model="row.value"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <v-icon color="success" class="mr-4" @click="copyLifecyclePostStartHttpHeaders(i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteLifecyclePostStartHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="params-content d-flex justify-space-between">
                      <div class="form-item-100">
                        <div class="form-item-50 d-flex">
                          <v-autocomplete
                            :items="[
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_select_method')"
                            @change="lifecyclePreStopChange($event)"
                            :value="lifecyclePreStopInit()"
                          ></v-autocomplete>
                        </div>
                        <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== ''">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.exec"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                            persistent-hint
                          >
                          </v-text-field>
                        </div>
                        <div v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                dense
                                v-model.number="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port"
                                :rules="[intRule]"
                                type="number"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-autocomplete
                                :items="['HTTP', 'HTTPS']"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme"
                              />
                            </div>
                          </div>
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="ml-4" @click="addLifecyclePreStopHttpHeaders()">mdi-table-plus</v-icon>
                          <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders" :key="i">
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                  dense
                                  v-model="row.name"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                  dense
                                  v-model="row.value"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <v-icon color="success" class="mr-4" @click="copyLifecyclePreStopHttpHeaders(i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteLifecyclePreStopHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  !hpaConfigDisable &&
                  (addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.maxReplicas !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue !== '' || 
                  addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue !== '')
                  " :id="'hpaConfig-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config')}}
                    <v-tooltip right max-width="400px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_3')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('hpaConfig')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-if="addComponentForm.deploySpecStatic.hpaConfig">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-100">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_max_replicas')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.maxReplicas"
                          :rules="[intRule]"
                          type="number"
                        />
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent"
                          :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                          type="number"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent"
                          :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                          type="number"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.dependServices !== null" :id="'dependServices-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDependServices()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('dependServices')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content" v-for="(row, i) in addComponentForm.deploySpecStatic.dependServices">
                    <div class="d-flex justify-space-between mt-4">
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name')"
                          dense
                          v-model="row.dependName"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_port')"
                          dense
                          v-model.number="row.dependPort"
                          type="number"
                        />
                      </div>
                      <div class="form-item-30">
                        <v-autocomplete
                          :items="[ 'TCP', 'UDP' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_type')"
                          dense
                          v-model="row.dependType"
                          clearable
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-space-between mt-4">
                      <div class="form-item-100">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url')"
                          dense
                          v-model="row.httpGetUrl"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <v-icon color="success" class="mr-4" @click="copyDependServices(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteDependServices(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!hostAliasesDisable && addComponentForm.deploySpecStatic.hostAliases !== null" :id="'hostAliases-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addHostAliases()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('hostAliases')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4 align-center" v-for="(row, i) in addComponentForm.deploySpecStatic.hostAliases">
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_ip')"
                        dense
                        v-model="row.ip"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="row.hostnames"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames_tip_1')"
                        persistent-hint
                        append-icon=""
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyHostAliases(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteHostAliases(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!securityContextDisable && (addComponentForm.deploySpecStatic.securityContext.runAsUser !== 0 || addComponentForm.deploySpecStatic.securityContext.runAsGroup !== 0)" :id="'securityContext-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('securityContext')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.securityContext">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_user')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsUser"
                        :rules="[intRuleZero]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_group')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsGroup"
                        :rules="[intRuleZero]"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployConfigSettings !== null || addComponentForm.deploySpecStatic.deployConfigBranch !== ''" :id="'deployConfigSettings-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_2')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDeployConfigSettings()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployConfigSettings')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-50">
                    <v-autocomplete
                      :items="sourceBranchNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_deploy_config_branch')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployConfigBranch"
                    ></v-autocomplete>
                  </div>
                  <div class="params-content" v-for="(row, i) in addComponentForm.deploySpecStatic.deployConfigSettings">
                    <div class="d-flex justify-space-between align-center mt-4" >
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path')"
                          dense
                          v-model="row.localPath"
                          :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path')"
                          dense
                          v-model="row.podPath"
                          :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-space-between align-center mt-4" >
                      <div class="form-item-45">
                        <v-autocomplete
                          :items="pvcNames || []"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name')"
                          dense
                          clearable
                          v-model="row.pvcName"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployConfigSettings(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployConfigSettings(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!patchesDisable && addComponentForm.deploySpecStatic.patches !== null" :id="'patches-add'">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_2')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addPatches()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('patches')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-for="(patch, i) in addComponentForm.deploySpecStatic.patches">
                    <div class="params-content d-flex justify-space-between align-center mt-4">
                      <div class="form-item-40 d-flex align-center">
                        <v-autocomplete
                          :items="[ 'deployment', 'service', 'hpa', 'ingress' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind')"
                          dense
                          v-model="patch.resourceKind"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-40 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path')"
                          dense
                          v-model="patch.path"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="350px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_4')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyPatches(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deletePatches(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between align-center mt-4">
                      <div class="form-item-100 d-flex align-center">
                        <v-textarea
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content')"
                          dense
                          auto-grow
                          rows="1"
                          style="white-space:nowrap;"
                          wrap="off"
                          row-height="12"
                          v-model="patch.content"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="350px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_4')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_5')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_6')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_7')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="updateComponentDialog"
        max-width="1100px"
        persistent
      >
        <v-card :loading="dialogLoading">
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_update_component')}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-4 yaml-btn" small v-bind="attrs" v-on="on">
                  <v-icon color="primary" @click="previewComponent()">mdi-cube-scan</v-icon>
                </v-btn>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</div>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="green" v-bind="attrs" v-on="on" @click="addComponent()">mdi-progress-check</v-icon>
              </template>
              <div>{{$vuetify.lang.t('$vuetify.lang_menu_def_confirm_change')}}</div>
            </v-tooltip>
            <v-icon class="ml-4" @click="() => {
              this.updateComponentDialog = false
              this.$refs.addComponentRef.resetValidation()
            }">
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <v-form ref="addComponentRef">
              <v-alert icon="mdi-alert-circle" prominent text type="info">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_component_prompt')}}</small>
              </v-alert>
              <div class="form-item-100 d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_component_component_desc')"
                    required
                    dense
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                    v-model="addComponentForm.componentTemplateDesc"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_component_component_desc_tip_1', targetProjectShortName)"
                    persistent-hint
                  ></v-text-field>
                </div>
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name')"
                    dense
                    v-model="addComponentForm.deploySpecStatic.deployName"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_name_tip_1', targetProjectShortName)"
                    persistent-hint
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
              </div>
              <div class="form-item-100 d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image')"
                    dense
                    v-model="addComponentForm.deploySpecStatic.deployImage"
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_image_tip_1')"
                    persistent-hint
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
                <div class="form-item-45">
                  <v-autocomplete
                    :items="archNames"
                    :label="$vuetify.lang.t('$vuetify.lang_form_component_arch')"
                    dense
                    v-model="addComponentForm.arch"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  />
                </div>
              </div>
              <div class="form-row d-flex justify-space-between mt-4">
                <div class="form-item-45">
                  <v-autocomplete
                    :items="['deployment', 'statefulset']"
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type')"
                    dense
                    :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_type_tip_1')"
                    persistent-hint
                    v-model="addComponentForm.deploySpecStatic.deployType"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  >
                  </v-autocomplete>
                </div>
                <div class="form-item-45">
                  <v-text-field
                    :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_replicas')"
                    dense
                    type="number"
                    v-model.number="addComponentForm.deploySpecStatic.deployReplicas"
                    :rules="[intRule]"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="form-row mt-4">
                <div class="form-item-30">
                  <v-spacer></v-spacer>
                  <v-autocomplete
                    :items="componentOpts"
                    dense
                    :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                    @change="chooseParams($event)"
                  ></v-autocomplete>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployResources.cpuLimit !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.cpuRequest !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.memoryLimit !== '' || 
                  addComponentForm.deploySpecStatic.deployResources.memoryRequest !== '' ||
                  addComponentForm.deploySpecStatic.deployResources.extraRequest !== null ||
                  addComponentForm.deploySpecStatic.deployResources.extraLimit !== null
                  " :id="'deployResources-'+targetIndex"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployResources')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-if="addComponentForm.deploySpecStatic.deployResources">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.memoryRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_request_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.memoryLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_memory_limit_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.cpuRequest"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_request_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployResources.cpuLimit"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources_cpu_limit_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="params-item mt-4">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request')}}</small>
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_request_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addExtraRequest('component')">mdi-table-plus</v-icon>
                      <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployResources.extraRequest" :key="i">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div>
                          <v-icon color="success" class="mr-4" @click="copyExtraRequest('component', i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteExtraRequest('component', i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                    <div class="params-item mt-4">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit')}}</small>
                      <v-tooltip right max-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_quota_config_default_quota_extra_limit_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="ml-4" @click="addExtraLimit('component')">mdi-table-plus</v-icon>
                      <div class="d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployResources.extraLimit" :key="i">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_name_tip_2')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_quota_config_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_quota_config_value_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div>
                          <v-icon color="success" class="mr-4" @click="copyExtraLimit('component', i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteExtraLimit('component', i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployCommand !== '' || 
                  addComponentForm.deploySpecStatic.deployEnvs !== null || 
                  addComponentForm.deploySpecStatic.deployArgs !== null || 
                  addComponentForm.deploySpecStatic.workingDir !== '' || 
                  addComponentForm.deploySpecStatic.nodeSelector !== null || 
                  addComponentForm.deploySpecStatic.nodeName !== '' || 
                  addComponentForm.deploySpecStatic.terminationGracePeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.subdomain !== '' || 
                  addComponentForm.deploySpecStatic.enableDownwardApi || 
                  addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds !== 0 ||
                  addComponentForm.deploySpecStatic.deployHeadless !== false ||
                  addComponentForm.deploySpecStatic.podManagementPolicy !== ''
                  " :id="'deployOther-'+targetIndex"
                >
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other')}} <v-icon color="error" class="ml-4" @click="clearParams('deployOther')">mdi-minus-circle-outline</v-icon></div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployCommand"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_command_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-combobox
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args')"
                          dense
                          multiple
                          small-chips
                          hide-selected
                          v-model="addComponentForm.deploySpecStatic.deployArgs"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_args_tip_1')"
                          persistent-hint
                          append-icon=""
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs')}}</small>
                        <v-icon color="success" class="ml-4" @click="addDeployEnvs()">mdi-table-plus</v-icon>
                        <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployEnvs" :key="i" v-if="addComponentForm.deploySpecStatic.deployEnvs">
                          <div class="form-item-45 mt-4">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_name')"
                              dense
                              v-model="row[0]"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <div class="form-item-45 mt-4">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_value')"
                              dense
                              v-model="row[1]"
                              :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            />
                          </div>
                          <v-icon color="error" class="mt-4" @click="deleteDeployEnvs(i)">mdi-trash-can-outline</v-icon>
                        </div>
                        <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_envs_tip_1')}}</small></div>
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.workingDir"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_working_dir_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item" v-if="!nodeSelectorDisable || !nodeNameDisable">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45" v-if="!nodeSelectorDisable">
                        <v-autocomplete
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector')"
                          dense
                          multiple
                          chips
                          :items="nodeLabels"
                          item-text="text"
                          item-value="text"
                          return-object
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_selector_tip_1')"
                          persistent-hint
                          v-model="addComponentForm.deploySpecStatic.nodeSelector"
                        ></v-autocomplete>
                      </div>
                      <div class="form-item-45 d-flex align-center" v-if="!nodeNameDisable">
                        <v-autocomplete
                          :items="nodeNames"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name')"
                          dense
                          clearable
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_node_name_tip_1')"
                          persistent-hint
                          v-model="addComponentForm.deploySpecStatic.nodeName"
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds')"
                          dense
                          type="number"
                          v-model.number="addComponentForm.deploySpecStatic.terminationGracePeriodSeconds"
                          :rules="[intRuleZero]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_termination_grace_period_seconds_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds')"
                          dense
                          type="number"
                          v-model.number="addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds"
                          :rules="[intRuleZero]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_session_affinity_timeout_seconds_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-45 d-flex align-center" v-if="!subdomainDisable">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.subdomain"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2'), 
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_subdomain_tip_2')}}</div>
                          </template>
                        </v-text-field>
                      </div>
                      <div class="form-item-45 d-flex align-center" v-if="!enableDownwardApiDisable">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                            { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.enableDownwardApi"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3'), 
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_2')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_enable_downward_api_tip_3')}}</div>
                          </template>
                        </v-autocomplete>
                      </div>                    
                    </div>
                  </div>
                  <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployType === 'statefulset'">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-50 d-flex align-center">
                        <v-autocomplete
                          :items="[
                            { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                            { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployHeadless"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_headless_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-50 d-flex align-center">
                        <v-autocomplete
                          :items="['OrderedReady', 'Parallel']"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.podManagementPolicy"
                          :messages="[
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2'), 
                            $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3'),
                          ]"
                        >
                          <template v-slot:message>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_1')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_2')}}</div>
                            <div class="my-1">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_pod_management_policy_tip_3')}}</div>
                          </template>
                        </v-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployMeta.labels !== null || addComponentForm.deploySpecStatic.deployMeta.annotations !== null" :id="'deployMeta-'+targetIndex">
                  <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta')}} <v-icon color="error" class="ml-4" @click="clearParams('deployMeta')">mdi-minus-circle-outline</v-icon></div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployMetaLabels()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.labels" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.labels">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployMetaLabels(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_labels_tip_1')}}</small></div>
                    </div>
                    <div class="form-item-50">
                      <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations')}}</small>
                      <v-icon color="success" class="ml-4" @click="addDeployMetaAnnotations()">mdi-table-plus</v-icon>
                      <div class="env-item d-flex justify-space-between" v-for="(row, i) in addComponentForm.deploySpecStatic.deployMeta.annotations" :key="i" v-if="addComponentForm.deploySpecStatic.deployMeta.annotations">
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_name')"
                            dense
                            v-model="row.name"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="form-item-45 mt-4">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_value')"
                            dense
                            v-model="row.value"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <v-icon color="error" class="mt-4" @click="deleteDeployMetaAnnotations(i)">mdi-trash-can-outline</v-icon>
                      </div>
                      <div><small class="tip-color">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta_annotations_tip_1')}}</small></div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployNodePorts !== null || 
                  addComponentForm.deploySpecStatic.deployLocalPorts !== null
                  " :id="'deployPorts-'+targetIndex"
                >
                  <div class="form-item-45 mt-4 d-flex align-center">
                    <v-autocomplete
                      :items="[
                        { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports'), value: 'deployLocalPorts' },
                        { text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports'), value: 'deployNodePorts' },
                      ]"
                      dense
                      :value="addComponentForm.deploySpecStatic.deployLocalPorts === null ? 'deployNodePorts' : 'deployLocalPorts'"
                      :label="$vuetify.lang.t('$vuetify.lang_form_def_add_params')"
                      @change="changePortSet($event)"
                    ></v-autocomplete>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployPorts')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-100" v-if="addComponentForm.deploySpecStatic.deployLocalPorts !== null" :id="'deployLocalPorts-'+targetIndex">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="mx-4" @click="addDeployLocalPort()">mdi-table-plus</v-icon>
                    </div>
                    <div class="params-content params-item justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployLocalPorts">
                      <div class="form-item-100 d-flex">
                        <div class="form-item-40 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_port')"
                            dense
                            type="number"
                            v-model.number="row.port"
                            :rules="[intRule]"
                          />
                        </div>
                        <div class="form-item-40 mt-4 d-flex">
                          <v-autocomplete
                            :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_protocol')"
                            dense
                            v-model="row.protocol"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          />
                        </div>
                        <div class="mt-4 d-flex">
                          <v-icon color="success" class="mr-4" @click="copyDeployLocalPort(i)">mdi-content-copy</v-icon>
                          <v-icon color="error" @click="deleteDeployLocalPort(i)">mdi-trash-can-outline</v-icon>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name')"
                            dense
                            v-model="row.ingress.domainName"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_domain_name_tip_1')"
                            persistent-hint
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix')"
                            dense
                            v-model="row.ingress.pathPrefix"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_path_prefix_tip_1')"
                            persistent-hint
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_tip_2')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-autocomplete
                            :items="[
                              { text: $vuetify.lang.t('$vuetify.lang_form_yes'), value: true },
                              { text: $vuetify.lang.t('$vuetify.lang_form_no'), value: false },
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed')"
                            dense
                            v-model="row.ingress.certSelfSigned"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_self_signed_tip_1')"
                            persistent-hint
                          />
                        </div>
                        <div class="form-item-45 mt-4 d-flex">
                          <v-autocomplete
                            :items="sourceBranchNames"
                            :label="$vuetify.lang.t('$vuetify.lang_form_debug_component_ingress_cert_branch')"
                            dense
                            v-model="row.ingress.certBranch"
                          ></v-autocomplete>
                        </div>
                      </div>
                      <div class="form-item-100 d-flex">
                        <div class="form-item-45 mt-4 d-flex">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path')"
                            dense
                            v-model="row.ingress.certPath"
                          />
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_1')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_2')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_3')}}</div>
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_local_ports_ingress_cert_path_tip_4')}}</div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100" v-if="addComponentForm.deploySpecStatic.deployNodePorts !== null" :id="'deployNodePorts-'+targetIndex">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                      <v-icon color="success" class="mx-4" @click="addDeployNodePort()">mdi-table-plus</v-icon>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployNodePorts">
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_port')"
                          dense
                          type="number"
                          v-model.number="row.port"
                          :rules="[intRule]"
                        />
                      </div>
                      <div class="form-item-30">
                        <v-autocomplete
                          :items="[ 'HTTP', 'TCP', 'UDP', 'SCTP' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_protocol')"
                          dense
                          v-model="row.protocol"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                      </div>
                      <div class="form-item-30 d-flex">
                        <v-autocomplete
                          :items="nodePorts"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port')"
                          dense
                          v-model="row.nodePort"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          persistent-hint
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_node_ports_node_port_tip_1')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployNodePort(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployNodePort(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployVolumes !== null" :id="'deployVolumes-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDeployVolumes()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployVolumes')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-for="(row, i) in addComponentForm.deploySpecStatic.deployVolumes">
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pod')"
                        dense
                        v-model="row.pathInPod"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_path_in_pv')"
                        dense
                        v-model="row.pathInPv"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-30 d-flex">
                      <v-autocomplete
                        :items="pvcNames || []"
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc')"
                        dense
                        clearable
                        v-model="row.pvc"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes_pvc_tip_1')"
                        persistent-hint
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyDeployVolumes(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteDeployVolumes(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders !== null
                  " :id="'deployHealthCheck-'+targetIndex"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('deployHealthCheck')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_startup_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_readiness_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4">
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_delay_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                    <div class="form-item-50 d-flex align-center">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds')"
                        dense
                        v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds"
                        :rules="[intRule]"
                        type="number"
                      />
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <div style="font-size: 12px;">
                          <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_liveness_period_seconds_tip_1')}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="params-content d-flex justify-space-between">
                    <div class="form-item-100">
                      <div class="form-item-50 d-flex">
                        <v-autocomplete
                          :items="[
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port'), value: 'checkPort'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec'), value: 'exec'},
                            {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get'), value: 'httpGet'},
                          ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_select_method')"
                          @change="healthCheckChange($event)"
                          :value="healthCheckInit()"
                        ></v-autocomplete>
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_check_port')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.checkPort"
                          :rules="[intRule]"
                          type="number"
                        />
                      </div>
                      <div class="mt-4" v-if="addComponentForm.deploySpecStatic.deployHealthCheck.exec !== ''">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.deployHealthCheck.exec"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_exec_tip_1')"
                          persistent-hint
                        >
                        </v-text-field>
                      </div>
                      <div v-if="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0">
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get')}}</small>
                        <div class="d-flex justify-space-between mt-4">
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_port')"
                              dense
                              v-model.number="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port"
                              :rules="[intRule]"
                              type="number"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-text-field
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_path')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path"
                            />
                          </div>
                          <div class="form-item-40">
                            <v-autocomplete
                              :items="['HTTP', 'HTTPS']"
                              :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_scheme')"
                              dense
                              v-model="addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme"
                            />
                          </div>
                        </div>
                        <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers')}}</small>
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_tip_2')}}</div>
                          </div>
                        </v-tooltip>
                        <v-icon color="success" class="ml-4" @click="addHealthCheckHttpHeaders()">mdi-table-plus</v-icon>
                        <div v-for="(row, i) in addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders" :key="i">
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_name')"
                                dense
                                v-model="row.name"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <div class="form-item-45">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check_http_get_http_headers_value')"
                                dense
                                v-model="row.value"
                                :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                              />
                            </div>
                            <v-icon color="success" class="mr-4" @click="copyHealthCheckHttpHeaders(i)">mdi-content-copy</v-icon>
                            <v-icon color="error" @click="deleteHealthCheckHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders !== null ||
                  addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0 || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme !== '' || 
                  addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders !== null
                  " :id="'lifecycle-'+targetIndex"
                >
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_tip_1')}}</span>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('lifecycle')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-100 params-item">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="params-content d-flex justify-space-between">
                      <div class="form-item-100">
                        <div class="form-item-50 d-flex">
                          <v-autocomplete
                            :items="[
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_post_start_select_method')"
                            @change="lifecyclePostStartChange($event)"
                            :value="lifecyclePostStartInit()"
                          ></v-autocomplete>
                        </div>
                        <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== ''">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.exec"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                            persistent-hint
                          >
                          </v-text-field>
                        </div>
                        <div v-if="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                dense
                                v-model.number="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port"
                                :rules="[intRule]"
                                type="number"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-autocomplete
                                :items="['HTTP', 'HTTPS']"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme"
                              />
                            </div>
                          </div>
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="ml-4" @click="addLifecyclePostStartHttpHeaders()">mdi-table-plus</v-icon>
                          <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders" :key="i">
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                  dense
                                  v-model="row.name"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                  dense
                                  v-model="row.value"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <v-icon color="success" class="mr-4" @click="copyLifecyclePostStartHttpHeaders(i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteLifecyclePostStartHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-item-100 params-item">
                    <div>
                      {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop')}}
                      <v-tooltip right max-width="250px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                        </template>
                        <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_tip_1')}}</span>
                      </v-tooltip>
                    </div>
                    <div class="params-content d-flex justify-space-between">
                      <div class="form-item-100">
                        <div class="form-item-50 d-flex">
                          <v-autocomplete
                            :items="[
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec'), value: 'exec'},
                              {text: $vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get'), value: 'httpGet'},
                            ]"
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_pre_stop_select_method')"
                            @change="lifecyclePreStopChange($event)"
                            :value="lifecyclePreStopInit()"
                          ></v-autocomplete>
                        </div>
                        <div class="mt-4" v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== ''">
                          <v-text-field
                            :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec')"
                            dense
                            v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.exec"
                            :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                            :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_exec_tip_1')"
                            persistent-hint
                          >
                          </v-text-field>
                        </div>
                        <div v-if="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0">
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get')}}</small>
                          <div class="d-flex justify-space-between mt-4">
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_port')"
                                dense
                                v-model.number="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port"
                                :rules="[intRule]"
                                type="number"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-text-field
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_path')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path"
                              />
                            </div>
                            <div class="form-item-40">
                              <v-autocomplete
                                :items="['HTTP', 'HTTPS']"
                                :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_scheme')"
                                dense
                                v-model="addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme"
                              />
                            </div>
                          </div>
                          <small>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers')}}</small>
                          <v-tooltip right max-width="250px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                            </template>
                            <div style="font-size: 12px;">
                              <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_tip_1')}}</div>
                            </div>
                          </v-tooltip>
                          <v-icon color="success" class="ml-4" @click="addLifecyclePreStopHttpHeaders()">mdi-table-plus</v-icon>
                          <div v-for="(row, i) in addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders" :key="i">
                            <div class="d-flex justify-space-between mt-4">
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_name')"
                                  dense
                                  v-model="row.name"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <div class="form-item-45">
                                <v-text-field
                                  :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle_http_get_http_headers_value')"
                                  dense
                                  v-model="row.value"
                                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                                />
                              </div>
                              <v-icon color="success" class="mr-4" @click="copyLifecyclePreStopHttpHeaders(i)">mdi-content-copy</v-icon>
                              <v-icon color="error" @click="deleteLifecyclePreStopHttpHeaders(i)">mdi-trash-can-outline</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="
                  !hpaConfigDisable &&
                  (addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.maxReplicas !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent !== 0 || 
                  addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue !== '' || 
                  addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue !== '')
                  " :id="'hpaConfig-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config')}}
                    <v-tooltip right max-width="400px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_2')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_tip_3')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('hpaConfig')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-if="addComponentForm.deploySpecStatic.hpaConfig">
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-100">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_max_replicas')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.maxReplicas"
                          :rules="[intRule]"
                          type="number"
                        />
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between mt-4">
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_value_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent"
                          :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                          type="number"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_memory_average_request_percent_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value')"
                          dense
                          v-model="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_value_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                      <div class="form-item-20 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent')"
                          dense
                          v-model.number="addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent"
                          :rules="[intRuleZero, v => v>=0 && v<=100 || $vuetify.lang.t('$vuetify.lang_form_required_must_be_0_to_100')]"
                          type="number"
                        />
                        <v-tooltip right max-width="250px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <span style="font-size: 12px;">{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config_cpu_average_request_percent_tip_1')}}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.dependServices !== null" :id="'dependServices-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDependServices()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('dependServices')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content" v-for="(row, i) in addComponentForm.deploySpecStatic.dependServices">
                    <div class="d-flex justify-space-between mt-4">
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name')"
                          dense
                          v-model="row.dependName"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-30">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_port')"
                          dense
                          v-model.number="row.dependPort"
                          type="number"
                        />
                      </div>
                      <div class="form-item-30">
                        <v-autocomplete
                          :items="[ 'TCP', 'UDP' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_depend_type')"
                          dense
                          v-model="row.dependType"
                          clearable
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-space-between mt-4">
                      <div class="form-item-100">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url')"
                          dense
                          v-model="row.httpGetUrl"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_depend_services_http_get_url_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <v-icon color="success" class="mr-4" @click="copyDependServices(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteDependServices(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!hostAliasesDisable && addComponentForm.deploySpecStatic.hostAliases !== null" :id="'hostAliases-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addHostAliases()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('hostAliases')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4 align-center" v-for="(row, i) in addComponentForm.deploySpecStatic.hostAliases">
                    <div class="form-item-30">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_ip')"
                        dense
                        v-model="row.ip"
                        :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-combobox
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames')"
                        dense
                        multiple
                        small-chips
                        hide-selected
                        v-model="row.hostnames"
                        :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases_hostnames_tip_1')"
                        persistent-hint
                        append-icon=""
                        :rules="[v => v.length > 0 || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      />
                    </div>
                    <div>
                      <v-icon color="success" class="mr-4" @click="copyHostAliases(i)">mdi-content-copy</v-icon>
                      <v-icon color="error" @click="deleteHostAliases(i)">mdi-trash-can-outline</v-icon>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!securityContextDisable && (addComponentForm.deploySpecStatic.securityContext.runAsUser !== 0 || addComponentForm.deploySpecStatic.securityContext.runAsGroup !== 0)" :id="'securityContext-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="mx-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_tip_1')}}
                      </div>
                    </v-tooltip>
                    <v-icon color="error" @click="clearParams('securityContext')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="params-content d-flex justify-space-between mt-4" v-if="addComponentForm.deploySpecStatic.securityContext">
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_user')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsUser"
                        :rules="[intRuleZero]"
                      />
                    </div>
                    <div class="form-item-45">
                      <v-text-field
                        :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_security_context_run_as_group')"
                        dense
                        type="number"
                        v-model.number="addComponentForm.deploySpecStatic.securityContext.runAsGroup"
                        :rules="[intRuleZero]"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="addComponentForm.deploySpecStatic.deployConfigSettings !== null || addComponentForm.deploySpecStatic.deployConfigBranch !== ''" :id="'deployConfigSettings-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_tip_2')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addDeployConfigSettings()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('deployConfigSettings')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div class="form-item-50">
                    <v-autocomplete
                      :items="sourceBranchNames"
                      :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_deploy_config_branch')"
                      dense
                      v-model="addComponentForm.deploySpecStatic.deployConfigBranch"
                    ></v-autocomplete>
                  </div>
                  <div class="params-content" v-for="(row, i) in addComponentForm.deploySpecStatic.deployConfigSettings">
                    <div class="d-flex justify-space-between align-center mt-4" >
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path')"
                          dense
                          v-model="row.localPath"
                          :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_local_path_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-45">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path')"
                          dense
                          v-model="row.podPath"
                          :rules="[v => v.length>0 && v.slice(0,1) !='/' || $vuetify.lang.t('$vuetify.lang_form_required_can_not_start_with_slash')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pod_path_tip_1')"
                          persistent-hint
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-space-between align-center mt-4" >
                      <div class="form-item-45">
                        <v-autocomplete
                          :items="pvcNames || []"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name')"
                          dense
                          clearable
                          v-model="row.pvcName"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings_pvc_name_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyDeployConfigSettings(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deleteDeployConfigSettings(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-item-100 params-item" v-if="!patchesDisable && addComponentForm.deploySpecStatic.patches !== null" :id="'patches-'+targetIndex">
                  <div>
                    {{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches')}}
                    <v-tooltip right max-width="250px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                      </template>
                      <div style="font-size: 12px;">
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_1')}}</div>
                        <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_tip_2')}}</div>
                      </div>
                    </v-tooltip>
                    <v-icon color="success" class="ml-4" @click="addPatches()">mdi-table-plus</v-icon>
                    <v-icon color="error" class="ml-4" @click="clearParams('patches')">mdi-minus-circle-outline</v-icon>
                  </div>
                  <div v-for="(patch, i) in addComponentForm.deploySpecStatic.patches">
                    <div class="params-content d-flex justify-space-between align-center mt-4">
                      <div class="form-item-40 d-flex align-center">
                        <v-autocomplete
                          :items="[ 'deployment', 'service', 'hpa', 'ingress' ]"
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind')"
                          dense
                          v-model="patch.resourceKind"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                          :hint="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_resource_kind_tip_1')"
                          persistent-hint
                        />
                      </div>
                      <div class="form-item-40 d-flex align-center">
                        <v-text-field
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path')"
                          dense
                          v-model="patch.path"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="350px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_path_tip_4')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-icon color="success" class="mr-4" @click="copyPatches(i)">mdi-content-copy</v-icon>
                        <v-icon color="error" @click="deletePatches(i)">mdi-trash-can-outline</v-icon>
                      </div>
                    </div>
                    <div class="params-content d-flex justify-space-between align-center mt-4">
                      <div class="form-item-100 d-flex align-center">
                        <v-textarea
                          :label="$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content')"
                          dense
                          auto-grow
                          rows="1"
                          style="white-space:nowrap;"
                          wrap="off"
                          row-height="12"
                          v-model="patch.content"
                          :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                        />
                        <v-tooltip right max-width="350px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="ml-2 diy-icon" v-bind="attrs" v-on="on">mdi-progress-question</v-icon>
                          </template>
                          <div style="font-size: 12px;">
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_1')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_2')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_3')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_4')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_5')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_6')}}</div>
                            <div>{{$vuetify.lang.t('$vuetify.lang_form_deploy_container_def_patches_content_tip_7')}}</div>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteComponentDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_component')}}</span>
          </v-card-title>
          <v-card-text>
            <v-alert icon="mdi-alert-circle" prominent text type="error">
              <small>{{$vuetify.lang.t('$vuetify.lang_form_delete_component_prompt', targetProjectName, deleteComponentForm.envName, deleteComponentForm.componentName)}}<v-chip small color="red">{{$vuetify.lang.t('$vuetify.lang_form_dangerous_operation')}}</v-chip></small>
            </v-alert>
            <div>
              {{$vuetify.lang.t('$vuetify.lang_form_delete_component_tip_1', targetProjectName, deleteComponentForm.envName, deleteComponentForm.componentName)}}
            </div>
            <v-form ref="deleteComponentRef">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :label="$vuetify.lang.t('$vuetify.lang_form_delete_component_component_name')"
                      required
                      dense
                      v-model="confirmValue"
                      :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                      :hint="$vuetify.lang.t('$vuetify.lang_form_delete_component_component_name_tip_1', deleteComponentForm.componentName)"
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
                this.deleteComponentDialog = false
                this.$refs.deleteComponentRef.reset()
              }"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteComponent()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="YAMLDialog"
        max-width="1200px"
        persistent
        eager
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_def_view_yaml')}}</span>
          </v-card-title>
          <v-card-text>
            <Monaco
              ref="monaco"
              :monacoOptions="singleMonacoOptions"
              :height="500"
            ></Monaco>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeYaml()"
            >
              {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import Operations from '@/lib/ui-lib/components/Operations'
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import request from '@/utils/request'
import YAML from "yamljs";
import Monaco from "@/lib/monaco/Monaco";
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: "Project",
  components: {
    Operations,
    PageCard,
    Monaco
  },
  data () {
    return {
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
      confirmValue: '',
      project: {
        tenantCode: '',
        projectInfo: {},
        projectSecret: {},
        projectRepo: {
          gitRepoType: '',
          gitRepoDir: {
            buildSettingsDir: '',
            databaseScriptsDir: '',
            demoCodesDir: '',
            deployScriptsDir: '',
            documentsDir: '',
            testScriptsDir: '',
          },
        }
      },
      cardLoading: true,
      auditDialog: false,
      logList: [],
      userToken: '',
      archNames: [],
      targetProjectName: '',
      targetProjectShortName: '',
      targetNodeport: 0,
      targetUsername: '',
      targetCrontabStr: '',
      targetEnvName: '',
      targetPipelineName: '',
      nodeNames: [],
      nodeLabels: [],
      deleteEnvName:'',
      sourceBranchNames: [],
      branchNames: [],
      copyBranchNames: [],
      copyTriggerOpName: '',
      componentOpts: [],
      newEnvSelectList: [],
      newEnvSelect:[],
      handleEnvType: '0',
      updateSecretKeyForm: {
        harborPassword: '',
        nexusPassword: '',
        sonarPassword: ''
      },
      harborPasswordDisplay: false,
      nexusPasswordDisplay: false,
      sonarPasswordDisplay: false,
      deleteProjectForm: {
        gitRepoDelete: false,
        scanCodeRepoDelete: false,
        imageRepoDelete: false,
        artifactRepoDelete: false,
        namespaceDelete: false,
      },
      repoNames: {},
      updateProjectForm: {
        projectDesc: '',
        projectTeam: '',
        projectArch: '',
        gitRepoUser: '',
        gitRepoToken: '',
        gitRepoPassword: '',
        gitRepoDir: {
          buildSettingsDir: '',
          databaseScriptsDir: '',
          demoCodesDir: '',
          deployScriptsDir: '',
          documentsDir: '',
          testScriptsDir: '',
        },
        imageRepoHostName: '',
        imageRepoGroupName: '',
        imageRepoUserName: '',
        imageRepoPassword: '',
        artifactRepoHostName: '',
        artifactRepoPort: 0,
        artifactRepoPath: '',
        artifactRepoUserName: '',
        artifactRepoPassword: '',
        artifactRepoHttpUpload: {
          url: '',
          insecure: false,
          method: '',
        },
        artifactRepoHttpDownload: {
          url: '',
          insecure: false,
        },
        scanCodeRepoName: '',
      },
      updateProjectEnvForm: {
        envName: '',
        privileged: false,
        disabledDefs: [],
        disabledPatches: [],
      },
      memberAddForm: {
        username: '',
        accessLevel: '',
        disableProjectDefs: [],
        disableRepoSecrets: [],
        disablePipelines: [],
      },
      addPipelineForm: {
        branchName: '',
        sourceBranch: '',
        envs: [],
        envProductions: [],
        webhookPushEvent: false,
      },
      envList: [],
      deletePipelineEnvForm: {
        branchName: '',
        envName: '',
        isProductionEnv: null
      },
      addPipelineEnvForm : {
        branchName: '',
        envName: '',
        isProductionEnv: null
      },
      addCrontabForm: {
        branchName: '',
        branchNames: [],
        crontabMinute: 0,
        crontabHour: 0,
        crontabDay: 1,
        crontabMonth: 1,
        crontabWeek: 1,
      },
      quotaConfigForm: {
        envName: '',
        namespaceQuota: {
          memoryRequest: '',
          cpuRequest: '',
          memoryLimit: '',
          cpuLimit: '',
          podsLimit: 0,
        },
        defaultQuota: {
          memoryRequest: '',
          cpuRequest: '',
          memoryLimit: '',
          cpuLimit: '',
        }
      },
      addHostForm: {
        envName: '',
        hostName: '',
        hostAddr: '',
        hostPort: '',
        hostUser: '',
        hostPassword: '',
        hostBecome: null,
        hostBecomeUser: '',
        hostBecomePassword: '',
        groups: [],
        variables: {}
      },
      updateHostForm: {
        envName: '',
        hostName: '',
        hostAddr: '',
        hostPort: '',
        hostUser: '',
        hostPassword: '',
        hostBecome: null,
        hostBecomeUser: '',
        hostBecomePassword: '',
        groups: [],
        variables: {}
      },
      hostPasswordDisplay: false,
      hostBecomePasswordDisplay: false,
      hostPasswordDisplay2: false,
      hostBecomePasswordDisplay2: false,
      dialogLoading: true,
      joinHostDialog: false,
      joinHostForm: {
        projectName: '',
        envName: '',
        hostName: '',
        groups: [],
        variables: {}
      },
      leaveHostForm: {
        envName: '',
        hostName: ''
      },
      leaveHostDialog: false,
      deleteHostForm: {
        envName: '',
        hostName: ''
      },
      projectEnvs: [],
      selection: [],
      addDbForm: {
        envName: '',
        dbName: '',
        dbUrl: '',
        dbUser: '',
        dbPassword: ''
      },
      dbPasswordDisplay: false,
      deletePVForm: {
        envName: '',
        pvcName: ''
      },
      deleteNetworkPolicyForm: {
        envName: '',
        name: ''
      },
      updateDbForm: {
        envName: '',
        dbName: '',
        dbUrl: '',
        dbUser: '',
        dbPassword: ''
      },
      updateDbPasswordDisplay: false,
      deleteDbForm: {
        envName: '',
        dbName: ''
      },
      joinDbDialog: false,
      dbSelection: [],
      joinDbForm: {
        projectName: '',
        envName: '',
        dbName: ''
      },
      leaveDbDialog: false,
      leaveDbForm: {
        envName: '',
        dbName: ''
      },
      deleteEnvDialog: false,
      newEnvDialog: false,
      deleteNodePortDialog: false,
      addNodePortDialog: false,
      updateProjectDialog: false,
      updateProjectEnvDialog: false,
      deleteProjectDialog: false,
      updateSecretKeyDialog: false,
      reApplyKubernetesDialog: false,
      cleanGitRepoDialog: false,
      assignPermissionDialog: false,
      updatePermissionDialog: false,
      deletePermissionsDialog: false,
      addPipelineDialog: false,
      deletePipelineDialog: false,
      addPipelineEnvDialog: false,
      updateQuotaConfigDialog: false,
      addCrontabDialog: false,
      copyToBranchCrontabDialog: false,
      copyToBranchTriggerDialog: false,
      deleteCrontabDialog: false,
      addPVDialog: false,
      addSCDialog: false,
      addNetworkPolicyDialog: false,
      addHostDialog: false,
      addDbDialog: false,
      deletePVDialog: false,
      deleteNetworkPolicyDialog: false,
      updateHostDialog: false,
      deleteHostDialog: false,
      updateDbDialog: false,
      deleteDbDialog: false,
      deletePipelineEnvDialog: false,
      pvList: [],
      pvNames: [],
      scNames: [],
      addSCForm: {
        envName: '',
        scNames: [],
      },
      userNames: [],
      accessLevel: [ 'runner', 'developer', 'maintainer' ],
      gitPush: [ {text: vuetify.preset.lang.t('$vuetify.lang_form_yes'), value: true}, {text: vuetify.preset.lang.t('$vuetify.lang_form_no'), value: false} ],
      addComponentDebugForm: {
        arch: '',
        debugQuota: {},
        ingress: {},
      },
      addComponentDebugDialog: false,
      componentDebugYamlDialog: false,
      defaultComponentDebugYaml: '',
      defaultDialogTitle: '',
      deleteComponentDebugForm: {
        envName: ''
      },
      deleteComponentDebugDialog: false,
      addComponentDialog: false,
      chooseComponent: '',
      addComponentForm: {
        arch: '',
        componentTemplateDesc: '',
        deploySpecStatic: {
          deployName: "",
          deployImage: "",
          deployType: "",
          deployReplicas: 1,
          deployHeadless: false,
          podManagementPolicy: "",
          deployMeta: {
            labels: null,
            annotations: null,
          },
          deployResources: {
            cpuLimit: '',
            cpuRequest: '',
            memoryLimit: '',
            memoryRequest: ''
          },
          deployVolumes: null,
          deployHealthCheck: {
            checkPort: 0,
            exec: "",
            httpGet: {
              httpHeaders: null,
              path: "",
              port: 0,
              scheme: "",
            },
            livenessDelaySeconds: 0,
            livenessPeriodSeconds: 0,
            readinessDelaySeconds: 0,
            readinessPeriodSeconds: 0,
            startupDelaySeconds: 0,
            startupPeriodSeconds: 0,
          },
          lifecycle: {
            postStart: {
              exec: "",
              httpGet: {
                httpHeaders: null,
                path: "",
                port: 0,
                scheme: "",
              },
            },
            preStop: {
              exec: "",
              httpGet: {
                httpHeaders: null,
                path: "",
                port: 0,
                scheme: "",
              },
            },
          },
          deployLocalPorts: null,
          deployNodePorts: null,
          hpaConfig: {
            cpuAverageRequestPercent: 0,
            maxReplicas: 0,
            memoryAverageRequestPercent: 0,
            cpuAverageValue: "",
            memoryAverageValue: "",
          },
          dependServices: null,
          hostAliases: null,
          securityContext: {
            runAsUser: 0,
            runAsGroup: 0,
          },
          deployConfigBranch: '',
          deployConfigSettings: null,
          patches: null,
          deployEnvs: null,
          deployCommand: "",
          deployArgs: null,
          deploySessionAffinityTimeoutSeconds: 0,
          workingDir: "",
          nodeSelector: null,
          nodeName: "",
          terminationGracePeriodSeconds: 0,
          subdomain: "",
          enableDownwardApi: false,
        }
      },
      componentList: [],
      defaultComponent: '',
      updateComponentForm: {
        envName: '',
        componentDesc: '',
        componentYaml: ''
      },
      updateComponentDialog: false,
      deleteComponentForm: {
        envName: '',
        componentName: ''
      },
      deleteComponentDialog: false,
      variableList: [
        ['','']
      ],
      projectEnvList: [],
      projectEnvListChildren: [],
      addTriggerDialog: false,
      vars: '',
      varsDialog: false,
      addTriggerForm: {
        branchName: '',
        branchNames: [],
        beforeExecute: false,
        stepActions: [],
        statusResults: [],
        enable: false,
        checkVarToIgnore: '',
        webhookUrl: '',
        insecure: false,
        webhookMethod: '',
        webhookHeaders: null,
        webhookQueryParams: null,
        webhookForms: null,
        webhookBody: '',
        mailTitle: '',
        mailContent: '',
        mailAttachmentFormat: 'yaml',
        mailCommittees: false,
        mailReceivers: [],
        noticeCommittees: false,
        noticeUsernames: [],
      },
      stepActionList: [],
      updateTriggerDialog: false,
      updateTriggerForm: {
        branchName: '',
        branchNames: [],
        beforeExecute: false,
        stepActions: [],
        statusResults: [],
        enable: false,
        checkVarToIgnore: '',
        webhookUrl: '',
        insecure: false,
        webhookMethod: '',
        webhookHeaders: null,
        webhookQueryParams: null,
        webhookForms: null,
        webhookBody: '',
        mailTitle: '',
        mailContent: '',
        mailAttachmentFormat: 'yaml',
        mailCommittees: false,
        mailReceivers: [],
        noticeCommittees: false,
        noticeUsernames: [],
      },
      deleteTriggerDialog: false,
      deleteTriggerForm: {},
      disableBtn: false,
      YAMLDialog: false,
      yamlText: '',
      actionType: '',
      pvs: [],
      pvcNames: [],
      nodePorts: [],
      componentType: '',
      targetIndex: '',
      singleMonacoOptions: {
        value: '',
        automaticLayout:true,
        readOnly: true,
        theme: "vs-dark",
        language: "yaml"
      },
      markdownMonacoOptions: {
        value: '',
        automaticLayout: true,
        readOnly: true,
        theme: "vs-dark",
        language: "markdown"
      },
      refreshTokenDialog: false,
      targetBranchName: '',
      handle: '',
      httpMethods: [],
      disabledDefNames: [],
      community: false,
      hostAliasesDisable: false,
      hpaConfigDisable: false,
      securityContextDisable: false,
      patchesDisable: false,
      enableDownwardApiDisable: false,
      nodeNameDisable: false,
      nodeSelectorDisable: false,
      subdomainDisable: false,
    }
  },
  created () {
    const vm = this
    vm.userToken = JSON.parse(localStorage.getItem('userObj')).userToken
    const projectName = vm.$route.params.projectName
    vm.targetProjectName = projectName
    request.get(`/admin/archNames`).then(response => {
      vm.archNames = response.data.archNames
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get('/admin/repoNames').then(response => {
      vm.repoNames = response.data
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg)
    })
    request.get(`/admin/project/${projectName}`).then(response => {
      let pipelines = response.data.project.pipelines.map(pp => {
        let p = pp.pipelineTriggers.map((pt, i) => {
          pt.index = i
          return pt
        })
        vm.branchNames.push(pp.branchName)
        pp.pipelineTriggers = p
        return pp
      })
      response.data.project.pipelines = pipelines
      vm.project = response.data.project
      vm.targetProjectShortName = vm.project.projectInfo.projectShortName
      vm.cardLoading = false
      response.data.project.projectAvailableEnvs.map(item => {
        vm.envList.push(item.envName)
      })
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get('/public/about').then(response => {
      vm.httpMethods = response.data.httpMethods
      vm.community = response.data.community
      vm.disabledDefNames = response.data.config.disabledDefNames
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/cicd/trigger/vars').then(response => {
      vm.vars = response.data.content
      vm.markdownMonacoOptions.value = vm.vars
    }).catch(error => {
      vm.errorTip(true, error.response.data.msg);
    })
    request.get('/admin/projectEnvs').then(response => {
      response.data.projectEnvs.map(item => {
        var node = {
          name: '',
          id: '',
          children: [],
        }
        node.name = item.projectName
        node.id = item.projectName
        vm.projectEnvList.push({
          text: item.projectName,
          value: item.projectName,
          children: item.envNames
        })
        item.envNames.map((i,index) => {
          var childrenItem = { name: '', id: '', projectName: '' }
          childrenItem.name = i
          childrenItem.id = i+item.projectName
          childrenItem.projectName = item.projectName
          node.children.push(childrenItem)
        })
        vm.projectEnvs.push(node)
      })
    })
    request.get(`/admin/project/${projectName}/envComponentTemplates`).then(response => {
      vm.defaultComponent = response.data.componentTemplateYaml
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get(`/admin/project/${projectName}/pipelineTriggerStepActions`).then(response => {
      vm.stepActionList = response.data.stepActions
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
    request.get(`/admin/project/${projectName}/branchNames`).then(response => {
      vm.sourceBranchNames = response.data.branchNames
    }).catch(error => {
      vm.errorTip(true,error.response.data.msg)
    })
  },
  methods: {
    showLog (response) {
      const vm =this
      vm.logList = []
      vm.auditDialog = response.data.withAdminLog
      if(response.data.withAdminLog){
        vm.disableBtn = true
        vm.ws = new WebSocket(`${vm.GLOBAL_WS_API}/ws/log/audit/admin/${response.data.auditID}?x-user-token=${vm.userToken}`)
        vm.ws.onmessage = (event) => {
          vm.logList.push(JSON.parse(event.data))
        }
        vm.ws.onclose = (e) => {
          vm.logList.push({logType: 'END'})
          vm.disableBtn = false
        }
      }
    },
    closeLog () {
      this.auditDialog = false
      if (this.handle === 'delete') {
        this.$router.push({name: 'AdminProjects'})
      } else {
        this.refreshList()
      }
    },
    refreshList () {
      const vm =this
      vm.cardLoading = true
      vm.handle = ''
      request.get(`/admin/project/${vm.targetProjectName}`).then(response => {
        let pipelines = response.data.project.pipelines.map(pp => {
          let p = pp.pipelineTriggers.map((pt, i) => {
            pt.index = i
            return pt
          })
          pp.pipelineTriggers = p
          return pp
        })
        response.data.project.pipelines = pipelines
        vm.project = response.data.project
        vm.cardLoading = false
      }).catch(error => {
        vm.cardLoading = false
        vm.errorTip(true,error.response.data.msg)
      })
      request.get(`/admin/project/${vm.targetProjectName}/branchNames`).then(response => {
        vm.sourceBranchNames = response.data.branchNames
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openNewNodeport(envName) {
      const vm =this
      vm.addNodePortDialog = true
      vm.targetEnvName = envName
    },
    newNodePort() {
      const vm =this
      vm.addNodePortDialog = false
      vm.cardLoading = true
      request.post(`/admin/project/${vm.targetProjectName}/nodePortAdd`, {envName: vm.targetEnvName}).then(response => {
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.cardLoading = false
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openRecycleNodeport(envName, nodePort) {
      const vm =this
      vm.deleteNodePortDialog = true
      vm.targetEnvName = envName
      vm.targetNodeport = nodePort
    },
    recycleNodeport () {
      const vm =this
      request.post(`/admin/project/${vm.targetProjectName}/nodePortDelete`, {envName: vm.targetEnvName, nodePort: vm.targetNodeport}).then(response => {
        vm.deleteNodePortDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openRecycleEnv (data) {
      const vm =this
      vm.confirmValue = ''
      vm.deleteEnvName = data
      vm.deleteEnvDialog = true
      vm.handleEnvType = '0'
    },
    recycleEnv () {
      const vm = this
      if(vm.handleEnvType == '0'){
        request.post(`/admin/project/${vm.targetProjectName}/envDelete`, { envName: vm.deleteEnvName }).then(response => {
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.refreshList()
          vm.deleteEnvDialog = false
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        if(vm.$refs.deleteEnvRef.validate()){
          if(vm.deleteEnvName == vm.confirmValue){
            request.post(`/admin/project/${vm.targetProjectName}/envDeleteAll`, { envName: vm.deleteEnvName }).then(response => {
              vm.successTip(true,response.msg)
              vm.showLog(response)
              vm.refreshList()
              vm.deleteEnvDialog = false
            }).catch(error => {
              vm.errorTip(true,error.response.data.msg)
            })
          }else{
            vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteEnvName))
          }
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
        }
      }
    },
    openNewEnv(tenantCode) {
      const vm = this
      request.post('/admin/envNames/tenantCode', {tenantCode: tenantCode}).then(response => {
        vm.newEnvSelectList = response.data.envNames
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
      vm.newEnvDialog = true
    },
    newEnv() {
      const vm = this
      if(vm.$refs.chooseEnvRef.validate()){
        if(vm.newEnvSelect.length > 0){
          request.post(`/admin/project/${vm.targetProjectName}/envAdd`, { envNames: vm.newEnvSelect }).then(response => {
            vm.newEnvDialog = false
            vm.successTip(true,response.msg)
            vm.showLog(response)
            vm.$refs.chooseEnvRef.reset()
            vm.refreshList()
          }).catch(error => {
            vm.errorTip(true,error.response.data.msg)
          })
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateProject() {
      const vm = this
      vm.updateProjectForm.projectDesc = vm.project.projectInfo.projectDesc
      vm.updateProjectForm.projectTeam = vm.project.projectInfo.projectTeam
      vm.updateProjectForm.projectArch = vm.project.projectInfo.projectArch
      vm.updateProjectForm.gitRepoDir = vm.project.projectRepo.gitRepoDir
      vm.updateProjectDialog = true
    },
    updateProject () {
      const vm = this
      if(vm.$refs.updateProjectRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}`, vm.updateProjectForm).then(response => {
          vm.updateProjectDialog = false
          vm.successTip(true,response.msg)
          vm.$refs.updateProjectRef.resetValidation()
          vm.showLog(response)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateProjectEnv(envName) {
      const vm =this
      vm.project.projectAvailableEnvs.forEach(pae => {
        if (pae.envName === envName) {
          vm.updateProjectEnvForm.envName = pae.envName
          vm.updateProjectEnvForm.privileged = pae.privileged
          vm.updateProjectEnvForm.disabledDefs = pae.disabledDefs
          vm.updateProjectEnvForm.disabledPatches = pae.disabledPatches
        }
      })
      if (vm.updateProjectEnvForm.envName === '') {
        vm.errorTip(true, `envName ${envName} not exists`)
      } else {
        vm.updateProjectEnvDialog = true
      }
    },
    updateProjectEnv() {
      const vm =this
      request.post(`/admin/project/${vm.targetProjectName}/envUpdate`, vm.updateProjectEnvForm).then(response => {
        vm.updateProjectEnvDialog = false
        vm.updateProjectEnvForm.envName = ''
        vm.updateProjectEnvForm.privileged = false
        vm.updateProjectEnvForm.disabledDefs = []
        vm.updateProjectEnvForm.disabledPatches = []
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    deleteProject() {
      const vm = this
      if(vm.$refs.deleteProjectRef.validate() && (vm.targetProjectName === vm.confirmValue)){
        request.post(`/admin/project/${vm.targetProjectName}/delete`, vm.deleteProjectForm).then(response => {
          vm.successTip(true,response.msg)
          vm.deleteProjectDialog = false
          vm.showLog(response)
          vm.handle = 'delete'
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetProjectName))
      }
    },
    updateToken () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/refreshToken`,vm.updateSecretKeyForm).then(response => {
        vm.updateSecretKeyDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    reApplyKubernetes () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/reApply`).then(response => {
        vm.reApplyKubernetesDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    cleanGitRepo () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/cleanGitRepo`).then(response => {
        vm.cleanGitRepoDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openMemberAdd (tenantCode) {
      const vm = this
      vm.assignPermissionDialog = true
      request.post('/admin/userNames/tenantCode', {tenantCode: tenantCode}).then(response => {
        vm.userNames = response.data.userNames
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    memberAdd () {
      const vm = this
      if(vm.$refs.memberAddRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/memberAdd`,vm.memberAddForm).then(response => {
          vm.assignPermissionDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openUpdateMember(projectMember, tenantCode) {
      const vm = this
      vm.updatePermissionDialog = true
      vm.memberAddForm = {
        username: projectMember.username,
        accessLevel: projectMember.accessLevel,
        disableProjectDefs: projectMember.disableProjectDefs,
        disableRepoSecrets: projectMember.disableRepoSecrets,
        disablePipelines: projectMember.disablePipelines,
      }
      request.post('/admin/userNames/tenantCode', {tenantCode: tenantCode}).then(response => {
        vm.userNames = response.data.userNames
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    updateMember () {
      const vm = this
      if(vm.$refs.updateMemberRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/memberUpdate`, vm.memberAddForm).then(response => {
          vm.updatePermissionDialog = false
          vm.successTip(true,response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    deletePermissions(data) {
      this.deletePermissionsDialog = true
      this.targetUsername = data
    },
    deleteMember () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/memberDelete`,{username: vm.targetUsername}).then(response => {
        vm.deletePermissionsDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    addPipeline () {
      const vm = this
      if(vm.$refs.addPipelineRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/pipelineAdd`,vm.addPipelineForm).then(response => {
          vm.addPipelineDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeletePipeline(data) {
      this.confirmValue = ''
      this.deletePipelineDialog = true
      this.targetBranchName = data
    },
    deletePipeline () {
      const vm = this
      if(vm.$refs.deleteBranchNameRef.validate() && vm.targetBranchName == vm.confirmValue){
        request.post(`/console/project/${vm.targetProjectName}/pipelineDelete`,{branchName: vm.targetBranchName}).then(response => {
          vm.deletePipelineDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.targetBranchName))
      }
    },
    openAddPipelineEnv (branchName,pipelineName) {
      this.addPipelineEnvDialog = true
      this.addPipelineEnvForm.branchName = branchName
      this.targetPipelineName = pipelineName
    },
    addPipelineEnv () {
      const vm = this
      if(vm.$refs.addPipelineEnvRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/pipelineEnvAdd`, vm.addPipelineEnvForm).then(response => {
          vm.addPipelineEnvDialog = false
          vm.successTip(true,response.msg)
          vm.refreshList()
          vm.$refs.addPipelineEnvRef.reset()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openRefreshToken (branchName) {
      const vm = this
      vm.targetBranchName = branchName
      vm.refreshTokenDialog = true
    },
    refreshToken () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/pipelineTokenRefresh`, { branchName: vm.targetBranchName }).then(response => {
        vm.refreshTokenDialog = false
        vm.successTip(true,response.msg)
        vm.showLog(response)
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    changeSwitch(branchName,webhookPushEvent) {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/pipelineGitWebhook`,{branchName,webhookPushEvent}).then(response => {
        vm.successTip(true,response.msg)
        vm.showLog(response)
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
        vm.refreshList()
      })
    },
    openCronAdd (branchName) {
      this.addCrontabDialog = true
      this.addCrontabForm.branchName = branchName
      this.addCrontabForm.branchNames = []
    },
    cronAdd () {
      const vm = this
      if(vm.$refs.cronAddRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/pipelineCronAdd`, vm.addCrontabForm).then(response => {
          vm.successTip(true,response.msg)
          vm.$refs.cronAddRef.reset()
          vm.refreshList()
          vm.addCrontabDialog = false
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCronCopy(branchName, pipelineCron) {
      this.addCrontabDialog = true
      this.addCrontabForm = { ...pipelineCron }
      this.addCrontabForm.branchName = branchName
      this.addCrontabForm.branchNames = []
    },
    openCopyToBranchCrontab () {
      const vm = this
      if (vm.$refs.cronAddRef.validate()) {
        vm.copyToBranchCrontabDialog = true
        vm.copyBranchNames = []
      }
    },
    copyToBranchCrontab () {
      const vm = this
      if(vm.$refs.cronAddRef.validate() && vm.$refs.copyToBranchCrontabRef.validate()){
        vm.addCrontabForm.branchNames = vm.copyBranchNames
        request.post(`/admin/project/${vm.targetProjectName}/pipelineCronCopy`, vm.addCrontabForm).then(response => {
          vm.successTip(true,response.msg)
          vm.$refs.cronAddRef.reset()
          vm.$refs.copyToBranchCrontabRef.reset()
          vm.refreshList()
          vm.copyToBranchCrontabDialog = false
          vm.addCrontabDialog = false
          vm.copyBranchNames = []
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCronDelete (branchName,crontabStr) {
      this.deleteCrontabDialog = true
      this.targetBranchName = branchName
      this.targetCrontabStr = crontabStr
    },
    cronDelete () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/pipelineCronDelete`,{
        branchName: vm.targetBranchName,
        crontabStr: vm.targetCrontabStr
      }).then(response => {
        vm.successTip(true,response.msg)
        vm.refreshList()
        vm.deleteCrontabDialog = false
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    addExtraQuotas() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.quotaConfigForm.namespaceQuota.extraQuotas === null) {
        vm.quotaConfigForm.namespaceQuota.extraQuotas = [];
        vm.quotaConfigForm.namespaceQuota.extraQuotas.push(addItem);
      } else {
        vm.quotaConfigForm.namespaceQuota.extraQuotas.push(addItem);
      }
    },
    copyExtraQuotas(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.quotaConfigForm.namespaceQuota.extraQuotas[i]
        )
      );
      vm.quotaConfigForm.namespaceQuota.extraQuotas.push(copyItem);
    },
    deleteExtraQuotas(i) {
      const vm = this;
      vm.quotaConfigForm.namespaceQuota.extraQuotas.splice(i,1);
    },
    addExtraRequest(mode) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (mode === 'quotaConfig') {
        if (vm.quotaConfigForm.defaultQuota.extraRequest === null) {
          vm.quotaConfigForm.defaultQuota.extraRequest = [];
          vm.quotaConfigForm.defaultQuota.extraRequest.push(addItem);
        } else {
          vm.quotaConfigForm.defaultQuota.extraRequest.push(addItem);
        }
      } else if (mode === 'debugComponent') {
        if (vm.addComponentDebugForm.debugQuota.extraRequest === null) {
          vm.addComponentDebugForm.debugQuota.extraRequest = [];
          vm.addComponentDebugForm.debugQuota.extraRequest.push(addItem);
        } else {
          vm.addComponentDebugForm.debugQuota.extraRequest.push(addItem);
        }
      } else if (mode === 'component') {
        if (vm.addComponentForm.deploySpecStatic.deployResources.extraRequest === null) {
          vm.addComponentForm.deploySpecStatic.deployResources.extraRequest = [];
          vm.addComponentForm.deploySpecStatic.deployResources.extraRequest.push(addItem);
        } else {
          vm.addComponentForm.deploySpecStatic.deployResources.extraRequest.push(addItem);
        }
      }
    },
    copyExtraRequest(mode, i) {
      const vm = this;
      if (mode === 'quotaConfig') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.quotaConfigForm.defaultQuota.extraRequest[i]
          )
        );
        vm.quotaConfigForm.defaultQuota.extraRequest.push(copyItem);
      } else if (mode === 'debugComponent') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.addComponentDebugForm.debugQuota.extraRequest[i]
          )
        );
        vm.addComponentDebugForm.debugQuota.extraRequest.push(copyItem);
      } else if (mode === 'component') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.addComponentForm.deploySpecStatic.deployResources.extraRequest[i]
          )
        );
        vm.addComponentForm.deploySpecStatic.deployResources.extraRequest.push(copyItem);
      }
    },
    deleteExtraRequest(mode, i) {
      const vm = this;
      if (mode === 'quotaConfig') {
        vm.quotaConfigForm.defaultQuota.extraRequest.splice(i,1);
      } else if (mode === 'debugComponent') {
        vm.addComponentDebugForm.debugQuota.extraRequest.splice(i,1);
      } else if (mode === 'component') {
        vm.addComponentForm.deploySpecStatic.deployResources.extraRequest.splice(i,1);
      }
    },
    addExtraLimit(mode) {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (mode === 'quotaConfig') {
        if (vm.quotaConfigForm.defaultQuota.extraLimit === null) {
          vm.quotaConfigForm.defaultQuota.extraLimit = [];
          vm.quotaConfigForm.defaultQuota.extraLimit.push(addItem);
        } else {
          vm.quotaConfigForm.defaultQuota.extraLimit.push(addItem);
        }
      } else if (mode === 'debugComponent') {
        if (vm.addComponentDebugForm.debugQuota.extraLimit === null) {
          vm.addComponentDebugForm.debugQuota.extraLimit = [];
          vm.addComponentDebugForm.debugQuota.extraLimit.push(addItem);
        } else {
          vm.addComponentDebugForm.debugQuota.extraLimit.push(addItem);
        }
      } else if (mode === 'component') {
        if (vm.addComponentForm.deploySpecStatic.deployResources.extraLimit === null) {
          vm.addComponentForm.deploySpecStatic.deployResources.extraLimit = [];
          vm.addComponentForm.deploySpecStatic.deployResources.extraLimit.push(addItem);
        } else {
          vm.addComponentForm.deploySpecStatic.deployResources.extraLimit.push(addItem);
        }
      }
    },
    copyExtraLimit(mode, i) {
      const vm = this;
      if (mode === 'quotaConfig') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.quotaConfigForm.defaultQuota.extraLimit[i]
          )
        );
        vm.quotaConfigForm.defaultQuota.extraLimit.push(copyItem);
      } else if (mode === 'debugComponent') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.addComponentDebugForm.debugQuota.extraLimit[i]
          )
        );
        vm.addComponentDebugForm.debugQuota.extraLimit.push(copyItem);
      } else if (mode === 'component') {
        let copyItem = JSON.parse(
          JSON.stringify(
            vm.addComponentForm.deploySpecStatic.deployResources.extraLimit[i]
          )
        );
        vm.addComponentForm.deploySpecStatic.deployResources.extraLimit.push(copyItem);
      }
    },
    deleteExtraLimit(mode, i) {
      const vm = this;
      if (mode === 'quotaConfig') {
        vm.quotaConfigForm.defaultQuota.extraLimit.splice(i,1);
      } else if (mode === 'debugComponent') {
        vm.addComponentDebugForm.debugQuota.extraLimit.splice(i,1);
      } else if (mode === 'component') {
        vm.addComponentForm.deploySpecStatic.deployResources.extraLimit.splice(i,1);
      }
    },
    openQuotaConfig (envName) {
      this.updateQuotaConfigDialog = true
      this.quotaConfigForm.envName = envName
      this.getEnvQuotaConfig()
    },
    getEnvQuotaConfig () {
      const vm = this
      vm.project.projectAvailableEnvs.map(item => {
        if(item.envName == vm.quotaConfigForm.envName){
          vm.quotaConfigForm.namespaceQuota = item.quotaConfig.namespaceQuota
          vm.quotaConfigForm.defaultQuota = item.quotaConfig.defaultQuota
        }
      })
    },
    quotaConfig () {
      const vm = this
      if(vm.$refs.quotaConfigRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envQuotaConfigUpdate`,vm.quotaConfigForm).then(response => {
          vm.successTip(true,response.msg)
          vm.$refs.quotaConfigRef.reset()
          vm.updateQuotaConfigDialog = false
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAllotPV (envName) {
      const vm = this
      vm.addPVDialog = true
      vm.targetEnvName = envName
      vm.dialogLoading = true
      request.get(`/admin/env/${envName}/pvNames`).then(response => {
        response.data.pvs.map(item => {
          vm.pvList.push(item.pvName)
        })
        vm.dialogLoading = false
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    allotPV () {
      const vm = this
      if(vm.$refs.allotPVRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envPvcAdd`,{
          envName: vm.targetEnvName,
          pvNames: vm.pvNames
        }).then(response => {
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.addPVDialog = false
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAllotSC (envName) {
      const vm = this
      vm.addSCDialog = true
      vm.targetEnvName = envName
      vm.dialogLoading = true
      vm.addSCForm.envName = envName
      request.get(`/admin/env/${envName}/scNames`).then(response => {
        vm.scNames = response.data.scNames
        vm.dialogLoading = false
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })      
    },
    allotSC () {
      const vm = this
      if(vm.$refs.allotSCRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envPvcScAdd`, vm.addSCForm).then(response => {
          vm.successTip(true,response.msg)
          vm.showLog(response)
          vm.addSCDialog = false
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDeletePV (envName, pvcName) {
      this.confirmValue = ''
      this.deletePVDialog = true
      this.deletePVForm.envName = envName
      this.deletePVForm.pvcName = pvcName
    },
    deletePV () {
      const vm = this
      if(vm.$refs.deletePVRef.validate()){
        if(vm.deletePVForm.pvcName == vm.confirmValue){
          request.post(`/admin/project/${vm.targetProjectName}/envPvcDelete`, vm.deletePVForm).then(response => {
            vm.deletePVDialog = false
            vm.showLog(response)
            vm.successTip(true,response.msg)
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg)
          })
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deletePVForm.pvcName))
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAddNetworkPolicy (envName) {
      this.addNetworkPolicyDialog = true
      this.targetEnvName = envName
      this.dialogLoading = false
    },
    addNetworkPolicy () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/envNetworkPolicyAdd`,{
        envName: vm.targetEnvName,
      }).then(response => {
        vm.successTip(true,response.msg)
        vm.showLog(response)
        vm.addNetworkPolicyDialog = false
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openNetworkPolicyDelete (envName, name) {
      this.confirmValue = ''
      this.deleteNetworkPolicyDialog = true
      this.deleteNetworkPolicyForm.envName = envName
      this.deleteNetworkPolicyForm.name = name
    },
    deleteNetworkPolicy () {
      const vm = this
      if(vm.$refs.deleteNetworkPolicyRef.validate()){
        if(vm.deleteNetworkPolicyForm.name == vm.confirmValue){
          request.post(`/admin/project/${vm.targetProjectName}/envNetworkPolicyDelete`, vm.deleteNetworkPolicyForm).then(response => {
            vm.deleteNetworkPolicyDialog = false
            vm.showLog(response)
            vm.successTip(true,response.msg)
            vm.refreshList()
          }).catch(error => {
            vm.errorTip(true, error.response.data.msg)
          })
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteNetworkPolicyForm.name))
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openAllotHost (envName) {
      this.addHostDialog = true
      this.addHostForm.envName = envName
      this.variableList = [['','']]
    },
    allotHost () {
      const vm = this
      if(vm.$refs.addHostRef.validate()){
        vm.variableList.forEach(function(i) {
          vm.addHostForm.variables[i[0]] = i[1];
        })
        request.post(`/admin/project/${vm.targetProjectName}/envHostAdd`, vm.addHostForm).then(response => {
          vm.addHostDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openHostCopy (envName, host) {
      this.addHostDialog = true
      this.addHostForm = { ...host }
      this.addHostForm.envName = envName
      this.variableList = Object.entries(host.variables)
    },
    openHostUpdate (envName,hostName) {
      const vm = this
      vm.updateHostDialog = true
      vm.updateHostForm.envName = envName
      vm.updateHostForm.hostName = hostName
      vm.project.projectAvailableEnvs.map(item => {
        if(item.envName == vm.updateHostForm.envName){
          item.hosts.map(i => {
            if(i.hostName == vm.updateHostForm.hostName){
              vm.updateHostForm = {
                envName: envName,
                hostName: i.hostName,
                hostAddr: i.hostAddr,
                hostPort: i.hostPort,
                hostUser: i.hostUser,
                hostPassword: i.hostPassword,
                hostBecome: i.hostBecome,
                hostBecomeUser: i.hostBecomeUser,
                hostBecomePassword: i.hostBecomePassword,
                groups: i.groups,
                variables: {}
              }
              vm.variableList = Object.entries(i.variables)
            }
          })
        }
      })
    },
    updateHost () {
      const vm = this
      if(vm.$refs.updateHostRef.validate()){
        vm.variableList.forEach(function(i) {
          vm.updateHostForm.variables[i[0]] = i[1];
        })
        request.post(`/admin/project/${vm.targetProjectName}/envHostUpdate`, vm.updateHostForm).then(response => {
          vm.updateHostDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openHostJoin (hostName, envName) {
      const vm = this
      vm.joinHostDialog = true
      vm.joinHostForm.hostName = hostName
      vm.project.projectAvailableEnvs.map(item => {
        if(item.envName == envName){
          item.hosts.map(i => {
            if(i.hostName == hostName){
              vm.variableList = Object.entries(i.variables)
              vm.joinHostForm.groups = i.groups
            }
          })
        }
      })
    },
    hostJoin () {
      const vm = this
      if(vm.$refs.hostJoinRef.validate()){
        vm.variableList.forEach(function(i) {
          vm.joinHostForm.variables[i[0]] = i[1];
        })
        request.post(`/admin/project/${vm.targetProjectName}/envHostJoin`, vm.joinHostForm).then(response => {
          vm.joinHostDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openHostLeave (envName,hostName) {
      this.confirmValue = ''
      this.leaveHostDialog = true
      this.leaveHostForm.envName = envName
      this.leaveHostForm.hostName = hostName
    },
    hostLeave () {
      const vm = this
      if(vm.$refs.hostLeaveRef.validate() && vm.leaveHostForm.hostName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envHostLeave`, vm.leaveHostForm).then(response => {
          vm.leaveHostDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.leaveHostForm.hostName))
      }
    },
    openHostDelete(envName,hostName) {
      this.confirmValue = ''
      this.deleteHostDialog = true
      this.deleteHostForm.envName = envName
      this.deleteHostForm.hostName = hostName
    },
    envHostDelete () {
      const vm = this
      if(vm.$refs.deleteHostRef.validate() && vm.deleteHostForm.hostName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envHostDelete`, vm.deleteHostForm).then(response => {
          vm.deleteHostDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteHostForm.hostName))
      }
    },
    openAllotDb (envName) {
      this.addDbDialog = true
      this.addDbForm.envName = envName
    },
    dbAdd () {
      const vm = this
      if(vm.$refs.addDbRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envDbAdd`, vm.addDbForm).then(response => {
          vm.addDbDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDbCopy (envName, database) {
      this.addDbDialog = true
      this.addDbForm = { ...database }
      this.addDbForm.envName = envName
    },
    openDbUpdate (envName, dbName) {
      const vm = this
      vm.updateDbDialog = true
      vm.updateDbForm.envName = envName
      vm.updateDbForm.dbName = dbName
      vm.project.projectAvailableEnvs.map(item => {
        if(item.envName == vm.updateDbForm.envName){
          item.databases.map(i => {
            if(i.dbName == vm.updateDbForm.dbName){
              vm.updateDbForm = {
                envName: envName,
                dbName: i.dbName,
                dbUrl: i.dbUrl,
                dbUser: i.dbUser,
                dbPassword: i.dbPassword
              }
            }
          })
        }
      })
    },
    updateDb () {
      const vm = this
      if(vm.$refs.updateDbRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envDbUpdate`, vm.updateDbForm).then(response => {
          vm.updateDbDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDbJoin (dbName) {
      this.joinDbDialog = true
      this.joinDbForm.dbName = dbName
    },
    dbJoin () {
      const vm = this
      if(vm.$refs.joinDbRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/envDbJoin`, vm.joinDbForm).then(response => {
          vm.joinDbDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openDbLeave (envName, dbName) {
      this.confirmValue = ''
      this.leaveDbDialog = true
      this.leaveDbForm.envName = envName
      this.leaveDbForm.dbName = dbName
    },
    dbLeave () {
      const vm = this
      if(vm.$refs.leaveDbRef.validate() && vm.leaveDbForm.dbName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envDbLeave`, vm.leaveDbForm).then(response => {
          vm.leaveDbDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.leaveDbForm.dbName))
      }
    },
    openDeleteDB (envName, dbName) {
      this.confirmValue = ''
      this.deleteDbDialog = true
      this.deleteDbForm.envName = envName
      this.deleteDbForm.dbName = dbName
    },
    deleteDb () {
      const vm = this
      if(vm.$refs.deleteDbRef.validate() && vm.deleteDbForm.dbName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envDbDelete`, vm.deleteDbForm).then(response => {
          vm.deleteDbDialog = false
          vm.successTip(true, response.msg)
          vm.refreshList()
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteDbForm.dbName))
      }
    },
    handleEnv (branchName, envName, isProductionEnv) {
      this.deletePipelineEnvDialog = true
      this.deletePipelineEnvForm.branchName = branchName
      this.deletePipelineEnvForm.envName = envName
      this.deletePipelineEnvForm.isProductionEnv = isProductionEnv
    },
    deletePipelineEnv () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/pipelineEnvDelete`, vm.deletePipelineEnvForm).then(response => {
        vm.deletePipelineEnvDialog = false
        vm.successTip(true,response.msg)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    onCopy() {
      this.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_success'))
    },
    onError() {
      this.errorTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed'))
    },
    doCopy(val) {
      const vm = this
      vm.$copyText(val).then(function (e) {
        vm.successTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_success'))
      }, function (e) {
        vm.errorTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_copy_failed'))
      })
    },
    openAddDebug (envName) {
      const vm = this
      vm.addComponentDebugDialog = true
      vm.targetEnvName = envName
      vm.actionType = 'add'
      request.get(`/admin/project/${vm.targetProjectName}/envComponentDebugDefault`).then(response => {
        vm.addComponentDebugForm = response.data.deploySpecDebug
        vm.addComponentDebugForm.arch = 'amd64'
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    previewDebugYaml() {
      const vm = this;
      if(vm.$refs.addDebugRef.validate()){
        vm.yamlText = YAML.stringify(vm.addComponentDebugForm, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog = true;
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    closeYaml() {
      const vm = this;
      vm.$refs.monaco.monacoEditor.setValue('')
      vm.YAMLDialog = false;
    },
    addDebug () {
      const vm = this
      if(vm.$refs.addDebugRef.validate()){
        var componentDebugYaml = YAML.stringify(vm.addComponentDebugForm, 4);
        request.post(`/admin/project/${vm.targetProjectName}/envComponentDebugUpdate`, {
          componentDebugYaml: componentDebugYaml,
          envName: vm.targetEnvName,
          arch: vm.addComponentDebugForm.arch,
        }).then(response => {
          vm.addComponentDebugDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    showYaml (content, title) {
      const vm = this
      var yaml = JSON.parse(JSON.stringify(content))
      if(title === vuetify.preset.lang.t('$vuetify.lang_view_component_def_yaml')){
        if (yaml.deploySessionAffinityTimeoutSeconds !== null && yaml.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete yaml.deploySessionAffinityTimeoutSeconds
        }
        Object.keys(yaml).forEach(item => {
          if(yaml[item] !== null){
            if(yaml[item] instanceof Array && yaml[item].length <= 0){
              delete yaml[item]
            }else if(yaml[item] instanceof Object && JSON.stringify(yaml[item]) == "{}"){
              delete yaml[item]
            }else if(yaml[item] === ''){
              delete yaml[item]
            }else if(yaml[item] instanceof Object){
              if(item === 'hpaConfig'){
                if (
                    yaml.hpaConfig.cpuAverageRequestPercent === 0 && 
                    yaml.hpaConfig.maxReplicas === 0 && 
                    yaml.hpaConfig.memoryAverageRequestPercent === 0 && 
                    yaml.hpaConfig.cpuAverageValue === '' && 
                    yaml.hpaConfig.memoryAverageValue === '' 
                  ) {
                  delete yaml.hpaConfig
                } else {
                  vm.sortData(yaml.hpaConfig)
                }
              } else if (item === 'deployResources'){
                if (
                  yaml.deployResources.cpuLimit === '' && 
                  yaml.deployResources.cpuRequest === '' && 
                  yaml.deployResources.memoryLimit === '' && 
                  yaml.deployResources.memoryRequest === '' &&
                  yaml.deployResources.extraRequest === null &&
                  yaml.deployResources.extraLimit === null
                ){
                  delete yaml.deployResources
                }else{
                  vm.sortData(yaml.deployResources)
                }
              }else if(item === 'deployHealthCheck'){
                if (
                  yaml.deployHealthCheck.checkPort === 0 && 
                  yaml.deployHealthCheck.livenessDelaySeconds === 0 && 
                  yaml.deployHealthCheck.livenessPeriodSeconds === 0 && 
                  yaml.deployHealthCheck.readinessDelaySeconds === 0 && 
                  yaml.deployHealthCheck.readinessPeriodSeconds === 0 && 
                  yaml.deployHealthCheck.httpGet.port === 0 && 
                  yaml.deployHealthCheck.httpGet.httpHeaders === null && 
                  yaml.deployHealthCheck.httpGet.path === ''
                ){
                  delete yaml.deployHealthCheck
                }else{
                  vm.sortData(yaml.deployHealthCheck.httpGet)
                  vm.sortData(yaml.deployHealthCheck)
                }
              }else if(item === 'securityContext'){
                if (
                  yaml.securityContext.runAsGroup === 0 && 
                  yaml.securityContext.runAsUser === 0
                ){
                  delete yaml.securityContext
                }else{
                  vm.sortData(yaml.securityContext)
                }
              }else if(item === 'deployVolumes'){
                if (yaml.deployVolumes && 
                  yaml.deployVolumes !== null && 
                  yaml.deployVolumes.length > 0
                ){
                  yaml.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }else if(item === 'deployLocalPorts'){
                if(
                  yaml.deployLocalPorts && 
                  yaml.deployLocalPorts !== null && 
                  yaml.deployLocalPorts.length > 0
                ){
                  yaml.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete yaml[item]
          }
        })
      }
      if(yaml instanceof Object){
        vm.defaultComponentDebugYaml = YAML.stringify(yaml, 4)
      }else{
        vm.defaultComponentDebugYaml = yaml
      }
      vm.$refs.monaco2.monacoEditor.setValue(vm.defaultComponentDebugYaml)
      vm.defaultDialogTitle = title
      vm.componentDebugYamlDialog = true
    },
    openUpdateDebug (envName) {
      const vm = this
      vm.addComponentDebugDialog = true
      vm.targetEnvName = envName
      vm.actionType = 'update'
      vm.project.projectAvailableEnvs.map(item => {
        if(item.envName === envName){
          vm.addComponentDebugForm = item.componentDebug.deploySpecDebug
          vm.addComponentDebugForm.arch = item.componentDebug.arch
        }
      })
    },
    openDeleteDebug (envName) {
      const vm = this
      vm.confirmValue = ''
      vm.deleteComponentDebugForm.envName = envName
      vm.deleteComponentDebugDialog = true
    },
    deleteDebug () {
      const vm = this
      if(vm.$refs.deleteDebugRef.validate && vm.deleteComponentDebugForm.envName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envComponentDebugDelete`, vm.deleteComponentDebugForm).then(response => {
          vm.deleteComponentDebugDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteComponentDebugForm.envName))
      }
    },
    getDefaultComponent () {
      const vm = this
      vm.dialogLoading = true
      request.get(`/admin/project/${vm.targetProjectName}/envComponentTemplates`).then(response => {
        var List = [ { text: vuetify.preset.lang.t('$vuetify.lang_form_new_component_template_default'), value: '' } ]
        Object.keys(response.data.deploySpecStatic).forEach(item => {
          if(response.data.deploySpecStatic[item] !== null){
            if(response.data.deploySpecStatic[item] instanceof Array && response.data.deploySpecStatic[item].length <= 0){
              response.data.deploySpecStatic[item] = null
            }else if(response.data.deploySpecStatic[item] instanceof Object && JSON.stringify(response.data.deploySpecStatic[item]) == "{}"){
              response.data.deploySpecStatic[item] = null
            }
          }
        })
        if (response.data.deploySpecStatic.deployEnvs !== null) {
          response.data.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
            row = row.split("=");
            response.data.deploySpecStatic.deployEnvs[rowIndex] = row;
          });
        }
        // if (response.data.deploySpecStatic.deployArgs !== null) {
        //   response.data.deploySpecStatic.deployArgs.forEach((row, rowIndex) => {
        //     row = row.split("=");
        //     response.data.deploySpecStatic.deployArgs[rowIndex] = row;
        //   });
        // }
        List[0].value = {
          deploySpecStatic: response.data.deploySpecStatic,
          componentTemplateDesc: '',
          componentTemplateName: vuetify.preset.lang.t('$vuetify.lang_form_new_component_template_default')
        }
        response.data.componentTemplates.map(item => {
          Object.keys(item.deploySpecStatic).forEach(i => {
            if(item.deploySpecStatic[i] !== null){
              if(item.deploySpecStatic[i] instanceof Array && item.deploySpecStatic[i].length <= 0){
                item.deploySpecStatic[i] = null
              }else if(item.deploySpecStatic[i] instanceof Object && JSON.stringify(item.deploySpecStatic[i]) == "{}"){
                item.deploySpecStatic[i] = null
              }
            }
          })
          if (item.deploySpecStatic.deployEnvs !== null) {
            item.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
              row = row.split("=");
              item.deploySpecStatic.deployEnvs[rowIndex] = row;
            });
          }
          // if (item.deploySpecStatic.deployArgs !== null) {
          //   item.deploySpecStatic.deployArgs.forEach((row, rowIndex) => {
          //     row = row.split("=");
          //     item.deploySpecStatic.deployArgs[rowIndex] = row;
          //   });
          // }
          var listItem = {
            text: '',
            value: ''
          }
          listItem.text = item.componentTemplateName
          listItem.value = item
          List.push(listItem)
        })
        vm.componentList = List
        vm.dialogLoading = false
        vm.addComponentForm = vm.componentList[0].value
        vm.addComponentDialog = true
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openAddComponent (envName) {
      const vm = this
      vm.componentOpts = []
      vm.hostAliasesDisable = false
      vm.hpaConfigDisable = false
      vm.securityContextDisable = false
      vm.patchesDisable = false
      vm.enableDownwardApiDisable = false
      vm.nodeNameDisable = false
      vm.nodeSelectorDisable = false
      vm.subdomainDisable = false

      vm.targetEnvName = envName
      vm.targetIndex = 'add'
      vm.project.projectAvailableEnvs.map((item) => {
        if (item.envName === envName) {
          if (item.disabledDefs !== null) {
            item.disabledDefs.forEach(disabledDef => {
              switch (disabledDef) {
                case 'hostAliases':
                  vm.hostAliasesDisable = true
                  break
                case 'hpaConfig':
                  vm.hpaConfigDisable = true
                  break
                case 'securityContext':
                  vm.securityContextDisable = true
                  break
                case 'patches':
                  vm.patchesDisable = true
                  break
                case 'enableDownwardApi':
                  vm.enableDownwardApiDisable = true
                  break
                case 'nodeName':
                  vm.nodeNameDisable = true
                  break
                case 'nodeSelector':
                  vm.nodeSelectorDisable = true
                  break
                case 'subdomain':
                  vm.subdomainDisable = true
                  break
              }
            })
          }
          if (vm.community) {
            vm.patchesDisable = true
          }

          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources'), value: 'deployResources' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other'), value: 'deployOther' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta'), value: 'deployMeta' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_ports'), value: 'deployPorts' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes'), value: 'deployVolumes' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check'), value: 'deployHealthCheck' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle'), value: 'lifecycle' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_depend_services'), value:'dependServices' })
          if (!vm.hpaConfigDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config'), value: 'hpaConfig' })
          }
          if (!vm.hostAliasesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases'), value: 'hostAliases' })
          }
          if (!vm.securityContextDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_security_context'), value: 'securityContext' })
          }
          if (!vm.patchesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_patches'), value: 'patches' })
          }
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings'), value: 'deployConfigSettings' })
          
          vm.nodeNames = item.nodeNames;
          vm.nodeLabels = item.nodeLabels;
          vm.pvs = item.pvs
          vm.pvcNames = []
          item.pvs.forEach(pv => {
            vm.pvcNames.push(pv.pvcName)
          })
        }
      })
      vm.nodePorts = []
      vm.project.projectNodePorts.map((item) => {
        if (item.envName === envName) {
          vm.nodePorts = item.nodePorts
        }
      })
      vm.getDefaultComponent()
    },
    previewComponent() {
      const vm = this;
      if (vm.$refs.addComponentRef.validate()) {
        var copyData = JSON.parse(JSON.stringify(vm.addComponentForm.deploySpecStatic))
        if (copyData.deploySessionAffinityTimeoutSeconds !== null && copyData.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete copyData.deploySessionAffinityTimeoutSeconds
        }
        if (copyData.deployEnvs !== null && copyData.deployEnvs.length > 0) {
          copyData.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(copyData).forEach(item => {
          if(copyData[item] !== null){
            if (copyData[item] instanceof Array && copyData[item].length <= 0) {
              delete copyData[item]
            } else if (copyData[item] instanceof Object && JSON.stringify(copyData[item]) == "{}") {
              delete copyData[item]
            } else if (copyData[item] === '') {
              delete copyData[item]
            } else if (copyData[item] instanceof Object) {
              if (item === 'hpaConfig'){
                if(
                  copyData.hpaConfig.cpuAverageRequestPercent === 0 && 
                  copyData.hpaConfig.maxReplicas === 0 && 
                  copyData.hpaConfig.memoryAverageRequestPercent === 0 && 
                  copyData.hpaConfig.cpuAverageValue === '' && 
                  copyData.hpaConfig.memoryAverageValue === '' )
                {
                  delete copyData.hpaConfig
                }else{
                  vm.sortData(copyData.hpaConfig)
                }
              } else if (item === 'deployResources') {
                if (
                    copyData.deployResources.cpuLimit === '' && 
                    copyData.deployResources.cpuRequest === '' && 
                    copyData.deployResources.memoryLimit === '' && 
                    copyData.deployResources.memoryRequest === '' && 
                    copyData.deployResources.extraRequest === null && 
                    copyData.deployResources.extraLimit === null
                  ) {
                  delete copyData.deployResources
                } else {
                  vm.sortData(copyData.deployResources)
                }
              } else if (item === 'deployHealthCheck') {
                if (
                    copyData.deployHealthCheck.livenessDelaySeconds === 0 && 
                    copyData.deployHealthCheck.livenessPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.readinessDelaySeconds === 0 && 
                    copyData.deployHealthCheck.readinessPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.startupDelaySeconds === 0 && 
                    copyData.deployHealthCheck.startupPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.checkPort === 0 && 
                    copyData.deployHealthCheck.exec === '' && 
                    copyData.deployHealthCheck.httpGet.port === 0 && 
                    copyData.deployHealthCheck.httpGet.httpHeaders === null && 
                    copyData.deployHealthCheck.httpGet.path === '' && 
                    copyData.deployHealthCheck.httpGet.scheme === ''
                  ) {
                  delete copyData.deployHealthCheck
                } else {
                  vm.sortData(copyData.deployHealthCheck.httpGet)
                  vm.sortData(copyData.deployHealthCheck)
                }
              } else if (item === 'lifecycle') {
                if (
                    copyData.lifecycle.postStart.exec === '' && 
                    copyData.lifecycle.postStart.httpGet.port === 0 && 
                    copyData.lifecycle.postStart.httpGet.httpHeaders === null && 
                    copyData.lifecycle.postStart.httpGet.path === '' && 
                    copyData.lifecycle.postStart.httpGet.scheme === '' &&
                    copyData.lifecycle.preStop.exec === '' && 
                    copyData.lifecycle.preStop.httpGet.port === 0 && 
                    copyData.lifecycle.preStop.httpGet.httpHeaders === null && 
                    copyData.lifecycle.preStop.httpGet.path === '' && 
                    copyData.lifecycle.preStop.httpGet.scheme === ''
                  ) {
                  delete copyData.lifecycle
                } else {
                  vm.sortData(copyData.lifecycle.postStart.httpGet)
                  vm.sortData(copyData.lifecycle.postStart)
                  vm.sortData(copyData.lifecycle.preStop.httpGet)
                  vm.sortData(copyData.lifecycle.preStop)
                }
              } else if (item === 'securityContext') {
                if (
                    copyData.securityContext.runAsGroup === 0 && 
                    copyData.securityContext.runAsUser === 0
                  ) {
                  delete copyData.securityContext
                } else {
                  vm.sortData(copyData.securityContext)
                }
              } else if (item === 'deployVolumes') {
                if (
                    copyData.deployVolumes && 
                    copyData.deployVolumes !== null && 
                    copyData.deployVolumes.length > 0
                  ) {
                  copyData.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployLocalPorts') {
                if (
                    copyData.deployLocalPorts && 
                    copyData.deployLocalPorts !== null && 
                    copyData.deployLocalPorts.length > 0
                  ) {
                  copyData.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployNodePorts') {
                if (
                    copyData.deployNodePorts && 
                    copyData.deployNodePorts !== null && 
                    copyData.deployNodePorts.length > 0
                  ) {
                  copyData.deployNodePorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete copyData[item]
          }
        })
        vm.yamlText = YAML.stringify(copyData, 4);
        vm.$refs.monaco.monacoEditor.setValue(vm.yamlText)
        vm.YAMLDialog = true;
      } else {
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    clearParams(name) {
      const vm = this;
      if(name === "deployOther") {
        vm.addComponentForm.deploySpecStatic.deployCommand = '';
        vm.addComponentForm.deploySpecStatic.deployEnvs = null;
        vm.addComponentForm.deploySpecStatic.deployArgs = null;
        vm.addComponentForm.deploySpecStatic.workingDir = '';
        vm.addComponentForm.deploySpecStatic.nodeSelector = null;
        vm.addComponentForm.deploySpecStatic.nodeName = '';
        vm.addComponentForm.deploySpecStatic.terminationGracePeriodSeconds = 0;
        vm.addComponentForm.deploySpecStatic.subdomain = '';
        vm.addComponentForm.deploySpecStatic.enableDownwardApi = false;
        vm.addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds = 0;
        vm.addComponentForm.deploySpecStatic.deployHeadless = false;
        vm.addComponentForm.deploySpecStatic.podManagementPolicy = '';
      } else if (name === "deployMeta") {
        vm.addComponentForm.deploySpecStatic.deployMeta = {
          labels: null,
          annotations: null,
        };
      } else if (name === "patches") {
        vm.addComponentForm.deploySpecStatic.patches = null;
      } else if (name === "securityContext") {
        vm.addComponentForm.deploySpecStatic.securityContext = {
          runAsUser: 0,
          runAsGroup: 0,
        };
      } else if(name === "deployHealthCheck") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck = {
          checkPort: 0,
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
          livenessDelaySeconds: 0,
          livenessPeriodSeconds: 0,
          readinessDelaySeconds: 0,
          readinessPeriodSeconds: 0,
          startupDelaySeconds: 0,
          startupPeriodSeconds: 0,
        };
      } else if(name === "lifecycle") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop = {
          exec: '',
          httpGet: {
            httpHeaders: null,
            path: "",
            port: 0,
            scheme: '',
          },
        };
      } else if (name === "hpaConfig") {
        vm.addComponentForm.deploySpecStatic.hpaConfig = {
          cpuAverageRequestPercent: 0,
          maxReplicas: 0,
          memoryAverageRequestPercent: 0,
          cpuAverageValue: "",
          memoryAverageValue: "",
        };
      } else if (name === 'deployResources') {
        vm.addComponentForm.deploySpecStatic.deployResources = {
          cpuLimit: '',
          cpuRequest: '',
          memoryLimit: '',
          memoryRequest: ''
        };
      } else if (name === 'deployPorts') {
        vm.addComponentForm.deploySpecStatic.deployNodePorts = null
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = null
      } else if (name === 'deployConfigSettings') {
        vm.addComponentForm.deploySpecStatic.deployConfigSettings = null
        vm.addComponentForm.deploySpecStatic.deployConfigBranch = ''
      } else {
        vm.addComponentForm.deploySpecStatic[name] = null;
      }
    },
    chooseParams(e) {
      const vm = this;
      if (e === "deployOther") {
        if (
          vm.addComponentForm.deploySpecStatic.deployCommand === '' &&
          vm.addComponentForm.deploySpecStatic.deployEnvs === null &&
          vm.addComponentForm.deploySpecStatic.deployArgs === null &&
          vm.addComponentForm.deploySpecStatic.workingDir === '' &&
          vm.addComponentForm.deploySpecStatic.nodeSelector === null &&
          vm.addComponentForm.deploySpecStatic.nodeName === '' &&
          vm.addComponentForm.deploySpecStatic.terminationGracePeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.subdomain === '' &&
          vm.addComponentForm.deploySpecStatic.enableDownwardApi === false &&
          vm.addComponentForm.deploySpecStatic.deploySessionAffinityTimeoutSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHeadless === false &&
          vm.addComponentForm.deploySpecStatic.podManagementPolicy === ''
        ) {
          vm.addComponentForm.deploySpecStatic.deployEnvs = [["", ""]];
        }
      } else if (e === "deployMeta") {
        if (
          vm.addComponentForm.deploySpecStatic.deployMeta.labels === null &&
          vm.addComponentForm.deploySpecStatic.deployMeta.annotations === null
        ) {
          vm.addComponentForm.deploySpecStatic.deployMeta.labels = [{name: '', value: ''}];
          vm.addComponentForm.deploySpecStatic.deployMeta.annotations = [{name: '', value: ''}];
        }
      } else if (e === "patches") {
        if (
          vm.addComponentForm.deploySpecStatic.patches === null
        ) {
          vm.addComponentForm.deploySpecStatic.patches = [{resourceKind: '', path: '', content: ''}];
        }
      } else if (e === "deployLocalPorts" || e === "deployNodePorts") {
        if (
          vm.addComponentForm.deploySpecStatic.deployNodePorts === null &&
          vm.addComponentForm.deploySpecStatic.deployLocalPorts === null
        ) {
          vm.addComponentForm.deploySpecStatic[e] = [];
        } else {
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_conflict'));
        }
      } else if (e === "securityContext") {
        if (
          vm.addComponentForm.deploySpecStatic.securityContext.runAsUser == 0 &&
          vm.addComponentForm.deploySpecStatic.securityContext.runAsGroup == 0
        ) {
          vm.addComponentForm.deploySpecStatic.securityContext = {
            runAsUser: 1000,
            runAsGroup: 0,
          };
        }
      } else if (e === "deployHealthCheck") {
        if (
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port === 0 &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.path === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.scheme === "" &&
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders === null
        ) {
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessDelaySeconds = 15;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.readinessPeriodSeconds = 5;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessDelaySeconds = 60;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.livenessPeriodSeconds = 30;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupDelaySeconds = 0;
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.startupPeriodSeconds = 0;
        }
      } else if (e === "lifecycle") {
        if (
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec === '' && 
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port === 0 && 
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders === null && 
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.path === '' && 
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.scheme === '' &&
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec === '' && 
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port === 0 && 
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders === null && 
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.path === '' && 
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.scheme === ''
        ) {
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = "cat /etc/hosts";
        }
      } else if (e === "hpaConfig") {
        if (
          vm.addComponentForm.deploySpecStatic.hpaConfig.cpuAverageRequestPercent === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.maxReplicas === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.memoryAverageRequestPercent === 0 ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.cpuAverageValue === "" ||
          vm.addComponentForm.deploySpecStatic.hpaConfig.memoryAverageValue === ""
        ) {
          vm.addComponentForm.deploySpecStatic.hpaConfig.maxReplicas = 1;
        }
      } else if (e === "deployResources") {
        if (
          vm.addComponentForm.deploySpecStatic.deployResources.cpuLimit === '' && 
          vm.addComponentForm.deploySpecStatic.deployResources.cpuRequest === '' && 
          vm.addComponentForm.deploySpecStatic.deployResources.memoryLimit === '' && 
          vm.addComponentForm.deploySpecStatic.deployResources.memoryRequest === '' &&
          vm.addComponentForm.deploySpecStatic.deployResources.extraRequest === null &&
          vm.addComponentForm.deploySpecStatic.deployResources.extraLimit === null
        ) {
          vm.addComponentForm.deploySpecStatic.deployResources = {
            memoryRequest: "10Mi",
            memoryLimit: "100Mi",
            cpuRequest: "10m",
            cpuLimit: "100m",
          };
        }
      } else if(e === 'deployPorts') {
        if (
            vm.addComponentForm.deploySpecStatic.deployNodePorts === null && 
            vm.addComponentForm.deploySpecStatic.deployLocalPorts === null
          ) {
          vm.addComponentForm.deploySpecStatic.deployNodePorts = []
        }
      } else {
        if (vm.addComponentForm.deploySpecStatic[e] === null) {
          if (
            e === "deployVolumes" ||
            e === "dependServices" ||
            e === "hostAliases" ||
            e === "deployConfigSettings"
          ) {
            vm.addComponentForm.deploySpecStatic[e] = [];
          } else {
            vm.addComponentForm.deploySpecStatic[e] = {};
          }
        }
      }
      vm.timer = setTimeout(() => {
        document.querySelector("#" + e + '-' + vm.targetIndex).scrollIntoView(true);
      }, 500);
    },
    healthCheckChange(e) {
      const vm = this;
      if (e === "checkPort") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 8080
      } else if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = "cat /etc/hosts"
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      } else {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec = ""
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort = 0
      }
    },
    healthCheckInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.checkPort !== 0) {
        return 'checkPort'
      } else if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''      
    },
    lifecyclePostStartChange(e) {
      const vm = this;
      if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = ""
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec = ""
      }
    },
    lifecyclePostStartInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''      
    },
    lifecyclePreStopChange(e) {
      const vm = this;
      if (e === "exec") {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = "cat /etc/hosts"
      } else if (e === "httpGet") {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 8080,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = ""
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet = {
          port: 0,
          path: "",
          scheme: "",
          httpHeaders: null
        }
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec = ""
      }
    },
    lifecyclePreStopInit() {
      const vm = this
      if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.exec !== '') {
        return 'exec'
      } else if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.port !== 0) {
        return 'httpGet'
      }
      return ''      
    },
    changePortSet(e) {
      const vm = this;
      if(e === 'deployNodePorts'){
        vm.addComponentForm.deploySpecStatic.deployNodePorts = []
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = null
      }else{
        vm.addComponentForm.deploySpecStatic.deployNodePorts = null
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = []
      }
    },
    addDeployEnvs() {
      const vm = this;
      let addItem = ["", ""];
      if (vm.addComponentForm.deploySpecStatic.deployEnvs === null) {
        vm.addComponentForm.deploySpecStatic.deployEnvs = [];
        vm.addComponentForm.deploySpecStatic.deployEnvs.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployEnvs.push(addItem);
      }
    },
    addDeployMetaLabels() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.addComponentForm.deploySpecStatic.deployMeta.labels === null) {
        vm.addComponentForm.deploySpecStatic.deployMeta.labels = [];
        vm.addComponentForm.deploySpecStatic.deployMeta.labels.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployMeta.labels.push(addItem);
      }
    },
    addDeployMetaAnnotations() {
      const vm = this;
      let addItem = {
        name: '',
        value: '',
      };
      if (vm.addComponentForm.deploySpecStatic.deployMeta.annotations === null) {
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations = [];
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployMeta.annotations.push(addItem);
      }
    },
    addPatches() {
      const vm = this;
      let addItem = {
        resourceKind: '',
        path: '',
        content: '',
      };
      if (vm.addComponentForm.deploySpecStatic.patches === null) {
        vm.addComponentForm.deploySpecStatic.patches = [];
        vm.addComponentForm.deploySpecStatic.patches.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.patches.push(addItem);
      }
    },
    addDeployLocalPort() {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "TCP",
        ingress: {
          domainName: "",
          pathPrefix: "",
          certSelfSigned: false,
          certBranch: "",
          certPath: "",
        },
      };
      if (vm.addComponentForm.deploySpecStatic.deployLocalPorts === null) {
        vm.addComponentForm.deploySpecStatic.deployLocalPorts = [];
        vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(addItem);
      }
    },
    copyDeployLocalPort(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployLocalPorts[j])
      );
      vm.addComponentForm.deploySpecStatic.deployLocalPorts.push(copyItem);
    },
    deleteDeployLocalPort(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployLocalPorts.splice(j, 1);
    },
    deleteDeployEnvs(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployEnvs.splice(j, 1);
    },
    deleteDeployMetaLabels(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployMeta.labels.splice(j, 1);
    },
    deleteDeployMetaAnnotations(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployMeta.annotations.splice(j, 1);
    },
    deletePatches(i) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.patches.splice(i, 1);
    },
    addDeployNodePort() {
      const vm = this;
      let addItem = {
        port: null,
        protocol: "TCP",
        nodePort: null,
      };
      if (vm.addComponentForm.deploySpecStatic.deployNodePorts === null) {
        vm.addComponentForm.deploySpecStatic.deployNodePorts = [];
        vm.addComponentForm.deploySpecStatic.deployNodePorts.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployNodePorts.push(addItem);
      }
    },
    copyDeployNodePort(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployNodePorts[j])
      );
      vm.addComponentForm.deploySpecStatic.deployNodePorts.push(copyItem);
    },
    deleteDeployNodePort(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployNodePorts.splice(j, 1);
    },
    addDeployVolumes() {
      const vm = this;
      let addItem = {
        pathInPod: "",
        pathInPv: "",
        pvc: "",
      };
      if (vm.addComponentForm.deploySpecStatic.deployVolumes === null) {
        vm.addComponentForm.deploySpecStatic.deployVolumes = [];
        vm.addComponentForm.deploySpecStatic.deployVolumes.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployVolumes.push(addItem);
      }
    },
    copyDeployVolumes(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployVolumes[j])
      );
      vm.addComponentForm.deploySpecStatic.deployVolumes.push(copyItem);
    },
    deleteDeployVolumes(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployVolumes.splice(j, 1);
    },
    addHealthCheckHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(addItem);
      }
    },
    copyHealthCheckHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.push(copyItem);
    },
    deleteHealthCheckHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployHealthCheck.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePostStartHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePostStartHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePostStartHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.lifecycle.postStart.httpGet.httpHeaders.splice(j,1);
    },
    addLifecyclePreStopHttpHeaders() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      };
      if (vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders === null) {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders = [];
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(addItem);
      }
    },
    copyLifecyclePreStopHttpHeaders(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(
          vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders[j]
        )
      );
      vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.push(copyItem);
    },
    deleteLifecyclePreStopHttpHeaders(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.lifecycle.preStop.httpGet.httpHeaders.splice(j,1);
    },
    addDependServices() {
      const vm = this;
      let addItem = {
        dependName: "",
        dependPort: null,
        dependType: "",
        httpGetUrl: "",
      };
      if (vm.addComponentForm.deploySpecStatic.dependServices === null) {
        vm.addComponentForm.deploySpecStatic.dependServices = [];
        vm.addComponentForm.deploySpecStatic.dependServices.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.dependServices.push(addItem);
      }
    },
    copyDependServices(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.dependServices[j])
      );
      vm.addComponentForm.deploySpecStatic.dependServices.push(copyItem);
    },
    deleteDependServices(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.dependServices.splice(j, 1);
    },
    addHostAliases() {
      const vm = this;
      let addItem = {
        ip: "",
        hostnames: [],
      };
      if (vm.addComponentForm.deploySpecStatic.hostAliases === null) {
        vm.addComponentForm.deploySpecStatic.hostAliases = [];
        vm.addComponentForm.deploySpecStatic.hostAliases.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.hostAliases.push(addItem);
      }
    },
    copyHostAliases(j) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.hostAliases[j])
      );
      vm.addComponentForm.deploySpecStatic.hostAliases.push(copyItem);
    },
    deleteHostAliases(j) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.hostAliases.splice(j, 1);
    },
    addDeployConfigSettings() {
      const vm = this;
      let addItem = {
        localPath: '',
        pvcName: '',
        podPath: '',
      };
      if (vm.addComponentForm.deploySpecStatic.deployConfigSettings === null) {
        vm.addComponentForm.deploySpecStatic.deployConfigSettings = [];
        vm.addComponentForm.deploySpecStatic.deployConfigSettings.push(addItem);
      } else {
        vm.addComponentForm.deploySpecStatic.deployConfigSettings.push(addItem);
      }
    },
    copyDeployConfigSettings(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.deployConfigSettings[i])
      );
      vm.addComponentForm.deploySpecStatic.deployConfigSettings.push(copyItem);
    },
    copyPatches(i) {
      const vm = this;
      let copyItem = JSON.parse(
        JSON.stringify(vm.addComponentForm.deploySpecStatic.patches[i])
      );
      vm.addComponentForm.deploySpecStatic.patches.push(copyItem);
    },
    deleteDeployConfigSettings(i) {
      const vm = this;
      vm.addComponentForm.deploySpecStatic.deployConfigSettings.splice(i, 1);
    },
    addComponent () {
      const vm = this
      if(vm.$refs.addComponentRef.validate()){
        var copyData = JSON.parse(JSON.stringify(vm.addComponentForm.deploySpecStatic))
        var componentDesc = JSON.parse(JSON.stringify(vm.addComponentForm.componentTemplateDesc))
        if (copyData.deploySessionAffinityTimeoutSeconds !== null && copyData.deploySessionAffinityTimeoutSeconds !== 0) {
        }else{
          delete copyData.deploySessionAffinityTimeoutSeconds
        }
        if (copyData.deployEnvs !== null && copyData.deployEnvs.length > 0) {
          copyData.deployEnvs.map((row, rowIndex) => {
            row = row.join("=");
            copyData.deployEnvs[rowIndex] = row;
          });
        }
        Object.keys(copyData).forEach(item => {
          if(copyData[item] !== null){
            if(copyData[item] instanceof Array && copyData[item].length <= 0){
              delete copyData[item]
            }else if(copyData[item] instanceof Object && JSON.stringify(copyData[item]) == "{}"){
              delete copyData[item]
            }else if(copyData[item] === ''){
              delete copyData[item]
            }else if(copyData[item] instanceof Object){
              if (item === 'hpaConfig'){
                if(
                  copyData.hpaConfig.cpuAverageRequestPercent === 0 && 
                  copyData.hpaConfig.maxReplicas === 0 && 
                  copyData.hpaConfig.memoryAverageRequestPercent === 0 && 
                  copyData.hpaConfig.cpuAverageValue === '' && 
                  copyData.hpaConfig.memoryAverageValue === '' )
                {
                  delete copyData.hpaConfig
                }else{
                  vm.sortData(copyData.hpaConfig)
                }
              } else if(item === 'deployResources'){
                if (
                    copyData.deployResources.cpuLimit === '' && 
                    copyData.deployResources.cpuRequest === '' && 
                    copyData.deployResources.memoryLimit === '' && 
                    copyData.deployResources.memoryRequest === '' &&
                    copyData.deployResources.extraRequest === null &&
                    copyData.deployResources.extraLimit === null
                  ) {
                  delete copyData.deployResources
                } else {
                  vm.sortData(copyData.deployResources)
                }
              } else if (item === 'deployHealthCheck') {
                if (
                    copyData.deployHealthCheck.livenessDelaySeconds === 0 && 
                    copyData.deployHealthCheck.livenessPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.readinessDelaySeconds === 0 && 
                    copyData.deployHealthCheck.readinessPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.startupDelaySeconds === 0 && 
                    copyData.deployHealthCheck.startupPeriodSeconds === 0 && 
                    copyData.deployHealthCheck.checkPort === 0 && 
                    copyData.deployHealthCheck.exec === '' && 
                    copyData.deployHealthCheck.httpGet.port === 0 && 
                    copyData.deployHealthCheck.httpGet.httpHeaders === null && 
                    copyData.deployHealthCheck.httpGet.path === '' && 
                    copyData.deployHealthCheck.httpGet.scheme === ''
                  ) {
                  delete copyData.deployHealthCheck
                } else {
                  vm.sortData(copyData.deployHealthCheck.httpGet)
                  vm.sortData(copyData.deployHealthCheck)
                }
              } else if (item === 'lifecycle') {
                if (
                    copyData.lifecycle.postStart.exec === '' && 
                    copyData.lifecycle.postStart.httpGet.port === 0 && 
                    copyData.lifecycle.postStart.httpGet.httpHeaders === null && 
                    copyData.lifecycle.postStart.httpGet.path === '' && 
                    copyData.lifecycle.postStart.httpGet.scheme === '' &&
                    copyData.lifecycle.preStop.exec === '' && 
                    copyData.lifecycle.preStop.httpGet.port === 0 && 
                    copyData.lifecycle.preStop.httpGet.httpHeaders === null && 
                    copyData.lifecycle.preStop.httpGet.path === '' && 
                    copyData.lifecycle.preStop.httpGet.scheme === ''
                  ) {
                  delete copyData.lifecycle
                } else {
                  vm.sortData(copyData.lifecycle.postStart.httpGet)
                  vm.sortData(copyData.lifecycle.postStart)
                  vm.sortData(copyData.lifecycle.preStop.httpGet)
                  vm.sortData(copyData.lifecycle.preStop)
                }
              } else if (item === 'securityContext') {
                if (
                    copyData.securityContext.runAsGroup === 0 && 
                    copyData.securityContext.runAsUser === 0
                  ) {
                  delete copyData.securityContext
                } else {
                  vm.sortData(copyData.securityContext)
                }
              } else if (item === 'deployVolumes') {
                if (
                    copyData.deployVolumes && 
                    copyData.deployVolumes !== null && 
                    copyData.deployVolumes.length > 0
                  ) {
                  copyData.deployVolumes.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployLocalPorts') {
                if (
                    copyData.deployLocalPorts && 
                    copyData.deployLocalPorts !== null && 
                    copyData.deployLocalPorts.length > 0
                  ) {
                  copyData.deployLocalPorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              } else if (item === 'deployNodePorts') {
                if (
                    copyData.deployNodePorts && 
                    copyData.deployNodePorts !== null && 
                    copyData.deployNodePorts.length > 0
                  ) {
                  copyData.deployNodePorts.forEach(row => {
                    vm.sortData(row)
                  })
                }
              }
            }
          }else{
            delete copyData[item]
          }
        })
        var componentYaml = YAML.stringify(copyData, 4);
        request.post(`/admin/project/${vm.targetProjectName}/envComponentUpdate`, {
          envName: vm.targetEnvName,
          arch: vm.addComponentForm.arch,
          componentDesc: componentDesc,
          componentYaml: componentYaml
        }).then(response => {
          vm.addComponentDialog = false
          vm.updateComponentDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCopyComponent (envName, component) {
      const vm = this
      vm.componentOpts = []
      vm.hostAliasesDisable = false
      vm.hpaConfigDisable = false
      vm.securityContextDisable = false
      vm.patchesDisable = false
      vm.enableDownwardApiDisable = false
      vm.nodeNameDisable = false
      vm.nodeSelectorDisable = false
      vm.subdomainDisable = false

      vm.targetEnvName = envName
      vm.targetIndex = 'add'
      vm.project.projectAvailableEnvs.map((item) => {
        if (item.envName === envName) {
          if (item.disabledDefs !== null) {
            item.disabledDefs.forEach(disabledDef => {
              switch (disabledDef) {
                case 'hostAliases':
                  vm.hostAliasesDisable = true
                  break
                case 'hpaConfig':
                  vm.hpaConfigDisable = true
                  break
                case 'securityContext':
                  vm.securityContextDisable = true
                  break
                case 'patches':
                  vm.patchesDisable = true
                  break
                case 'enableDownwardApi':
                  vm.enableDownwardApiDisable = true
                  break
                case 'nodeName':
                  vm.nodeNameDisable = true
                  break
                case 'nodeSelector':
                  vm.nodeSelectorDisable = true
                  break
                case 'subdomain':
                  vm.subdomainDisable = true
                  break
              }
            })
          }
          if (vm.community) {
            vm.patchesDisable = true
          }

          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources'), value: 'deployResources' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other'), value: 'deployOther' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta'), value: 'deployMeta' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_ports'), value: 'deployPorts' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes'), value: 'deployVolumes' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check'), value: 'deployHealthCheck' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle'), value: 'lifecycle' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_depend_services'), value:'dependServices' })
          if (!vm.hpaConfigDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config'), value: 'hpaConfig' })
          }
          if (!vm.hostAliasesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases'), value: 'hostAliases' })
          }
          if (!vm.securityContextDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_security_context'), value: 'securityContext' })
          }
          if (!vm.patchesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_patches'), value: 'patches' })
          }
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings'), value: 'deployConfigSettings' })
          
          vm.nodeNames = item.nodeNames;
          vm.nodeLabels = item.nodeLabels;
          vm.pvs = item.pvs
          vm.pvcNames = []
          item.pvs.forEach(pv => {
            vm.pvcNames.push(pv.pvcName)
          })
        }
      })
      vm.nodePorts = []
      vm.project.projectNodePorts.map((item) => {
        if (item.envName === envName) {
          vm.nodePorts = item.nodePorts
        }
      })
      vm.addComponentDialog = true
      vm.addComponentForm.arch = component.arch
      vm.addComponentForm.componentTemplateDesc = component.componentDesc
      vm.addComponentForm.deploySpecStatic = { ...component.deploySpecStatic }
      if (vm.addComponentForm.deploySpecStatic.deployEnvs !== null) {
        vm.addComponentForm.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
          row = row.split("=");
          vm.addComponentForm.deploySpecStatic.deployEnvs[rowIndex] = row;
        });
      }
      vm.dialogLoading = false
    },
    openUpdateComponent (envName, componentName) {
      const vm = this
      vm.componentOpts = []
      vm.hostAliasesDisable = false
      vm.hpaConfigDisable = false
      vm.securityContextDisable = false
      vm.patchesDisable = false
      vm.enableDownwardApiDisable = false
      vm.nodeNameDisable = false
      vm.nodeSelectorDisable = false
      vm.subdomainDisable = false

      vm.dialogLoading = true
      vm.targetEnvName = envName
      vm.targetIndex = envName+componentName
      vm.updateComponentDialog = true
      vm.addComponentForm.componentTemplateDesc = ''
      vm.addComponentForm.deploySpecStatic = {}
      vm.project.projectAvailableEnvs.map((item) => {
        if (item.envName === envName) {
          if (item.disabledDefs !== null) {
            item.disabledDefs.forEach(disabledDef => {
              switch (disabledDef) {
                case 'hostAliases':
                  vm.hostAliasesDisable = true
                  break
                case 'hpaConfig':
                  vm.hpaConfigDisable = true
                  break
                case 'securityContext':
                  vm.securityContextDisable = true
                  break
                case 'patches':
                  vm.patchesDisable = true
                  break
                case 'enableDownwardApi':
                  vm.enableDownwardApiDisable = true
                  break
                case 'nodeName':
                  vm.nodeNameDisable = true
                  break
                case 'nodeSelector':
                  vm.nodeSelectorDisable = true
                  break
                case 'subdomain':
                  vm.subdomainDisable = true
                  break
              }
            })
          }
          if (vm.community) {
            vm.patchesDisable = true
          }

          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_resources'), value: 'deployResources' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_other'), value: 'deployOther' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_meta'), value: 'deployMeta' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_ports'), value: 'deployPorts' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_volumes'), value: 'deployVolumes' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_health_check'), value: 'deployHealthCheck' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_lifecycle'), value: 'lifecycle' })
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_depend_services'), value:'dependServices' })
          if (!vm.hpaConfigDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_hpa_config'), value: 'hpaConfig' })
          }
          if (!vm.hostAliasesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_host_aliases'), value: 'hostAliases' })
          }
          if (!vm.securityContextDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_security_context'), value: 'securityContext' })
          }
          if (!vm.patchesDisable) {
            vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_patches'), value: 'patches' })
          }
          vm.componentOpts.push({ text: vuetify.preset.lang.t('$vuetify.lang_form_deploy_container_def_deploy_config_settings'), value: 'deployConfigSettings' })
          
          vm.nodeNames = item.nodeNames;
          vm.nodeLabels = item.nodeLabels;
          vm.pvs = item.pvs
          vm.pvcNames = []
          item.pvs.forEach(pv => {
            vm.pvcNames.push(pv.pvcName)
          })
          item.components.forEach(i => {
            if(i.componentName == componentName){
              vm.addComponentForm.componentTemplateDesc = i.componentDesc
              vm.addComponentForm.arch = i.arch
              vm.addComponentForm.deploySpecStatic = i.deploySpecStatic
            }
          })
        }
      })
      vm.nodePorts = []
      vm.project.projectNodePorts.map((item) => {
        if (item.envName === envName) {
          vm.nodePorts = item.nodePorts
        }
      })
      vm.dialogLoading = false
      Object.keys(vm.addComponentForm.deploySpecStatic).forEach(i => {
        if(vm.addComponentForm.deploySpecStatic[i] !== null){
          if(vm.addComponentForm.deploySpecStatic[i] instanceof Array && vm.addComponentForm.deploySpecStatic[i].length <= 0){
            vm.addComponentForm.deploySpecStatic[i] = null
          }else if(vm.addComponentForm.deploySpecStatic[i] instanceof Object && JSON.stringify(vm.addComponentForm.deploySpecStatic[i]) == "{}"){
            vm.addComponentForm.deploySpecStatic[i] = null
          }
        }
      })
      if (vm.addComponentForm.deploySpecStatic.deployEnvs !== null) {
        vm.addComponentForm.deploySpecStatic.deployEnvs.forEach((row, rowIndex) => {
          row = row.split("=");
          vm.addComponentForm.deploySpecStatic.deployEnvs[rowIndex] = row;
        });
      }
      if (vm.addComponentForm.deploySpecStatic.nodeSelector !== null) {
        vm.addComponentForm.deploySpecStatic.nodeSelector.forEach((row, rowIndex) => {
          row.text = row.name+"="+row.value;
          vm.addComponentForm.deploySpecStatic.nodeSelector[rowIndex] = row;
        });
      }
    },
    openDeleteComponent (envName, componentName) {
      const vm = this
      vm.confirmValue = ''
      vm.deleteComponentForm.envName = envName
      vm.deleteComponentForm.componentName = componentName
      vm.deleteComponentDialog = true
    },
    deleteComponent () {
      const vm = this
      if(vm.$refs.deleteComponentRef.validate() && vm.deleteComponentForm.componentName == vm.confirmValue){
        request.post(`/admin/project/${vm.targetProjectName}/envComponentDelete`, vm.deleteComponentForm).then(response => {
          vm.deleteComponentDialog = false
          vm.successTip(true,response.msg)
          vm.showLog(response)
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_form_input_value_to_confirm', vm.deleteComponentForm.componentName))
      }
    },
    addInputBox () {
      const vm = this
      vm.variableList.push([ '', '' ])
    },
    deleteInputBox (index) {
      const vm = this
      vm.variableList.splice(index,1)
    },
    projectChange (projectName) {
      const vm = this
      vm.joinDbForm.envName = ''
      vm.joinHostForm.envName = ''
      vm.projectEnvList.forEach(item => {
        if(projectName == item.value){
          vm.projectEnvListChildren = item.children
        }
      })
    },
    addWebhookHeadersAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addTriggerForm.webhookHeaders === null) {
        vm.addTriggerForm.webhookHeaders = []
      }
      vm.addTriggerForm.webhookHeaders.push(addItem)
    },
    deleteWebhookHeadersAddForm(j) {
      const vm = this;
      vm.addTriggerForm.webhookHeaders.splice(j)
    },
    addWebhookQueryParamsAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addTriggerForm.webhookQueryParams === null) {
        vm.addTriggerForm.webhookQueryParams = []
      }
      vm.addTriggerForm.webhookQueryParams.push(addItem)
    },
    deleteWebhookQueryParamsAddForm(j) {
      const vm = this;
      vm.addTriggerForm.webhookQueryParams.splice(j)
    },
    addWebhookFormsAddForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.addTriggerForm.webhookForms === null) {
        vm.addTriggerForm.webhookForms = []
      }
      vm.addTriggerForm.webhookForms.push(addItem)
    },
    deleteWebhookFormsAddForm(j) {
      const vm = this;
      vm.addTriggerForm.webhookForms.splice(j)
    },
    addWebhookHeadersUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateTriggerForm.webhookHeaders === null) {
        vm.updateTriggerForm.webhookHeaders = []
      }
      vm.updateTriggerForm.webhookHeaders.push(addItem)
    },
    deleteWebhookHeadersUpdateForm(j) {
      const vm = this;
      vm.updateTriggerForm.webhookHeaders.splice(j)
    },
    addWebhookQueryParamsUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateTriggerForm.webhookQueryParams === null) {
        vm.updateTriggerForm.webhookQueryParams = []
      }
      vm.updateTriggerForm.webhookQueryParams.push(addItem)
    },
    deleteWebhookQueryParamsUpdateForm(j) {
      const vm = this;
      vm.updateTriggerForm.webhookQueryParams.splice(j)
    },
    addWebhookFormsUpdateForm() {
      const vm = this;
      let addItem = {
        name: "",
        value: "",
      }
      if (vm.updateTriggerForm.webhookForms === null) {
        vm.updateTriggerForm.webhookForms = []
      }
      vm.updateTriggerForm.webhookForms.push(addItem)
    },
    deleteWebhookFormsUpdateForm(j) {
      const vm = this;
      vm.updateTriggerForm.webhookForms.splice(j)
    },
    openTriggerAdd (branchName) {
      const vm = this
      vm.addTriggerDialog = true
      vm.addTriggerForm.branchName = branchName
      vm.addTriggerForm.enable = false
      vm.addTriggerForm.mailAttachmentFormat = 'yaml'
      vm.addTriggerForm.mailCommittees = false
      vm.addTriggerForm.noticeCommittees = false
      vm.addTriggerForm.branchNames = []
    },
    openTriggerCopy (branchName, pipelineTrigger) {
      const vm = this
      vm.addTriggerDialog = true
      vm.addTriggerForm = { ...pipelineTrigger }
      vm.addTriggerForm.branchName = branchName
      vm.addTriggerForm.branchNames = []
      vm.addTriggerForm.stepActions = [pipelineTrigger.stepAction]
    },
    triggerAdd () {
      const vm = this
      if(vm.$refs.triggerAddRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/pipelineTriggerOp`, vm.addTriggerForm).then(response => {
          vm.successTip(true,response.msg)
          // vm.$refs.triggerAddRef.reset()
          vm.refreshList()
          vm.addTriggerDialog = false
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openTriggerUpdate (branchName, stepAction, beforeExecute) {
      const vm = this
      vm.updateTriggerDialog = true
      vm.dialogLoading = true
      vm.updateTriggerForm = {}
      vm.project.pipelines.forEach(row => {
        if(row.branchName === branchName){
          row.pipelineTriggers.forEach(item => {
            if(item.stepAction === stepAction && item.beforeExecute === beforeExecute){
              vm.updateTriggerForm = {
                branchName: branchName,
                branchNames: [],
                beforeExecute: beforeExecute,
                stepActions: [stepAction],
                statusResults: item.statusResults,
                enable: item.enable,
                checkVarToIgnore: item.checkVarToIgnore,
                webhookUrl: item.webhookUrl,
                insecure: item.insecure,
                webhookMethod: item.webhookMethod,
                webhookHeaders: item.webhookHeaders || [],
                webhookQueryParams: item.webhookQueryParams || [],
                webhookForms: item.webhookForms || [],
                webhookBody: item.webhookBody,
                mailTitle: item.mailTitle,
                mailContent: item.mailContent,
                mailAttachmentFormat: item.mailAttachmentFormat,
                mailCommittees: item.mailCommittees,
                mailReceivers: item.mailReceivers || [],
                noticeCommittees: item.noticeCommittees,
                mailReceivers: item.mailReceivers || [],
                noticeUsernames: item.noticeUsernames || [],
              }
            }
            vm.dialogLoading = false
          })
        }
      })
    },
    triggerUpdate () {
      const vm = this
      if(vm.$refs.triggerUpdateRef.validate()){
        request.post(`/admin/project/${vm.targetProjectName}/pipelineTriggerOp`, vm.updateTriggerForm).then(response => {
          vm.updateTriggerDialog = false
          vm.successTip(true,response.msg)
          vm.refreshList()
          vm.$refs.triggerUpdateRef.reset()
        }).catch(error => {
          vm.errorTip(true, error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    openCopyToBranchTrigger (opName) {
      const vm = this
      if (opName === 'add') {
        vm.$refs.triggerAddRef.validate()
      } else {
        vm.$refs.triggerUpdateRef.validate()
      }
      vm.copyToBranchTriggerDialog = true
      vm.copyTriggerOpName = opName
      vm.copyBranchNames = []
    },
    copyToBranchTrigger () {
      const vm = this
      if (vm.copyTriggerOpName === 'add') {
        if(vm.$refs.triggerAddRef.validate() && vm.$refs.copyToBranchTriggerRef.validate()){
          vm.addTriggerForm.branchNames = vm.copyBranchNames
          request.post(`/admin/project/${vm.targetProjectName}/pipelineTriggerCopy`, vm.addTriggerForm).then(response => {
            vm.successTip(true,response.msg)
            vm.$refs.triggerAddRef.reset()
            vm.$refs.copyToBranchTriggerRef.reset()
            vm.refreshList()
            vm.copyToBranchTriggerDialog = false
            vm.addTriggerDialog = false
            vm.copyBranchNames = []
          }).catch(error => {
            vm.errorTip(true,error.response.data.msg)
          })
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
        }
      } else {
        if(vm.$refs.triggerUpdateRef.validate() && vm.$refs.copyToBranchTriggerRef.validate()){
          vm.updateTriggerForm.branchNames = vm.copyBranchNames
          request.post(`/admin/project/${vm.targetProjectName}/pipelineTriggerCopy`, vm.updateTriggerForm).then(response => {
            vm.successTip(true,response.msg)
            vm.$refs.triggerUpdateRef.reset()
            vm.$refs.copyToBranchTriggerRef.reset()
            vm.refreshList()
            vm.copyToBranchTriggerDialog = false
            vm.updateTriggerDialog = false
            vm.copyBranchNames = []
          }).catch(error => {
            vm.errorTip(true,error.response.data.msg)
          })
        }else{
          vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
        }
      }
    },
    openTriggerDelete (branchName, stepAction, beforeExecute) {
      const vm = this
      vm.deleteTriggerForm = {
        branchName: branchName,
        stepAction: stepAction,
        beforeExecute: beforeExecute,
      }
      vm.deleteTriggerDialog = true
    },
    triggerDelete () {
      const vm = this
      request.post(`/admin/project/${vm.targetProjectName}/pipelineTriggerDelete`, vm.deleteTriggerForm).then(response => {
        vm.deleteTriggerDialog = false
        vm.successTip(true,response.msg)
        vm.refreshList()
      }).catch(error => {
        vm.errorTip(true, error.response.data.msg)
      })
    },
    sortData(data) {
      Object.keys(data).forEach(item => {
        if(data[item] !== null){
          if(data[item] instanceof Array && data[item].length <= 0){
            delete data[item]
          }else if(data[item] instanceof Object && JSON.stringify(data[item]) == "{}"){
            delete data[item]
          }else if( typeof data[item] === 'number' && data[item] === 0){
            delete data[item]
          }else if(data[item] === ''){
            delete data[item]
          }else if(data[item] === false){
            delete data[item]
          }
        }else{
          delete data[item]
        }
      })
    },
    translateWeek: function (val) {
      val = parseInt(val)
      if (val === -1) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_week_unlimited')
      } else if (val >= 0 || val <= 6) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_week_' + val)
      }
      return ''
    },
    translateMonth: function (val) {
      val = parseInt(val)
      if (val === -1) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_month_unlimited')
      } else if (val >= 1 || val <= 12) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_month_' + val)
      }
      return ''
    },
    translateDay: function (val) {
      val = parseInt(val)
      if (val === -1) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_day_unlimited')
      } else if (val >= 1 || val <= 31) {
        return val.toString()
      }
      return ''
    },
    translateHour: function (val) {
      val = parseInt(val)
      if (val === -1) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_hour_unlimited')
      } else if (val >= 0 || val <= 23) {
        return val.toString()
      }
      return ''
    },
    translateMinute: function (val) {
      val = parseInt(val)
      if (val === -1) {
        return vuetify.preset.lang.t('$vuetify.lang_form_add_pipeline_crontab_crontab_minute_unlimited')
      } else if (val >= 0 || val <= 59) {
        return val.toString()
      }
      return ''
    },
  },
  filters: {
    changeColor: function (value) {
      if(value == 'FAIL'){
        return {color: 'red'}
      }else if(value == 'INFO'){
        return {color: 'green'}
      }else{
        return null
      }
    },
    translateYesNo: function (val) {
      if (val) {
        return vuetify.preset.lang.t('$vuetify.lang_form_yes')
      } else {
        return vuetify.preset.lang.t('$vuetify.lang_form_no')
      }
    },
  },
  computed: {
    pipelineHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_pipeline_name'), sortable: false, value: 'pipelineName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_branch_name'), value: 'branchName', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_ci_envs'), value: 'envs', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_production_envs'), value: 'envProductions', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_git_push_execute_pipeline'), value: 'webhookPushEvent', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
    debugComponentHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_def_yaml'), sortable: false, value: 'componentDebugYaml' },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_yaml'), value: 'componentYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_current_yaml'), value: 'componentK8sYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_connect_desc'), value: 'readmeYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_create_update_time'), value: 'time', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
    componentHeaders () {
      return [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_name'), sortable: false, value: 'componentName' },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_def_yaml'), value: 'componentYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_component_deployment_yaml'), value: 'componentDeploymentYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_current_deployment_yaml'), value: 'componentK8sDeploymentYaml', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_debug_component_create_update_time'), value: 'time', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_operations'), value: 'handle', sortable: false },
      ]
    },
  }
}
</script>

<style>
.info-table .v-data-table{
  border-radius: 0px !important;
  box-shadow: none !important;
}
</style>
<style scoped lang="scss">
.v-card__title {
  padding: 4px 16px;
  font-size: 1rem;
}
.modules-item {
  cursor: pointer;
}
.input-btn {
  cursor: pointer;
}
.limit-config tr{
  td {
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
  }
  th {
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
  }
}
.form-item-15 {
  width: 15%;
}
.form-item-20 {
  width: 20%;
}
.form-item-30 {
  width: 30%;
}
.form-item-40 {
  width: 40%;
}
.form-item-45 {
  width: 45%;
}
.form-item-50 {
  width: 50%;
}
.form-item-60 {
  width: 60%;
}
.form-item-70 {
  width: 70%;
}

.form-item-100 {
  width: 100%;
}
.yaml-btn {
  background-color: #fff !important;
  box-shadow: none !important;
}
.yaml-btn:hover::before {
  opacity: 0 !important;
}
.pr-20 {
  padding-right: 80px;
}
.tip-color {
  color: rgba(0, 0, 0, 0.6);
}
.error-text {
  font-size: 16px;
  font-weight: 400;
  color: #ff5252;
}
.params-item {
  padding: 8px;
  border: 1px solid #d2c7c7;
  border-radius: 5px;
  margin-bottom: 16px;
}
.avatar-wrap {
  text-align: center;
}
.avatar-wrap img {
  margin: 4px 0;
}
</style>
