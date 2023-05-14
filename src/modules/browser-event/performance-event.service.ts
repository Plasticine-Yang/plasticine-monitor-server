import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { MongoRepository } from 'typeorm'

import { EventQuery } from './dto/event-query.dto'
import { PerformanceEvent } from './entities/performance-event'
import { PerformanceMetricsEnum } from './enums'
import dayjs from 'dayjs'

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

  async findEChartLineByMetricsType(metricsType: PerformanceMetricsEnum, query: EventQuery) {
    // 过去 xx 时间时的时间戳 - 1h -> 获取一小时之前的时间戳
    const currentTimestamp = dayjs()
    const parsedTimeBefore = parseTimeBefore(query.timeRange)

    let startTimestamp: number | undefined

    if (parsedTimeBefore !== null) {
      const [value, unit] = parsedTimeBefore

      startTimestamp = currentTimestamp.subtract(value, unit as 'h' | 'd').valueOf()
    }

    // 获取当前项目的 FP 数据
    const performanceEvents = await this.performanceEventRepository.find({
      where: {
        'environmentInfo.projectId': {
          $eq: query.projectId,
        },
        'payload.name': {
          $eq: metricsType,
        },
        // 查询位于 startTimestamp 到 currentTimestamp 之间的数据
        ...(startTimestamp !== undefined
          ? {
              'environmentInfo.timestamp': {
                $gte: startTimestamp,
                $lte: currentTimestamp.valueOf(),
              },
            }
          : {}),
      },
      order: {
        'environmentInfo.timestamp': 1,
      },
    })

    // 计算时间间隔
    const firstDate = performanceEvents.at(0)?.environmentInfo.timestamp
    const lastDate = performanceEvents.at(-1)?.environmentInfo.timestamp
    const diffSeconds = dayjs(lastDate).diff(dayjs(firstDate), 'second')
    const diffMinutes = dayjs(lastDate).diff(dayjs(firstDate), 'minute')
    const diffHours = dayjs(lastDate).diff(dayjs(firstDate), 'hour')

    // 根据时间间隔动态生成x轴的数据
    const categories: string[] = []
    if (diffSeconds < 60) {
      let date = dayjs(firstDate).startOf('second')
      while (date < dayjs(lastDate)) {
        categories.push(date.format('YYYY-MM-DD HH:mm:ss'))
        date = date.add(1, 'second')
      }
    } else if (diffMinutes < 60) {
      let date = dayjs(firstDate).startOf('minute')
      while (date < dayjs(lastDate)) {
        categories.push(date.format('YYYY-MM-DD HH:mm'))
        date = date.add(1, 'minute')
      }
    } else if (diffHours < 24) {
      let date = dayjs(firstDate).startOf('hour')
      while (date < dayjs(lastDate)) {
        categories.push(date.format('YYYY-MM-DD HH'))
        date = date.add(1, 'hour')
      }
    } else {
      let date = dayjs(firstDate).startOf('day')
      while (date < dayjs(lastDate)) {
        categories.push(date.format('YYYY-MM-DD'))
        date = date.add(1, 'day')
      }
    }

    // 生成y轴的value数据
    const values = performanceEvents.map((item) => item.payload.value)

    return {
      categories,
      values,
    }
  }

  /** 获取 echart 折线图所需的数据 */
  async findAllEventLineChart(query: EventQuery) {
    const res = await Promise.all(
      [
        PerformanceMetricsEnum.FP,
        PerformanceMetricsEnum.FCP,
        PerformanceMetricsEnum.LCP,
        PerformanceMetricsEnum.FID,
        PerformanceMetricsEnum.TTI,
      ].map((metricsType) => this.findEChartLineByMetricsType(metricsType, query)),
    )

    return {
      [PerformanceMetricsEnum.FP]: res.at(0)!,
      [PerformanceMetricsEnum.FCP]: res.at(1)!,
      [PerformanceMetricsEnum.LCP]: res.at(2)!,
      [PerformanceMetricsEnum.FID]: res.at(3)!,
      [PerformanceMetricsEnum.TTI]: res.at(4)!,
    }
  }
}

/**
 * 解析 timeBefore 为时间和对应的单位，以元组的形式返回
 *
 * @example
 * 1h  -> [1, 'h']
 * 12h -> [12, 'h']
 * 1d  -> [1, 'd']
 * 14d -> [14, 'd']
 */
function parseTimeBefore(timeBefore?: string): [number, string] | null {
  if (!timeBefore) {
    return null
  }

  const match = timeBefore.match(/^(\d+)([h,d])$/)

  if (!match) {
    return null
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  return [value, unit]
}
