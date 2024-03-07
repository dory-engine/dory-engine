import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout/Layout'
import User from '@/services/user'
import { Subject } from 'rxjs'
const userService = User.getInstance()

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/cicd/projects'
  },
  {
    path: '/cicd',
    component: Layout,
    name: 'Cicd',
    redirect: '/cicd/projects',
    children: [
      {
        path: 'projects',
        name: 'CicdProjects',
        component: () => import('../views/cicd/Projects')
      },
      {
        path: 'pipeline/:pipelineName',
        name: 'CicdPipeline',
        component: () => import('../views/cicd/Pipeline')
      },
      {
        path: 'project/:projectName',
        name: 'CicdProject',
        component: () => import('../views/cicd/Project')
      },
      {
        path: 'projectDef/:projectName',
        name: 'CicdProjectDef',
        component: () => import('../views/cicd/ProjectDef')
      },
      {
        path: 'artifact/:projectName',
        name: 'CicdArtifact',
        component: () => import('../views/cicd/Artifact')
      },
      {
        path: 'artifact/:projectName/:artifactID',
        name: 'CicdArtifactDetail',
        component: () => import('../views/cicd/Artifact')
      },
      {
        path: 'module/:projectName/:moduleType/:moduleName',
        name: 'CicdModule',
        component: () => import('../views/cicd/Module')
      },
      {
        path: 'runs',
        name: 'CicdRuns',
        component: () => import('../views/cicd/Runs')
      },
      {
        path: 'run/:runName',
        name: 'CicdRun',
        component: () => import('../views/cicd/Run')
      },
      {
        path: 'queue',
        name: 'CicdQueue',
        component: () => import('../views/cicd/Queue')
      },
      {
        path: 'fixRuns',
        name: 'CicdFixRuns',
        component: () => import('../views/cicd/FixRuns')
      },
      {
        path: 'commits',
        name: 'CicdCommits',
        component: () => import('../views/cicd/Commits')
      },
      {
        path: 'steps',
        name: 'CicdSteps',
        component: () => import('../views/cicd/Steps')
      },
      {
        path: 'steps/:stepID',
        name: 'CicdStepsDetail',
        component: () => import('../views/cicd/Steps')
      },
      {
        path: 'notifications',
        name: 'CicdNotifications',
        component: () => import('../views/cicd/Notifications')
      }
    ]
  },
  {
    path: '/metrics',
    component: Layout,
    name: 'Metrics',
    redirect: '/metrics/runs',
    children: [
      {
        path: 'runs',
        name: 'MetricsRuns',
        component: () => import('../views/metrics/Runs')
      },
      {
        path: 'steps',
        name: 'MetricsSteps',
        component: () => import('../views/metrics/Steps')
      },
      {
        path: 'builds',
        name: 'MetricsBuilds',
        component: () => import('../views/metrics/Builds')
      },
      {
        path: 'scanCodes',
        name: 'MetricsScanCodes',
        component: () => import('../views/metrics/ScanCodes')
      },
      {
        path: 'scanImages',
        name: 'MetricsScanImages',
        component: () => import('../views/metrics/ScanImages')
      },
      {
        path: 'packages',
        name: 'MetricsPackages',
        component: () => import('../views/metrics/Packages')
      },
      {
        path: 'artifacts',
        name: 'MetricsArtifacts',
        component: () => import('../views/metrics/Artifacts')
      },
      {
        path: 'deploys',
        name: 'MetricsDeploys',
        component: () => import('../views/metrics/Deploys')
      },
      {
        path: 'deployArtifacts',
        name: 'MetricsDeployArtifacts',
        component: () => import('../views/metrics/DeployArtifacts')
      },
      {
        path: 'checkDeploys',
        name: 'MetricsCheckDeploys',
        component: () => import('../views/metrics/CheckDeploys')
      },
      {
        path: 'checkQuotas',
        name: 'MetricsCheckQuotas',
        component: () => import('../views/metrics/CheckQuotas')
      },
      {
        path: 'tests',
        name: 'MetricsTests',
        component: () => import('../views/metrics/Tests')
      },
      {
        path: 'customSteps',
        name: 'MetricsCustomSteps',
        component: () => import('../views/metrics/CustomSteps')
      },
      {
        path: 'commits',
        name: 'MetricsCommits',
        component: () => import('../views/metrics/Commits')
      },
      {
        path: 'auditLogs',
        name: 'MetricsAuditLogs',
        component: () => import('../views/metrics/AuditLogs')
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    redirect: '/admin/projects',
    children: [
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('../views/admin/Projects')
      },
      {
        path: 'project/:projectName',
        name: 'AdminProject',
        component: () => import('../views/admin/Project')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/Users')
      },
      {
        path: 'envs',
        name: 'AdminEnvs',
        component: () => import('../views/admin/Envs')
      },
      {
        path: 'tenants',
        name: 'AdminTenants',
        component: () => import('../views/admin/Tenants')
      },
      {
        path: 'dockerBuildEnvs',
        name: 'AdminDockerBuildEnvs',
        component: () => import('../views/admin/DockerBuildEnvs')
      },
      {
        path: 'repoConfs',
        name: 'AdminRepoConfigs',
        component: () => import('../views/admin/RepoConfigs')
      },
      {
        path: 'customStepConfs',
        name: 'AdminCustomStepConfs',
        component: () => import('../views/admin/CustomStepConfs')
      },
      {
        path: 'auditLogs',
        name: 'AdminAuditLogs',
        component: () => import('../views/admin/AuditLogs')
      },
      {
        path: 'applies',
        name: 'AdminApplies',
        component: () => import('../components/Applies'),
        props: {
          inMenu: 'admin'
        }
      },
      {
        path: 'componentTemplates',
        name: 'AdminComponentTemplates',
        component: () => import('../views/admin/ComponentTemplates'),
      },
      {
        path: 'adminWebhooks',
        name: 'AdminWebhooks',
        component: () => import('../views/admin/AdminWebhooks')
      },
      {
        path: 'queue',
        name: 'AdminQueue',
        component: () => import('../views/admin/Queue')
      },
      {
        path: 'mailLogs',
        name: 'AdminMailLogs',
        component: () => import('../views/admin/MailLogs')
      },
      {
        path: 'notifications',
        name: 'AdminNotifications',
        component: () => import('../views/admin/Notifications')
      },
      {
        path: 'triggerWebhookLogs',
        name: 'AdminTriggerWebhookLogs',
        component: () => import('../views/admin/TriggerWebhookLogs')
      },
      {
        path: 'triggerMailLogs',
        name: 'AdminTriggerMailLogs',
        component: () => import('../views/admin/TriggerMailLogs')
      },
      {
        path: 'systemConfig',
        name: 'AdminSystemConfig',
        component: () => import('../views/admin/AdminSystemConfig')
      }
    ]
  },
  {
    path: '/console',
    component: Layout,
    name: 'Console',
    redirect: '/console/projects',
    children: [
      {
        path: 'projects',
        name: 'ConsoleProjects',
        component: () => import('../views/console/Projects')
      },
      {
        path: 'project/:projectName',
        name: 'ConsoleProject',
        component: () => import('../views/console/Project')
      },
      {
        path: 'applies',
        name: 'ConsoleApplies',
        component: () => import('../components/Applies'),
        props: {
          inMenu: 'console'
        }
      },
      {
        path: 'notifications',
        name: 'ConsoleNotifications',
        component: () => import('../views/console/Notifications')
      },
      {
        path: 'triggerWebhookLogs',
        name: 'ConsoleTriggerWebhookLogs',
        component: () => import('../views/console/TriggerWebhookLogs')
      },
      {
        path: 'triggerMailLogs',
        name: 'ConsoleTriggerMailLogs',
        component: () => import('../views/console/TriggerMailLogs')
      }
    ]
  },
  {
    path: '/announcements',
    component: Layout,
    name: 'Announcements',
    redirect: '/announcements/announcements',
    children: [
      {
        path: 'announcements',
        name: 'AnnouncementsAnnouncements',
        component: () => import('../views/announcements/Announcements')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login'),
    beforeEnter: (to, from, next) => {
      if (userService.state.userObj && userService.state.userObj.userStatus === 'valid') {
        next({ path: '/' })
      }
      next()
    }
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () => import('../views/ForgetPassword')
  },
  {
    path: '/reset-password/:resetToken',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword')
  },
  {
    path: '*',
    redirect: '/cicd/projects',
    name: 'projects',
    hidden: true,
  }
]

const router = new VueRouter({
  routes
})
const whiteList = ['Login', 'ForgetPassword', 'ResetPassword']

export const routerBeforeSubject = new Subject()
router.beforeEach((to, from, next) => {
  routerBeforeSubject.next({
    to, from, next
  })
  if ((userService.state.userObj && userService.state.userObj.userStatus === 'valid') || whiteList.includes(to.name)) {
    next()
  } else {
    next({ path: `/login?redirect=${to.fullPath}` })
  }
})

export default router
