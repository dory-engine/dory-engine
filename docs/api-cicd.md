# api/cicd接口文档

## 目录

- [api/cicd接口文档](#apicicd接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [cicd 持续交付接口](#cicd-持续交付接口)
      - [\[GET\] api/cicd/projectNames cicd项目名称列表接口，用于搜索的下拉列表](#get-apicicdprojectnames-cicd项目名称列表接口用于搜索的下拉列表)
      - [\[GET\] api/cicd/pipelineNames cicd流水线名称列表接口，用于搜索的下拉列表](#get-apicicdpipelinenames-cicd流水线名称列表接口用于搜索的下拉列表)
      - [\[POST\] api/cicd/projects cicd项目列表与搜索接口](#post-apicicdprojects-cicd项目列表与搜索接口)
      - [\[GET\] api/cicd/project/:projectName cicd项目查看接口](#get-apicicdprojectprojectname-cicd项目查看接口)
      - [\[POST\] api/cicd/runs cicd运行列表与搜索接口](#post-apicicdruns-cicd运行列表与搜索接口)
      - [\[POST\] api/cicd/queues cicd运行队列列表接口](#post-apicicdqueues-cicd运行队列列表接口)
      - [\[POST\] api/cicd/queue/:runName/top cicd队列中的运行置顶接口](#post-apicicdqueuerunnametop-cicd队列中的运行置顶接口)
      - [\[POST\] api/cicd/fixRuns cicd运行修复列表与搜索接口](#post-apicicdfixruns-cicd运行修复列表与搜索接口)
      - [\[GET\] api/cicd/pipeline/:pipelineName cicd流水线查看接口](#get-apicicdpipelinepipelinename-cicd流水线查看接口)
      - [\[POST\] api/cicd/commits cicd的commit提交列表与搜索接口](#post-apicicdcommits-cicd的commit提交列表与搜索接口)
      - [\[POST\] api/cicd/steps cicd执行步骤记录列表与搜索接口](#post-apicicdsteps-cicd执行步骤记录列表与搜索接口)
      - [\[GET\] api/cicd/stepOptions cicd执行步检索选项接口](#get-apicicdstepoptions-cicd执行步检索选项接口)
      - [\[POST\] api/cicd/steps/:stepAction cicd获取构建打包执行详情接口](#post-apicicdstepsstepaction-cicd获取构建打包执行详情接口)
      - [\[GET\] api/cicd/artifact/:projectName cicd项目制品查看接口](#get-apicicdartifactprojectname-cicd项目制品查看接口)
      - [\[GET\] api/cicd/artifact/:projectName/:artifactID cicd项目制品下载接口](#get-apicicdartifactprojectnameartifactid-cicd项目制品下载接口)
      - [\[DELETE\] api/cicd/artifact/:projectName/:artifactID cicd项目制品删除接口](#delete-apicicdartifactprojectnameartifactid-cicd项目制品删除接口)
      - [\[GET\] api/cicd/module/:projectName/:moduleType/:moduleName cicd模块查看接口](#get-apicicdmoduleprojectnamemoduletypemodulename-cicd模块查看接口)
      - [\[POST\] api/cicd/module/:projectName/:moduleType/:moduleName cicd模块隐状态设置接口](#post-apicicdmoduleprojectnamemoduletypemodulename-cicd模块隐状态设置接口)
      - [\[GET\] api/cicd/run/:runName cicd运行查看接口](#get-apicicdrunrunname-cicd运行查看接口)
      - [\[POST\] api/cicd/pipeline/:pipelineName cicd执行流水线接口](#post-apicicdpipelinepipelinename-cicd执行流水线接口)
      - [\[POST\] api/cicd/batch/:projectName/:opsBatchName cicd执行批处理流水线接口](#post-apicicdbatchprojectnameopsbatchname-cicd执行批处理流水线接口)
      - [\[PATCH\] api/cicd/run/:runName cicd终止运行接口](#patch-apicicdrunrunname-cicd终止运行接口)
      - [\[GET\] api/cicd/run/:runName/input cicd获取运行的输入提示接口](#get-apicicdrunrunnameinput-cicd获取运行的输入提示接口)
      - [\[POST\] api/cicd/run/:runName/input cicd提交运行的输入接口](#post-apicicdrunrunnameinput-cicd提交运行的输入接口)
      - [\[POST\] api/cicd/notifications cicd 通知列表接口](#post-apicicdnotifications-cicd-通知列表接口)
      - [\[GET\] api/cicd/notificationOptions cicd 通知选项接口](#get-apicicdnotificationoptions-cicd-通知选项接口)
      - [\[POST\] api/cicd/notificationRead cicd 通知已读设置接口](#post-apicicdnotificationread-cicd-通知已读设置接口)
      - [\[POST\] api/cicd/announcements cicd公告列表接口](#post-apicicdannouncements-cicd公告列表接口)
      - [\[POST\] api/cicd/announcementRead cicd公告已读设置接口](#post-apicicdannouncementread-cicd公告已读设置接口)
      - [\[GET\] api/cicd/attachment/:attachmentID cicd下载附件接口](#get-apicicdattachmentattachmentid-cicd下载附件接口)
      - [\[GET\] api/cicd/projectDef/:projectName cicd获取项目所有定义接口](#get-apicicdprojectdefprojectname-cicd获取项目所有定义接口)
      - [\[GET\] api/cicd/projectDef/:projectName/demo cicd获取演示定义接口](#get-apicicdprojectdefprojectnamedemo-cicd获取演示定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/buildDefs cicd更新模块构建定义接口](#post-apicicdprojectdefprojectnamebuilddefs-cicd更新模块构建定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/packageDefs cicd更新模块容器打包定义接口](#post-apicicdprojectdefprojectnamepackagedefs-cicd更新模块容器打包定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/artifactDefs cicd更新模块制品打包定义接口](#post-apicicdprojectdefprojectnameartifactdefs-cicd更新模块制品打包定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/dockerIgnoreDefs cicd更新容器打包忽略定义接口](#post-apicicdprojectdefprojectnamedockerignoredefs-cicd更新容器打包忽略定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/deployContainerDefs cicd更新模块容器发布定义接口](#post-apicicdprojectdefprojectnamedeploycontainerdefs-cicd更新模块容器发布定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/deployContainerDefs/view cicd查看模块容器发布定义生成效果接口](#post-apicicdprojectdefprojectnamedeploycontainerdefsview-cicd查看模块容器发布定义生成效果接口)
      - [\[POST\] api/cicd/projectDef/:projectName/deployArtifactDefs cicd更新模块制品发布定义接口](#post-apicicdprojectdefprojectnamedeployartifactdefs-cicd更新模块制品发布定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/istioDefs cicd更新模块服务网格定义接口](#post-apicicdprojectdefprojectnameistiodefs-cicd更新模块服务网格定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/istioGatewayDef cicd更新服务网格网关定义接口](#post-apicicdprojectdefprojectnameistiogatewaydef-cicd更新服务网格网关定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/pipelineDef cicd更新流水线定义接口](#post-apicicdprojectdefprojectnamepipelinedef-cicd更新流水线定义接口)
      - [\[PUT\] api/cicd/projectDef/:projectName/pipelineDef cicd复制流水线定义到其他分支接口](#put-apicicdprojectdefprojectnamepipelinedef-cicd复制流水线定义到其他分支接口)
      - [\[GET\] api/cicd/projectDef/:projectName/:branchName/pipelineDef cicd获取流水线定义接口](#get-apicicdprojectdefprojectnamebranchnamepipelinedef-cicd获取流水线定义接口)
      - [\[PUT\] api/cicd/projectDef/:projectName/deployContainerDefs cicd复制模块容器发布定义到其他环境接口](#put-apicicdprojectdefprojectnamedeploycontainerdefs-cicd复制模块容器发布定义到其他环境接口)
      - [\[PUT\] api/cicd/projectDef/:projectName/deployArtifactDefs cicd复制模块制品发布定义到其他环境接口](#put-apicicdprojectdefprojectnamedeployartifactdefs-cicd复制模块制品发布定义到其他环境接口)
      - [\[PUT\] api/cicd/projectDef/:projectName/istioDefs cicd复制模块服务网格定义到其他环境接口](#put-apicicdprojectdefprojectnameistiodefs-cicd复制模块服务网格定义到其他环境接口)
      - [\[POST\] api/cicd/projectDef/:projectName/customStepDef cicd更新自定义步骤模块定义接口](#post-apicicdprojectdefprojectnamecustomstepdef-cicd更新自定义步骤模块定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/customStepDef/env cicd更新环境自定义步骤模块定义接口](#post-apicicdprojectdefprojectnamecustomstepdefenv-cicd更新环境自定义步骤模块定义接口)
      - [\[PUT\] api/cicd/projectDef/:projectName/customStepDef/env cicd复制环境自定义步骤模块定义到其他环境接口](#put-apicicdprojectdefprojectnamecustomstepdefenv-cicd复制环境自定义步骤模块定义到其他环境接口)
      - [\[POST\] api/cicd/projectDef/:projectName/customOpsDefs cicd更新自定义ops流水线定义接口](#post-apicicdprojectdefprojectnamecustomopsdefs-cicd更新自定义ops流水线定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/opsBatchDefs cicd更新自定义ops批处理定义接口](#post-apicicdprojectdefprojectnameopsbatchdefs-cicd更新自定义ops批处理定义接口)
      - [\[POST\] api/cicd/projectDef/:projectName/history cicd获取项目定义历史记录列表接口](#post-apicicdprojectdefprojectnamehistory-cicd获取项目定义历史记录列表接口)
      - [\[POST\] api/cicd/projectDef/:projectName/content cicd获取项目定义历史内容接口](#post-apicicdprojectdefprojectnamecontent-cicd获取项目定义历史内容接口)
      - [\[GET\] api/cicd/customStepConf/vars cicd自定义步骤配置变量说明接口](#get-apicicdcustomstepconfvars-cicd自定义步骤配置变量说明接口)
      - [\[GET\] api/cicd/trigger/vars cicd触发器变量说明接口](#get-apicicdtriggervars-cicd触发器变量说明接口)

## api接口

### cicd 持续交付接口

- url: api/cicd/
- 需要校验`x-user-token`

#### [GET] api/cicd/projectNames cicd项目名称列表接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "projectNames": [
            "xxx",
            "xxx"
        ]
    }
}
```

#### [GET] api/cicd/pipelineNames cicd流水线名称列表接口，用于搜索的下拉列表

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "pipelineNames": [
            "xxx",
            "xxx"
        ]
    }
}
```

#### [POST] api/cicd/projects cicd项目列表与搜索接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
        "xxx"
    ],
    "projectTeam": "xxx",
    "page": 1,
    "perPage": 10
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list projects success",
    "duration": "1.290581419s",
    "data": {
        "projects": [
            {
                "cicdCustomStepInserts": {
                    "applyMesh": [
                        "envTestRobot"
                    ],
                },
                "tenantCode": "xxx",
                "projectInfo" : {
                    "projectName" : "test-project1",
                    "projectNamespace" : "test-project1",
                    "projectShortName" : "tp1",
                    "shortName" : "tp1",
                    "projectDesc" : "测试-项目1",
                    "projectTeam" : "测试团队1",
                    "projectArch" : "amd64",
                },
                "projectRepo": {
                    "artifactRepo": "https://nexus.dory.cookeem.com",
                    "artifactRepoType": "xxx",
                    "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
                    "gitRepoDir": {
                        "buildSettingsDir": "xxx",
                        "databaseScriptsDir": "xxx",
                        "demoCodesDir": "xxx",
                        "deployScriptsDir": "xxx",
                        "documentsDir": "xxx",
                        "testScriptsDir": "xxx",
                    },
                    "imageRepo": "https://registry.dory.cookeem.com",
                    "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects"
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
                        ]
                    }
                ],
                "modules": {
                    "build": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                    ],
                    "package": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                    ],
                    "artifact": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                    ],
                    "deploy": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                    ],
                    "deployArtifact": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                    ],
                },
                "opsBatchDefs": [
                    {
                        "opsBatchName": "xxx",
                        "opsBatchDesc": "xxx"
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
                        "successCount" : 20,
                        "failCount" : 2,
                        "abortCount" : 3,
                        "status": {
                            "result" : "SUCESS",
                            "startTime" : "02-14 12:12:12",
                            "duration" : "1m30s"
                        },
                        "errMsgPipelineDef": "",
                        "pipelineDef": {
                            "isAutoDetectBuild": false,
                            "isQueue": false,
                            "builds": [
                                {
                                    "name": "tp1-gin-demo",
                                    "run": true
                                },
                            ],
                            "pipelineStep": {
                                "gitPull": {
                                    "timeout": 60,
                                    "selectTag": false,
                                },
                                "build": {
                                    "enable": true,
                                    "timeout": 0,
                                    "retry": 0
                                },
                                "scanCode": {
                                    "enable": false,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0
                                },
                                "packageImage": {
                                    "enable": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "extraPush": false,
                                },
                                "scanImage": {
                                    "enable": false,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "gateMedium": 5,
                                    "gateHigh": 0,
                                    "gateCritical": 0
                                },
                                "artifact": {
                                    "enable": true,
                                    "retry": 0
                                },
                                "syncImage": {
                                    "enable": true,
                                    "retry": 0
                                },
                                "deploy": {
                                    "ignoreExecuteModuleNames": ["xxx"],
                                    "enable": false,
                                    "retry": 0,
                                    "forceReplace": false,
                                    "archive": false,
                                    "try": false
                                },
                                "applyIngress": {
                                    "enable": true,
                                    "retry": 0,
                                },
                                "applyMesh": {
                                    "enable": true,
                                    "retry": 0,
                                },
                                "checkDeploy": {
                                    "enable": true,
                                    "ignoreError": false,
                                    "retry": 0,
                                    "repeat": 30,
                                    "repeatInterval": 5
                                },
                                "checkQuota": {
                                    "enable": true,
                                    "retry": 0
                                },
                                "deployArtifact": {
                                    "ignoreExecuteModuleNames": ["xxx"],
                                    "enable": false,
                                    "timeout": 0,
                                    "retry": 0,
                                    "archive": false,
                                    "try": false
                                },
                                "testApi": {
                                    "ignoreExecuteModuleNames": ["xxx"],
                                    "enable": false,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "passingRate": 0
                                },
                                "testPerformance": {
                                    "ignoreExecuteModuleNames": ["xxx"],
                                    "enable": false,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0
                                },
                                "testWebui": {
                                    "ignoreExecuteModuleNames": ["xxx"],
                                    "enable": false,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "passingRate": 0
                                },
                                "input": {
                                    "enable": false,
                                    "isApiOnly": false
                                }
                            },
                            "customStepInsertDefs": {
                                "checkQuota": [
                                    {
                                        "customStepName": "xxx",
                                        "enable": true,
                                        "ignoreError": true,
                                        "timeout": 0,
                                        "retry": 0,
                                        "enableInput": false,
                                        "isApiOnly": false,
                                        "enableInputFinish": false,
                                        "isApiOnlyFinish": false
                                    },
                                    {
                                        "customStepName": "yyy",
                                        "enable": true,
                                        "ignoreError": true,
                                        "timeout": 0,
                                        "retry": 0,
                                        "enableInput": false,
                                        "isApiOnly": false,
                                        "enableInputFinish": false,
                                        "isApiOnlyFinish": false
                                    }
                                ],
                            }
                        },
                    },
                    {
                        "pipelineName" : "test-project1-ops",
                        "branchName" : "",
                        "envs": [
                            "test"
                        ],
                        "envProductions": [
                            "prod1",
                            "prod2"
                        ],
                        "successCount" : 10,
                        "failCount" : 1,
                        "abortCount" : 0,
                        "status": {
                            "result" : "SUCESS",
                            "startTime" : "02-14 12:12:12",
                            "duration" : "1m30s"
                        }
                    }
                ]
            }
        ],
        "totalCount": 10
    }
}
```

- 对于branchName为空的流水线，pipelineDef为空

#### [GET] api/cicd/project/:projectName cicd项目查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project success",
    "duration": "1.290581419s",
    "data": {
        "project": {
            "cicdCustomStepInserts": {
                "applyMesh": [
                    "envTestRobot"
                ],
            },
            "tenantCode": "xxx",
            "projectInfo" : {
                "projectName" : "test-project1",
                "projectNamespace" : "test-project1",
                "projectShortName" : "tp1",
                "shortName" : "tp1",
                "projectDesc" : "测试-项目1",
                "projectTeam" : "测试团队1",
                "projectArch" : "amd64",
            },
            "projectRepo": {
                "artifactRepo": "https://nexus.dory.cookeem.com",
                "artifactRepoType": "xxx",
                "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
                "gitRepoDir": {
                    "buildSettingsDir": "xxx",
                    "databaseScriptsDir": "xxx",
                    "demoCodesDir": "xxx",
                    "deployScriptsDir": "xxx",
                    "documentsDir": "xxx",
                    "testScriptsDir": "xxx",
                },
                "imageRepo": "https://registry.dory.cookeem.com",
                "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects"
            },
            "projectNodePorts": [
                {
                    "envName": "devops",
                    "envNodePorts": [
                        {
                            "isDefault": true,
                            "nodePortStart": 30100,
                            "nodePortEnd": 30109,
                        }
                    ]
                }
            ],
            "projectAvailableEnvs": [
                {
                    "envName": "test",
                    "privileged": false,
                    "k8sToken": "xxx",
                    "dashboardUrl":	"https://k8s.dory.cookeem.com/#/workloads?namespace=test-project1",
                },
                {
                    "envName": "uat",
                    "privileged": false,
                    "k8sToken": "xxx",
                    "dashboardUrl":	"https://k8s.dory.cookeem.com/#/workloads?namespace=test-project1",
                }
            ],
            "projectSecret" : {
                "harborPassword" : "xxx",
                "nexusPassword" : "xxx",
                "sonarPassword" : "xxx",
                "sonarToken" : "xxx",
                "refreshTime" : "12-12 12:12:12"
            },
            "latestSteps": [
                {
                    "envName": "test",
                    "stepIDs": [
                        "63b67ac06c03c668270760af",
                        "63b67a976c03c66827076074"
                    ]
                }
            ],
            "modules": {
                "build": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                ],
                "package": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                ],
                "artifact": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                ],
                "deploy": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                ],
                "deployArtifact": [
                        {
                            "moduleName": "tp1-go-demo",
                            "isLatest": false
                        }
                ],
            },
            "opsBatchDefs": [
                {
                    "opsBatchName": "xxx",
                    "opsBatchDesc": "xxx"
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
                    "successCount" : 20,
                    "failCount" : 2,
                    "abortCount" : 3,
                    "status": {
                        "result" : "SUCESS",
                        "startTime" : "02-14 12:12:12",
                        "duration" : "1m30s"
                    },
                    "errMsgPipelineDef": "",
                    "pipelineDef": {
                        "isAutoDetectBuild": false,
                        "isQueue": false,
                        "builds": [
                            {
                                "name": "tp1-gin-demo",
                                "run": true
                            },
                        ],
                        "pipelineStep": {
                            "gitPull": {
                                "timeout": 60,
                                "selectTag": false,
                            },
                            "build": {
                                "enable": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "scanCode": {
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "packageImage": {
                                "enable": true,
                                "timeout": 0,
                                "retry": 0,
                                "extraPush": false,
                            },
                            "scanImage": {
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "gateMedium": 5,
                                "gateHigh": 0,
                                "gateCritical": 0
                            },
                            "artifact": {
                                "enable": true,
                                "retry": 0
                            },
                            "syncImage": {
                                "enable": true,
                                "retry": 0
                            },
                            "deploy": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "retry": 0,
                                "forceReplace": false,
                                "archive": false,
                                "try": false
                            },
                            "applyIngress": {
                                "enable": true,
                                "retry": 0,
                            },
                            "applyMesh": {
                                "enable": true,
                                "retry": 0,
                            },
                            "checkDeploy": {
                                "enable": true,
                                "ignoreError": false,
                                "retry": 0,
                                "repeat": 30,
                                "repeatInterval": 5
                            },
                            "checkQuota": {
                                "enable": true,
                                "retry": 0
                            },
                            "deployArtifact": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "timeout": 0,
                                "retry": 0,
                                "archive": false,
                                "try": false
                            },
                            "testApi": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "passingRate": 0
                            },
                            "testPerformance": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "testWebui": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "passingRate": 0
                            },
                            "input": {
                                "enable": false,
                                "isApiOnly": false
                            }
                        },
                        "customStepInsertDefs": {
                            "checkQuota": [
                                {
                                    "customStepName": "xxx",
                                    "enable": true,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "enableInput": false,
                                    "isApiOnly": false,
                                    "enableInputFinish": false,
                                    "isApiOnlyFinish": false
                                },
                                {
                                    "customStepName": "yyy",
                                    "enable": true,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "enableInput": false,
                                    "isApiOnly": false,
                                    "enableInputFinish": false,
                                    "isApiOnlyFinish": false
                                }
                            ],
                        }
                    },
                },
                {
                    "pipelineName" : "test-project1-ops",
                    "branchName" : "",
                    "envs": [
                        "test"
                    ],
                    "envProductions": [
                        "prod1",
                        "prod2"
                    ],
                    "successCount" : 10,
                    "failCount" : 1,
                    "abortCount" : 0,
                    "status": {
                        "result" : "SUCESS",
                        "startTime" : "02-14 12:12:12",
                        "duration" : "1m30s"
                    }
                }
            ]
        }
    }
}
```

- 对于branchName为空的流水线，pipelineDef为空

#### [POST] api/cicd/runs cicd运行列表与搜索接口

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
    "triggerKinds": [
        "manual",
        "webhook",
        "crontab",
    ],
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "statusResults": [
        "xxx",
        "xxx"
    ],
    "duration": 0,
    "startTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "tagName": "xxx",
    "startUser": "xxx",
    "abortUser": "xxx",
    "runNumber": 1,
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - duration: 0（不选择）、1（0-2分钟）、2（2-5分钟）、3（5-15分钟）、4（15-30分钟）、5（30分钟以上）
    - statusResults: SUCCESS FAIL ABORT RUNNING INPUT
    - triggerKinds: manual webhook crontab
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "runs": [
            {
                "projectName": "test-project1",
                "pipelineName": "test-project1-develop",
                "runName": "test-project1-develop-17",
                "gitURL": "xxx",
                "triggerKind": "manual",
                "startUser" : "xxx",
                "abortUser" : "",
                "tagName" : "v0.1.0-dev-6-ga0fbb33",
                "status": {
                    "result" : "SUCCESS",
                    "startTime" : "20-20 12:12:12",
                    "duration" : "1m12s"
                }
            },
        ],
        "totalCount": 10
    }
}
```

#### [POST] api/cicd/queues cicd运行队列列表接口

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
        ],
        "totalCount": 10
    }
}
```

#### [POST] api/cicd/queue/:runName/top cicd队列中的运行置顶接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
}
```

#### [POST] api/cicd/fixRuns cicd运行修复列表与搜索接口

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
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "closed": "yes",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "page": 1,
    "perPage": 10
}
```

    - closed: yes / no / 其他情况表示全部

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list fix run success",
    "duration": "17.377229ms",
    "data": {
        "fixRuns": [
            {
                "branchName": "develop",
                "closeTime": "04-19 13:44:15",
                "createTime": "04-19 13:25:32",
                "failRuns": [
                    {
                        "abortUser": "",
                        "pipelineName": "test-project1-develop",
                        "projectName": "test-project1",
                        "runName": "test-project1-develop-17",
                        "triggerKind": "manual",
                        "startUser": "dory-admin",
                        "status": {
                            "duration": "654ms557µs",
                            "result": "FAIL",
                            "startTime": "04-19 13:25:32"
                        },
                        "tagName": "v0.0.0"
                    }
                ],
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "status": {
                    "duration": "4s571ms",
                    "result": "SUCCESS",
                    "startTime": "04-19 13:44:10"
                },
                "successRunName": "test-project1-develop-18"
            }
        ],
        "totalCount": 4
    }
}
```

#### [GET] api/cicd/pipeline/:pipelineName cicd流水线查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "cicdCustomStepInserts": {
            "applyMesh": [
                "envTestRobot"
            ],
        },
        "branchNames": [
            "develop"
        ],
        "pipeline": {
            "pipelineName" : "test-project1-develop",
            "branchName" : "develop",
            "envs": [
                "test"
            ],
            "envProductions": [
            ],
            "successCount" : 20,
            "failCount" : 2,
            "abortCount" : 3,
            "status": {
                "result" : "SUCESS",
                "startTime" : "02-14 12:12:12",
                "duration" : "1m30s"
            },
            "errMsgPipelineDef": "",
            "pipelineDef": {
                "isAutoDetectBuild": false,
                "isQueue": false,
                "builds": [
                    {
                        "name": "tp1-gin-demo",
                        "run": true
                    },
                ],
                "pipelineStep": {
                    "gitPull": {
                        "timeout": 60,
                        "selectTag": false,
                    },
                    "build": {
                        "enable": true,
                        "timeout": 0,
                        "retry": 0
                    },
                    "scanCode": {
                        "enable": false,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0
                    },
                    "packageImage": {
                        "enable": true,
                        "timeout": 0,
                        "retry": 0,
                        "extraPush": false,
                    },
                    "scanImage": {
                        "enable": false,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0,
                        "gateMedium": 5,
                        "gateHigh": 0,
                        "gateCritical": 0
                    },
                    "artifact": {
                        "enable": true,
                        "retry": 0
                    },
                    "syncImage": {
                        "enable": true,
                        "retry": 0
                    },
                    "deploy": {
                        "ignoreExecuteModuleNames": ["xxx"],
                        "enable": false,
                        "retry": 0,
                        "forceReplace": false,
                        "archive": false,
                        "try": false
                    },
                    "applyIngress": {
                        "enable": true,
                        "retry": 0,
                    },
                    "applyMesh": {
                        "enable": true,
                        "retry": 0,
                    },
                    "checkDeploy": {
                        "enable": true,
                        "ignoreError": false,
                        "retry": 0,
                        "repeat": 30,
                        "repeatInterval": 5
                    },
                    "checkQuota": {
                        "enable": true,
                        "retry": 0
                    },
                    "deployArtifact": {
                        "ignoreExecuteModuleNames": ["xxx"],
                        "enable": false,
                        "timeout": 0,
                        "retry": 0,
                        "archive": false,
                        "try": false
                    },
                    "testApi": {
                        "ignoreExecuteModuleNames": ["xxx"],
                        "enable": false,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0,
                        "passingRate": 0
                    },
                    "testPerformance": {
                        "ignoreExecuteModuleNames": ["xxx"],
                        "enable": false,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0
                    },
                    "testWebui": {
                        "ignoreExecuteModuleNames": ["xxx"],
                        "enable": false,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0,
                        "passingRate": 0
                    },
                    "input": {
                        "enable": false,
                        "isApiOnly": false
                    }
                },
                "customStepInsertDefs": {
                    "checkQuota": [
                        {
                            "customStepName": "xxx",
                            "enable": true,
                            "ignoreError": true,
                            "timeout": 0,
                            "retry": 0,
                            "enableInput": false,
                            "isApiOnly": false,
                            "enableInputFinish": false,
                            "isApiOnlyFinish": false
                        },
                        {
                            "customStepName": "yyy",
                            "enable": true,
                            "ignoreError": true,
                            "timeout": 0,
                            "retry": 0,
                            "enableInput": false,
                            "isApiOnly": false,
                            "enableInputFinish": false,
                            "isApiOnlyFinish": false
                        }
                    ],
                }
            },
        },
        "tenantCode": "xxx",
        "projectInfo" : {
            "projectName" : "test-project1",
            "projectNamespace" : "test-project1",
            "projectShortName" : "tp1",
            "shortName" : "tp1",
            "projectDesc" : "测试-项目1",
            "projectTeam" : "测试团队1",
            "projectArch" : "amd64",
        },
        "projectRepo": {
            "artifactRepo": "https://nexus.dory.cookeem.com",
            "artifactRepoType": "xxx",
            "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
            "gitRepoDir": {
                "buildSettingsDir": "xxx",
                "databaseScriptsDir": "xxx",
                "demoCodesDir": "xxx",
                "deployScriptsDir": "xxx",
                "documentsDir": "xxx",
                "testScriptsDir": "xxx",
            },
            "imageRepo": "https://registry.dory.cookeem.com",
            "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects"
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
                ]
            }
        ],
        "modules": {
            "build": [
                {
                    "moduleName": "tp1-go-demo",
                    "isLatest": false
                }
            ],
            "package": [
                {
                    "moduleName": "tp1-go-demo",
                    "isLatest": false
                }
            ],
            "artifact": [
                {
                    "moduleName": "tp1-go-demo",
                    "isLatest": false
                }
            ],
            "deploy": [
                {
                    "moduleName": "tp1-go-demo",
                    "isLatest": false
                }
            ],
            "deployArtifact": [
                {
                    "moduleName": "tp1-go-demo",
                    "isLatest": false
                }
            ],
        },
    }
}
```

- 对于branchName为空的流水线，pipelineDef为空

#### [POST] api/cicd/commits cicd的commit提交列表与搜索接口

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
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "commitHashes": [
        "xxx",
        "xxx"
    ],
    "branchName": "xxx",
    "runName": "xxx",
    "committerName": "xxx",
    "committerEmail": "xxx",
    "commitTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```

    - sortMode: commitTimeDesc, commitTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "commits": [
            {
                "projectName" : "test-project1",
                "pipelineName" : "test-project1-develop",
                "runName" : "test-project1-develop-30",
                "branchName" : "develop",
                "commit" : "17e36bb133f44741ed84424eda5d1dbe2ee91cc4",
                "viewURL" : "http://vm.dory.cookeem.com:30001/test-project1/test-project1/commit/e40ae50628e6b63cbebf797ae1bf554b4cc357f2",
                "fullMessage" : "commit 17e36bb133f44741ed84424eda5d1dbe2ee91cc4\nAuthor: DEVOPS-管理员 <devops-admin@139.com>\nDate:   Sun Feb 28 15:48:08 2021 +0800\n\n    Update deploy-info-test.yaml\n",
                "commitTime" : "02-28 07:48:08",
                "committerName" : "DEVOPS-管理员",
                "committerEmail" : "devops-admin@139.com",
                "message" : "Update deploy-info-test.yaml",
                "diffs" : [
                    {
                        "action" : "Modify",
                        "fileName" : "deploy-info-test.yaml",
                        "stats" : " INFO/deploy-info-test.yaml | 2 +-\n"
                    }
                ],
                "createTime" : "02-28 07:48:19",
                "status": {
                    "result" : "FAIL",
                    "startTime" : "20-20 12:12:12",
                    "duration" : "1m12s"
                }
            }
        ],
        "totalCount": 10
    }
}
```

#### [POST] api/cicd/steps cicd执行步骤记录列表与搜索接口

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
    "branchNames": [
        "xxx",
        "xxx"
    ],
    "envNames": [
        "xxx",
        "xxx"
    ],
    "runNames": [
        "xxx",
        "xxx"
    ],
    "statusResults": [
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
    "stepIDs": [
        "xxx",
        "xxx"
    ],
    "moduleName": "xxx",
    "duration": 0,
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "runNumber": 1,
    "sortMode": "xxx",
    "page": 1,
    "perPage": 10
}
```
    - statusResults: SUCCESS, FAIL, ABORT, RUNNING
    - moduleTypes: build, package, artifact, deploy, deployArtifact
    - sortMode: createTimeDesc, createTimeAsc

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "steps": [
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1a-develop",
                "projectName": "test-project1a",
                "runName": "test-project1a-develop-244",
                "status": {
                    "duration": "1s491ms",
                    "result": "SUCCESS",
                    "startTime": "12-05 17:38:06"
                },
                "stepAction": "gitPull",
                "stepContainerStats": {
                    "cpuDelta": 41189466175.101265,
                    "cpuPercent": 0.0013811729968044092,
                    "cpuTotalUsage": 41189466175,
                    "duration": "1m18s",
                    "memoryLimit": 16788545536,
                    "memoryMaxUsage": 148587118,
                    "memoryPercent": 0.007711542968440325,
                    "memoryUsage": 129465590,
                    "systemDelta": 11928780959746836
                },
                "stepDetail": {
                    "branchName": "develop",
                    "commitUrl": "http://vm.dory.cookeem.com:30001/test-project1a/test-project1a/commit/9aa477b8b216f85b9b813e7eda8358f516b8b0e3",
                    "commits": [
                        {
                            "_id": "638dbc00a4cd8fadff6f8408",
                            "branchName": "develop",
                            "commit": "9aa477b8b216f85b9b813e7eda8358f516b8b0e3",
                            "commitTime": "2022-12-05T17:38:05+08:00",
                            "commitUrl": "http://vm.dory.cookeem.com:30001/test-project1a/test-project1a/commit/9aa477b8b216f85b9b813e7eda8358f516b8b0e3",
                            "committerEmail": "gitea-admin@qq.com",
                            "committerName": "gitea-admin",
                            "createTime": "2022-12-05T17:38:08.007+08:00",
                            "diffs": [
                                {
                                    "action": "Modify",
                                    "fileName": "xxx/prepare-commit-msg copy",
                                    "modifyLineCount": 3,
                                    "stats": " xxx/prepare-commit-msg copy | 3 +++\n"
                                }
                            ],
                            "fullMessage": "commit 9aa477b8b216f85b9b813e7eda8358f516b8b0e3\nAuthor: gitea-admin <gitea-admin@qq.com>\nDate:   Mon Dec 05 17:38:05 2022 +0800\n\n    更新 'xxx/prepare-commit-msg copy'\n\n",
                            "message": "更新 'xxx/prepare-commit-msg copy'\n",
                            "modifyLineCountTotal": 3,
                            "pipelineName": "test-project1a-develop",
                            "projectName": "test-project1a",
                            "projectTeam": "TP",
                            "runName": "test-project1a-develop-244"
                        }
                    ],
                    "gitURL": "http://vm.dory.cookeem.com:30001/test-project1a/test-project1a/commit/9aa477b8b216f85b9b813e7eda8358f516b8b0e3",
                    "latestCommit": "9aa477b8b216f85b9b813e7eda8358f516b8b0e3",
                    "refs": [
                        {
                            "hash": "e1a57513fc71036dda8278839af474abf1401164",
                            "name": "refs/tags/v0.2.6-dev"
                        }
                    ],
                    "tagName": "v0.2.6-dev-61-g9aa477b",
                    "tags": [
                        {
                            "hash": "18e82ff36cb59bc4e8119fac74692e7cb12c497f",
                            "name": "refs/tags/v0.2.0-dev"
                        }
                    ]
                },
                "stepID": "638dbbfea4cd8fadff6f83fd",
                "stepName": "git pull repository"
            },            
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1a-develop",
                "projectName": "test-project1a",
                "runName": "test-project1a-develop-244",
                "status": {
                    "duration": "636ms53µs",
                    "result": "SUCCESS",
                    "startTime": "12-05 17:38:08"
                },
                "stepAction": "getRunSettings",
                "stepDetail": {
                    "branchName": "develop",
                    "pipelineVariable": {}
                },
                "stepID": "638dbbffa4cd8fadff6f8404",
                "stepName": "get run settings"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "build",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "2s829ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:43"
                },
                "stepAction": "build",
                "stepDetail": {
                    "branchName": "release",
                    "buildChecks": [
                        "ls -alh"
                    ],
                    "buildCmds": [
                        "pwd",
                        "ls -al",
                        "go mod tidy",
                        "go build"
                    ],
                    "buildEnv": "go-1.17",
                    "buildPath": "Codes/Backend/tp1-gin-demo",
                    "buildPhaseID": 1,
                    "createTime": "2022-04-15T23:55:42.752+08:00",
                    "gitRepoName": "gitea-dory",
                    "gitURL": "http://vm.dory.cookeem.com:30001/test-project1/test-project1/commit/d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "latestCommit": "d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "moduleName": "tp1-gin-demo"
                },
                "stepID": "6259957e1645d0d247fd6d07",
                "stepName": "build tp1-gin-demo in go-1.17 env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-vue-demo",
                "moduleType": "build",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-2",
                "status": {
                    "duration": "49s744ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:48:52"
                },
                "stepAction": "scanCode",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T23:48:52.183+08:00",
                    "gitRepoName": "gitea-dory",
                    "gitURL": "http://vm.dory.cookeem.com:30001/test-project1/test-project1/commit/d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "latestCommit": "d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "moduleName": "tp1-vue-demo",
                    "scanCodeRepoSetting": {
                        "scanCodeRepoName": "sonarqube-dory",
                    },
                    "scanCodeURL": "http://cookeem.com:30008/dashboard?id=test-project1_tp1-vue-demo",
                    "scanMetrics": [
                        {
                            "bestValue": true,
                            "metric": {
                                "bestValue": "0",
                                "decimalScale": 0,
                                "description": "Vulnerabilities",
                                "domain": "Security",
                                "higherValuesAreBetter": false,
                                "key": "vulnerabilities",
                                "name": "Vulnerabilities",
                                "qualitative": false,
                                "type": "INT",
                                "worstValue": ""
                            },
                            "value": "0"
                        }
                    ],
                    "sonarExtraSettings": null
                },
                "stepID": "625993e41645d0d247fd6943",
                "stepName": "scan tp1-vue-demo"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "package",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "4s582ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:46"
                },
                "stepAction": "packageImage",
                "stepDetail": {
                    "architecture": "amd64",
                    "created": "2023-09-11T08:12:02.325973076Z",
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:42.799+08:00",
                    "dockerFile": "\nFROM registry.dory.cookeem.com/public/alpine:3.15.3-dory\n\nLABEL cookeem cookeem@qq.com\nLABEL app \"tp1-gin-demo\"\nCOPY Codes/Backend/tp1-gin-demo/tp1-gin-demo /tp1-gin-demo/\nWORKDIR /tp1-gin-demo\n",
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-gin-demo/artifacts/v0.0.0-release-1",
                    "moduleName": "tp1-gin-demo",
                    "size": 17887024,
                    "stepBuildIDs": [
                        "625995821645d0d247fd6e2d"
                    ],
                    "tagName": "v0.0.0-release-1",
                    "relatedSteps": [
                        {
                            "branchName": "develop",
                            "createTime": "11-24 22:02:50",
                            "envName": "",
                            "moduleName": "tp1a-gin-demo",
                            "moduleType": "package",
                            "pipelineName": "test-project1a-develop",
                            "runName": "test-project1a-develop-187",
                            "status": {
                                "createTime": "11-24 22:02:50",
                                "duration": "3s599ms",
                                "endTime": "11-24 22:03:07",
                                "msg": "",
                                "result": "FAIL",
                                "startTime": "11-24 22:03:03"
                            },
                            "statusID": "637f798a409e039ee80b82bc",
                            "stepAction": "scanImage",
                            "stepID": "637f798a409e039ee80b82bb",
                            "stepName": "scan tp1a-gin-demo docker image"
                        }
                    ],
                },
                "stepID": "6259957e1645d0d247fd6d2e",
                "stepName": "package tp1-gin-demo docker image"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-python-demo",
                "moduleType": "package",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-3",
                "status": {
                    "duration": "36s801ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:50:12"
                },
                "stepAction": "scanImage",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-09-01T14:21:20.957+08:00",
                    "image": {
                        "imageURL": "https://registry.dory.cookeem.com/harbor/projects/89/repositories/tp1-gin-demo/artifacts/v0.0.0-develop-20",
                        "stepPackageID": "6310164ec381ab7246a7082f",
                        "moduleName": "xxx",
                        "tagName": "v0.0.0-develop-20"
                    },
                    "imageMetadata": {
                        "ImageConfig": {
                            "architecture": "amd64",
                            "config": {
                                "Cmd": [
                                    "/bin/sh"
                                ],
                                "Env": [
                                    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                                ],
                                "Image": "sha256:6bb9a2a1911f0cf687f35fb9e16c7815e0abde3238caa8ddfefffc51c4a0a533",
                                "Labels": {
                                    "app": "tp1-gin-demo",
                                    "email": "dory-admin@example.com",
                                    "maintainer": "dory-admin"
                                },
                                "WorkingDir": "/tp1-gin-demo"
                            },
                            "container": "3bce856dfa1d62d43a0c8c235567e030332ce91e0d241744f8af405817a1691e",
                            "created": "2022-09-01T02:17:48.334257796Z",
                            "docker_version": "20.10.14",
                            "history": [
                                {
                                    "created": "2022-09-01T02:17:48.334257796Z",
                                    "created_by": "/bin/sh -c #(nop) WORKDIR /tp1-gin-demo",
                                    "empty_layer": true
                                }
                            ],
                            "os": "linux"
                        },
                        "ImageID": "sha256:258160abe76944a425c8b52613c09a9681243e2d191f3a180de1e8cafcb1d0e8",
                        "OS": {
                            "Family": "alpine",
                            "Name": "3.15.3"
                        },
                        "RepoDigests": [
                            "registry.dory.cookeem.com/test-project1/tp1-gin-demo@sha256:01532513a776edf812d03328b112ef7f70f9a6b6de8e0c178fbef47d5fe1209a"
                        ],
                        "RepoTags": [
                            "registry.dory.cookeem.com/test-project1/tp1-gin-demo:v0.0.0-develop-20"
                        ],
                        "stat": {
                            "CRITICAL": 5,
                            "HIGH": 14,
                            "MEDIUM": 13
                        }
                    },
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "moduleName": "tp1-gin-demo",
                    "scanImageStatus": "FAIL",
                    "stepBuildIDs": [
                        "63101645c381ab7246a7082d"
                    ],
                    "vulnerabilities": [
                        {
                            "Class": "lang-pkgs",
                            "DataSource": {
                                "ID": "go-vulndb",
                                "Name": "The Go Vulnerability Database",
                                "URL": "https://github.com/golang/vulndb"
                            },
                            "Description": "Go before 1.17.10 and 1.18.x before 1.18.2 has Incorrect Privilege Assignment. When called with a non-zero flags parameter, the Faccessat function could incorrectly report that a file is accessible.",
                            "FixedVersion": "0.0.0-20220412211240-33da011f77ad",
                            "InstalledVersion": "v0.0.0-20200116001909-b77594299b42",
                            "PkgName": "golang.org/x/sys",
                            "PrimaryURL": "https://avd.aquasec.com/nvd/cve-2022-29526",
                            "Severity": "MEDIUM",
                            "SeveritySource": "nvd",
                            "Target": "tp1-gin-demo/tp1-gin-demo",
                            "Title": "golang: syscall: faccessat checks wrong group",
                            "Type": "gobinary",
                            "VulnerabilityID": "CVE-2022-29526"
                        }
                    ]
                },
                "stepID": "625994341645d0d247fd698a",
                "stepName": "scan tp1-python-demo docker image"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "deploy",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "202ms871µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:57:18"
                },
                "stepAction": "deploy",
                "stepDetail": {
                    "archiveUrl": "xxx",
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:43.153+08:00",
                    "configMapYaml": "xxx",
                    "deployYaml": "xxx",
                    "envName": "prod",
                    "hpaYaml": "xxx",
                    "image": {
                        "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-gin-demo/artifacts/v0.0.0-release-1",
                        "stepPackageID": "625995871645d0d247fd6e2e",
                        "moduleName": "xxx",
                        "tagName": "v0.0.0-release-1"
                    },
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "isMeshEnable": false,
                    "k8sConfigMapYaml": "xxx",
                    "k8sDeployYaml": "xxx",
                    "k8sServiceYaml": "xxx",
                    "k8sHpaYaml": "xxx",
                    "k8sSecretYaml": "xxx",
                    "moduleName": "tp1-gin-demo",
                    "secretYaml": "xxx",
                    "try": true,
                    "serviceYaml": "xxx"
                },
                "stepID": "6259957f1645d0d247fd6ddf",
                "stepName": "deploy tp1-gin-demo to prod-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "deploy",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-7",
                "status": {
                    "duration": "5s136ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:53:58"
                },
                "stepAction": "undo",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T23:53:58.799+08:00",
                    "envName": "test",
                    "fromImage": {
                        "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-gin-demo/artifacts/v0.0.0-develop-5",
                        "stepPackageID": "625994fa1645d0d247fd6c05",
                        "moduleName": "xxx",
                        "tagName": "v0.0.0-develop-5"
                    },
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "isMeshEnable": false,
                    "moduleName": "tp1-gin-demo",
                    "toImage": {
                        "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-gin-demo/artifacts/v0.0.0-develop-4",
                        "stepPackageID": "625994621645d0d247fd6a60",
                        "moduleName": "xxx",
                        "tagName": "v0.0.0-develop-4"
                    }
                },
                "stepID": "625995161645d0d247fd6c3a",
                "stepName": "undo tp1-gin-demo to test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-spring-demo",
                "moduleType": "deploy",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "283ms826µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:52"
                },
                "stepAction": "syncImage",
                "stepDetail": {
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:42.875+08:00",
                    "envName": "uat",
                    "fromImages": [
                        {
                            "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-2",
                            "stepPackageID": "625992a41645d0d247fd6750",
                            "moduleName": "xxx",
                            "tagName": "v0.0.0-develop-2"
                        },
                        {
                            "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-3",
                            "stepPackageID": "6259935b1645d0d247fd681f",
                            "moduleName": "xxx",
                            "tagName": "v0.0.0-develop-3"
                        }
                    ],
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "isMeshEnable": true,
                    "isMeshEnableProd": true,
                    "moduleName": "tp1-spring-demo",
                    "toImages": [
                        {
                            "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-2",
                            "stepPackageID": "625992a41645d0d247fd6750",
                            "moduleName": "xxx",
                            "tagName": "v0.0.0-develop-2"
                        },
                        {
                            "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-3",
                            "stepPackageID": "6259935b1645d0d247fd681f",
                            "moduleName": "xxx",
                            "tagName": "v0.0.0-develop-3"
                        }
                    ]
                },
                "stepID": "6259957e1645d0d247fd6d64",
                "stepName": "sync tp1-spring-demo deploy image in uat-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-spring-demo",
                "moduleType": "deploy",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-10",
                "status": {
                    "duration": "5s292ms",
                    "result": "SUCCESS",
                    "startTime": "04-16 10:22:29"
                },
                "stepAction": "checkDeploy",
                "stepDetail": {
                    "branchName": "develop",
                    "checkPodStatuses": [
                        {
                            "age": "10h38m",
                            "errorDescribe": "xxx",
                            "errorLog": "xxx",
                            "image": {
                                "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-2",
                                "stepPackageID": "625992a41645d0d247fd6750",
                                "moduleName": "xxx",
                                "tagName": "v0.0.0-develop-2"
                            },
                            "podName": "tp1-spring-demo-buildid-2-6fb5d64f9d-fcktf",
                            "podSpec": "xxx",
                            "ready": "2/2",
                            "reason": "Running",
                            "restart": "0"
                        },
                        {
                            "age": "10h35m",
                            "errorDescribe": "xxx",
                            "errorLog": "xxx",
                            "image": {
                                "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-spring-demo/artifacts/v0.0.0-develop-3",
                                "stepPackageID": "6259935b1645d0d247fd681f",
                                "moduleName": "xxx",
                                "tagName": "v0.0.0-develop-3"
                            },
                            "podName": "tp1-spring-demo-buildid-3-5db8d86f76-mm79m",
                            "podSpec": "xxx",
                            "ready": "2/2",
                            "reason": "Running",
                            "restart": "0"
                        }
                    ],
                    "createTime": "2022-04-16T10:22:29.878+08:00",
                    "deploymentStatus": "READY",
                    "envName": "test",
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "moduleName": "tp1-spring-demo"
                },
                "stepID": "625a2865771b667ed81e74a0",
                "stepName": "check tp1-spring-demo deploy status in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "artifact",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "664ms987µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:51"
                },
                "stepAction": "artifact",
                "stepDetail": {
                    "artifactRepoSetting": {
                        "artifactRepoName": "nexus-dory",
                        "artifactRepoType": "",
                    },
                    "artifactURL": "http://vm.dory.cookeem.com:30003/#browse/browse:test-project1-raw:artifact%2Ftp1-gin-demo%2Ftp1-gin-demo-v0.0.0-release-1.tar.gz",
                    "artifacts": [
                        "Codes/Backend/tp1-gin-demo/tp1-gin-demo:tp1-gin-demo/"
                    ],
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:42.839+08:00",
                    "internalArtifactID": "",
                    "moduleName": "tp1-gin-demo",
                    "size": 4770554,
                    "stepBuildIDs": [
                        "625995821645d0d247fd6e2d"
                    ],
                    "tarName": "tp1-gin-demo-v0.0.0-release-1.tar.gz",
                    "relatedSteps": [
                        {
                            "branchName": "develop",
                            "createTime": "11-24 22:02:50",
                            "envName": "",
                            "moduleName": "tp1a-gin-demo",
                            "moduleType": "package",
                            "pipelineName": "test-project1a-develop",
                            "runName": "test-project1a-develop-187",
                            "status": {
                                "createTime": "11-24 22:02:50",
                                "duration": "3s599ms",
                                "endTime": "11-24 22:03:07",
                                "msg": "",
                                "result": "FAIL",
                                "startTime": "11-24 22:03:03"
                            },
                            "statusID": "637f798a409e039ee80b82bc",
                            "stepAction": "scanImage",
                            "stepID": "637f798a409e039ee80b82bb",
                            "stepName": "scan tp1a-gin-demo docker image"
                        }
                    ],
                },
                "stepID": "6259957e1645d0d247fd6d49",
                "stepName": "artifact tp1-gin-demo tar file"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "deployArtifact",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-9",
                "status": {
                    "duration": "15s329ms",
                    "result": "SUCCESS",
                    "startTime": "04-16 00:12:23"
                },
                "stepAction": "deployArtifact",
                "stepDetail": {
                    "artifactRepoSetting": {
                        "artifactRepoName": "nexus-dory",
                    },
                    "branchName": "develop",
                    "createTime": "2022-04-16T00:12:23.005+08:00",
                    "envName": "test",
                    "hosts": "group_demo",
                    "hostsIni": "xxx",
                    "moduleName": "tp1-gin-demo",
                    "archiveUrl": "xxx",
                    "try": true,
                    "tar": {
                        "artifactURL": "http://vm.dory.cookeem.com:30003/#browse/browse:test-project1-raw:artifact%2Ftp1-gin-demo%2Ftp1-gin-demo-v0.0.0-develop-5.tar.gz",
                        "stepArtifactID": "625994fb1645d0d247fd6c06",
                        "moduleName": "xxx",
                        "tarName": "tp1-gin-demo-v0.0.0-develop-5.tar.gz"
                    },
                    "tasks": "# 创建应用目录\n- name: \"create {{ project_name }} directory\"\n  file:\n    path: \"{{ base_dir }}/{{ project_name }}/\"\n    state: directory\n    mode: '0755'\n# 创建备份目录\n- name: \"create backup directory\"\n  file:\n    path: \"{{ backup_dir }}/\"\n    state: directory\n    mode: \"0755\"\n# 把模块制品复制到目标主机\n- name: \"copy {{ module_name }} artifact file to remote host\"\n  copy:\n    src: \"{{ module_name }}.tar.gz\"\n    dest: \"{{ base_dir }}/{{ project_name }}/{{ module_name }}.tar.gz\"\n  ignore_errors: yes\n# 检查模块服务是否正在运行\n- name: \"check {{ module_name }} is running\"\n  shell: \"netstat -ntulp | grep {{ service_port }} | awk '{print $7}' | awk -F '/' '{print $1}'\"\n  register: running_processes\n# 打印模块服务进程PID\n- name: \"print {{ module_name }} pid\"\n  debug:\n    msg: \"PIDS of {{ module_name }}: {{ running_processes.stdout_lines | join(',') }}\"\n  ignore_errors: yes\n# 停止模块服务进程\n- name: \"stop {{ module_name }} service\"\n  shell: \"kill -9 {{ running_processes.stdout_lines | join(',') }}\"\n  ignore_errors: yes\n# 等待模块进程成功退出\n- name: \"wait for {{ module_name }} stop\"\n  wait_for:\n    path: \"/proc/{{ item }}/status\"\n    state: absent\n  with_items: \"{{ running_processes.stdout_lines }}\"\n  ignore_errors: yes\n  register: killed_processes\n# 备份旧版本模块\n- name: \"move and backup {{ module_name }} files\"\n  shell: \"cd {{ base_dir }}/{{ project_name }}/ && mv {{ module_name }} {{ backup_dir }}/{{ module_name }}-$(date '+%Y%m%d-%H%M%S')\"\n  ignore_errors: yes\n# 解压nexus的模块制品\n- name: \"unarchive {{ module_name }}\"\n  shell: \"cd {{ base_dir }}/{{ project_name }}/ && tar zxvf {{ module_name }}.tar.gz\"\n# 自动生成配置文件并上传到节点\n- name: \"copy configfile to nodes\"\n  template:\n    src: config.j2\n    dest: \"{{ base_dir }}/{{ project_name }}/{{ module_name }}/config.yaml\"\n# 启动服务\n- name: \"start {{ module_name }} service\"\n  shell: \"cd {{ base_dir }}/{{ project_name }}/{{ module_name }}/ && nohup ./{{ module_name }} >> {{ module_name }}.log 2>&1 &\"\n# 查看服务日志\n- name: \"check {{ module_name }} service logs\"\n  shell: \"sleep 3 && tail -100 {{ base_dir }}/{{ project_name }}/{{ module_name }}/{{ module_name }}.log\"\n# 对服务进行冒烟测试\n- name: \"service {{ module_name }} smoking test\"\n  uri:\n    url: http://localhost:{{ service_port }}\n    method: GET\n",
                    "variables": {
                        "backup_dir": "/backup",
                        "base_dir": "/app",
                        "service_port": "8000"
                    }
                },
                "stepID": "62599967591f9ba3784eb8a8",
                "stepName": "deploy tp1-gin-demo artifact in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "gin-demo/gin-demo.robot",
                "moduleType": "testApi",
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "runName": "test-project1-develop-6",
                "status": {
                    "duration": "1s365ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 18:50:20"
                },
                "stepAction": "testApi",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T18:48:58.959+08:00",
                    "envName": "test",
                    "filePath": "/assets/testReport/test-project1/Ig8HqF7c85TapLgy/gin-demo-report.html",
                    "moduleName": "gin-demo/gin-demo.robot",
                    "result": "\n==============================================================================\nGin-Demo                                                                      \n==============================================================================\nGet Gin Demo Message                                                  | PASS |\n------------------------------------------------------------------------------\nGin-Demo                                                              | PASS |\n1 test, 1 passed, 0 failed\n==============================================================================\nOutput:  /dory-engine/dory-data/workspaces/test-project1-develop-6/Tests/api/test/gin-demo/oA25KGl0/gin-demo-output.xml\nLog:     /dory-engine/dory-data/workspaces/test-project1-develop-6/Tests/api/test/gin-demo/oA25KGl0/gin-demo-log.html\nReport:  /dory-engine/dory-data/workspaces/test-project1-develop-6/Tests/api/test/gin-demo/oA25KGl0/gin-demo-report.html\ntotal 464K\ndrwxr-xr-x 2 1000 1000  108 Apr 15 10:50 .\ndrwxr-xr-x 3 1000 1000   44 Apr 15 10:50 ..\n-rw-r--r-- 1 1000 1000 224K Apr 15 10:50 gin-demo-log.html\n-rw-r--r-- 1 1000 1000 4.1K Apr 15 10:50 gin-demo-output.xml\n-rw-r--r-- 1 1000 1000 227K Apr 15 10:50 gin-demo-report.html\n-rw-r--r-- 1 1000 1000  494 Apr 15 10:48 gin-demo.robot",
                    "tarPath": "/assets/testReport/test-project1/Ig8HqF7c85TapLgy/test-report.tar.gz",
                    "testType": "api"
                },
                "stepID": "62594d9ad8e6e1dc09158de6",
                "stepName": "api testing gin-demo/gin-demo.robot in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "go-demo/go-demo.jmx",
                "moduleType": "testPerformance",
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "runName": "test-project1-develop-6",
                "status": {
                    "duration": "13s916ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 18:50:21"
                },
                "stepAction": "testPerformance",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T18:48:58.988+08:00",
                    "envName": "test",
                    "filePath": "/assets/testReport/test-project1/t7BBxJ8pN5jwsSKo/go-demo-report",
                    "moduleName": "go-demo/go-demo.jmx",
                    "result": "\nApr 15, 2022 10:50:23 AM java.util.prefs.FileSystemPreferences$1 run\nINFO: Created user preferences directory.\nCreating summariser <summary>\nCreated the tree successfully using go-demo.jmx\nStarting standalone test @ Fri Apr 15 10:50:24 GMT 2022 (1650019824187)\nWaiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445\nsummary +     61 in 00:00:06 =   10.0/s Avg:    41 Min:    14 Max:   196 Err:     0 (0.00%) Active: 1 Started: 7 Finished: 6\nsummary +     39 in 00:00:03 =   11.7/s Avg:    31 Min:    12 Max:    64 Err:     0 (0.00%) Active: 0 Started: 10 Finished: 10\nsummary =    100 in 00:00:09 =   10.6/s Avg:    37 Min:    12 Max:   196 Err:     0 (0.00%)\nTidying up ...    @ Fri Apr 15 10:50:33 GMT 2022 (1650019833970)\n... end of run\ntotal 104K   \ndrwxr-xr-x    4 1000     1000         120 Apr 15 10:50 .\ndrwxr-xr-x    3 1000     1000          41 Apr 15 10:50 ..\ndrwxr-xr-x    3 1000     1000          19 Apr 15 10:50 ?\n-rw-r--r--    1 1000     1000       30.7K Apr 15 10:50 gc_jmeter_pid39.log\ndrwxr-xr-x    4 1000     1000          84 Apr 15 10:50 go-demo-report\n-rw-r--r--    1 1000     1000        6.2K Apr 15 10:48 go-demo.jmx\n-rw-r--r--    1 1000     1000       38.9K Apr 15 10:50 go-demo.jtl\n-rw-r--r--    1 1000     1000       21.3K Apr 15 10:50 jmeter.log",
                    "tarPath": "/assets/testReport/test-project1/t7BBxJ8pN5jwsSKo/test-report.tar.gz",
                    "testType": "performance"
                },
                "stepID": "62594d9ad8e6e1dc09158ded",
                "stepName": "performance testing go-demo/go-demo.jmx in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "vue-demo-firefox/vue-demo-firefox.robot",
                "moduleType": "testWebui",
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "runName": "test-project1-develop-6",
                "status": {
                    "duration": "6s708ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 18:50:35"
                },
                "stepAction": "testWebui",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T18:48:59.018+08:00",
                    "envName": "test",
                    "filePath": "/assets/testReport/test-project1/2V84PfHO101Afi89/report.html",
                    "moduleName": "vue-demo-firefox/vue-demo-firefox.robot",
                    "result": "\ntotal 4.0K\ndrwxr-xr-x 2 1000 1000  36 Apr 15 10:48 .\ndrwxr-xr-x 1 root root  19 Apr 15 10:50 ..\n-rw-r--r-- 1 1000 1000 302 Apr 15 10:48 vue-demo-firefox.robot\n==============================================================================\nTests                                                                         \n==============================================================================\nTests.Vue-Demo-Firefox                                                        \n==============================================================================\nOpen Website In Browser                                               | PASS |\n------------------------------------------------------------------------------\nTests.Vue-Demo-Firefox                                                | PASS |\n1 test, 1 passed, 0 failed\n==============================================================================\nTests                                                                 | PASS |\n1 test, 1 passed, 0 failed\n==============================================================================\nOutput:  /opt/robotframework/reports/output.xml\nLog:     /opt/robotframework/reports/log.html\nReport:  /opt/robotframework/reports/report.html\ntotal 552K\ndrwxr-xr-x 2 1000 1000  132 Apr 15 10:50 .\ndrwxr-xr-x 1 root root   31 Apr 15 10:50 ..\n-rw-r--r-- 1 1000 1000  401 Apr 15 10:50 geckodriver-1.log\n-rw-r--r-- 1 1000 1000 223K Apr 15 10:50 log.html\n-rw-r--r-- 1 1000 1000  87K Apr 15 10:50 output.png\n-rw-r--r-- 1 1000 1000 2.3K Apr 15 10:50 output.xml\n-rw-r--r-- 1 1000 1000 227K Apr 15 10:50 report.html\n-rw-r--r-- 1 1000 1000  302 Apr 15 10:50 vue-demo-firefox.robot",
                    "tarPath": "/assets/testReport/test-project1/2V84PfHO101Afi89/test-report.tar.gz",
                    "testType": "webui"
                },
                "stepID": "62594d9bd8e6e1dc09158df9",
                "stepName": "webui testing vue-demo-firefox/vue-demo-firefox.robot in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-7",
                "status": {
                    "duration": "12s526ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 20:56:21"
                },
                "stepAction": "databaseExec",
                "stepDetail": {
                    "actionName": "execute",
                    "branchName": "develop",
                    "createTime": "2022-04-15T20:56:21.967+08:00",
                    "envName": "test",
                    "actionConfigs": [
                        {
                            "dbName": "tp1-mysql",
                            "config": {
                                "update": {
                                    "tag": "v0.1.0",
                                    "label": "",
                                    "context": "",
                                },
                                "rollback": {
                                    "kind": "count",
                                    "value": "3",
                                }
                            },
                            "sqlContent": "xxx"
                        }
                    ],
                },
                "stepID": "62596b75a029440abe172c86",
                "stepName": "execute database scripts in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-8",
                "status": {
                    "duration": "7s330ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 20:56:58"
                },
                "stepAction": "databaseRollback",
                "stepDetail": {
                    "actionName": "rollback",
                    "branchName": "develop",
                    "createTime": "2022-04-15T20:56:58.613+08:00",
                    "envName": "test",
                    "actionConfigs": [
                        {
                            "dbName": "tp1-mysql",
                            "config": {
                                "update": {
                                    "tag": "v0.1.0",
                                    "label": "",
                                    "context": "",
                                },
                                "rollback": {
                                    "kind": "count",
                                    "value": "3",
                                }
                            },
                            "sqlContent": "xxx"
                        }
                    ],
                },
                "stepID": "62596b9aa029440abe172cbb",
                "stepName": "rollback database scripts in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-3",
                "status": {
                    "duration": "214ms891µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 20:01:26"
                },
                "stepAction": "applyMesh",
                "stepDetail": {
                    "branchName": "release",
                    "createTime": "2022-04-15T19:59:24.109+08:00",
                    "envName": "prod",
                    "isMeshEnable": true,
                    "istioInfoYaml": "istioDefs:\n    - deployName: tp1-go-demo\n      httpSettings:\n        gateway:\n            matchDefault: true\n        matchHeaders:\n            - header: user-agent\n              matchType: regex\n              matchValue: .*Chrome.*\n      port: 8000\n      protocol: http\n    - deployName: tp1-node-demo\n      port: 3000\n      protocol: http\n    - deployName: tp1-python-demo\n      port: 3000\n      protocol: http\n    - deployName: tp1-spring-demo\n      httpSettings:\n        gateway:\n            rewriteUri: /spring\n      port: 9000\n      protocol: http\nistioGatewayDef:\n    enable: true\n    hostDefault: www.test-project1.local\n    hostNew: test.test-project1.local\n    sourceSubsetHeader: x-dory-source-subset\n",
                    "archiveUrl": "xxx",
                    "try": true,
                    "meshSubsets": [
                        {
                            "defaultBuildID": "1",
                            "moduleName": "tp1-go-demo",
                            "newBuildID": "2"
                        },
                        {
                            "defaultBuildID": "1",
                            "moduleName": "tp1-node-demo",
                            "newBuildID": "2"
                        },
                        {
                            "defaultBuildID": "1",
                            "moduleName": "tp1-python-demo",
                            "newBuildID": "2"
                        },
                        {
                            "defaultBuildID": "1",
                            "moduleName": "tp1-spring-demo",
                            "newBuildID": "2"
                        }
                    ]
                },
                "stepID": "62595e1c80da4ca7d986b2cc",
                "stepName": "apply test-project1 service mesh in prod-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-ops",
                "projectName": "test-project1",
                "runName": "test-project1-ops-4",
                "status": {
                    "duration": "335ms193µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 15:53:28"
                },
                "stepAction": "changeMesh",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-15T15:53:28.653+08:00",
                    "envName": "test",
                    "weight": 50
                },
                "stepID": "62592478234feac644c7e3c1",
                "stepName": "change mesh in test-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-3",
                "status": {
                    "duration": "64ms107µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 20:01:26"
                },
                "stepAction": "applyIngress",
                "stepDetail": {
                    "branchName": "release",
                    "createTime": "2022-04-15T19:59:24.082+08:00",
                    "envName": "prod",
                    "archiveUrl": "xxx",
                    "try": true,
                    "ingressYaml": "xxx",
                    "k8sIngressYaml": "xxx"
                },
                "stepID": "62595e1c80da4ca7d986b2c5",
                "stepName": "apply test-project1 ingress in prod-env"
            },
            {
                "isCustomStep": false,
                "moduleName": "",
                "moduleType": "",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-3",
                "status": {
                    "duration": "25ms910µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 20:01:31"
                },
                "stepAction": "checkQuota",
                "stepDetail": {
                    "branchName": "release",
                    "createTime": "2022-04-15T19:59:24.178+08:00",
                    "envName": "prod",
                    "hard": {
                        "cpuLimit": 4,
                        "cpuRequest": 1,
                        "memoryLimit": 4000,
                        "memoryRequest": 1000,
                        "pods": 32
                    },
                    "resourceQuotaDesc": "Name:            test-project1\nNamespace:       test-project1\nResource         Used    Hard\n--------         ----    ----\nlimits.cpu       2       4\nlimits.memory    2300Mi  4Gi\npods             9       32\nrequests.cpu     320m    1\nrequests.memory  410Mi   1Gi\n",
                    "resourceRate": {
                        "cpuLimitRate": 0.5,
                        "cpuRequestRate": 0.32,
                        "memoryLimitRate": 0.575,
                        "memoryRequestRate": 0.41,
                        "podsRate": 0.28125
                    },
                    "used": {
                        "cpuLimit": 2,
                        "cpuRequest": 0.32,
                        "memoryLimit": 2300,
                        "memoryRequest": 410,
                        "pods": 9
                    }
                },
                "stepID": "62595e1c80da4ca7d986b2ee",
                "stepName": "check resource quota in prod-env"
            },
            {
                "isCustomStep": true,
                "moduleName": "tp1-gin-demo",
                "moduleType": "xxx",
                "pipelineName": "test-project1-develop",
                "projectName": "test-project1",
                "runName": "test-project1-develop-10",
                "status": {
                    "duration": "1s265ms",
                    "result": "SUCCESS",
                    "startTime": "04-16 22:12:55"
                },
                "stepAction": "xxx",
                "stepDetail": {
                    "branchName": "develop",
                    "createTime": "2022-04-16T22:12:53.393+08:00",
                    "customStepName": "xxx",
                    "envName": "",
                    "moduleName": "tp1-gin-demo",
                    "outputFiles": [
                        "/assets/customStepOutput/test-project1/xxx/guoGUrGGfNo2hpAn/dory-file-output/output.txt"
                    ],
                    "paramInput": {
                        "path": "Codes/Backend/tp1-gin-demo"
                    },
                    "paramOutput": {
                        "output": "NOOK"
                    },
                    "tarFile": "/assets/customStepOutput/test-project1/xxx/guoGUrGGfNo2hpAn/dory-file-output.tar.gz"
                },
                "stepID": "625acee528fd26f319dde6b1",
                "stepName": "xxx tp1-gin-demo"
            }
        ],
        "totalCount": 10
    }
}
```

#### [GET] api/cicd/stepOptions cicd执行步检索选项接口

- request请求内容
```json
{
    "projectNames": [
        "xxx",
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
        "stepActions": [
            "xxx",
        ],
        "statusResults": [
            "xxx",
        ],
        "moduleTypes": [
            "xxx",
        ],
        "moduleNames": [
            "xxx",
        ],
    }
}
```

#### [POST] api/cicd/steps/:stepAction cicd获取构建打包执行详情接口

- request请求内容
```json
{
    "ids": [
        "xxx",
        "xxx"
    ],
}
```
    - stepAction: build, package, artifact

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "steps": [
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "build",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "2s829ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:43"
                },
                "stepAction": "build",
                "stepContainerStats": {
                    "cpuDelta": 41189466175.101265,
                    "cpuPercent": 0.0013811729968044092,
                    "cpuTotalUsage": 41189466175,
                    "duration": "1m18s",
                    "memoryLimit": 16788545536,
                    "memoryMaxUsage": 148587118,
                    "memoryPercent": 0.007711542968440325,
                    "memoryUsage": 129465590,
                    "systemDelta": 11928780959746836
                },
                "stepDetail": {
                    "branchName": "release",
                    "buildChecks": [
                        "ls -alh"
                    ],
                    "buildCmds": [
                        "pwd",
                        "ls -al",
                        "go mod tidy",
                        "go build"
                    ],
                    "buildEnv": "go-1.17",
                    "buildPath": "Codes/Backend/tp1-gin-demo",
                    "buildPhaseID": 1,
                    "createTime": "2022-04-15T23:55:42.752+08:00",
                    "gitRepoName": "gitea-dory",
                    "gitURL": "http://vm.dory.cookeem.com:30001/test-project1/test-project1/commit/d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "latestCommit": "d0379ed91b8c026ebc758c073e2503196262e7c3",
                    "moduleName": "tp1-gin-demo"
                },
                "stepID": "6259957e1645d0d247fd6d07",
                "stepName": "build tp1-gin-demo in go-1.17 env"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "package",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "4s582ms",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:46"
                },
                "stepAction": "packageImage",
                "stepDetail": {
                    "architecture": "amd64",
                    "created": "2023-09-11T08:12:02.325973076Z",
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:42.799+08:00",
                    "dockerFile": "\nFROM registry.dory.cookeem.com/public/alpine:3.15.3-dory\n\nLABEL cookeem cookeem@qq.com\nLABEL app \"tp1-gin-demo\"\nCOPY Codes/Backend/tp1-gin-demo/tp1-gin-demo /tp1-gin-demo/\nWORKDIR /tp1-gin-demo\n",
                    "imageRepoSetting": {
                        "harborProjectID": 16,
                        "imageRepoName": "harbor-dory",
                        "imageRepoHostName": "",
                        "imageRepoGroupName": "",
                        "imageRepoUserName": "",
                        "imageRepoPassword": "",
                        "storageLimit": 0,
                    },
                    "imageURL": "https://registry.dory.cookeem.com/harbor/projects/16/repositories/tp1-gin-demo/artifacts/v0.0.0-release-1",
                    "moduleName": "tp1-gin-demo",
                    "size": 17887024,
                    "stepBuildIDs": [
                        "625995821645d0d247fd6e2d"
                    ],
                    "tagName": "v0.0.0-release-1",
                    "relatedSteps": [
                        {
                            "branchName": "develop",
                            "createTime": "11-24 22:02:50",
                            "envName": "",
                            "moduleName": "tp1a-gin-demo",
                            "moduleType": "package",
                            "pipelineName": "test-project1a-develop",
                            "runName": "test-project1a-develop-187",
                            "status": {
                                "createTime": "11-24 22:02:50",
                                "duration": "3s599ms",
                                "endTime": "11-24 22:03:07",
                                "msg": "",
                                "result": "FAIL",
                                "startTime": "11-24 22:03:03"
                            },
                            "statusID": "637f798a409e039ee80b82bc",
                            "stepAction": "scanImage",
                            "stepID": "637f798a409e039ee80b82bb",
                            "stepName": "scan tp1a-gin-demo docker image"
                        }
                    ],
                },
                "stepID": "6259957e1645d0d247fd6d2e",
                "stepName": "package tp1-gin-demo docker image"
            },
            {
                "isCustomStep": false,
                "moduleName": "tp1-gin-demo",
                "moduleType": "artifact",
                "pipelineName": "test-project1-release",
                "projectName": "test-project1",
                "runName": "test-project1-release-1",
                "status": {
                    "duration": "664ms987µs",
                    "result": "SUCCESS",
                    "startTime": "04-15 23:55:51"
                },
                "stepAction": "artifact",
                "stepDetail": {
                    "artifactRepoSetting": {
                        "artifactRepoName": "nexus-dory",
                        "artifactRepoType": "",
                    },
                    "artifactURL": "http://vm.dory.cookeem.com:30003/#browse/browse:test-project1-raw:artifact%2Ftp1-gin-demo%2Ftp1-gin-demo-v0.0.0-release-1.tar.gz",
                    "artifacts": [
                        "Codes/Backend/tp1-gin-demo/tp1-gin-demo:tp1-gin-demo/"
                    ],
                    "branchName": "release",
                    "createTime": "2022-04-15T23:55:42.839+08:00",
                    "internalArtifactID": "",
                    "moduleName": "tp1-gin-demo",
                    "size": 4770554,
                    "stepBuildIDs": [
                        "625995821645d0d247fd6e2d"
                    ],
                    "tarName": "tp1-gin-demo-v0.0.0-release-1.tar.gz",
                    "relatedSteps": [
                        {
                            "branchName": "develop",
                            "createTime": "11-24 22:02:50",
                            "envName": "",
                            "moduleName": "tp1a-gin-demo",
                            "moduleType": "package",
                            "pipelineName": "test-project1a-develop",
                            "runName": "test-project1a-develop-187",
                            "status": {
                                "createTime": "11-24 22:02:50",
                                "duration": "3s599ms",
                                "endTime": "11-24 22:03:07",
                                "msg": "",
                                "result": "FAIL",
                                "startTime": "11-24 22:03:03"
                            },
                            "statusID": "637f798a409e039ee80b82bc",
                            "stepAction": "scanImage",
                            "stepID": "637f798a409e039ee80b82bb",
                            "stepName": "scan tp1a-gin-demo docker image"
                        }
                    ],
                },
                "stepID": "6259957e1645d0d247fd6d49",
                "stepName": "artifact tp1-gin-demo tar file"
            },
        ]
    }
}
```

#### [GET] api/cicd/artifact/:projectName cicd项目制品查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project artifact success",
    "duration": "3.447572ms",
    "data": {
        "artifacts": [
            {
                "artifactID": "653095ead78f894afae4fb3f",
                "checksumMd5": "937bd4d5fd87534c793f0402e7db7a9e",
                "checksumSha1": "763cba25b8c917551dcd0d0e0e948d521c4b5ebb",
                "createTime": "2023-10-19 10:35:22",
                "fileExt": "gz",
                "fileMimeType": "application/gzip",
                "fileName": "tp4-gin-demo-v0.0.0-develop-4.tar.gz",
                "filePath": "test-project4/artifact/tp4-gin-demo",
                "fileSize": 5788056,
                "moduleName": "tp4-gin-demo",
                "moduleType": "artifact",
                "pipelineName": "test-project4-develop",
                "projectName": "test-project4",
                "projectNamespace": "test-project4",
                "runName": "test-project4-develop-4",
                "size": "5.52 MB",
                "stepAction": "artifact",
                "stepID": "653095e0d78f894afae4fae7"
            },
        ],
        "trees": [
            {
                "artifactID": "test-project4/artifact",
                "children": [
                    {
                        "artifactID": "test-project4/artifact/tp4-gin-demo",
                        "children": [
                            {
                                "artifactID": "653095ead78f894afae4fb3f",
                                "children": null,
                                "ext": "gz",
                                "name": "tp4-gin-demo-v0.0.0-develop-4.tar.gz"
                            },
                        ],
                        "ext": "",
                        "name": "tp4-gin-demo"
                    }
                ],
                "ext": "",
                "name": "artifact"
            },
        ]
    }
}
```

#### [GET] api/cicd/artifact/:projectName/:artifactID cicd项目制品下载接口

- response响应内容（出现异常的情况下返回错误）
```json
{
    "status": "SUCCESS",
    "msg": "get project artifact success",
    "duration": "3.447572ms",
}
```

#### [DELETE] api/cicd/artifact/:projectName/:artifactID cicd项目制品删除接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project artifact success",
    "duration": "3.447572ms",
}
```

#### [GET] api/cicd/module/:projectName/:moduleType/:moduleName cicd模块查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "module": {
            "projectName" : "test-project1",
            "moduleName" : "tp1-go-demo",
            "moduleType" : "build",
            "categoryKind":	"branchName",
            "isLatest": true,
            "hidden": false,
            "runTimeLatest" : "02-03 12:12:12",
            "runCount" : 10,
            "runNameLatest" : "test-project1-ops-7",
            "latestSteps": [
                {
                    "categoryName": "develop",
                    "stepIDs": [
                        "63b4f2a961cf950eeab92453",
                        "63b4f2a961cf950eeab9241e"
                    ]
                }
            ]

        }
    }
}
```

#### [POST] api/cicd/module/:projectName/:moduleType/:moduleName cicd模块隐状态设置接口

- request请求内容
```json
{
    "hidden": false,
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/cicd/run/:runName cicd运行查看接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "cicdCustomStepInserts": {
            "applyMesh": [
                "envTestRobot"
            ],
        },
        "errMsgPipelineDef": "",
        "branchNames": [
            "develop"
        ],
        "run": {
            "projectName": "test-project1",
            "opsBatchDefs": [
                {
                    "opsBatchName": "xxx",
                    "opsBatchDesc": "xxx",
                },
            ],
            "branchName": "develop",
            "pipelineName": "test-project1-develop",
            "runName": "test-project1-develop-17",
            "gitURL": "xxx",
            "triggerKind": "manual",
            "startUser" : "xxx",
            "abortUser" : "",
            "tagName" : "v0.1.0-dev-6-ga0fbb33",
            "pipelineDefYaml": "xxx",
            "status": {
                "result" : "SUCCESS",
                "startTime" : "20-20 12:12:12",
                "duration" : "1m12s"
            }
        },
        "modules": {
            "artifact": [
                {
                    "moduleName": "tp1-gin-demo",
                    "moduleEnable": true
                }
            ],
            "build": [
                {
                    "moduleName": "tp1-python-demo",
                    "moduleEnable": true
                },
            ],
            "deploy": [
                {
                    "moduleName": "tp1-node-demo",
                    "moduleEnable": true
                },
            ],
            "deployArtifact": [
                {
                    "moduleName": "tp1-gin-demo",
                    "moduleEnable": true
                }
            ],
            "package": [
                {
                    "moduleName": "tp1-gin-demo",
                    "moduleEnable": true
                },
            ]
        }
    }
}
```

- 对于branchName为空的流水线，pipelineDef为空

#### [POST] api/cicd/pipeline/:pipelineName cicd执行流水线接口

- request请求内容
  - batches: 批处理操作，使用::分隔每一个批处理命令，body中的batches参数优先。
  - 其他参数，将会写入paramRequest参数，body中的paramRequest参数优先。
```json
{
    "batches": ["xxx", "yyy"],
    "paramRequest": {
        "key1": "value1",
        "key2": "value2"
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
        "runName": "test-project1-develop-12"
    }
}
```

#### [POST] api/cicd/batch/:projectName/:opsBatchName cicd执行批处理流水线接口

- request请求内容
  - batches: 批处理操作，使用::分隔每一个批处理命令，body中的batches参数优先。
  - 其他参数，将会写入paramRequest参数，body中的paramRequest参数优先。
```json
{
    "batches": ["xxx", "yyy"],
    "paramRequest": {
        "key1": "value1",
        "key2": "value2"
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
        "runName": "test-project1-develop-12"
    }
}
```

#### [PATCH] api/cicd/run/:runName cicd终止运行接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/cicd/run/:runName/input cicd获取运行的输入提示接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "phaseID": "xxx",
        "title": "Please select operation type",
        "desc": "Please select operation type",
        "isMultiple": false,
        "isApiOnly": false,
        "options":[
            {
                "name":"undo deployment in test env",
                "value":"inputUndo"
            },
            {
                "name":"deploy debug containers in test env",
                "value":"inputDeployDebug"
            
            },
            {
                "name":"deploy middle wares in test env",
                "value":"inputDeployStatic"
            },
            {
                "name":"change mesh weight in test env",
                "value":"inputChangeMeshWeight"
            },
            {
                "name":"execute database update in test env",
                "value":"inputDatabaseExec"
            },
            {
                "name":"execute database rollback in test env",
                "value":"inputDatabaseRollback"
            }
        ],
    }
}
```

- 当phaseID不为空的时候才显示输入框
- 当options不为空的时候显示下拉列表，下拉选择单选，选择的value作为cicd提交运行的输入接口的inputValue参数；
- 当options为空的时候不显示下拉列表，点击确认的时候，cicd提交运行的输入接口的inputValue参数设置为"CONFIRM"

#### [POST] api/cicd/run/:runName/input cicd提交运行的输入接口

- request请求内容
```json
{
    "phaseID": "xxx",
    "inputValue": "xxx",
    "paramStepInput": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

- paramStepInput为额外的输入参数，是一个json的结构体

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```
- 点击输入框的终止按钮，inputValue参数设置为"ABORT"

#### [POST] api/cicd/notifications cicd 通知列表接口

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
    }
}
```

    - stepDetail: 不同的stepAction字段不一样，对应[POST] api/cicd/steps cicd执行步骤记录列表与搜索接口的stepDetail字段

#### [GET] api/cicd/notificationOptions cicd 通知选项接口

- response响应内容
```json
{
	"status": "SUCCESS",
	"msg": "list notification options success",
	"duration": "7.771242ms",
	"data": {
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
		]
	}
}
```

#### [POST] api/cicd/notificationRead cicd 通知已读设置接口

- request请求内容
```json
{
    "notificationIDs": [
        "xxx",
        "xxx"
    ],
}
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "read notification success",
    "duration": "24.973515ms",
    "data": {}
}
```

#### [POST] api/cicd/announcements cicd公告列表接口

- request请求内容
```json
{
    "readMode": "xxx",
    "levels": [
        "xxx"
    ],
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
    "page": 1,
    "perPage": 10
}
```

- readMode: 是否已读
  - "" 全部
  - "read" 已读
  - "unread" 未读

- levels: 紧急程度
  来源于本接口的levels字段

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "list announcement success",
    "duration": "2.724767ms",
    "data": {
        "announcements": [
            {
                "announcementID": "60b77c6eee3e438ab3852d4e",
                "attachments": [
                    {
                        "applyID": "60b77c29ee3e438ab3852d48",
                        "attachmentID": "60b77c28ee3e438ab3852d44",
                        "createTime": "2021-06-02T12:40:08.888Z",
                        "fileExt": ".svg",
                        "fileName": "多利3.0.svg",
                        "filePath": "dory-data/attachment/20210602/J93tsWnV3ETzyheS",
                        "fileSize": 6147,
                        "name": "DEVOPS-管理员",
                        "username": "devops-admin"
                    },
                ],
                "content": "内容1",
                "createTime": "06-02 20:41:18",
                "isRead": true,
                "level": "high",
                "title": "申请1",
                "username": "devops-admin"
            }
        ],
        "levels": [
            "high",
            "medium",
            "low"
        ],
        "totalCount": 1
    }
}
```

#### [POST] api/cicd/announcementRead cicd公告已读设置接口

- request请求内容
```json
{
    "announcementIDs": [
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
    "data": {}
}
```

#### [GET] api/cicd/attachment/:attachmentID cicd下载附件接口

- response响应内容（出现异常的情况下返回错误）
```json
{
    "status": "FAIL",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

- response响应内容（正常情况下，进行文件下载）

#### [GET] api/cicd/projectDef/:projectName cicd获取项目所有定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get project success",
    "duration": "35.831µs",
    "data": {
        "project": {
            "projectRepo": {
                "artifactRepo": "https://nexus.dory.cookeem.com",
                "artifactRepoType": "xxx",
                "gitRepo": "https://gitlab.dory.cookeem.com/test-project1/test-project1",
                "gitRepoDir": {
                    "buildSettingsDir": "xxx",
                    "databaseScriptsDir": "xxx",
                    "demoCodesDir": "xxx",
                    "deployScriptsDir": "xxx",
                    "documentsDir": "xxx",
                    "testScriptsDir": "xxx",
                },
                "imageRepo": "https://registry.dory.cookeem.com",
                "scanCodeRepo": "http://vm.dory.cookeem.com:30009/projects"
            },
            "projectNodePorts": [
                {
                    "envName": "devops",
                    "envNodePorts": [
                        {
                            "isDefault": true,
                            "nodePortStart": 30100,
                            "nodePortEnd": 30109,
                        }
                    ],
                    "nodePorts": [
                        30002,
                        30003
                    ],
                }
            ],
            "buildEnvs": [
                "maven-jdk7",
            ],
            "buildNames": [
                "tp1-gin-demo",
            ],
            "packageNames": [
                "tp1-gin-demo",
                "tp1-go-demo",
                "tp1-node-demo",
                "tp1-python-demo",
                "tp1-spring-demo"
            ],
            "artifactNames": [
                "tp1-gin-demo"
            ],
            "customOpsStepNames": [
                "envTestRobot",
            ],
            "customStepNames": [
                "testRobot",
            ],
            "customStepAvailables": [
                "testRobot",
            ],
            "customStepAvailableEnvs": [
                "envTestRobot",
            ],
            "customStepEnableModes": [
                {
                    "value": "",
                    "text": "手动模式",
                },
                {
                    "value": "build",
                    "text": "关联构建模块",
                },
            ],
            "customStepEnableModeEnvs": [
                {
                    "value": "",
                    "text": "手动模式",
                },
                {
                    "value": "build",
                    "text": "关联构建模块",
                },
            ],
            "cicdCustomStepInserts": [
                {
                    "build": [
                        "testRobot",
                    ],
                    "xxx": [
                        "xxx",
                    ],
                },
            ],
            "customStepConfs": [
                {
                    "customStepName": "xxx",
                    "customStepActionDesc": "xxx",
                    "customStepDesc": "xxx",
                    "customStepUsage": "xxx",
                    "isEnvDiff": false,
                    "paramInputYamlDef": "xxx",
                    "paramOutputYamlDef": "xxx",
                },
            ],
            "pipelines": [
                {
                    "pipelineName": "test-project1-develop",
                    "branchName": "develop",
                    "envs": [
                        "xxx",
                    ],
                    "envProductions" : [
                        "xxx",
                    ],
                    "pipelineDef": {
                        "isAutoDetectBuild": false,
                        "isQueue": false,
                        "builds": [
                            {
                                "name": "tp1-gin-demo",
                                "run": true
                            },
                        ],
                        "pipelineStep": {
                            "gitPull": {
                                "timeout": 60,
                                "selectTag": false,
                            },
                            "build": {
                                "enable": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "scanCode": {
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "packageImage": {
                                "enable": true,
                                "timeout": 0,
                                "retry": 0,
                                "extraPush": false,
                            },
                            "scanImage": {
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "gateMedium": 5,
                                "gateHigh": 0,
                                "gateCritical": 0
                            },
                            "artifact": {
                                "enable": true,
                                "retry": 0
                            },
                            "syncImage": {
                                "enable": true,
                                "retry": 0
                            },
                            "deploy": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "retry": 0,
                                "forceReplace": false,
                                "archive": false,
                                "try": false
                            },
                            "applyIngress": {
                                "enable": true,
                                "retry": 0,
                            },
                            "applyMesh": {
                                "enable": true,
                                "retry": 0,
                            },
                            "checkDeploy": {
                                "enable": true,
                                "ignoreError": false,
                                "retry": 0,
                                "repeat": 30,
                                "repeatInterval": 5
                            },
                            "checkQuota": {
                                "enable": true,
                                "retry": 0
                            },
                            "deployArtifact": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "timeout": 0,
                                "retry": 0,
                                "archive": false,
                                "try": false
                            },
                            "testApi": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "passingRate": 0
                            },
                            "testPerformance": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0
                            },
                            "testWebui": {
                                "ignoreExecuteModuleNames": ["xxx"],
                                "enable": false,
                                "ignoreError": true,
                                "timeout": 0,
                                "retry": 0,
                                "passingRate": 0
                            },
                            "input": {
                                "enable": false,
                                "isApiOnly": false
                            }
                        },
                        "customStepInsertDefs": {
                            "checkQuota": [
                                {
                                    "customStepName": "xxx",
                                    "enable": true,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "enableInput": false,
                                    "isApiOnly": false,
                                    "enableInputFinish": false,
                                    "isApiOnlyFinish": false
                                },
                                {
                                    "customStepName": "yyy",
                                    "enable": true,
                                    "ignoreError": true,
                                    "timeout": 0,
                                    "retry": 0,
                                    "enableInput": false,
                                    "isApiOnly": false,
                                    "enableInputFinish": false,
                                    "isApiOnlyFinish": false
                                }
                            ],
                        }
                    },
                    "errMsgPipelineDef": "xxx",
                }
            ],
            "projectAvailableEnvs": [
                {
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
                    "pvcNames": [
                        "test-project1-pv-pvc",
                    ],
                    "hostnames": [
                        "test-project1-hosts1",
                    ],
                    "deployArtifactDefs": [
                        {
                            "deployArtifactName": "tp1-gin-demo",
                            "relatedArtifact": "tp1-gin-demo",
                            "hosts": "group_demo",
                            "variables": {
                                "backup_dir": "/backup",
                                "base_dir": "/app",
                                "service_port": "8000"
                            },
                            "tasks": "# 创建应用目录\n- name: \"create {{ project_name }} directory\"\n"
                        }
                    ],
                    "deployContainerDefs": [
                        {
                            "deployName": "tp1a-gin-demo",
                            "relatedPackage": "tp1a-gin-demo",
                            "deployImageTag": "",
                            "deployLabels": null,
                            "deployType": "statefulset",
                            "deployHeadless": true,
                            "podManagementPolicy": "Parallel",
                            "deployMeta": {
                                "labels": [
                                    {
                                        "name": "xx1",
                                        "value": "yy1"
                                    }
                                ],
                                "annotations": null
                            },
                            "deploySessionAffinityTimeoutSeconds": 10,
                            "deployNodePorts": [
                                {
                                    "port": 8000,
                                    "nodePort": 30123,
                                    "protocol": "HTTP"
                                }
                            ],
                            "deployLocalPorts": null,
                            "deployReplicas": 1,
                            "hpaConfig": {
                                "maxReplicas": 2,
                                "memoryAverageValue": "100Mi",
                                "memoryAverageRequestPercent": 0,
                                "cpuAverageValue": "100m",
                                "cpuAverageRequestPercent": 0
                            },
                            "deployEnvs": null,
                            "deployCommand": "sh -c \"./tp1a-gin-demo 2>&1 | sed \\\"s/^/[$(hostname)] /\\\" | tee -a /tp1a-gin-demo/logs/tp1a-gin-demo.logs\"",
                            "deployCmds": null,
                            "deployArgs": null,
                            "deployResources": {
                                "memoryRequest": "10Mi",
                                "cpuRequest": "0.02",
                                "memoryLimit": "100Mi",
                                "cpuLimit": "0.1",
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
                                    "pathInPod": "/tp1a-gin-demo/logs",
                                    "pathInPv": "tp1a-gin-demo/logs",
                                    "pvc": ""
                                }
                            ],
                            "deployHealthCheck": {
                                "checkPort": 0,
                                "exec": "",
                                "execCmds": null,
                                "httpGet": {
                                    "path": "/",
                                    "port": 8000,
                                    "httpHeaders": null,
                                    "scheme": ""
                                },
                                "readinessDelaySeconds": 15,
                                "readinessPeriodSeconds": 5,
                                "livenessDelaySeconds": 150,
                                "livenessPeriodSeconds": 30,
                                "startupDelaySeconds": 0,
                                "startupPeriodSeconds": 0
                            },
                            "dependServices": null,
                            "hostAliases": null,
                            "securityContext": {
                                "runAsUser": 0,
                                "runAsGroup": 0
                            },
                            "deployConfigSettings": [
                                {
                                    "localPath": "xxx",
                                    "pvcName": "xxx",
                                    "podPath": "xxx"
                                }
                            ],
                            "deployConfigMaps": [
                                {
                                    "name": "xxx",
                                    "fromFileType": "xxx",
                                    "paths": [
                                        "xxx"
                                    ]
                                }
                            ],
                            "deploySecrets": [
                                {
                                    "name": "xxx",
                                    "secretType": "xxx",
                                    "fromFileType": "xxx",
                                    "paths": [
                                        "xxx"
                                    ],
                                    "dockerConfig": "xxx",
                                    "cert": "xxx",
                                    "key": "xxx",
                                }
                            ],
                            "lifecycle": {
                                "postStart": {
                                    "exec": "",
                                    "execCmds": null,
                                    "httpGet": {
                                        "path": "",
                                        "port": 0,
                                        "httpHeaders": null,
                                        "scheme": ""
                                    }
                                },
                                "preStop": {
                                    "exec": "",
                                    "execCmds": null,
                                    "httpGet": {
                                        "path": "",
                                        "port": 0,
                                        "httpHeaders": null,
                                        "scheme": ""
                                    }
                                }
                            },
                            "workingDir": "",
                            "nodeSelector": null,
                            "nodeName": "",
                            "terminationGracePeriodSeconds": 0,
                            "subdomain": "",
                            "enableDownwardApi": false,
                            "patches": null,
                        }
                    ],
                    "customStepDefs": {
                        "xxx": {
                            "enableMode": "build",
                            "customStepModuleDefs": [
                                {
                                    "moduleName": "tp1-go-demo",
                                    "relatedStepModules": [
                                        "tp1-go-demo"
                                    ],
                                    "manualEnable": false,
                                    "paramInputYaml": "key: value1",
                                    "checkVarToIgnore": ""
                                },
                                {
                                    "moduleName": "tp1-node-demo",
                                    "relatedStepModules": [
                                        "tp1-node-demo"
                                    ],
                                    "manualEnable": false,
                                    "paramInputYaml": "key: value1",
                                    "checkVarToIgnore": ""
                                }
                            ]
                        }
                    },
                    "deployContainerNames": [
                        "tp1-gin-demo",
                        "tp1-go-demo",
                        "tp1-node-demo",
                        "tp1-python-demo",
                        "tp1-spring-demo"
                    ],
                    "deployArtifactNames": [
                        "tp1-gin-demo"
                    ],
                    "envName": "test",
                    "errMsgCustomStepDefs": {},
                    "errMsgDeployArtifactDefs": "",
                    "errMsgDeployContainerDefs": "",
                    "errMsgIstioDefs": "",
                    "errMsgIstioGatewayDef": "",
                    "istioDefs": [
                        {
                            "deployName": "tp1-go-demo",
                            "port": 8000,
                            "protocol": "http",
                            "httpSettings": {
                                "matchHeaders": [
                                    {
                                        "header": "user-agent",
                                        "matchType": "regex",
                                        "matchValue": ".*Chrome.*"
                                    }
                                ],
                                "gateway": {
                                    "rewriteUri": "",
                                    "matchUris": null,
                                    "matchDefault": true
                                }
                            },
                            "tcpSettings": null,
                            "labelName": "",
                            "localLabelConfig": {
                                "labelDefault": "",
                                "labelNew": ""
                            }
                        },
                    ],
                    "istioGatewayDef": {
                        "enable": true,
                        "hostDefault": "www.test-project1.local",
                        "hostNew": "test.test-project1.local",
                        "sourceSubsetHeader": "xxx",
                        "certSelfSigned": false,
                        "certPath": "",
                        "weightDefault": 0,
                        "weightNew": 0
                    }
                }
            ],
            "projectDef": {
                "buildDefs": [
                    {
                        "buildName": "tp1-gin-demo",
                        "buildPhaseID": 1,
                        "buildDesc": "gin演示项目",
                        "buildPath": "Codes/Backend/tp1-gin-demo",
                        "buildEnv": "go-1.14",
                        "buildCmds": [
                            "go get -v -insecure github.com/gin-gonic/gin@v1.6.3",
                            "go build"
                        ],
                        "buildChecks": [
                            "ls -alh"
                        ],
                        "sonarExtraSettings": null
                    },
                ],
                "packageDefs": [
                    {
                        "packageName": "tp1-gin-demo",
                        "relatedBuilds": [
                            "tp1-gin-demo"
                        ],
                        "dockerFile": "xxx",
                        "extraPushImages": [
                            {
                                "imagePath": "xxx",
                                "username": "xxx",
                                "password": "xxx",
                            }
                        ],
                    },                    
                ],
                "artifactDefs": [
                    {
                        "artifactName": "tp1-gin-demo",
                        "relatedBuilds": [
                            "tp1-gin-demo"
                        ],
                        "artifacts": [
                            "Codes/Backend/tp1-gin-demo/tp1-gin-demo:tp1-gin-demo/"
                        ]
                    }
                ],
                "customStepDefs": {
                    "xxx": {
                        "enableMode": "build",
                        "customStepModuleDefs": [
                            {
                                "moduleName": "tp1-go-demo",
                                "relatedStepModules": [
                                    "tp1-go-demo"
                                ],
                                "manualEnable": false,
                                "paramInputYaml": "key: value1",
                                "checkVarToIgnore": ""
                            },
                            {
                                "moduleName": "tp1-node-demo",
                                "relatedStepModules": [
                                    "tp1-node-demo"
                                ],
                                "manualEnable": false,
                                "paramInputYaml": "key: value1",
                                "checkVarToIgnore": ""
                            }
                        ]
                    }
                },
                "customOpsDefs": [
                    {
                        "customOpsName": "tp1-temp-a",
                        "customOpsDesc": "temp-a ops action",
                        "customOpsSteps": [
                            "testRobot"
                        ]
                    },
                    {
                        "customOpsName": "tp1-temp-b",
                        "customOpsDesc": "temp-b ops action",
                        "customOpsSteps": [
                            "envTestRobot",
                            "scanCode"
                        ]
                    }
                ],
                "opsBatchDefs": [
                    {
                        "opsBatchName": "tp1-temp-a",
                        "opsBatchDesc": "temp-a ops action",
                        "batches": [
                            "xxx"
                        ]
                    }
                ],
                "errMsgPackageDefs": "",
                "errMsgArtifactDefs": "",
                "errMsgCustomStepDefs": {
                    "xxx": "xxx customStep errmsg",
                },
                "errMsgCustomOpsDefs": "",
                "errMsgOpsBatchDefs": "",
                "dockerIgnoreDefs": [
                    "**/node_modules",
                    "**/*@tmp"
                ]
            },
            "tenantCode": "xxx",
            "projectInfo": {
                "projectName" : "test-project1",
                "projectNamespace" : "test-project1",
                "projectShortName" : "tp1",
                "shortName" : "tp1",
                "projectDesc" : "测试-项目1",
                "projectTeam" : "测试团队1",
                "projectArch" : "amd64",
            }
        }
    }
}
```

#### [GET] api/cicd/projectDef/:projectName/demo cicd获取演示定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get demo def success",
    "duration": "35.831µs",
    "data": {
        "buildDefs": [
            {
                "desc": "xxx",
                "buildName": "tp1-gin-demo",
                "buildPhaseID": 1,
                "buildDesc": "gin演示项目",
                "buildPath": "Codes/Backend/tp1-gin-demo",
                "buildEnv": "go-1.14",
                "buildCmds": [
                    "go get -v -insecure github.com/gin-gonic/gin@v1.6.3",
                    "go build"
                ],
                "buildChecks": [
                    "ls -alh"
                ],
                "sonarExtraSettings": null
            },
        ],
        "packageDefs": [
            {
                "desc": "xxx",
                "packageName": "tp1-gin-demo",
                "relatedBuilds": [
                    "tp1-gin-demo"
                ],
                "dockerFile": "xxx",
                "extraPushImages": [
                    {
                        "imagePath": "xxx",
                        "username": "xxx",
                        "password": "xxx",
                    }
                ],
            },                    
        ],
        "artifactDefs": [
            {
                "desc": "xxx",
                "artifactName": "tp1-gin-demo",
                "relatedBuilds": [
                    "tp1-gin-demo"
                ],
                "artifacts": [
                    "Codes/Backend/tp1-gin-demo/tp1-gin-demo:tp1-gin-demo/"
                ]
            }
        ],
        "deployContainerDefs": [
            {
                "desc": "xxx",
                "deployName": "tp1a-gin-demo",
                "relatedPackage": "tp1a-gin-demo",
                "deployImageTag": "",
                "deployLabels": null,
                "deployType": "statefulset",
                "deployHeadless": true,
                "podManagementPolicy": "Parallel",
                "deployMeta": {
                    "labels": [
                        {
                            "name": "xx1",
                            "value": "yy1"
                        }
                    ],
                    "annotations": null
                },
                "deploySessionAffinityTimeoutSeconds": 10,
                "deployNodePorts": [
                    {
                        "port": 8000,
                        "nodePort": 30123,
                        "protocol": "HTTP"
                    }
                ],
                "deployLocalPorts": null,
                "deployReplicas": 1,
                "hpaConfig": {
                    "maxReplicas": 2,
                    "memoryAverageValue": "100Mi",
                    "memoryAverageRequestPercent": 0,
                    "cpuAverageValue": "100m",
                    "cpuAverageRequestPercent": 0
                },
                "deployEnvs": null,
                "deployCommand": "sh -c \"./tp1a-gin-demo 2>&1 | sed \\\"s/^/[$(hostname)] /\\\" | tee -a /tp1a-gin-demo/logs/tp1a-gin-demo.logs\"",
                "deployCmds": null,
                "deployArgs": null,
                "deployResources": {
                    "memoryRequest": "10Mi",
                    "cpuRequest": "0.02",
                    "memoryLimit": "100Mi",
                    "cpuLimit": "0.1",
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
                        "pathInPod": "/tp1a-gin-demo/logs",
                        "pathInPv": "tp1a-gin-demo/logs",
                        "pvc": ""
                    }
                ],
                "deployHealthCheck": {
                    "checkPort": 0,
                    "exec": "",
                    "execCmds": null,
                    "httpGet": {
                        "path": "/",
                        "port": 8000,
                        "httpHeaders": null,
                        "scheme": ""
                    },
                    "readinessDelaySeconds": 15,
                    "readinessPeriodSeconds": 5,
                    "livenessDelaySeconds": 150,
                    "livenessPeriodSeconds": 30,
                    "startupDelaySeconds": 0,
                    "startupPeriodSeconds": 0
                },
                "dependServices": null,
                "hostAliases": null,
                "securityContext": {
                    "runAsUser": 0,
                    "runAsGroup": 0
                },
                "deployConfigSettings": [
                    {
                        "localPath": "xxx",
                        "pvcName": "xxx",
                        "podPath": "xxx"
                    }
                ],
                "deployConfigMaps": [
                    {
                        "name": "xxx",
                        "fromFileType": "xxx",
                        "paths": [
                            "xxx"
                        ]
                    }
                ],
                "deploySecrets": [
                    {
                        "name": "xxx",
                        "secretType": "xxx",
                        "fromFileType": "xxx",
                        "paths": [
                            "xxx"
                        ],
                        "dockerConfig": "xxx",
                        "cert": "xxx",
                        "key": "xxx",
                    }
                ],                
                "lifecycle": {
                    "postStart": {
                        "exec": "",
                        "execCmds": null,
                        "httpGet": {
                            "path": "",
                            "port": 0,
                            "httpHeaders": null,
                            "scheme": ""
                        }
                    },
                    "preStop": {
                        "exec": "",
                        "execCmds": null,
                        "httpGet": {
                            "path": "",
                            "port": 0,
                            "httpHeaders": null,
                            "scheme": ""
                        }
                    }
                },
                "workingDir": "",
                "nodeSelector": null,
                "nodeName": "",
                "terminationGracePeriodSeconds": 0,
                "subdomain": "",
                "enableDownwardApi": false,
                "patches": null,
            }
        ],
        "deployArtifactDefs": [
            {
                "desc": "xxx",
                "deployArtifactName": "tp1-gin-demo",
                "relatedArtifact": "tp1-gin-demo",
                "hosts": "group_demo",
                "variables": {
                    "backup_dir": "/backup",
                    "base_dir": "/app",
                    "service_port": "8000"
                },
                "tasks": "# 创建应用目录\n- name: \"create {{ project_name }} directory\"\n"
            }
        ],
    }
}
```

#### [POST] api/cicd/projectDef/:projectName/buildDefs cicd更新模块构建定义接口

- request请求内容
```json
{
    "buildDefsYaml": "xxx",
    "comment": "xxx",
}
```

- buildDefsYaml yaml格式
- 定义项目各个模块如何进行编译构建

```yaml
  # 构建模块名称*
- buildName: tp1-spring-demo
  # 构建步骤ID*
  # ++ 相同的构建步骤ID表示并行构建，必须大于0
  # @@ 下拉选择： 1 - 10
  buildPhaseID: 1
  # 构建模块代码路径*
  # ++ 构建模块在代码仓库中的相对路径
  buildPath: Codes/Backend/tp1-spring-demo
  # 模块构建环境*
  # @@ 下拉选择，从buildEnvs中获取
  buildEnv: maven-jdk14
  # 模块构建命令*
  buildCmds:
  - mvn clean package
  # 模块构建结果验证命令*
  buildChecks:
  - ls -al target/
  # 代码目录下需要缓存的子目录路径
  buildCaches:
  - node_modules
  # 代码目录扫描额外参数设置
  # ++ 假如有额外需要特殊设置的sonar-project.properties扫描参数请提供
  # ++ 扫描参数参见: https://docs.sonarqube.org/latest/analysis/analysis-parameters/
  sonarExtraSettings:
  - "sonar.junit.reportsPath=target/surefire-reports"
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/packageDefs cicd更新模块容器打包定义接口

- request请求内容
```json
{
    "packageDefsYaml": "xxx",
    "comment": "xxx",
}
```

- packageDefsYaml yaml格式
- 定义项目各个模块编译构建出来的程序包如何打包成容器镜像

```yaml
  # 镜像打包模块名称*
- packageName: tp1-spring-demo
  # 来源构建模块*
  # ++ 镜像打包模块的制品来源于哪些构建模块
  # @@ 下拉选择，多选，从buildNames中获取
  relatedBuilds:
  - tp1-spring-demo
  # Dockerfile* 
  # ++ 请填写dockerfile内容，支持流水线变量
  dockerFile: XXX
  # 把镜像推送到额外的镜像仓库设置
  # ++ 需要把制作的镜像推送到其他镜像仓库情况下需要设置
  extraPushImages:
  # 镜像路径名称
  # ++ 请不要包含镜像标签
  # ++ 格式例如：your.harbor.local:5000/your-path/your-image
  - imagePath: your.harbor.local:5000/your-path/your-image
    # 镜像仓库用户名
    username: xxx
    # 镜像仓库密码
    password: yyy
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/artifactDefs cicd更新模块制品打包定义接口

- request请求内容
```json
{
    "artifactDefsYaml": "xxx",
    "comment": "xxx",
}
```

- artifactDefsYaml yaml格式
- 定义项目各个模块编译构建出来的程序包如何打包成制品压缩包

```yaml
  # 制品打包模块名称*
- artifactName: tp1-app-demo
  # 来源构建模块*
  # ++ 制品打包模块的制品来源于哪些构建模块
  # @@ 下拉选择，多选，从buildNames中获取
  relatedBuilds:
  - tp1-spring-demo
  # 制品路径*
  # ++ 需要把哪些文件复制到制品压缩包，格式为"${源文件路径}:${目标路径}"，源文件路径为相对路径，目标路径为压缩包中的相对路径
  # @@ 两个输入框 源文件路径 目标路径，检查路径开头不能包含/
  artifacts:
  - Codes/Backend/tp1-gin-demo/tp1-gin-demo:tp1-gin-demo/

```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/dockerIgnoreDefs cicd更新容器打包忽略定义接口

- request请求内容
```json
{
    "dockerIgnoreDefsYaml": "xxx",
    "comment": "xxx",
}
```

- dockerIgnoreDefsYaml yaml格式
- 定义项目执行docker镜像打包的时候忽略哪些项目仓库下的哪些目录

```yaml
  # docker打包忽略目录设置
  # ++ docker打包会扫描仓库的所有目录，假如项目仓库的文件太多会导致打包扫描过程太慢。如果需要提高打包速度，请设置忽略目录设置
  # ++ "/abc*" 代表根目录（上下文环境目录中）中以abc开头的任意直接子目录或者直接子文件将被忽略，如/abc  abc.txt
  # ++ "*/abc*" 代表根目录（上下文环境目录中）中任意直接子目录中以abc开头的任意直接子目录或者直接子文件将被忽略，如 /file/abc  /file/abc.txt
  # ++ "*/*/abc*" 代表根目录（上下文环境目录中）中任意两级目录下以abc开头的任意直接子目录或者直接子文件将被忽略，如 /file1/file2/abc  /file1/file2/abc.txt
  # ++ "**/abc*" **匹配任意数量目录（包括零）的特殊通配符字符串，如 /a/b/abc.txt /c/abc.md /a/b/c/abcde
  # ++ "temp?" 排除根目录中的文件和目录，其名称是单字符扩展名temp，如 /tempa /tempb
- "/abc*"
- "*/abc*"
- "*/*/abc*"

```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/deployContainerDefs cicd更新模块容器发布定义接口

- request请求内容
```json
{
    "deployContainerDefsYaml": "xxx",
    "envName": "xxx",
    "comment": "xxx",
}
```

- deployContainerDefsYaml yaml格式
- 定义项目各个模块打包出来的容器镜像如何发布到kubernetes环境

```yaml
  # 容器发布模块名称*
- deployName: tp1-spring-demo
  # 来源镜像打包模块*
  # ++ 容器发布模块的制品来源于哪些镜像打包模块
  # @@ 下拉选择，从packageNames中获取
  relatedPackage: tp1-spring-demo
  # 部署方式*
  # ++ 容器发布模块的部署方式
  # @@ 下拉选择 deployment statefulset job cronjob
  deployType: deployment
  # 替换镜像路径
  deployImagePath: xxxx
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
  # 把代码中的配置文件保存成kubernetes的configmap
  deployConfigMaps:
    # configmap的名字*
  - name: tp1-configmap1
    # 来源的文件类型*
    # ++ from-file: 来源于文件，把整个文件保存到configmap
    # ++ from-env-file: 来源于环境变量文件，环境变量文件内容格式为"key=value"，把环境变量文件中的变量名和变量值以键值对形式保存到configmap
    # @@ 下拉选择 from-file from-env-file
    # @@ 默认 from-file
    fromFileType: from-file
    # 文件所在代码目录相对路径*
    # ++ 支持多个文件，必须填写文件，不能填写目录
    paths:
    - Codes/Backend/tp1-gin-demo/config/a.env
  # 把代码中的配置文件保存成kubernetes的secret
  deploySecrets:
    # secret的名字*
  - name: tp1-secret1
    # secret类型*
    # ++ generic: 普通密钥，把整个文件的内容做成secret
    # ++ docker-registry: 把~/.docker/config.json的内容做成secret
    # ++ tls: 制作tls证书类型的secret
    # @@ 下拉选择 generic docker-registry tls
    # @@ 默认 generic
    secretType: generic
    # 来源的文件类型
    # ++ from-file: 来源于文件，把整个文件保存到secret
    # ++ from-env-file: 来源于环境变量文件，环境变量文件内容格式为"key=value"，把环境变量文件中的变量名和变量值以键值对形式保存到secret
    # @@ 下拉选择 from-file from-env-file
    # @@ 默认 from-file
    fromFileType: from-file
    # 文件所在代码目录相对路径
    # ++ 支持多个文件，必须填写文件，不能填写目录
    paths:
    - Codes/Backend/tp1-gin-demo/config/a.env
    # docker的客户端设置文件所在代码目录相对路径
    dockerConfig: Codes/Backend/tp1-gin-demo/config/config.json
    # tls.crt证书文件所在代码目录相对路径
    cert: Codes/Backend/tp1-gin-demo/config/tls.crt
    # tls.key证书文件所在代码目录相对路径
    key: Codes/Backend/tp1-gin-demo/config/tls.key
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
  # 重启策略
  # ++ Always: 非运行状态下一直重启（默认）
  # ++ OnFailure: 异常情况下重启
  # ++ Never: 不重启
  # @@ 下拉选择 Always OnFailure Never
  restartPolicy: Always
  # 任务设置
  # ++ deployType 为 job 或者 cronjob 情况下需要填写
  job:
    # 成功执行多少个子任务表示成功*
    # ++ 默认为1，必须大于1
    completions: 1
    # 可以并行执行多少个子任务*
    # ++ 默认为1，必须大于1
    parallelism: 1
    # 子任务的编号模式
    # ++ NonIndexed: 子任务随机编号，子任务以随机顺序执行（默认）
    # ++ Indexed: 子任务顺序编号，子任务以编号顺序执行
    # @@ 下拉选择 NonIndexed Indexed
    completionMode: NonIndexed
    # 子任务允许失败多少次
    # ++ 默认不设置为6
    backoffLimit: 6
    # 允许任务执行多长时间，单位秒
    # ++ 超过设置时长就会自动结束整个任务
    # ++ 不设置表示不限制时长
    activeDeadlineSeconds: 10
    # 任务结束后多长时间自动删除子任务的容器，单位秒
    # ++ 超过设置时长就会自动删除子任务的容器
    # ++ 不设置表示不自动删除子任务的容器
    ttlSecondsAfterFinished: 10
  # 计划任务设置
  # ++ deployType 为 cronjob 情况下需要填写
  cronJob:
    # 计划任务*
    # 必须遵循crontab的格式
    # 例如: 5 5 * * *
    schedule: "*/5 5 * * *"
    # 计划任务创建的任务执行时发生重叠如何处理
    # ++ Allow: 允许并发任务执行（默认）
    # ++ Forbid: 不允许并发任务执行；如果新任务的执行时间到了而老任务没有执行完，计划任务会忽略新任务的执行
    # ++ Replace: 如果新任务的执行时间到了而老任务没有执行完，计划任务会用新任务替换当前正在运行的任务
    # @@ 下拉选择 Allow Forbid Replace
    concurrencyPolicy: Allow
    # 任务延迟开始的最后期限，单位秒
    # ++ 任务如果由于某种原因错过了调度时间，开始该任务的截止时间的秒数
    # ++ 不设置表示假如超过截止时间，计划任务不会开始该任务的实例
    startingDeadlineSeconds: 10
    # 保留多少已成功的任务
    # ++ 默认为3，设置为0表示不保留
    successfulJobsHistoryLimit: 10
    # 保留多少已失败的任务
    # ++ 默认为1，设置为0表示不保留
    failedJobsHistoryLimit: 10
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
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/deployContainerDefs/view cicd查看模块容器发布定义生成效果接口

- request请求内容
```json
{
    "deployContainerDefsYaml": "xxx",
    "envName": "xxx",
}
```

- deployContainerDefsYaml yaml格式
- 定义项目各个模块打包出来的容器镜像如何发布到kubernetes环境

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "deployments": [
            {
                "moduleName": "tp1-gin-demo",
                "deployYaml": "xxx",
                "serviceYaml": "xxx",
                "hpaYaml": "xxx",
                "ingressYaml": ""
            },
        ]
    }
}
```

#### [POST] api/cicd/projectDef/:projectName/deployArtifactDefs cicd更新模块制品发布定义接口

- request请求内容
```json
{
    "deployArtifactDefsYaml": "xxx",
    "comment": "xxx",
}
```

- deployArtifactDefsYaml yaml格式
- 定义项目各个模块打包出来的制品压缩包如何发布到主机环境

```yaml
  # 制品发布模块名称*
