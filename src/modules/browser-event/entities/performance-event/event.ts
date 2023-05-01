import { Column, Entity } from 'typeorm'

import { EventTypeEnum } from '../../enums'
import { BaseEvent } from '../base-event.entity'
import { PerformancePayload } from './helper'

@Entity()
export class PerformanceEvent extends BaseEvent {
  @Column()
  eventType: EventTypeEnum.Performance

  @Column(() => PerformancePayload)
  payload: PerformancePayload
}
