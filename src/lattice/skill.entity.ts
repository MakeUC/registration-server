import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsMongoId, IsUrl, IsString } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity({ name: `skill` })
export class Skill {
  @ObjectIdColumn()
  @IsMongoId()
  id: ObjectID;

  @Column()
  @IsDefined()
  @IsString()
  title: string;

  @Column()
  @IsDefined()
  @IsString()
  @IsUrl()
  icon: string;
}