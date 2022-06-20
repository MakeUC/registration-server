import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert } from 'typeorm';
import { hash, compare } from 'bcrypt';
import {
  IsDefined, IsEmail,
  IsArray, ArrayMaxSize, ArrayUnique,
  IsString, IsBoolean, MaxLength
} from 'class-validator';

export type Tour = `profile` | `home` | `notification` | `reset`;

@Entity({ name: `user` })
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsDefined()
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
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsString({ each: true })
  skills?: string[]

  @Column()
  @IsDefined()
  @IsString()
  @MaxLength(250)
  idea: string

  @Column()
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  lookingFor?: string[]

  @Column()
  @IsDefined()
  @IsString()
  discord: string

  @Column({ default: false })
  @IsDefined()
  @IsBoolean()
  inPerson: boolean

  @Column({ default: false })
  started: boolean

  @Column({ default: false })
  completed: boolean

  @Column({ default: false })
  visible: boolean

  @Column({ default: [] })
  completedTours: Tour[]

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return compare(attempt, this.password);
  }
}
