import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EconomyModule } from './modules/economy/economy.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PacksModule } from './modules/packs/packs.module';
import { BattleModule } from './modules/battle/battle.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [EconomyModule, TasksModule, PacksModule, BattleModule, ContentModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
