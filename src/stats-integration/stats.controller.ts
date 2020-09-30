import { Controller, Post, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { StatsService } from './stats.service';
import { getAdapter } from './service-adapter';
import { RegistrationService } from 'src/registration/registrant.service';

const slackAdmins = process.env.SLACK_ADMINS.split(`,`);

@Controller(`stats`)
export class StatsController {
  constructor(
    private statsService: StatsService,
    private regService: RegistrationService
  ) {}

  @Post()
  async register(@Req() req: Request): Promise<string | number> {
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

    if(statCommand.includes(`verify`)) {
      const allowed = adapter.authenticateUser(req, slackAdmins);
      if(!allowed) {
        throw new HttpException(`You cannot perform this operation`, HttpStatus.UNAUTHORIZED);
      }

      if(statCommand.includes(`verify`)) {
        const allowed = adapter.authenticateUser(req, slackAdmins);
        if(!allowed) {
          throw new HttpException(`You cannot perform this operation`, HttpStatus.UNAUTHORIZED);
        }
        const [, email] = statCommand.split(` `);
        const registrant = await this.regService.verifyByEmail(email);
        return `${registrant.fullName} (${registrant.email}) has been verified.`;
      }
      
      return this.statsService.getStat(statCommand);
  }
}
