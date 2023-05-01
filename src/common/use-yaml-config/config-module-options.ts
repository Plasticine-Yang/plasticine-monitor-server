import { ConfigModuleOptions } from '@nestjs/config'
import Joi from 'joi'

import { loadYAMLConfiguration } from './load-yaml-configuration'

export const configModuleOptions: ConfigModuleOptions = {
  load: [loadYAMLConfiguration],
  validationSchema: Joi.object({
    // 校验运行环境
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  }),
}
