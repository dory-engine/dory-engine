# 制作dory-console镜像

```bash
# 构建环境: node:16.20.2-alpine3.18
cd ~/Documents/DEVOPS-能力编排平台/dory-console
rm -rf dist
export NODE_OPTIONS=--openssl-legacy-provider
npm install && npm run build
rm -rf docker-files/dist && mv dist docker-files

cd docker-files
docker rmi doryengine/dory-console:v2.6.6
docker build --platform=linux/amd64 -t doryengine/dory-console:v2.6.6 . 
docker push doryengine/dory-console:v2.6.6


# 上传镜像
cd ~/Downloads/docker-images
rm -rf dory-console__v2.6.6
docker save -o dory-console__v2.6.6 doryengine/dory-console:v2.6.6
ls -lh
```

## 在高版本node运行调试

```bash
cd ~/Documents/DEVOPS-能力编排平台/dory-console
export NODE_OPTIONS=--openssl-legacy-provider
npm install && npm run serve
```
