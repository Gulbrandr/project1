import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EconomyService } from './economy.service';

@Module({
  providers: [EconomyService, PrismaService],
  exports: [EconomyService],
})
export class EconomyModule {}
