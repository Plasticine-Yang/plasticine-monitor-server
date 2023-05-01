import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

import type { UserBehaviorMetricsEnum } from '../../enums'
import { JSErrorPayload } from '../js-error-event/helper'

@Entity()
export class UserBehaviorPayload {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  name: UserBehaviorMetricsEnum

  @Column()
  value: PageViewMetrics | JSErrorPayload | NetworkMetrics
}

@Entity()
export class PageViewMetrics {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  pagePath: string
}

@Entity()
export class NetworkRequest {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  method: string

  @Column()
  url: string

  @Column()
  timestamp: number

  @Column()
  headers?: Record<string, string>

  @Column()
  body?: string
}

@Entity()
export class NetworkResponse {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  status: number

  @Column()
  timestamp: number

  @Column()
  headers?: Record<string, string>

  @Column()
  body?: string
}

@Entity()
export class NetworkMetrics {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  requestType: string

  @Column(() => NetworkRequest)
  request: NetworkRequest

  @Column(() => NetworkResponse)
  response: NetworkResponse

  @Column()
  duration: number
}
