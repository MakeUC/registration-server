import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from '../match.entity';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user.entity';
import { Notification } from '../notification.entity';
import { Subscription } from '../subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Match, User, Notification, Subscription ]),
  ],
  controllers: [MatchController],
  providers: [MatchService, NotificationService],
})
export class MatchModule {}
