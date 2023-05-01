import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
export class JSError {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  name?: string

  @Column()
  message: string

  @Column()
  stack?: string

  @Column()
  filename?: string

  @Column()
  lineno?: number

  @Column()
  colno?: number
}

@Entity()
export class JSErrorPayload {
  @ObjectIdColumn()
  id: ObjectId

  @Column(() => JSError)
  error: JSError

  @Column()
  extra?: Record<string, string>
}