- deployArtifactName: tp1-gin-demo
  # 来源制品打包模块*
  # ++ 制品发布模块的制品来源于哪些制品打包模块
  # @@ 下拉选择，从artifactNames中获取
  relatedArtifact: tp1-gin-demo
  # 模块要部署到哪些主机上*
  # ++ 对应项目环境的主机设置的groups分组，支持部署到主机分组的多台主机上。
  # @@ 下拉选择，从hostnames中获取
  hosts: group_demo
  # 模块部署相关变量
  # ++ 在进行该模块部署的时候，可以使用以下变量进行模块部署
  # ++ 变量名格式例如: backup_dir, service_port
  # ++ 默认包含内置变量:
  # ++ project_name（项目名字，本项目的唯一标识）
  # ++ module_name（模块名字，对应deployArtifactName）
  # ++ pipeline_name（流水线名字，对应pipelineName）
  # ++ run_name（本次运行名字，对应runName）
  # ++ run_number（本次运行编号，对应runNumber）
  # ++ branch_name（分支名字，对应branchName）
  # ++ env_name（本次发布环境名字，对应envName）
  # ++ latest_commit（本次运行最新代码commit，对应latestCommit）
  # ++ tag_name（本次运行对应的代码tag标签，对应tagName）
  # @@ 每个变量分两个输入框：变量名，变量值
  variables:
    backup_dir: /backup
    base_dir: /app
    service_port: 8000
  # 该模块部署的ansible-playbook的tasks部署任务*
  # ++ playbook的task详细参考: https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html
  # ++ 注意，模块的制品会自动下载在当前目录，名字为 {{ module_name }}.tar.gz
  # @@ 为手工输入的多行文本
  tasks: |
    # 创建应用目录
    - name: "create {{ project_name }} directory"
        file:
        path: "{{ base_dir }}/{{ project_name }}/"
        state: directory
        mode: '0755'
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/istioDefs cicd更新模块服务网格定义接口

