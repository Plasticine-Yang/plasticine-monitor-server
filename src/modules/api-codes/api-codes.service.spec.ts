import { Test } from '@nestjs/testing'

import { ApiCodeDescription } from 'src/decorators'

import { API_CODES_PROVIDER_KEY } from './api-codes.provider'
import { ApiCodesService } from './api-codes.service'

describe('ApiCodesService', () => {
  let service: ApiCodesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApiCodesService,
        {
          provide: API_CODES_PROVIDER_KEY,
          useValue: MOCK_API_CODES,
        },
      ],
    }).compile()

    service = module.get(ApiCodesService)
  })

  it('should find all api code', () => {
    const apiCodeDescription = service.findAll()

    expect(apiCodeDescription).toMatchInlineSnapshot(`
      {
        "0": "api 正常响应码",
        "1000": "实体不存在",
      }
    `)
  })

  it('should find api code description by api code', () => {
    const apiCodeDescription = service.findOne(0)
    expect(apiCodeDescription).toMatchInlineSnapshot('"api 正常响应码"')
  })
})

class MOCK_API_CODES {
  @ApiCodeDescription('api 正常响应码')
  static SUCCESS = 0

  @ApiCodeDescription('实体不存在')
  static ENTITY_NOT_EXIST = 1000
}
