import { Inject, Injectable } from '@nestjs/common'

import { API_CODE_DESCRIPTION_METADATA_KEY, ApiCodeDescriptionMetadata } from 'src/decorators'

import { API_CODES_PROVIDER_KEY } from './api-codes.provider'

type ApiCodesDescriptor = Record<number, string>

@Injectable()
export class ApiCodesService {
  private apiCodesDescriptor: ApiCodesDescriptor

  constructor(
    @Inject(API_CODES_PROVIDER_KEY)
    private apiCodeProvider: Record<string, number>,
  ) {
    this.apiCodesDescriptor = this.generateApiCodesDescriptor()
  }

  private generateApiCodesDescriptor(): ApiCodesDescriptor {
    const apiCodesDescriptor: ApiCodesDescriptor = {}

    // 遍历 apiCodeProvider 的所有静态属性 获取其对应的 metadata
    for (const propertyKey in this.apiCodeProvider) {
      // 取出 propertyKey 对应的 metadataKeys
      const metadata: ApiCodeDescriptionMetadata | undefined = Reflect.getMetadata(
        API_CODE_DESCRIPTION_METADATA_KEY,
        this.apiCodeProvider,
        propertyKey,
      )

      if (metadata) {
        const { apiCode, description } = metadata
        apiCodesDescriptor[apiCode] = description
      }
    }

    return apiCodesDescriptor
  }

  findAll() {
    return this.apiCodesDescriptor
  }

  findOne(apiCode: number) {
    return this.apiCodesDescriptor[apiCode]
  }
}