- request请求内容
```json
{
    "istioDefsYaml": "xxx",
    "comment": "xxx",
}
```

- istioDefsYaml yaml格式
- 定义项目各个容器发布模块服务网格的发布策略

```yaml
# 启用服务网格的容器部署模块名*
# @@ 下拉选择，来源于deployContainerNames
- deployName: tp1-go-demo
  # 对应的服务端口*
  # ++ 设置服务网格对应的服务端口
  # ++ 注意：必须与容器发布模块定义的服务端口保持一致
  port: 8000
  # 对应的服务端口协议类型*
  # ++ 注意：必须与容器发布模块定义的服务端口协议保持一致
  # @@ 下拉选择， http tcp
  protocol: http
  # http服务网格设置
  # @@ 当protocol设置为http的时候显示以下配置
  httpSettings:
    # http头匹配规则
    # ++ 需要启用AB测试的情况下请设置，当header符合哪些规则情况下流量切换到新版本
    # ++ 例如，当header包含user-agent字段，并且值包含Chrome的情况下，切换到新版本流量
    matchHeaders:
      # header的名字*
    - header: user-agent
      # header匹配规则*
      # @@ 下拉选择：exact（等于）prefix（前缀）regex（正则式）
      matchType: regex
      # header的匹配值*
      matchValue: '.*Chrome.*'

    # 从gateway进入的流量设置
    # ++ 如果本服务需要在集群外部通过域名来访问，那么需要填写gateway设置
    # @@ rewriteUri / matchUris / matchDefault 三选一填写，matchDefault设置为true表示该项为已填写
    gateway:
      # 访问本服务的uri重写规则
      # ++ 通过域名请求这个uri，会通过rewrite方式路由到本服务
      # ++ 当访问 http://${域名}/${rewriteUri}/xxx 的时候，将会路由到本服务的/xxx这个uri
      rewriteUri: /openapi
      # 访问本服务的uri规则
      # ++ 通过域名请求该规则uri的情况下，会路由到本服务
      # ++ 例如matchType为exact模式，当访问 http://${域名}/${matchValue} 的时候，将会路由到本服务的 / 这个uri
      # ++ 例如matchType为prefix模式，当访问 http://${域名}/${matchValue}/xxx 的时候，将会路由到本服务的 /xxx 这个uri
      matchUris:
        # uri匹配规则*
        # @@ 下拉选择：exact（等于）prefix（前缀）regex（正则式）
      - matchType: prefix
        # uri的匹配值*
        matchValue: /status
      # 是否默认gateway路由
      # ++ 设置是的情况下，访问gateway域名会默认指向该服务
      # ++ 当请求的uri不匹配上边的 rewriteUri 和 matchUris 规则情况下，将会路由到本服务
      # ++ 注意，一个项目必须有且只有一个服务是默认服务
      matchDefault: true

    #######################################################
    # 请求超时时长
    # ++ 超过此时间的请求将会直接返回超时错误
    # ++ 格式m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
    timeout: 5s
    # 重试设置
    # ++ 设置在特定情况下重新发起请求
    retries:
      # 重试条件
      # ++ 支持以下重试条件
      # ++ 5xx: 返回5XX状态码的情况下重试
      # ++ gateway-error: 状态码为502,503,504的情况下重试
      # ++ reset: 无响应的情况下重试
      # ++ connect-failure: 连接失败的情况下重试
      # ++ refused-stream: 拒绝连接的情况下重试
      # @@ 下拉选择，多选
      retryOn: gateway-error,connect-failure,refused-stream
      # 重试次数*
      attempts: 3
      # 重试的超时时长
      # ++ 格式m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
      perTryTimeout: 2s
    # 流量镜像设置
    # ++ 把发送到本服务的流量镜像到其他目标服务上
    mirror:
      # 目标服务地址*
      host: httpbin
      # 目标服务端口*
      port: 9000
      # 目标服务的子集
      subset: v2
      # 镜像比例
      # ++ 不填写表示全部流量都进行镜像
      # @@ 0 -100
      mirrorPercent: 50
    # CORS跨域资源共享策略设置
    corsPolicy:
      # 允许的来源域名规则
      allowOrigins:
      # 表达式
      # ++ exact: 等于
      # ++ prefix: 前缀
      # ++ regex: 正则式
      # @@ 两个表单： 匹配方式（下拉选择框） 匹配值（输入框）
      - exact: https://example.com
      # 允许的http请求方法
      # @@ 下拉选择，多选 GET POST PUT PATCH DELETE HEAD OPTIONS
      allowMethods:
      - POST
      - GET
      # 是否允许使用证书
      allowCredentials: false
      # 允许的headers
      allowHeaders:
      - X-Foo-Bar
      # 允许对外暴露的headers
      exposeHeaders:
      - X-Foo-Bar
      # 有效期
      # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
      maxAge: "24h"
    # 负载均衡设置
    loadBalancer:
      # 负载均衡算法
      # ROUND_ROBIN: 轮询，默认
      # LEAST_CONN: 最少连接优先
      # RANDOM: 随机
      # @@ simple 和 consistentHash 只能选一个设置
      simple: ROUND_ROBIN
      # HASH连接保持算法
      # ++ 通过hash方式对流量中的特定信息进行hash，hash一致的流量会保持连接相同的后端服务
      # @@ simple 和 consistentHash 只能选一个设置
      # @@ httpHeaderName httpCookie useSourceIp httpQueryParameterName 只能选一个设置
      consistentHash:
        # httpHeader名字
        # ++ 对httpHeader名字进行hash
        httpHeaderName: "xxx"
        # http cookie
        # ++ 对httpCookie进行hash
        httpCookie: 
          # cookie名字*
          name: xxx
          # cookie路径
          path: xxx
          # 有效期*
          # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
          ttl: 2s
        # 来源ip
        # ++ 对来源ip进行hash
        useSourceIp: true
        # http请求参数
        # ++ 对http请求参数进行hash
        httpQueryParameterName: xxx
    # 连接池设置
    connectionPool:
      # http连接池设置
      http:
        # http并发请求最大值
        http1MaxPendingRequests: 1
        # http2并发请求最大值
        http2MaxRequests: 1
        # 每个http连接最多多少个请求
        maxRequestsPerConnection: 1
        # http最大重试次数
        maxRetries: 1
        # 空闲多长时间释放连接
        # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
        idleTimeout: 2s
      # tcp连接池设置
      tcp:
        # tcp最大连接数
        maxConnections: 10
        # tcp连接超时时长
        # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
        connectTimeout: 2s
    # 熔断设置
    # ++ 当请求目标服务端点出现异常情况下，把该目标服务端点驱逐为不可访问，直到服务端点恢复正常
    outlierDetection:
      # 当出现gateway错误次数
      # ++ 出现多少次错误的情况下熔断
      consecutiveGatewayErrors: 2
      # 当出现5XX状态码错误次数
      # ++ 出现多少次错误的情况下熔断
      consecutive5xxErrors: 2
      # 熔断分析时间间隔
      # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
      # ++ 默认10s
      interval: 10s
      # 最小驱逐时长
      # ++ 格式h表示小时、m表示分钟、s表示秒钟、ms表示毫秒，例如10ms
      # ++ 默认30s
      baseEjectionTime: 10s
      # 最大驱逐百分比
      # ++ 最多驱逐百分之多少的目标服务端点
      # ++ 默认10
      # @@ 0 -100
      maxEjectionPercent: 50
      # 最少健康百分比
      # ++ 保证至少百分之多少的目标服务端点为健康状态
      # @@ 0 -100
      minHealthPercent: 50
    #######################################################


  # tcp服务网格设置
  # @@ 当protocol设置为tcp的时候显示以下配置
  tcpSettings:
    # 来源服务名称*
    # ++ 网格内的哪些服务会访问本服务
    # @@ 下拉选择，来源于deployContainerNames
    sourceServiceNames: 
    - tp1-go-demo
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/istioGatewayDef cicd更新服务网格网关定义接口

- request请求内容
```json
{
    "istioGatewayDefYaml": "xxx",
    "comment": "xxx",
}
```

- istioGatewayDefYaml yaml格式
- 定义项目模块服务网格的入口域名

```yaml
# 是否启用服务网格*
# ++ 假如设置启用服务网格，请设置所有服务网格参数
enable: true
# 默认版本域名
# ++ 默认版本，用于蓝绿发布的默认流量
# @ 假如enable为true，必须填写
hostDefault: www.test-project1.local
# 新版本域名
# ++ 新版本，用于蓝绿发布的新版本流量
# @ 假如enable为true，必须填写
hostNew: test.test-project1.local
# 微服务中需要进行透传的http header名字
# ++ 假如需要启用多个微服务之间的灰度发布，微服务需要进行改造
# ++ gateway进入的新版本流量的时候，服务网格自动给这个名字的header设置值为new
# ++ 微服务被请求的时候，如果还要请求别的微服务，请把这个名字的header作为请求别的微服务时候的请求header
# @ 假如enable为true，必须填写
sourceSubsetHeader: x-dory-source-subset
# 是否自动创建自签名证书
# ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
certSelfSigned: false
# 代码仓库中的证书路径
# ++ 设置使用https方式访问ingress域名，启用domainName和pathPrefix情况下有效
# ++ 假如不启用自动创建自签名证书，需要设置代码仓库中证书和私钥的路径，证书和私钥文件的名字为tls.crt和tls.key
# ++ 流水线会自动把 <certPath>/test 目录下的tls.crt和tls.key证书保存到test环境的secret中
# ++ 代码仓库中的证书路径不能以/结尾
certPath: xxx/yyy
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/pipelineDef cicd更新流水线定义接口

