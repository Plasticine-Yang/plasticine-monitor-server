import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { MongoRepository } from 'typeorm'

import { queryProjectId, queryTimeRange, queryUserId } from 'src/utils'

import { EventQuery } from './dto/event-query.dto'
import { JSErrorEvent } from './entities/js-error-event'

@Injectable()
export class JSErrorEventService {
  @InjectRepository(JSErrorEvent)
  private jsErrorEventRepository: MongoRepository<JSErrorEvent>

  findAllEvent(query: EventQuery) {
    return this.jsErrorEventRepository.find({
      ...queryProjectId(query),
      ...queryTimeRange(query),
      ...queryUserId(query),
    })
  }

  findEventById(id: string, query: EventQuery) {
    return this.jsErrorEventRepository.findOneBy({
      ...queryProjectId(query),
      _id: new ObjectId(id),
    })
  }
}
