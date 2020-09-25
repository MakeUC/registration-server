import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsDefined, IsEmail } from 'class-validator';

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
  gender: string;

  @Column()
  questions: string;

  @Column()
  isVerified: boolean

  @Column()
  registeredAt: Date

  @Column()
  verifiedAt: Date
}