- request请求内容
```json
{
    "pipelineDefYaml": "xxx",
    "branchName": "develop",
    "comment": "xxx",
}
```

- pipelineDefYaml yaml格式
- 定义项目流水线的开关设置

```yaml
# 是否开启构建模块自动检测
# ++ 假如开启，cicd流水线将会根据代码提交内容自动检测对应构建模块的代码路径中是否有代码文件发生变更，自动设置本次流水线开启哪些构建模块
# ++ 如果本设置开启，那么cicd流水线自动忽略以下builds(构建模块开关设置)的设置
isAutoDetectBuild: false
# 是否串行执行
# ++ 假如开启，同时只能执行一条流水线，其他流水线将会以队列的形式等待执行
isQueue: false
# 构建模块开关设置*
# ++ 设置哪些模块需要构建，如果模块需要构建，请设置run为true；如果模块不需要构建，请设置run为false
builds:
  # 构建模块名称*
  # @@ 只读，来源于cicd获取流水线定义接口，不能修改
- name: tp1-spring-demo
  # 是否执行构建*
  run: true
# 流水线步骤开关设置*
# ++ 需要开启的步骤设置为true，需要关闭的步骤设置为false
pipelineStep:
  # 拉取代码
  gitPull:
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 是否需要选择tag进行后续集成
    selectTag: false
  # 编译构建代码
  build:
    # 是否启用
    # ++ 假如禁用，那么所有后续步骤都不执行
    enable: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 代码扫描
  scanCode:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 容器镜像打包上传
  packageImage:
    # 是否启用
    # ++ 假如禁用，那么后续scanImage、deploy等步骤都不执行
    enable: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 是否推送到额外的镜像仓库
    # ++ 模块镜像打包定义中设置了要把镜像推送到其他镜像仓库情况下才有效
    extraPush: false
  # 容器镜像扫描
  scanImage:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 中风险漏洞门禁数量
    # ++ 超过该数量则镜像扫描失败
    gateMedium: 5
    # 高风险漏洞门禁数量
    # ++ 超过该数量则镜像扫描失败
    gateHigh: 0
    # 关键风险漏洞门禁数量
    # ++ 超过该数量则镜像扫描失败
    gateCritical: 0
  # 制品打包上传
  artifact:
    # 是否启用
    # ++ 假如禁用，那么后续deployArtifact步骤都不执行
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 同步生产环境镜像到集成环境
  syncImage:
    # 是否启用
    # ++ 只有发布到生产环境的流水线需要设置，假如开启那么发布到集成环境的时候，会把生产环境所有应用的镜像同步到集成环境
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 容器应用部署
  deploy:
    # 是否启用
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 强制替换资源
    # ++ 执行kubectl apply的时候是否强制先delete资源再apply资源
    forceReplace: false
    # 是否把部署文件归档到nexus
    archive: true
    # 是否只校验部署设置，但不进行实际部署
    try: false
    # 忽略执行的模块名，只要模块名中包含设置的字符串就会忽略执行
    ignoreExecuteModuleNames: ["xxx"]
  # 部署ingress
  applyIngress:
    # 是否启用
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 服务网格设置
  applyMesh:
    # 是否启用
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 容器应用状态检查
  checkDeploy:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 检查次数设置
    # ++ 检查次数，0表示使用默认设置
    repeat: 60
    # 检查间隔设置
    # ++ 0表示使用默认设置，单位:秒
    repeatInterval: 5
  # 项目容器资源配额检查
  checkQuota:
    # 是否启用
    enable: true
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
  # 主机应用部署
  deployArtifact:
    # 是否启用
    enable: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 是否把部署文件归档到nexus
    archive: true
    # 是否只校验部署设置，但不进行实际部署
    try: false
    # 忽略执行的模块名，只要模块名中包含设置的字符串就会忽略执行
    ignoreExecuteModuleNames: ["xxx"]
  # 接口自动化测试
  testApi:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 通过率门禁
    passingRate: 100
    # 忽略执行的模块名，只要模块名中包含设置的字符串就会忽略执行
    ignoreExecuteModuleNames: ["xxx"]
  # 性能自动化测试
  testPerformance:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 忽略执行的模块名，只要模块名中包含设置的字符串就会忽略执行
    ignoreExecuteModuleNames: ["xxx"]
  # 界面自动化测试
  testWebui:
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 通过率门禁
    passingRate: 100
    # 忽略执行的模块名，只要模块名中包含设置的字符串就会忽略执行
    ignoreExecuteModuleNames: ["xxx"]
  # 等待输入
  input:
    # 是否启用
    enable: true
    # 只能通过API输入
    isApiOnly: true
# cicd流水线在哪些步骤后边执行自定义步骤设置
customStepInsertDefs:
  # 内置步骤名称
  scanCode:
    # 插入的步骤名称
    # @@ 下拉选择，多选，数据来源于cicdCustomStepInserts.xxx
    # @@ 注意，步骤有先后顺序
    customStepName: xxx
    # 是否启用
    enable: true
    # 异常是否继续执行
    ignoreError: true
    # 超时设置
    # ++ 0表示不限时，单位:秒
    timeout: 60
    # 重试设置
    # ++ 执行异常的情况下重试次数
    retry: 0
    # 等待输入后执行
    enableInput: false
    # 只能通过API输入
    isApiOnly: false
    # 等待输入后继续执行后续步骤
    enableInputFinish: false
    # 只能通过API输入，继续执行后续步骤
    isApiOnlyFinish: false
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [PUT] api/cicd/projectDef/:projectName/pipelineDef cicd复制流水线定义到其他分支接口

- request请求内容
```json
{
    "pipelineDefYaml": "xxx",
    "branchNames": [
        "develop",
    ],
    "comment": "xxx",
}
```

- pipelineDefYaml yaml格式参见 cicd更新流水线定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/cicd/projectDef/:projectName/:branchName/pipelineDef cicd获取流水线定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get pipelineDef success",
    "duration": "21.64µs",
    "data": {
        "buildNames": [
            "tp1-gin-demo",
            "tp1-go-demo",
            "tp1-gradle-demo",
            "tp1-node-demo",
            "tp1-python-demo",
            "tp1-spring-demo"
        ],
        "pipelineDef": {
            "isAutoDetectBuild": false,
            "isQueue": false,
            "builds": [
                {
                    "name": "tp1-gin-demo",
                    "run": true
                },
            ],
            "pipelineStep": {
                "gitPull": {
                    "timeout": 60,
                    "selectTag": false,
                },
                "build": {
                    "enable": true,
                    "timeout": 0,
                    "retry": 0
                },
                "scanCode": {
                    "enable": false,
                    "ignoreError": true,
                    "timeout": 0,
                    "retry": 0
                },
                "packageImage": {
                    "enable": true,
                    "timeout": 0,
                    "retry": 0,
                    "extraPush": false,
                },
                "scanImage": {
                    "enable": false,
                    "ignoreError": true,
                    "timeout": 0,
                    "retry": 0,
                    "gateMedium": 5,
                    "gateHigh": 0,
                    "gateCritical": 0
                },
                "artifact": {
                    "enable": true,
                    "retry": 0
                },
                "syncImage": {
                    "enable": true,
                    "retry": 0
                },
                "deploy": {
                    "ignoreExecuteModuleNames": ["xxx"],
                    "enable": false,
                    "retry": 0,
                    "forceReplace": false,
                    "archive": false,
                    "try": false
                },
                "applyIngress": {
                    "enable": true,
                    "retry": 0,
                },
                "applyMesh": {
                    "enable": true,
                    "retry": 0,
                },
                "checkDeploy": {
                    "enable": true,
                    "ignoreError": false,
                    "retry": 0,
                    "repeat": 30,
                    "repeatInterval": 5
                },
                "checkQuota": {
                    "enable": true,
                    "retry": 0
                },
                "deployArtifact": {
                    "ignoreExecuteModuleNames": ["xxx"],
                    "enable": false,
                    "timeout": 0,
                    "retry": 0,
                    "archive": false,
                    "try": false
                },
                "testApi": {
                    "ignoreExecuteModuleNames": ["xxx"],
                    "enable": false,
                    "ignoreError": true,
                    "timeout": 0,
                    "retry": 0,
                    "passingRate": 0
                },
                "testPerformance": {
                    "ignoreExecuteModuleNames": ["xxx"],
                    "enable": false,
                    "ignoreError": true,
                    "timeout": 0,
                    "retry": 0
                },
                "testWebui": {
                    "ignoreExecuteModuleNames": ["xxx"],
                    "enable": false,
                    "ignoreError": true,
                    "timeout": 0,
                    "retry": 0,
                    "passingRate": 0
                },
                "input": {
                    "enable": false,
                    "isApiOnly": false
                }
            },
            "customStepInsertDefs": {
                "checkQuota": [
                    {
                        "customStepName": "xxx",
                        "enable": true,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0,
                        "enableInput": false,
                        "isApiOnly": false,
                        "enableInputFinish": false,
                        "isApiOnlyFinish": false
                    },
                    {
                        "customStepName": "yyy",
                        "enable": true,
                        "ignoreError": true,
                        "timeout": 0,
                        "retry": 0,
                        "enableInput": false,
                        "isApiOnly": false,
                        "enableInputFinish": false,
                        "isApiOnlyFinish": false
                    }
                ],
            }
        },
        "errMsgPipelineDef": "xxx",
    }
}
```

