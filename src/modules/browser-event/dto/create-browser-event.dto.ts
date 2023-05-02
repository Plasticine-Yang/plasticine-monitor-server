import { EnvironmentInfo } from '../entities/environment-info-entity'
import { JSErrorPayload } from '../entities/js-error-event/helper'
import { PerformancePayload } from '../entities/performance-event/helper'
import { UserBehaviorPayload } from '../entities/user-behavior-event/helper'
import type { EventTypeEnum } from '../enums'

export class CreateBrowserEventDto {
  eventType: EventTypeEnum

  payload: JSErrorPayload | PerformancePayload | UserBehaviorPayload[]

  environmentInfo: EnvironmentInfo
}
