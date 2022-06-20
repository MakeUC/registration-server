import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsEmail } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity({ name: `registrant` })
export class Registrant {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsDefined()
  fullName: string;

  @Column({ unique: true })
  @IsDefined()
  @IsEmail()
  email: string;

  @Column()
  phone: string;
  
  @Column()
  @IsDefined()
  school: string;
  
  @Column()
  @IsDefined()
  country: string;

  @Column()
  @IsDefined()
  degree: string;

  @Column()
  @IsDefined()
  major: string;

  @Column()
  @IsDefined()
  graduation: number;

  @Column()
  @IsDefined()
  hackathonsAttended: string;

  @Column()
  resumeUrl: string;

  @Column()
  @IsDefined()
  ethnicity: string;
  
  @Column()
  @IsDefined()
  age: number;
  
  @Column()
  @IsDefined()
  gender: string;

  @Column()
  questions: string;

  @Column()
  isVerified: boolean | null

  @Column()
  registeredAt: Date

  @Column()
  verifiedAt: Date

  @Column()
  isCheckedIn: boolean

  @Column()
  checkedInAt: Date
}
