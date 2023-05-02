import { createHash } from 'crypto'
import { parse } from 'stacktrace-parser'

import { JSErrorPayload } from './entities/js-error-event/helper'

/**
 * JS Error 需要根据 payload 计算 eventId 来标识多个错误是否为同一个，是的话就不重复入库了
 */
export function generateJSErrorEventId(jsErrorPayload: JSErrorPayload): string {
  const { error, extra } = jsErrorPayload
  const hash = createHash('sha256')

  // base
  hash.update(error.message)
  error.name && hash.update(error.name)
  error.filename && hash.update(error.filename)
  error.lineno && hash.update(String(error.lineno))
  error.colno && hash.update(String(error.colno))

  // stack
  if (error.stack) {
    const stackFrames = parse(error.stack)

    for (const stackFrame of stackFrames) {
      const { file, methodName, lineNumber, column } = stackFrame

      file !== null && hash.update(file)
      methodName !== null && hash.update(methodName)
      lineNumber !== null && hash.update(String(lineNumber))
      column !== null && hash.update(String(column))
    }
  }

  // extra
  if (extra !== undefined) {
    for (const [key, value] of Object.entries(extra)) {
      hash.update(`${key}-${value}`)
    }
  }

  return hash.digest('hex')
}
