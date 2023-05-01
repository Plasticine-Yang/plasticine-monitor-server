export interface JSError {
  /** 错误名称 */
  name?: string

  /** 错误信息 */
  message: string

  /** 堆栈信息 */
  stack?: string

  /** 错误文件名 */
  filename?: string

  /** 报错的代码行号 */
  lineno?: number

  /** 报错的代码列号 */
  colno?: number
}

/** 附带的错误上下文信息 */
export type JSErrorExtra = Record<string, string>

export interface JSErrorPayload {
  error: JSError
  extra?: Record<string, string>
}
