# Dory-Engine是一个非常简单的应用上云引擎

- [中文文档](README.md)

- [Github](https://github.com/dory-engine/dory-engine)
- [Gitee](https://gitee.com/dory-engine/dory-engine)

![](docs/images/dory-icon.png)

详细参见官方网站: [https://doryengine.com](https://doryengine.com)

## 什么是`Dory-Engine`

[🚀🚀🚀 Dory-Engine平台工程最佳实践 (https://www.bilibili.com/video/BV1oM4y117Pj/)](https://www.bilibili.com/video/BV1oM4y117Pj/)

![](docs/images/what-is-dory.png)

- `Dory-Engine` 是一个非常简单的应用上云引擎，开发人员不用学、不用写、不用配就可以自行把自己编写的程序从源代码，编译、打包、部署到各类k8s环境或者主机环境中。

1. 不用学: 不需要学习如何编写复杂的上云脚本和如何部署应用到k8s，所有配置都所见即所得一看就懂
2. 不用写: 不需要编写复杂的构建、打包、部署的上云脚本，也不需要编写复杂的k8s应用部署文件，只需要几项简单的配置就可以设置好自己的上云流水线
3. 不用配: 不需要配置各个DevOps工具链和k8s环境如何互相配合完成应用上云，项目一开通所有工具链和环境自动完成配置

### `Dory-Engine`架构

![](docs/images/architecture.png)

- 可以以多实例的方式部署在k8s或者docker中
- 所有上云步骤都在docker中执行，因此可以很轻松定义自己特有的上云步骤
- 直接接管各种DevOps工具链，所有DevOps工具链的配置都是自动完成，用户可以通过流水线自动完成各种CI持续集成步骤
- 直接接管各种应用部署环境，包括各种k8s、服务网格、主机环境和数据库环境，所有应用部署环境自动完成初始化配置，开发人员可以通过流水线自动完成各种CD持续部署步骤

## 使用 `dorycli` 安装 `Dory-Engine`

- dorycli 命令行工具
  - [Github](https://github.com/dory-engine/dorycli)
  - [Gitee](https://gitee.com/dory-engine/dorycli)

[🚀🚀🚀 使用dorycli快速安装Dory-Engine (https://www.bilibili.com/video/BV1aG411D7Sj/)](https://www.bilibili.com/video/BV1aG411D7Sj/)

## Dory-Engine的使用演示

[🚀🚀🚀 大规模云原生转型血泪史 (https://www.bilibili.com/video/BV1Tu4y1n7CC)](https://www.bilibili.com/video/BV1Tu4y1n7CC)

[🚀🚀🚀 Dory-Engine多云环境部署应用 (https://www.bilibili.com/video/BV1Qg4y1F7y7/)](https://www.bilibili.com/video/BV1Qg4y1F7y7/)

[🚀🚀🚀 Dory-Engine异构环境部署应用 (https://www.bilibili.com/video/BV1vk4y1x7qX/)](https://www.bilibili.com/video/BV1vk4y1x7qX/)

[🚀🚀🚀 Dory-Engine混合灰度发布 (https://www.bilibili.com/video/BV1o14y1B74U/)](https://www.bilibili.com/video/BV1o14y1B74U/)

[🚀🚀🚀 Dory-Engine GitOps云环境管理 (https://www.bilibili.com/video/BV1Y8411z7em/)](https://www.bilibili.com/video/BV1Y8411z7em/)

[🚀🚀🚀 Dory-Engine自定义上云流程 (https://www.bilibili.com/video/BV1Uj411n78S/)](https://www.bilibili.com/video/BV1Uj411n78S/)

[🚀🚀🚀 Dory-Engine深入云原生应用部署 (https://www.bilibili.com/video/BV18g4y1D77S/)](https://www.bilibili.com/video/BV18g4y1D77S/)

## Dory-Engine API接口文档

[API接口文档 api.md](api.md)
