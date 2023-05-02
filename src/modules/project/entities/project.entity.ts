import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
export class Project {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  name: string
}
