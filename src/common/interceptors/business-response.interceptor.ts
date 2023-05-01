import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { API_CODE } from 'src/constants'
import type { BusinessResponse } from 'src/types'

/**
 * @description 业务统一响应体拦截器
 */
class BusinessResponseInterceptor<T> implements NestInterceptor<T, BusinessResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<BusinessResponse<T>> {
    return next.handle().pipe<BusinessResponse<T>>(
      map((data) => ({
        code: API_CODE.SUCCESS,
        message: 'success',
        data,
      })),
    )
  }
}

export { BusinessResponseInterceptor }
