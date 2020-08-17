import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrant } from '../registration/registrant.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant ]),
    HttpModule
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsIntegrationModule {}
