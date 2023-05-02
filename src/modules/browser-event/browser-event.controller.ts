import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'

import { BusinessHttpException } from 'src/common/exceptions'
import { API_CODE } from 'src/constants'

import { BrowserEventService } from './browser-event.service'
import { CreateBrowserEventDto } from './dto/create-browser-event.dto'
import { EventQuery } from './dto/event-query.dto'
import { JSErrorEventService } from './js-error-event.service'

@Controller('browser-event')
export class BrowserEventController {
  constructor(
    private readonly browserEventService: BrowserEventService,
    private readonly jsErrorEventService: JSErrorEventService,
  ) {}

  @Post()
  create(@Res({ passthrough: true }) response: Response, @Body() createBrowserEventDto: CreateBrowserEventDto) {
    response.status(HttpStatus.OK)

    return this.browserEventService.create(createBrowserEventDto)
  }

  @Get('js-error-event')
  findAllJSErrorEventByProjectId(@Query() query: EventQuery) {
    if (!query.projectId) {
      throw new BusinessHttpException(API_CODE.QUERY_INCOMPLETE, '缺少 projectId query 参数')
    }

    return this.jsErrorEventService.findAllEvent(query)
  }

  @Get('js-error-event/:id')
  findJSErrorEventById(@Param('id') id: string, @Query() query: EventQuery) {
    if (!query.projectId) {
      throw new BusinessHttpException(API_CODE.QUERY_INCOMPLETE, '缺少 projectId query 参数')
    }

    return this.jsErrorEventService.findEventById(id, query)
  }
}
