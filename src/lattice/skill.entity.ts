import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsMongoId, IsUrl, IsString } from 'class-validator';

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