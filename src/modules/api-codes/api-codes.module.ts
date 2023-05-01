import { Module } from '@nestjs/common'

import { API_CODE as API_CODES } from 'src/constants'

import { ApiCodesController } from './api-codes.controller'
import { API_CODES_PROVIDER_KEY } from './api-codes.provider'
import { ApiCodesService } from './api-codes.service'

@Module({
  controllers: [ApiCodesController],
  providers: [
    {
      provide: API_CODES_PROVIDER_KEY,
      useValue: API_CODES,
    },
    ApiCodesService,
  ],
})
export class ApisCodeModule {}
