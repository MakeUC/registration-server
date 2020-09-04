import { Injectable } from '@nestjs/common';
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
    const newMatch = this.matches.create(match);
    return this.matches.save(newMatch);
  }

  async reset(from: string): Promise<void> {
    await this.matches.delete({ from, match: false });
  }
}
