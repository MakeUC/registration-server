import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrant } from '../registration/registrant.entity';
import { SlackController } from './slack.controller';
import { StatsService } from './stats.service';
import { SlackMessageService } from './slack-message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant ]),
    HttpModule
  ],
  controllers: [SlackController],
  providers: [
    StatsService,
    SlackMessageService
  ],
})
export class SlackModule {}
