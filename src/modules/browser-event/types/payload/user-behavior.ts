import type { UserBehaviorMetricsEnum } from '../../enums'
import type { JSErrorPayload as JSErrorMetrics } from './js-error'

export interface UserBehaviorPayload {
  /** 用户行为指标种类名 */
  name: UserBehaviorMetricsEnum
  /** 性能指标数值 - 单位 ms */
  value: PageViewMetrics | JSErrorMetrics | NetworkMetrics
}

export type RequestType = 'XHR' | 'Fetch'

export interface NetworkRequest {
  method: string
  url: string
  timestamp: number
  headers?: Record<string, string>
  body?: string
}

export interface NetworkResponse {
  status: number
  timestamp: number
  headers?: Record<string, string>
  body?: string
}

/** HTTP 网络请求指标 */
export interface NetworkMetrics {
  /** 请求的类型 - XHR or Fetch */
  requestType: RequestType
  request: NetworkRequest
  response: NetworkResponse
  /** 请求耗时时长 */
  duration: number
}

/** PV 指标 - 上报页面信息即可 */
export interface PageViewMetrics {
  pagePath: string
}
