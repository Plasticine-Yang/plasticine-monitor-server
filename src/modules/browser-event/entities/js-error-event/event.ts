import { Column, Entity } from 'typeorm'

import { EventTypeEnum } from '../../enums'
import { BaseEvent } from '../base-event.entity'
import { JSErrorPayload } from './helper'

@Entity()
export class JSErrorEvent extends BaseEvent {
  @Column()
  eventType: EventTypeEnum.JSError

  @Column(() => JSErrorPayload)
  payload: JSErrorPayload
}
