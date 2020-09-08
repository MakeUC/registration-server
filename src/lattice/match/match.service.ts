import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match.entity';
import { MatchDTO } from './match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matches: Repository<Match>,
  ) {}

  async swipe(match: MatchDTO): Promise<Match> {
    const existing = await this.matches.findOne({ from: match.from, to: match.to });
    if(existing) {
      Logger.error(`${match.from} already swiped on ${match.to}`);
      throw new HttpException(`Already swiped`, HttpStatus.BAD_REQUEST);
    }

    Logger.log(`${match.from} swiping on ${match.to}`);
    const newMatch = this.matches.create(match);
    return this.matches.save(newMatch);
  }

  async reset(from: string): Promise<void> {
    await this.matches.delete({ from, match: false });
  }
}
