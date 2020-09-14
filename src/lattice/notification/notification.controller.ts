import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { User } from '../user.entity';
import { NotificationService } from './notification.service';
import { NotificationDetailsDTO } from './notification-details.dto';
import { PushSubscription } from './push-subscription.dto';

@Controller(`notification`)
@UseGuards(AuthGuard(`jwt`))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@CurrentUser() user: CurrentUserDTO): Promise<Array<NotificationDetailsDTO>> {
    return this.notificationService.getNotifications(user.id);
  }

  @Post(`/read`)
  readNotifications(@CurrentUser() user: CurrentUserDTO): Promise<void> {
    return this.notificationService.readNotifications(user.id);
  }

  @Post(`/subscribe`)
  createSubscription(@CurrentUser() user: CurrentUserDTO, @Body() sub: PushSubscription): Promise<User> {
    return this.notificationService.createSubscription(user.id, sub);
  }
}
