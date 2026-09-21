import { Module } from '@nestjs/common';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battle.service';

@Module({
  providers: [BattleService, BattleGateway],
  exports: [BattleService],
})
export class BattleModule {}
