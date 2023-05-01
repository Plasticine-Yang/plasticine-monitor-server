import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class QueryPostsDto {
  @IsOptional()
  @IsNumber()
  id?: number

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsBoolean()
  published?: boolean
}
