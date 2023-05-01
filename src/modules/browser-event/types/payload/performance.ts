import type { PerformanceMetricsEnum } from '../../enums'

export interface PerformancePayload {
  /** 性能指标种类名 */
  name: PerformanceMetricsEnum
  /** 性能指标数值 - 单位 ms */
  value: number
}
