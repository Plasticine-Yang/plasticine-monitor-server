import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import ErrorStackParser from 'error-stack-parser'
import type { Response } from 'express'

import type { UncaughtExceptionResponse } from 'src/types'

class UncaughtExceptionFilter implements ExceptionFilter<unknown> {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse<Response>()

    let code = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'unknown error'
    let stack = undefined

    if (exception instanceof HttpException) {
      code = exception.getStatus()
    }

    if (exception instanceof Error) {
      message = exception.message

      if (exception.stack) {
        stack = ErrorStackParser.parse(exception)
      }
    }

    resp.status(code).json({
      code,
      message,
      stack,
    } as UncaughtExceptionResponse)
  }
}

export { UncaughtExceptionFilter }
