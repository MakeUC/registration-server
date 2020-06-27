import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegistrationService } from './registrant.service';
import { RegistrantDTO } from './registrant.dto';
import { Registrant } from './registrant.entity';

@Controller(`registrant`)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  register(@Body() newRegistrant: RegistrantDTO, @UploadedFile() resume: File): Promise<Registrant> {
    return this.registrationService.register(newRegistrant, resume);
  }

  @Get(`/verify/:id`)
  async verify(@Param(`id`) id: string): Promise<string> {
    await this.registrationService.verify(id);
    return `Thank you for confirming your email with MakeUC.`;
  }
}
