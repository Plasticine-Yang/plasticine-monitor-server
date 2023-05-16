import { BadRequestException, PipeTransform } from '@nestjs/common'

import { EventQuery } from '../dto/event-query.dto'

export class EventQueryValidationPipe implements PipeTransform {
  transform(value: EventQuery) {
    const { projectId, timeRange } = value

    if (!projectId) {
      throw new BadRequestException('缺少 projectId query 参数')
    }

    if (timeRange) {
      const match = timeRange.match(/^(\d+)([h,d]$)/)
      if (!match) {
        throw new BadRequestException("timeRange 参数格式错误，请传入如 '1h', '3h', '1d', '7d', '14d' 这样的格式")
      }
    }

    return value
  }
}
