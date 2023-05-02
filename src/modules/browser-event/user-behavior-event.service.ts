import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { MongoRepository } from 'typeorm'

import { EventQuery } from './dto/event-query.dto'
import { UserBehaviorEvent } from './entities/user-behavior-event'

@Injectable()
export class UserBehaviorEventService {
  @InjectRepository(UserBehaviorEvent)
  private userBehaviorEventRepository: MongoRepository<UserBehaviorEvent>

  findAllEvent(query: EventQuery) {
    return this.userBehaviorEventRepository.find({
      'environmentInfo.projectId': {
        $eq: query.projectId,
      },
    })
  }

  findEventById(id: string, query: EventQuery) {
    return this.userBehaviorEventRepository.findOneBy({
      'environmentInfo.projectId': {
        $eq: query.projectId,
      },
      _id: new ObjectId(id),
    })
  }
}
