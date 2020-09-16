import { Controller, Get, UseGuards, Post, Body, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { NotificationService } from './notification.service';
import { NotificationDetailsDTO } from './notification-details.dto';
import { PushSubscription } from './push-subscription.dto';
import { Subscription } from '../subscription.entity';

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
  subscribe(@CurrentUser() user: CurrentUserDTO, @Body() sub: PushSubscription): Promise<Subscription> {
    return this.notificationService.subscribe(user.id, sub);
  }

  @Delete(`/subscribe/:id`)
  unsubscribe(@CurrentUser() user: CurrentUserDTO, @Param(`id`) id: string): Promise<void> {
    return this.notificationService.unsubscribe(user.id, id);
  }
}
