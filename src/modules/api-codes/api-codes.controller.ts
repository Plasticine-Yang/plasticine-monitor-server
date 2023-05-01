import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'

import { ApiCodesService } from './api-codes.service'

@Controller('api-codes')
export class ApiCodesController {
  constructor(private readonly apiCodeService: ApiCodesService) {}

  @Get()
  findAll() {
    return this.apiCodeService.findAll()
  }

  @Get(':apiCode')
  findOneByApiCode(@Param('apiCode', ParseIntPipe) apiCode: number) {
    return this.apiCodeService.findOne(apiCode)
  }
}
