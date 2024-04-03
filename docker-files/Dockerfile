FROM nginx:1.25.1-alpine

LABEL maintainer="cookeem"
LABEL email="cookeem@qq.com"
LABEL version="v2.6.0"

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /dory-console
