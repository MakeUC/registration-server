import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RegistrationService } from './registrant.service';
import { RegistrantDTO } from './registrant.dto';
import { Registrant } from './registrant.entity';

@Controller(`registrant`)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Get()
  fetchAll(): Promise<Registrant[]> {
    return this.registrationService.fetchAll();
  }

  @Post()
  register(@Body() newRegistrant: RegistrantDTO): Promise<Registrant> {
    return this.registrationService.register(newRegistrant);
  }

  @Get(`/verify/:id`)
  async verify(@Param(`id`) id: string): Promise<string> {
    await this.registrationService.verify(id);
    return `Thank you for confirming your email with MakeUC.`;
  }
}
