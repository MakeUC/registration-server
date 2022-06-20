import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { PushSubscription } from './notification/push-subscription.dto';

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