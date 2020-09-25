import { Notification } from '../notification.entity';
import { User } from '../user.entity';

export class NotificationDetailsDTO {
  notification: Notification
  to: User
}