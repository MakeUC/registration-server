import { Controller, Post, Body, HttpService } from '@nestjs/common';
import { StatsService } from './stats.service';
import { SlashCommandDTO } from './slack-slash-command.dto';

@Controller(`stats`)
export class SlackController {
  constructor(private statsService: StatsService, private http: HttpService) {}

  @Post()
  register(@Body() command: SlashCommandDTO): Promise<void> {
    return this.statsService.getStat(command);
  }
}
