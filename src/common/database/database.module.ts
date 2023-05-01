import { ConfigurableModuleBuilder, DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import type { ProjectConfig } from 'src/types'

const { ConfigurableModuleClass } = new ConfigurableModuleBuilder({
  moduleName: 'Database',
})
  .setClassMethodName('forRoot')
  .build()

@Module({})
export class DatabaseModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      /** @description Load database configuration. */
      useFactory: (configService: ConfigService<ProjectConfig>) => {
        const databaseConfig = configService.get('mongoDB', { infer: true })

        if (databaseConfig === undefined) {
          throw new Error(`Unable to load configuration of database.`)
        }

        return {
          type: 'mongodb',
          ...databaseConfig,
          autoLoadEntities: true,
        }
      },
    })
  }
}
