import dayjs from 'dayjs'

import { EventQuery } from 'src/modules/browser-event/dto/event-query.dto'

/** 按照项目 id 查询 */
export function queryProjectId(query: EventQuery) {
  return {
    'environmentInfo.projectId': {
      $eq: query.projectId,
    },
  }
}

/** 按照用户 id 查询 */
export function queryUserId(query: EventQuery) {
  return query.userId
    ? {
        'environmentInfo.userId': {
          $eq: query.userId,
        },
      }
    : null
}

/** 按照会话 id 查询 */
export function querySessionId(query: EventQuery) {
  return query.sessionId
    ? {
        'environmentInfo.sessionId': {
          $eq: query.sessionId,
        },
      }
    : null
}

/** 按照页面路径查询 */
export function queryPagePath(query: EventQuery) {
  return query.pagePath
    ? {
        'environmentInfo.pagePath': {
          $eq: query.pagePath,
        },
      }
    : null
}

/** 按照时间段查询 */
export function queryTimeRange(query: EventQuery) {
  if (query.timeRange === undefined || query.timeRange === 'all') {
    return null
  }

  // 过去 xx 时间时的时间戳 - 1h -> 获取一小时之前的时间戳
  const currentTimestamp = dayjs()
  const parsedTimeBefore = parseTimeRange(query.timeRange)

  let startTimestamp: number | undefined

  if (parsedTimeBefore !== null) {
    const [value, unit] = parsedTimeBefore

    startTimestamp = currentTimestamp.subtract(value, unit as 'h' | 'd').valueOf()
  }

  return startTimestamp !== undefined
    ? {
        'environmentInfo.timestamp': {
          $gte: startTimestamp,
          $lte: currentTimestamp.valueOf(),
        },
      }
    : null
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
function parseTimeRange(timeRange?: string): [number, string] | null {
  if (!timeRange) {
    return null
  }

  const match = timeRange.match(/^(\d+)([h,d])$/)

  if (!match) {
    return null
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  return [value, unit]
}
