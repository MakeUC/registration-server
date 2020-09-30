import { Controller, Post, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { StatsService } from './stats.service';
import { getAdapter } from './service-adapter';

@Controller(`stats`)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Post()
  register(@Req() req: Request): string | number | Promise<string | number> {
    const service = req.query.service as string;
    const adapter = getAdapter(service);

    if(!adapter) {
      Logger.error(`Invalid service string`);
      throw new HttpException(`Invalid service string`, HttpStatus.UNAUTHORIZED);
    }

    if(!adapter.authenticateRequest(req)) {
      Logger.error(`Verification failed`);
      throw new HttpException(`Verification failed`, HttpStatus.FORBIDDEN);
    }

    const statCommand = adapter.parseRequest(req);

    if(statCommand === `help`) {
      return adapter.helpText;
    }

    return this.statsService.getStat(statCommand, adapter.returnOnlyNumber);
  }
}
