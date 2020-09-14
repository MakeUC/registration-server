import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { setVapidDetails, sendNotification } from 'web-push';
import { Notification } from '../notification.entity';
import { User } from '../user.entity';
import { NotificationDetailsDTO } from './notification-details.dto';
import { PushSubscription } from './push-subscription.dto';

const publicKey = process.env.LATTICE_PUSH_PUBLIC_KEY;
const privateKey = process.env.LATTICE_PUSH_PRIVATE_KEY;

setVapidDetails(`https://makeuc.io`, publicKey, privateKey);

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Notification) private notifications: Repository<Notification>,
  ) {}

  private async createNotification(from: User, to: User): Promise<Notification> {
    from.pushSubscriptions?.forEach(async sub => {
      try {
        Logger.log(`Sending match notification to ${from.email}`);
        await this.sendPushNotification(sub, `You were matched with ${to.name}`);
        Logger.log(`Sent match notification to ${from.email}`);
      } catch(err) {
        Logger.error(`Could not push notification: ${err.message}`);
      }
    });

    const notification = this.notifications.create({
      from: from.id.toString(),
      to: to.id.toString(),
      read: false
    });
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

  private async sendPushNotification(sub: PushSubscription, data: string): Promise<unknown> {
    return sendNotification(sub, data);
  };

  async createNotificationForBoth(a: string, b: string): Promise<[Notification, Notification]> {
    const userA = await this.users.findOne(a);
    const userB = await this.users.findOne(b);

    return [
      await this.createNotification(userA, userB),
      await this.createNotification(userB, userA)
    ];
  }

  async getNotifications(from: string): Promise<Array<NotificationDetailsDTO>> {
    const notifications = await this.notifications.find({ from });
    return Promise.all(
      notifications.map(notification => this.hydrateNotification(notification))
    );
  }

  async readNotifications(from: string): Promise<void> {
    const notifications = await this.notifications.find({ from, read: false });
    await this.notifications.save(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  }

  async createSubscription(userId: string, sub: PushSubscription): Promise<User> {
    const user = await this.users.findOne(userId);

    if(!user.pushSubscriptions) user.pushSubscriptions = [];
    user.pushSubscriptions.push(sub);
    
    return this.users.save(user);
  }
}
