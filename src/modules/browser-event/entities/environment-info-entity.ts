import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
export class EnvironmentInfo {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  projectId: string

  @Column()
  env: string

  @Column()
  release: string

  @Column()
  pagePath: string

  @Column()
  timestamp: number

  @Column()
  url: string

  @Column()
  userId: string

  @Column()
  sessionId: string
}
