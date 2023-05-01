import { ApiCodeDescription } from './decorators'

export class API_CODE {
  @ApiCodeDescription('api 正常响应码')
  static SUCCESS = 0

  @ApiCodeDescription('实体不存在')
  static ENTITY_NOT_EXIST = 1000

  @ApiCodeDescription('实体已存在')
  static ENTITY_DUPLICATED = 1001
}
