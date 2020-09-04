import { Controller, Get } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller()
export class MatchController {
  constructor(private readonly appService: MatchService) {}

  @Get()
  getHello(): string {
    return `works`;
  }
}
