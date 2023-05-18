import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { EventQuery } from './dto/event-query.dto'
import { UserBehaviorEvent } from './entities/user-behavior-event'
import { queryProjectId, queryUserId, querySessionId } from 'src/utils'
import { UserBehaviorMetricsEnum } from './enums'

@Injectable()
export class UserBehaviorEventService {
  @InjectRepository(UserBehaviorEvent)
  private userBehaviorEventRepository: MongoRepository<UserBehaviorEvent>

  /** 获取所有页面的信息 */
  async findAllPages(query: EventQuery) {
    const res = await this.userBehaviorEventRepository
      .aggregate([
        // 筛选 UserBehaviorEvent 的 projectId
        {
          $match: {
            ...queryProjectId(query),
          },
        },
        /**
         * 连接 PerformanceEvent
         *   - 两者的 environmentInfo.pagePath 要相等
         *   - 筛选 PerformanceEvent 的 projectId
         *   - PerformanceEvent 子查询
         *     - 按照 payload.name 分组求平均值
         */
        {
          $lookup: {
            from: 'performance_event',
            // 提取 UserBehaviorEvent 的 pagePath 到变量中
            let: { userBehaviorPagePath: '$environmentInfo.pagePath' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      // PerformanceEvent 的 pagePath 要和 UserBehaviorEvent 的 pagePath 相等
                      { $eq: ['$environmentInfo.pagePath', '$$userBehaviorPagePath'] },
                      // PerformanceEvent 的 projectId 要符合条件
                      { $eq: ['$environmentInfo.projectId', query.projectId] },
                    ],
                  },
                },
              },
              // PerformanceEvent 子查询 - 按照 payload.name 分组求平均值
              {
                $group: {
                  _id: '$payload.name',
                  metricValue: { $avg: '$payload.value' },
                },
              },
              // 映射成符合需要的格式
              { $project: { _id: 0, metricName: '$_id', metricValue: 1 } },
            ],
            as: 'performanceMetrics',
          },
        },
        // 查询 PV & UV
        {
          $group: {
            _id: '$environmentInfo.pagePath',
            pv: {
              $sum: {
                $cond: [
                  // 统计 page-view 类型的数据的数量
                  // 通过 $map 遍历 payload 数组，如果存在 name 为 page-view 的对象则进行计数
                  {
                    $in: [
                      1,
                      {
                        $map: {
                          input: '$payload',
                          as: 'item',
                          in: {
                            $cond: [{ $eq: ['$$item.name', UserBehaviorMetricsEnum.PageView] }, 1, 0],
                          },
                        },
                      },
                    ],
                  },
                  // true case
                  1,
                  // false case
                  0,
                ],
              },
            },
            uv: {
              $addToSet: {
                // 只从 payload 数组中包含 page-view 的对象中进行计数
                $cond: [
                  {
                    $in: [
                      1,
                      {
                        $map: {
                          input: '$payload',
                          as: 'item',
                          in: {
                            $cond: [{ $eq: ['$$item.name', UserBehaviorMetricsEnum.PageView] }, 1, 0],
                          },
                        },
                      },
                    ],
                  },
                  '$environmentInfo.userId',
                  // 在使用 $size 计算 Set 的大小时，null 也会被计数，这里作为占位，之后需要将其过滤掉
                  null,
                ],
              },
            },
            // 将 $performanceMetrics 结果加入到每个分组中
            performanceMetrics: { $push: '$performanceMetrics' },
          },
        },
        {
          $project: {
            // 对 performanceMetrics 进行处理 - 取出每个分组中的 performanceMetrics 作为单独的一个数组，方便之后进行 map 转换
            performanceMetrics: {
              $reduce: {
                input: '$performanceMetrics',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] },
              },
            },
            pagePath: '$_id',
            pv: 1,
            uv: {
              $size: {
                $filter: {
                  input: '$uv',
                  as: 'item',
                  cond: {
                    $ne: ['$$item', null],
                  },
                },
              },
            },
          },
        },
        // 将 performanceMetrics 数组转成以 metricName 为 key 的对象
        {
          $addFields: {
            performanceMetrics: {
              $arrayToObject: {
                $map: {
                  input: '$performanceMetrics',
                  as: 'metric',
                  in: { k: '$$metric.metricName', v: '$$metric.metricValue' },
                },
              },
            },
          },
        },
        // 隐藏 _id 字段
        {
          $project: {
            _id: 0,
            pagePath: 1,
            pv: 1,
            uv: 1,
            performanceMetrics: 1,
          },
        },
      ])
      .toArray()

    return res
  }

  /** 获取所有用户行为信息 */
  async findUserBehaviorInfo(query: EventQuery) {
    const res = this.userBehaviorEventRepository
      .aggregate([
        {
          $match: {
            ...queryProjectId(query),
            ...queryUserId(query),
            ...querySessionId(query),
          },
        },
        {
          $sort: {
            'environmentInfo.timestamp': 1,
          },
        },
        {
          $project: {
            _id: 0,
            environmentInfo: 0,
            eventType: 0,
          },
        },
        { $unwind: '$payload' },
        { $replaceRoot: { newRoot: '$payload' } },
      ])
      .toArray()

    return res
  }
}
