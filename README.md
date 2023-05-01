# plasticine-monitor-server

[plasticine-monitor-sdk](https://github.com/Plasticine-Yang/plasticine-monitor-sdk) 的服务端实现

## Usage

### 开发环境

使用 `docker-compose` 完成开发环境的搭建，比如 MySQL 数据库

```shell
# 初始化开发环境容器
pnpm env-dev:init

# 启动 nest
pnpm nest:dev
```

初始化过之后，以后再启动项目环境可以执行下面的命令

```shell
pnpm env-dev:start
pnpm nest:dev
```

如果需要移除容器和数据卷，可执行：

```shell
pnpm env-dev:clean -v
```

### 生产环境部署

```shell
# 完整部署流程
pnpm run deploy

# 等环境启动好后运行 nest 即可
pnpm run nest:prod
```

环境关闭但没有移除，再次运行时执行下面的命令

```shell
pnpm run env-prod:start
pnpm run nest:prod
```

清空环境

```shell
pnpm run env-prod:clean
```

## 配置文件

项目根目录下创建 `.config` 目录，里面编写对应环境的配置文件，比如 `development.yaml` 或 `development.yml`

示例配置文件如下：

```yaml
mysql:
  host: localhost
  port: 3306
  username: root
  password: root
  database: monitor-server
  synchronize: true
```

修改了配置文件的话记得将 `docker-compose` 的配置文件也修改一下，比如 MySQL 端口改成了 3307，那么 docker-compose 中的 MySQL 容器映射端口也要改成 3307

### 可配置项

`src/types/config.ts` 中的 `ProjectConfig` 接口即为 `.config` 目录下对应环境的配置文件支持的配置项
