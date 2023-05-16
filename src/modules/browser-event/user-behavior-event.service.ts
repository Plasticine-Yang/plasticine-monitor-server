import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { EventQuery } from './dto/event-query.dto'
import { UserBehaviorEvent } from './entities/user-behavior-event'
import { queryProjectId } from 'src/utils'

@Injectable()
export class UserBehaviorEventService {
  @InjectRepository(UserBehaviorEvent)
  private userBehaviorEventRepository: MongoRepository<UserBehaviorEvent>

  async findAllPages(query: EventQuery) {
    const res = await this.userBehaviorEventRepository
      .aggregate([
        {
          $match: {
            ...queryProjectId(query),
          },
        },
        {
          $group: {
            _id: '$environmentInfo.pagePath',
            pv: { $sum: 1 },
            uv: { $addToSet: '$environmentInfo.userId' },
          },
        },
        {
          // 对输出的结果进行映射
          $project: {
            // 隐藏 _id 字段
            _id: 0,
            // 将 _id 映射成 pagePath 字段名
            pagePath: '$_id',
            // 将 count 映射成 pv 字段名
            pv: 1,
            uv: { $size: '$uv' },
          },
        },
      ])
      .toArray()

    return res
  }
}
