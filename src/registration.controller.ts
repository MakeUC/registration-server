import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegistrationService } from './registrant.service';
import { RegistrantDTO } from './registrant.dto';
import { Registrant } from './registrant.entity';

@Controller()
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
}
