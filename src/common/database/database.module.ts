import { ConfigurableModuleBuilder, DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import type { DatabaseConfig, ProjectConfig } from 'src/types'

interface DatabaseModuleOptions {
  type: 'mysql'
}

const { ConfigurableModuleClass, OPTIONS_TYPE } = new ConfigurableModuleBuilder<DatabaseModuleOptions>({
  moduleName: 'Database',
})
  .setClassMethodName('forRoot')
  .build()

@Module({})
export class DatabaseModule extends ConfigurableModuleClass {
  static forRoot(options?: typeof OPTIONS_TYPE): DynamicModule {
    const type = options?.type ?? 'mysql'

    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      /** @description Load database configuration. */
      useFactory: (configService: ConfigService<ProjectConfig>) => {
        let databaseConfig: DatabaseConfig | undefined

        switch (type) {
          case 'mysql':
            databaseConfig = configService.get('mysql', { infer: true })
            break

          default:
            throw new Error(`The database type '${type}' has not been supported.`)
        }

        if (databaseConfig === undefined) {
          throw new Error(`Unable to load configuration of database '${type}'.`)
        }

        return {
          type,
          ...databaseConfig,
          autoLoadEntities: true,
        }
      },
    })
  }
}
