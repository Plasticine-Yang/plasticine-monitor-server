/** @description 业务统一响应体 */
export interface BusinessResponse<T = any> {
  code: number
  message: string
  data: T
}

/** @description 业务统一异常响应体 */
export interface BusinessExceptionResponse {
  code: number
  message: string
}

/** @description 未捕获的异常响应体 */
export interface UncaughtExceptionResponse {
  code: number

  /** @default string unknown error */
  message: string
  stack?: StackFrame[]
}
