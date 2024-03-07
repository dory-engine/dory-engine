# api/ws接口文档

## 目录

- [api/ws接口文档](#apiws接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [ws websocket相关接口](#ws-websocket相关接口)
      - [\[GET\] api/ws/log/run/:runName?kind=xxx\&phaseID=xxx\&stageID=xxx\&stepID=xxx 运行日志websocket接口](#get-apiwslogrunrunnamekindxxxphaseidxxxstageidxxxstepidxxx-运行日志websocket接口)
      - [\[GET\] api/ws/log/audit/admin/:auditID 审计日志websocket接口，需要管理员权限](#get-apiwslogauditadminauditid-审计日志websocket接口需要管理员权限)
      - [\[GET\] api/ws/log/audit/console/:auditID 审计日志websocket接口](#get-apiwslogauditconsoleauditid-审计日志websocket接口)

## api接口

### ws websocket相关接口


- url: api/ws/
- 需要校验`x-user-token`，`x-user-token`放在url中
- 需要包含`language`参数，来源于浏览器的语言（navigator.language）。`language`放在url中

#### [GET] api/ws/log/run/:runName?kind=xxx&phaseID=xxx&stageID=xxx&stepID=xxx 运行日志websocket接口

- request url参数
    - kind: 必填，日志类型，log（输出类日志） / directive（指令类日志）
    - phaseID: 选填，阶段ID
    - stageID: 选填，环节ID
    - stepID: 选填，步骤ID

- websocket输出内容
```json
{
    "logType": "directive",
    "startTime": "02-02 12:12:12",
    "endTime": "02-02 12:12:12",
    "duration": "12ms",
    "content": "xxx"
}
```

- response响应内容
```json
{
    "status": "FAIL",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/ws/log/audit/admin/:auditID 审计日志websocket接口，需要管理员权限

- websocket输出内容

```json
{
    "logType": "SUCCESS",
    "startTime": "02-02 12:12:12",
    "endTime": "02-02 12:12:12",
    "duration": "12ms",
    "content": "xxx"
}
```

- response响应内容
```json
{
    "status": "FAIL",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/ws/log/audit/console/:auditID 审计日志websocket接口

- websocket输出内容

```json
{
    "logType": "SUCCESS",
    "startTime": "02-02 12:12:12",
    "endTime": "02-02 12:12:12",
    "duration": "12ms",
    "content": "xxx"
}
```

- response响应内容
```json
{
    "status": "FAIL",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```
