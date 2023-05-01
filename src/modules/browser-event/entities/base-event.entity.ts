import { Column } from 'typeorm'

import { EnvironmentInfo } from './environment-info-entity'

export abstract class BaseEvent {
  @Column()
  eventId: string

  @Column(() => EnvironmentInfo)
  environmentInfo: EnvironmentInfo
}