#### [PUT] api/cicd/projectDef/:projectName/deployContainerDefs cicd复制模块容器发布定义到其他环境接口

- request请求内容
```json
{
    "deployContainerDefsYaml": "xxx",
    "envNames": [
        "test",
    ],
    "comment": "xxx",
}
```

- deployContainerDefsYaml yaml格式参见 cicd更新模块容器发布定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [PUT] api/cicd/projectDef/:projectName/deployArtifactDefs cicd复制模块制品发布定义到其他环境接口

- request请求内容
```json
{
    "deployArtifactDefsYaml": "xxx",
    "envNames": [
        "test",
    ],
    "comment": "xxx",
}
```

- deployArtifactDefsYaml yaml格式参见 cicd更新模块制品发布定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [PUT] api/cicd/projectDef/:projectName/istioDefs cicd复制模块服务网格定义到其他环境接口

- request请求内容
```json
{
    "istioDefsYaml": "xxx",
    "envNames": [
        "test",
    ],
    "comment": "xxx",
}
```

- istioDefsYaml yaml格式参见 cicd更新模块服务网格定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/customStepDef cicd更新自定义步骤模块定义接口

- request请求内容
```json
{
    "customStepName": "xxx",
    "customStepDefYaml": "xxx",
    "comment": "xxx",
}
```

