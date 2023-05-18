import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'

import { BrowserEventService } from './browser-event.service'
import { CreateBrowserEventDto } from './dto/create-browser-event.dto'
import { EventQuery } from './dto/event-query.dto'
import { JSErrorEventService } from './js-error-event.service'
import { PerformanceEventService } from './performance-event.service'
import { EventQueryValidationPipe, UserBehaviorEventQueryValidationPipe } from './pipe'
import { UserBehaviorEventService } from './user-behavior-event.service'

@Controller('browser-event')
export class BrowserEventController {
  constructor(
    private readonly browserEventService: BrowserEventService,
    private readonly jsErrorEventService: JSErrorEventService,
    private readonly performanceEventService: PerformanceEventService,
    private readonly userBehaviorEventService: UserBehaviorEventService,
  ) {}

  @Post()
  create(@Res({ passthrough: true }) response: Response, @Body() createBrowserEventDto: CreateBrowserEventDto) {
    response.status(HttpStatus.OK)
    return this.browserEventService.create(createBrowserEventDto)
  }

  /** 所有 JSErrorEvent */
  @Get('js-error-event')
  findAllJSErrorEventByProjectId(@Query(new EventQueryValidationPipe()) query: EventQuery) {
    return this.jsErrorEventService.findAllEvent(query)
  }

  /** 单个 JSErrorEvent */
  @Get('js-error-event/:id')
  findJSErrorEventById(@Param('id') id: string, @Query(new EventQueryValidationPipe()) query: EventQuery) {
    return this.jsErrorEventService.findEventById(id, query)
  }

  /** PerformanceEvent echarts 折线图数据 */
  @Get('performance-event-line-chart')
  findAllPerformanceEventLineChart(@Query(new EventQueryValidationPipe()) query: EventQuery) {
    return this.performanceEventService.findAllEventLineChart(query)
  }

  /** 所有页面信息 */
  @Get('pages')
  findAllUserBehaviorEventByProjectId(@Query(new EventQueryValidationPipe()) query: EventQuery) {
    return this.userBehaviorEventService.findAllPages(query)
  }

  /** 获取用户行为信息 */
  @Get('user-behavior-info')
  findUserBehaviorInfo(@Query(new UserBehaviorEventQueryValidationPipe()) query: EventQuery) {
    return this.userBehaviorEventService.findUserBehaviorInfo(query)
  }
}
