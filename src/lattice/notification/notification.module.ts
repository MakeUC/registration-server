import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { User } from '../user.entity';
import { Notification } from '../notification.entity';
import { Subscription } from '../subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Notification, Subscription ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
