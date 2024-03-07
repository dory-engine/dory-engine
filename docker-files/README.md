# 制作dory-console镜像

```bash
# 构建环境: node:16.20.2-alpine3.18
rm -rf dist
export NODE_OPTIONS=--openssl-legacy-provider
npm install && npm run build

rm -rf docker-files/dist && mv dist docker-files
cd docker-files
docker build -t doryengine/dory-console:v2.5.2 . 
docker push doryengine/dory-console:v2.5.2
cd ..
```

## 在高版本node运行调试

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm install && npm run serve
```
