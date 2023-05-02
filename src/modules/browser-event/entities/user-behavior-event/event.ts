import { Column, Entity } from 'typeorm'

import { EventTypeEnum } from '../../enums'
import { BaseEvent } from '../base-event.entity'
import { UserBehaviorPayload } from './helper'

@Entity()
export class UserBehaviorEvent extends BaseEvent {
  @Column()
  eventType: EventTypeEnum.UserBehavior

  @Column(() => UserBehaviorPayload)
  payload: UserBehaviorPayload[]
}
