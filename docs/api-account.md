# api/account接口文档

## 目录

- [api/account接口文档](#apiaccount接口文档)
  - [目录](#目录)
  - [api接口](#api接口)
    - [account 账号相关接口](#account-账号相关接口)
      - [\[POST\] api/account/logout 注销接口](#post-apiaccountlogout-注销接口)
      - [\[GET\] api/account/accessTokens 获取登录用户的accessToken列表接口](#get-apiaccountaccesstokens-获取登录用户的accesstoken列表接口)
      - [\[POST\] api/account/accessToken 创建登录用户accessToken接口](#post-apiaccountaccesstoken-创建登录用户accesstoken接口)
      - [\[DELETE\] api/account/accessToken/:accessTokenName 删除登录用户accessToken接口](#delete-apiaccountaccesstokenaccesstokenname-删除登录用户accesstoken接口)
      - [\[POST\] api/account/password/change 修改密码接口](#post-apiaccountpasswordchange-修改密码接口)
      - [\[GET\] api/account/profile 获取登录用户资料接口](#get-apiaccountprofile-获取登录用户资料接口)
      - [\[POST\] api/account/profile 修改登录用户资料接口](#post-apiaccountprofile-修改登录用户资料接口)
      - [\[POST\] api/account/avatar 修改登录用户头像接口](#post-apiaccountavatar-修改登录用户头像接口)
      - [\[DELETE\] api/account/avatar 删除登录用户头像接口](#delete-apiaccountavatar-删除登录用户头像接口)

## api接口

### account 账号相关接口

- url: api/account/
- 需要校验`x-user-token`

#### [POST] api/account/logout 注销接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [GET] api/account/accessTokens 获取登录用户的accessToken列表接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "accessTokens": [
            {
                "accessToken": "xxx",
                "username": "xxx",
                "expireTime": "02-02 12:12:12",
                "accessTokenID": "xxx",
                "accessTokenName": "xxx",
                "expired": "2021-02-02 12:12:12"
            }
        ]
    }
}
```

#### [POST] api/account/accessToken 创建登录用户accessToken接口

- request请求内容
```json
{
    "accessTokenName": "xxx",
    "expireDays": 30
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

#### [DELETE] api/account/accessToken/:accessTokenName 删除登录用户accessToken接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [POST] api/account/password/change 修改密码接口

- request请求内容
```json
{
    "oldPassword": "xxx",
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

#### [GET] api/account/profile 获取登录用户资料接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {
        "profile": {
            "username": "xxx",
            "name": "xxx",
            "mail": "xxx",
            "mobile": "xxx"
        }
    }
}
```

#### [POST] api/account/profile 修改登录用户资料接口

- request请求内容
```json
{
    "name": "xxx",
    "mobile": "xxx"
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

#### [POST] api/account/avatar 修改登录用户头像接口

- request请求内容
  - 上传头像文件的表单名字: avatar，支持jpg、jpeg、png格式

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```

#### [DELETE] api/account/avatar 删除登录用户头像接口

- response响应内容
```json
{
    "status": "SUCCESS",
    "msg": "xxx",
    "duration": "1.290581419s",
    "data": {}
}
```
