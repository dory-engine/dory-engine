# api/console接口文档

## 目录

- [api/console接口文档](#apiconsole接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [console 项目控制台接口](#console-项目控制台接口)
      - [\[GET\] api/console/projectNames console项目名称列表接口，用于搜索的下拉列表](#get-apiconsoleprojectnames-console项目名称列表接口用于搜索的下拉列表)
      - [\[GET\] api/console/projectEnvs console项目与可用环境列表接口，用于把主机/数据库加入到项目环境](#get-apiconsoleprojectenvs-console项目与可用环境列表接口用于把主机数据库加入到项目环境)
      - [\[POST\] api/console/projects console项目列表与搜索接口](#post-apiconsoleprojects-console项目列表与搜索接口)
      - [\[GET\] api/console/project/:projectName console项目查看接口](#get-apiconsoleprojectprojectname-console项目查看接口)
      - [\[GET\] api/console/project/:projectName/minimal console项目查看接口精简](#get-apiconsoleprojectprojectnameminimal-console项目查看接口精简)
      - [\[POST\] api/console/project/:projectName/nodePortAdd console\[申请\]为项目分配NodePort接口](#post-apiconsoleprojectprojectnamenodeportadd-console申请为项目分配nodeport接口)
      - [\[POST\] api/console/project/:projectName/nodePortDelete console\[申请\]为项目回收NodePort接口](#post-apiconsoleprojectprojectnamenodeportdelete-console申请为项目回收nodeport接口)
      - [\[POST\] api/console/project/:projectName/envAdd console\[申请\]为项目分配新环境接口](#post-apiconsoleprojectprojectnameenvadd-console申请为项目分配新环境接口)
      - [\[POST\] api/console/project/:projectName/envDelete console\[申请\]为项目回收环境接口](#post-apiconsoleprojectprojectnameenvdelete-console申请为项目回收环境接口)
      - [\[POST\] api/console/project/:projectName/envDeleteAll console\[申请\]为项目回收环境并清理名字空间接口](#post-apiconsoleprojectprojectnameenvdeleteall-console申请为项目回收环境并清理名字空间接口)
      - [\[POST\] api/console/project/:projectName/envUpdate console\[申请\]修改项目环境设置接口](#post-apiconsoleprojectprojectnameenvupdate-console申请修改项目环境设置接口)
      - [\[POST\] api/console/project/:projectName/delete console\[申请\]删除项目接口](#post-apiconsoleprojectprojectnamedelete-console申请删除项目接口)
      - [\[POST\] api/console/project/:projectName console\[申请\]修改项目接口](#post-apiconsoleprojectprojectname-console申请修改项目接口)
      - [\[POST\] api/console/project/:projectName/refreshToken console为项目更新所有密钥接口](#post-apiconsoleprojectprojectnamerefreshtoken-console为项目更新所有密钥接口)
      - [\[POST\] api/console/project/:projectName/reApply console重新应用项目配置到所有可用环境](#post-apiconsoleprojectprojectnamereapply-console重新应用项目配置到所有可用环境)
      - [\[POST\] api/console/project/:projectName/cleanGitRepo console清理临时代码仓库](#post-apiconsoleprojectprojectnamecleangitrepo-console清理临时代码仓库)
      - [\[GET\] api/console/project/:projectName/members console项目分配用户列表接口](#get-apiconsoleprojectprojectnamemembers-console项目分配用户列表接口)
      - [\[POST\] api/console/project/:projectName/memberAdd console为项目分配用户接口](#post-apiconsoleprojectprojectnamememberadd-console为项目分配用户接口)
      - [\[POST\] api/console/project/:projectName/memberDelete console为项目移除用户接口](#post-apiconsoleprojectprojectnamememberdelete-console为项目移除用户接口)
      - [\[POST\] api/console/project/:projectName/memberUpdate console为项目修改用户角色接口](#post-apiconsoleprojectprojectnamememberupdate-console为项目修改用户角色接口)
      - [\[GET\] api/console/project/:projectName/branchNames console查看当前项目代码仓库分支接口](#get-apiconsoleprojectprojectnamebranchnames-console查看当前项目代码仓库分支接口)
      - [\[POST\] api/console/project/:projectName/pipelineAdd console为项目新增流水线接口](#post-apiconsoleprojectprojectnamepipelineadd-console为项目新增流水线接口)
      - [\[POST\] api/console/project/:projectName/pipelineDelete console为项目删除流水线接口](#post-apiconsoleprojectprojectnamepipelinedelete-console为项目删除流水线接口)
      - [\[POST\] api/console/project/:projectName/pipelineEnvAdd console为项目流水线新增环境接口](#post-apiconsoleprojectprojectnamepipelineenvadd-console为项目流水线新增环境接口)
      - [\[POST\] api/console/project/:projectName/pipelineEnvDelete console为项目流水线删除环境接口](#post-apiconsoleprojectprojectnamepipelineenvdelete-console为项目流水线删除环境接口)
      - [\[POST\] api/console/project/:projectName/pipelineGitWebhook console为项目流水线设置git webhook触发器接口](#post-apiconsoleprojectprojectnamepipelinegitwebhook-console为项目流水线设置git-webhook触发器接口)
      - [\[POST\] api/console/project/:projectName/pipelineTokenRefresh console重置流水线token接口](#post-apiconsoleprojectprojectnamepipelinetokenrefresh-console重置流水线token接口)
      - [\[POST\] api/console/project/:projectName/pipelineCronAdd console为项目流水线新增计划任务接口](#post-apiconsoleprojectprojectnamepipelinecronadd-console为项目流水线新增计划任务接口)
      - [\[POST\] api/console/project/:projectName/pipelineCronCopy console为项目流水线复制计划任务接口](#post-apiconsoleprojectprojectnamepipelinecroncopy-console为项目流水线复制计划任务接口)
      - [\[POST\] api/console/project/:projectName/pipelineCronDelete console为项目流水线移除计划任务接口](#post-apiconsoleprojectprojectnamepipelinecrondelete-console为项目流水线移除计划任务接口)
      - [\[GET\] api/console/project/:projectName/pipelineTriggerStepActions console触发器步骤选项接口](#get-apiconsoleprojectprojectnamepipelinetriggerstepactions-console触发器步骤选项接口)
      - [\[POST\] api/console/project/:projectName/pipelineTriggerOp console为项目流水线新增修改触发器接口](#post-apiconsoleprojectprojectnamepipelinetriggerop-console为项目流水线新增修改触发器接口)
      - [\[POST\] api/console/project/:projectName/pipelineTriggerCopy console为项目流水线复制触发器接口](#post-apiconsoleprojectprojectnamepipelinetriggercopy-console为项目流水线复制触发器接口)
      - [\[POST\] api/console/project/:projectName/pipelineTriggerDelete console为项目流水线移除触发器接口](#post-apiconsoleprojectprojectnamepipelinetriggerdelete-console为项目流水线移除触发器接口)
      - [\[POST\] api/console/project/:projectName/envQuotaConfigUpdate console\[申请\]为项目环境设置quotaConfig接口](#post-apiconsoleprojectprojectnameenvquotaconfigupdate-console申请为项目环境设置quotaconfig接口)
      - [\[POST\] api/console/project/:projectName/envPvcAdd console\[申请\]为项目环境分配pvc接口](#post-apiconsoleprojectprojectnameenvpvcadd-console申请为项目环境分配pvc接口)
      - [\[POST\] api/console/project/:projectName/envPvcDelete console\[申请\]为项目环境回收pvc接口](#post-apiconsoleprojectprojectnameenvpvcdelete-console申请为项目环境回收pvc接口)
      - [\[POST\] api/console/project/:projectName/envPvcScAdd console\[申请\]为项目环境分配存储类pvc接口](#post-apiconsoleprojectprojectnameenvpvcscadd-console申请为项目环境分配存储类pvc接口)
      - [\[POST\] api/console/project/:projectName/envNetworkPolicyAdd console为项目新增网络策略接口](#post-apiconsoleprojectprojectnameenvnetworkpolicyadd-console为项目新增网络策略接口)
      - [\[POST\] api/console/project/:projectName/envNetworkPolicyDelete console为项目环境删除网络策略接口](#post-apiconsoleprojectprojectnameenvnetworkpolicydelete-console为项目环境删除网络策略接口)
      - [\[POST\] api/console/project/:projectName/envHostAdd console为项目环境分配主机接口](#post-apiconsoleprojectprojectnameenvhostadd-console为项目环境分配主机接口)
      - [\[POST\] api/console/project/:projectName/envHostDelete console为项目环境回收主机接口](#post-apiconsoleprojectprojectnameenvhostdelete-console为项目环境回收主机接口)
      - [\[POST\] api/console/project/:projectName/envHostJoin console把主机加入其他项目环境接口](#post-apiconsoleprojectprojectnameenvhostjoin-console把主机加入其他项目环境接口)
      - [\[POST\] api/console/project/:projectName/envHostLeave console把主机移除项目环境接口](#post-apiconsoleprojectprojectnameenvhostleave-console把主机移除项目环境接口)
      - [\[POST\] api/console/project/:projectName/envHostUpdate console修改主机信息接口](#post-apiconsoleprojectprojectnameenvhostupdate-console修改主机信息接口)
      - [\[POST\] api/console/project/:projectName/envDbAdd console为项目环境分配数据库接口](#post-apiconsoleprojectprojectnameenvdbadd-console为项目环境分配数据库接口)
      - [\[POST\] api/console/project/:projectName/envDbDelete console为项目环境回收数据库接口](#post-apiconsoleprojectprojectnameenvdbdelete-console为项目环境回收数据库接口)
      - [\[POST\] api/console/project/:projectName/envDbJoin console把数据库加入项目环境接口](#post-apiconsoleprojectprojectnameenvdbjoin-console把数据库加入项目环境接口)
      - [\[POST\] api/console/project/:projectName/envDbLeave console把数据库移除项目环境接口](#post-apiconsoleprojectprojectnameenvdbleave-console把数据库移除项目环境接口)
      - [\[POST\] api/console/project/:projectName/envDbUpdate console修改数据库信息接口](#post-apiconsoleprojectprojectnameenvdbupdate-console修改数据库信息接口)
      - [\[GET\] api/console/project/:projectName/envComponentDebugDefault console获取debug组件默认模板接口](#get-apiconsoleprojectprojectnameenvcomponentdebugdefault-console获取debug组件默认模板接口)
      - [\[POST\] api/console/project/:projectName/envComponentDebugUpdate console在项目环境调整debug组件接口](#post-apiconsoleprojectprojectnameenvcomponentdebugupdate-console在项目环境调整debug组件接口)
      - [\[POST\] api/console/project/:projectName/envComponentDebugDelete console在项目环境删除debug组件接口](#post-apiconsoleprojectprojectnameenvcomponentdebugdelete-console在项目环境删除debug组件接口)
      - [\[GET\] api/console/project/:projectName/envComponentTemplates console获取组件模板列表接口](#get-apiconsoleprojectprojectnameenvcomponenttemplates-console获取组件模板列表接口)
      - [\[POST\] api/console/project/:projectName/envComponentUpdate console在项目环境调整组件接口](#post-apiconsoleprojectprojectnameenvcomponentupdate-console在项目环境调整组件接口)
      - [\[POST\] api/console/project/:projectName/envComponentDelete console在项目环境删除组件接口](#post-apiconsoleprojectprojectnameenvcomponentdelete-console在项目环境删除组件接口)
      - [\[GET\] api/console/env/:envName/pvNames console获取环境可用pv列表接口](#get-apiconsoleenvenvnamepvnames-console获取环境可用pv列表接口)
      - [\[GET\] api/console/env/:envName/scNames console获取环境所有storageclass名字列表接口](#get-apiconsoleenvenvnamescnames-console获取环境所有storageclass名字列表接口)
      - [\[POST\] api/console/user console\[申请\]新用户接口](#post-apiconsoleuser-console申请新用户接口)
      - [\[POST\] api/console/userNames/tenantCode console用户名列表接口，用于项目查看页项目member设置选择用户用途](#post-apiconsoleusernamestenantcode-console用户名列表接口用于项目查看页项目member设置选择用户用途)
      - [\[POST\] api/console/envNames/tenantCode console环境名列表接口，用于项目查看页项目为项目分配新环境用途](#post-apiconsoleenvnamestenantcode-console环境名列表接口用于项目查看页项目为项目分配新环境用途)
      - [\[GET\] api/console/archNames console架构名字列表接口](#get-apiconsolearchnames-console架构名字列表接口)
      - [\[POST\] api/console/attachment console上传申请附件接口](#post-apiconsoleattachment-console上传申请附件接口)
      - [\[GET\] api/console/attachment/:attachmentID console下载附件接口](#get-apiconsoleattachmentattachmentid-console下载附件接口)
      - [\[POST\] api/console/applies console申请列表与搜索接口](#post-apiconsoleapplies-console申请列表与搜索接口)
      - [\[POST\] api/console/apply/:applyTicket console申请各类操作接口（修改/关闭/退回修改/处理/回复/留言）](#post-apiconsoleapplyapplyticket-console申请各类操作接口修改关闭退回修改处理回复留言)
      - [\[POST\] api/console/apply console新增其他类型申请接口](#post-apiconsoleapply-console新增其他类型申请接口)
      - [\[POST\] api/console/triggerWebhookLogs console webhook触发日志列表接口](#post-apiconsoletriggerwebhooklogs-console-webhook触发日志列表接口)
      - [\[GET\] api/console/triggerWebhookLogOptions console webhook触发日志选项接口](#get-apiconsoletriggerwebhooklogoptions-console-webhook触发日志选项接口)
      - [\[POST\] api/console/triggerMailLogs console 邮件触发日志列表接口](#post-apiconsoletriggermaillogs-console-邮件触发日志列表接口)
      - [\[GET\] api/console/triggerMailLogOptions console 邮件触发日志选项接口](#get-apiconsoletriggermaillogoptions-console-邮件触发日志选项接口)
      - [\[POST\] api/console/notifications console 通知列表接口](#post-apiconsolenotifications-console-通知列表接口)
      - [\[GET\] api/console/notificationOptions console 通知选项接口](#get-apiconsolenotificationoptions-console-通知选项接口)

## api接口

### console 项目控制台接口

- url: api/console/
- 需要校验`x-user-token`

#### [GET] api/console/projectNames console项目名称列表接口，用于搜索的下拉列表

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

#### [GET] api/console/projectEnvs console项目与可用环境列表接口，用于把主机/数据库加入到项目环境

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

#### [POST] api/console/projects console项目列表与搜索接口

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
#### [GET] api/console/project/:projectName console项目查看接口

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
                }
            ],
        }
    }
}
```

#### [GET] api/console/project/:projectName/minimal console项目查看接口精简

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project test-project1 success",
    "duration": "92.190143ms",
    "data": {
        "auditID": "66cc46e1d5f01d23bd8e2128",
        "project": {
            "pipelines": [
                {
                    "branchName": "develop",
                    "envProductions": [],
                    "envs": [
                        "devops"
                    ],
                    "pipelineArch": "amd64",
                    "errMsgPipelineDef": "",
                    "isDefault": true,
                    "pipelineCrons": [
                        {
                            "crontabDay": -1,
                            "crontabHour": -1,
                            "crontabMinute": 5,
                            "crontabMonth": -1,
                            "crontabWeek": -1
                        }
                    ],
                    "pipelineTriggers": [
                        {
                            "beforeExecute": false,
                            "checkVarToIgnore": "",
                            "enable": true,
                            "insecure": false,
                            "mailAttachmentFormat": "yaml",
                            "mailCommittees": true,
                            "mailContent": "{{ .runName }} {{ .status.result }}",
                            "mailReceivers": [],
                            "mailTitle": "{{ .runName }}",
                            "noticeCommittees": true,
                            "noticeUsernames": [],
                            "statusResults": [
                                "FAIL"
                            ],
                            "stepAction": "artifact",
                            "webhookBody": "",
                            "webhookForms": [],
                            "webhookHeaders": [],
                            "webhookMethod": "GET",
                            "webhookQueryParams": [],
                            "webhookUrl": "https://www.baidu.com"
                        }
                    ],
                    "sourceBranch": "",
                    "webhookPushEvent": true
                },
            ],
            "projectAvailableEnvs": [
                {
                    "envName": "test",
                    "componentDebug": {
                        "arch": "amd64",
                        "deploySpecDebug": {
                            "debugQuota": {
                                "cpuLimit": "800m",
                                "cpuRequest": "50m",
                                "extraLimit": null,
                                "extraRequest": null,
                                "memoryLimit": "800Mi",
                                "memoryRequest": "50Mi"
                            },
                            "ingress": {
                                "certBranch": "",
                                "certPath": "",
                                "certSelfSigned": false,
                                "domainName": "",
                                "pathPrefix": ""
                            }
                        },
                        "projectNamespace": "test-project1"
                    },
                    "components": [
                        {
                            "arch": "amd64",
                            "componentDesc": "tp1-mysql",
                            "componentName": "tp1-mysql",
                            "deploySpecStatic": {
                                "dependServices": null,
                                "deployArgs": [
                                    "--max-allowed-packet=268435456",
                                    "--character-set-server=utf8mb4",
                                    "--collation-server=utf8mb4_unicode_ci"
                                ],
                                "deployCmds": null,
                                "deployCommand": "",
                                "deployConfigBranch": "",
                                "deployConfigSettings": null,
                                "deployEnvs": [
                                    "MYSQL_ROOT_PASSWORD=YOUR_ROOT_PASSWORD",
                                    "MYSQL_DATABASE=YOUR_DATABASE_NAME",
                                    "MYSQL_USER=YOUR_DATABASE_USERNAME",
                                    "MYSQL_PASSWORD=YOUR_USER_PASSWORD"
                                ],
                                "deployHeadless": false,
                                "deployHealthCheck": {
                                    "checkPort": 3306,
                                    "exec": "",
                                    "execCmds": null,
                                    "httpGet": {
                                        "httpHeaders": null,
                                        "path": "",
                                        "port": 0,
                                        "scheme": ""
                                    },
                                    "livenessDelaySeconds": 60,
                                    "livenessPeriodSeconds": 30,
                                    "readinessDelaySeconds": 15,
                                    "readinessPeriodSeconds": 5,
                                    "startupDelaySeconds": 15,
                                    "startupPeriodSeconds": 5
                                },
                                "deployImage": "mysql:8.0.23",
                                "deployLocalPorts": [
                                    {
                                        "ingress": {
                                            "certBranch": "",
                                            "certPath": "",
                                            "certSelfSigned": false,
                                            "domainName": "",
                                            "pathPrefix": ""
                                        },
                                        "port": 3306,
                                        "protocol": "TCP"
                                    }
                                ],
                                "deployMeta": {
                                    "annotations": null,
                                    "labels": null
                                },
                                "deployName": "tp1-mysql",
                                "deployNodePorts": null,
                                "deployReplicas": 1,
                                "deployResources": {
                                    "cpuLimit": "1",
                                    "cpuRequest": "0.2",
                                    "extraLimit": null,
                                    "extraRequest": null,
                                    "memoryLimit": "400Mi",
                                    "memoryRequest": "20Mi"
                                },
                                "deploySessionAffinityTimeoutSeconds": 0,
                                "deployType": "statefulset",
                                "deployVolumes": [
                                    {
                                        "pathInPod": "/var/lib/mysql",
                                        "pathInPv": "mysql",
                                        "pvc": ""
                                    }
                                ],
                                "enableDownwardApi": false,
                                "hostAliases": null,
                                "hpaConfig": {
                                    "cpuAverageRequestPercent": 0,
                                    "cpuAverageValue": "",
                                    "maxReplicas": 0,
                                    "memoryAverageRequestPercent": 0,
                                    "memoryAverageValue": ""
                                },
                                "ingressDef": {
                                    "certBranch": "",
                                    "certPath": "",
                                    "certSelfSigned": false,
                                    "ingressAnnotations": [],
                                    "ingressDomainNamePaths": []
                                },
                                "lifecycle": {
                                    "postStart": {
                                        "exec": "",
                                        "execCmds": null,
                                        "httpGet": {
                                            "httpHeaders": null,
                                            "path": "",
                                            "port": 0,
                                            "scheme": ""
                                        }
                                    },
                                    "preStop": {
                                        "exec": "",
                                        "execCmds": null,
                                        "httpGet": {
                                            "httpHeaders": null,
                                            "path": "",
                                            "port": 0,
                                            "scheme": ""
                                        }
                                    }
                                },
                                "nodeName": "",
                                "nodeSelector": null,
                                "patches": null,
                                "podManagementPolicy": "OrderedReady",
                                "securityContext": {
                                    "runAsGroup": 0,
                                    "runAsUser": 0
                                },
                                "subdomain": "",
                                "terminationGracePeriodSeconds": 0,
                                "workingDir": ""
                            },
                            "projectNamespace": "test-project1"
                        }
                    ],
                    "databases": [
                        {
                            "createUser": "dory-admin",
                            "dbName": "test-project1-mysql01",
                            "dbPassword": "xxx",
                            "dbUrl": "xxx",
                            "dbUser": "testuser"
                        }
                    ],
                    "hosts": [
                        {
                            "groups": [
                                "group_demo"
                            ],
                            "hostAddr": "10.1.0.2",
                            "hostBecome": false,
                            "hostBecomePassword": "",
                            "hostBecomeUser": "",
                            "hostName": "test-project1-node01",
                            "hostPassword": "xxx",
                            "hostPort": 30012,
                            "hostUser": "root",
                            "updateTime": "04-03 00:25:37",
                            "variables": {
                                "backup_dir": "/backup",
                                "base_dir": "/app",
                                "service_port": "8000"
                            }
                        }
                    ]
                }
            ],
            "projectInfo": {
                "projectName": "test-project1",
                "projectNamespace": "test-project1",
                "projectShortName": "tp1",
                "shortName": "tp1",
                "defaultPv": "",
                "projectDesc": "test-project1",
                "projectTeam": "TP"
            },
            "projectMembers": [
                {
                    "accessLevel": "developer",
                    "disablePipelines": [],
                    "disableProjectDefs": [],
                    "disableRepoSecrets": [],
                    "username": "test-user01"
                }
            ],
            "tenantCode": ""
        },
        "withAdminLog": false
    }
}
```

#### [POST] api/console/project/:projectName/nodePortAdd console[申请]为项目分配NodePort接口

- request请求内容
```json
{
    "nodePort": 0,
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/nodePortDelete console[申请]为项目回收NodePort接口

- request请求内容
```json
{
    "nodePort": 30100,
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envAdd console[申请]为项目分配新环境接口

- request请求内容
```json
{
    "envNames": [
        "xxx",
        "xxx",
    ],
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envDelete console[申请]为项目回收环境接口

- request请求内容
```json
{
    "envName": "xxx",
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envDeleteAll console[申请]为项目回收环境并清理名字空间接口

- request请求内容
```json
{
    "envName": "xxx",
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envUpdate console[申请]修改项目环境设置接口

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
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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

#### [POST] api/console/project/:projectName/delete console[申请]删除项目接口

- request请求内容
```json
{
    "gitRepoDelete": false,
    "scanCodeRepoDelete": false,
    "imageRepoDelete": false,
    "artifactRepoDelete": false,
    "namespaceDelete": false,
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName console[申请]修改项目接口

- request请求内容
```json
{
    "projectDesc": "xxx",
    "projectTeam": "xxx",
    "gitRepoUser": "xxx",
    "gitRepoToken": "xxx",
    "gitRepoPassword": "xxx",
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
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/refreshToken console为项目更新所有密钥接口

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

#### [POST] api/console/project/:projectName/reApply console重新应用项目配置到所有可用环境

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

#### [POST] api/console/project/:projectName/cleanGitRepo console清理临时代码仓库

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

#### [GET] api/console/project/:projectName/members console项目分配用户列表接口

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

#### [POST] api/console/project/:projectName/memberAdd console为项目分配用户接口

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

#### [POST] api/console/project/:projectName/memberDelete console为项目移除用户接口

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

#### [POST] api/console/project/:projectName/memberUpdate console为项目修改用户角色接口

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

#### [GET] api/console/project/:projectName/branchNames console查看当前项目代码仓库分支接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "branchNames": [
            "xxx"
        ]
    }
}
```

#### [POST] api/console/project/:projectName/pipelineAdd console为项目新增流水线接口

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

#### [POST] api/console/project/:projectName/pipelineDelete console为项目删除流水线接口

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

#### [POST] api/console/project/:projectName/pipelineEnvAdd console为项目流水线新增环境接口

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

#### [POST] api/console/project/:projectName/pipelineEnvDelete console为项目流水线删除环境接口

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

#### [POST] api/console/project/:projectName/pipelineGitWebhook console为项目流水线设置git webhook触发器接口

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

#### [POST] api/console/project/:projectName/pipelineTokenRefresh console重置流水线token接口

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

#### [POST] api/console/project/:projectName/pipelineCronAdd console为项目流水线新增计划任务接口

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

#### [POST] api/console/project/:projectName/pipelineCronCopy console为项目流水线复制计划任务接口

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

#### [POST] api/console/project/:projectName/pipelineCronDelete console为项目流水线移除计划任务接口

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

#### [GET] api/console/project/:projectName/pipelineTriggerStepActions console触发器步骤选项接口

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

#### [POST] api/console/project/:projectName/pipelineTriggerOp console为项目流水线新增修改触发器接口

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

#### [POST] api/console/project/:projectName/pipelineTriggerCopy console为项目流水线复制触发器接口

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

#### [POST] api/console/project/:projectName/pipelineTriggerDelete console为项目流水线移除触发器接口

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

#### [POST] api/console/project/:projectName/envQuotaConfigUpdate console[申请]为项目环境设置quotaConfig接口

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
    },
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envPvcAdd console[申请]为项目环境分配pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "pvNames": [
        "xxx"
    ],
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envPvcDelete console[申请]为项目环境回收pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "pvcName": "xxx",
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/project/:projectName/envPvcScAdd console[申请]为项目环境分配存储类pvc接口

- request请求内容
```json
{
    "envName": "xxx",
    "scNames": [
        "xxx"
    ],
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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

####  [POST] api/console/project/:projectName/envNetworkPolicyAdd console为项目新增网络策略接口

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

####  [POST] api/console/project/:projectName/envNetworkPolicyDelete console为项目环境删除网络策略接口

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

#### [POST] api/console/project/:projectName/envHostAdd console为项目环境分配主机接口

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

#### [POST] api/console/project/:projectName/envHostDelete console为项目环境回收主机接口

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

#### [POST] api/console/project/:projectName/envHostJoin console把主机加入其他项目环境接口

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

#### [POST] api/console/project/:projectName/envHostLeave console把主机移除项目环境接口

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

#### [POST] api/console/project/:projectName/envHostUpdate console修改主机信息接口

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

#### [POST] api/console/project/:projectName/envDbAdd console为项目环境分配数据库接口

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

#### [POST] api/console/project/:projectName/envDbDelete console为项目环境回收数据库接口

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

#### [POST] api/console/project/:projectName/envDbJoin console把数据库加入项目环境接口

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

#### [POST] api/console/project/:projectName/envDbLeave console把数据库移除项目环境接口

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

#### [POST] api/console/project/:projectName/envDbUpdate console修改数据库信息接口

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

#### [GET] api/console/project/:projectName/envComponentDebugDefault console获取debug组件默认模板接口

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

#### [POST] api/console/project/:projectName/envComponentDebugUpdate console在项目环境调整debug组件接口

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

#### [POST] api/console/project/:projectName/envComponentDebugDelete console在项目环境删除debug组件接口

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

#### [GET] api/console/project/:projectName/envComponentTemplates console获取组件模板列表接口

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

#### [POST] api/console/project/:projectName/envComponentUpdate console在项目环境调整组件接口

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

#### [POST] api/console/project/:projectName/envComponentDelete console在项目环境删除组件接口

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

#### [GET] api/console/env/:envName/pvNames console获取环境可用pv列表接口

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

#### [GET] api/console/env/:envName/scNames console获取环境所有storageclass名字列表接口

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

#### [POST] api/console/user console[申请]新用户接口

- request请求内容
```json
{
    "username": "xxx",
    "name": "xxx",
    "mail": "xxx",
    "mobile": "xxx",
    "tenantCode": "xxx",
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/userNames/tenantCode console用户名列表接口，用于项目查看页项目member设置选择用户用途

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

#### [POST] api/console/envNames/tenantCode console环境名列表接口，用于项目查看页项目为项目分配新环境用途

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

#### [GET] api/console/archNames console架构名字列表接口


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


#### [POST] api/console/attachment console上传申请附件接口

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

#### [GET] api/console/attachment/:attachmentID console下载附件接口

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

#### [POST] api/console/applies console申请列表与搜索接口

- request请求内容
```json
{
    "mode": 0,
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
    "sortMode": 0,
    "mode": 0,
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

    - mode: 0（全部） 1（我的申请） 2（相关项目）
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

#### [POST] api/console/apply/:applyTicket console申请各类操作接口（修改/关闭/退回修改/处理/回复/留言）

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

#### [POST] api/console/apply console新增其他类型申请接口

- request请求内容
```json
{
    "title": "xxx",
    "content": "xxx",
    "attachmentIDs": [
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
        "applyTicket": "xxx",
    }
}
```

#### [POST] api/console/triggerWebhookLogs console webhook触发日志列表接口

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
    - stepResults/statusResults: 步骤状态/webhook状态
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

#### [GET] api/console/triggerWebhookLogOptions console webhook触发日志选项接口

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

#### [POST] api/console/triggerMailLogs console 邮件触发日志列表接口

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
					"content": "xx",
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

#### [GET] api/console/triggerMailLogOptions console 邮件触发日志选项接口

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

#### [POST] api/console/notifications console 通知列表接口

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

#### [GET] api/console/notificationOptions console 通知选项接口

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

