import { BehaviorSubject } from 'rxjs'
import Vue from 'vue'
import {vuetify, i18n} from '@/plugins/vuetify'
import USER_API from '@/api/user'
import User from '@/services/user'
const userService = User.getInstance()
export function rtnTopMenu (userService) {
  return [
    { key: 'projects', icon: 'mdi-rocket-launch', title: vuetify.preset.lang.t('$vuetify.lang_menu_cicd'), type: 'router', routerKey: 'Cicd' },
    { key: 'metrics', icon: 'mdi-bulletin-board', title: vuetify.preset.lang.t('$vuetify.lang_menu_metrics'), type: 'router', routerKey: 'Metrics' },
    { key: 'console', icon: 'mdi-console', title: vuetify.preset.lang.t('$vuetify.lang_menu_project_console'), type: 'router', routerKey: 'Console' },
    { key: 'admin', icon: 'mdi-account-cog', title: vuetify.preset.lang.t('$vuetify.lang_menu_admin_console'), type: 'router', routerKey: 'Admin' },
    { key: 'announcements', icon: 'mdi-bullhorn-outline', title: vuetify.preset.lang.t('$vuetify.lang_menu_announcements'), type: 'router', routerKey: 'Announcements' },
    {
      key: 'myAccount',
      icon: 'mdi-account-box',
      nodes: [
        {
          key: 'accessToken',
          name: vuetify.preset.lang.t('$vuetify.lang_menu_access_token'),
          icon: 'mdi-filter-variant',
          type: 'function',
          onClick (h, context) {
            context.parent.tokenDialog = true
            context.parent.getAccessToken()
          }
        },
        {
          key: 'changePwd',
          name: vuetify.preset.lang.t('$vuetify.lang_menu_change_password'),
          icon: 'mdi-lock',
          type: 'function',
          onClick (h, context) {
            context.parent.dialog = true
          }
        },
        {
          key: 'editProfile',
          name: vuetify.preset.lang.t('$vuetify.lang_menu_edit_profile'),
          icon: 'mdi-file-document-edit',
          type: 'function',
          onClick (h, context) {
            context.parent.profileDialog = true
            context.parent.getProfile()
          }
        },
        {
          key: 'logout',
          name: vuetify.preset.lang.t('$vuetify.lang_menu_logout'),
          icon: 'mdi-logout',
          type: 'function',
          onClick (h, context) {
            USER_API.logout().then(next => {
              userService.userObj$.next({})
              context.parent.$router.push({ path: '/login' })
            })
          }
        }
      ]
    }
  ]
}
export function rtnLeftMenu () {
  return [
    {
      key: 'cicd',
      nodes: [
        { key: 'cicdProjects', name: vuetify.preset.lang.t('$vuetify.lang_menu_cicd'), icon: 'mdi-rocket-launch', type: 'router', routerKey: 'CicdProjects' },
        { key: 'cicdRuns', name: vuetify.preset.lang.t('$vuetify.lang_menu_runs'), icon: 'mdi-play-circle', type: 'router', routerKey: 'CicdRuns' },
        { key: 'cicdFixRuns', name: vuetify.preset.lang.t('$vuetify.lang_menu_runs_fixed'), icon: 'mdi-motion-play-outline', type: 'router', routerKey: 'CicdFixRuns' },
        { key: 'cicdQueue', name: vuetify.preset.lang.t('$vuetify.lang_menu_runs_queue'), icon: 'mdi-format-list-bulleted-square', type: 'router', routerKey: 'CicdQueue' },
        { key: 'cicdSteps', name: vuetify.preset.lang.t('$vuetify.lang_menu_steps'), icon: 'mdi-step-forward-2', type: 'router', routerKey: 'CicdSteps'},
        { key: 'cicdCommits', name: vuetify.preset.lang.t('$vuetify.lang_menu_commits'), icon: 'mdi-git', type: 'router', routerKey: 'CicdCommits' },
        { key: 'cicdNotifications', name: vuetify.preset.lang.t('$vuetify.lang_menu_notifications'), icon: 'mdi-bell', type: 'router', routerKey: 'CicdNotifications' },
      ]
    },
    {
      key: 'admin',
      nodes: [
        { key: 'adminProjects', name: vuetify.preset.lang.t('$vuetify.lang_menu_projects_management'), icon: 'mdi-rocket-launch', type: 'router', routerKey: 'AdminProjects' },
        { key: 'adminTenants', name: vuetify.preset.lang.t('$vuetify.lang_menu_tenants_management'), icon: 'mdi-home-account', type: 'router', routerKey: 'AdminTenants' },
        { key: 'adminUsers', name: vuetify.preset.lang.t('$vuetify.lang_menu_users_management'), icon: 'mdi-account-circle', type: 'router', routerKey: 'AdminUsers' },
        { key: 'adminEnvs', name: vuetify.preset.lang.t('$vuetify.lang_menu_envs_management'), icon: 'mdi-apple-icloud', type: 'router', routerKey: 'AdminEnvs' },
        { key: 'adminDockerBuildEnvs', name: vuetify.preset.lang.t('$vuetify.lang_menu_docker_build_envs_management'), icon: 'mdi-cube-outline', type: 'router', routerKey: 'AdminDockerBuildEnvs' },
        { key: 'adminRepoConfs', name: vuetify.preset.lang.t('$vuetify.lang_menu_repo_configs_management'), icon: 'mdi-package-variant', type: 'router', routerKey: 'AdminRepoConfigs' },
        { key: 'adminCustomStepConfs', name: vuetify.preset.lang.t('$vuetify.lang_menu_custom_steps_management'), icon: 'mdi-function-variant', type: 'router', routerKey: 'AdminCustomStepConfs' },
        { key: 'adminComponentTemplates', name: vuetify.preset.lang.t('$vuetify.lang_menu_component_templates_management'), icon: 'mdi-video-input-component', type: 'router', routerKey: 'AdminComponentTemplates' },
        { key: 'adminWebhooks', name: vuetify.preset.lang.t('$vuetify.lang_menu_admin_webhook_settings'), icon: 'mdi-hook', type: 'router', routerKey: 'AdminWebhooks' },
        { key: 'adminApplies', name: vuetify.preset.lang.t('$vuetify.lang_menu_applies_management'), icon: 'mdi-notebook-check', type: 'router', routerKey: 'AdminApplies' },
        { key: 'adminQueue', name: vuetify.preset.lang.t('$vuetify.lang_menu_runs_queues_management'), icon: 'mdi-format-list-bulleted-square', type: 'router', routerKey: 'AdminQueue' },
        { key: 'adminAuditLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_audit_logs_management'), icon: 'mdi-math-log', type: 'router', routerKey: 'AdminAuditLogs' },
        { key: 'adminMailLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_mail_send_logs_management'), icon: 'mdi-email-check', type: 'router', routerKey: 'AdminMailLogs' },
        { key: 'adminNotifications', name: vuetify.preset.lang.t('$vuetify.lang_menu_notifications_management'), icon: 'mdi-bell', type: 'router', routerKey: 'AdminNotifications' },
        { key: 'adminTriggerWebhookLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_webhook_logs_management'), icon: 'mdi-webhook', type: 'router', routerKey: 'AdminTriggerWebhookLogs' },
        { key: 'adminTriggerMailLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_mail_logs_management'), icon: 'mdi-gmail', type: 'router', routerKey: 'AdminTriggerMailLogs' },
        { key: 'adminSystemConfig', name: vuetify.preset.lang.t('$vuetify.lang_menu_system_config'), icon: 'mdi-cog-outline', type: 'router', routerKey: 'AdminSystemConfig' },
      ]
    },
    {
      key: 'console',
      nodes: [
        { key: 'consoleProjects', name: vuetify.preset.lang.t('$vuetify.lang_menu_projects_management'), icon: 'mdi-rocket-launch', type: 'router', routerKey: 'ConsoleProjects' },
        { key: 'consoleApplies', name: vuetify.preset.lang.t('$vuetify.lang_menu_applies_management'), icon: 'mdi-notebook-check', type: 'router', routerKey: 'ConsoleApplies' },
        { key: 'consoleNotifications', name: vuetify.preset.lang.t('$vuetify.lang_menu_notifications_management'), icon: 'mdi-bell', type: 'router', routerKey: 'ConsoleNotifications' },
        { key: 'consoleTriggerWebhookLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_webhook_logs_management'), icon: 'mdi-webhook', type: 'router', routerKey: 'ConsoleTriggerWebhookLogs' },
        { key: 'consoleTriggerMailLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_mail_logs_management'), icon: 'mdi-gmail', type: 'router', routerKey: 'ConsoleTriggerMailLogs' },
      ]
    },
    {
      key: 'metrics',
      nodes: [
        { key: 'metricsRuns', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_runs'), icon: 'mdi-play-circle', type: 'router', routerKey: 'MetricsRuns' },
        { key: 'metricsSteps', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_steps'), icon: 'mdi-step-forward-2', type: 'router', routerKey: 'MetricsSteps' },
        { key: 'metricsBuilds', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_builds'), icon: 'mdi-office-building', type: 'router', routerKey: 'MetricsBuilds' },
        { key: 'metricsScanCodes', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_scan_codes'), icon: 'mdi-xml', type: 'router', routerKey: 'MetricsScanCodes' },
        { key: 'metricsScanImages', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_scan_images'), icon: 'mdi-image-search-outline', type: 'router', routerKey: 'MetricsScanImages' },
        { key: 'metricsPackages', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_packages'), icon: 'mdi-package', type: 'router', routerKey: 'MetricsPackages' },
        { key: 'metricsArtifacts', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_artifacts'), icon: 'mdi-alpha-a-box', type: 'router', routerKey: 'MetricsArtifacts' },
        { key: 'metricsDeploys', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_deploy_containers'), icon: 'mdi-codepen', type: 'router', routerKey: 'MetricsDeploys' },
        { key: 'metricsDeployArtifacts', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_deploy_artifacts'), icon: 'mdi-alpha-z-circle', type: 'router', routerKey: 'MetricsDeployArtifacts' },
        { key: 'metricsCheckDeploys', name:  vuetify.preset.lang.t('$vuetify.lang_menu_metrics_check_deploys'), icon: 'mdi-check-network', type: 'router', routerKey: 'MetricsCheckDeploys' },
        { key: 'metricsCheckQuotas', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_check_quota'), icon: 'mdi-database-check', type: 'router', routerKey: 'MetricsCheckQuotas' },
        { key: 'metricsTests', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_auto_tests'), icon: 'mdi-ab-testing', type: 'router', routerKey: 'MetricsTests' },
        { key: 'metricsCustomSteps', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_custom_steps'), icon: 'mdi-focus-field-vertical', type: 'router', routerKey: 'MetricsCustomSteps' },
        { key: 'metricsCommits', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_commits'), icon: 'mdi-git', type: 'router', routerKey: 'MetricsCommits' },
        { key: 'metricsAuditLogs', name: vuetify.preset.lang.t('$vuetify.lang_menu_metrics_audit_logs'), icon: 'mdi-math-log', type: 'router', routerKey: 'MetricsAuditLogs' },
      ]
    },
    {
      key: 'announcements',
      nodes: [
        { key: 'announcements', name: vuetify.preset.lang.t('$vuetify.lang_menu_announcements'), icon: 'mdi-bullhorn-outline', type: 'router', routerKey: 'AnnouncementsAnnouncements' }
      ]
    }
  ]
}
export default class Menu {
  topMenu$ = new BehaviorSubject(rtnTopMenu(userService))

  leftMenu$ = new BehaviorSubject(rtnLeftMenu())

  currentMenu$ = new BehaviorSubject({
    top: null,
    left: null
  })

  state = Vue.observable({
    leftMenu: [],
    topMenu: [],
    currentMenu: {
      top: null,
      left: null
    }
  })

  constructor () {
    const _this = this
    _this.leftMenu$.subscribe(next => {
      _this.state.leftMenu = next
    })
    _this.topMenu$.subscribe(next => {
      _this.state.topMenu = next
    })
    _this.currentMenu$.subscribe(next => {
      _this.state.currentMenu = next
    })
  }

  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
}
