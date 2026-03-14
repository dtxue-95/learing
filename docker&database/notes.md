# 数据库与缓存技术揭秘

## docker 基础使用

服务端内容，涉及到环境配置问题

Mac
    - MacOS 15.0.1
    - Macos 14
Windows
    - Windows7
    - Windows11
Linux
    - centos
    - Ubuntu

给我们环境准备带了巨大麻烦
docker 提倡将系统中最核心的 kernel 提取出来，单独作为一个微型系统

### 核心概念

- image
    可以自己自定义镜像，也可以使用官方镜像，镜像通俗来说就是：一个极简版系统+自己定义的服务
- container
    容器，镜像运行后
- vol
- docker hub
    代码发布到 github
    docker 也有一个集中仓库，用来存储 image