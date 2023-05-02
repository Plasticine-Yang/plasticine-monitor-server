import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BrowserEventController } from './browser-event.controller'
import { BrowserEventService } from './browser-event.service'
import { JSErrorEvent } from './entities/js-error-event'
import { PerformanceEvent } from './entities/performance-event'
import { UserBehaviorEvent } from './entities/user-behavior-event'
import { JSErrorEventService } from './js-error-event.service'
import { PerformanceEventService } from './performance-event.service'
import { UserBehaviorEventService } from './user-behavior-event.service'

@Module({
  imports: [TypeOrmModule.forFeature([JSErrorEvent, PerformanceEvent, UserBehaviorEvent])],
  controllers: [BrowserEventController],
  providers: [BrowserEventService, JSErrorEventService, PerformanceEventService, UserBehaviorEventService],
})
export class BrowserEventModule {}
