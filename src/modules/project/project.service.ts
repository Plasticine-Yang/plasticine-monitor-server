import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { MongoRepository } from 'typeorm'

import { JSErrorEvent } from '../browser-event/entities/js-error-event'
import { PerformanceEvent } from '../browser-event/entities/performance-event'
import { UserBehaviorEvent } from '../browser-event/entities/user-behavior-event'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectService {
  @InjectRepository(Project)
  private projectRepository: MongoRepository<Project>

  @InjectRepository(JSErrorEvent)
  private jsErrorEventRepository: MongoRepository<JSErrorEvent>

  @InjectRepository(PerformanceEvent)
  private performanceEventRepository: MongoRepository<PerformanceEvent>

  @InjectRepository(UserBehaviorEvent)
  private userBehaviorEventRepository: MongoRepository<UserBehaviorEvent>

  private deleteRelatedEventByProjectId(id: string) {
    return Promise.all([
      // JSErrorEvent
      this.jsErrorEventRepository.deleteMany({
        'environmentInfo.projectId': {
          $eq: id,
        },
      }),

      // PerformanceEvent
      this.performanceEventRepository.deleteMany({
        'environmentInfo.projectId': {
          $eq: id,
        },
      }),

      // UserBehaviorEvent
      this.userBehaviorEventRepository.deleteMany({
        'environmentInfo.projectId': {
          $eq: id,
        },
      }),
    ])
  }

  create(createProjectDto: CreateProjectDto) {
    return this.projectRepository.save(createProjectDto)
  }

  findAll() {
    return this.projectRepository.find()
  }

  findOne(id: string) {
    return this.projectRepository.findOneBy({
      _id: new ObjectId(id),
    })
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectRepository.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateProjectDto.name,
        },
      },
    )
  }

  /** 将此项目 id 关联的所有事件删除 */
  remove(id: string) {
    this.deleteRelatedEventByProjectId(id)

    return this.projectRepository.deleteOne({ _id: new ObjectId(id) })
  }

  async batchRemove(ids: string[]) {
    for (const id of ids) {
      this.deleteRelatedEventByProjectId(id)
    }

    const objectIds = ids.map((id) => new ObjectId(id))
    return this.projectRepository.deleteMany({
      _id: {
        $in: objectIds,
      },
    })
  }
}
