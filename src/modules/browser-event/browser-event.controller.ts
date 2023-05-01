import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

import { BrowserEventService } from './browser-event.service'
import { CreateBrowserEventDto } from './dto/create-browser-event.dto'

@Controller('browser-event')
export class BrowserEventController {
  constructor(private readonly browserEventService: BrowserEventService) {}

  @Post()
  create(@Res({ passthrough: true }) response: Response, @Body() createBrowserEventDto: CreateBrowserEventDto) {
    response.status(HttpStatus.OK)

    return this.browserEventService.create(createBrowserEventDto)
  }
}