- customStepName 自定义步骤名
  - 来源于customStepAvailables字段
  - 步骤说明来源于来源于customStepConfs.customStepDesc
  - 步骤使用说明来源于customStepConfs.customStepUsage
  - 步骤输出参数说明来源于customStepConfs.paramOutputYamlDef
- customStepDefYaml yaml格式
- 设置自定义步骤各个模块的配置

```yaml
# 自定义步骤的启用模式
# ++ 手动模式必须设置manualEnable表示是否启用本模块
# ++ 选择其他模式表示对应的内置模块被设置为启用的时候，本自定义步骤模块为启用。自动模式必须设置relatedStepModules，支持设置多个模块，任何一个设置的模块被设置为启用，那么本模块则设置为启用
# @@ 下拉列表，来源于customStepEnableModes字段
# @@ 当选择为空的时候，customStepModuleDefs的所有模块显示manualEnable配置项
# @@ 当选择build、package、artifact的时候，显示relatedStepModules下拉选择项，数据分别来源于buildNames、packageNames、artifactNames
enableMode: "build"
# 自定义步骤的模块设置*
customStepModuleDefs:
  # 模块名称*
  # 例如: tp1-test-app
- moduleName:
  # 相关启用的步骤模块*
  # ++ 支持设置多个模块，任何一个设置的模块被设置为启用，那么本模块则设置为启用
  # @@ 下拉选择，多选
  # @@ 假如enableMode不为空，必须填写本表单。
  # @@ 假如enableMode=build，列表选项来源于buildNames
  # @@ 假如enableMode=package，列表选项来源于packageNames
  # @@ 假如enableMode=artifact，列表选项来源于artifactNames
  relatedStepModules:
  - tp1-go-demo
  - tp1-spring-demo
  # 手动启用模式
  # ++ 手工设置本模块是否启用
  # @@ 假如enableMode为空，显示本表单
  # @@ 下拉选择，启用、禁用
  manualEnable: false
  # 模块输入参数
  # ++ 自定义步骤的输入参数设置以及参数说明信息，使用yaml格式
  # ++ 设置该模块特定的步骤执行参数
  # ++ 该输入参数将会以文件的形式挂装到步骤执行容器的/tmp/dory-param-input.json或者.yaml文件，步骤执行容器可以读取该输入参数，进行相应的步骤处理
  # @@ 默认内容来源于customStepConfs.paramInputYamlDef的内容
  paramInputYaml: xxx
  # 通过流水线变量忽略步骤执行
  # ++ 该自定义步骤在启用的情况才有效
  # ++ 支持流水线变量，当流水线变量的go template模板解析结果为'true'，则不执行本自定义步骤
  # ++ 为空表示不忽略步骤执行
  # ++ 例如: {{ if eq (where . `previousSteps.#(stepAction=="deploy")#.#(moduleName=="tp1-gin-demo").result` `string`) "SUCCESS" }}true{{ end }}
  checkVarToIgnore: ""
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/customStepDef/env cicd更新环境自定义步骤模块定义接口

