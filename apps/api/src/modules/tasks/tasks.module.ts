import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EconomyModule } from '../economy/economy.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [EconomyModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
