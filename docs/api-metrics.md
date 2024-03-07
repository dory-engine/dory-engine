# api/metrics接口文档

## 目录

- [api/metrics接口文档](#apimetrics接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [metrics 度量统计相关接口](#metrics-度量统计相关接口)
      - [\[GET\] api/metrics/runs/options 流水线执行统计选项查询接口](#get-apimetricsrunsoptions-流水线执行统计选项查询接口)
      - [\[GET\] api/metrics/steps/options 步骤执行统计选项查询接口](#get-apimetricsstepsoptions-步骤执行统计选项查询接口)
      - [\[GET\] api/metrics/builds/options 构建执行统计选项查询接口](#get-apimetricsbuildsoptions-构建执行统计选项查询接口)
      - [\[GET\] api/metrics/scanCodes/options 代码扫描执行统计选项查询接口](#get-apimetricsscancodesoptions-代码扫描执行统计选项查询接口)
      - [\[GET\] api/metrics/scanImages/options 镜像扫描执行统计选项查询接口](#get-apimetricsscanimagesoptions-镜像扫描执行统计选项查询接口)
      - [\[GET\] api/metrics/packages/options 镜像打包执行统计选项查询接口](#get-apimetricspackagesoptions-镜像打包执行统计选项查询接口)
      - [\[GET\] api/metrics/artifacts/options 制品打包执行统计选项查询接口](#get-apimetricsartifactsoptions-制品打包执行统计选项查询接口)
      - [\[GET\] api/metrics/deploys/options 容器发布执行统计选项查询接口](#get-apimetricsdeploysoptions-容器发布执行统计选项查询接口)
      - [\[GET\] api/metrics/deployArtifacts/options 制品发布执行统计选项查询接口](#get-apimetricsdeployartifactsoptions-制品发布执行统计选项查询接口)
      - [\[GET\] api/metrics/checkDeploys/options 容器检查执行统计选项查询接口](#get-apimetricscheckdeploysoptions-容器检查执行统计选项查询接口)
      - [\[GET\] api/metrics/checkQuotas/options 配额检查执行统计选项查询接口](#get-apimetricscheckquotasoptions-配额检查执行统计选项查询接口)
      - [\[GET\] api/metrics/tests/options 自动测试执行统计选项查询接口](#get-apimetricstestsoptions-自动测试执行统计选项查询接口)
      - [\[GET\] api/metrics/customSteps/options 自定义步骤执行统计选项查询接口](#get-apimetricscustomstepsoptions-自定义步骤执行统计选项查询接口)
      - [\[GET\] api/metrics/commits/options commit提交统计选项查询接口](#get-apimetricscommitsoptions-commit提交统计选项查询接口)
      - [\[GET\] api/metrics/auditLogs/options 审计日志统计选项查询接口](#get-apimetricsauditlogsoptions-审计日志统计选项查询接口)
      - [统计输出接口](#统计输出接口)
        - [\[POST\] api/metrics/runs/fix 流水线红灯修复平均时长统计接口](#post-apimetricsrunsfix-流水线红灯修复平均时长统计接口)
        - [\[POST\] api/metrics/runs/count 流水线执行次数统计接口](#post-apimetricsrunscount-流水线执行次数统计接口)
        - [\[POST\] api/metrics/runs/duration 流水线执行平均时长统计接口](#post-apimetricsrunsduration-流水线执行平均时长统计接口)
        - [\[POST\] api/metrics/runs/countWeekly 流水线执行次数周环比统计接口](#post-apimetricsrunscountweekly-流水线执行次数周环比统计接口)
        - [\[POST\] api/metrics/runs/status/:statusResult 流水线执行状态比率统计接口](#post-apimetricsrunsstatusstatusresult-流水线执行状态比率统计接口)
        - [\[POST\] api/metrics/steps/count 步骤执行次数统计接口](#post-apimetricsstepscount-步骤执行次数统计接口)
        - [\[POST\] api/metrics/steps/duration 步骤执行平均时长统计接口](#post-apimetricsstepsduration-步骤执行平均时长统计接口)
        - [\[POST\] api/metrics/steps/countWeekly 步骤执行次数周环比统计接口](#post-apimetricsstepscountweekly-步骤执行次数周环比统计接口)
        - [\[POST\] api/metrics/steps/status/:statusResult 步骤执行状态比率统计接口](#post-apimetricsstepsstatusstatusresult-步骤执行状态比率统计接口)
        - [\[POST\] api/metrics/builds/count 构建执行次数统计接口](#post-apimetricsbuildscount-构建执行次数统计接口)
        - [\[POST\] api/metrics/builds/duration 构建执行平均时长统计接口](#post-apimetricsbuildsduration-构建执行平均时长统计接口)
        - [\[POST\] api/metrics/builds/countWeekly 构建执行次数周环比统计接口](#post-apimetricsbuildscountweekly-构建执行次数周环比统计接口)
        - [\[POST\] api/metrics/builds/status/:statusResult 构建执行状态比率统计接口](#post-apimetricsbuildsstatusstatusresult-构建执行状态比率统计接口)
        - [\[POST\] api/metrics/scanCodes/count 代码扫描执行次数统计接口](#post-apimetricsscancodescount-代码扫描执行次数统计接口)
        - [\[POST\] api/metrics/scanCodes/duration 代码扫描执行平均时长统计接口](#post-apimetricsscancodesduration-代码扫描执行平均时长统计接口)
        - [\[POST\] api/metrics/scanCodes/countWeekly 代码扫描执行次数周环比统计接口](#post-apimetricsscancodescountweekly-代码扫描执行次数周环比统计接口)
        - [\[POST\] api/metrics/scanCodes/status/:statusResult 代码扫描执行状态比率统计接口](#post-apimetricsscancodesstatusstatusresult-代码扫描执行状态比率统计接口)
        - [\[POST\] api/metrics/scanImages/vulsTotal 镜像扫描平均漏洞总数统计接口](#post-apimetricsscanimagesvulstotal-镜像扫描平均漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/vulsUnknown 镜像扫描平均未知漏洞总数统计接口](#post-apimetricsscanimagesvulsunknown-镜像扫描平均未知漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/vulsLow 镜像扫描平均低级漏洞总数统计接口](#post-apimetricsscanimagesvulslow-镜像扫描平均低级漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/vulsMedium 镜像扫描平均中级漏洞总数统计接口](#post-apimetricsscanimagesvulsmedium-镜像扫描平均中级漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/vulsHigh 镜像扫描平均高级漏洞总数统计接口](#post-apimetricsscanimagesvulshigh-镜像扫描平均高级漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/vulsCritical 镜像扫描平均关键漏洞总数统计接口](#post-apimetricsscanimagesvulscritical-镜像扫描平均关键漏洞总数统计接口)
        - [\[POST\] api/metrics/scanImages/count 镜像扫描执行次数统计接口](#post-apimetricsscanimagescount-镜像扫描执行次数统计接口)
        - [\[POST\] api/metrics/scanImages/duration 镜像扫描执行平均时长统计接口](#post-apimetricsscanimagesduration-镜像扫描执行平均时长统计接口)
        - [\[POST\] api/metrics/scanImages/countWeekly 镜像扫描执行次数周环比统计接口](#post-apimetricsscanimagescountweekly-镜像扫描执行次数周环比统计接口)
        - [\[POST\] api/metrics/scanImages/status/:statusResult 镜像扫描执行状态比率统计接口](#post-apimetricsscanimagesstatusstatusresult-镜像扫描执行状态比率统计接口)
        - [\[POST\] api/metrics/packages/size 镜像打包平均尺寸统计接口](#post-apimetricspackagessize-镜像打包平均尺寸统计接口)
        - [\[POST\] api/metrics/packages/sizeTotal 镜像打包总尺寸统计接口](#post-apimetricspackagessizetotal-镜像打包总尺寸统计接口)
        - [\[POST\] api/metrics/packages/count 镜像打包执行次数统计接口](#post-apimetricspackagescount-镜像打包执行次数统计接口)
        - [\[POST\] api/metrics/packages/duration 镜像打包执行平均时长统计接口](#post-apimetricspackagesduration-镜像打包执行平均时长统计接口)
        - [\[POST\] api/metrics/packages/countWeekly 镜像打包执行次数周环比统计接口](#post-apimetricspackagescountweekly-镜像打包执行次数周环比统计接口)
        - [\[POST\] api/metrics/packages/status/:statusResult 镜像打包执行状态比率统计接口](#post-apimetricspackagesstatusstatusresult-镜像打包执行状态比率统计接口)
        - [\[POST\] api/metrics/artifacts/size 制品打包平均尺寸统计接口](#post-apimetricsartifactssize-制品打包平均尺寸统计接口)
        - [\[POST\] api/metrics/artifacts/sizeTotal 制品打包总尺寸统计接口](#post-apimetricsartifactssizetotal-制品打包总尺寸统计接口)
        - [\[POST\] api/metrics/artifacts/count 制品打包执行次数统计接口](#post-apimetricsartifactscount-制品打包执行次数统计接口)
        - [\[POST\] api/metrics/artifacts/duration 制品打包执行平均时长统计接口](#post-apimetricsartifactsduration-制品打包执行平均时长统计接口)
        - [\[POST\] api/metrics/artifacts/countWeekly 制品打包执行次数周环比统计接口](#post-apimetricsartifactscountweekly-制品打包执行次数周环比统计接口)
        - [\[POST\] api/metrics/artifacts/status/:statusResult 制品打包执行状态比率统计接口](#post-apimetricsartifactsstatusstatusresult-制品打包执行状态比率统计接口)
        - [\[POST\] api/metrics/deploys/count 容器发布执行次数统计接口](#post-apimetricsdeployscount-容器发布执行次数统计接口)
        - [\[POST\] api/metrics/deploys/duration 容器发布执行平均时长统计接口](#post-apimetricsdeploysduration-容器发布执行平均时长统计接口)
        - [\[POST\] api/metrics/deploys/countWeekly 容器发布执行次数周环比统计接口](#post-apimetricsdeployscountweekly-容器发布执行次数周环比统计接口)
        - [\[POST\] api/metrics/deploys/status/:statusResult 容器发布执行状态比率统计接口](#post-apimetricsdeploysstatusstatusresult-容器发布执行状态比率统计接口)
        - [\[POST\] api/metrics/deployArtifacts/count 制品发布执行次数统计接口](#post-apimetricsdeployartifactscount-制品发布执行次数统计接口)
        - [\[POST\] api/metrics/deployArtifacts/duration 制品发布执行平均时长统计接口](#post-apimetricsdeployartifactsduration-制品发布执行平均时长统计接口)
        - [\[POST\] api/metrics/deployArtifacts/countWeekly 制品发布执行次数周环比统计接口](#post-apimetricsdeployartifactscountweekly-制品发布执行次数周环比统计接口)
        - [\[POST\] api/metrics/deployArtifacts/status/:statusResult 制品发布执行状态比率统计接口](#post-apimetricsdeployartifactsstatusstatusresult-制品发布执行状态比率统计接口)
        - [\[POST\] api/metrics/checkDeploys/count 容器检查执行次数统计接口](#post-apimetricscheckdeployscount-容器检查执行次数统计接口)
        - [\[POST\] api/metrics/checkDeploys/duration 容器检查执行平均时长统计接口](#post-apimetricscheckdeploysduration-容器检查执行平均时长统计接口)
        - [\[POST\] api/metrics/checkDeploys/countWeekly 容器检查执行次数周环比统计接口](#post-apimetricscheckdeployscountweekly-容器检查执行次数周环比统计接口)
        - [\[POST\] api/metrics/checkDeploys/status/:statusResult 容器检查执行状态比率统计接口](#post-apimetricscheckdeploysstatusstatusresult-容器检查执行状态比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedMemoryRequest 已使用memoryRequest平均值统计接口](#post-apimetricscheckquotasusedmemoryrequest-已使用memoryrequest平均值统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedMemoryLimit 已使用memoryLimit平均值统计接口](#post-apimetricscheckquotasusedmemorylimit-已使用memorylimit平均值统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedCpuRequest 已使用cpuRequest平均值统计接口](#post-apimetricscheckquotasusedcpurequest-已使用cpurequest平均值统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedCpuLimit 已使用cpuLimit平均值统计接口](#post-apimetricscheckquotasusedcpulimit-已使用cpulimit平均值统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedPods 已使用pods平均值统计接口](#post-apimetricscheckquotasusedpods-已使用pods平均值统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedMemoryRequestRate 已使用memoryRequest比率统计接口](#post-apimetricscheckquotasusedmemoryrequestrate-已使用memoryrequest比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedMemoryLimitRate 已使用memoryLimit比率统计接口](#post-apimetricscheckquotasusedmemorylimitrate-已使用memorylimit比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedCpuRequestRate 已使用cpuRequest比率统计接口](#post-apimetricscheckquotasusedcpurequestrate-已使用cpurequest比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedCpuLimitRate 已使用cpuLimit比率统计接口](#post-apimetricscheckquotasusedcpulimitrate-已使用cpulimit比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/usedPodsRate 已使用pods比率统计接口](#post-apimetricscheckquotasusedpodsrate-已使用pods比率统计接口)
        - [\[POST\] api/metrics/checkQuotas/count 资源配额检查执行次数统计接口](#post-apimetricscheckquotascount-资源配额检查执行次数统计接口)
        - [\[POST\] api/metrics/checkQuotas/duration 资源配额检查执行平均时长统计接口](#post-apimetricscheckquotasduration-资源配额检查执行平均时长统计接口)
        - [\[POST\] api/metrics/checkQuotas/countWeekly 资源配额检查执行次数周环比统计接口](#post-apimetricscheckquotascountweekly-资源配额检查执行次数周环比统计接口)
        - [\[POST\] api/metrics/checkQuotas/status/:statusResult 资源配额检查执行状态比率统计接口](#post-apimetricscheckquotasstatusstatusresult-资源配额检查执行状态比率统计接口)
        - [\[POST\] api/metrics/tests/testTotal 自动测试平均测试用例总数统计接口](#post-apimetricsteststesttotal-自动测试平均测试用例总数统计接口)
        - [\[POST\] api/metrics/tests/testPass 自动测试平均测试用例通过总数统计接口](#post-apimetricsteststestpass-自动测试平均测试用例通过总数统计接口)
        - [\[POST\] api/metrics/tests/testFail 自动测试平均测试用例失败总数统计接口](#post-apimetricsteststestfail-自动测试平均测试用例失败总数统计接口)
        - [\[POST\] api/metrics/tests/testSkip 自动测试平均测试用例忽略总数统计接口](#post-apimetricsteststestskip-自动测试平均测试用例忽略总数统计接口)
        - [\[POST\] api/metrics/tests/count 自动测试执行次数统计接口](#post-apimetricstestscount-自动测试执行次数统计接口)
        - [\[POST\] api/metrics/tests/duration 自动测试执行平均时长统计接口](#post-apimetricstestsduration-自动测试执行平均时长统计接口)
        - [\[POST\] api/metrics/tests/countWeekly 自动测试执行次数周环比统计接口](#post-apimetricstestscountweekly-自动测试执行次数周环比统计接口)
        - [\[POST\] api/metrics/tests/status/:statusResult 自动测试执行状态比率统计接口](#post-apimetricstestsstatusstatusresult-自动测试执行状态比率统计接口)
        - [\[POST\] api/metrics/customSteps/count 自定义步骤执行次数统计接口](#post-apimetricscustomstepscount-自定义步骤执行次数统计接口)
        - [\[POST\] api/metrics/customSteps/duration 自定义步骤执行平均时长统计接口](#post-apimetricscustomstepsduration-自定义步骤执行平均时长统计接口)
        - [\[POST\] api/metrics/customSteps/countWeekly 自定义步骤执行次数周环比统计接口](#post-apimetricscustomstepscountweekly-自定义步骤执行次数周环比统计接口)
        - [\[POST\] api/metrics/customSteps/status/:statusResult 自定义步骤执行状态比率统计接口](#post-apimetricscustomstepsstatusstatusresult-自定义步骤执行状态比率统计接口)
        - [\[POST\] api/metrics/commits/count commit提交次数统计接口](#post-apimetricscommitscount-commit提交次数统计接口)
        - [\[POST\] api/metrics/commits/countLines commit提交修改代码行数统计接口](#post-apimetricscommitscountlines-commit提交修改代码行数统计接口)
        - [\[POST\] api/metrics/commits/countWeekly commit提交次数周环比统计接口](#post-apimetricscommitscountweekly-commit提交次数周环比统计接口)
        - [\[POST\] api/metrics/commits/countLinesWeekly commit提交修改代码行数周环比统计接口](#post-apimetricscommitscountlinesweekly-commit提交修改代码行数周环比统计接口)
        - [\[POST\] api/metrics/auditLogs/count 审计日志次数统计接口](#post-apimetricsauditlogscount-审计日志次数统计接口)
        - [\[POST\] api/metrics/auditLogs/duration 审计日志平均时长统计接口](#post-apimetricsauditlogsduration-审计日志平均时长统计接口)
        - [\[POST\] api/metrics/auditLogs/countWeekly 审计日志次数周环比统计接口](#post-apimetricsauditlogscountweekly-审计日志次数周环比统计接口)
        - [\[POST\] api/metrics/auditLogs/status/:statusResult 审计日志状态比率统计接口](#post-apimetricsauditlogsstatusstatusresult-审计日志状态比率统计接口)

## api接口

### metrics 度量统计相关接口

- url: api/metrics/
- 需要校验`x-user-token`

#### [GET] api/metrics/runs/options 流水线执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "customStepNames": [
            "testRobot",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "triggerKinds": [
            "manual",
            "webhook",
            "crontab",
        ]
    }
}
```

#### [GET] api/metrics/steps/options 步骤执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "stepActions": [
            "applyMesh",
        ]
    }
}
```

#### [GET] api/metrics/builds/options 构建执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "buildEnvs": [
            "maven-jdk7",
            "maven-jdk8",
        ]
    }
}
```

#### [GET] api/metrics/scanCodes/options 代码扫描执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "scanCodeResults": [
            "NONE",
            "OK"
        ],
    }
}
```

#### [GET] api/metrics/scanImages/options 镜像扫描执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "scanImageResults": [
            "pass"
        ],
    }
}
```

#### [GET] api/metrics/packages/options 镜像打包执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ]
    }
}
```

#### [GET] api/metrics/artifacts/options 制品打包执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
    }
}
```

#### [GET] api/metrics/deploys/options 容器发布执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "isMeshEnables": [
            true,
            false
        ],
    }
}
```

#### [GET] api/metrics/deployArtifacts/options 制品发布执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ]
    }
}
```

#### [GET] api/metrics/checkDeploys/options 容器检查执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "deploymentStatuses": [
            "READY"
        ],
    }
}
```

#### [GET] api/metrics/checkQuotas/options 配额检查执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
    }
}
```

#### [GET] api/metrics/tests/options 自动测试执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "testTypes": [
            "api",
            "performance",
            "webui"
        ]
    }
}
```

#### [GET] api/metrics/customSteps/options 自定义步骤执行统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "customStepNames": [
            "testRobot",
        ]
    }
}
```

#### [GET] api/metrics/commits/options commit提交统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics step options success",
    "duration": "6.078339ms",
    "data": {
        "branchNames": [
            "develop",
        ],
        "envNames": [
            "test",
        ],
        "moduleNames": [
            "dp2-python-demo",
        ],
        "moduleTypes": [
            "build",
        ],
        "pipelineNames": [
            "demo-project1-develop",
        ],
        "projectNames": [
            "demo-project1",
        ],
        "projectTeams": [
            "TP"
        ],
        "projects": [
            {
                "branchNames": [
                    "develop"
                ],
                "envNames": [
                    "test",
                ],
                "moduleNames": [
                    "dp1-go-demo",
                ],
                "pipelineNames": [
                    "demo-project1-develop",
                ],
                "projectName": "demo-project1"
            },
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
            "ABORT"
        ],
        "committerEmails": [
            "devops-admin@139.com"
        ],
        "committerNames": [
            "DEVOPS-管理员"
        ],
    }
}
```

#### [GET] api/metrics/auditLogs/options 审计日志统计选项查询接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics auditLogs options success",
    "duration": "6.078339ms",
    "data": {
        "projectNames": [
            "demo-project1",
        ],
        "statusResults": [
            "SUCCESS",
            "FAIL",
        ],
        "usernames": [
            "xxx"
        ],
        "opTypes": [
            "xxx"
        ],
        "withAdminLogs": [
            true,
            false
        ],
    }
}
```

#### 统计输出接口

- request请求内容，所有统计指标都支持以下搜索参数:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ]
}
```

    - dimension: 维度，所有指标都包括: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支）
    - timeZoom: 统计区间，所有指标一样: year（年） / month（月） / week（周） / day（日：默认） / hour（小时）
    - timeRangeDays: 时间区间，表示最近X天，所有指标一样: 7（最近 7 天：默认） / 14（最近 14 天） / （最近 30 天） / （最近 90 天） / （最近 365 天） / 0（自定义）
    - timeRange: 自定义时间区间，时间轴显示的时间区间，所有指标都有，假如timeRangeDays = 0情况下必须设置。

    - 【注意】dimension中包含哪些维度，就包含哪些过滤条件，例如：dimension中包含projectName，那么过滤条件包含projectNames。过滤条件为多选。

    - projectNames: 过滤项目
    - projectTeams: 过滤团队
    - branchNames: 过滤分支
    - pipelineNames: 过滤流水线

    - 【注意】每个大类指标都有4个接口：
        - [POST] api/metrics/xxx/count 次数统计接口（单位：次数）
        - [POST] api/metrics/xxx/duration 平均时长统计接口（单位：秒）
        - [POST] api/metrics/xxx/countWeekly 次数周环比统计接口（单位：次数）
        - [POST] api/metrics/xxx/status/:statusResult 状态比率统计接口（单位：百分比）

    - 【注意】 packages / artifacts 有size接口：
        - [POST] api/metrics/packages/size 镜像打包尺寸统计接口（单位：M）
        - [POST] api/metrics/artifacts/size 制品打包尺寸统计接口（单位：M）

    - 【注意】所有 `api/metrics/xxx/status/:statusResult` 执行状态比率统计指标，维度（dimension）都没有statusResult，过滤条件都没有statusResults
    - 【注意】所有 `api/metrics/xxx/countWeekly` 步骤执行次数周环比统计指标，没有维度（dimension），timeZoom，只能是 day hour

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get metrics steps count success",
    "duration": "50.809972ms",
    "data": {
        "datasets": {
            "demo-project1": [
                4,
                0,
                5,
                0,
                0,
                0,
                21,
                0
            ],
            "test-project1": [
                91,
                0,
                32,
                0,
                0,
                0,
                11,
                0
            ]
        },
        "labels": [
            "2021-04-06",
            "2021-04-07",
            "2021-04-08",
            "2021-04-09",
            "2021-04-10",
            "2021-04-11",
            "2021-04-12",
            "2021-04-13"
        ]
    }
}
```

- 所有统计指标，输出格式一致

    - labels: 表示统计指标的时间轴
    - datasets: 表示统计指标的数值，支持多个系列的统计值

##### [POST] api/metrics/runs/fix 流水线红灯修复平均时长统计接口

- request请求内容:
```json
{
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ]
}
```

    - 特殊，本统计没有dimension维度。
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线

##### [POST] api/metrics/runs/count 流水线执行次数统计接口
##### [POST] api/metrics/runs/duration 流水线执行平均时长统计接口
##### [POST] api/metrics/runs/countWeekly 流水线执行次数周环比统计接口
##### [POST] api/metrics/runs/status/:statusResult 流水线执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "triggerKinds": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ triggerKind（启动方式）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - pipelineNames: 过滤流水线
      - branchNames: 过滤分支
      - envNames: 过滤环境
      - statusResults: 过滤执行状态
      - triggerKinds: 过滤启动方式

##### [POST] api/metrics/steps/count 步骤执行次数统计接口
##### [POST] api/metrics/steps/duration 步骤执行平均时长统计接口
##### [POST] api/metrics/steps/countWeekly 步骤执行次数周环比统计接口
##### [POST] api/metrics/steps/status/:statusResult 步骤执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleTypes": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "stepActions": [
        "xxx"
    ]
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleType（模块类型）/ moduleName（模块名）/ stepAction（步骤类型）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleTypes: 过滤模块类型
      - moduleNames: 过滤模块名
      - stepActions: 过滤步骤类型

##### [POST] api/metrics/builds/count 构建执行次数统计接口
##### [POST] api/metrics/builds/duration 构建执行平均时长统计接口
##### [POST] api/metrics/builds/countWeekly 构建执行次数周环比统计接口
##### [POST] api/metrics/builds/status/:statusResult 构建执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "buildEnvs": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ buildEnv（构建环境）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - buildEnvs: 过滤构建环境
##### [POST] api/metrics/scanCodes/count 代码扫描执行次数统计接口
##### [POST] api/metrics/scanCodes/duration 代码扫描执行平均时长统计接口
##### [POST] api/metrics/scanCodes/countWeekly 代码扫描执行次数周环比统计接口
##### [POST] api/metrics/scanCodes/status/:statusResult 代码扫描执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "scanCodeResults": [
        "xxx"
    ],
}
```
    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ scanCodeResult（扫描状态）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - scanCodeResults: 过滤扫描状态

##### [POST] api/metrics/scanImages/vulsTotal 镜像扫描平均漏洞总数统计接口
##### [POST] api/metrics/scanImages/vulsUnknown 镜像扫描平均未知漏洞总数统计接口
##### [POST] api/metrics/scanImages/vulsLow 镜像扫描平均低级漏洞总数统计接口
##### [POST] api/metrics/scanImages/vulsMedium 镜像扫描平均中级漏洞总数统计接口
##### [POST] api/metrics/scanImages/vulsHigh 镜像扫描平均高级漏洞总数统计接口
##### [POST] api/metrics/scanImages/vulsCritical 镜像扫描平均关键漏洞总数统计接口
##### [POST] api/metrics/scanImages/count 镜像扫描执行次数统计接口
##### [POST] api/metrics/scanImages/duration 镜像扫描执行平均时长统计接口
##### [POST] api/metrics/scanImages/countWeekly 镜像扫描执行次数周环比统计接口
##### [POST] api/metrics/scanImages/status/:statusResult 镜像扫描执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "scanImageResults": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ scanImageResult（扫描状态）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - scanImageResults: 过滤扫描状态

##### [POST] api/metrics/packages/size 镜像打包平均尺寸统计接口
##### [POST] api/metrics/packages/sizeTotal 镜像打包总尺寸统计接口
##### [POST] api/metrics/packages/count 镜像打包执行次数统计接口
##### [POST] api/metrics/packages/duration 镜像打包执行平均时长统计接口
##### [POST] api/metrics/packages/countWeekly 镜像打包执行次数周环比统计接口
##### [POST] api/metrics/packages/status/:statusResult 镜像打包执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名

##### [POST] api/metrics/artifacts/size 制品打包平均尺寸统计接口
##### [POST] api/metrics/artifacts/sizeTotal 制品打包总尺寸统计接口
##### [POST] api/metrics/artifacts/count 制品打包执行次数统计接口
##### [POST] api/metrics/artifacts/duration 制品打包执行平均时长统计接口
##### [POST] api/metrics/artifacts/countWeekly 制品打包执行次数周环比统计接口
##### [POST] api/metrics/artifacts/status/:statusResult 制品打包执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名

##### [POST] api/metrics/deploys/count 容器发布执行次数统计接口
##### [POST] api/metrics/deploys/duration 容器发布执行平均时长统计接口
##### [POST] api/metrics/deploys/countWeekly 容器发布执行次数周环比统计接口
##### [POST] api/metrics/deploys/status/:statusResult 容器发布执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
    "isMeshEnables": [
        true,
        false
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ envName（环境）/ isMeshEnable（是否网格发布）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - envNames: 过滤环境
      - isMeshEnables: 过滤是否网格发布

##### [POST] api/metrics/deployArtifacts/count 制品发布执行次数统计接口
##### [POST] api/metrics/deployArtifacts/duration 制品发布执行平均时长统计接口
##### [POST] api/metrics/deployArtifacts/countWeekly 制品发布执行次数周环比统计接口
##### [POST] api/metrics/deployArtifacts/status/:statusResult 制品发布执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ envName（环境）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - envNames: 过滤环境

##### [POST] api/metrics/checkDeploys/count 容器检查执行次数统计接口
##### [POST] api/metrics/checkDeploys/duration 容器检查执行平均时长统计接口
##### [POST] api/metrics/checkDeploys/countWeekly 容器检查执行次数周环比统计接口
##### [POST] api/metrics/checkDeploys/status/:statusResult 容器检查执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
    "deploymentStatuses": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ envName（环境）/ deploymentStatus（部署状态）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - envNames: 过滤环境
      - deploymentStatuses: 过滤部署状态

##### [POST] api/metrics/checkQuotas/usedMemoryRequest 已使用memoryRequest平均值统计接口
##### [POST] api/metrics/checkQuotas/usedMemoryLimit 已使用memoryLimit平均值统计接口
##### [POST] api/metrics/checkQuotas/usedCpuRequest 已使用cpuRequest平均值统计接口
##### [POST] api/metrics/checkQuotas/usedCpuLimit 已使用cpuLimit平均值统计接口
##### [POST] api/metrics/checkQuotas/usedPods 已使用pods平均值统计接口
##### [POST] api/metrics/checkQuotas/usedMemoryRequestRate 已使用memoryRequest比率统计接口
##### [POST] api/metrics/checkQuotas/usedMemoryLimitRate 已使用memoryLimit比率统计接口
##### [POST] api/metrics/checkQuotas/usedCpuRequestRate 已使用cpuRequest比率统计接口
##### [POST] api/metrics/checkQuotas/usedCpuLimitRate 已使用cpuLimit比率统计接口
##### [POST] api/metrics/checkQuotas/usedPodsRate 已使用pods比率统计接口
##### [POST] api/metrics/checkQuotas/count 资源配额检查执行次数统计接口
##### [POST] api/metrics/checkQuotas/duration 资源配额检查执行平均时长统计接口
##### [POST] api/metrics/checkQuotas/countWeekly 资源配额检查执行次数周环比统计接口
##### [POST] api/metrics/checkQuotas/status/:statusResult 资源配额检查执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ envName（环境）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - envNames: 过滤环境

##### [POST] api/metrics/tests/testTotal 自动测试平均测试用例总数统计接口
##### [POST] api/metrics/tests/testPass 自动测试平均测试用例通过总数统计接口
##### [POST] api/metrics/tests/testFail 自动测试平均测试用例失败总数统计接口
##### [POST] api/metrics/tests/testSkip 自动测试平均测试用例忽略总数统计接口
##### [POST] api/metrics/tests/count 自动测试执行次数统计接口
##### [POST] api/metrics/tests/duration 自动测试执行平均时长统计接口
##### [POST] api/metrics/tests/countWeekly 自动测试执行次数周环比统计接口
##### [POST] api/metrics/tests/status/:statusResult 自动测试执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
    "testTypes": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ envName（环境）/ testType（测试类型）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - moduleNames: 过滤模块名
      - envNames: 过滤环境
      - testTypes: 过滤测试类型

##### [POST] api/metrics/customSteps/count 自定义步骤执行次数统计接口
##### [POST] api/metrics/customSteps/duration 自定义步骤执行平均时长统计接口
##### [POST] api/metrics/customSteps/countWeekly 自定义步骤执行次数周环比统计接口
##### [POST] api/metrics/customSteps/status/:statusResult 自定义步骤执行状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "pipelineNames": [
        "xxx"
    ],
    "statusResults": [
        "xxx"
    ],
    "envNames": [
        "xxx"
    ],
    "customStepNames": [
        "xxx"
    ],
    "moduleNames": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / pipelineName（流水线）/ statusResult（执行状态）/ moduleName（模块名）/ envName（环境）/ customStepName（自定义步骤类型）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - pipelineNames: 过滤流水线
      - statusResults: 过滤执行状态
      - envNames: 过滤环境
      - customStepNames: 过滤自定义步骤
      - moduleNames: 过滤模块名

##### [POST] api/metrics/commits/count commit提交次数统计接口
##### [POST] api/metrics/commits/countLines commit提交修改代码行数统计接口
##### [POST] api/metrics/commits/countWeekly commit提交次数周环比统计接口
##### [POST] api/metrics/commits/countLinesWeekly commit提交修改代码行数周环比统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "projectTeams": [
        "xxx"
    ],
    "branchNames": [
        "xxx"
    ],
    "committerNames": [
        "xxx"
    ],
    "committerEmails": [
        "xxx"
    ],
}
```

    - 【注意】countLinesWeekly没有维度
    
    - dimension: 维度: all（全部） / projectName（项目） / projectTeam（团队） / branchName（分支） / committerName（提交者）/ committerEmail（提交者邮箱）
    - 过滤条件:
      - projectNames: 过滤项目
      - projectTeams: 过滤团队
      - branchNames: 过滤分支
      - committerNames: 过滤提交者
      - committerEmails: 过滤模提交者邮箱

##### [POST] api/metrics/auditLogs/count 审计日志次数统计接口
##### [POST] api/metrics/auditLogs/duration 审计日志平均时长统计接口
##### [POST] api/metrics/auditLogs/countWeekly 审计日志次数周环比统计接口
##### [POST] api/metrics/auditLogs/status/:statusResult 审计日志状态比率统计接口

- request请求内容:
```json
{
    "dimension": "xxx",
    "timeZoom": "xxx",
    "timeRange": {
        "startDate": "2021-01-01",
        "endDate": "2021-01-01",
    },
    "timeRangeDays": 7,
    "projectNames": [
        "xxx"
    ],
    "usernames": [
        "xxx"
    ],
    "opTypes": [
        "xxx"
    ],
    "withAdminLogs": [
        true,
        false,
    ],
    "statusResults": [
        "xxx"
    ],
}
```

    - dimension: 维度: all（全部） / projectName（项目） / username（用户） / opType（操作类型） / withAdminLog（是否包含管理日志）/ statusResult（执行状态）
    - 过滤条件:
      - projectNames: 过滤项目
      - usernames: 过滤用户
      - opTypes: 过滤操作类型
      - withAdminLogs: 过滤是否包含管理日志
      - statusResults: 过滤执行状态
