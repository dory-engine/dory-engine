# api/public接口文档

## 目录

- [api/public接口文档](#apipublic接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [public 公共无需登录相关接口](#public-公共无需登录相关接口)
      - [\[GET\] api/public/about 获取关于信息接口](#get-apipublicabout-获取关于信息接口)
      - [\[POST\] api/public/login 登录接口](#post-apipubliclogin-登录接口)
      - [\[POST\] api/public/password/forget 忘记密码接口](#post-apipublicpasswordforget-忘记密码接口)
      - [\[POST\] api/public/passwork/token 检查忘记密码resetToken接口](#post-apipublicpassworktoken-检查忘记密码resettoken接口)
      - [\[POST\] api/public/password/reset 重置密码接口](#post-apipublicpasswordreset-重置密码接口)
      - [\[POST\] api/public/webhook/pipeline?token=xxx 通过webhook创建运行接口](#post-apipublicwebhookpipelinetokenxxx-通过webhook创建运行接口)

## api接口

### public 公共无需登录相关接口

- url: api/public/
- 无需校验`x-user-token`

#### [GET] api/public/about 获取关于信息接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "get about success",
    "duration": "5.211µs",
    "data": {
        "app": "dory-engine",
        "version": "v1.1.0",
        "config": {
            "dockerParamInputFileName": "/tmp/dory-param-input",
            "dockerParamOutputFileName": "/tmp/dory-param-output",
            "dockerOutputFileDir": "/tmp/dory-file-output",
            "dockerRunAsUid": 1000,
            "dockerBuildHomeDir": "/home/dory",
            "paramGitFileName": ".dory-git-param.yaml",
            "disabledDefNames": [
                "xxx",
            ],
            "frontend": {
                "appBackGroundImage": "/assets/frontend/default/background.jpg",
                "appDesc": "Make DevOps Easy",
                "appFavIcon": "/assets/frontend/default/favicon.ico",
                "appLogo": "/assets/frontend/default/logo.svg",
                "appName": "Dory-Engine"
            },
            "gitRepoDir": {
                "buildSettingsDir": "xxx",
                "databaseScriptsDir": "xxx",
                "demoCodesDir": "xxx",
                "deployScriptsDir": "xxx",
                "documentsDir": "xxx",
                "testScriptsDir": "xxx",
            },
        },
        "expiresDate": "unlimited",
        "featuresAvailable": {
            "meshAvailable": true
        },
        "community": false,
        "httpMethods": [
            "xxx",
        ]

    }
}
```

#### [POST] api/public/login 登录接口

- request请求内容
```json
{
    "username": "xxx",
    "password": "xxx"
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

#### [POST] api/public/password/forget 忘记密码接口

- request请求内容
```json
{
    "username": "xxx",
    "mail": "xxx@xxx.com"
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

#### [POST] api/public/passwork/token 检查忘记密码resetToken接口

- request请求内容
```json
{
    "resetToken": "xxx",
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

#### [POST] api/public/password/reset 重置密码接口

- request请求内容
```json
{
    "resetToken": "xxx",
    "newPassword": "xxx",
    "confirmPassword": "xxx"
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

#### [POST] api/public/webhook/pipeline?token=xxx 通过webhook创建运行接口

- request请求内容
  - token: pipelineToken
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
    "data": {}
}
```
