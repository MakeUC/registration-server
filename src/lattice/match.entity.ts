import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsEmail, IsMongoId, IsBoolean } from 'class-validator';

@Entity({ name: `match` })
export class Match {
  @ObjectIdColumn()
  @IsMongoId()
  id: ObjectID;

  @ObjectIdColumn()
  @IsDefined()
  @IsMongoId()
  from: ObjectID;
  
  @ObjectIdColumn()
  @IsDefined()
  @IsMongoId()
  to: ObjectID;

  @Column()
  @IsDefined()
  @IsBoolean()
  match: boolean
}