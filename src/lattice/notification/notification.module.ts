import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { User } from '../user.entity';
import { Notification } from '../notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Notification ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
