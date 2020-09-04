import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ScoreService } from './score.service';
import { User } from '../user.entity';
import { Match } from '../match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Match ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ScoreService],
})
export class ProfileModule {}
