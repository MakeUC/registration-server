import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swipe } from '../swipe.entity';
import { NotificationService } from '../notification/notification.service';
import { MatchDTO } from './match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Swipe) private matches: Repository<Swipe>,
    private notificationService: NotificationService
  ) {}

  private async checkMatch(from: string, to: string): Promise<void> {
    const otherWayMatch = await this.matches.findOne({ from: to, to: from, like: true });

    if(!otherWayMatch) {
      Logger.log(`other way match not found`);
      return;
    }
    Logger.log(`other way match found, creating notification`);

    this.notificationService.createNotificationForBoth(from, to);
  }

  async swipe(match: MatchDTO): Promise<Swipe> {
    const existing = await this.matches.findOne({ from: match.from, to: match.to });
    if(existing) {
      Logger.error(`${match.from} already swiped on ${match.to}`);
      throw new HttpException(`Already swiped`, HttpStatus.BAD_REQUEST);
    }

    Logger.log(`${match.from} swiping on ${match.to}`);
    const newMatch = this.matches.create(match);
    const savedMatch = await this.matches.save(newMatch);

    if(savedMatch.like) {
      Logger.log(`swipe positive, checking other way`);
      console.log({ savedMatch });
      this.checkMatch(savedMatch.from, savedMatch.to);
    }

    return savedMatch;
  }

  async reset(from: string): Promise<void> {
    const matches = await this.matches.find({ from, like: false });
    await this.matches.remove(matches);

    return;
  }
}