- request请求内容
```json
{
    "customStepName": "xxx",
    "envName": "test",
    "customStepDefYaml": "xxx",
    "comment": "xxx",
}
```

- customStepName 自定义步骤名
  - 来源于customStepAvailableEnvs字段
  - 步骤说明来源于来源于customStepConfs.customStepDesc
  - 步骤使用说明来源于customStepConfs.customStepUsage
  - 步骤输出参数说明来源于customStepConfs.paramOutputYamlDef
- customStepDefYaml yaml格式
- 设置自定义步骤各个模块的配置

```yaml
# 自定义步骤的启用模式
# 选择为空表示手动模式，手动模式必须设置manualEnable表示是否启用本模块
# 选择其他模式表示对应的内置模块被设置为启用的时候，本自定义步骤模块为启用。自动模式必须设置relatedStepModules，支持设置多个模块，任何一个设置的模块被设置为启用，那么本模块则设置为启用
# @@ 来源于customStepEnableModeEnvs字段
# @@ 当选择为空的时候，customStepModuleDefs的所有模块显示manualEnable配置项
# @@ 当选择build、package、artifact的时候，显示relatedStepModules下拉选择项，数据分别来源于buildNames、packageNames、artifactNames
# @@ 当选择deploy、deployArtifact的时候，显示relatedStepModules下拉选择项，数据分别来源于projectAvailableEnvs.deployContainerNames、projectAvailableEnvs.deployArtifactNames
enableMode: "build"
# 自定义步骤的模块设置*
customStepModuleDefs:
  # 模块名称*
  # 例如：tp1-test-app
- moduleName:
  # 相关启用的步骤模块*
  # ++ 支持设置多个模块，任何一个设置的模块被设置为启用，那么本模块则设置为启用
  # @@ 下拉选择，多选
  # @@ 假如enableMode不为空，必须填写本表单。
  # @@ 假如enableMode=build，列表选项来源于buildNames
  # @@ 假如enableMode=package，列表选项来源于packageNames
  # @@ 假如enableMode=artifact，列表选项来源于artifactNames
  # @@ 假如enableMode=deploy，列表选项来源于projectAvailableEnvs.deployContainerNames
  # @@ 假如enableMode=deployArtifact，列表选项来源于projectAvailableEnvs.deployArtifactNames
  relatedStepModules:
  - tp1-go-demo
  - tp1-spring-demo
  # 手动启用模式
  # ++ 手工设置本模块是否启用
  # @@ 假如enableMode为空，显示本表单
  # @@ 下拉选择，启用、禁用
  manualEnable: false
  # 模块输入参数
  # ++ 自定义步骤的输入参数设置以及参数说明信息，使用yaml格式
  # ++ 设置该模块特定的步骤执行参数
  # ++ 该输入参数将会以文件的形式挂装到步骤执行容器的/tmp/dory-param-input.json或者.yaml文件，步骤执行容器可以读取该输入参数，进行相应的步骤处理
  # @@ 默认内容来源于customStepConfs.paramInputYamlDef的内容
  paramInputYaml: xxx
  # 通过流水线变量忽略步骤执行
  # ++ 该自定义步骤在启用的情况才有效
  # ++ 支持流水线变量，当流水线变量的go template模板解析结果为'true'，则不执行本自定义步骤
  # ++ 为空表示不忽略步骤执行
  # ++ 例如: {{ if eq (where . `previousSteps.#(stepAction=="scanImage")(moduleName=="tp1-gin-demo").result` `string`) "FAIL" }}true{{ end }}
  checkVarToIgnore: ""
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [PUT] api/cicd/projectDef/:projectName/customStepDef/env cicd复制环境自定义步骤模块定义到其他环境接口

