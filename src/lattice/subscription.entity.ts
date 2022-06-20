import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { PushSubscription } from './notification/push-subscription.dto';
import { ObjectID } from 'mongodb';

@Entity({ name: `subscription` })
export class Subscription {
  @ObjectIdColumn()
  @IsMongoId()
  id: ObjectID;

  @Column()
  @IsDefined()
  @IsString()
  userId: string;

  @Column()
  @IsDefined()
  @IsString()
  subscription: PushSubscription;
}