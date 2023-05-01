import { PartialType } from '@nestjs/mapped-types'

import { IsBoolean, IsString } from 'class-validator'

import { CreatePostDto } from './create-post.dto'

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  title?: string

  @IsString()
  content?: string

  @IsBoolean()
  published?: boolean
}