- request请求内容
```json
{
    "customStepName": "xxx",
    "customStepDefYaml": "xxx",
    "envNames": [
        "test",
    ],
    "comment": "xxx",
}
```

- customStepDefYaml yaml格式参见 cicd更新环境自定义步骤模块定义接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/customOpsDefs cicd更新自定义ops流水线定义接口


- request请求内容
```json
{
    "customOpsDefsYaml": "xxx",
    "comment": "xxx",
}
```

- customOpsDefsYaml yaml格式
- 用户可以自己定义ops流水线的批处理操作，在批处理中可以执行多个步骤。

```yaml
  # 自定义ops流水线批处理名称*
  # ++ 例如: tp1-run-all-test
- customOpsName: tp1-run-all-test
  # 自定义ops流水线批处理说明*
  # ++ 可以使用中文填写流水线的批处理说明
  # ++ 批处理说明会出现在ops流水线的操作选择菜单中
  # ++ 例如: 运行所有自动化测试
  customOpsDesc: 运行所有自动化测试
  # 批处理执行的步骤*
  # ++ 请注意批处理执行步骤的顺序
  # @@ 下拉选择，多选，从customOpsStepNames获取选择数据
  # @@ 注意，批处理执行步骤是有顺序的
  customOpsSteps:
  - scanCode
  - testApi
  - testPerformance
  - testWebui
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/opsBatchDefs cicd更新自定义ops批处理定义接口


- request请求内容
```json
{
    "opsBatchDefsYaml": "xxx",
    "comment": "xxx",
}
```

- opsBatchDefsYaml yaml格式
- 用户可以自己定义ops流水线的批处理操作，在批处理中可以执行多个步骤。

```yaml
  # 自定义ops流水线批处理名称*
  # ++ 例如: tp1-run-all-test
- opsBatchName: tp1-run-all-test
  # 自定义ops流水线批处理说明*
  # ++ 可以使用中文填写流水线的批处理说明
  # ++ 批处理说明会出现在ops流水线的操作选择菜单中
  # ++ 例如: 运行所有自动化测试
  opsBatchDesc: 运行所有自动化测试
  # 批处理执行的步骤*
  # ++ 请注意批处理执行步骤的顺序
  # @@ 下拉选择，多选，从opsBatchStepNames获取选择数据
  # @@ 注意，批处理执行步骤是有顺序的
  batches:
  - xxx
```

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/cicd/projectDef/:projectName/history cicd获取项目定义历史记录列表接口

- request请求内容
```json
{
    "defName": "xxx",
    "branchName": "xxx",
    "envName": "xxx",
    "customStepName": "xxx",
    "createTimeRange": {
        "startDate": "2021-02-01",
        "endDate": "2021-02-02"
    },
}
```

- defName必填，以下选项: 
	- buildDefs
	- packageDefs
	- artifactDefs
	- dockerIgnoreDefs
	- deployContainerDefs
	- deployArtifactDefs
	- istioDefs
	- istioGatewayDef
	- pipelineDef
	- customOpsDefs
	- opsBatchDefs
	- customStepDefs

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get projectDef customOpsDefs history success",
    "duration": "11.288336ms",
    "data": {
        "logs": [
            {
                "commitHash": "2a1f80d4019b000ffcfe725783b09d4d1972c771",
                "email": "devops-admin@139.com",
                "message": "devops-admin update customOpsDefs.yaml at 07-31 07:54",
                "name": "DEVOPS-管理员",
                "when": "07-31 19:54:54"
            }
        ]
    }
}
```

#### [POST] api/cicd/projectDef/:projectName/content cicd获取项目定义历史内容接口

- request请求内容
```json
{
    "defName": "xxx",
    "branchName": "xxx",
    "envName": "xxx",
    "customStepName": "xxx",
    "commitHash": "xxx",
}
```

- defName必填，以下选项: 
	- buildDefs
	- packageDefs
	- artifactDefs
	- dockerIgnoreDefs
	- deployContainerDefs
	- deployArtifactDefs
	- istioDefs
	- istioGatewayDef
	- pipelineDef
	- customOpsDefs
	- opsBatchDefs
	- customStepDefs

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get projectDef customOpsDefs history success",
    "duration": "11.288336ms",
    "data": {
        "content": "xxx",
    }
}
```


#### [GET] api/cicd/customStepConf/vars cicd自定义步骤配置变量说明接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "content": "xxx",
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```

#### [GET] api/cicd/trigger/vars cicd触发器变量说明接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "content": "xxx",
        "auditID": "xxx",
        "withAdminLog": true,
    }
}
```
