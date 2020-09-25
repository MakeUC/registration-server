import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { setVapidDetails, sendNotification } from 'web-push';
import { Notification } from '../notification.entity';
import { User } from '../user.entity';
import { NotificationDetailsDTO } from './notification-details.dto';
import { PushSubscription } from './push-subscription.dto';
import { Subscription } from '../subscription.entity';

const publicKey = process.env.LATTICE_PUSH_PUBLIC_KEY;
const privateKey = process.env.LATTICE_PUSH_PRIVATE_KEY;

setVapidDetails(`https://makeuc.io`, publicKey, privateKey);

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Notification) private notifications: Repository<Notification>,
    @InjectRepository(Subscription) private subscriptions: Repository<Subscription>
  ) {}

  private async createNotification(from: User, to: User): Promise<Notification> {
    const pushSubscriptions = await this.subscriptions.find({ userId: from.id.toString() });

    pushSubscriptions?.forEach(async ps => {
      try {
        Logger.log(`Sending match notification to ${from.email}`);
        await this.sendPushNotification(ps.subscription, `You were matched with ${to.name}`);
        Logger.log(`Sent match notification to ${from.email}`);
      } catch(err) {
        Logger.error(`Could not push notification to ${from.email}: ${err.message}`);
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

  async subscribe(userId: string, subscription: PushSubscription): Promise<Subscription> {
    Logger.log(`Subscribing ${userId} for push notifications`);
    const pushSubscription = this.subscriptions.create({ userId, subscription });
    return this.subscriptions.save(pushSubscription);
  }

  async unsubscribe(userId: string, id: string): Promise<void> {
    Logger.log(`Unsubscribing ${userId}:${id} from push notifications`);

    const subscription = await this.subscriptions.findOne(id);
    if(subscription.userId !== userId) {
      throw new HttpException(`Invalid subscription id`, HttpStatus.NOT_FOUND);
    }

    await this.subscriptions.remove(subscription);
  }
}
