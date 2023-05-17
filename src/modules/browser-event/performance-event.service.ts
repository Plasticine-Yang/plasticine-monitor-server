import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import { MongoRepository } from 'typeorm'

import type { EChartsLineData } from 'src/types'

import { queryProjectId, queryTimeRange } from 'src/utils'
import { EventQuery } from './dto/event-query.dto'
import { PerformanceEvent } from './entities/performance-event'
import { PerformanceMetricsEnum } from './enums'

@Injectable()
export class PerformanceEventService {
  @InjectRepository(PerformanceEvent)
  private performanceEventRepository: MongoRepository<PerformanceEvent>

  async findEChartLineByMetricsType(metricsType: PerformanceMetricsEnum, query: EventQuery) {
    // 获取当前项目的 FP 数据
    const performanceEvents = await this.performanceEventRepository.find({
      where: {
        ...queryProjectId(query),
        ...queryTimeRange(query),
        'payload.name': {
          $eq: metricsType,
        },
      },
      order: {
        'environmentInfo.timestamp': 1,
      },
    })

    const echartsLineData: EChartsLineData = {
      xAxis: performanceEvents.map((event) => dayjs(event.environmentInfo.timestamp).format('YYYY-MM-DD HH:mm:ss')),
      yAxis: performanceEvents.map((event) => event.payload.value),
    }

    return echartsLineData
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
