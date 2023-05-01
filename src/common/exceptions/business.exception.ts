import { HttpException, HttpExceptionOptions } from '@nestjs/common'

interface BusinessHttpExceptionOptions extends HttpExceptionOptions {
  /** @description HTTP 状态码 */
  httpStatusCode?: number
}

/**
 * @description 业务异常
 */
class BusinessHttpException extends HttpException {
  constructor(public code: number, public message: string, options?: BusinessHttpExceptionOptions) {
    super(message, options?.httpStatusCode ?? 500, {
      cause: options?.cause,
      description: options?.description,
    })
  }
}

export { BusinessHttpException }
