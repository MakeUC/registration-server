import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match.entity';
import { NotificationService } from '../notification/notification.service';
import { MatchDTO } from './match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matches: Repository<Match>,
    private notificationService: NotificationService
  ) {}

  private async checkMatch(from: string, to: string): Promise<void> {
    const otherWayMatch = await this.matches.findOne({ from: to, to: from, match: true });
    console.log({ otherWayMatch });
    
    if(!otherWayMatch) {
      Logger.log(`other way match not found`);
      return;
    }
    Logger.log(`other way match found, creating notification`);

    this.notificationService.createNotificationForBoth(from, to);
  }

  async swipe(match: MatchDTO): Promise<Match> {
    const existing = await this.matches.findOne({ from: match.from, to: match.to });
    if(existing) {
      Logger.error(`${match.from} already swiped on ${match.to}`);
      throw new HttpException(`Already swiped`, HttpStatus.BAD_REQUEST);
    }

    Logger.log(`${match.from} swiping on ${match.to}`);
    const newMatch = this.matches.create(match);
    const savedMatch = await this.matches.save(newMatch);

    if(savedMatch.match) {
      Logger.log(`swipe positive, checking other way`);
      console.log({ savedMatch });
      this.checkMatch(savedMatch.from, savedMatch.to);
    }

    return savedMatch;
  }

  async reset(from: string): Promise<void> {
    const matches = await this.matches.find({ from, match: false });
    await this.matches.remove(matches);

    return;
  }
}
