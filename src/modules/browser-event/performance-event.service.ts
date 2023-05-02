import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { MongoRepository } from 'typeorm'

import { EventQuery } from './dto/event-query.dto'
import { PerformanceEvent } from './entities/performance-event'

@Injectable()
export class PerformanceEventService {
  @InjectRepository(PerformanceEvent)
  private performanceEventRepository: MongoRepository<PerformanceEvent>

  findAllEvent(query: EventQuery) {
    return this.performanceEventRepository.find({
      'environmentInfo.projectId': {
        $eq: query.projectId,
      },
    })
  }

  findEventById(id: string, query: EventQuery) {
    return this.performanceEventRepository.findOneBy({
      'environmentInfo.projectId': {
        $eq: query.projectId,
      },
      _id: new ObjectId(id),
    })
  }
}
