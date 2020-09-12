import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { NotificationService } from './notification.service';
import { NotificationDetailsDTO } from './notification-details.dto';

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
}
