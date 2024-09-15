# api/admin接口文档

## 目录

- [api/admin接口文档](#apiadmin接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [admin 管理控制台接口](#admin-管理控制台接口)
      - [\[POST\] api/admin/appConfig 获取应用配置接口](#post-apiadminappconfig-获取应用配置接口)
      - [\[POST\] api/admin/reload 重新读取所有配置并重新检测环境网格配置](#post-apiadminreload-重新读取所有配置并重新检测环境网格配置)
      - [\[POST\] api/admin/license 请求license](#post-apiadminlicense-请求license)
      - [\[GET\] api/admin/projectNames admin项目名称列表接口，用于搜索的下拉列表](#get-apiadminprojectnames-admin项目名称列表接口用于搜索的下拉列表)
      - [\[POST\] api/admin/projectNames/tenantCode admin项目名称列表接口，用于用户列表页设置项目member选择项目用途](#post-apiadminprojectnamestenantcode-admin项目名称列表接口用于用户列表页设置项目member选择项目用途)
      - [\[GET\] api/admin/projectEnvs admin项目与可用环境列表接口，用于把主机/数据库加入到项目环境](#get-apiadminprojectenvs-admin项目与可用环境列表接口用于把主机数据库加入到项目环境)
      - [\[GET\] api/admin/projectNamespaces admin项目名字空间列表接口](#get-apiadminprojectnamespaces-admin项目名字空间列表接口)
      - [\[POST\] api/admin/projects admin项目列表与搜索接口](#post-apiadminprojects-admin项目列表与搜索接口)
      - [\[POST\] api/admin/project admin新增项目接口](#post-apiadminproject-admin新增项目接口)
      - [\[GET\] api/admin/project/:projectName admin项目查看接口](#get-apiadminprojectprojectname-admin项目查看接口)
      - [\[POST\] api/admin/project/:projectName/delete admin删除项目接口](#post-apiadminprojectprojectnamedelete-admin删除项目接口)
      - [\[POST\] api/admin/project/:projectName admin修改项目接口](#post-apiadminprojectprojectname-admin修改项目接口)
      - [\[POST\] api/admin/project/:projectName/nodePortAdd admin为项目分配NodePort接口](#post-apiadminprojectprojectnamenodeportadd-admin为项目分配nodeport接口)
      - [\[POST\] api/admin/project/:projectName/nodePortDelete admin为项目回收NodePort接口](#post-apiadminprojectprojectnamenodeportdelete-admin为项目回收nodeport接口)
      - [\[POST\] api/admin/project/:projectName/envAdd admin为项目分配新环境接口](#post-apiadminprojectprojectnameenvadd-admin为项目分配新环境接口)
      - [\[POST\] api/admin/project/:projectName/envDelete admin为项目回收环境接口](#post-apiadminprojectprojectnameenvdelete-admin为项目回收环境接口)
      - [\[POST\] api/admin/project/:projectName/envDeleteAll admin为项目回收环境并清理名字空间接口](#post-apiadminprojectprojectnameenvdeleteall-admin为项目回收环境并清理名字空间接口)
      - [\[POST\] api/admin/project/:projectName/envUpdate admin修改项目环境设置接口](#post-apiadminprojectprojectnameenvupdate-admin修改项目环境设置接口)
      - [\[POST\] api/admin/project/:projectName/refreshToken admin为项目更新所有密钥接口](#post-apiadminprojectprojectnamerefreshtoken-admin为项目更新所有密钥接口)
      - [\[POST\] api/admin/project/:projectName/reApply admin重新应用项目配置到所有可用环境](#post-apiadminprojectprojectnamereapply-admin重新应用项目配置到所有可用环境)
      - [\[POST\] api/admin/project/:projectName/cleanGitRepo admin清理临时代码仓库](#post-apiadminprojectprojectnamecleangitrepo-admin清理临时代码仓库)
      - [\[GET\] api/admin/project/:projectName/members admin项目分配用户列表接口](#get-apiadminprojectprojectnamemembers-admin项目分配用户列表接口)
      - [\[POST\] api/admin/project/:projectName/memberAdd admin为项目分配用户接口](#post-apiadminprojectprojectnamememberadd-admin为项目分配用户接口)
      - [\[POST\] api/admin/project/:projectName/memberDelete admin为项目移除用户接口](#post-apiadminprojectprojectnamememberdelete-admin为项目移除用户接口)
      - [\[POST\] api/admin/project/:projectName/memberUpdate admin为项目修改用户角色接口](#post-apiadminprojectprojectnamememberupdate-admin为项目修改用户角色接口)
      - [\[GET\] api/admin/project/:projectName/branchNames admin查看当前项目代码仓库分支接口](#get-apiadminprojectprojectnamebranchnames-admin查看当前项目代码仓库分支接口)
      - [\[POST\] api/admin/project/:projectName/pipelineAdd admin为项目新增流水线接口](#post-apiadminprojectprojectnamepipelineadd-admin为项目新增流水线接口)
      - [\[POST\] api/admin/project/:projectName/pipelineDelete admin为项目删除流水线接口](#post-apiadminprojectprojectnamepipelinedelete-admin为项目删除流水线接口)
      - [\[POST\] api/admin/project/:projectName/pipelineEnvAdd admin为项目流水线新增环境接口](#post-apiadminprojectprojectnamepipelineenvadd-admin为项目流水线新增环境接口)
      - [\[POST\] api/admin/project/:projectName/pipelineEnvDelete admin为项目流水线删除环境接口](#post-apiadminprojectprojectnamepipelineenvdelete-admin为项目流水线删除环境接口)
      - [\[POST\] api/admin/project/:projectName/pipelineGitWebhook admin为项目流水线设置git webhook触发器接口](#post-apiadminprojectprojectnamepipelinegitwebhook-admin为项目流水线设置git-webhook触发器接口)
      - [\[POST\] api/admin/project/:projectName/pipelineTokenRefresh admin重置流水线token接口](#post-apiadminprojectprojectnamepipelinetokenrefresh-admin重置流水线token接口)
      - [\[POST\] api/admin/project/:projectName/pipelineCronAdd admin为项目流水线新增计划任务接口](#post-apiadminprojectprojectnamepipelinecronadd-admin为项目流水线新增计划任务接口)
      - [\[POST\] api/admin/project/:projectName/pipelineCronCopy admin为项目流水线复制计划任务接口](#post-apiadminprojectprojectnamepipelinecroncopy-admin为项目流水线复制计划任务接口)
      - [\[POST\] api/admin/project/:projectName/pipelineCronDelete admin为项目流水线移除计划任务接口](#post-apiadminprojectprojectnamepipelinecrondelete-admin为项目流水线移除计划任务接口)
      - [\[GET\] api/admin/project/:projectName/pipelineTriggerStepActions admin触发器步骤选项接口](#get-apiadminprojectprojectnamepipelinetriggerstepactions-admin触发器步骤选项接口)
      - [\[POST\] api/admin/project/:projectName/pipelineTriggerOp admin为项目流水线新增修改触发器接口](#post-apiadminprojectprojectnamepipelinetriggerop-admin为项目流水线新增修改触发器接口)
      - [\[POST\] api/admin/project/:projectName/pipelineTriggerCopy admin为项目流水线复制触发器接口](#post-apiadminprojectprojectnamepipelinetriggercopy-admin为项目流水线复制触发器接口)
      - [\[POST\] api/admin/project/:projectName/pipelineTriggerDelete admin为项目流水线移除触发器接口](#post-apiadminprojectprojectnamepipelinetriggerdelete-admin为项目流水线移除触发器接口)
      - [\[POST\] api/admin/project/:projectName/envQuotaConfigUpdate admin为项目环境设置quotaConfig接口](#post-apiadminprojectprojectnameenvquotaconfigupdate-admin为项目环境设置quotaconfig接口)
      - [\[POST\] api/admin/project/:projectName/envPvcAdd admin为项目环境分配pvc接口](#post-apiadminprojectprojectnameenvpvcadd-admin为项目环境分配pvc接口)
      - [\[POST\] api/admin/project/:projectName/envPvcDelete admin为项目环境回收pvc接口](#post-apiadminprojectprojectnameenvpvcdelete-admin为项目环境回收pvc接口)
      - [\[POST\] api/admin/project/:projectName/envPvcScAdd admin为项目环境分配存储类pvc接口](#post-apiadminprojectprojectnameenvpvcscadd-admin为项目环境分配存储类pvc接口)
      - [\[POST\] api/admin/project/:projectName/envNetworkPolicyAdd admin为项目新增网络策略接口](#post-apiadminprojectprojectnameenvnetworkpolicyadd-admin为项目新增网络策略接口)
      - [\[POST\] api/admin/project/:projectName/envNetworkPolicyDelete admin为项目环境删除网络策略接口](#post-apiadminprojectprojectnameenvnetworkpolicydelete-admin为项目环境删除网络策略接口)
      - [\[POST\] api/admin/project/:projectName/envHostAdd admin为项目环境分配主机接口](#post-apiadminprojectprojectnameenvhostadd-admin为项目环境分配主机接口)
      - [\[POST\] api/admin/project/:projectName/envHostDelete admin为项目环境回收主机接口](#post-apiadminprojectprojectnameenvhostdelete-admin为项目环境回收主机接口)
      - [\[POST\] api/admin/project/:projectName/envHostJoin admin把主机加入其他项目环境接口](#post-apiadminprojectprojectnameenvhostjoin-admin把主机加入其他项目环境接口)
      - [\[POST\] api/admin/project/:projectName/envHostLeave admin把主机移除项目环境接口](#post-apiadminprojectprojectnameenvhostleave-admin把主机移除项目环境接口)
      - [\[POST\] api/admin/project/:projectName/envHostUpdate admin修改主机信息接口](#post-apiadminprojectprojectnameenvhostupdate-admin修改主机信息接口)
      - [\[POST\] api/admin/project/:projectName/envDbAdd admin为项目环境分配数据库接口](#post-apiadminprojectprojectnameenvdbadd-admin为项目环境分配数据库接口)
      - [\[POST\] api/admin/project/:projectName/envDbDelete admin为项目环境回收数据库接口](#post-apiadminprojectprojectnameenvdbdelete-admin为项目环境回收数据库接口)
      - [\[POST\] api/admin/project/:projectName/envDbJoin admin把数据库加入项目环境接口](#post-apiadminprojectprojectnameenvdbjoin-admin把数据库加入项目环境接口)
      - [\[POST\] api/admin/project/:projectName/envDbLeave admin把数据库移除项目环境接口](#post-apiadminprojectprojectnameenvdbleave-admin把数据库移除项目环境接口)
      - [\[POST\] api/admin/project/:projectName/envDbUpdate admin修改数据库信息接口](#post-apiadminprojectprojectnameenvdbupdate-admin修改数据库信息接口)
      - [\[GET\] api/admin/project/:projectName/envComponentDebugDefault admin获取debug组件默认模板接口](#get-apiadminprojectprojectnameenvcomponentdebugdefault-admin获取debug组件默认模板接口)
      - [\[POST\] api/admin/project/:projectName/envComponentDebugUpdate admin在项目环境调整debug组件接口](#post-apiadminprojectprojectnameenvcomponentdebugupdate-admin在项目环境调整debug组件接口)
      - [\[POST\] api/admin/project/:projectName/envComponentDebugDelete admin在项目环境删除debug组件接口](#post-apiadminprojectprojectnameenvcomponentdebugdelete-admin在项目环境删除debug组件接口)
      - [\[GET\] api/admin/project/:projectName/envComponentTemplates admin获取组件模板列表接口](#get-apiadminprojectprojectnameenvcomponenttemplates-admin获取组件模板列表接口)
      - [\[POST\] api/admin/project/:projectName/envComponentUpdate admin在项目环境调整组件接口](#post-apiadminprojectprojectnameenvcomponentupdate-admin在项目环境调整组件接口)
      - [\[POST\] api/admin/project/:projectName/envComponentDelete admin在项目环境删除组件接口](#post-apiadminprojectprojectnameenvcomponentdelete-admin在项目环境删除组件接口)
      - [\[POST\] api/admin/queues admin运行队列列表接口](#post-apiadminqueues-admin运行队列列表接口)
      - [\[POST\] api/admin/queue/:runName/top admin队列中的运行置顶接口](#post-apiadminqueuerunnametop-admin队列中的运行置顶接口)
      - [\[POST\] api/admin/users admin用户列表与搜索接口](#post-apiadminusers-admin用户列表与搜索接口)
      - [\[GET\] api/admin/userNames admin用户名列表接口，用于搜索的下拉列表](#get-apiadminusernames-admin用户名列表接口用于搜索的下拉列表)
      - [\[POST\] api/admin/userNames/tenantCode admin用户名列表接口，用于项目查看页项目member设置选择用户用途](#post-apiadminusernamestenantcode-admin用户名列表接口用于项目查看页项目member设置选择用户用途)
      - [\[POST\] api/admin/user admin新增用户接口](#post-apiadminuser-admin新增用户接口)
      - [\[PUT\] api/admin/user admin新增或更新用户接口，客户端使用](#put-apiadminuser-admin新增或更新用户接口客户端使用)
      - [\[DELETE\] api/admin/user/:username admin删除用户接口](#delete-apiadminuserusername-admin删除用户接口)
      - [\[GET\] api/admin/user/:username/profile admin获取用户资料接口](#get-apiadminuserusernameprofile-admin获取用户资料接口)
      - [\[POST\] api/admin/user/:username/profileUpdate admin修改用户资料接口](#post-apiadminuserusernameprofileupdate-admin修改用户资料接口)
      - [\[POST\] api/admin/user/:username/passwordUpdate admin修改用户密码接口](#post-apiadminuserusernamepasswordupdate-admin修改用户密码接口)
      - [\[POST\] api/admin/user/:username/activeUpdate admin修改用户是否激活状态接口](#post-apiadminuserusernameactiveupdate-admin修改用户是否激活状态接口)
      - [\[POST\] api/admin/user/:username/adminUpdate admin修改用户是否管理员接口](#post-apiadminuserusernameadminupdate-admin修改用户是否管理员接口)
      - [\[GET\] api/admin/user/:username/projects admin用户所属项目列表接口](#get-apiadminuserusernameprojects-admin用户所属项目列表接口)
      - [\[POST\] api/admin/user/:username/projectAdd admin为用户分配项目接口](#post-apiadminuserusernameprojectadd-admin为用户分配项目接口)
      - [\[POST\] api/admin/user/:username/projectDelete admin为用户移除项目接口](#post-apiadminuserusernameprojectdelete-admin为用户移除项目接口)
      - [\[POST\] api/admin/user/:username/projectUpdate admin为用户修改项目角色接口](#post-apiadminuserusernameprojectupdate-admin为用户修改项目角色接口)
      - [\[GET\] api/admin/tenantCodes admin租户编码列表接口](#get-apiadmintenantcodes-admin租户编码列表接口)
      - [\[POST\] api/admin/tenants admin租户列表与搜索接口](#post-apiadmintenants-admin租户列表与搜索接口)
      - [\[POST\] api/admin/tenant admin新增租户接口](#post-apiadmintenant-admin新增租户接口)
      - [\[POST\] api/admin/tenant/:tenantCode admin修改租户接口](#post-apiadmintenanttenantcode-admin修改租户接口)
      - [\[DELETE\] api/admin/tenant/:tenantCode admin删除租户接口](#delete-apiadmintenanttenantcode-admin删除租户接口)
      - [\[GET\] api/admin/buildEnvNames admin容器构建环境名称列表接口](#get-apiadminbuildenvnames-admin容器构建环境名称列表接口)
      - [\[POST\] api/admin/dockerBuildEnvs admin容器构建环境列表与搜索接口](#post-apiadmindockerbuildenvs-admin容器构建环境列表与搜索接口)
      - [\[POST\] api/admin/dockerBuildEnv admin新增容器构建环境接口](#post-apiadmindockerbuildenv-admin新增容器构建环境接口)
      - [\[POST\] api/admin/dockerBuildEnv/:buildEnvName admin修改容器构建环境接口](#post-apiadmindockerbuildenvbuildenvname-admin修改容器构建环境接口)
      - [\[DELETE\] api/admin/dockerBuildEnv/:buildEnvName admin删除容器构建环境接口](#delete-apiadmindockerbuildenvbuildenvname-admin删除容器构建环境接口)
      - [\[POST\] api/admin/repoConfigs admin仓库列表与搜索接口](#post-apiadminrepoconfigs-admin仓库列表与搜索接口)
      - [\[POST\] api/admin/gitRepoConfig admin新增代码仓库接口](#post-apiadmingitrepoconfig-admin新增代码仓库接口)
      - [\[POST\] api/admin/gitRepoConfig/:repoName admin修改代码仓库接口](#post-apiadmingitrepoconfigreponame-admin修改代码仓库接口)
      - [\[DELETE\] api/admin/gitRepoConfig/:repoName admin删除代码仓库接口](#delete-apiadmingitrepoconfigreponame-admin删除代码仓库接口)
      - [\[POST\] api/admin/imageRepoConfig admin新增镜像仓库接口](#post-apiadminimagerepoconfig-admin新增镜像仓库接口)
      - [\[POST\] api/admin/imageRepoConfig/:repoName admin修改镜像仓库接口](#post-apiadminimagerepoconfigreponame-admin修改镜像仓库接口)
      - [\[DELETE\] api/admin/imageRepoConfig/:repoName admin删除镜像仓库接口](#delete-apiadminimagerepoconfigreponame-admin删除镜像仓库接口)
      - [\[POST\] api/admin/artifactRepoConfig admin新增依赖与制品仓库接口](#post-apiadminartifactrepoconfig-admin新增依赖与制品仓库接口)
      - [\[POST\] api/admin/artifactRepoConfig/:repoName admin修改依赖与制品仓库接口](#post-apiadminartifactrepoconfigreponame-admin修改依赖与制品仓库接口)
      - [\[DELETE\] api/admin/artifactRepoConfig/:repoName admin删除依赖与制品仓库接口](#delete-apiadminartifactrepoconfigreponame-admin删除依赖与制品仓库接口)
      - [\[POST\] api/admin/scanCodeRepoConfig admin新增代码扫描仓库接口](#post-apiadminscancoderepoconfig-admin新增代码扫描仓库接口)
      - [\[POST\] api/admin/scanCodeRepoConfig/:repoName admin修改代码扫描仓库接口](#post-apiadminscancoderepoconfigreponame-admin修改代码扫描仓库接口)
      - [\[DELETE\] api/admin/scanCodeRepoConfig/:repoName admin删除代码扫描仓库接口](#delete-apiadminscancoderepoconfigreponame-admin删除代码扫描仓库接口)
      - [\[POST\] api/admin/envs admin环境列表与搜索接口](#post-apiadminenvs-admin环境列表与搜索接口)
      - [\[GET\] api/admin/envNames admin环境名列表接口，用于选择可用环境的下拉列表](#get-apiadminenvnames-admin环境名列表接口用于选择可用环境的下拉列表)
      - [\[GET\] api/admin/envNames/search admin环境名列表接口，用于搜索的下拉列表](#get-apiadminenvnamessearch-admin环境名列表接口用于搜索的下拉列表)
      - [\[POST\] api/admin/envNames/tenantCode admin环境名列表接口，用于项目查看页项目为项目分配新环境用途](#post-apiadminenvnamestenantcode-admin环境名列表接口用于项目查看页项目为项目分配新环境用途)
      - [\[GET\] api/admin/archNames admin架构名字列表接口](#get-apiadminarchnames-admin架构名字列表接口)
      - [\[POST\] api/admin/env admin新增环境接口](#post-apiadminenv-admin新增环境接口)
      - [\[GET\] api/admin/env admin获取新增环境默认内容接口](#get-apiadminenv-admin获取新增环境默认内容接口)
      - [\[DELETE\] api/admin/env/:envName admin删除环境接口](#delete-apiadminenvenvname-admin删除环境接口)
      - [\[POST\] api/admin/env/:envName admin修改环境配置接口](#post-apiadminenvenvname-admin修改环境配置接口)
      - [\[POST\] api/admin/env/:envName/pvAdd admin为环境分配pv接口](#post-apiadminenvenvnamepvadd-admin为环境分配pv接口)
      - [\[GET\] api/admin/env/:envName/pvs admin获取环境所有pv列表接口](#get-apiadminenvenvnamepvs-admin获取环境所有pv列表接口)
      - [\[GET\] api/admin/env/:envName/pvNames admin获取环境可用pv列表接口](#get-apiadminenvenvnamepvnames-admin获取环境可用pv列表接口)
      - [\[POST\] api/admin/env/:envName/pvDelete admin为环境回收pv接口](#post-apiadminenvenvnamepvdelete-admin为环境回收pv接口)
      - [\[GET\] api/admin/env/:envName/scs admin获取环境所有storageclass列表接口](#get-apiadminenvenvnamescs-admin获取环境所有storageclass列表接口)
      - [\[GET\] api/admin/env/:envName/scNames admin获取环境所有storageclass名字列表接口](#get-apiadminenvenvnamescnames-admin获取环境所有storageclass名字列表接口)
      - [\[POST\] api/admin/componentTemplates admin获取组件模板列表接口](#post-apiadmincomponenttemplates-admin获取组件模板列表接口)
      - [\[GET\] api/admin/componentTemplate admin获取默认新增组件模板内容接口](#get-apiadmincomponenttemplate-admin获取默认新增组件模板内容接口)
      - [\[POST\] api/admin/componentTemplate admin新增组件模板接口](#post-apiadmincomponenttemplate-admin新增组件模板接口)
      - [\[DELETE\] api/admin/componentTemplate/:componentTemplateName admin删除组件模板接口](#delete-apiadmincomponenttemplatecomponenttemplatename-admin删除组件模板接口)
      - [\[POST\] api/admin/componentTemplate/:componentTemplateName admin修改组件模板接口](#post-apiadmincomponenttemplatecomponenttemplatename-admin修改组件模板接口)
      - [\[POST\] api/admin/auditLogs admin审计日志列表与搜索接口](#post-apiadminauditlogs-admin审计日志列表与搜索接口)
      - [\[GET\] api/admin/auditLogTypes admin审计日志类型接口，用于搜索的下拉列表](#get-apiadminauditlogtypes-admin审计日志类型接口用于搜索的下拉列表)
      - [\[POST\] api/admin/attachment admin上传申请附件接口](#post-apiadminattachment-admin上传申请附件接口)
      - [\[GET\] api/admin/attachment/:attachmentID admin下载附件接口](#get-apiadminattachmentattachmentid-admin下载附件接口)
      - [\[POST\] api/admin/applies admin申请列表与搜索接口](#post-apiadminapplies-admin申请列表与搜索接口)
      - [\[POST\] api/admin/apply/:applyTicket admin申请各类操作接口（修改/关闭/退回修改/处理/回复/阶段回复）](#post-apiadminapplyapplyticket-admin申请各类操作接口修改关闭退回修改处理回复阶段回复)
      - [\[POST\] api/admin/apply/:applyTicket/:projectName admin申请执行接口](#post-apiadminapplyapplyticketprojectname-admin申请执行接口)
      - [\[POST\] api/admin/mailLogs admin邮件发送日志搜索接口](#post-apiadminmaillogs-admin邮件发送日志搜索接口)
      - [\[PUT\] api/admin/mailLogs admin邮件日志重发接口](#put-apiadminmaillogs-admin邮件日志重发接口)
      - [\[POST\] api/admin/triggerWebhookLogs admin webhook触发日志列表接口](#post-apiadmintriggerwebhooklogs-admin-webhook触发日志列表接口)
      - [\[GET\] api/admin/triggerWebhookLogOptions admin webhook触发日志选项接口](#get-apiadmintriggerwebhooklogoptions-admin-webhook触发日志选项接口)
      - [\[POST\] api/admin/triggerMailLogs admin 邮件触发日志列表接口](#post-apiadmintriggermaillogs-admin-邮件触发日志列表接口)
      - [\[GET\] api/admin/triggerMailLogOptions admin 邮件触发日志选项接口](#get-apiadmintriggermaillogoptions-admin-邮件触发日志选项接口)
      - [\[POST\] api/admin/notifications admin 通知列表接口](#post-apiadminnotifications-admin-通知列表接口)
      - [\[GET\] api/admin/notificationOptions admin 通知选项接口](#get-apiadminnotificationoptions-admin-通知选项接口)
      - [\[POST\] api/admin/announcement admin发布公告接口](#post-apiadminannouncement-admin发布公告接口)
      - [\[DELETE\] api/admin/announcement/:announcementID admin删除公告接口](#delete-apiadminannouncementannouncementid-admin删除公告接口)
      - [\[GET\] api/admin/announcementOptions admin 公告选项接口](#get-apiadminannouncementoptions-admin-公告选项接口)
      - [\[POST\] api/admin/announcement/attachment admin上传公告附件接口](#post-apiadminannouncementattachment-admin上传公告附件接口)
      - [\[GET\] api/admin/adminWebhookVars admin管理webhook变量说明接口](#get-apiadminadminwebhookvars-admin管理webhook变量说明接口)
      - [\[GET\] api/admin/adminWebhooks admin管理webhook列表接口](#get-apiadminadminwebhooks-admin管理webhook列表接口)
      - [\[GET\] api/admin/adminWebhookOptions admin管理webhook选项列表接口](#get-apiadminadminwebhookoptions-admin管理webhook选项列表接口)
      - [\[POST\] api/admin/adminWebhook admin新增管理webhook接口](#post-apiadminadminwebhook-admin新增管理webhook接口)
      - [\[POST\] api/admin/adminWebhook/:adminWebhookID admin修改管理webhook接口](#post-apiadminadminwebhookadminwebhookid-admin修改管理webhook接口)
      - [\[DELETE\] api/admin/adminWebhook/:adminWebhookID admin删除管理webhook接口](#delete-apiadminadminwebhookadminwebhookid-admin删除管理webhook接口)
      - [\[POST\] api/admin/adminWebhookLogs admin管理webhook触发日志列表接口](#post-apiadminadminwebhooklogs-admin管理webhook触发日志列表接口)
      - [\[POST\] api/admin/customStepConfs admin自定义步骤配置列表与搜索接口](#post-apiadmincustomstepconfs-admin自定义步骤配置列表与搜索接口)
      - [\[POST\] api/admin/customStepConf admin自定义步骤配置新增接口](#post-apiadmincustomstepconf-admin自定义步骤配置新增接口)
      - [\[POST\] api/admin/customStepConf/:customStepName admin自定义步骤配置修改接口](#post-apiadmincustomstepconfcustomstepname-admin自定义步骤配置修改接口)
      - [\[DELETE\] api/admin/customStepConf/:customStepName admin自定义步骤配置删除接口](#delete-apiadmincustomstepconfcustomstepname-admin自定义步骤配置删除接口)
      - [\[GET\] api/admin/repoNames admin可用仓库配置选项接口，用于新增项目的下拉列表](#get-apiadminreponames-admin可用仓库配置选项接口用于新增项目的下拉列表)
      - [\[GET\] api/admin/repoNames/search admin可用仓库配置选项接口，用于搜索的下拉列表](#get-apiadminreponamessearch-admin可用仓库配置选项接口用于搜索的下拉列表)
      - [\[POST\] api/admin/repoNames/tenantCode admin可用仓库配置选项接口，用于自定义步骤页面选择代码仓库用途](#post-apiadminreponamestenantcode-admin可用仓库配置选项接口用于自定义步骤页面选择代码仓库用途)

## api接口

### admin 管理控制台接口

- url: api/admin/
- 需要校验`x-user-token`

#### [POST] api/admin/appConfig 获取应用配置接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "appConfig": "xxx",
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```
#### [POST] api/admin/reload 重新读取所有配置并重新检测环境网格配置

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```
#### [POST] api/admin/license 请求license

- request请求内容
```json
{
    "mail": "xxx",
    "appVersion": "xxx",
    "privateToken": "xxx",
    "expiresDate": "xxx",
    "featuresAvailable": {
        "meshAvailable": true,
        "executeNumber": 10,
        "dockerNumber": 10,
        "projectNumber": 10,
        "buildDefNumber": 100,
        "envNumber": 10,
        "gitRepoNumber": 10,
        "imageRepoNumber": 10,
        "artifactRepoNumber": 10,
        "scanCodeRepoNumber": 10,
        "deployPatchEnable": true,
        "deployConfigMapEnable": true,
        "deploySecretEnable": true,
        "archesEnable": true,
        "extraQuotaEnable": true
    },
}
```

  - executeNumber: 0表示不限制
  - dockerNumber: 0表示不限制
  - projectNumber: 0表示不限制
  - buildDefNumber: 0表示不限制
  - envNumber: 0表示不限制
  - gitRepoNumber: 0表示不限制，-1表示禁止
  - imageRepoNumber: 0表示不限制，-1表示禁止
  - artifactRepoNumber: 0表示不限制，-1表示禁止
  - scanCodeRepoNumber: 0表示不限制，-1表示禁止

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "licenseKey": "xxx",
    }
}
```
#### [GET] api/admin/projectNames admin项目名称列表接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "projectNames": [
            "test-project1",
            "test-project2"
        ]
    }
}
```

#### [POST] api/admin/projectNames/tenantCode admin项目名称列表接口，用于用户列表页设置项目member选择项目用途

- request请求内容
```json
{
    "tenantCode": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "projectNames": [
            "test-project1",
            "test-project2"
        ]
    }
}
```

#### [GET] api/admin/projectEnvs admin项目与可用环境列表接口，用于把主机/数据库加入到项目环境

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list projectEnv success",
    "duration": "495.347µs",
    "data": {
        "auditID": "605bfb70e4e75c57c8d12abc",
        "projectEnvs": [
            {
                "envNames": [
                    "test"
                ],
                "projectName": "test-project1"
            }
        ],
        "withAdminLog": false
    }
}
```

#### [GET] api/admin/projectNamespaces admin项目名字空间列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list project namespaces success",
    "duration": "495.347µs",
    "data": {
        "auditID": "605bfb70e4e75c57c8d12abc",
        "projectNamespaces": [
            "xxx",
        ],
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/projects admin项目列表与搜索接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "envNames": [
        "xxx",
        "xxx"
    ],
    "tenantCodes": [
        "xxx",
        "xxx"
    ],
    "projectTeam": "xxx",
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

- sortMode: createTimeDesc, createTimeAsc, projectNameAsc, projectTeamAsc


- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list projects success",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "projects": [
            {
                "tenantCode": "xxx",
                "createTime": "xxx",
                "projectInfo" : {
                    "projectName" : "test-project1",
                    "projectNamespace" : "test-project1",
                    "projectShortName" : "tp1",
                    "shortName" : "tp1",
                    "projectDesc" : "测试-项目1",
                    "projectTeam" : "测试团队1",
                },
                "projectRepo": {
                    "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
                    "gitRepoType": "internalCreate",
                    "gitRepoDir": {
                        "buildSettingsDir": "xxx",
                        "databaseScriptsDir": "xxx",
                        "demoCodesDir": "xxx",
                        "deployScriptsDir": "xxx",
                        "documentsDir": "xxx",
                        "testScriptsDir": "xxx",
                    },
                    "artifactRepo": "https://nexus.dory.cookeem.com",
                    "artifactRepoType": "xxx",
                    "imageRepo": "https://registry.dory.cookeem.com",
                    "imageRepoName": "harbor-dory",
                    "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects",
                    "scanCodeRepoName": "xxx"
                },
                "projectAvailableEnvs": [
                    {
                        "envName" : "test",
                        "privileged": false,
                        "disabledDefs": [],
                        "disabledPatches": [],
                    }
                ],
                "projectNodePorts": [
                    {
                        "envName": "devops",
                        "privileged": false,
                        "envNodePorts": [
                            {
                                "isDefault": true,
                                "nodePortStart": 30100,
                                "nodePortEnd": 30109,
                            }
                        ]
                    }
                ],
               "pipelines": [
                    {
                        "pipelineName" : "test-project1-develop",
                        "branchName" : "develop",
                        "envs": [
                            "test"
                        ],
                        "envProductions": [
                        ],
                        "pipelineArch": "amd64",
                        "successCount" : 20,
                        "failCount" : 2,
                        "abortCount" : 3,
                        "status": {
                            "result" : "SUCESS",
                            "startTime" : "02-14 12:12:12",
                            "duration" : "1m30s"
                        }
                    },
                ]
            }
        ],
        "totalCount": 10
    }
}
```

#### [POST] api/admin/project admin新增项目接口

- request请求内容
```json
{
    "projectInfo": {
        "projectName": "xxx",
        "projectNamespace": "xxx",
        "projectDesc": "xxx",
        "projectShortName": "xxx",
        "projectTeam": "xxx",
        "defaultPv": "xxx",
    },
    "gitRepoSetting": {
        "gitRepoType": "xxx",
        "gitRepoName": "xxx",
        "gitRepoPath": "xxx",
        "gitRepoUrl": "xxx",
        "gitRepoSourceBranch": "xxx",
        "gitRepoUser": "xxx",
        "gitRepoToken": "xxx",
        "gitRepoPassword": "xxx",
        "gitRepoDir": {
            "buildSettingsDir": "xxx",
            "databaseScriptsDir": "xxx",
            "demoCodesDir": "xxx",
            "deployScriptsDir": "xxx",
            "documentsDir": "xxx",
            "testScriptsDir": "xxx",
        },
    },
    "imageRepoSetting": {
        "imageRepoName": "xxx",
        "storageLimit": 0,
        "imageRepoHostName": "xxx",
        "imageRepoGroupName": "xxx",
        "imageRepoUserName": "xxx",
        "imageRepoPassword": "xxx",
    },
    "artifactRepoSetting": {
        "artifactRepoType": "xxx",
        "artifactRepoName": "xxx",
        "artifactRepoHostName": "xxx",
        "artifactRepoPort": 21,
        "artifactRepoPath": "xxx",
        "artifactRepoUserName": "xxx",
        "artifactRepoPassword": "xxx",
        "artifactRepoHttpUpload": {
            "url": "xxx",
            "insecure": false,
            "method": "xxx",
        },
        "artifactRepoHttpDownload": {
            "url": "xxx",
            "insecure": false,
        }
    },
    "scanCodeRepoSetting": {
        "scanCodeRepoName": "xxx",
    },
    "tenantCode": "xxx",
    "envName": "xxx",
    "nodePort": 0,
    "enableArtifactRepoProxy": true,
    "createDemoOnExistGitRepo": true,
}
```

    - gitRepoType: 代码仓库连接方式: internalCreate/internalExist/githubCreate/githubExist/giteeCreate/giteeExist/externalExist

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName admin项目查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project success",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "project": {
            "tenantCode": "xxx",
            "projectInfo" : {
                "projectName" : "test-project1",
                "projectNamespace" : "test-project1",
                "projectShortName" : "tp1",
                "shortName" : "tp1",
                "projectDesc" : "测试-项目1",
                "projectTeam" : "测试团队1",
            },
            "projectRepo": {
                "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
                "gitRepoType": "internalCreate",
                "gitRepoDir": {
                    "buildSettingsDir": "xxx",
                    "databaseScriptsDir": "xxx",
                    "demoCodesDir": "xxx",
                    "deployScriptsDir": "xxx",
                    "documentsDir": "xxx",
                    "testScriptsDir": "xxx",
                },
                "artifactRepo": "https://nexus.dory.cookeem.com",
                "artifactRepoType": "xxx",
                "imageRepo": "https://registry.dory.cookeem.com",
                "imageRepoName": "harbor-dory",
                "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects",
                "scanCodeRepoName": "xxx"
            },
            "projectNodePorts": [
                {
                    "envName": "devops",
                    "privileged": false,
                    "envNodePorts": [
                        {
                            "isDefault": true,
                            "nodePortStart": 30100,
                            "nodePortEnd": 30109,
                        }
                    ],
                    "nodePorts": [
                        30104,
                    ],
                }
            ],
            "projectAvailableEnvs": [
                {
                    "envName" : "test",
                    "privileged": false,
                    "disabledDefs": [],
                    "disabledPatches": [],
                    "nodeNames": [
                        "vm-dory"
                    ],
                    "nodeLabels": [
                        {
                            "text": "xxx=yyy",
                            "name": "xxx",
                            "value": "yyy"
                        }
                    ],
                    "envArch": "amd64",
                    "arches": [
                        "amd64"
                    ],
                    "quotaConfig" : {
                        "defaultQuota" : {
                            "memoryRequest" : "20Mi",
                            "cpuRequest" : "10m",
                            "memoryLimit" : "50Mi",
                            "cpuLimit" : "50m",
                            "extraRequest" : [
                                {
                                    "name" : "xxx",
                                    "value" : "xxx",
                                }
                            ],
                            "extraLimit" : [
                                {
                                    "name" : "xxx",
                                    "value" : "xxx",
                                }
                            ],
                        },
                        "namespaceQuota" : {
                            "memoryRequest" : "500Mi",
                            "cpuRequest" : "500m",
                            "memoryLimit" : "2Gi",
                            "cpuLimit" : "2000m",
                            "podsLimit" : 32,
                            "extraQuotas" : [
                                {
                                    "name" : "xxx",
                                    "value" : "xxx",
                                }
                            ],
                        },
                        "usedQuota": {
                            "cpuLimit": "4002m",
                            "cpuRequest": "650m",
                            "memoryLimit": "4302Mi",
                            "memoryRequest": "410Mi",
                            "podsLimit": 19,
                            "extraQuotas" : [
                                {
                                    "name" : "xxx",
                                    "value" : "xxx",
                                    "hard" : "xxx",
                                }
                            ],
                        },
                        "resourceRate": {
                            "cpuLimitRate": 0.667,
                            "cpuRequestRate": 0.325,
                            "memoryLimitRate": 0.717,
                            "memoryRequestRate": 0.205,
                            "podsRate": 0.594
                        }
                    },
                    "k8sToken": "xxx",
                    "dashboardUrl":	"https://k8s.dory.cookeem.com/#/workloads?namespace=test-project1",
                    "dashboardUrlNetworkPolicy": "https://k8s.dory.cookeem.com/#/networkpolicy?namespace=test-project1",
                    "refreshTime" : "02-03 12:12:12",
                    "pvs": [
                        {
                            "pvcName": "xxx-pv-pvc",
                            "pvName": "xxx-pv",
                            "pvYaml": "apiVersion: v1\nkind: PersistentVolume\nmetadata:\n  annotations:\n    volume.beta.kubernetes.io/storage-class: xxx-pv\n  labels:\n    app: xxx-pv\n  name: xxx-pv\nspec:\n  accessModes:\n  - ReadWriteOnce\n  capacity:\n    storage: 200Gi\n  hostPath:\n    path: /data/k8s-vols/xxx\n    type: DirectoryOrCreate\n  volumeMode: Filesystem",
                            "pvType": "hostPath",
                            "claimRef": {
                                "apiVersion": "v1",
                                "kind": "PersistentVolumeClaim",
                                "name": "xxx-pv-pvc",
                                "namespace": "test-project5"
                            },
                            "status": {
                                "message": "",
                                "phase": "Bound",
                                "reason": ""
                            },
                        }
                    ],
                    "networkPolicies": [
                        {
                            "name": "test-project1-restrict-ingress",
                            "networkPolicyYaml": "xxx",
                            "policyTypes": [
                                "Ingress"
                            ]
                        }
                    ],
                    "hosts": [
                        {
                            "hostName": "host-node01",
                            "hostAddr": "192.168.20.2",
                            "hostPort": 22,
                            "hostUser": "aaa-aaa1",
                            "hostPassword": "aaa-aaa2",
                            "hostBecome": true,
                            "hostBecomePassword": "aaa-aaa3",
                            "createUser": "devops-admin",
                            "createTime": "03-11 15:44:02",
                            "updateTime": "03-11 15:44:02",
                            "groups": [
                                "xxx"
                            ],
                            "variables": {
                                "xxx": "v1",
                                "yyy": "v2",
                            },
                        }
                    ],
                    "databases": [
                        {
                            "dbName": "db-node01",
                            "dbUrl": "jdbc:xmysql://<host>:<port>/<database_name>",
                            "dbUser": "dbx-aaa1",
                            "dbPassword": "dbx-aaa2",
                            "createUser": "devops-admin",
                            "createTime": "03-11 15:44:02",
                            "updateTime": "03-11 15:44:02"
                        }
                    ],
                    "componentDebug": {
                        "createTime": "06-17 11:12:29",
                        "deploySpecDebug": {
                            "debugQuota": {
                                "cpuLimit": "100m",
                                "cpuRequest": "10m",
                                "memoryLimit": "100Mi",
                                "memoryRequest": "10Mi",
                                "extraRequest" : [
                                    {
                                        "name" : "xxx",
                                        "value" : "xxx",
                                    }
                                ],
                                "extraLimit" : [
                                    {
                                        "name" : "xxx",
                                        "value" : "xxx",
                                    }
                                ],
                            },
                            "ingress": {
                                "domainName": "",
                                "pathPrefix": "",
                                "certSelfSigned": false,
                                "certBranch": "",
                                "certPath": false,
                            }
                        },
                        "podStatuses": [
                            {
                                "age": "3s116ms",
                                "imageName": "registry.dory.cookeem.com/public/ssh-debug:v1.1.5",
                                "podName": "tp1-ssh-debug-db65c949f-q22jt",
                                "podSpec": "xxx",
                                "ready": "0/1",
                                "reason": "ErrImagePull",
                                "restart": "0"
                            },
                            {
                                "age": "2s804ms",
                                "imageName": "registry.dory.cookeem.com/public/vnc-debug:v1.6.1",
                                "podName": "tp1-vnc-debug-864f497979-qmzcn",
                                "ready": "0/1",
                                "reason": "ErrImagePull",
                                "restart": "0"
                            }
                        ],
                        "deploymentYaml": "xxx",
                        "serviceYaml": "xxx",
                        "ingressYaml": "xxx",
                        "k8sDeploymentYaml": "xxx",
                        "k8sServiceYaml": "xxx",
                        "k8sIngressYaml": "xxx",
                        "updateTime": "06-17 11:12:34"
                    },
                    "components": [
                        {
                            "componentDesc": "mysql-v8023",
                            "componentName": "tp1-mysql",
                            "createTime": "06-17 11:12:56",
                            "deploySpecStatic": {
                                "dependServices": null,
                                "deployArgs": [
                                    "--max-allowed-packet=268435456",
                                    "--character-set-server=utf8mb4",
                                    "--collation-server=utf8mb4_unicode_ci"
                                ],
                                "deployCmd": null,
                                "deployCommand": "",
                                "deployEnvs": [
                                    "MYSQL_ROOT_PASSWORD=jhYWl1RUl2yLmAEP",
                                    "MYSQL_DATABASE=testdb",
                                    "MYSQL_USER=testuser",
                                    "MYSQL_PASSWORD=IKQdXoUfAsc1WcmlR"
                                ],
                                "deployHealthCheck": {
                                    "checkPort": 3306,
                                    "httpGet": {
                                        "httpHeaders": null,
                                        "path": "",
                                        "port": 0
                                    },
                                    "livenessDelaySeconds": 60,
                                    "livenessPeriodSeconds": 30,
                                    "readinessDelaySeconds": 15,
                                    "readinessPeriodSeconds": 5
                                },
                                "deployImage": "mysql:8.0.23",
                                "deployLocalPorts": [
                                    {
                                        "port": 3306,
                                        "protocol": "tcp"
                                    }
                                ],
                                "deployName": "tp1-mysql",
                                "deployNodePorts": null,
                                "deployReplicas": 1,
                                "deployResources": {
                                    "cpuLimit": "1",
                                    "cpuRequest": "0.2",
                                    "memoryLimit": "400Mi",
                                    "memoryRequest": "20Mi",
                                    "extraRequest" : [
                                        {
                                            "name" : "xxx",
                                            "value" : "xxx",
                                        }
                                    ],
                                    "extraLimit" : [
                                        {
                                            "name" : "xxx",
                                            "value" : "xxx",
                                        }
                                    ],
                                },
                                "deploySessionAffinityTimeoutSeconds": 0,
                                "deployVolumes": [
                                    {
                                        "pathInPod": "/var/lib/mysql",
                                        "pathInPv": "tp1-mysql",
                                        "pvc": ""
                                    }
                                ],
                                "hostAliases": null,
                                "securityContext": {
                                    "runAsGroup": 0,
                                    "runAsUser": 0
                                }
                            },
                            "deploymentYaml": "xxx",
                            "podStatuses": [
                                {
                                    "age": "3s565ms",
                                    "imageName": "101.36.228.198:30004/mysql:8.0.23",
                                    "podName": "tp1-mysql-84cb7c69b4-z6pwc",
                                    "podSpec": "xxx",
                                    "ready": "0/1",
                                    "reason": "ImagePullBackOff",
                                    "restart": "0"
                                }
                            ],
                            "serviceYaml": "xxx",
                            "updateTime": "06-17 11:12:59"
                        }
                    ],
                }
            ],
            "projectSecret" : {
                "harborPassword" : "xxx",
                "nexusPassword" : "xxx",
                "sonarPassword" : "xxx",
                "sonarToken" : "xxx",
                "refreshTime" : "12-12 12:12:12"
            },
            "pipelines": [
                {
                    "pipelineName" : "test-project1-develop",
                    "url": "xxx",
                    "branchName" : "develop",
                    "isDefault" : true,
                    "webhookPushEvent" : true,
                    "envs": [
                        "test"
                    ],
                    "envProductions": [
                    ],
                    "pipelineArch": "amd64",
                    "pipelineCrons": [
                        {
                            "crontabMinute": 10,
                            "crontabHour": 23,
                            "crontabDay": -1,
                            "crontabMonth": -1,
                            "crontabWeek": -1,
                        }
                    ],
                    "pipelineTriggers": [
                        {
                            "beforeExecute": false,
                            "enable": true,
                            "checkVarToIgnore": "",
                            "mailAttachmentFormat": "yaml",
                            "mailCommittees": true,
                            "mailContent": "{{ .projectName }} {{ .pipelineName }}\n{{ .stepDetail | toYaml }}",
                            "mailReceivers": [
                                "13802881119@139.com"
                            ],
                            "mailTitle": "{{ .projectName }}",
                            "noticeCommittees": true,
                            "noticeUsernames": [
                                "dory-admin"
                            ],
                            "statusResults": [
                                "FAIL"
                            ],
                            "stepAction": "",
                            "insecure": false,
                            "webhookBody": "",
                            "webhookForms": [],
                            "webhookHeaders": [],
                            "webhookMethod": "GET",
                            "webhookQueryParams": [],
                            "webhookUrl": "https://www.baidu.com"
                        }                    
                    ],
                },
            ],
            "projectMembers": [
                {
                    "username": "xxx",
                    "name": "xxx",
                    "avatarUrl": "xxx",
                    "accessLevel": "xxx",
                    "disableProjectDefs": [
                        "xxx",
                    ],
                    "disableRepoSecrets": [
                        "xxx",
                    ],
                    "disablePipelines": [
                        "xxx",
                    ],
                    "isAdmin": "xxx",
                    "isActive": "xxx",
                    "updateTime": "xxx",
                }
            ],
        }
    }
}
```

#### [POST] api/admin/project/:projectName/delete admin删除项目接口

- request请求内容
```json
{
    "gitRepoDelete": false,
    "scanCodeRepoDelete": false,
    "imageRepoDelete": false,
    "artifactRepoDelete": false,
    "namespaceDelete": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName admin修改项目接口

- request请求内容
```json
{
    "projectDesc": "xxx",
    "projectTeam": "xxx",
    "gitRepoUser": "xxx",
    "gitRepoToken": "xxx",
    "gitRepoPassword": "xxx",
    "gitRepoDir": {
        "buildSettingsDir": "xxx",
        "databaseScriptsDir": "xxx",
        "demoCodesDir": "xxx",
        "deployScriptsDir": "xxx",
        "documentsDir": "xxx",
        "testScriptsDir": "xxx",
    },
    "imageRepoHostName": "xxx",
    "imageRepoGroupName": "xxx",
    "imageRepoUserName": "xxx",
    "imageRepoPassword": "xxx",
    "artifactRepoHostName": "xxx",
    "artifactRepoPort": 21,
    "artifactRepoPath": "xxx",
    "artifactRepoUserName": "xxx",
    "artifactRepoPassword": "xxx",
    "artifactRepoHttpUpload": {
        "url": "xxx",
        "insecure": false,
        "method": "xxx",
    },
    "artifactRepoHttpDownload": {
        "url": "xxx",
        "insecure": false,
    },
    "scanCodeRepoName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/nodePortAdd admin为项目分配NodePort接口

- request请求内容
```json
{
    "nodePort": 0
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/nodePortDelete admin为项目回收NodePort接口

- request请求内容
```json
{
    "nodePort": 30100,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envAdd admin为项目分配新环境接口

- request请求内容
```json
{
    "envNames": [
        "xxx",
        "xxx",
    ]
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envDelete admin为项目回收环境接口

- request请求内容
```json
{
    "envName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envDeleteAll admin为项目回收环境并清理名字空间接口

- request请求内容
```json
{
    "envName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envUpdate admin修改项目环境设置接口

- request请求内容
```json
{
    "envName": "xxx",
    "privileged": false,
    "disabledDefs": [
        "xxx",
    ],
    "disabledPatches": [
        "xxx",
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/refreshToken admin为项目更新所有密钥接口

- request请求内容
```json
{
    "harborPassword": "xxx",
    "nexusPassword": "xxx",
    "sonarPassword": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/reApply admin重新应用项目配置到所有可用环境

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/cleanGitRepo admin清理临时代码仓库

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName/members admin项目分配用户列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "members": [
            {
                "username": "xxx",
                "name": "xxx",
                "mail": "xxx",
                "mobile": "xxx",
                "avatarUrl": "xxx",
                "isAdmin": false,
                "isActive": false,
                "accessLevel": "xxx",
                "disableProjectDefs": [
                    "xxx",
                ],
                "disableRepoSecrets": [
                    "xxx",
                ],
                "disablePipelines": [
                    "xxx",
                ],
                "updateTime": "xxx",
            }
        ]
    }
}
```

#### [POST] api/admin/project/:projectName/memberAdd admin为项目分配用户接口

- request请求内容
```json
{
    "username": "xxx",
    "accessLevel": "xxx",
    "disableProjectDefs": [
        "xxx",
    ],
    "disableRepoSecrets": [
        "xxx",
    ],
    "disablePipelines": [
        "xxx",
    ],
}
```

    - accessLevel: 角色 maintainer / developer / runner
    - disableProjectDefs: pipelineDef / buildDef / packageDef / artifactDef / dockerIgnoreDef / customStepDef / customOpsDef / opsBatchDef / deployContainerDef / deployArtifactDef / istioDef / istioGatewayDef
    - disableRepoSecrets: image / artifact / scanCode / k8s

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/memberDelete admin为项目移除用户接口

- request请求内容
```json
{
    "username": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/memberUpdate admin为项目修改用户角色接口

- request请求内容
```json
{
    "username": "xxx",
    "accessLevel": "xxx",
    "disableProjectDefs": [
        "xxx",
    ],
    "disableRepoSecrets": [
        "xxx",
    ],
    "disablePipelines": [
        "xxx",
    ],
}
```

    - accessLevel: 角色 maintainer / developer / runner
    - disableProjectDefs: pipelineDef / buildDef / packageDef / artifactDef / dockerIgnoreDef / customStepDef / customOpsDef / opsBatchDef / deployContainerDef / deployArtifactDef / istioDef / istioGatewayDef
    - disableRepoSecrets: image / artifact / scanCode / k8s

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName/branchNames admin查看当前项目代码仓库分支接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "branchNames": [
            "xxx"
        ],
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineAdd admin为项目新增流水线接口

- request请求内容
```json
{
    "branchName": "xxx",
    "sourceBranch": "xxx",
    "envs": [
        "xxx"
    ],
    "envProductions": [
        "xxx"
    ],
    "webhookPushEvent": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineDelete admin为项目删除流水线接口


- request请求内容
```json
{
    "branchName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineEnvAdd admin为项目流水线新增环境接口

- request请求内容
```json
{
    "branchName": "xxx",
    "envName": "xxx",
    "isProductionEnv": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineEnvDelete admin为项目流水线删除环境接口

- request请求内容
```json
{
    "branchName": "xxx",
    "envName": "xxx",
    "isProductionEnv": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineGitWebhook admin为项目流水线设置git webhook触发器接口

- request请求内容
```json
{
    "branchName": "xxx",
    "webhookPushEvent": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineTokenRefresh admin重置流水线token接口

- request请求内容
```json
{
    "branchName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineCronAdd admin为项目流水线新增计划任务接口

- request请求内容
```json
{
    "branchName": "xxx",
    "crontabMinute": -1,
    "crontabHour": 0,
    "crontabDay": -1,
    "crontabMonth": -1,
    "crontabWeek": -1,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineCronCopy admin为项目流水线复制计划任务接口

- request请求内容
```json
{
    "branchNames": ["xxx"],
    "crontabMinute": -1,
    "crontabHour": 0,
    "crontabDay": -1,
    "crontabMonth": -1,
    "crontabWeek": -1,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineCronDelete admin为项目流水线移除计划任务接口

- request请求内容
```json
{
    "branchName": "xxx",
    "crontabStr": "1 1 1 1 1",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName/pipelineTriggerStepActions admin触发器步骤选项接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "stepActions": [
            {
                "text": "xxx",
                "value": "xxx",
            },
        ],
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineTriggerOp admin为项目流水线新增修改触发器接口

- request请求内容
```json
{
	"branchName": "xxx",
    "beforeExecute": false,
	"stepActions": [
        "xxx"
    ],
	"statusResults": [
        "SUCCCESS"
    ],
	"enable": false,
    "checkVarToIgnore": "",
	"webhookUrl": "xxx",
    "insecure": false,
	"webhookMethod": "xxx",
    "webhookHeaders": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookQueryParams": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookForms": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookBody": "xxx",
    "mailTitle": "xxx",
    "mailContent": "xxx",
    "mailAttachmentFormat": "xxx",
	"mailCommittees": false,
	"mailReceivers": [
        "xxx@xxx.xxx",
    ],
	"noticeCommittees": false,
	"noticeUsernames": [
        "xxx@xxx.xxx",
    ]
}
```

    - statusResults: 状态
        "SUCCESS": 执行成功
        "FAIL": 执行失败

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineTriggerCopy admin为项目流水线复制触发器接口

- request请求内容
```json
{
	"branchNames": ["xxx"],
    "beforeExecute": false,
	"stepActions": [
        "xxx"
    ],
	"statusResults": [
        "SUCCCESS"
    ],
	"enable": false,
    "checkVarToIgnore": "",
	"webhookUrl": "xxx",
    "insecure": false,
	"webhookMethod": "xxx",
    "webhookHeaders": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookQueryParams": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookForms": {
        "key1": "value1",
        "key2": "value2",
    },
    "webhookBody": "xxx",
    "mailTitle": "xxx",
    "mailContent": "xxx",
    "mailAttachmentFormat": "xxx",
	"mailCommittees": false,
	"mailReceivers": [
        "xxx@xxx.xxx",
    ],
	"noticeCommittees": false,
	"noticeUsernames": [
        "xxx@xxx.xxx",
    ]
}
```

    - statusResults: 状态
        "SUCCESS": 执行成功
        "FAIL": 执行失败

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/pipelineTriggerDelete admin为项目流水线移除触发器接口

- request请求内容
```json
{
	"branchName": "xxx",
	"stepAction": "xxx",
    "beforeExecute": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envQuotaConfigUpdate admin为项目环境设置quotaConfig接口

- request请求内容
```json
{
    "envName": "xxx",
    "namespaceQuota": {
        "memoryRequest": "100Mi",
        "cpuRequest": "100m",
        "memoryLimit": "1Gi",
        "cpuLimit": "1",
        "podsLimit": 64,
        "extraQuotas" : [
            {
                "name" : "xxx",
                "value" : "xxx",
            }
        ],
    },
    "defaultQuota": {
        "memoryRequest": "100Mi",
        "cpuRequest": "100m",
        "memoryLimit": "1Gi",
        "cpuLimit": "1",
        "extraRequest" : [
            {
                "name" : "xxx",
                "value" : "xxx",
            }
        ],
        "extraLimit" : [
            {
                "name" : "xxx",
                "value" : "xxx",
            }
        ],
    }
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envPvcAdd admin为项目环境分配pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "pvNames": [
        "xxx"
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envPvcDelete admin为项目环境回收pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "pvcName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envPvcScAdd admin为项目环境分配存储类pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "scNames": [
        "xxx"
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envNetworkPolicyAdd admin为项目新增网络策略接口

- request请求内容
```json
{
    "envName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envNetworkPolicyDelete admin为项目环境删除网络策略接口

- request请求内容
```json
{
    "envName": "xxx",
    "name": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envHostAdd admin为项目环境分配主机接口

- request请求内容
```json
{
    "envName": "xxx",
    "hostName": "xxx",
    "hostAddr": "xxx",
    "hostPort": 22,
    "hostUser": "xxx",
    "hostPassword": "xxx",
    "hostBecome": false,
    "hostBecomePassword": "xxx",
    "groups": [
        "xxx"
    ],
    "variables": {
        "xxx": "v1",
        "yyy": "v2",
    },
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envHostDelete admin为项目环境回收主机接口

- request请求内容
```json
{
    "envName": "xxx",
    "hostName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envHostJoin admin把主机加入其他项目环境接口

- request请求内容
```json
{
    "envName": "xxx",
    "hostName": "xxx",
    "groups": [
        "xxx"
    ],
    "variables": {
        "xxx": "v1",
        "yyy": "v2",
    },
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envHostLeave admin把主机移除项目环境接口

- request请求内容
```json
{
    "envName": "xxx",
    "hostName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envHostUpdate admin修改主机信息接口

- request请求内容
```json
{
    "envName": "xxx",
    "hostName": "xxx",
    "hostAddr": "xxx",
    "hostPort": 22,
    "hostUser": "xxx",
    "hostPassword": "xxx",
    "hostBecome": false,
    "hostBecomePassword": "xxx",
    "groups": [
        "xxx"
    ],
    "variables": {
        "xxx": "v1",
        "yyy": "v2",
    },
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envDbAdd admin为项目环境分配数据库接口

- request请求内容
```json
{
    "envName": "xxx",
    "dbName": "xxx",
    "dbUrl": "xxx",
    "dbUser": "xxx",
    "dbPassword": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envDbDelete admin为项目环境回收数据库接口

- request请求内容
```json
{
    "envName": "xxx",
    "dbName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envDbJoin admin把数据库加入项目环境接口

- request请求内容
```json
{
    "projectName": "xxx",
    "envName": "xxx",
    "dbName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envDbLeave admin把数据库移除项目环境接口

- request请求内容
```json
{
    "envName": "xxx",
    "dbName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

####  [POST] api/admin/project/:projectName/envDbUpdate admin修改数据库信息接口

- request请求内容
```json
{
    "envName": "xxx",
    "dbName": "xxx",
    "dbUrl": "xxx",
    "dbUser": "xxx",
    "dbPassword": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName/envComponentDebugDefault admin获取debug组件默认模板接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "deploySpecDebug": {
            "debugQuota": {
                "memoryRequest": "10Mi",
                "memoryLimit": "100Mi",
                "cpuRequest": "10m",
                "cpuLimit": "100m",
                "extraRequest" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
                "extraLimit" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
            },
            "ingress": {
                "domainName": "",
                "pathPrefix": "",
                "certSelfSigned": false,
                "certBranch": "",
                "certPath": false,
            }
        },
    }
}
```

#### [POST] api/admin/project/:projectName/envComponentDebugUpdate admin在项目环境调整debug组件接口

- request请求内容
```json
{
    "envName": "xxx",
    "componentDebugYaml": "xxx",
}
```

- componentDebugYaml yaml格式
- 定义项目环境debug组件资源配额

```yaml
# debug容器资源配额*
debugQuota:
  # 请求分配的内存资源*
  # + 100Mi表示100M内存，1Gi表示1G内存
  memoryRequest: 10Mi
  # 最大分配内存资源*
  # + 200Mi表示200M内存，1Gi表示1G内存
  memoryLimit: 100Mi
  # 请求分配的CPU资源*
  # + 100m表示0.1，表示0.1个CPU
  cpuRequest: 10m
  # 最大分配的CPU资源*
  # + 100m表示0.1，表示0.1个CPU
  cpuLimit: 100m
  # 扩展请求资源配额参数设置
  extraRequest:
    # 参数名
  - name: nvidia.com/gpu
    # 参数值
    value: "1"
  # 扩展最大资源配额参数设置
  extraLimit:
    # 参数名
  - name: nvidia.com/gpu
    # 参数值
    value: "1"
# vnc-debug容器启用服务的域名解析
# ++ kubernetes集群外通过域名和子路径访问该服务
# ++ 访问方式为 http://${domainName}${pathPrefix}
ingress:
  # vnc-debug容器访问域名*
  # ++ 访问该服务的域名
  domainName: www.test-project1.local
  # 访问子路径*
  # ++ 访问该服务的子路径前缀
  # ++ 必须以/开头并且以/结尾
  pathPrefix: /c/
  # 是否自动创建自签名证书
  # ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
  certSelfSigned: false
  # 代码仓库中的证书路径
  # ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
  # ++ 假如不启用自动创建自签名证书，需要设置代码仓库中证书和私钥的路径，证书和私钥文件的名字为tls.crt和tls.key
  # ++ 流水线会自动把 <certPath>/test 目录下的tls.crt和tls.key证书保存到test环境的secret中
  # ++ 代码仓库中的证书路径不能以/结尾
  certPath: xxx/yyy
  # 代码仓库中的证书所在的分支
  certBranch: xxxx
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envComponentDebugDelete admin在项目环境删除debug组件接口

- request请求内容
```json
{
    "envName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/project/:projectName/envComponentTemplates admin获取组件模板列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "deploySpecStatic": {
            "deployName": "tp1-mysql",
            "deployImage": "mysql:8.0.23",
            "deploySessionAffinityTimeoutSeconds": 0,
            "deployNodePorts": null,
            "deployLocalPorts": [
                {
                    "port": 3306,
                    "protocol": "tcp"
                }
            ],
            "deployReplicas": 1,
            "deployEnvs": [
                "MYSQL_ROOT_PASSWORD=jhYWl1RUl2yLmAEP",
                "MYSQL_DATABASE=testdb",
                "MYSQL_USER=testuser",
                "MYSQL_PASSWORD=IKQdXoUfAsc1WcmlR"
            ],
            "deployCommand": "",
            "deployCmd": null,
            "deployArgs": [
                "--max-allowed-packet=268435456",
                "--character-set-server=utf8mb4",
                "--collation-server=utf8mb4_unicode_ci"
            ],
            "deployResources": {
                "memoryRequest": "20Mi",
                "memoryLimit": "400Mi",
                "cpuRequest": "0.2",
                "cpuLimit": "1",
                "extraRequest" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
                "extraLimit" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
            },
            "deployVolumes": [
                {
                    "pathInPod": "/var/lib/mysql",
                    "pathInPv": "tp1-mysql",
                    "pvc": ""
                }
            ],
            "deployHealthCheck": {
                "checkPort": 3306,
                "httpGet": {
                    "path": "",
                    "port": 0,
                    "httpHeaders": null
                },
                "readinessDelaySeconds": 15,
                "readinessPeriodSeconds": 5,
                "livenessDelaySeconds": 60,
                "livenessPeriodSeconds": 30
            },
            "dependServices": null,
            "hostAliases": null,
            "securityContext": {
                "runAsUser": 0,
                "runAsGroup": 0
            }
        },
        "componentTemplates": [
            {
                "componentTemplateDesc": "xxx",
                "componentTemplateName": "xxx",
                "tenantCode": "xxx",
                "deploySpecStatic": {
                    "deployName": "tp1-mysql",
                    "deployImage": "mysql:8.0.23",
                    "deploySessionAffinityTimeoutSeconds": 0,
                    "deployNodePorts": null,
                    "deployLocalPorts": [
                        {
                            "port": 3306,
                            "protocol": "tcp"
                        }
                    ],
                    "deployReplicas": 1,
                    "deployEnvs": [
                        "MYSQL_ROOT_PASSWORD=jhYWl1RUl2yLmAEP",
                        "MYSQL_DATABASE=testdb",
                        "MYSQL_USER=testuser",
                        "MYSQL_PASSWORD=IKQdXoUfAsc1WcmlR"
                    ],
                    "deployCommand": "",
                    "deployCmd": null,
                    "deployArgs": [
                        "--max-allowed-packet=268435456",
                        "--character-set-server=utf8mb4",
                        "--collation-server=utf8mb4_unicode_ci"
                    ],
                    "deployResources": {
                        "memoryRequest": "20Mi",
                        "memoryLimit": "400Mi",
                        "cpuRequest": "0.2",
                        "cpuLimit": "1",
                        "extraRequest" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
                        "extraLimit" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
                    },
                    "deployVolumes": [
                        {
                            "pathInPod": "/var/lib/mysql",
                            "pathInPv": "tp1-mysql",
                            "pvc": ""
                        }
                    ],
                    "deployHealthCheck": {
                        "checkPort": 3306,
                        "httpGet": {
                            "path": "",
                            "port": 0,
                            "httpHeaders": null
                        },
                        "readinessDelaySeconds": 15,
                        "readinessPeriodSeconds": 5,
                        "livenessDelaySeconds": 60,
                        "livenessPeriodSeconds": 30
                    },
                    "dependServices": null,
                    "hostAliases": null,
                    "securityContext": {
                        "runAsUser": 0,
                        "runAsGroup": 0
                    }
                },
                "createTime": "04-20 21:26:13",
            },
        ],

    }
}
```

#### [POST] api/admin/project/:projectName/envComponentUpdate admin在项目环境调整组件接口

- request请求内容
```json
{
    "envName": "xxx",
    "arch": "xxx",
    "componentDesc": "xxx",
    "componentYaml": "xxx",
}
```

- componentYaml yaml格式
- 定义项目环境组件如何发布到kubernetes环境

```yaml
# 组件名称*
deployName: tp1-mysql
# 镜像名称*
# 可以填写hub.docker.io上的公网镜像名称，流水线会自动拉取公网镜像，建议不要使用latest标签的镜像
# 也可以填写harbor中的基础镜像
deployImage: mysql:8.0.23
# 部署方式*
# ++ 容器发布模块的部署方式
# @@ 下拉选择 deployment statefulset
deployType: deployment
# 是否headless服务
# ++ headless服务不做负载均衡，并且pod之间可以通过域名互相访问，只有deployType为statefulset的时候，可以设置deployHeadless为true
# @@ 下拉选择 true false
deployHeadless: true
# statefulset的管理策略
# ++ OrderedReady，按顺序启动各个pod
# ++ Parallel，并行启动各个pod
# @@ deployType为statefulset的时候可以设置
# @@ 下拉选择 OrderedReady Parallel
podManagementPolicy: OrderedReady
# 容器发布模块的meta头信息定义
deployMeta:
  # 容器发布模块的额外标签信息
  labels:
    xxx: yyy
  # 容器发布模块的额外注释信息
  annotations:
    xxx: yyy
# 应用启动的副本实例数*
# @@ 默认 1
deployReplicas: 1
# 应用水平扩缩容设置
# ++ 注意，仅适用于无状态应用，有状态应用启动水平扩缩容可能引起服务异常
# ++ 当应用一段时间内实际平均使用的cpu或者内存高于预设值情况下，应用会自动进行水平扩容
# ++ 当应用水平扩容后，应用一段时间内实际平均使用的cpu或者内存低于预设值情况下，应用会自动进行水平缩容
# @@ memoryAverageValue memoryAverageRequestPercent cpuAverageValue cpuAverageRequestPercent 必须至少填写其中一个
hpaConfig:
  # 应用能够扩容的最大副本实例数*
  maxReplicas:
  # 内存平均值
  # ++ 应用一段时间内的内存平均值达到该数值将启动自动扩容（100Mi表示100M内存，1Gi表示1G内存）
  memoryAverageValue:
  # 内存平均百分比
  # ++ 应用一段时间内的内存平均值达到预设值的百分比将启动自动扩容（1 - 100）
  memoryAverageRequestPercent:
  # cpu平均值
  # ++ 应用一段时间内的cpu平均值达到该数值将启动自动扩容（100m表示0.1，表示0.1个CPU）
  cpuAverageValue:
  # cpu平均百分比
  # ++ 应用一段时间内的cpu平均值达到预设值的百分比将启动自动扩容（1 - 100）
  cpuAverageRequestPercent:
# 会话持久时间
# ++ 对于多实例的有状态服务，如果需要启用session sticky支持，需要设置session sticky超时时间，单位秒
deploySessionAffinityTimeoutSeconds: 30
# 模块的NodePort端口设置
# ++ 模块应用需要在kubernetes集群外被访问的时候，需要通过NodePort端口对外提供服务
# @@ 同一个模块deployNodePorts和deployLocalPorts不能同时设置
deployNodePorts:
  # 模块的内部服务端口号*
- port: 8000
  # 协议类型*
  # @@ 下拉选择 HTTP TCP UDP SCTP
  # @@ 默认 HTTP
  protocol: HTTP
  # 模块的外部服务端口号*
  # ++ kubernetes集群外通过访问NodePort可以访问到模块的内部端口，请保证项目的管理控制台该nodePort可用，并且nodePort没有复用，否则会无法发布应用。
  # @@ 下拉选择，来源于nodePorts
  nodePort: 30102
# 模块的内部端口设置
# ++ 假如模块应用不需要在kubernetes集群外被访问，那么设置内部端口即可
# @@ 同一个模块deployNodePorts和deployLocalPorts不能同时设置
deployLocalPorts:
  # 模块的内部服务端口号*
- port: 9000
  # 协议类型*
  # @@ 下拉选择 HTTP TCP UDP SCTP
  # @@ 默认 HTTP
  protocol: HTTP
  # 启用服务的域名解析
  # ++ kubernetes集群外通过域名和子路径访问该服务
  # ++ 访问方式为 http://${domainName}${pathPrefix}
  ingress:
    # 访问域名*
    # ++ 访问该服务的域名
    domainName: www.test-project1.local
    # 访问子路径*
    # ++ 访问该服务的子路径前缀
    # ++ 必须以/开头并且以/结尾
    pathPrefix: /c/
    # 是否自动创建自签名证书
    # ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
    # ++ 请保证所有容器部署模块该选项相同
    certSelfSigned: false
    # 代码仓库中的证书所在的分支
    certBranch: develop
    # 代码仓库中的证书路径
    # ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
    # ++ 假如不启用自动创建自签名证书，需要设置代码仓库中证书和私钥的路径，证书和私钥文件的名字为tls.crt和tls.key
    # ++ 流水线会自动把 <certPath>/test 目录下的tls.crt和tls.key证书保存到test环境的secret中
    # ++ 代码仓库中的证书路径不能以/结尾
    # ++ 请保证所有容器部署模块该选项相同
    certPath: xxx/yyy
# 环境变量
# 应用容器中的环境变量设置
# @@ 需要提供变量名 变量值 两个输入字段
deployEnvs:
- JAVA_OPTS=-Xms256m -Xmx256m
# 启动应用命令行
deployCommand: 'sh -c "java -jar example.smallest-0.0.1-SNAPSHOT.war 2>&1 | sed \"s/^/[$(hostname)] /\" | tee -a /tp1-spring-demo/logs/tp1-spring-demo.logs"'
# 启动应用的命令行参数设置
deployArgs: ["--var1=key1", "--var2=key2"]
# 应用的资源配额设置
# ++ 给应用分配多少cpu和内存资源
deployResources:
  # 内存请求配额*
  # ++ 应用预占的内存，所有应用的预占内存总量如超过节点内存总量将无法启动应用（100Mi表示100M内存，1Gi表示1G内存）
  # @@ 默认 10Mi
  memoryRequest: 10Mi
  # 内存最大配额*
  # ++ 应用可以分配的最大内存资源，所有应用的最大内存配额总量可以超过节点内存总量（200Mi表示200M内存，1Gi表示1G内存）
  # @@ 默认 100Mi
  memoryLimit: 250Mi
  # cpu请求配额*
  # ++ 应用预占的cpu，所有应用的预占cpu总量如超过节点cpu总量将无法启动应用（100m表示0.1，表示0.1个CPU）
  # @@ 默认 10m
  cpuRequest: 0.05
  # cpu最大配额*
  # ++ 应用可以分配的最大cpu资源，所有应用的最大cpu配额总量可以超过节点cpu总量（100m表示0.1，表示0.1个CPU）
  # @@ 默认 100m
  cpuLimit: 0.25
  # 扩展请求资源配额参数设置
  extraRequest:
    # 参数名
  - name: nvidia.com/gpu
    # 参数值
    value: "1"
  # 扩展最大资源配额参数设置
  extraLimit:
    # 参数名
  - name: nvidia.com/gpu
    # 参数值
    value: "1"
# 应用挂装存储设置  
# ++ 该应用哪些目录或者文件需要进行持久化到共享存储
deployVolumes:
  # 容器中挂装的目录或文件的绝对路径*
- pathInPod: /tp1-spring-demo/logs
  # 持久化卷pvc中目录或文件的相对路径*
  pathInPv: tp1-spring-demo/logs
  # 挂装的pvc名字
  # ++ 如果使用默认pvc请不要填写
  # @@ 下拉选择，从pvcNames中对应的环境中获取下拉列表
  pvc: your-project-pvc
# 应用状态检查设置
# ++ 检查应用是否能正常对外提供服务，如果不能正常对外提供服务则进行重启或者标记服务不可访问
deployHealthCheck:
  # 检查tcp端口是否可连接
  # @@ checkPort、exec、httpGet必须选其一
  checkPort: 9000
  # 执行命令并检查命令执行状态
  # ++ 假如命令状态执行成功表示检查成功
  # @@ checkPort、exec、httpGet必须选其一
  exec: "cat /etc/hosts"
  # 通过http get方法检查是否可连接*
  # ++ 通过http get方法访问指定路径和端口返回的状态码，如果状态码返回2XX-3XX则表示服务正常
  # ++ 建议每个应用单独开发一个http-get方式获取服务健康状态controller
  # @@ checkPort、exec、httpGet必须选其一
  httpGet:
    # 本应用的http路径
    path: /
    # 本应用的http端口*
    port: 9000
    # 请求中自定义的HTTP头
    httpHeaders:
      # httpHeader名称
    - name: Custom-Header
      # httpHeader值
      value: Awesome
    # 请求的scheme
    # @@ 下拉选择 HTTP HTTPS
    scheme: HTTP
  # 启动容器后等待多长时间才启动可访问性检查*
  # ++ 如果检查通过service才可以正常对外访问，单位秒
  # @@ 默认 15
  readinessDelaySeconds: 15
  # 多长时间间隔进行一次可访问性检查*
  # ++ 如果检查通过service才可以正常对外访问，单位秒
  # @@ 默认 5
  readinessPeriodSeconds: 5
  # 启动容器后等待多长时间才启动服务异常检查*
  # ++ 如果检查不通过容器将会自动重启，单位秒
  # @@ 默认 60
  livenessDelaySeconds: 150
  # 多长时间间隔进行一次服务异常检查*
  # ++ 如果检查不通过容器将会自动重启，单位秒
  # @@ 默认 30
  livenessPeriodSeconds: 30
  # 等待多长时间才进行容器启动状态检查*
  # ++ 如果检查通过容器才处于running状态，单位秒
  # @@ 默认 15
  startupDelaySeconds: 15
  # 多长时间间隔进行一次容器启动状态检查*
  # ++ 如果检查通过容器才处于running状态，单位秒
  # @@ 默认 5
  startupPeriodSeconds: 5
# 服务依赖
# ++ 启动该服务前必须先保证哪个服务的哪个端口先启动，如果有多个服务依赖请注意依赖的先后顺序
dependServices:
  # 依赖的服务名
  # ++ 可以是集群内的服务名，也可以是集群外的ip地址或者主机名
- dependName: tp1-spring-demo
  # 依赖的服务端口
  dependPort: 9000
  # 依赖的服务协议类型
  # @@ 下拉选择 TCP UDP
  # @@ 默认 TCP
  dependType: TCP
  # 依赖服务的URL
  # ++ HttpGet方式确认依赖服务是否可用
  httpGetUrl: 9000

# 应用容器主机名解析
# ++ 设置后应用容器中的/etc/hosts将增加相关主机名解析
hostAliases:
  # 对应的ip地址*
- ip: 192.168.0.1
  # 对应的主机名*
  # ++ 一个ip地址支持对应多个主机名
  hostnames:
  - "host-name01"
  - "host-name02"
# 启动应用使用的用户和用户组配置
# ++ 假如使用容器镜像的默认启动用户请勿配置该选项
securityContext:
  # 应用运行的用户ID
  # @@ 默认 1000
  runAsUser: 1000
  # 应用运行的用户组ID
  # @@ 默认 0
  runAsGroup: 1000
# 配置文件所在代码仓库的分支名称
deployConfigBranch: develop
# 从代码仓库发送配置文件到容器云的项目共享存储目录的配置
# ++ 注意，只支持发送到默认pvc共享存储中，不支持发送配置文件到项目自定义挂载的pvc共享存储中
# ++ 流水线会自动把 ${配置文件所在代码目录相对路径}/test 目录下的所有文件发送到test环境的 ${共享存储项目目录相对路径}目录下
# @@ 分为两个输入框： 配置文件所在代码目录相对路径 共享存储项目目录相对路径，路径都不能以/开头
deployConfigSettings:
  # 配置文件所在代码目录相对路径
- localPath: "Codes/Backend/tp1-gin-demo/config2/"
  # 对应的共享存储pvc，如果不填写表示使用默认共享存储
  pvcName: "xxx1-local-pv"
  # 共享存储项目目录相对路径
  podPath: "tp1-gin-demo/config2/"
# 容器发布模块的生命周期事件设置
lifecycle:
  # 容器启动后生命周期事件设置
  postStart:
    # 执行命令并检查命令执行状态
    # ++ 假如命令状态执行成功表示检查成功
    # @@ exec、httpGet必须选其一
    exec: "cat /etc/hosts"
    # 执行http get命令*
    # ++ 通过http get方法访问指定路径和端口返回的状态码，如果状态码返回2XX-3XX则表示检查成功
    # @@ exec、httpGet必须选其一
    httpGet:
      # 本应用的http路径
      path: /
      # 本应用的http端口*
      port: 9000
      # 请求中自定义的HTTP头
      httpHeaders:
        # httpHeader名称
      - name: Custom-Header
        # httpHeader值
        value: Awesome
      # 请求的scheme
      # @@ 下拉选择 HTTP HTTPS
      scheme: HTTP
  # 容器停止前生命周期事件设置
  preStop:
    # 执行命令并检查命令执行状态
    # ++ 假如命令状态执行成功表示检查成功
    # @@ exec、httpGet必须选其一
    exec: "cat /etc/hosts"
    # 执行http get命令*
    # ++ 通过http get方法访问指定路径和端口返回的状态码，如果状态码返回2XX-3XX则表示检查成功
    # @@ exec、httpGet必须选其一
    httpGet:
      # 本应用的http路径
      path: /
      # 本应用的http端口*
      port: 9000
      # 请求中自定义的HTTP头
      httpHeaders:
          # httpHeader名称
      - name: Custom-Header
          # httpHeader值
          value: Awesome
      # 请求的scheme
      # @@ 下拉选择 HTTP HTTPS
      scheme: HTTP
# 容器发布模块的工作目录设置
workingDir: "/tp1-gin-demo"
# 容器发布模块的节点选择器设置
# ++ 容器在包含以下标签的节点上启动
nodeSelector:
  xxx: yyy
# 容器发布模块的启动节点名字设置
# ++ 容器在以下名字的节点上启动
nodeName: k8s-node01
# 优雅地停止容器所等待的时长设置
# ++ 等待容器优雅地停止的时长设置，超过这个时间会直接执行kill容器的操作，单位秒
# @@ 默认 30
terminationGracePeriodSeconds: 30
# 访问该pod的子域名设置
# ++ 假如不设置子域名，该pod不能通过内部域名访问
# ++ 假如设置了子域名，该pod可以通过内部域名访问，内部完整域名为: <hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>
subdomain: "example"
# 是否启用downwardAPI
# ++ 假如启用downwardAPI，将会把pod的状态信息暴露成环境变量和文件
# ++ 包含的环境变量包括: K8S_METADATA_NAME, K8S_METADATA_NAMESPACE, K8S_METADATA_UID, K8S_SPEC_SERVICEACCOUNTNAME, K8S_SPEC_NODENAME, K8S_STATUS_HOSTIP, K8S_STATUS_PODIP, K8S_RESOURCE_LIMITS_CPU, K8S_RESOURCE_REQUESTS_CPU, K8S_RESOURCE_LIMITS_MEMORY, K8S_RESOURCE_REQUESTS_MEMORY
# ++ pod的labels和annotations信息将会存放在pod容器的/etc/k8s-pod-meta目录
enableDownwardApi: false
# 通过patch方式追加额外的部署参数
# ++ 假如容器部署定义中的设置参数不满足要求，那么可以使用patch的方式给容器部署追加参数
# ++ 只有项目名字空间开启特权模式情况下，才能通过patch方式追加额外的部署参数
patches:
  # 需要patch的资源类型*
  # + 其中deployment表示对deployment或者statefulset进行patch
  # @@ 下拉选择 deployment service hpa
- resourceKind: deployment
  # patch参数路径*
  # ++ 例如: spec.template.spec.initContainers
  # ++ 假如该路径下不存在对应的部署参数，那么patch路径的部署参数设置直接替换为patch内容
  # ++ 假如该路径下已经存在对应的部署参数，并且部署参数的类型为数组，那么patch内容会追加到patch路径的部署参数中
  # ++ 假如该路径下已经存在对应的部署参数，并且部署参数的类型不为数组，那么不更新部署参数
  path: "spec.template.spec.initContainers"
  # yaml格式patch参数内容*
  # ++ 假如patch路径上是数组，前方务必包含代表数组的 - (减号)
  content: |
    - name: init-myservice
      image: busybox:1.28
      command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/project/:projectName/envComponentDelete admin在项目环境删除组件接口

- request请求内容
```json
{
    "envName": "xxx",
    "componentName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/queues admin运行队列列表接口

- request请求内容
```json
{
    "page": 1,
    "perPage": 10
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "runs": [
            {
                "abortUser": "",
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "runName": "test-project1-develop-51",
                "triggerKind": "manual",
                "startUser": "devops-admin",
                "status": {
                    "duration": "1s487ms",
                    "result": "PAUSE",
                    "startTime": "11-06 22:02:05"
                },
                "tagName": "v0.1.0-release"
            },
            {
                "abortUser": "-",
                "pipelineName": "-",
                "projectName": "-",
                "runName": "-",
                "triggerKind": "manual",
                "startUser": "-",
                "status": {
                    "duration": "909ms210µs",
                    "result": "PAUSE",
                    "startTime": "11-06 22:02:26"
                },
                "tagName": "-"
            }
        ],
        "totalCount": 10,
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/queue/:runName/top admin队列中的运行置顶接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/users admin用户列表与搜索接口

- request请求内容
```json
{
    "usernames": [
        "xxx"
    ],
    "projectNames": [
        "xxx"
    ],
    "tenantCodes": [
        "xxx"
    ],
    "tenantAdmins": [
        "xxx"
    ],
    "name": "xxx",
    "mail": "xxx",
    "mobile": "xxx",
    "active": "yes",
    "admin": "yes",
    "tenantAdmin": "yes",
    "isMember": "yes",
    "sortMode": "username",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "lastLoginRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "page": 1,
    "perPage": 10
}
```

    - active: yes / no / 其他情况表示全部
    - admin: yes / no / 其他情况表示全部
    - tenantAdmin: yes / no / 其他情况表示全部
    - isMember: yes / no / 其他情况表示全部
    - sortMode: 排序方式，默认username
      - username: 用户名顺序
      - name: 名字顺序
      - createTimeDesc: 创建时间倒序
      - createTimeAsc: 创建时间顺序
      - lastLoginDesc: 登录时间倒序
      - lastLoginAsc: 登录时间顺序

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "users": [
            {
                "username": "xxx",
                "name": "xxx",
                "mail": "xxx",
                "mobile": "xxx",
                "avatarUrl": "xxx",
                "isAdmin": false,
                "isActive": true,
                "createTime": "xxx",
                "lastLogin": "xxx",
                "tenantCode": "xxx",
                "tenantAdmins": [
                    "xxx"
                ],
                "projects": [
                    {
                        "projectName": "xxx",
                        "accessLevel": "xxx",
                        "disableProjectDefs": [
                            "xxx",
                        ],
                        "disableRepoSecrets": [
                            "xxx",
                        ],
                        "disablePipelines": [
                            "xxx",
                        ],
                        "updateTime": "xxx",
                    },
                ],

            }
        ],
        "totalCount": 10
    }
}
```

#### [GET] api/admin/userNames admin用户名列表接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "userNames": [
            "xxx"
        ]
    }
}
```


#### [POST] api/admin/userNames/tenantCode admin用户名列表接口，用于项目查看页项目member设置选择用户用途

- request请求内容
```json
{
    "tenantCode": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "userNames": [
            "xxx"
        ]
    }
}
```

#### [POST] api/admin/user admin新增用户接口

- request请求内容
```json
{
    "username": "xxx",
    "name": "xxx",
    "mail": "xxx",
    "mobile": "xxx",
    "tenantCode": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [PUT] api/admin/user admin新增或更新用户接口，客户端使用

- request请求内容
```json
{
    "username": "xxx",
    "name": "xxx",
    "mail": "xxx",
    "mobile": "xxx",
    "isActive": false,
    "isAdmin": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [DELETE] api/admin/user/:username admin删除用户接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [GET] api/admin/user/:username/profile admin获取用户资料接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "user": {
            "username": "xxx",
            "name": "xxx",
            "mail": "xxx",
            "mobile": "xxx",
        }
    }
}
```

#### [POST] api/admin/user/:username/profileUpdate admin修改用户资料接口

- request请求内容
```json
{
    "name": "xxx",
    "mobile": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/user/:username/passwordUpdate admin修改用户密码接口

- request请求内容
```json
{
    "newPassword": "xxx",
    "confirmPassword": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/user/:username/activeUpdate admin修改用户是否激活状态接口

- request请求内容
```json
{
    "isActive": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/user/:username/adminUpdate admin修改用户是否管理员接口

- request请求内容
```json
{
    "isAdmin": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/user/:username/projects admin用户所属项目列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "projects": [
            {
                "projectName": "xxx",
                "accessLevel": "developer",
                "disableProjectDefs": [
                    "xxx",
                ],
                "disableRepoSecrets": [
                    "xxx",
                ],
                "disablePipelines": [
                    "xxx",
                ],
                "updateTime": "xxx",
            }
        ]
    }
}
```

#### [POST] api/admin/user/:username/projectAdd admin为用户分配项目接口

- request请求内容
```json
{
    "projectName": "xxx",
    "accessLevel": "xxx",
    "disableProjectDefs": [
        "xxx",
    ],
    "disableRepoSecrets": [
        "xxx",
    ],
    "disablePipelines": [
        "xxx",
    ],
}
```

    - accessLevel: maintainer / developer / runner
    - disableProjectDefs: pipelineDef / buildDef / packageDef / artifactDef / dockerIgnoreDef / customStepDef / customOpsDef / opsBatchDef / deployContainerDef / deployArtifactDef / istioDef / istioGatewayDef
    - disableRepoSecrets: image / artifact / scanCode / k8s

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/user/:username/projectDelete admin为用户移除项目接口

- request请求内容
```json
{
    "projectName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/user/:username/projectUpdate admin为用户修改项目角色接口

- request请求内容
```json
{
    "projectName": "xxx",
    "accessLevel": "xxx",
    "disableProjectDefs": [
        "xxx",
    ],
    "disableRepoSecrets": [
        "xxx",
    ],
    "disablePipelines": [
        "xxx",
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/tenantCodes admin租户编码列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "tenantCodes": [
            "xxx",
        ]
    }
}
```

#### [POST] api/admin/tenants admin租户列表与搜索接口

- request请求内容
```json
{
    "tenantCodes": ["xxx"],
    "page": 1,
    "perPage": 10
}
```

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list env success",
	"duration": "2.158446ms",
	"data": {
		"auditID": "63d4e0cca0fd0f75a31bda6c",
		"tenants": [
			{
                "tenantID": "xxx",
                "tenantCode": "xxx",
                "meshAvailable": false,
                "projectNumber": 1,
                "buildDefNumber": 1,
                "envNumber": 1,
                "gitRepoNumber": 1,
                "imageRepoNumber": 1,
                "artifactRepoNumber": 1,
                "scanCodeRepoNumber": 1,
                "envDefaultEnable": true,
                "gitRepoDefaultEnable": true,
                "imageRepoDefaultEnable": true,
                "artifactRepoDefaultEnable": true,
                "scanCodeRepoDefaultEnable": true,
                "customStepDefaultEnable": true,
                "componentTemplateDefaultEnable": true,
                "expiresTime": "2006-01-02 15:04:05",
                "isActive": true,
                "projectNames": ["xxx"],
                "createTime": "01-02 15:04:05",
			}
		],
		"totalCount": 4,
		"withAdminLog": false
	}
}
```

#### [POST] api/admin/tenant admin新增租户接口

- request请求内容
```json
{
  "tenantCode": "test-tenant01",
  "meshAvailable": false,
  "projectNumber": 1,
  "buildDefNumber": 1,
  "envNumber": 1,
  "gitRepoNumber": 1,
  "imageRepoNumber": 1,
  "artifactRepoNumber": 1,
  "scanCodeRepoNumber": 1,
  "envDefaultEnable": true,
  "gitRepoDefaultEnable": true,
  "imageRepoDefaultEnable": true,
  "artifactRepoDefaultEnable": true,
  "scanCodeRepoDefaultEnable": true,
  "customStepDefaultEnable": true,
  "componentTemplateDefaultEnable": true,
  "expiresDays": 30,
  "isActive": true,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/tenant/:tenantCode admin修改租户接口

- request请求内容
```json
{
  "tenantCode": "test-tenant01",
  "meshAvailable": false,
  "projectNumber": 1,
  "buildDefNumber": 1,
  "envNumber": 1,
  "gitRepoNumber": 1,
  "imageRepoNumber": 1,
  "artifactRepoNumber": 1,
  "scanCodeRepoNumber": 1,
  "envDefaultEnable": true,
  "gitRepoDefaultEnable": true,
  "imageRepoDefaultEnable": true,
  "artifactRepoDefaultEnable": true,
  "scanCodeRepoDefaultEnable": true,
  "customStepDefaultEnable": true,
  "componentTemplateDefaultEnable": true,
  "expiresDays": 30,
  "isActive": true,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/tenant/:tenantCode admin删除租户接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/buildEnvNames admin容器构建环境名称列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "buildEnvNames": [
            "xxx",
        ]
    }
}
```

#### [POST] api/admin/dockerBuildEnvs admin容器构建环境列表与搜索接口

- request请求内容
```json
{
    "tenantCodes": ["xxx"],
    "buildEnvNames": ["xxx"],
    "fromFile": "yes",
    "page": 1,
    "perPage": 10
}
```

- fromFile: yes / no / 其他情况表示全部

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list dockerBuildEnv success",
	"duration": "2.158446ms",
	"data": {
		"auditID": "63d4e0cca0fd0f75a31bda6c",
    "dockerBuildEnvs": [
        {
            "tenantCode": "",
            "isFromFile": true,
            "buildEnvName": "alpine-3.16",
            "image": "public/alpine:3.16.4-dory",
            "buildArches": [
                "amd64",
                "arm64v8"
            ],
            "registryUsername": "",
            "registryPassword": "",
            "mountHomeDir": false,
            "enableProxy": false,
            "mountExtraCacheDirs": [],
            "commandsBeforeBuild": [
                "pwd",
                "ls -al"
            ],
            "commandsAfterCheck": [],
            "dockerEnvs": [
                "xxx=yyy",
            ],
            "dockerExtraHosts": [
                {
                    "hostname": "xxx",
                    "ip": "192.168.0.1",
                },
            ],
        }
    ],
		"totalCount": 4,
		"withAdminLog": false
	}
}
```

#### [POST] api/admin/dockerBuildEnv admin新增容器构建环境接口

- request请求内容
```json
{
    "dockerBuildEnvYaml": "xxx",
}
```

- dockerBuildEnvYaml yaml格式
- 容器构建环境设置

```yaml
# 构建环境名称*
# ++ 格式例如: python-3.10
buildEnvName: python-3.10
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 构建环境容器镜像相对路径*
# ++ 构建环境容器镜像所在的镜像仓库相对路径
# ++ 当cpu架构为amd64的时候的镜像名字
# ++ 格式例如: public/maven:3.8.5-openjdk-17-dory
image: "public/maven:3.8.5-openjdk-17-dory"
# 构建环境支持哪些cpu架构*
# ++ 假如cpu架构不为amd64，构建环境的容器镜像名为 <image>-<cpu架构名字>
# ++ 例如cpu架构为arm64v8，那么实际构建环境的image名字为 public/maven:3.8.5-openjdk-17-dory-arm64v8
buildArches: ["amd64", "arm64v8"]
# 镜像仓库账号
# ++ 假如构建环境的容器镜像需要账号密码才能拉取，则需要提供，否则不要填写
registryUsername: ""
# 镜像仓库密码
# ++ 假如构建环境的容器镜像需要账号密码才能拉取，则需要提供，否则不要填写
registryPassword: ""
# 是否挂装$HOME目录
# ++ 是否把caches目录装载到容器的$HOME目录
mountHomeDir: true
# 是否启用代理服务器
# ++ 是否启用外部代理服务器拉取依赖
enableProxy: false
# 挂装格外的缓存目录
# ++ mount构建容器中非工作目录以及$HOME目录之外的构建依赖缓存目录
# ++ 例如go语言，需要装载容器中的/go/pkg作为缓存
# ++ 回车输入多个
# ++ 目录必须使用绝对路径，以/开头
mountExtraCacheDirs: []
# 执行构建命令前执行什么命令
commandsBeforeBuild: ["pwd", "ls -al"]
# 执行检查命令后执行什么命令
commandsAfterCheck: []
# 容器环境变量设置
# ++ 容器中的环境变量设置
# @@ 分为两个部分: key=value
# @@ key：变量名
# @@ value：变量值
dockerEnvs:
- "KEY1=VAL1"
# 容器主机名解析设置
dockerExtraHosts:
- hostname: xxx
  ip: 192.168.0.1
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/dockerBuildEnv/:buildEnvName admin修改容器构建环境接口

- request请求内容
```json
{
    "dockerBuildEnvYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/dockerBuildEnv/:buildEnvName admin删除容器构建环境接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/repoConfigs admin仓库列表与搜索接口

- request请求内容
```json
{
    "types": ["xxx"],
    "tenantCodes": ["xxx"],
    "repoNames": ["xxx"],
    "fromFile": "yes",
    "page": 1,
    "perPage": 10
}
```

- types: gitRepoConfig / imageRepoConfig / artifactRepoConfig / scanCodeRepoConfig
- fromFile: yes / no / 其他情况表示全部

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list repo config success",
    "duration": "3.938701ms",
    "data": {
        "auditID": "64911e4d250e7cdb3e95d781",
        "repoConfigs": [
            {
                "insecure": false,
                "isFromFile": true,
                "kind": "gitea",
                "mail": "xxx",
                "name": "xxx",
                "password": "xxx",
                "repoName": "xxx",
                "tenantCode": "",
                "token": "xxx",
                "type": "gitRepoConfig",
                "url": "xxx",
                "username": "xxx",
                "viewUrl": "xxx"
            },
            {
                "hostname": "xxx",
                "insecure": true,
                "ipExternal": "xxx",
                "ipInternal": "xxx",
                "isFromFile": true,
                "kind": "xxx",
                "password": "xxx",
                "repoName": "xxx",
                "tenantCode": "",
                "type": "imageRepoConfig",
                "username": "xxx"
            },
            {
                "hostnameExternal": "xxx",
                "hostnameInternal": "xxx",
                "insecure": false,
                "isFromFile": true,
                "kind": "nexus",
                "password": "xxx",
                "port": 30003,
                "proxyRepo": {
                    "publicRole": "public-role",
                    "publicUser": "public-user",
                    "publicPassword": "public-user",
                    "portDocker": 30004,
                    "portGcr": 30005,
                    "portQuay": 30006,
                    "apt": {
                        "amd64": "repository/apt-aliyun-focal/",
                        "arm64v8": "repository/apt-aliyun-focal-arm64/"
                    },
                    "go": "repository/go-group-public",
                    "gradle": "repository/maven-group-public/",
                    "maven": "repository/maven-group-public/",
                    "npm": "repository/npm-group-public/",
                    "pip": "repository/pypi-group-public/simple"
                },
                "repoName": "xxx",
                "schemaExternal": "http",
                "schemaInternal": "http",
                "tenantCode": "",
                "type": "artifactRepoConfig",
                "username": "xxx",
                "viewUrl": "xxx"
            },
            {
                "insecure": false,
                "isFromFile": true,
                "kind": "sonarqube",
                "repoName": "xxx",
                "tenantCode": "",
                "token": "xxx",
                "type": "scanCodeRepoConfig",
                "url": "xxx",
                "viewUrl": "xxx"
            }
        ],
        "totalCount": 4,
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/gitRepoConfig admin新增代码仓库接口

- request请求内容
```json
{
    "gitRepoConfigYaml": "xxx",
}
```

- gitRepoConfigYaml yaml格式
- 代码仓库环境设置

```yaml
# 代码仓库类型*
# @@ 选项: gitlab, gitea
kind: gitea
# 代码仓库名字标识*
# ++ 格式例如: gitea-dory
repoName: gitea-dory
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 代码仓库浏览器查看url*
# ++ 格式例如: http://example.com:30001
viewUrl: http://example.com:30001
# 代码仓库的地址*
# ++ dory访问该仓库的地址
# ++ 格式例如: http://gitea:3000
url: http://gitea:3000
# 是否开启insecure模式
# ++ 假如服务端为https，并且使用自签名的tls证书，那么请设置本选项为true
insecure: false
# 代码仓库管理员账号*
username: "xxx"
# 代码仓库管理员显示名*
name: "xxx"
# 代码仓库管理员email*
# ++ 格式例如: admin@example.com
mail: "xxx"
# 代码仓库管理员密码*
password: "xxx"
# 代码仓库管理员token*
token: "xxx"
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/gitRepoConfig/:repoName admin修改代码仓库接口

- request请求内容
```json
{
    "gitRepoConfigYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/gitRepoConfig/:repoName admin删除代码仓库接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/imageRepoConfig admin新增镜像仓库接口

- request请求内容
```json
{
    "imageRepoConfigYaml": "xxx",
}
```

- imageRepoConfigYaml yaml格式
- 镜像仓库环境设置

```yaml
# 镜像仓库类型*
# @@ 选项: harbor
kind: harbor
# 镜像仓库名字标识*
# ++ 格式例如: harbor-dory
repoName: harbor-dory
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 镜像仓库的域名*
# ++ 目前只支持 https://<hostname> 方式访问镜像仓库
# ++ 格式例如: example.com
hostname: example.com
# 是否开启insecure模式
# ++ 假如服务端为https，并且使用自签名的tls证书，那么请设置本选项为true
insecure: true
# 镜像仓库管理员账号*
username: "xxx"
# 镜像仓库管理员密码*
password: "xxx"
# 内部访问的IP地址*
# ++ 格式例如: 192.168.0.1
ipInternal: "xxx"
# 外部访问的IP地址*
# ++ 格式例如: 192.168.0.1
ipExternal: "xxx"
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/imageRepoConfig/:repoName admin修改镜像仓库接口

- request请求内容
```json
{
    "imageRepoConfigYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/imageRepoConfig/:repoName admin删除镜像仓库接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/artifactRepoConfig admin新增依赖与制品仓库接口

- request请求内容
```json
{
    "artifactRepoConfigYaml": "xxx",
}
```

- artifactRepoConfigYaml yaml格式
- 依赖与制品仓库环境设置

```yaml
# 依赖与制品仓库类型*
# @@ 选项: nexus
kind: nexus
# 依赖与制品仓库名字标识*
# ++ 格式例如: nexus-dory
repoName: nexus-dory
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 依赖与制品仓库浏览器查看url
# ++ 格式例如: http://example.com:30003
viewUrl: http://example.com:30003
# 内部访问的schema
# @@ 选择项: http, https
schemaInternal: http
# 外部访问的schema
# ++ 假如只有唯一的schema，那么schemaExternal和schemaInternal设置为一样即可
# @@ 选择项: http, https
schemaExternal: http
# 内部访问的主机名或者IP地址*
# ++ 格式例如: 192.168.0.1
hostnameInternal: 192.168.0.1
# 外部访问的主机名或者IP地址*
# ++ 假如只有唯一的主机名或者IP地址，那么hostnameExternal和hostnameInternal设置为一样即可
# ++ 格式例如: 192.168.0.1
hostnameExternal: 192.168.0.1
# 是否开启insecure模式
# ++ 假如服务端为https，并且使用自签名的tls证书，那么请设置本选项为true
insecure: false
# 制品仓库管理员账号*
# ++ 格式例如: admin
username: "admin"
# 制品仓库管理员密码*
password: "xxx"
# 制品仓库服务端口*
port: 30003
# 代理仓库设置
proxyRepo:
  # 制品仓库public role名称
  # ++ 格式例如: public-role
  publicRole: xxx
  # 拉取第三方开源依赖的公用账号名称
  # ++ 格式例如: public-user
  publicUser: "xxx"
  # 拉取第三方开源依赖的公用账号密码
  publicPassword: "xxx"
  # docker.io镜像仓库代理端口
  portDocker: 30004
  # gcr.io镜像仓库代理端口
  portGcr: 30005
  # quay.io镜像仓库代理端口
  portQuay: 30006
  # maven第三方开源依赖的仓库相对路径
  # ++ 格式例如: repository/maven-group-public/
  maven: repository/maven-group-public/
  # npm第三方开源依赖的仓库相对路径
  # ++ 格式例如: repository/npm-group-public/
  npm: repository/npm-group-public/
  # pypi第三方开源依赖的仓库相对路径
  # ++ 格式例如: repository/pypi-group-public/simple
  pip: repository/pypi-group-public/simple
  # gradle第三方开源依赖的仓库相对路径
  # ++ 格式例如: repository/maven-group-public/
  gradle: repository/maven-group-public/
  # go第三方开源依赖的仓库相对路径
  # ++ 格式例如: repository/go-group-public
  go: repository/go-group-public
  # apt 源代理设置
  apt:
    # x86 apt代理源
    # ++ 格式例如: repository/apt-aliyun-focal/
    amd64: repository/apt-aliyun-focal/
    # arm64v8 apt代理源
    # ++ 格式例如: repository/apt-aliyun-focal-arm64/
    arm64v8: repository/apt-aliyun-focal-arm64/
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/artifactRepoConfig/:repoName admin修改依赖与制品仓库接口

- request请求内容
```json
{
    "artifactRepoConfigYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/artifactRepoConfig/:repoName admin删除依赖与制品仓库接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/scanCodeRepoConfig admin新增代码扫描仓库接口

- request请求内容
```json
{
    "scanCodeRepoConfigYaml": "xxx",
}
```

- scanCodeRepoConfigYaml yaml格式
- 代码扫描仓库环境设置

```yaml
# 代码扫描仓库类型*
# @@ 选项: sonarqbue
kind: sonarqube
# 代码扫描仓库名字标识*
# ++ 格式例如: sonarqube-dory
repoName: sonarqube-dory
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 代码扫描仓库外部查看url*
# 格式例如: http://example.com:30008
viewUrl: http://example.com:30008
# 代码扫描仓库地址*
# ++ dory访问该仓库的地址
# ++ 格式例如: http://192.168.0.1:30008
url: http://192.168.0.1:30008
# 是否开启insecure模式
# ++ 假如服务端为https，并且使用自签名的tls证书，那么请设置本选项为true
insecure: false
# 代码扫描仓库管理员token*
token: "xxx"
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/scanCodeRepoConfig/:repoName admin修改代码扫描仓库接口

- request请求内容
```json
{
    "scanCodeRepoConfigYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/scanCodeRepoConfig/:repoName admin删除代码扫描仓库接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/envs admin环境列表与搜索接口

- request请求内容
```json
{
    "tenantCodes": ["xxx"],
    "envNames": ["xxx"],
    "fromFile": "yes",
    "page": 1,
    "perPage": 10
}
```

- fromFile: yes / no / 其他情况表示全部

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list env success",
	"duration": "2.158446ms",
	"data": {
		"auditID": "63d4e0cca0fd0f75a31bda6c",
		"envK8ss": [
			{
				"envName": "prod",
				"envDesc": "prod",
                "tenantCode": "xxx",
                "isFromFile": false,
                "disabledDefs": [
                    "xxx",
                ],
                "disabledPatches": [
                    "xxx",
                ],
				"host": "xxx",
				"viewHost": "xxx",
				"port": 6443,
				"token": "xxx",
                "caCrtBase64": "xxx",
				"dashboardUrl": "xxx",
                "dashboardUrlNetworkPolicy": "xxx",
				"istioNamespace": "xxx",
                "ingressControllerNamespace": "traefik",
                "timezone": "xxx",
                "nodePortRange": {
                    "nodePortRangeStart": 30100,
                    "nodePortRangeEnd": 32767,
                },
                "archSettings": [
                    {
                        "arch": "amd64",
                        "nodeSelector": {
                            "kubernetes.io/arch": "amd64",
                            "kubernetes.io/os": "linux"
                        }
                    },
                    {
                        "arch": "arm64v8",
                        "nodeSelector": {
                            "kubernetes.io/os": "linux"
                        }
                    }
                ],
				"projectDataPod": {
					"namespace": "dory",
					"statefulSetName": "project-data-alpine-0",
					"path": "/project-data"
				},
				"podImageSettings": {
					"projectDataPodImage": "harbor.new.imdory.com/public/alpine:3.17.2-dory",
					"busyboxImage": "harbor.new.imdory.com/public/busybox:latest",
				},
				"imageRepoUseExternal": false,
				"artifactRepoUseExternal": false,
				"pvConfigLocal": {
					"localPath": "/data/k8s-vols/dory"
				},
				"pvConfigCephfs": {
					"cephPath": "",
					"cephUser": "",
					"cephSecret": "",
					"cephMonitors": null
				},
				"pvConfigNfs": {
					"nfsPath": "",
					"nfsServer": ""
				},
				"projectNodeSelector": {},
				"quotaConfig": {
					"defaultQuota": {
						"memoryRequest": "20Mi",
						"cpuRequest": "10m",
						"memoryLimit": "50Mi",
						"cpuLimit": "50m",
                        "extraRequest" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
                        "extraLimit" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
					},
					"namespaceQuota": {
						"memoryRequest": "1Gi",
						"cpuRequest": "1000m",
						"memoryLimit": "4Gi",
						"cpuLimit": "4000m",
						"podsLimit": 32,
                        "extraQuotas" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
					}
				},
				"resourceVersion": {
					"ingressVersion": "v1",
					"hpaVersion": "v2",
					"istioVersion": "v1beta1"
				},
				"nodes": [],
                "arches": ["amd64", "arm64v8"],
			}
		],
		"totalCount": 4,
		"withAdminLog": false
	}
}
```

#### [GET] api/admin/envNames admin环境名列表接口，用于选择可用环境的下拉列表


- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "envNames": [
            "xxx",
        ]
    }
}
```

#### [GET] api/admin/envNames/search admin环境名列表接口，用于搜索的下拉列表


- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "envNames": [
            "xxx",
        ]
    }
}
```

#### [POST] api/admin/envNames/tenantCode admin环境名列表接口，用于项目查看页项目为项目分配新环境用途

- request请求内容
```json
{
    "tenantCode": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "envNames": [
            "xxx"
        ]
    }
}
```

#### [GET] api/admin/archNames admin架构名字列表接口


- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "archNames": [
            "xxx",
        ]
    }
}
```

#### [POST] api/admin/env admin新增环境接口

- request请求内容
```json
{
    "envK8sYaml": "xxx",
}
```

- envK8sYaml yaml格式
- kubernetes环境设置

```yaml
# kubernetes环境标识*
envName: test
# kubernetes环境描述*
# ++ 用于显示在流水线上的环境名称
envDesc: 测试环境
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'

#kubernetes环境参数

# apiserver地址*
# ++ kubernetes环境的apiserver地址
host: "111.229.119.32"
# 外部访问地址*
# ++ kubernetes环境外部访问地址
viewHost: "111.229.119.32"
# apiserver端口*
# ++ kubernetes环境的apiserver端口
port: 6443
# apiserver的token*
# ++ kubernetes环境的apiserver的token
token: 'xxx'
# kubernetes环境的 apiserver 的ca证书的base64编码字符串*
caCrtBase64: "xxx"
# kubernetes dashboard管理控制台的url
dashboardUrl: "https://k8s.dory.cookeem.com/#/workloads?namespace={{ .projectNamespace }}"
# kubernetes dashboard管理控制台网络策略的url
dashboardUrlNetworkPolicy: "https://k8s.dory.cookeem.com/#/networkpolicy?namespace={{ .projectNamespace }}"
# 环境中istio服务网格部署的名字空间
istioNamespace: "istio-system"
# 环境中ingress controller部署的名字空间
ingressControllerNamespace: "traefik"
# 环境的时区设置
timezone: "Asia/Shanghai"
# kubernetes环境可以为项目分配的nodePort可用端口范围
nodePortRange:
  # 可用nodePort开始端口
  nodePortRangeStart: 30100
  # 可用nodePort结束端口
  nodePortRangeEnd: 32767
# 环境的架构设置
archSettings:
    # cpu架构
  - arch: amd64
    # 应用部署的节点选择器
    # ++ 用于设置该种cpu架构下的应用，会选择该环境下哪些节点进行部署
    # @@ 支持插入多个
    # @@ 需要输入两个字段： 标签名*（labelName） 标签值*（labelValue）
    # @@ 例如 labelName = type，labelValue = master
    nodeSelector:
      kubernetes.io/arch: amd64
      kubernetes.io/os: linux

# 项目数据Pod设置*
# ++ 该kubernetes pod可以访问默认持久化的根目录，用于通过该pod给各个项目名字空间发送初始化文件
projectDataPod:
  # pod所在名字空间*
  namespace: devops
  # statefulset的名字*
  statefulSetName: project-data-alpine-0
  # pod中项目共享目录的根路径*
  # ++ 该路径挂装了所有项目名字空间的共享存储的根路径
  path: /project-data

# pod镜像设置*
podImageSettings:
  # project-data-pod的镜像路径*
  projectDataPodImage: "harbor.new.imdory.com/public/alpine:3.17.2-dory"
  # busybox的镜像路径*
  busyboxImage: "harbor.new.imdory.com/public/busybox:latest"

# 是否使用外部主机和IP设置连接镜像仓库
imageRepoUseExternal: false
# 是否使用外部主机和IP设置连接依赖与制品仓库
artifactRepoUseExternal: false

# @@ pvConfigLocal pvConfigCephfs pvConfigNfs 必须选其中一个填写，只能填写一个
# kubernetes持久化存储设置

# 本地持久化存储设置
# ++ 假如持久化存储使用本地存储情况下请设置
pvConfigLocal:
  # 本地存储绝对路径*
  localPath: /data/k8s-vols
# cephfs持久化存储设置
# ++ 假如持久化存储使用cephfs情况下请设置
pvConfigCephfs:
  # cephfs账号*
  cephUser: admin
  # cephfs秘钥*
  cephSecret: xxx
  # cephfs所有monitor地址与端口
  # ++ 例如: 192.168.60.43:6789
  cephMonitors:
  - "192.168.60.43:6789"
  - "192.168.60.44:6789"
  - "192.168.60.45:6789"
  # cephfs存储路径*
  cephPath: /k8s-deploy
# nfs持久化存储设置
# ++ 假如持久化存储使用nfs情况下请设置
pvConfigNfs:
  # nfs服务器地址*
  nfsServer: 192.168.0.1
  # nfs存储路径*
  nfsPath: /k8s-deploy

# 项目应用部署选择器*
# ++ 项目的deployment选择部署在什么标签的节点上
# @@ 支持插入多个
# @@ 需要输入两个字段： 标签名*（labelName） 标签值*（labelValue）
# @@ 例如 labelName = type，labelValue = master
projectNodeSelector:
  type: master

# 项目资源配额设置*
quotaConfig:
  # 默认每个Pod的资源配额限制*
  # ++ 如果应用部署的时候，没有指定资源配额，则按照这个默认设置分配资源配额
  defaultQuota:
    # 默认每个Pod的请求内存资源设置*
    # ++ 100Mi表示100M内存，1Gi表示1G内存
    memoryRequest: 20Mi
    # 默认每个Pod的请求cpu资源设置*
    # ++ 100m表示0.1，表示0.1个CPU
    cpuRequest: 10m
    # 默认每个Pod的最大内存资源设置*
    # ++ 100Mi表示100M内存，1Gi表示1G内存
    memoryLimit: 50Mi
    # 默认每个Pod的最大cpu资源设置*
    # ++ 100m表示0.1，表示0.1个CPU
    cpuLimit: 50m
    # 扩展请求资源配额参数设置
    extraRequest:
      # 参数名
    - name: nvidia.com/gpu
      # 参数值
      value: "1"
    # 扩展最大资源配额参数设置
    extraLimit:
      # 参数名
    - name: nvidia.com/gpu
      # 参数值
      value: "1"
  # 整个项目的容器云资源配额限制
  # ++ 整个项目名字空间，所有应用可以使用的资源配额总量，超过这个总量将无法发布应用
  namespaceQuota:
    # 整个项目所有Pod的请求内存资源总和设置*
    # ++ 100Mi表示100M内存，1Gi表示1G内存
    memoryRequest: 500Mi
    # 整个项目所有Pod的请求cpu资源总和设置*
    # ++ 100m表示0.1，表示0.1个CPU
    cpuRequest: 500m
    # 整个项目所有Pod的最大内存资源总和设置*
    # ++ 100Mi表示100M内存，1Gi表示1G内存
    memoryLimit: 2Gi
    # 整个项目所有Pod的最大cpu资源总和设置*
    # ++ 100m表示0.1，表示0.1个CPU
    cpuLimit: 2000m
    # 整个项目所有Pod的数量总和设置*
    podsLimit: 32
    # 扩展资源配额参数设置
    extraQuotas:
      # 参数名
    - name: nvidia.com/gpu
      # 参数值
      value: "1"
# 禁止修改哪些容器部署设置
disabledDefs:
- nodeName
- nodeSelector
# 禁止通过patches设置哪些容器部署参数
disabledPatches:
- affinity
- dnsConfig
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/env admin获取新增环境默认内容接口

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "get default envK8s success",
	"duration": "777.414µs",
	"data": {
		"auditID": "63d4e0d8a0fd0f75a31bda72",
		"envK8s": {
			"envName": "",
			"envDesc": "",
            "tenantCode": "xxx",
            "isFromFile": false,
            "disabledDefs": [
                "xxx",
            ],
            "disabledPatches": [
                "xxx",
            ],
			"host": "xxx",
			"viewHost": "xxx",
			"port": 6443,
			"token": "xxx",
			"caCrtBase64": "xxx",
            "dashboardUrl": "xxx",
            "dashboardUrlNetworkPolicy": "xxx",
			"istioNamespace": "istio-system",
            "ingressControllerNamespace": "traefik",
            "timezone": "xxx",
            "nodePortRange": {
                "nodePortRangeStart": 30100,
                "nodePortRangeEnd": 32767,
            },
            "archSettings": [
                {
                    "arch": "amd64",
                    "nodeSelector": {
                        "kubernetes.io/arch": "amd64",
                        "kubernetes.io/os": "linux"
                    }
                },
                {
                    "arch": "arm64v8",
                    "nodeSelector": {
                        "kubernetes.io/os": "linux"
                    }
                }
            ],
			"projectDataPod": {
				"namespace": "dory",
				"statefulSetName": "project-data-alpine-0",
				"path": "/project-data"
			},
			"podImageSettings": {
				"projectDataPodImage": "harbor.new.imdory.com/public/alpine:3.17.2-dory",
				"busyboxImage": "harbor.new.imdory.com/public/busybox:latest",
			},
			"imageRepoUseExternal": false,
			"artifactRepoUseExternal": false,
			"pvConfigLocal": {
				"localPath": "/data/k8s-vols/dory"
			},
			"pvConfigCephfs": {
				"cephPath": "",
				"cephUser": "",
				"cephSecret": "",
				"cephMonitors": null
			},
			"pvConfigNfs": {
				"nfsPath": "",
				"nfsServer": ""
			},
			"projectNodeSelector": {},
			"quotaConfig": {
				"defaultQuota": {
					"memoryRequest": "20Mi",
					"cpuRequest": "10m",
					"memoryLimit": "50Mi",
					"cpuLimit": "50m",
                    "extraRequest" : [
                        {
                            "name" : "xxx",
                            "value" : "xxx",
                        }
                    ],
                    "extraLimit" : [
                        {
                            "name" : "xxx",
                            "value" : "xxx",
                        }
                    ],                    
				},
				"namespaceQuota": {
					"memoryRequest": "1Gi",
					"cpuRequest": "1000m",
					"memoryLimit": "4Gi",
					"cpuLimit": "4000m",
					"podsLimit": 32,
                    "extraQuotas" : [
                        {
                            "name" : "xxx",
                            "value" : "xxx",
                        }
                    ],
				}
			},
			"resourceVersion": {
				"ingressVersion": "v1",
				"hpaVersion": "v2",
				"istioVersion": "v1beta1"
			},
			"nodes": [],
            "arches": ["amd64", "arm64v8"],
		},
		"withAdminLog": false
	}
}
```

#### [DELETE] api/admin/env/:envName admin删除环境接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/env/:envName admin修改环境配置接口

- request请求内容
```json
{
    "envK8sYaml": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/env/:envName/pvAdd admin为环境分配pv接口

- request请求内容
```json
{
    "pvName": "xxx",
    "pvDefYaml": "xxx",
}
```

- pvDefYaml yaml格式
- 定义持久化卷设置

```yaml
# 是否只读
# @@ 默认 false
readOnly: false

# @@ 以下配置 hostPath cephfs glusterfs nfs rbd 能且只能选其一

# 挂装本地文件作为持久化卷
hostPath:
  # 挂装的本地存储的绝对路径*
  # ++ 例如: /xxx
  path: /xxx

# 挂装cephfs作为持久化卷
cephfs:
  # cephfs的monitor地址*
  # ++ 例如: 192.168.0.1:6789
  monitors:
    - 192.168.0.1:6789
    - 192.168.0.2:6789
    - 192.168.0.3:6789
  # cephfs的访问密钥*
  keyring: xxx
  # cephfs的访问用户名*
  user: admin
  # 挂装cephfs中的绝对路径*
  # @@ 默认 /
  path: /xxx

# 挂装rbd作为持久化卷
rbd:
  # rbd的monitor地址*
  # ++ 例如: 192.168.0.1:6789
  monitors:
    - 192.168.0.1:6789
    - 192.168.0.2:6789
    - 192.168.0.3:6789
  # rbd的访问密钥*
  keyring: xxx
  # rbd的访问用户名*
  user: admin
  # rbd的pool名称*
  pool: xxx
  # rbd的镜像名称*
  image: xxx
  # 映射的文件系统类型*
  # @@ 下拉选择: ext4, xfs
  # @@ 默认 ext4
  fsType: ext4
  
# 挂装glusterfs作为持久化卷
glusterfs:
  # glusterfs的访问ip地址*
  endpointIPs:
  - 192.168.0.1
  # glusterfs的访问端口*
  endpointPort: 1
  # 挂装glusterfs中的路径*
  # ++ 例如: glusterfs_vol
  path: xxx

# 挂装nfs作为持久化卷
nfs:
  # nfs的服务器地址*
  # ++ 例如: 192.168.0.1
  server: xxx
  # 挂装的nfs的绝对路径*
  # ++ 例如: /xxx
  path: /xxx
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/env/:envName/pvs admin获取环境所有pv列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "pvs": [
            {
                "envName": "xxx",
                "pvName": "xxx",
                "pvYaml": "xxx",
                "pvType": "xxx",
                "claimRef": {
                    "apiVersion": "xxx",
                    "kind": "xxx",
                    "name": "xxx",
                    "namespace": "xxx",
                },
                "status": {
                    "message": "xxx",
                    "phase": "xxx",
                    "reason": "xxx",
                    "xxx": "xxx",
                },
                "projectNamespace": "xxx",
            }
        ]
    }
}
```

#### [GET] api/admin/env/:envName/pvNames admin获取环境可用pv列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "pvs": [
            {
                "envName": "xxx",
                "pvName": "xxx",
                "pvType": "xxx",
                "projectNamespace": "xxx",
            }
        ]
    }
}
```

#### [POST] api/admin/env/:envName/pvDelete admin为环境回收pv接口

- request请求内容
```json
{
    "pvName": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/env/:envName/scs admin获取环境所有storageclass列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "66b490d5b354cfa7eed6e537",
        "scs": [
            {
                "envName": "devops",
                "scName": "nfs-csi",
                "scYaml": "xxx",
                "scProvisioner": "nfs.csi.k8s.io"
            }
        ],
        "withAdminLog": false
    }
}
```

#### [GET] api/admin/env/:envName/scNames admin获取环境所有storageclass名字列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "66b490d5b354cfa7eed6e537",
        "scNames": [
            "xxx",
        ],
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/componentTemplates admin获取组件模板列表接口

- request请求内容
```json
{
    "tenantCodes": [],
    "page": 1,
    "perPage": 1,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "componentTemplates": [
            {
                "componentTemplateDesc": "xxx",
                "componentTemplateName": "xxx",
                "tenantCode": "xxx",
                "deploySpecStatic": {
                    "deployName": "tp1-mysql",
                    "deployImage": "mysql:8.0.23",
                    "deploySessionAffinityTimeoutSeconds": 0,
                    "deployNodePorts": null,
                    "deployLocalPorts": [
                        {
                            "port": 3306,
                            "protocol": "tcp"
                        }
                    ],
                    "deployReplicas": 1,
                    "deployEnvs": [
                        "MYSQL_ROOT_PASSWORD=jhYWl1RUl2yLmAEP",
                        "MYSQL_DATABASE=testdb",
                        "MYSQL_USER=testuser",
                        "MYSQL_PASSWORD=IKQdXoUfAsc1WcmlR"
                    ],
                    "deployCommand": "",
                    "deployCmd": null,
                    "deployArgs": [
                        "--max-allowed-packet=268435456",
                        "--character-set-server=utf8mb4",
                        "--collation-server=utf8mb4_unicode_ci"
                    ],
                    "deployResources": {
                        "memoryRequest": "20Mi",
                        "memoryLimit": "400Mi",
                        "cpuRequest": "0.2",
                        "cpuLimit": "1",
                        "extraRequest" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
                        "extraLimit" : [
                            {
                                "name" : "xxx",
                                "value" : "xxx",
                            }
                        ],
                    },
                    "deployVolumes": [
                        {
                            "pathInPod": "/var/lib/mysql",
                            "pathInPv": "tp1-mysql",
                            "pvc": ""
                        }
                    ],
                    "deployHealthCheck": {
                        "checkPort": 3306,
                        "httpGet": {
                            "path": "",
                            "port": 0,
                            "httpHeaders": null
                        },
                        "readinessDelaySeconds": 15,
                        "readinessPeriodSeconds": 5,
                        "livenessDelaySeconds": 60,
                        "livenessPeriodSeconds": 30
                    },
                    "dependServices": null,
                    "hostAliases": null,
                    "securityContext": {
                        "runAsUser": 0,
                        "runAsGroup": 0
                    }
                },
                "createTime": "04-20 21:26:13",
            },
        ],
        "totalCount": 1,
    }
}
```

#### [GET] api/admin/componentTemplate admin获取默认新增组件模板内容接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "deploySpecStatic": {
            "deployName": "tp1-mysql",
            "deployImage": "mysql:8.0.23",
            "deploySessionAffinityTimeoutSeconds": 0,
            "deployNodePorts": null,
            "deployLocalPorts": [
                {
                    "port": 3306,
                    "protocol": "tcp"
                }
            ],
            "deployReplicas": 1,
            "deployEnvs": [
                "MYSQL_ROOT_PASSWORD=jhYWl1RUl2yLmAEP",
                "MYSQL_DATABASE=testdb",
                "MYSQL_USER=testuser",
                "MYSQL_PASSWORD=IKQdXoUfAsc1WcmlR"
            ],
            "deployCommand": "",
            "deployCmd": null,
            "deployArgs": [
                "--max-allowed-packet=268435456",
                "--character-set-server=utf8mb4",
                "--collation-server=utf8mb4_unicode_ci"
            ],
            "deployResources": {
                "memoryRequest": "20Mi",
                "memoryLimit": "400Mi",
                "cpuRequest": "0.2",
                "cpuLimit": "1",
                "extraRequest" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
                "extraLimit" : [
                    {
                        "name" : "xxx",
                        "value" : "xxx",
                    }
                ],
            },
            "deployVolumes": [
                {
                    "pathInPod": "/var/lib/mysql",
                    "pathInPv": "tp1-mysql",
                    "pvc": ""
                }
            ],
            "deployHealthCheck": {
                "checkPort": 3306,
                "httpGet": {
                    "path": "",
                    "port": 0,
                    "httpHeaders": null
                },
                "readinessDelaySeconds": 15,
                "readinessPeriodSeconds": 5,
                "livenessDelaySeconds": 60,
                "livenessPeriodSeconds": 30
            },
            "dependServices": null,
            "hostAliases": null,
            "securityContext": {
                "runAsUser": 0,
                "runAsGroup": 0
            }
        },
    }
}
```

#### [POST] api/admin/componentTemplate admin新增组件模板接口

- request请求内容
```json
{
    "componentTemplateName": "xxx",
    "componentTemplateDesc": "xxx",
    "tenantCode": "xxx",
    "componentTemplateYaml": "xxx",
}
```

- componentTemplateYaml 参见 componentYaml yaml格式定义

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/componentTemplate/:componentTemplateName admin删除组件模板接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/componentTemplate/:componentTemplateName admin修改组件模板接口

- request请求内容
```json
{
    "componentTemplateName": "xxx",
    "componentTemplateDesc": "xxx",
    "tenantCode": "xxx",
    "componentTemplateYaml": "xxx",
}
```

- componentTemplateYaml 参见 componentYaml yaml格式定义

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/auditLogs admin审计日志列表与搜索接口

- request请求内容
```json
{
    "username":"xxx",
    "opTypes": [
        "xxx"
    ],
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "statusResults": [
        "xxx",
        "xxx"
    ],
    "withAdminLog": "yes",
    "withApplyTicket": "yes",
    "applyTicket": "xxx",
    "startTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - withAdminLog: 是否包含管理日志， yes/no/其他表示所有
    - withApplyTicket: 是否申请工单， yes/no/其他表示所有
    - sortMode: startTimeDesc, startTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list auditLogs success",
    "duration": "1.290581419s",
    "data": {
        "auditLogs": [
            {
                "auditLogID": "xxx",
                "opType": "xxx",
                "username": "xxx",
                "projectName": "xxx",
                "applyTicket": "xxx",
                "withAdminLog": false,
                "params": {
                    "key1": "value1",
                    "key2": "value2",
                    "key3": "value3",
                    "key4": "value4"
                },
                "status": "SUCCCESS",
                "msg": "project test-project5 create action commit success",
                "startTime": "02-16 12:12:12",
                "duration": "1ms"
            }
        ],
        "totalCount": 10
    }
}
```

#### [GET] api/admin/auditLogTypes admin审计日志类型接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list auditLogs success",
    "duration": "1.290581419s",
    "data": {
        "opTypes": [
            "xxx",
            "xxx"
        ],
        "totalCount": 10
    }
}
```
#### [POST] api/admin/attachment admin上传申请附件接口

- request请求内容
form-data模式，文件formName: attachment[]，支持上传多个文件

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "attachmentIDs": [
            "xxx",
        ],
    }
}
```

#### [GET] api/admin/attachment/:attachmentID admin下载附件接口

- response响应内容（出现异常的情况下返回错误）
```json
{
    "status": "FAIL",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

- response响应内容（正常情况下，进行文件下载）

#### [POST] api/admin/applies admin申请列表与搜索接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "kinds": [
        "xxx",
        "xxx"
    ],
    "statuses": [
        "xxx",
        "xxx"
    ],
    "mode": 0,
    "sortMode": 0,
    "applyTicket": "xxx",
    "username": "xxx",
    "name": "xxx",
    "title": "xxx",
    "content": "xxx",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "updateTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "page": 1,
    "perPage": 10
}
```

    - kinds: 申请单类型
        - nodePortAdd: 新增项目nodePort
        - nodePortDelete: 删除项目nodePort
        - envAdd: 新增项目环境
        - envDelete: 删除项目环境
        - envDeleteAll: 删除项目环境并清理名字空间
        - envUpdate: 更新项目环境
        - projectAdd: 新增项目
        - projectDelete: 删除项目
        - projectDeleteAll: 删除项目并清理名字空间
        - projectUpdate: 修改项目
        - envQuotaConfigUpdate: 设置项目环境的quotaConfig
        - envPvcAdd: 新增环境pvc
        - envPvcDelete: 删除环境pvc
        - envPvcScAdd: 新增环境存储类pvc
        - userAdd: 新增用户
        - other: 其他类型申请

    - statuses: 状态
        - reviewing: 审核确认（管理员）
        - returning; 退回确认（申请人）
        - processing: 处理中（管理员）
        - closing: 关闭确认（申请人）
        - closed: 已关闭（申请人）

    - sortMode: 排序方式
        - 0: 更新时间倒序
        - 1: 创建时间倒序
        - 2: 更新时间顺序
        - 3: 创建时间顺序
        - 4: 申请单号顺序
    - mode: 搜索模式
        - 0: 全部
        - 1: 我创建的
        - 2: 我相关的

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list apply success",
    "duration": "1.885145ms",
    "data": {
        "applies": [
            {
                "applyLogs": [
                    {
                        "attachments": [],
                        "content": "return content",
                        "createTime": "03-19 15:26:27",
                        "name": "DEVOPS-管理员",
                        "opType": "return",
                        "param": {
                            "mail": "xx",
                            "mobile": "xx",
                            "name": "xx",
                            "username": "xx"
                        },
                        "username": "devops-admin"
                    },
                    {
                        "attachments": [
                            {
                                "attachmentID": "605071521428a1a43afaee78",
                                "createTime": "03-16 16:50:26",
                                "fileExt": ".xlsx",
                                "fileName": "测试文件.xlsx",
                                "fileSize": 39629,
                                "name": "广东-测试01",
                                "username": "gd-test01"
                            },
                            {
                                "attachmentID": "60506cb71428a1a43afaee76",
                                "createTime": "03-16 16:30:47",
                                "fileExt": ".xlsx",
                                "fileName": "测试文件.xlsx",
                                "fileSize": 39629,
                                "name": "广东-测试01",
                                "username": "gd-test01"
                            }
                        ],
                        "content": "close content",
                        "createTime": "03-19 15:31:14",
                        "name": "DEVOPS-管理员",
                        "opType": "close",
                        "param": {
                            "mail": "yy",
                            "mobile": "yy",
                            "name": "yy",
                            "username": "yy"
                        },
                        "username": "devops-admin"
                    }
                ],
                "applyTicket": "envAdd-20210319-000002",
                "attachments": [
                    {
                        "attachmentID": "60506cb71428a1a43afaee76",
                        "createTime": "03-16 16:30:47",
                        "fileExt": ".xlsx",
                        "fileName": "测试文件.xlsx",
                        "fileSize": 39629,
                        "name": "广东-测试01",
                        "username": "gd-test01"
                    },
                    {
                        "attachmentID": "605071521428a1a43afaee78",
                        "createTime": "03-16 16:50:26",
                        "fileExt": ".xlsx",
                        "fileName": "测试文件.xlsx",
                        "fileSize": 39629,
                        "name": "广东-测试01",
                        "username": "gd-test01"
                    }
                ],
                "content": "nodePortAdd content",
                "createTime": "03-19 15:23:59",
                "kind": "envAdd",
                "name": "DEVOPS-管理员",
                "opParam": {
                    "xxx": [],
                    "yyy": {},
                    "zzz": "xxx",
                },
                "opTypes": [
                    "xxx",
                ],
                "todo": true,
                "param": {
                    "xxx": [],
                    "yyy": {},
                    "zzz": "xxx",
                },
                "showExecute": false,
                "projectName": "test-project1",
                "status": "closed",
                "title": "nodePortAdd",
                "updateTime": "03-19 15:31:14",
                "username": "devops-admin"
            },
        ],
        "auditID": "60545353bffa3893f0389391",
        "totalCount": 2,
        "withAdminLog": false
    }
```

    - applyLogs.opType: 操作类型
        - apply: 申请
        - return: 退回修改
        - accept: 接受
        - reply: 回复
        - modify: 修改
        - close: 关闭
        - comment: 留言

#### [POST] api/admin/apply/:applyTicket admin申请各类操作接口（修改/关闭/退回修改/处理/回复/阶段回复）

- request请求内容
```json
{
    "opType": "xxx",
    "content": "xxx",
    "param": {
        "xxx": [],
        "yyy": {},
        "zzz": "xxx",
    },
    "attachmentIDs": [
        "xxx",
    ]
}
```

    - opType: 操作类型
        - return: 退回修改（可修改参数）
        - accept: 接受（可修改参数）
        - reply: 回复（可修改参数）
        - modify: 修改（可修改参数）
        - close: 关闭
        - comment: 留言

    - param: 参数 （不同申请类型参数不一样）
        - nodePortAdd: 新增项目nodePort
            - 无参数
        - nodePortDelete: 删除项目nodePort
            - nodePort: 30010（不可修改）
        - envAdd: 新增项目环境
            - envNames: ["test123"]（不可修改）
        - envDelete: 删除项目环境
            - envName: "test123"（不可修改）
        - envDeleteAll: 删除项目环境并清理名字空间
            - envName: "test123"（不可修改）
        - envUpdate: 更新项目环境
            - envName: "test123"（不可修改）
            - privileged: false（可修改）
            - disabledDefs: []（可修改）
            - disabledPatches: []（可修改）
        - projectAdd: 新增项目
            - projectName: "test-project1"（可修改）
            - projectDesc: "测试-项目1"（可修改）
            - projectShortName: "tp1"（可修改）
            - projectTeam: "TP"（可修改）
        - projectDelete: 删除项目
            - 无参数
        - projectDeleteAll: 删除项目并清理名字空间
            - 无参数
        - projectUpdate: 修改项目
            - projectDesc: "测试-项目1"（可修改）
            - projectTeam: "TP"（可修改）
        - envQuotaConfigUpdate: 设置项目环境的quotaConfig
            - envName: "test" （不可修改）
            - namespaceQuota: {（可修改）
                memoryRequest: "100Mi", （可修改）
                cpuRequest: "100m", （可修改）
                memoryLimit: "1Gi", （可修改）
                cpuLimit: "1", （可修改）
                podsLimit: 64, （可修改）
                extraQuotas: [{"name": "xxx", "value": "xxx"}],（可修改）
            }
            - defaultQuota: {（可修改）
                memoryRequest: "100Mi",（可修改）
                cpuRequest: "100m",（可修改）
                memoryLimit: "1Gi",（可修改）
                cpuLimit: "1",（可修改）
                extraRequest: [{"name": "xxx", "value": "xxx"}],（可修改）
                extraLimit: [{"name": "xxx", "value": "xxx"}],（可修改）
            }
        - envPvcAdd: 新增环境pvc
            - envName: "test1"（不可修改）
            - pvNames: ["xxx-pvx"]（不可修改）
        - envPvcDelete: 删除环境pvc
            - envName: "test1"（不可修改）
            - pvcName: "xxx-pvx"（不可修改）
        - envPvcScAdd: 新增环境存储类pvc
            - envName: "test1"（不可修改）
            - scName: "xxx"（不可修改）
        - userAdd: 新增用户
            - username: "xxx"（可修改）
            - name: "xxx"（可修改）
            - mail: "xxx"（可修改）
            - mobile: "xxx"（可修改）
        - other: 其他类型申请
            - 无参数


- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/apply/:applyTicket/:projectName admin申请执行接口

- projectName 参数假如为空，请使用-，例如 "api/admin/apply/userAdd-20210321-000001/-/"

- request请求内容
```json
{
    "applyTicket": "xxx",
    "xxx": [],
    "yyy": {},
    "zzz": "xxx",
}
```

    - applyTicket: 需要在body参数中提供工单号参数，用于日志跟踪
    - xxx,yyy,zzz 表示 api/admin/applies接口输出的 opParam字段的参数

    - opType: 操作类型
        - return: 退回修改
        - accept: 接受
        - reply: 回复
        - modify: 修改
        - close: 关闭
        - comment: 留言

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/mailLogs admin邮件发送日志搜索接口

- request请求内容
```json
{
    "to": "xxx",
    "subject": "xxx",
    "enableResend": "yes",
    "statuses": [
        "SUCCESS"
    ],
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - enableResend: 是否允许重发邮件，yes/no/其他表示所有
    - statuses: SUCCESS / FAIL
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list mail logs success",
    "duration": "8.791092ms",
    "data": {
        "auditID": "63665b3ebf8084b7127b1176",
        "mailLogs": [
            {
                "attachments": [
                    "xxx",
                ],
                "createTime": "11-05 03:05:20",
                "duration": "2s751ms",
                "enableResend": false,
                "from": "DORY-管理员 <cookeem@cookeem.com>",
                "html": "",
                "mailLogID": "63656270bf8084b7127b1170",
                "msg": "",
                "status": "SUCCESS",
                "subject": "test-project1a-develop-90 FAIL",
                "text": "xxx",
                "to": [
                    "cookeem@qq.com"
                ]
            },
        ],
        "totalCount": 3,
        "withAdminLog": false
    }
}
```

#### [PUT] api/admin/mailLogs admin邮件日志重发接口

- request请求内容
```json
{
    "mailLogIDs": [
        "xxx"
    ]
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/triggerWebhookLogs admin webhook触发日志列表接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "pipelineNames": [
        "xxx",
        "xxx"
    ],
    "runNames": [
        "xxx",
        "xxx"
    ],
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "envNames": [
        "xxx",
        "xxx"
    ],
    "stepActions": [
        "xxx",
        "xxx"
    ],
    "moduleTypes": [
        "xxx",
        "xxx"
    ],
    "stepResults": [
        "xxx",
        "xxx"
    ],
    "requestResults": [
        "xxx",
        "xxx"
    ],
    "statusCodes": [
        0,
        404
    ],
    "isStep": "yes",
    "isBeforeExecute": "yes",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - isStep: yes / no / 其他情况表示全部
    - isBeforeExecute: yes / no / 其他情况表示全部
    - stepResults/requestResults: 步骤状态/状态
        - SUCCESS
        - FAIL
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list triggerWebhookLog success",
	"duration": "4.796407ms",
	"data": {
		"auditID": "62614f1083df579c93245a82",
		"totalCount": 2,
		"triggerWebhookLogs": [
			{
				"createTime": "04-21 20:33:07",
				"errMsg": "",
				"request": {
					"body": "xxx",
					"curl": "xxx",
					"forms": null,
					"headers": [
						{
							"name": "pipeline_name",
							"value": "test-project1-develop"
						},
						{
							"name": "Content-Type",
							"value": "application/json"
						}
					],
					"method": "POST",
					"queryParams": null,
					"url": "xxx"
				},
				"response": {
					"body": "xxx",
					"duration": "1s",
					"headers": [
						{
							"name": "X-Content-Type-Options",
							"value": "nosniff"
						},
						{
							"name": "X-Frame-Options",
							"value": "SAMEORIGIN"
						}
					],
					"kind": "json",
					"statusCode": 201
				},
				"result": "SUCCESS",
				"stepInfo": {
                    "beforeExecute": false,
					"branchName": "develop",
					"duration": "1s",
					"endTime": "04-21 20:33:06",
                    "envName": "test",
					"moduleType": "build",
					"msg": "step build tp1-gin-demo in go-1.17 env finish",
					"phaseID": "62614eff83df579c93245a48",
					"pipelineName": "test-project1-develop",
					"projectName": "test-project1",
					"result": "SUCCESS",
					"runName": "test-project1-develop-69",
					"stageID": "62614eff83df579c93245a4a",
					"startTime": "04-21 20:33:04",
					"stepAction": "build",
					"stepDetail": {
						"branchName": "develop",
						"buildChecks": [
							"ls -alh"
						],
						"buildCmds": [
							"pwd",
							"ls -al",
							"go mod tidy",
							"go build"
						],
                        "architecture": "amd64",
						"buildEnv": "go-1.17",
						"buildPath": "Codes/Backend/tp1-gin-demo",
						"buildPhaseID": 1,
						"gitRepoName": "gitea-dory",
						"latestCommit": "84787f2e8c9ad0fc66d7bf34ea8d9826621e1a60",
						"moduleName": "tp1-gin-demo",
						"pipelineName": "test-project1-develop",
						"projectName": "test-project1",
						"runName": "test-project1-develop-69"
					},
					"stepID": "62614eff83df579c93245a4c",
					"stepName": "build tp1-gin-demo in go-1.17 env"
				},
				"triggerWebhookLogID": "62614f0383df579c93245a77"
			}
		],
		"withAdminLog": false
	}
}
```

    - stepDetail: 不同的stepAction字段不一样，对应[POST] api/cicd/steps cicd执行步骤记录列表与搜索接口的stepDetail字段

#### [GET] api/admin/triggerWebhookLogOptions admin webhook触发日志选项接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list triggerWebhookLog options success",
    "duration": "1.646499ms",
    "data": {
        "auditID": "609e26d2043de703674d06ea",
        "branchNames": [
            "develop"
        ],
        "envNames": [
            "test"
        ],
        "moduleTypes": [
            "",
            "build"
        ],
        "projectNames": [
            "demo-project1"
        ],
        "pipelineNames": [
            "demo-project1-develop"
        ],
        "statusCodes": [
            0
        ],
        "stepActions": [
            "",
            "build"
        ],
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/triggerMailLogs admin 邮件触发日志列表接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "pipelineNames": [
        "xxx",
        "xxx"
    ],
    "runNames": [
        "xxx",
        "xxx"
    ],
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "envNames": [
        "xxx",
        "xxx"
    ],
    "stepActions": [
        "xxx",
        "xxx"
    ],
    "moduleTypes": [
        "xxx",
        "xxx"
    ],
    "stepResults": [
        "xxx",
        "xxx"
    ],
    "mailResults": [
        "xxx",
        "xxx"
    ],
    "statusCodes": [
        0,
        404
    ],
    "isStep": "yes",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - isStep: yes / no / 其他情况表示全部
    - stepResults/mailResults: 步骤状态/状态
        - SUCCESS
        - FAIL
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list triggerMailLog success",
    "duration": "123.617268ms",
    "data": {
        "auditID": "609e2b0ea1cda51809e33ec9",
        "totalCount": 33,
        "triggerMailLogs": [
			{
				"createTime": "04-22 14:40:37",
				"errMsg": "timed out",
				"mail": {
					"content": "xxx",
					"duration": "15s27ms",
					"logFile": "/dory-data/triggerMail/0Xb6H8KpKGaziUwc/test-project1-develop-86-62624de24e8ae0487b967063.log",
					"receiverMail": "xxx@139.com",
					"title": "test-project1-develop-86 [SUCCESS]",
					"varFile": "/dory-data/triggerMail/0Xb6H8KpKGaziUwc/test-project1-develop-86-62624de24e8ae0487b967063.yaml"
				},
				"result": "FAIL",
				"stepInfo": {
                    "beforeExecute": false,
					"branchName": "develop",
					"duration": "1s920ms",
					"endTime": "04-22 14:40:36",
					"envName": "",
					"moduleType": "build",
					"msg": "step build tp1-gin-demo in go-1.17 env finish",
					"phaseID": "62624de24e8ae0487b96705f",
					"pipelineName": "test-project1-develop",
					"projectName": "test-project1",
					"result": "SUCCESS",
					"runName": "test-project1-develop-86",
					"stageID": "62624de24e8ae0487b967061",
					"startTime": "04-22 14:40:34",
					"stepAction": "build",
					"stepDetail": {
						"branchName": "develop",
						"buildChecks": [
							"ls -alh"
						],
						"buildCmds": [
							"pwd",
							"ls -al",
							"go mod tidy",
							"go build"
						],
                        "architecture": "amd64",
						"buildEnv": "go-1.17",
						"buildPath": "Codes/Backend/tp1-gin-demo",
						"buildPhaseID": 1,
						"gitRepoName": "gitea-dory",
						"latestCommit": "1ee9f4aa45a042a8013a8fb22f5a0e2998cdb308",
						"moduleName": "tp1-gin-demo",
						"pipelineName": "test-project1-develop",
						"projectName": "test-project1",
						"runName": "test-project1-develop-86"
					},
					"stepID": "62624de24e8ae0487b967063",
					"stepName": "build tp1-gin-demo in go-1.17 env"
				},
				"triggerMailLogID": "62624df44e8ae0487b96709a"
			}
        ],
        "withAdminLog": false
    }
}
```

    - stepDetail: 不同的stepAction字段不一样，对应[POST] api/cicd/steps cicd执行步骤记录列表与搜索接口的stepDetail字段

#### [GET] api/admin/triggerMailLogOptions admin 邮件触发日志选项接口

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list triggerMailLog options success",
	"duration": "2.907565ms",
	"data": {
		"auditID": "62624e0f4e8ae0487b9670a6",
		"branchNames": [
			"develop"
		],
		"envNames": [
			""
		],
		"moduleTypes": [
			"",
			"build",
			"xxx"
		],
		"pipelineNames": [
			"test-project1-develop"
		],
		"projectNames": [
			"test-project1"
		],
		"stepActions": [
			"",
			"build",
			"xxx"
		],
		"withAdminLog": false
	}
}
```

#### [POST] api/admin/notifications admin 通知列表接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "pipelineNames": [
        "xxx",
        "xxx"
    ],
    "runNames": [
        "xxx",
        "xxx"
    ],
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "envNames": [
        "xxx",
        "xxx"
    ],
    "stepActions": [
        "xxx",
        "xxx"
    ],
    "moduleTypes": [
        "xxx",
        "xxx"
    ],
    "stepResults": [
        "xxx",
        "xxx"
    ],
    "usernames": [
        "xxx",
        "xxx"
    ],
    "isStep": "yes",
    "read": "yes",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - isStep: yes / no / 其他情况表示全部
    - read: yes / no / 其他情况表示全部
    - stepResults: 步骤状态
        - SUCCESS
        - FAIL
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list notification success",
    "duration": "29.451933ms",
    "data": {
        "auditID": "609e2c24a1cda51809e33ecb",
        "notifications": [
            {
                "content": "",
                "createTime": "05-13 23:38:50",
                "kind": "runStep",
                "notificationID": "609d480a606d067c47b75714",
                "stepInfo": {
                    "beforeExecute": false,
                    "branchName": "develop",
                    "duration": "3s870ms",
                    "endTime": "05-13 23:38:49",
                    "envName": "test",
                    "moduleType": "build",
                    "msg": "step build dp1-gin-demo in go-1.14 env finish",
                    "pipelineName": "demo-project1-develop",
                    "projectName": "demo-project1",
                    "result": "SUCCESS",
                    "runName": "demo-project1-develop-13",
                    "startTime": "05-13 23:38:45",
                    "stepAction": "build",
                    "stepDetail": {
                        "k1": "v1",
                        "k2": "v2",
                    },
                    "stepName": "build dp1-gin-demo in go-1.14 env"
                },
                "readTime": "",
                "title": "run:[demo-project1-develop-13] step:[build dp1-gin-demo in go-1.14 env] result:[SUCCESS]",
                "username": "devops-admin"
            }
        ],
        "totalCount": 14,
        "withAdminLog": false
    }
}
```

    - stepDetail: 不同的stepAction字段不一样，对应[POST] api/cicd/steps cicd执行步骤记录列表与搜索接口的stepDetail字段

#### [GET] api/admin/notificationOptions admin 通知选项接口

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list notification options success",
	"duration": "2.700574ms",
	"data": {
		"auditID": "6262741179df3710c7cdb76e",
		"branchNames": [
			"develop"
		],
		"envNames": [
			"",
			"test"
		],
		"moduleTypes": [
			"",
			"build",
			"deploy",
			"package",
			"xxx"
		],
		"pipelineNames": [
			"test-project1-develop"
		],
		"projectNames": [
			"test-project1"
		],
		"stepActions": [
			"",
			"build",
			"checkDeploy",
			"deploy",
			"packageImage",
			"xxx"
		],
		"usernames": [
			"dory-admin",
			"test-cookeem",
			"test-user01"
		],
		"withAdminLog": false
	}
}
```

#### [POST] api/admin/announcement admin发布公告接口

- request请求内容
```json
{
    "level": "xxx",
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
        "xxx",
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/announcement/:announcementID admin删除公告接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/announcementOptions admin 公告选项接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "announcement option list success",
    "duration": "1.630544ms",
    "data": {
        "levels": [
            "xxx"
        ],
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/announcement/attachment admin上传公告附件接口

- request请求内容
form-data模式，文件formName: attachment[]，支持上传多个文件

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "attachments": [
            {
                "attachmentID": "xxx",
                "filePath": "xxx",
            },
        ],
    }
}
```

#### [GET] api/admin/adminWebhookVars admin管理webhook变量说明接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "content": "xxx",
    }
}
```

#### [GET] api/admin/adminWebhooks admin管理webhook列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "adminWebhooks": [
            {
                "adminWebhookID": "xxx",
                "tenantCode": "xxx",
                "adminAction": "xxx",
                "enable": false,
                "webhookUrl": "https://www.baidu.com",
                "insecure": false,
                "webhookMethod": "GET",
                "webhookHeaders": [
                    {
                        "name": "xxx",
                        "value": "xxx",
                    },
                ],
                "webhookQueryParams": [
                    {
                        "name": "xxx",
                        "value": "xxx",
                    },
                ],
                "webhookForms": [
                    {
                        "name": "xxx",
                        "value": "xxx",
                    },
                ],
                "webhookBody": "xxx",
                "username": "xxx",
                "createTime": "xxx",
            },
        ],
    }
}
```

#### [GET] api/admin/adminWebhookOptions admin管理webhook选项列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
        "adminActions": [
            "xxx",
        ]
    }
}
```

#### [POST] api/admin/adminWebhook admin新增管理webhook接口

- request请求内容
```json
{
    "adminAction": "xxx",
    "tenantCode": "xxx",
    "enable": false,
    "webhookUrl": "https://www.baidu.com",
    "insecure": false,
    "webhookMethod": "GET",
    "webhookHeaders": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookQueryParams": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookForms": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookBody": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [POST] api/admin/adminWebhook/:adminWebhookID admin修改管理webhook接口

- request请求内容
```json
{
    "adminAction": "xxx",
    "enable": false,
    "webhookUrl": "https://www.baidu.com",
    "insecure": false,
    "webhookMethod": "GET",
    "webhookHeaders": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookQueryParams": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookForms": [
        {
            "name": "xxx",
            "value": "xxx",
        },
    ],
    "webhookBody": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [DELETE] api/admin/adminWebhook/:adminWebhookID admin删除管理webhook接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": false,
    }
}
```

#### [POST] api/admin/adminWebhookLogs admin管理webhook触发日志列表接口

- request请求内容
```json
{
    "adminActions": [
        "xxx",
        "xxx"
    ],
    "tenantCodes": [
        "xxx",
        "xxx"
    ],
    "results": [
        "xxx",
        "xxx"
    ],
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```
    - results: webhook状态
        - SUCCESS
        - FAIL
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list triggerWebhookLog success",
	"duration": "4.796407ms",
	"data": {
		"auditID": "62614f1083df579c93245a82",
		"totalCount": 2,
		"adminWebhookLogs": [
			{
                "adminAction": "userAdd",
				"adminWebhookLogID": "62614f0383df579c93245a77",
                "adminWebhookVars": {
                    "xxx": "xxx",
                    "yyy": "yyy",
                },
				"createTime": "04-21 20:33:07",
				"errMsg": "",
				"request": {
					"body": "xxx",
					"curl": "xxx",
					"forms": null,
					"headers": [
						{
							"name": "pipeline_name",
							"value": "test-project1-develop"
						},
						{
							"name": "Content-Type",
							"value": "application/json"
						}
					],
					"method": "POST",
					"queryParams": null,
					"url": "xxx"
				},
				"response": {
					"body": "xxx",
					"duration": "1s",
					"headers": [
						{
							"name": "X-Content-Type-Options",
							"value": "nosniff"
						},
						{
							"name": "X-Frame-Options",
							"value": "SAMEORIGIN"
						}
					],
					"kind": "json",
					"statusCode": 201
				},
				"result": "SUCCESS",
			}
		],
		"withAdminLog": false
	}
}
```

#### [POST] api/admin/customStepConfs admin自定义步骤配置列表与搜索接口

- request请求内容
```json
{
    "tenantCodes": ["xxx"],
    "customStepNames": ["xxx"],
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "page": 1,
    "perPage": 10
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list customStepConf success",
    "duration": "448.666739ms",
    "data": {
        "auditID": "60dc397f17dc5d201ba5cec5",
        "customStepNames": [
            "xxx",
        ],
        "customStepConfs": [
            {
                "customStepID": "xxx",
                "customStepName": "envTestRobot",
                "tenantCode": "xxx",
                "customStepActionDesc": "test with robotframework",
                "customStepDesc": "test with robotframework in envK8sYaml",
                "customStepUsage": "在目标环境执行testRobot测试说明文档",
                "customStepDockerConf": {
                    "dockerImage": "busybox:latest",
                    "registryUsername": "",
                    "registryPassword": "",
                    "dockerCommands": [
                        "sh -c 'cat /etc/hosts'"
                    ],
                    "dockerShowCommands": false,
                    "dockerRunAsRoot": false,
                    "dockerVolumes": [
                        "xxx",
                    ],
                    "dockerEnvs": [
                        "xxx",
                    ],
                    "dockerExtraHosts": [
                        {
                            "hostname": "xxx",
                            "ip": "192.168.0.1",
                        },
                    ],
                    "dockerWorkDir": "xxx",
                    "paramInputFormat": "yaml",
                    "paramOutputFormat": "yaml"
                },
                "paramInputYamlDef": "key: input value",
                "paramOutputYamlDef": "key: output value",
                "isEnvDiff": true,
                "projectNames": [
                    "test-project1"
                ]
            },
        ],
        "totalCount": 2,
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/customStepConf admin自定义步骤配置新增接口

- request请求内容
```json
{
    "customStepConfYaml": "xxx",
}
```

- customStepConfYaml yaml格式
- 自定义步骤配置

```yaml
# 自定义步骤名称*
# ++ 自定义步骤的英文标识名称
# ++ 例如: buildIosApp
customStepName: buildIosApp
# 租户编码
# ++ 一旦设置则只有该租户才能使用该资源
tenantCode: 'xxx'
# 自定义步骤英文描述*
# ++ 用于自动生成自定义步骤的阶段、环节、步骤的英文描述
# ++ 例如: build ios app
# ++ 生成的阶段说明效果为: build ios app in test-env
# ++ 生成的环节、步骤说明效果为: build ios app dory-engine in test-env
customStepActionDesc: build ios app
# 自定义步骤说明*
# ++ ops流水线操作类型选择的时候显示的步骤操作类型信息
# ++ 可以使用中文，例如: 在远程macOS主机编译ios应用
customStepDesc: 在远程macOS主机编译ios应用
# 自定义步骤的使用说明*
# ++ 告诉自定义步骤的使用者如何设置才能使用本步骤的简要说明
# @@ 多行文本输入框
customStepUsage: 构建iOS应用的相关使用说明内容
# 自定义脚本的代码仓库
gitRepoName: gitea-dory
# 自定义步骤脚本的代码仓库路径
gitRepoPath: test-project1/test-project1
# 自定义步骤脚本的代码分支
gitRepoBranch: develop
# 是否不同环境需要不同自定义步骤配置*
# ++ 假如项目需要针对不同环境需要设置不同的自定义步骤配置，那么请设置为是
# ++ 设置为是之后，必须每个环境独立设置自定义步骤配置
# @@ 多行输入框
isEnvDiff: false
# 自定义步骤执行容器设置*
customStepDockerConf:
  # 自定义步骤执行容器镜像*
  # ++ 请把步骤执行容器的镜像上传到harbor，并设置镜像
  # ++ 在harbor中的镜像相对路径，请不要包含harbor的域名
  # ++ 例如：public/busybox:latest
  dockerImage: public/busybox:latest
  # 镜像仓库账号
  # ++ 假如构建环境的容器镜像需要账号密码才能拉取，则需要提供，否则不要填写
  registryUsername: ""
  # 镜像仓库密码
  # ++ 假如构建环境的容器镜像需要账号密码才能拉取，则需要提供，否则不要填写
  registryPassword: ""
  # 自定义步骤执行容器的执行命令*
  # ++ 进入执行容器的时候，使用什么命令来执行该自定义步骤
  # ++ 支持使用变量，变量对应paramInputYamlDef的输入参数设置，例如paramInputYamlDef中设置了buildPath参数
  # ++ 那么可以使用  {{ .buildPath }} 作为路径的参数替换值。例如用户设置了buildPath=xxx 那么 {{ .buildPath }}将会替换为xxx
  # ++ 内置变量包括 {{ .projectName }}（项目名称）、{{ .pipelineName }}（流水线名称）、{{ .runName }}（运行名称）、{{ .runNumber }}（运行编号）
  # ++ 内置变量包括 {{ .moduleName }}（模块名称） 、 {{ .envName }}（当前执行环境名称）、{{ .branchName }}（分支名称）
  dockerCommands:
  - "build_ios_app.py -f /{{ .moduleName }}/{{ .envName }}"
  # 是否显示命令*
  dockerShowCommands: false,
  # 容器是否使用root作为执行用户*
  dockerRunAsRoot: false
  # 容器挂装卷设置
  # ++ 代码仓库的相对路径挂装到容器中的哪个目录
  # ++ 支持使用变量，变量对应paramInputYamlDef的输入参数设置，例如paramInputYamlDef中设置了buildPath参数
  # ++ 那么可以使用  {{ .buildPath }} 作为路径的参数替换值。例如用户设置了buildPath=xxx 那么 {{ .buildPath }}将会替换为xxx
  # ++ 内置变量包括 {{ .projectName }}（项目名称）、{{ .pipelineName }}（流水线名称）、{{ .runName }}（运行名称）、{{ .runNumber }}（运行编号）
  # ++ 内置变量包括 {{ .moduleName }}（模块名称） 、 {{ .envName }}（当前执行环境名称）、{{ .branchName }}（分支名称）
  # ++ 如果不设置，默认把代码仓库的根目录挂装到容器中的/{{ .projectName }}目录
  # @@ 分为两个部分: localPath:dockerPath
  # @@ localPath：代码仓库的相对路径，不能以/开头
  # @@ dockerPath：容器中的挂装点路径，必须以/开头
  dockerVolumes:
  - "{{ .buildPath }}/{{ .envName }}/test:/test/"
  # 容器环境变量设置
  # ++ 容器中的环境变量设置
  # ++ 支持使用变量，变量对应paramInputYamlDef的输入参数设置，例如paramInputYamlDef中设置了buildPath参数
  # ++ 那么可以使用  {{ .buildPath }} 作为路径的参数替换值。例如用户设置了buildPath=xxx 那么 {{ .buildPath }}将会替换为xxx
  # ++ 内置变量包括 {{ .projectName }}（项目名称）、{{ .pipelineName }}（流水线名称）、{{ .runName }}（运行名称）、{{ .runNumber }}（运行编号）
  # ++ 内置变量包括 {{ .moduleName }}（模块名称） 、 {{ .envName }}（当前执行环境名称）、{{ .branchName }}（分支名称）
  # @@ 分为两个部分: key=value
  # @@ key：变量名
  # @@ value：变量值
  dockerEnvs:
  - "KEY1=VAL1"
  # 容器主机名解析设置
  dockerExtraHosts:
  - hostname: xxx
    ip: 192.168.0.1
  # 容器的工作目录
  # ++ 请填写容器中的绝对路径，必须以/开头
  # ++ 支持使用变量，变量对应paramInputYamlDef的输入参数设置，例如paramInputYamlDef中设置了buildPath参数
  # ++ 那么可以使用  {{ .buildPath }} 作为路径的参数替换值。例如用户设置了buildPath=xxx 那么 {{ .buildPath }}将会替换为xxx
  # ++ 内置变量包括 {{ .projectName }}（项目名称）、{{ .pipelineName }}（流水线名称）、{{ .runName }}（运行名称）、{{ .runNumber }}（运行编号）
  # ++ 内置变量包括 {{ .moduleName }}（模块名称） 、 {{ .envName }}（当前执行环境名称）、{{ .branchName }}（分支名称）
  dockerWorkDir: "/app/{{ .moduleName }}/{{ .envName }}"
# 自定义步骤输入参数格式定义
# ++ 自定义步骤的输入参数设置以及参数说明信息，使用yaml格式
# ++ 项目在设置自定义步骤模块的时候，可以设置该模块特定的步骤执行参数
# ++ 该输入参数将会以文件的形式挂装到步骤执行容器的/tmp/dory-param-input.json或者.yaml文件，步骤执行容器可以读取该输入参数，进行相应的步骤处理
# ++ 必须输入完整的输入参数例子
# ++ 例如：
# ++ # 构建路径，代码所在的相对路径（必填）
# ++ buildPath: Codes/test-ios-app/src
# ++ # 构架资产数设置（选填）
# ++ buildArgs: --ignore-test
# @@ 多行文本输入框
paramInputYamlDef: xxx
# 自定义步骤输出参数格式定义
# ++ 自定义步骤在docker容器中执行完成之后，如果需要把执行结果写入到步骤执行记录中，那么请设置本参数
# ++ 该输出参数应该写到步骤执行容器的/tmp/dory-param-output.json或者.yaml文件中，流水线会读取该输出参数文件，并写入到步骤执行记录中
# ++ 必须输入完整的输出参数例子
# ++ 例如：
# ++ # 构建结果文件名
# ++ buildResult: test-ios-app.ipa
# ++ # 构建结果大小
# ++ buildFileSize: 10M
# @@ 多行文本输入框
paramOutputYamlDef: xxx
# 步骤输入参数的文件格式*
# ++ 所有paramInputYamlDef设置的输入参数以及流水线运行时的所有状态参数都会以参数文件的方式挂装到步骤执行容器
# ++ 输入参数文件自动挂装在步骤执行容器的/tmp/dory-param-input.json或者.yaml文件中
# ++ 步骤执行容器读取输入参数文件，作为步骤执行的输入参数
# ++ 输入参数文件的格式支持两种，yaml或者json
# @@ 下拉选择： yaml、json
paramInputFormat: xxx
# 步骤输出参数的文件格式*
# ++ 如果步骤执行结果的内容需要保存到步骤详细记录中，那么请在步骤执行完后，把执行结果文件保存在步骤执行容器的/tmp/dory-param-output.json或者.yaml文件中
# ++ 所有paramOutputYamlDef设置的输出参数请保存在该输出参数文件中
# ++ 步骤执行结束后，流水线会从本目录读取步骤输出参数文件，并写入到步骤详细记录中
# ++ 输出参数文件的格式支持两种，yaml或者json
# @@ 下拉选择： yaml、json
paramOutputFormat: xxx
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [POST] api/admin/customStepConf/:customStepName admin自定义步骤配置修改接口

- request请求内容
```json
{
    "customStepConfYaml": "xxx",
}
```

- customStepConfYaml yaml格式
- 自定义步骤配置
- 参见 [POST] api/admin/customStepConf admin自定义步骤配置新增接口 的customStepConfYaml说明

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [DELETE] api/admin/customStepConf/:customStepName admin自定义步骤配置删除接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/admin/repoNames admin可用仓库配置选项接口，用于新增项目的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list repoNames success",
    "duration": "4.9µs",
    "data": {
        "artifactRepoNames": [
            "nexus-dory"
        ],
        "auditID": "xxx",
        "gitRepoNames": [
            "gitlab-dory",
            "gitea-dory"
        ],
        "imageRepoNames": [
            "harbor-dory"
        ],
        "scanCodeRepoNames": [
            "sonarqube-dory"
        ],
        "withAdminLog": false
    }
}
```

#### [GET] api/admin/repoNames/search admin可用仓库配置选项接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list repoNames success",
    "duration": "4.9µs",
    "data": {
        "artifactRepoNames": [
            "nexus-dory"
        ],
        "auditID": "xxx",
        "gitRepoNames": [
            "gitlab-dory",
            "gitea-dory"
        ],
        "imageRepoNames": [
            "harbor-dory"
        ],
        "scanCodeRepoNames": [
            "sonarqube-dory"
        ],
        "withAdminLog": false
    }
}
```

#### [POST] api/admin/repoNames/tenantCode admin可用仓库配置选项接口，用于自定义步骤页面选择代码仓库用途

- request请求内容
```json
{
    "tenantCode": "xxx",
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "artifactRepoNames": [
            "nexus-dory"
        ],
        "auditID": "xxx",
        "gitRepoNames": [
            "gitlab-dory",
            "gitea-dory"
        ],
        "imageRepoNames": [
            "harbor-dory"
        ],
        "scanCodeRepoNames": [
            "sonarqube-dory"
        ],
        "withAdminLog": false
    }
}
```

