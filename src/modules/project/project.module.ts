import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JSErrorEvent } from '../browser-event/entities/js-error-event'
import { PerformanceEvent } from '../browser-event/entities/performance-event'
import { UserBehaviorEvent } from '../browser-event/entities/user-behavior-event'
import { Project } from './entities/project.entity'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
  imports: [TypeOrmModule.forFeature([Project, JSErrorEvent, PerformanceEvent, UserBehaviorEvent])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
