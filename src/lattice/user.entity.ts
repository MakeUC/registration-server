import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert } from 'typeorm';
import { hash, compare } from 'bcrypt';
import {
  IsDefined, IsEmail, IsMongoId,
  IsArray, ArrayMaxSize, ArrayUnique,
  IsString, MaxLength, IsBoolean
} from 'class-validator';

export type Tour = `profile` | `home` | `notification` | `reset`;

@Entity({ name: `user` })
export class User {
  @ObjectIdColumn()
  @IsMongoId()
  id: ObjectID;

  @Column()
  @IsDefined()
  @IsString()
  registrantId: string;

  @Column()
  @IsDefined()
  @IsEmail()
  email: string;

  @Column()
  @IsDefined()
  password: string

  @Column()
  @IsDefined()
  name: string;

  @Column()
  @IsDefined()
  @IsArray()
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsMongoId({ each: true })
  skills: string[]

  @Column()
  @IsDefined()
  @IsString()
  @MaxLength(250)
  idea: string

  @Column()
  @IsDefined()
  @IsArray()
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsMongoId({ each: true })
  lookingFor: string[]

  @Column()
  @IsDefined()
  @IsString()
  slack: string

  @Column({ default: false })
  @IsBoolean()
  started: boolean

  @Column({ default: false })
  @IsBoolean()
  completed: boolean

  @Column({ default: false })
  @IsBoolean()
  visible: boolean

  @Column({ default: [] })
  @IsArray()
  completedTours: Tour[]

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return compare(attempt, this.password);
  }
}
