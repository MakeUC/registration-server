import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Registrant {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  school: string;

  @Column()
  degree: string;

  @Column()
  major: string;

  @Column()
  graduation: string;

  @Column()
  hackathonsAttended: number;

  @Column()
  resumeUrl: string;

  @Column()
  ethnicity: string;

  @Column()
  gender: string;

  @Column()
  questions: string;

  @Column()
  isVerified: boolean
}