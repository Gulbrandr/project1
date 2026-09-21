import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EconomyModule } from '../economy/economy.module';
import { PacksService } from './packs.service';

@Module({
  imports: [EconomyModule],
  providers: [PacksService, PrismaService],
  exports: [PacksService],
})
export class PacksModule {}
