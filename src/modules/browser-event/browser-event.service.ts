import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { BusinessHttpException } from 'src/common/exceptions'
import { API_CODE } from 'src/constants'
import { Project } from '../project/entities/project.entity'
import { CreateBrowserEventDto } from './dto/create-browser-event.dto'
import { BaseEvent } from './entities/base-event.entity'
import { JSErrorEvent } from './entities/js-error-event'
import { JSErrorPayload } from './entities/js-error-event/helper'
import { PerformanceEvent } from './entities/performance-event'
import { PerformancePayload } from './entities/performance-event/helper'
import { UserBehaviorEvent } from './entities/user-behavior-event'
import { UserBehaviorPayload } from './entities/user-behavior-event/helper'
import { EventTypeEnum } from './enums'
import { generateJSErrorEventId } from './helper'
import { ObjectId } from 'mongodb'

@Injectable()
export class BrowserEventService {
  @InjectRepository(JSErrorEvent)
  private jsErrorEventRepository: MongoRepository<JSErrorEvent>

  @InjectRepository(PerformanceEvent)
  private performanceEventRepository: MongoRepository<PerformanceEvent>

  @InjectRepository(UserBehaviorEvent)
  private userBehaviorEventRepository: MongoRepository<UserBehaviorEvent>

  @InjectRepository(Project)
  private projectRepository: MongoRepository<Project>

  private createBaseEvent(createBrowserEventDto: CreateBrowserEventDto): BaseEvent {
    return {
      environmentInfo: createBrowserEventDto.environmentInfo,
    }
  }

  /**
   * 需要先根据 payload 计算 eventId，如果是同一个 error 则不入库，避免存储大量重复数据
   */
  private async createJSErrorEvent(createBrowserEventDto: CreateBrowserEventDto) {
    const baseEvent = this.createBaseEvent(createBrowserEventDto)

    const eventId = generateJSErrorEventId(createBrowserEventDto.payload as JSErrorPayload)

    const hasEvent =
      (await this.jsErrorEventRepository.count({
        eventId,
      })) > 0

    if (!hasEvent) {
      const jsErrorEvent: JSErrorEvent = {
        ...baseEvent,
        eventId: eventId,
        eventType: EventTypeEnum.JSError,
        payload: createBrowserEventDto.payload as JSErrorPayload,
      }

      await this.jsErrorEventRepository.save(jsErrorEvent)
    }
  }

  private async createPerformanceEvent(createBrowserEventDto: CreateBrowserEventDto) {
    const baseEvent = this.createBaseEvent(createBrowserEventDto)

    const performanceEvent: PerformanceEvent = {
      ...baseEvent,
      eventType: EventTypeEnum.Performance,
      payload: createBrowserEventDto.payload as PerformancePayload,
    }

    await this.performanceEventRepository.save(performanceEvent)
  }

  private async createUserBehaviorEvent(createBrowserEventDto: CreateBrowserEventDto) {
    const baseEvent = this.createBaseEvent(createBrowserEventDto)

    const userBehaviorEvent: UserBehaviorEvent = {
      ...baseEvent,
      eventType: EventTypeEnum.UserBehavior,
      payload: createBrowserEventDto.payload as UserBehaviorPayload[],
    }

    await this.userBehaviorEventRepository.save(userBehaviorEvent)
  }

  async create(createBrowserEventDto: CreateBrowserEventDto) {
    let projectExist = false
    const projectId = createBrowserEventDto.environmentInfo.projectId

    try {
      // 先查询 projectId 是否存在，只有存在的时候才允许入库
      const project = await this.projectRepository.findOneBy({
        _id: new ObjectId(projectId),
      })
      projectExist = project !== null
    } catch (error) {
      projectExist = false
    }

    if (projectExist) {
      switch (createBrowserEventDto.eventType) {
        case EventTypeEnum.JSError:
          this.createJSErrorEvent(createBrowserEventDto)
          break

        case EventTypeEnum.Performance:
          this.createPerformanceEvent(createBrowserEventDto)
          break

        case EventTypeEnum.UserBehavior:
          this.createUserBehaviorEvent(createBrowserEventDto)
          break

        default:
          break
      }
    } else {
      throw new BusinessHttpException(API_CODE.ENTITY_NOT_EXIST, `projectId: '${projectId}' 不存在，不允许上报事件`)
    }

    return null
  }
}
