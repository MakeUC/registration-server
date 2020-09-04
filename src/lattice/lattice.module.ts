import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrant } from 'src/registration/registrant.entity';
import { User } from './user.entity';
import { Match } from './match.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant, User, Match ]),
    AuthModule,
    MatchModule,
    ProfileModule
  ],
  controllers: [],
  providers: [],
})
export class LatticeModule {}
