import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch } from '@nestjs/common'
import type { Response } from 'express'

import type { BusinessExceptionResponse } from 'src/types'

import { BusinessHttpException } from '../exceptions'

/**
 * @description 业务异常过滤器
 */
@Catch(BusinessHttpException)
class BusinessHttpExceptionFilter implements ExceptionFilter<BusinessHttpException> {
  catch(exception: BusinessHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse<Response>()

    resp.status(exception.getStatus()).json({
      code: exception.code,
      message: exception.message,
    } as BusinessExceptionResponse)
  }
}

export { BusinessHttpExceptionFilter }
