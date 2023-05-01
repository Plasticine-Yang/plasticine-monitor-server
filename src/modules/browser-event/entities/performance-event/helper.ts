import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

import { PerformanceMetricsEnum } from '../../enums'

@Entity()
export class PerformancePayload {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  name: PerformanceMetricsEnum

  @Column()
  value: number
}
