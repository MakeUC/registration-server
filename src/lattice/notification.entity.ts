import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsMongoId, IsBoolean, IsString } from 'class-validator';

@Entity({ name: `notification` })
export class Notification {
  @ObjectIdColumn()
  @IsMongoId()
  id: ObjectID;

  @Column()
  @IsDefined()
  @IsString()
  from: string;

  @Column()
  @IsDefined()
  @IsString()
  to: string;

  @Column()
  @IsDefined()
  @IsBoolean()
  read: boolean
}