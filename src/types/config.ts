import type { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions'

export interface ProjectConfig {
  app: AppConfig
  mongoDB: Omit<MongoConnectionOptions, 'type'>
}

export interface AppConfig {
  port: number
}
