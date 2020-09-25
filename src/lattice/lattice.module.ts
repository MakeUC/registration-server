import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrant } from '../registration/registrant.entity';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';
import { User } from './user.entity';
import { Match } from './match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant, User, Match ]),
    AuthModule,
    MatchModule,
    ProfileModule,
    NotificationModule
  ],
  controllers: [],
  providers: [],
})
export class LatticeModule {}
