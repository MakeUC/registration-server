import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ScoreService } from './score.service';
import { User } from '../user.entity';
import { Swipe } from '../swipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Swipe ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ScoreService],
})
export class ProfileModule {}
