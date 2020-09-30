import { Controller, UseGuards, Post } from '@nestjs/common';
import { RegistrationService } from './registrant.service';
import { AdminGuard } from './admin.guard';

@Controller(`admin`)
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post(`/secondVerification`)
  async sendSecondVerification(): Promise<void> {
    return this.registrationService.sendSecondVerification();
  }

}
