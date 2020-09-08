import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchService } from './match.service';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { MatchDTO } from './match.dto';
import { Match } from '../match.entity';

@Controller(`match`)
@UseGuards(AuthGuard(`jwt`))
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  swipe(@CurrentUser() user: CurrentUserDTO, @Body() match: MatchDTO): Promise<Match> {
    return this.matchService.swipe({ ...match, from: user.id });
  }

  @Delete()
  reset(@CurrentUser() user: CurrentUserDTO): Promise<void> {
    return this.matchService.reset(user.id);
  }
}
