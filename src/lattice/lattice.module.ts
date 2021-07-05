import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrant } from '../registration/registrant.entity';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';
import { SkillsModule } from './skills/skills.module';
import { User } from './user.entity';
import { Swipe } from './swipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant, User, Swipe ]),
    AuthModule,
    MatchModule,
    ProfileModule,
    NotificationModule,
    SkillsModule
  ],
  controllers: [],
  providers: [],
})
export class LatticeModule {}
