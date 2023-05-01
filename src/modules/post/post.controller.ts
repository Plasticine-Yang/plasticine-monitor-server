import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { CreatePostDto } from './dto/create-post.dto'
import { QueryPostsDto } from './dto/query-posts.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }

  @Get()
  findAll(
    @Query('id', new DefaultValuePipe(-1), ParseIntPipe) id: number,
    @Query('title', new DefaultValuePipe('')) title: string,
    @Query('content', new DefaultValuePipe('')) content: string,
    @Query('published', new DefaultValuePipe(undefined))
    published?: boolean,
  ) {
    const queryPostsDto: QueryPostsDto = {
      id: id === -1 ? undefined : id,
      title: title === '' ? undefined : title,
      content: content === '' ? undefined : content,
      published: published ? Boolean(published) : undefined,
    }

    return this.postService.findAllBy(queryPostsDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }

  @Put(':id')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.postService.publish(id)
  }
}
