/**
 * @description 用于获取 api code 描述信息的元数据 key
 */
const API_CODE_DESCRIPTION_METADATA_KEY = Symbol.for('apiCodeDescription')

interface ApiCodeDescriptionMetadata {
  apiCode: number
  description: string
}

/**
 * @description 为 api 响应码添加描述信息
 * @param description api 响应码描述信息
 * @returns 属性装饰器
 */
function ApiCodeDescription(description: string): PropertyDecorator {
  return (target, key) => {
    const apiCode: number = Reflect.get(target, key)

    Reflect.defineMetadata(
      API_CODE_DESCRIPTION_METADATA_KEY,
      {
        apiCode,
        description,
      } as ApiCodeDescriptionMetadata,
      target,
      key,
    )
  }
}

export type { ApiCodeDescriptionMetadata }
export { API_CODE_DESCRIPTION_METADATA_KEY, ApiCodeDescription }
