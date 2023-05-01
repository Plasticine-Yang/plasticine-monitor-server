export interface ProjectConfig {
  app: AppConfig
  mysql: MySQLConfig
}

export interface AppConfig {
  port: number
}

export interface MySQLConfig {
  host: string
  port: number
  username: string
  password: string
  database: string

  /**
   * @description
   * Indicates if database schema should be auto created on every application launch.
   * Be careful with this option and don't use this in production - otherwise you can lose production data.
   * This option is useful during debug and development.
   * As an alternative to it, you can use CLI and run schema:sync command.
   */
  synchronize: boolean
}

/** @description 支持的数据库类型配置 */
export type DatabaseConfig = MySQLConfig
