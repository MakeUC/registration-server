import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../notification.entity';
import { User } from '../user.entity';
import { NotificationDetailsDTO } from './notification-details.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Notification) private notifications: Repository<Notification>,
  ) {}

  private async createNotification(from: string, to: string): Promise<Notification> {
    const notification = this.notifications.create({ from, to, read: false });
    return this.notifications.save(notification);
  }

  private async hydrateNotification(notification: Notification): Promise<NotificationDetailsDTO> {
    const to = await this.users.findOne(notification.to, { select: [
      `email`,
      `name`,
      `skills`,
      `idea`,
      `lookingFor`,
      `slack`,
      `started`,
      `completed`,
      `visible`
    ]});
    return { notification, to };
  }

  async createNotificationForBoth(a: string, b: string): Promise<[Notification, Notification]> {
    return [
      await this.createNotification(a, b),
      await this.createNotification(b, a)
    ];
  }

  async getNotifications(from: string): Promise<Array<NotificationDetailsDTO>> {
    const notifications = await this.notifications.find({ from });
    return Promise.all(
      notifications.map(notification => this.hydrateNotification(notification))
    );
  }

  async getNotificationDetails(from: string, id: string): Promise<NotificationDetailsDTO> {
    const notification = await this.notifications.findOne({ id, from });
    return this.hydrateNotification(notification);
  }

  async readNotifications(from: string): Promise<void> {
    const notifications = await this.notifications.find({ from, read: false });
    await this.notifications.save(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  }
}
