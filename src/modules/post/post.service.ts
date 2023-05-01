import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Like, Repository } from 'typeorm'

import { BusinessHttpException } from 'src/common/exceptions'
import { API_CODE } from 'src/constants'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './entities/post.entity'

@Injectable()
export class PostService {
  @InjectRepository(Post)
  private postRepository: Repository<Post>

  async create(createPostDto: CreatePostDto) {
    const { title } = createPostDto

    const post = await this.postRepository.findOneBy({
      title,
    })

    if (post) {
      throw new BusinessHttpException(API_CODE.ENTITY_DUPLICATED, `标题为: '${title}' 的文章已存在，请勿重复创建`)
    }

    this.postRepository.save(createPostDto)
    return null
  }

  async findAllBy(where?: FindOptionsWhere<Post>) {
    let posts: Post[]

    if (where) {
      posts = await this.postRepository.findBy({
        ...where,
        title: where.title ? Like(`%${where.title}%`) : undefined,
        content: where.content ? Like(`%${where.content}%`) : undefined,
      })
    } else {
      posts = await this.postRepository.find()
    }

    return posts
  }

  findOne(id: number) {
    try {
      return this.postRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new BusinessHttpException(API_CODE.ENTITY_NOT_EXIST, `文章不存在 -- ${error}`, {
        httpStatusCode: HttpStatus.BAD_REQUEST,
      })
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id)
    this.postRepository.update(id, updatePostDto)
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    this.postRepository.remove(post)
  }

  async publish(id: number) {
    const post = await this.findOne(id)
    post.published = true

    this.postRepository.save(post)
  }
}
